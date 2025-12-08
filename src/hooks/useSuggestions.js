import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../services/supabase'

const POLLING_INTERVAL = 5 * 60 * 1000
const CACHE_KEY = 'ponia_suggestions_cache'
const SESSION_POPUP_KEY = 'ponia_session_popup_shown'
const POPUP_COOLDOWN_KEY = 'ponia_popup_last_shown'
const POPUP_COOLDOWN_MS = 2 * 60 * 60 * 1000

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [hasCritical, setHasCritical] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupSuggestions, setPopupSuggestions] = useState([])
  const pollingRef = useRef(null)
  const hasShownSessionPopup = useRef(false)

  const getAuthHeaders = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return null
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    }
  }, [])

  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { suggestions: cachedSuggestions, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < POLLING_INTERVAL) {
          setSuggestions(cachedSuggestions)
          const unread = cachedSuggestions.filter(s => s.status === 'pending')
          setUnreadCount(unread.length)
          setHasCritical(unread.some(s => s.priority === 'critical'))
          return true
        }
      }
    } catch (e) {
      console.error('Cache read error:', e)
    }
    return false
  }, [])

  const saveToCache = useCallback((data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        suggestions: data,
        timestamp: Date.now()
      }))
    } catch (e) {
      console.error('Cache write error:', e)
    }
  }, [])

  const fetchSuggestions = useCallback(async (silent = false) => {
    try {
      const headers = await getAuthHeaders()
      if (!headers) return

      if (!silent) setLoading(true)
      
      const response = await fetch('/api/suggestions?limit=30', { headers })
      
      if (!response.ok) throw new Error('Erreur chargement suggestions')
      
      const data = await response.json()
      
      setSuggestions(data.suggestions || [])
      setUnreadCount(data.unreadCount || 0)
      setHasCritical(data.hasCritical || false)
      saveToCache(data.suggestions || [])
      setError(null)
    } catch (err) {
      console.error('Fetch suggestions error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, saveToCache])

  const shouldShowPopup = useCallback(() => {
    const lastShown = localStorage.getItem(POPUP_COOLDOWN_KEY)
    if (lastShown) {
      const elapsed = Date.now() - parseInt(lastShown, 10)
      if (elapsed < POPUP_COOLDOWN_MS) {
        return false
      }
    }
    return true
  }, [])

  const triggerPopup = useCallback((suggestionsList, force = false) => {
    if (!force && !shouldShowPopup()) return false
    
    const pendingSuggestions = suggestionsList.filter(s => s.status === 'pending')
    
    const critical = pendingSuggestions.filter(s => s.priority === 'critical')
    if (critical.length > 0) {
      setPopupSuggestions(critical.slice(0, 3))
      setShowPopup(true)
      localStorage.setItem(POPUP_COOLDOWN_KEY, Date.now().toString())
      return true
    }
    
    const important = pendingSuggestions.filter(s => s.priority === 'important')
    if (important.length > 0) {
      setPopupSuggestions(important.slice(0, 3))
      setShowPopup(true)
      localStorage.setItem(POPUP_COOLDOWN_KEY, Date.now().toString())
      return true
    }
    
    if (pendingSuggestions.length > 0 && force) {
      setPopupSuggestions(pendingSuggestions.slice(0, 3))
      setShowPopup(true)
      localStorage.setItem(POPUP_COOLDOWN_KEY, Date.now().toString())
      return true
    }
    
    return false
  }, [shouldShowPopup])

  const checkPopupStatus = useCallback(async () => {
    try {
      const headers = await getAuthHeaders()
      if (!headers) return

      const response = await fetch('/api/suggestions/popup-status', { headers })
      if (!response.ok) return

      const status = await response.json()
      
      if (status.show) {
        triggerPopup(suggestions, true)
      }
    } catch (err) {
      console.error('Check popup status error:', err)
    }
  }, [getAuthHeaders, suggestions, triggerPopup])

  const generateSuggestions = useCallback(async () => {
    try {
      const headers = await getAuthHeaders()
      if (!headers) return { success: false }

      const response = await fetch('/api/suggestions/generate', {
        method: 'POST',
        headers
      })
      
      if (!response.ok) throw new Error('Erreur génération')
      
      const result = await response.json()
      
      await fetchSuggestions(true)
      
      return result
    } catch (err) {
      console.error('Generate suggestions error:', err)
      return { success: false, error: err.message }
    }
  }, [getAuthHeaders, fetchSuggestions])

  const markViewed = useCallback(async (suggestionId) => {
    try {
      const headers = await getAuthHeaders()
      if (!headers) return

      await fetch(`/api/suggestions/${suggestionId}/view`, {
        method: 'POST',
        headers
      })

      setSuggestions(prev => prev.map(s => 
        s.id === suggestionId ? { ...s, status: 'viewed' } : s
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Mark viewed error:', err)
    }
  }, [getAuthHeaders])

  const dismiss = useCallback(async (suggestionId) => {
    try {
      const headers = await getAuthHeaders()
      if (!headers) return

      await fetch(`/api/suggestions/${suggestionId}/dismiss`, {
        method: 'POST',
        headers
      })

      setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
      setUnreadCount(prev => Math.max(0, prev - 1))
      setPopupSuggestions(prev => prev.filter(s => s.id !== suggestionId))
      
      if (popupSuggestions.length <= 1) {
        setShowPopup(false)
      }
    } catch (err) {
      console.error('Dismiss error:', err)
    }
  }, [getAuthHeaders, popupSuggestions.length])

  const act = useCallback(async (suggestionId, action = 'clicked') => {
    try {
      const headers = await getAuthHeaders()
      if (!headers) return

      await fetch(`/api/suggestions/${suggestionId}/act`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action })
      })

      setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
      setUnreadCount(prev => Math.max(0, prev - 1))
      setPopupSuggestions(prev => prev.filter(s => s.id !== suggestionId))
      
      if (popupSuggestions.length <= 1) {
        setShowPopup(false)
      }
    } catch (err) {
      console.error('Act error:', err)
    }
  }, [getAuthHeaders, popupSuggestions.length])

  const closePopup = useCallback(() => {
    setShowPopup(false)
    setPopupSuggestions([])
  }, [])

  const postponePopup = useCallback(() => {
    setShowPopup(false)
    setPopupSuggestions([])
  }, [])

  useEffect(() => {
    const init = async () => {
      loadFromCache()
      
      const response = await fetchSuggestions()
      
      await generateSuggestions()
    }
    
    init()

    pollingRef.current = setInterval(() => {
      fetchSuggestions(true)
    }, POLLING_INTERVAL)

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [])
  
  useEffect(() => {
    if (hasShownSessionPopup.current) return
    if (loading) return
    if (suggestions.length === 0) return
    
    const sessionKey = sessionStorage.getItem(SESSION_POPUP_KEY)
    if (sessionKey === 'true') {
      hasShownSessionPopup.current = true
      return
    }
    
    const pendingSuggestions = suggestions.filter(s => s.status === 'pending')
    if (pendingSuggestions.length > 0) {
      setTimeout(() => {
        const hasCriticalOrImportant = pendingSuggestions.some(
          s => s.priority === 'critical' || s.priority === 'important'
        )
        
        if (hasCriticalOrImportant) {
          triggerPopup(suggestions, true)
        } else if (pendingSuggestions.length >= 2) {
          triggerPopup(suggestions, true)
        }
        
        sessionStorage.setItem(SESSION_POPUP_KEY, 'true')
        hasShownSessionPopup.current = true
      }, 1500)
    }
  }, [suggestions, loading, triggerPopup])

  return {
    suggestions,
    unreadCount,
    hasCritical,
    loading,
    error,
    showPopup,
    popupSuggestions,
    fetchSuggestions,
    generateSuggestions,
    markViewed,
    dismiss,
    act,
    closePopup,
    postponePopup
  }
}
