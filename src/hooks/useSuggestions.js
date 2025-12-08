import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../services/supabase'

const POLLING_INTERVAL = 5 * 60 * 1000
const CACHE_KEY = 'ponia_suggestions_cache'

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [hasCritical, setHasCritical] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupSuggestions, setPopupSuggestions] = useState([])
  const pollingRef = useRef(null)

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

  const checkPopupStatus = useCallback(async () => {
    try {
      const headers = await getAuthHeaders()
      if (!headers) return

      const response = await fetch('/api/suggestions/popup-status', { headers })
      if (!response.ok) return

      const status = await response.json()
      
      if (status.show) {
        const criticalAndImportant = suggestions.filter(
          s => s.status === 'pending' && (s.priority === 'critical' || s.priority === 'important')
        ).slice(0, 3)
        
        if (criticalAndImportant.length > 0) {
          setPopupSuggestions(criticalAndImportant)
          setShowPopup(true)
        }
      }
    } catch (err) {
      console.error('Check popup status error:', err)
    }
  }, [getAuthHeaders, suggestions])

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
      await fetchSuggestions()
      await generateSuggestions()
      
      setTimeout(() => {
        checkPopupStatus()
      }, 2000)
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
