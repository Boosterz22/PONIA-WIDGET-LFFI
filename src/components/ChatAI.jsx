import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader } from 'lucide-react'
import { getChatResponse } from '../services/openaiService'

export default function ChatAI({ products, userPlan }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Salut ! 👋 Je suis PONIA, ton assistant IA de gestion de stock. Demande-moi n\'importe quoi sur tes produits, je connais tout ton inventaire !'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const response = await getChatResponse(userMessage, products, messages)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Désolé, j\'ai un souci technique 😅 Réessaie dans quelques secondes !' 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          border: 'none',
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'all 0.3s ease',
          transform: isOpen ? 'scale(0)' : 'scale(1)',
          pointerEvents: isOpen ? 'none' : 'auto'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.target.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.target.style.transform = 'scale(1)'
        }}
      >
        <MessageCircle size={28} color="#1F2937" />
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '450px',
          height: '100vh',
          background: 'white',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #E5E7EB',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1F2937' }}>
                Assistant IA PONIA
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#374151' }}>
                Gérez vos stocks intelligemment
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.3)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={24} color="#1F2937" />
            </button>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            background: '#FAFAFA'
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '0.875rem 1.125rem',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' 
                    ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                    : 'white',
                  color: msg.role === 'user' ? '#1F2937' : '#111827',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  fontWeight: msg.role === 'user' ? '500' : '400'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.125rem',
                background: 'white',
                borderRadius: '16px',
                maxWidth: '80%',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <Loader size={16} className="spin" />
                <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>PONIA réfléchit...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #E5E7EB',
            background: 'white'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez une question sur vos stocks..."
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.875rem 1rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: '#FAFAFA'
                }}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                style={{
                  background: loading || !input.trim() 
                    ? '#E5E7EB' 
                    : 'linear-gradient(135deg, #FFD700, #FFA500)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.875rem 1.25rem',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={20} color={loading || !input.trim() ? '#9CA3AF' : '#1F2937'} />
              </button>
            </div>
            <p style={{
              margin: '0.75rem 0 0 0',
              fontSize: '0.75rem',
              color: '#9CA3AF',
              textAlign: 'center'
            }}>
              {userPlan === 'basique' 
                ? 'Plan Basique : 5 questions IA/jour' 
                : 'Questions illimitées'}
            </p>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  )
}
