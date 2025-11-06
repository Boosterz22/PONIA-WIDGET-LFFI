import React, { useState, useEffect } from 'react'
import { Mic, MicOff, Check, X, Loader } from 'lucide-react'
import { parseVoiceCommandWithAI } from '../services/openaiService'

export default function VoiceInput({ productName, onConfirm, onCancel }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [parsedCommand, setParsedCommand] = useState(null)
  const [recognition, setRecognition] = useState(null)
  const [isParsingWithAI, setIsParsingWithAI] = useState(false)

  useEffect(() => {
    // Vérifier si Web Speech API est disponible
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur. Utilisez Chrome ou Edge.')
      onCancel()
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognitionInstance = new SpeechRecognition()
    
    recognitionInstance.lang = 'fr-FR'
    recognitionInstance.continuous = false
    recognitionInstance.interimResults = true

    recognitionInstance.onresult = async (event) => {
      const current = event.resultIndex
      const transcriptText = event.results[current][0].transcript
      setTranscript(transcriptText)

      // Parser la commande si c'est le résultat final
      if (event.results[current].isFinal) {
        const parsed = parseVoiceCommand(transcriptText)
        
        // Si le parsing local échoue, essayer avec l'IA
        if (!parsed.isValid) {
          setIsParsingWithAI(true)
          try {
            const aiParsed = await parseVoiceCommandWithAI(transcriptText)
            setParsedCommand(aiParsed)
          } catch (error) {
            console.error('Erreur parsing IA:', error)
            setParsedCommand(parsed) // Fallback au parsing local
          } finally {
            setIsParsingWithAI(false)
          }
        } else {
          setParsedCommand(parsed)
        }
      }
    }

    recognitionInstance.onerror = (event) => {
      console.error('Erreur reconnaissance vocale:', event.error)
      setIsListening(false)
    }

    recognitionInstance.onend = () => {
      setIsListening(false)
    }

    setRecognition(recognitionInstance)

    // Démarrer automatiquement
    recognitionInstance.start()
    setIsListening(true)

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop()
      }
    }
  }, [])

  const parseVoiceCommand = (text) => {
    const lowerText = text.toLowerCase().trim()
    
    // Patterns pour détecter action + quantité
    const patterns = [
      { regex: /(?:plus|ajoute|ajouter)\s+(\d+(?:[.,]\d+)?)/i, action: 'add' },
      { regex: /(?:moins|retire|retirer|enlève|enlever)\s+(\d+(?:[.,]\d+)?)/i, action: 'subtract' },
      { regex: /(\d+(?:[.,]\d+)?)\s+(?:en\s+)?(?:plus|ajoute)/i, action: 'add' },
      { regex: /(\d+(?:[.,]\d+)?)\s+(?:en\s+)?(?:moins|retire)/i, action: 'subtract' }
    ]

    for (const pattern of patterns) {
      const match = lowerText.match(pattern.regex)
      if (match) {
        const quantity = parseFloat(match[1].replace(',', '.'))
        return {
          action: pattern.action,
          quantity: quantity,
          isValid: !isNaN(quantity) && quantity > 0
        }
      }
    }

    return { action: null, quantity: 0, isValid: false }
  }

  const handleConfirm = () => {
    if (parsedCommand && parsedCommand.isValid) {
      const change = parsedCommand.action === 'add' ? parsedCommand.quantity : -parsedCommand.quantity
      onConfirm(change)
    }
  }

  const getActionText = () => {
    if (!parsedCommand || !parsedCommand.isValid) return ''
    
    if (parsedCommand.action === 'add') {
      return `Ajouter ${parsedCommand.quantity}`
    } else {
      return `Retirer ${parsedCommand.quantity}`
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 1000
    }} onClick={onCancel}>
      <div className="card" style={{ 
        maxWidth: '500px', 
        width: '100%',
        textAlign: 'center'
      }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Commande vocale
        </h2>
        
        <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
          {productName}
        </p>

        <div style={{ 
          marginBottom: '2rem',
          padding: '2rem',
          background: isListening ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderRadius: '12px'
        }}>
          {isListening ? (
            <Mic size={48} color="#4ade80" style={{ margin: '0 auto 1rem', animation: 'pulse 1.5s infinite' }} />
          ) : (
            <MicOff size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          )}
          
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {isListening ? '🎤 Écoute en cours...' : '❌ Microphone arrêté'}
          </p>

          {transcript && (
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem'
            }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Vous avez dit :
              </p>
              <p style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                "{transcript}"
              </p>
            </div>
          )}

          {parsedCommand && parsedCommand.isValid && (
            <div style={{
              background: 'rgba(74, 222, 128, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem',
              border: '2px solid #4ade80'
            }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                ✅ Commande détectée :
              </p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#16a34a' }}>
                {getActionText()}
              </p>
            </div>
          )}

          {isParsingWithAI && (
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: '0.875rem', color: '#3b82f6' }}>
                🤖 L'IA analyse votre commande...
              </p>
            </div>
          )}

          {!isParsingWithAI && parsedCommand && !parsedCommand.isValid && transcript && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem'
            }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--danger)' }}>
                ❌ Commande non reconnue. Essayez : "Plus 5" ou "Moins 10"
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={onCancel} 
            className="btn btn-secondary" 
            style={{ flex: 1 }}
          >
            <X size={18} style={{ marginRight: '0.5rem' }} />
            Annuler
          </button>
          <button 
            onClick={handleConfirm}
            className="btn btn-primary" 
            style={{ flex: 1 }}
            disabled={!parsedCommand || !parsedCommand.isValid}
          >
            <Check size={18} style={{ marginRight: '0.5rem' }} />
            Confirmer
          </button>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
          Exemples : "Plus 5", "Moins 10", "Ajouter 2.5", "Retirer 3"
        </p>
      </div>
    </div>
  )
}
