import React, { useState } from 'react'
import { Crown, Gift, Check, AlertTriangle, Package, Trash2 } from 'lucide-react'

export default function DemoBlockerPage() {
  const [showProductSelection, setShowProductSelection] = useState(false)
  
  if (showProductSelection) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.92)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          background: '#FFFDF5',
          borderRadius: '20px',
          padding: '1.5rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
          border: '3px solid #FFD700'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <img 
              src="/ponia-logo-modal.png" 
              alt="PONIA" 
              style={{
                width: '140px',
                height: 'auto',
                marginBottom: '1rem'
              }}
            />
            
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Sélectionnez vos 10 produits à garder
            </h2>
            
            <p style={{
              fontSize: '0.9rem',
              color: '#6B7280',
              marginBottom: '0.5rem'
            }}>
              Le plan Basique est limité à 10 produits. 
              Les autres produits seront supprimés définitivement.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              padding: '0.75rem',
              background: '#FEF3C7',
              borderRadius: '10px',
              marginBottom: '0.5rem'
            }}>
              <span style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#92400E'
              }}>
                3 / 10 sélectionnés
              </span>
              <span style={{ fontSize: '0.85rem', color: '#92400E' }}>
                (7 restants)
              </span>
            </div>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            marginBottom: '1rem'
          }}>
            {['Farine T55', 'Beurre AOP', 'Levure fraîche', 'Sucre', 'Oeufs frais', 'Chocolat noir'].map((name, index) => {
              const isSelected = index < 3

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    background: isSelected ? '#FEF3C7' : '#fff',
                    borderBottom: index < 5 ? '1px solid #E5E7EB' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    border: isSelected ? '2px solid #F59E0B' : '2px solid #D1D5DB',
                    background: isSelected ? '#F59E0B' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isSelected && <Check size={16} style={{ color: '#fff' }} />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {name}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#6B7280'
                    }}>
                      Stock: {10 + index * 5} unités
                    </div>
                  </div>

                  {!isSelected && (
                    <Trash2 size={16} style={{ color: '#EF4444', flexShrink: 0 }} />
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setShowProductSelection(false)}
              style={{
                flex: 1,
                padding: '0.875rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#4B5563',
                background: '#F3F4F6',
                border: '1px solid #D1D5DB',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              Retour
            </button>
            <button
              style={{
                flex: 2,
                padding: '0.875rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                color: '#9CA3AF',
                background: '#E5E7EB',
                border: 'none',
                borderRadius: '10px',
                cursor: 'not-allowed'
              }}
            >
              Confirmer et continuer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.92)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '2rem 1rem',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#FFFDF5',
        borderRadius: '20px',
        padding: '2rem 1.5rem',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
        border: '3px solid #FFD700',
        margin: 'auto 0'
      }}>
        <img 
          src="/ponia-logo-modal.png" 
          alt="PONIA" 
          style={{
            width: '160px',
            height: 'auto',
            marginBottom: '1rem'
          }}
        />

        <div style={{
          background: 'linear-gradient(135deg, #FEE2E2, #FEF2F2)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          justifyContent: 'center'
        }}>
          <AlertTriangle size={24} style={{ color: '#DC2626' }} />
          <span style={{ 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            color: '#DC2626'
          }}>
            Votre essai gratuit de 14 jours est terminé
          </span>
        </div>

        <p style={{
          fontSize: '1rem',
          color: '#4B5563',
          lineHeight: '1.6',
          marginBottom: '1.5rem'
        }}>
          Pour continuer à utiliser PONIA, veuillez choisir une option ci-dessous.
          <strong> Cette fenêtre ne peut pas être fermée</strong> tant que vous n'avez pas fait un choix.
        </p>

        <div style={{
          background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)',
          border: '2px solid #FFD700',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            color: '#92400E', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Crown size={20} style={{ color: '#FFD700' }} />
            Passez à Standard ou Pro
          </div>
          
          <div style={{
            display: 'grid',
            gap: '0.5rem',
            textAlign: 'left',
            fontSize: '0.9rem',
            color: '#374151',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} style={{ color: '#10B981' }} />
              <span><strong>Standard (49€/mois)</strong> : 100 produits, IA illimitée, POS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} style={{ color: '#10B981' }} />
              <span><strong>Pro (69€/mois)</strong> : Produits illimités, commandes vocales</span>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#000',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
            }}
          >
            <Crown size={22} />
            Passer à un plan payant
          </button>
        </div>

        <div style={{
          background: '#F3F4F6',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            color: '#6B7280', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Gift size={18} />
            Ou continuer en Basique (Gratuit)
          </div>
          
          <div style={{
            fontSize: '0.85rem',
            color: '#9CA3AF',
            marginBottom: '1rem',
            lineHeight: '1.5'
          }}>
            <div>• Maximum 10 produits</div>
            <div>• 5 messages IA par jour</div>
            <div>• Pas d'intégrations POS</div>
            <div>• Alertes de base uniquement</div>
          </div>

          <div style={{
            background: '#FEF3C7',
            color: '#92400E',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            fontWeight: '500'
          }}>
            Vous avez 15 produits. Vous devrez en sélectionner 10 à garder.
          </div>

          <button
            onClick={() => setShowProductSelection(true)}
            style={{
              width: '100%',
              padding: '0.875rem 1.25rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#374151',
              background: '#fff',
              border: '2px solid #D1D5DB',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            Continuer en Basique (Gratuit)
          </button>
        </div>

        <p style={{
          fontSize: '0.75rem',
          color: '#9CA3AF',
          marginTop: '1.5rem',
          lineHeight: '1.4'
        }}>
          En choisissant une option, vous acceptez nos conditions d'utilisation.
          Vous pouvez changer de plan à tout moment depuis les paramètres.
        </p>
      </div>
    </div>
  )
}
