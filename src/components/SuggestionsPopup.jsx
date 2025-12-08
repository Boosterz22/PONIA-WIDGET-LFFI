import { X, AlertTriangle, TrendingUp, Clock, ChefHat, Thermometer, Package, Bell } from 'lucide-react'
import './SuggestionsPopup.css'

const PRIORITY_CONFIG = {
  critical: {
    color: '#dc2626',
    bgColor: '#fef2f2',
    icon: AlertTriangle,
    label: 'Urgent'
  },
  important: {
    color: '#f59e0b',
    bgColor: '#fffbeb',
    icon: Bell,
    label: 'Important'
  },
  info: {
    color: '#22c55e',
    bgColor: '#f0fdf4',
    icon: TrendingUp,
    label: 'Conseil'
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

export default function SuggestionsPopup({ 
  suggestions, 
  onClose, 
  onPostpone, 
  onDismiss, 
  onAct, 
  onView 
}) {
  if (!suggestions || suggestions.length === 0) return null

  const handleAction = (suggestion) => {
    if (onAct) onAct(suggestion.id, suggestion.actionType)
    if (onView) onView(suggestion.id)
  }

  const handleDismiss = (e, suggestionId) => {
    e.stopPropagation()
    if (onDismiss) onDismiss(suggestionId)
  }

  return (
    <div className="suggestions-popup-overlay" onClick={onClose}>
      <div className="suggestions-popup" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <div className="popup-title">
            <Bell size={20} />
            <span>PONIA a des suggestions pour vous</span>
          </div>
          <button className="popup-close" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>
        
        <div className="popup-content">
          {suggestions.map((suggestion) => {
            const priorityConfig = PRIORITY_CONFIG[suggestion.priority] || PRIORITY_CONFIG.info
            const TypeIcon = TYPE_ICONS[suggestion.type] || Bell
            const PriorityIcon = priorityConfig.icon
            
            return (
              <div 
                key={suggestion.id}
                className="popup-suggestion-card"
                style={{ 
                  borderLeftColor: priorityConfig.color,
                  backgroundColor: priorityConfig.bgColor
                }}
                onClick={() => handleAction(suggestion)}
              >
                <div className="suggestion-card-header">
                  <div className="suggestion-icon" style={{ color: priorityConfig.color }}>
                    <TypeIcon size={18} />
                  </div>
                  <div className="suggestion-priority-badge" style={{ 
                    backgroundColor: priorityConfig.color,
                    color: 'white'
                  }}>
                    {priorityConfig.label}
                  </div>
                  <button 
                    className="suggestion-dismiss-btn"
                    onClick={(e) => handleDismiss(e, suggestion.id)}
                    aria-label="Ignorer"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <h4 className="suggestion-title">{suggestion.title}</h4>
                <p className="suggestion-message">{suggestion.message}</p>
                
                {suggestion.actionType && (
                  <button className="suggestion-action-btn">
                    Voir les détails
                  </button>
                )}
              </div>
            )
          })}
        </div>
        
        <div className="popup-footer">
          <button className="popup-btn-secondary" onClick={onPostpone}>
            Plus tard
          </button>
          <button className="popup-btn-primary" onClick={onClose}>
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  )
}
