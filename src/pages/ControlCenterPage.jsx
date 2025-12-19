import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radar, Filter, TrendingUp, AlertTriangle, Package, ChefHat, DollarSign, Truck, Shield, Leaf, Clock, CheckCircle, Eye, X, ChevronRight, Search, ArrowUpDown, ShoppingCart, FileText, BarChart3, Settings, ExternalLink, BellOff, CheckCheck } from 'lucide-react'
import { supabase } from '../services/supabase'
import Navigation from '../components/Navigation'
import TrialBanner from '../components/TrialBanner'
import { useLanguage } from '../contexts/LanguageContext'

const ACTION_TYPES = {
  expiry: { label: 'Voir stock', route: '/stock', icon: Package },
  rupture: { label: 'Commander', route: '/commandes', icon: ShoppingCart },
  surstock: { label: 'Voir stock', route: '/stock', icon: Package },
  stock_dormant: { label: 'Analyser', route: '/stock', icon: BarChart3 },
  rotation_lente: { label: 'Voir produit', route: '/stock', icon: Package },
  saisonnalite: { label: 'Planifier', route: '/commandes', icon: FileText },
  stock_optimal: { label: 'Ajuster', route: '/stock', icon: Settings },
  reappro_auto: { label: 'Commander', route: '/commandes', icon: ShoppingCart },
  erosion_marge: { label: 'Voir recette', route: '/recettes', icon: ChefHat },
  impact_rupture_recette: { label: 'Commander', route: '/commandes', icon: ShoppingCart },
  capacite_production: { label: 'Voir stock', route: '/stock', icon: Package },
  rentabilite_recette: { label: 'Voir recette', route: '/recettes', icon: ChefHat },
  optimisation_recette: { label: 'Optimiser', route: '/recettes', icon: ChefHat },
  cout_production: { label: 'Détails', route: '/recettes', icon: DollarSign },
  tendance: { label: 'Statistiques', route: '/dashboard', icon: TrendingUp },
  anomaly: { label: 'Analyser', route: '/dashboard', icon: BarChart3 },
  meteo: { label: 'Planifier', route: '/commandes', icon: FileText },
  produit_star: { label: 'Voir produit', route: '/stock', icon: TrendingUp },
  produit_declin: { label: 'Analyser', route: '/stock', icon: BarChart3 },
  effet_jour: { label: 'Planifier', route: '/commandes', icon: FileText },
  panier_moyen: { label: 'Statistiques', route: '/dashboard', icon: BarChart3 },
  cash_flow: { label: 'Voir stock', route: '/stock', icon: DollarSign },
  marge_categorie: { label: 'Analyser', route: '/stock', icon: BarChart3 },
  cout_cache: { label: 'Détails', route: '/stock', icon: DollarSign },
  economie_potentielle: { label: 'Commander', route: '/commandes', icon: ShoppingCart },
  roi_produit: { label: 'Analyser', route: '/stock', icon: BarChart3 },
  meilleur_prix: { label: 'Comparer', route: '/fournisseurs', icon: Truck },
  delai_optimal: { label: 'Commander', route: '/commandes', icon: ShoppingCart },
  qualite_prix: { label: 'Voir fournisseur', route: '/fournisseurs', icon: Truck },
  negociation: { label: 'Contacter', route: '/fournisseurs', icon: ExternalLink },
  diversification: { label: 'Voir fournisseurs', route: '/fournisseurs', icon: Truck },
  dlc_reglementaire: { label: 'Voir stock', route: '/stock', icon: Shield },
  tracabilite: { label: 'Vérifier', route: '/stock', icon: Shield },
  hygiene: { label: 'Contrôler', route: '/stock', icon: Shield },
  obligation_legale: { label: 'Détails', route: '/parametres', icon: Shield },
  gaspillage: { label: 'Voir périmés', route: '/stock', icon: Leaf },
  invendus: { label: 'Créer panier', route: '/stock', icon: ShoppingCart },
  circuit_court: { label: 'Voir fournisseurs', route: '/fournisseurs', icon: Leaf },
  empreinte_carbone: { label: 'Analyser', route: '/dashboard', icon: Leaf },
  temps_gagne: { label: 'Statistiques', route: '/dashboard', icon: Clock },
  efficacite: { label: 'Configurer', route: '/stock', icon: Settings },
  planification: { label: 'Planifier', route: '/commandes', icon: FileText },
  plat_jour: { label: 'Voir recettes', route: '/recettes', icon: ChefHat },
  rappel_commande: { label: 'Commander', route: '/commandes', icon: ShoppingCart }
}

const DOMAINS = {
  stock: { label: 'Stock', icon: Package, color: '#3B82F6' },
  recipes: { label: 'Recettes', icon: ChefHat, color: '#10B981' },
  sales: { label: 'Ventes', icon: TrendingUp, color: '#8B5CF6' },
  finance: { label: 'Finance', icon: DollarSign, color: '#F59E0B' },
  suppliers: { label: 'Fournisseurs', icon: Truck, color: '#EC4899' },
  compliance: { label: 'Conformité', icon: Shield, color: '#6366F1' },
  sustainability: { label: 'Durabilité', icon: Leaf, color: '#22C55E' },
  operations: { label: 'Opérations', icon: Clock, color: '#64748B' }
}

