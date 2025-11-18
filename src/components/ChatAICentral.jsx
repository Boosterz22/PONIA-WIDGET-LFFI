import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import poniaLogo from '../assets/ponia-logo.png'

function cleanMarkdown(text) {
  if (!text) return text
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
}

async function getChatResponse(userMessage, products, conversationHistory, insights) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return "Veuillez vous reconnecter pour utiliser le chat IA."
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        userMessage,
        products,
        conversationHistory,
        insights
      })
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const data = await response.json()
    return cleanMarkdown(data.response)
  } catch (error) {
    console.error('Error calling chat API:', error)
    return "Désolé, j'ai un souci technique. Réessayez dans quelques secondes."
  }
}

export default function ChatAICentral({ products, userName = "Enock" }) {
  const { t } = useLanguage()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `${t('chat.greeting')} ${userName}, comment puis-je vous aider aujourd'hui ?`
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
      const response = await getChatResponse(userMessage, products, messages, null)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Désolé, j\'ai un souci technique. Réessayez dans quelques secondes.' 
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

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion)
    setTimeout(() => {
      handleSend()
    }, 100)
  }

  const suggestedQuestions = [
    t('chat.q1'),
    t('chat.q2'),
    t('chat.q3'),
    t('chat.q4')
  ]

  return (
    <div className="card" style={{ 
      padding: 0, 
      background: 'white', 
      borderRadius: '12px', 
      overflow: 'hidden',
      border: '1px solid #E5E7EB'
    }}>
      {/* Header avec logo */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <img 
          src={poniaLogo} 
          alt="PONIA" 
          style={{ 
            width: '60px', 
            height: '60px',
            objectFit: 'contain'
          }} 
        />
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#111827', 
          margin: 0 
        }}>
          {t('chat.subtitle')}
        </h2>
      </div>

      {/* Messages */}
      <div style={{
        maxHeight: '350px',
        minHeight: '200px',
        overflowY: 'auto',
        padding: '1.5rem',
        background: '#F9FAFB'
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
              background: msg.role === 'user' ? '#FFD700' : 'white',
              color: msg.role === 'user' ? '#1F2937' : '#111827',
              fontSize: '0.9375rem',
              lineHeight: '1.6',
              boxShadow: msg.role === 'user' 
                ? '0 2px 8px rgba(255, 215, 0, 0.25)' 
                : '0 1px 3px rgba(0,0,0,0.1)',
              fontWeight: msg.role === 'user' ? '500' : '400',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1.125rem',
            background: 'white',
            borderRadius: '16px',
            maxWidth: '80%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Loader size={18} style={{ animation: 'spin 1s linear infinite', color: '#FFD700' }} />
            <span style={{ fontSize: '0.9375rem', color: '#6B7280' }}>PONIA réfléchit...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Questions suggérées */}
      {messages.length <= 1 && (
        <div style={{ 
          padding: '1rem 1.5rem', 
          background: 'white',
          borderTop: '1px solid #E5E7EB',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <p style={{ 
            fontSize: '0.8125rem', 
            fontWeight: '600', 
            color: '#6B7280', 
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {t('chat.suggestedQuestions')}
          </p>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(question)}
                style={{
                  padding: '0.625rem 0.875rem',
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  fontWeight: '400'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#FEF3C7'
                  e.target.style.borderColor = '#FFD700'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#F9FAFB'
                  e.target.style.borderColor = '#E5E7EB'
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '1rem 1.5rem',
        background: 'white',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('chat.placeholder')}
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.875rem 1.25rem',
            fontSize: '0.9375rem',
            border: '1px solid #D1D5DB',
            borderRadius: '24px',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#FFD700'}
          onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            padding: '0.875rem',
            background: input.trim() && !loading ? '#FFD700' : '#E5E7EB',
            border: 'none',
            borderRadius: '50%',
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: input.trim() && !loading ? '0 2px 8px rgba(255, 215, 0, 0.4)' : 'none'
          }}
        >
          <Send size={20} color={input.trim() && !loading ? '#1F2937' : '#9CA3AF'} />
        </button>
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
