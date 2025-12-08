import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../services/supabase'

const DataContext = createContext(null)

const CACHE_DURATION = 5 * 60 * 1000

export function DataProvider({ children }) {
  const [products, setProducts] = useState([])
  const [stockHistory, setStockHistory] = useState([])
  const [userData, setUserData] = useState(null)
  const [timeSavedStats, setTimeSavedStats] = useState(null)
  const [trialExpired, setTrialExpired] = useState(false)
  const [trialEndsAt, setTrialEndsAt] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const lastFetchRef = useRef({
    products: 0,
    stockHistory: 0,
    userData: 0,
    timeSaved: 0
  })

  const getAuthHeaders = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return null
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    }
  }, [])

  const loadFromLocalStorage = useCallback(() => {
    try {
      const cachedProducts = localStorage.getItem('ponia_cache_products')
      const cachedUserData = localStorage.getItem('ponia_cache_userData')
      const cachedTimeSaved = localStorage.getItem('ponia_cache_timeSaved')
      
      if (cachedProducts) {
        const { data, timestamp } = JSON.parse(cachedProducts)
        if (Date.now() - timestamp < CACHE_DURATION) {
          setProducts(data)
          lastFetchRef.current.products = timestamp
        }
      }
      
      if (cachedUserData) {
        const { data, timestamp } = JSON.parse(cachedUserData)
        if (Date.now() - timestamp < CACHE_DURATION) {
          setUserData(data)
          lastFetchRef.current.userData = timestamp
          
          if (data?.trialEndsAt) {
            setTrialEndsAt(data.trialEndsAt)
            const trialEnd = new Date(data.trialEndsAt)
            setTrialExpired(trialEnd <= new Date())
          }
        }
      }
      
      const cachedTrial = localStorage.getItem('ponia_cache_trial')
      if (cachedTrial) {
        const { expired, endsAt } = JSON.parse(cachedTrial)
        setTrialExpired(expired)
        setTrialEndsAt(endsAt)
      }
      
      if (cachedTimeSaved) {
        const { data, timestamp } = JSON.parse(cachedTimeSaved)
        if (Date.now() - timestamp < CACHE_DURATION) {
          setTimeSavedStats(data)
          lastFetchRef.current.timeSaved = timestamp
        }
      }
    } catch (e) {
      console.error('Cache load error:', e)
    }
  }, [])

  const saveToLocalStorage = useCallback((key, data) => {
    try {
      localStorage.setItem(`ponia_cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    } catch (e) {
      console.error('Cache save error:', e)
    }
  }, [])

  const fetchProducts = useCallback(async (force = false) => {
    const now = Date.now()
    if (!force && now - lastFetchRef.current.products < CACHE_DURATION && products.length > 0) {
      return products
    }

    try {
      const headers = await getAuthHeaders()
      if (!headers) return products

      const response = await fetch('/api/products', { headers })
      if (response.ok) {
        const data = await response.json()
        const newProducts = data.products || []
        setProducts(newProducts)
        lastFetchRef.current.products = now
        saveToLocalStorage('products', newProducts)
        return newProducts
      }
    } catch (error) {
      console.error('Fetch products error:', error)
    }
    return products
  }, [getAuthHeaders, products, saveToLocalStorage])

  const fetchStockHistory = useCallback(async (force = false) => {
    const now = Date.now()
    if (!force && now - lastFetchRef.current.stockHistory < CACHE_DURATION && stockHistory.length > 0) {
      return stockHistory
    }

    try {
      const headers = await getAuthHeaders()
      if (!headers) return stockHistory

      const response = await fetch('/api/stock-history', { headers })
      if (response.ok) {
        const data = await response.json()
        const newHistory = data.history || []
        setStockHistory(newHistory)
        lastFetchRef.current.stockHistory = now
        return newHistory
      }
    } catch (error) {
      console.error('Fetch stock history error:', error)
    }
    return stockHistory
  }, [getAuthHeaders, stockHistory])

  const fetchUserData = useCallback(async (force = false) => {
    const now = Date.now()
    if (!force && now - lastFetchRef.current.userData < CACHE_DURATION && userData) {
      return userData
    }

    try {
      const headers = await getAuthHeaders()
      if (!headers) return userData

      const response = await fetch('/api/users/me', { headers })
      if (response.ok) {
        const data = await response.json()
        setUserData(data.user)
        lastFetchRef.current.userData = now
        saveToLocalStorage('userData', data.user)
        
        if (data.user?.trialEndsAt) {
          const trialEnd = new Date(data.user.trialEndsAt)
          const expired = trialEnd <= new Date()
          setTrialEndsAt(data.user.trialEndsAt)
          setTrialExpired(expired)
          localStorage.setItem('ponia_cache_trial', JSON.stringify({
            expired,
            endsAt: data.user.trialEndsAt
          }))
        } else {
          setTrialExpired(false)
          setTrialEndsAt(null)
        }
        
        return data.user
      }
    } catch (error) {
      console.error('Fetch user data error:', error)
    }
    return userData
  }, [getAuthHeaders, userData, saveToLocalStorage])

  const fetchTimeSavedStats = useCallback(async (force = false) => {
    const now = Date.now()
    if (!force && now - lastFetchRef.current.timeSaved < CACHE_DURATION && timeSavedStats) {
      return timeSavedStats
    }

    try {
      const headers = await getAuthHeaders()
      if (!headers) return timeSavedStats

      const response = await fetch('/api/stats/time-saved', { headers })
      if (response.ok) {
        const data = await response.json()
        setTimeSavedStats(data)
        lastFetchRef.current.timeSaved = now
        saveToLocalStorage('timeSaved', data)
        return data
      }
    } catch (error) {
      console.error('Fetch time saved error:', error)
    }
    return timeSavedStats
  }, [getAuthHeaders, timeSavedStats, saveToLocalStorage])

  const refreshAll = useCallback(async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    
    try {
      await Promise.all([
        fetchProducts(true),
        fetchUserData(true),
        fetchTimeSavedStats(true)
      ])
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchProducts, fetchUserData, fetchTimeSavedStats, isRefreshing])

  const updateProduct = useCallback((productId, updates) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, ...updates } : p
    ))
  }, [])

  const addProduct = useCallback((product) => {
    setProducts(prev => [...prev, product])
  }, [])

  const removeProduct = useCallback((productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
  }, [])

  useEffect(() => {
    const init = async () => {
      loadFromLocalStorage()
      
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await Promise.all([
          fetchProducts(),
          fetchUserData(),
          fetchTimeSavedStats()
        ])
      }
      
      setIsInitialized(true)
    }
    
    init()
  }, [])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        refreshAll()
      } else if (event === 'SIGNED_OUT') {
        setProducts([])
        setStockHistory([])
        setUserData(null)
        setTimeSavedStats(null)
        setTrialExpired(false)
        setTrialEndsAt(null)
        localStorage.removeItem('ponia_cache_products')
        localStorage.removeItem('ponia_cache_userData')
        localStorage.removeItem('ponia_cache_timeSaved')
        localStorage.removeItem('ponia_cache_trial')
      }
    })

    return () => subscription.unsubscribe()
  }, [refreshAll])

  const value = {
    products,
    stockHistory,
    userData,
    timeSavedStats,
    trialExpired,
    trialEndsAt,
    isInitialized,
    isRefreshing,
    fetchProducts,
    fetchStockHistory,
    fetchUserData,
    fetchTimeSavedStats,
    refreshAll,
    updateProduct,
    addProduct,
    removeProduct
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