const SEVERITY_CONFIG = {
  critical: { label: 'Critique', color: '#DC2626', bg: '#FEE2E2' },
  high: { label: 'Important', color: '#F59E0B', bg: '#FEF3C7' },
  medium: { label: 'Conseil', color: '#3B82F6', bg: '#DBEAFE' },
  low: { label: 'Info', color: '#6B7280', bg: '#F3F4F6' }
}

export default function ControlCenterPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ domain: 'all', severity: 'all', status: 'unread' })
  const [sortBy, setSortBy] = useState('severity')
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, unread: 0, potentialSavings: 0 })

  useEffect(() => {
    loadSuggestions()
  }, [filter, sortBy])

  const loadSuggestions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const params = new URLSearchParams()
      if (filter.domain !== 'all') params.append('domain', filter.domain)
      if (filter.severity !== 'all') params.append('severity', filter.severity)
      if (filter.status !== 'all') params.append('status', filter.status)
      params.append('sort', sortBy)

      const response = await fetch(`/api/control-center/suggestions?${params}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
        setStats(data.stats || { total: 0, critical: 0, high: 0, unread: 0, potentialSavings: 0 })
      }
    } catch (error) {
      console.error('Erreur chargement suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (suggestionId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      await fetch(`/api/control-center/suggestions/${suggestionId}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      setSuggestions(prev => prev.map(s => 
        s.id === suggestionId ? { ...s, isRead: true } : s
      ))
      setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }))
    } catch (error) {
      console.error('Erreur marquage lu:', error)
    }
  }

  const dismissSuggestion = async (suggestionId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      await fetch(`/api/control-center/suggestions/${suggestionId}/dismiss`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
      setStats(prev => ({ ...prev, total: prev.total - 1 }))
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      await fetch('/api/control-center/suggestions/mark-all-read', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      setSuggestions(prev => prev.map(s => ({ ...s, isRead: true })))
      setStats(prev => ({ ...prev, unread: 0 }))
    } catch (error) {
      console.error('Erreur marquage tout lu:', error)
    }
  }

  const snoozeSuggestion = async (suggestionId, hours = 24) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      await fetch(`/api/control-center/suggestions/${suggestionId}/snooze`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hours })
      })

      setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
      setStats(prev => ({ ...prev, total: prev.total - 1, unread: Math.max(0, prev.unread - 1) }))
    } catch (error) {
      console.error('Erreur snooze suggestion:', error)
    }
  }

  const applySuggestion = async (suggestionId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      await fetch(`/api/control-center/suggestions/${suggestionId}/apply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
      setStats(prev => ({ ...prev, total: prev.total - 1, unread: Math.max(0, prev.unread - 1) }))
    } catch (error) {
      console.error('Erreur apply suggestion:', error)
    }
  }

  const handleQuickAction = async (suggestion) => {
    const actionConfig = ACTION_TYPES[suggestion.type] || { route: '/dashboard' }
    await applySuggestion(suggestion.id)
    navigate(actionConfig.route)
  }

  const filteredSuggestions = suggestions.filter(s => {
    if (!searchQuery) return true
    return s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.message?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const groupedByDomain = filteredSuggestions.reduce((acc, s) => {
    const domain = s.domain || 'stock'
    if (!acc[domain]) acc[domain] = []
    acc[domain].push(s)
    return acc
  }, {})

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', paddingBottom: '2rem' }}>
      <TrialBanner />
      <Navigation />
      
      <div className="container" style={{ padding: '1.5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: 'linear-gradient(135deg, #000 0%, #333 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Radar size={28} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700' }}>Tour de Contrôle IA</h1>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>
              {stats.unread} suggestion{stats.unread > 1 ? 's' : ''} non lue{stats.unread > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
          gap: '0.75rem', 
          marginBottom: '1.5rem' 
        }}>
          <div className="card" style={{ padding: '1rem', textAlign: 'center', borderLeft: '4px solid #DC2626' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#DC2626' }}>{stats.critical}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Critiques</div>
          </div>
          <div className="card" style={{ padding: '1rem', textAlign: 'center', borderLeft: '4px solid #F59E0B' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#F59E0B' }}>{stats.high}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Importants</div>
          </div>
          <div className="card" style={{ padding: '1rem', textAlign: 'center', borderLeft: '4px solid #3B82F6' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#3B82F6' }}>{stats.total}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Total</div>
          </div>
          <div className="card" style={{ padding: '1rem', textAlign: 'center', borderLeft: '4px solid #10B981' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10B981' }}>
              {stats.potentialSavings > 0 ? `${stats.potentialSavings}€` : '-'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Économies</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '150px' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <select
                value={filter.domain}
                onChange={(e) => setFilter({ ...filter, domain: e.target.value })}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Tous domaines</option>
                {Object.entries(DOMAINS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <select
                value={filter.severity}
                onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Toutes priorités</option>
                {Object.entries(SEVERITY_CONFIG).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Tous statuts</option>
                <option value="unread">Non lues</option>
                <option value="read">Lues</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="severity">Par priorité</option>
                <option value="date">Par date</option>
                <option value="impact">Par impact</option>
                <option value="domain">Par domaine</option>
              </select>
            </div>

            {stats.unread > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem'
                }}
              >
                <CheckCircle size={14} />
                Tout marquer lu
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid #E5E7EB',
              borderTopColor: '#000',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{ color: '#6B7280' }}>Analyse en cours...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filteredSuggestions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <CheckCircle size={48} style={{ color: '#10B981', margin: '0 auto 1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem' }}>Tout est sous contrôle !</h3>
            <p style={{ color: '#6B7280', margin: 0 }}>
              Aucune suggestion pour le moment. Votre commerce fonctionne parfaitement.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredSuggestions.map(suggestion => {
              const domain = DOMAINS[suggestion.domain] || DOMAINS.stock
              const severity = SEVERITY_CONFIG[suggestion.severity] || SEVERITY_CONFIG.medium
              const DomainIcon = domain.icon

              return (
                <div 
                  key={suggestion.id}
                  className="card"
                  style={{ 
                    padding: '1rem',
                    borderLeft: `4px solid ${severity.color}`,
                    opacity: suggestion.isRead ? 0.7 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: `${domain.color}15`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <DomainIcon size={20} color={domain.color} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h4 style={{ 
                          margin: 0, 
                          fontSize: '0.9375rem', 
                          fontWeight: suggestion.isRead ? '500' : '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          {!suggestion.isRead && (
                            <span style={{
                              width: '8px',
                              height: '8px',
                              background: severity.color,
                              borderRadius: '50%',
                              flexShrink: 0
                            }} />
                          )}
                          {suggestion.title}
                        </h4>
                        <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                          {!suggestion.isRead && (
                            <button
                              onClick={() => markAsRead(suggestion.id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                padding: '0.25rem',
                                cursor: 'pointer',
                                color: '#6B7280'
                              }}
                              title="Marquer comme lu"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => dismissSuggestion(suggestion.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: '0.25rem',
                              cursor: 'pointer',
                              color: '#6B7280'
                            }}
                            title="Ignorer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      <p style={{ 
                        margin: '0 0 0.5rem', 
                        fontSize: '0.8125rem', 
                        color: '#4B5563',
                        lineHeight: 1.4
                      }}>
                        {suggestion.message}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '0.125rem 0.5rem',
                          background: severity.bg,
                          color: severity.color,
                          borderRadius: '4px',
                          fontSize: '0.6875rem',
                          fontWeight: '600'
                        }}>
                          {severity.label}
                        </span>
                        <span style={{
                          padding: '0.125rem 0.5rem',
                          background: `${domain.color}15`,
                          color: domain.color,
                          borderRadius: '4px',
                          fontSize: '0.6875rem',
                          fontWeight: '500'
                        }}>
                          {domain.label}
                        </span>
                        {suggestion.impactValue && (
                          <span style={{
                            padding: '0.125rem 0.5rem',
                            background: '#ECFDF5',
                            color: '#059669',
                            borderRadius: '4px',
                            fontSize: '0.6875rem',
                            fontWeight: '500'
                          }}>
                            Impact: {suggestion.impactValue}€
                          </span>
                        )}
                        <span style={{ 
                          fontSize: '0.6875rem', 
                          color: '#9CA3AF',
                          marginLeft: 'auto'
                        }}>
                          {suggestion.createdAt ? new Date(suggestion.createdAt).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : ''}
                        </span>
                      </div>

                      {(() => {
                        const actionConfig = ACTION_TYPES[suggestion.type] || { label: 'Voir', route: '/dashboard', icon: ChevronRight }
                        const ActionIcon = actionConfig.icon
                        return (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => handleQuickAction(suggestion)}
                              style={{
                                padding: '0.5rem 0.75rem',
                                background: domain.color,
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.8125rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                transition: 'opacity 0.2s'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                            >
                              <CheckCheck size={14} />
                              Appliquer
                            </button>
                            <button
                              onClick={() => snoozeSuggestion(suggestion.id)}
                              style={{
                                padding: '0.5rem 0.75rem',
                                background: '#F3F4F6',
                                color: '#4B5563',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.8125rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                transition: 'background 0.2s'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#E5E7EB'}
                              onMouseOut={(e) => e.currentTarget.style.background = '#F3F4F6'}
                              title="Reporter de 24h"
                            >
                              <BellOff size={14} />
                              Snoozer
                            </button>
                            <button
                              onClick={() => {
                                markAsRead(suggestion.id)
                                navigate(actionConfig.route)
                              }}
                              style={{
                                padding: '0.5rem 0.75rem',
                                background: 'transparent',
                                color: domain.color,
                                border: `1px solid ${domain.color}`,
                                borderRadius: '6px',
                                fontSize: '0.8125rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                transition: 'background 0.2s'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = `${domain.color}10`}
                              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <ActionIcon size={14} />
                              {actionConfig.label}
                            </button>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
