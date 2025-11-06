import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Check, X, Loader } from 'lucide-react'
import { parseVoiceCommandLocal } from '../services/voiceParser'
import { callAIWithTimeout, loadOpenAIService } from '../services/aiUtils'

export default function VoiceInput({ productName, onConfirm, onCancel }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [parsedCommand, setParsedCommand] = useState(null)
  const [isParsingWithAI, setIsParsingWithAI] = useState(false)
  const [error, setError] = useState(null)
  const [browserNotSupported, setBrowserNotSupported] = useState(false)
  
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setBrowserNotSupported(true)
      setError('La reconnaissance vocale n\'est pas supportée par votre navigateur. Utilisez Chrome ou Edge.')
      return
    }

    const recognitionInstance = new SpeechRecognition()
    recognitionInstance.lang = 'fr-FR'
    recognitionInstance.continuous = false
    recognitionInstance.interimResults = true

    recognitionInstance.onresult = async (event) => {
      const current = event.resultIndex
      const transcriptText = event.results[current][0].transcript
      setTranscript(transcriptText)

      if (event.results[current].isFinal) {
        const localParsed = parseVoiceCommandLocal(transcriptText)
        
        if (localParsed) {
          setParsedCommand(localParsed)
        } else {
          setIsParsingWithAI(true)
          setError(null)
          
          try {
            const openaiResult = await loadOpenAIService()
            
            if (!openaiResult.success) {
              throw new Error(openaiResult.error)
            }
            
            const { parseVoiceCommandWithAI } = openaiResult.service
            const aiCallPromise = parseVoiceCommandWithAI(transcriptText)
            const aiResult = await callAIWithTimeout(aiCallPromise)
            
            if (aiResult.success && aiResult.data) {
              setParsedCommand({
                delta: aiResult.data.delta,
                action: aiResult.data.delta > 0 ? 'add' : 'remove',
                confidence: 'medium',
                reason: aiResult.data.reason || 'Analysé par IA'
              })
            } else {
              setError(aiResult.error || 'Commande non reconnue')
            }
          } catch (err) {
            console.error('Erreur parsing IA:', err)
            setError('Impossible d\'analyser la commande. Réessayez.')
          } finally {
            setIsParsingWithAI(false)
          }
        }
      }
    }

    recognitionInstance.onerror = (event) => {
      console.error('Erreur reconnaissance vocale:', event.error)
      
      if (event.error === 'not-allowed') {
        setError('Microphone non autorisé. Vérifiez les permissions de votre navigateur.')
      } else if (event.error === 'no-speech') {
        setError('Aucune parole détectée. Réessayez.')
      } else {
        setError('Erreur microphone. Réessayez.')
      }
      
      setIsListening(false)
    }

    recognitionInstance.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognitionInstance

    try {
      recognitionInstance.start()
      setIsListening(true)
    } catch (err) {
      console.error('Erreur démarrage reconnaissance:', err)
      setError('Impossible de démarrer le microphone')
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (err) {
          console.log('Cleanup reconnaissance:', err)
        }
      }
    }
  }, [])

  const handleConfirm = () => {
    if (parsedCommand && parsedCommand.delta !== undefined) {
      onConfirm(parsedCommand.delta)
    }
  }

  const getActionText = () => {
    if (!parsedCommand || parsedCommand.delta === undefined) return ''
    
    const absValue = Math.abs(parsedCommand.delta)
    if (parsedCommand.delta > 0) {
      return `Ajouter ${absValue}`
    } else {
      return `Retirer ${absValue}`
    }
  }

  const isCommandValid = parsedCommand && parsedCommand.delta !== undefined && !isNaN(parsedCommand.delta)

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
          🎤 Commande vocale
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
            {isListening ? '🎤 Écoute en cours...' : browserNotSupported ? '❌ Navigateur non supporté' : '❌ Microphone arrêté'}
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

          {isCommandValid && (
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
              {parsedCommand.reason && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {parsedCommand.reason}
                </p>
              )}
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
              <Loader size={18} className="spin" />
              <p style={{ fontSize: '0.875rem', color: '#3b82f6' }}>
                🤖 L'IA analyse votre commande...
              </p>
            </div>
          )}

          {error && !isParsingWithAI && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem',
              border: '1px solid #ef4444'
            }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--danger)' }}>
                ❌ {error}
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
            <X size={18} />
            <span style={{ marginLeft: '0.5rem' }}>Annuler</span>
          </button>
          <button 
            onClick={handleConfirm}
            className="btn btn-primary" 
            style={{ flex: 1 }}
            disabled={!isCommandValid}
          >
            <Check size={18} />
            <span style={{ marginLeft: '0.5rem' }}>Confirmer</span>
          </button>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
          💡 Exemples : "Plus 5", "Moins 10", "Ajouter 2.5", "Retirer 3"
        </p>
      </div>
    </div>
  )
}
