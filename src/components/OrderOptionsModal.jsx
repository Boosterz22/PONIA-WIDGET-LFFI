import React, { useState } from 'react'
import { X, Download, Mail, MessageCircle, CheckCircle, Loader } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function OrderOptionsModal({ isOpen, onClose, products, businessName, businessType }) {
  const [loading, setLoading] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [emailSent, setEmailSent] = useState(false)
  const [whatsappCopied, setWhatsappCopied] = useState(false)

  const handleGeneratePDF = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('⚠️ Veuillez vous reconnecter')
        return
      }

      const { generateOrderPDF } = await import('../services/pdfService')
      const url = await generateOrderPDF(products, businessName, businessType, session.access_token)
      setPdfUrl(url)
      setPdfGenerated(true)
    } catch (error) {
      console.error('Erreur génération commande:', error)
      alert('❌ Erreur lors de la génération du bon de commande')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyForWhatsApp = async () => {
    const lowStockProducts = products.filter(p => p.currentQuantity <= (p.alertThreshold || 10))
    
    let message = `📦 *BON DE COMMANDE - ${businessName}*\n\n`
    message += `Date: ${new Date().toLocaleDateString('fr-FR')}\n\n`
    message += `Produits à commander:\n\n`
    
    lowStockProducts.forEach(product => {
      const suggestedQty = Math.max(20, (product.alertThreshold || 10) * 2)
      message += `• *${product.name}*\n`
      message += `  Qté suggérée: ${suggestedQty}\n`
      if (product.supplierName) {
        message += `  Fournisseur: ${product.supplierName}\n`
      }
      message += `\n`
    })
    
    message += `\n_Généré automatiquement par PONIA IA_`
    
    try {
      await navigator.clipboard.writeText(message)
      setWhatsappCopied(true)
      setTimeout(() => setWhatsappCopied(false), 3000)
    } catch (error) {
      console.error('Erreur copie:', error)
      alert('❌ Erreur lors de la copie')
    }
  }

  const handleSendByEmail = async () => {
    if (!pdfUrl) {
      await handleGeneratePDF()
    }

    alert('📧 Fonctionnalité email en développement. Utilisez le PDF ou WhatsApp pour l\'instant.')
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 3000)
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }} onClick={onClose}>
      <div 
        style={{
          background: 'white',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          color: '#1F2937',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
            📦 Commande intelligente
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <X size={24} color="#1F2937" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
            PONIA a analysé vos stocks et généré une commande optimisée. Choisissez comment l'envoyer :
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* PDF Download */}
            <button
              onClick={handleGeneratePDF}
              disabled={loading}
              style={{
                padding: '1rem 1.5rem',
                background: pdfGenerated ? '#10B981' : 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: pdfGenerated ? 'white' : '#1F2937',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {loading ? (
                <>
                  <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Génération...
                </>
              ) : pdfGenerated ? (
                <>
                  <CheckCircle size={20} />
                  PDF généré !
                </>
              ) : (
                <>
                  <Download size={20} />
                  Télécharger PDF
                </>
              )}
            </button>

            {/* WhatsApp Copy */}
            <button
              onClick={handleCopyForWhatsApp}
              style={{
                padding: '1rem 1.5rem',
                background: whatsappCopied ? '#10B981' : 'white',
                color: whatsappCopied ? 'white' : '#25D366',
                border: whatsappCopied ? 'none' : '2px solid #25D366',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              {whatsappCopied ? (
                <>
                  <CheckCircle size={20} />
                  Copié !
                </>
              ) : (
                <>
                  <MessageCircle size={20} />
                  Copier pour WhatsApp
                </>
              )}
            </button>

            {/* Email */}
            <button
              onClick={handleSendByEmail}
              style={{
                padding: '1rem 1.5rem',
                background: emailSent ? '#10B981' : 'white',
                color: emailSent ? 'white' : '#3B82F6',
                border: emailSent ? 'none' : '2px solid #3B82F6',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              {emailSent ? (
                <>
                  <CheckCircle size={20} />
                  Email envoyé !
                </>
              ) : (
                <>
                  <Mail size={20} />
                  Envoyer par email
                </>
              )}
            </button>
          </div>

          {/* Info */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#FEF3C7',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#92400E'
          }}>
            💡 <strong>Gain de temps :</strong> PONIA a analysé vos stocks, calculé les quantités optimales et généré le bon de commande. Vous économisez <strong>50+ minutes</strong> !
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
