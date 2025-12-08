import { useState } from 'react'
import { X, Bell, AlertTriangle, TrendingUp, Clock, ChefHat, Thermometer, Package, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import './SuggestionsDrawer.css'

const PRIORITY_CONFIG = {
  critical: {
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    icon: AlertTriangle,
    label: 'Urgent',
    sectionTitle: 'Actions urgentes'
  },
  important: {
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    icon: Bell,
    label: 'Important',
    sectionTitle: 'À traiter'
  },
  info: {
    color: '#22c55e',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    icon: TrendingUp,
    label: 'Conseil',
    sectionTitle: 'Conseils IA'
  }
}

const TYPE_ICONS = {
  expiry: Clock,
  rupture: Package,
  surstock: Package,
  meteo: Thermometer,
  anomaly: TrendingUp,
  plat_jour: ChefHat,
  rappel_commande: Bell,
  tendance: TrendingUp
}

const ACTION_LABELS = {
  view_product: 'Voir le produit',
  order: 'Commander',
  create_promo: 'Créer une promo',
  view_history: 'Voir l\'historique',
  generate_order: 'Générer commande'
}

export default function SuggestionsDrawer({ 
  isOpen, 
  onClose, 
  suggestions, 
  onDismiss, 
  onAct, 
  onView,
  loading
}) {
  const [collapsedSections, setCollapsedSections] = useState({})

  const toggleSection = (priority) => {
    setCollapsedSections(prev => ({
      ...prev,
      [priority]: !prev[priority]
    }))
  }

  const groupedSuggestions = {
    critical: suggestions.filter(s => s.priority === 'critical'),
    important: suggestions.filter(s => s.priority === 'important'),
    info: suggestions.filter(s => s.priority === 'info')
  }

  const handleAction = (suggestion) => {
    if (onView) onView(suggestion.id)
    if (onAct) onAct(suggestion.id, suggestion.actionType)
  }

  const handleDismiss = (e, suggestionId) => {
    e.stopPropagation()
    if (onDismiss) onDismiss(suggestionId)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'À l\'instant'
    if (diffHours < 24) return `Il y a ${diffHours}h`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const renderSection = (priority) => {
    const items = groupedSuggestions[priority]
    if (items.length === 0) return null

    const config = PRIORITY_CONFIG[priority]
    const isCollapsed = collapsedSections[priority]

    return (
      <div key={priority} className="drawer-section">
        <button 
          className="section-header"
          onClick={() => toggleSection(priority)}
          style={{ borderLeftColor: config.color }}
        >
          <div className="section-header-left">
            <config.icon size={18} style={{ color: config.color }} />
            <span className="section-title">{config.sectionTitle}</span>
            <span 
              className="section-count"
              style={{ backgroundColor: config.color }}
            >
              {items.length}
            </span>
          </div>
          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>

        {!isCollapsed && (
          <div className="section-content">
            {items.map(suggestion => {
              const TypeIcon = TYPE_ICONS[suggestion.type] || Bell
              const isUnread = suggestion.status === 'pending'

              return (
                <div 
                  key={suggestion.id}
                  className={`drawer-suggestion-card ${isUnread ? 'unread' : ''}`}
                  style={{ borderLeftColor: config.color }}
                  onClick={() => handleAction(suggestion)}
                >
                  <div className="card-header">
                    <div className="card-icon" style={{ backgroundColor: config.bgColor, color: config.color }}>
                      <TypeIcon size={16} />
                    </div>
                    <span className="card-time">{formatDate(suggestion.createdAt)}</span>
                    <button 
                      className="card-dismiss"
                      onClick={(e) => handleDismiss(e, suggestion.id)}
                      aria-label="Ignorer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <h4 className="card-title">{suggestion.title}</h4>
                  <p className="card-message">{suggestion.message}</p>
                  
                  {suggestion.actionType && (
                    <button className="card-action-btn">
                      <span>{ACTION_LABELS[suggestion.actionType] || 'Voir'}</span>
                      <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div 
        className={`drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <div className={`suggestions-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title">
            <Bell size={20} />
            <span>Suggestions IA</span>
          </div>
          <button className="drawer-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          {loading ? (
            <div className="drawer-loading">
              <div className="loading-spinner" />
              <p>Chargement...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="drawer-empty">
              <Bell size={48} strokeWidth={1} />
              <h3>Aucune suggestion</h3>
              <p>PONIA analyse vos stocks en continu. Les suggestions apparaîtront ici.</p>
            </div>
          ) : (
            <>
              {renderSection('critical')}
              {renderSection('important')}
              {renderSection('info')}
            </>
          )}
        </div>
      </div>
    </>
  )
}
