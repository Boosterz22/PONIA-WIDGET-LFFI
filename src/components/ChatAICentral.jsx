import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader, Sparkles, Mic } from 'lucide-react'
import { supabase } from '../services/supabase'

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
      return "⚠️ Veuillez vous reconnecter pour utiliser le chat IA."
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
    return "Désolé, j'ai un souci technique 😅 Réessaie dans quelques secondes !"
  }
}

export default function ChatAICentral({ products, userName = "Enock" }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Bonjour ${userName} ! Comment puis-je vous aider aujourd'hui ?`
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

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion)
    setTimeout(() => handleSend(), 100)
  }

  const suggestedQuestions = [
    "📊 Quelles sont mes ventes d'hier ?",
    "⚠️ Qu'est-ce qui manque en stock ?",
    "📦 Génère ma commande cette semaine",
    "⏰ Qu'est-ce qui expire bientôt ?"
  ]

  return (
    <div className="card" style={{ padding: 0, background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
        padding: '1.5rem',
        borderBottom: '2px solid rgba(255,255,255,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Sparkles size={24} color="#1F2937" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
            💬 PONIA IA
          </h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#1F2937', margin: 0, opacity: 0.8 }}>
          Votre assistant intelligent de gestion de stock
        </p>
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div style={{ padding: '1.5rem', background: '#FAFAFA', borderBottom: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', marginBottom: '1rem' }}>
            💡 Questions suggérées :
          </p>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(question)}
                style={{
                  padding: '0.75rem 1rem',
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  fontWeight: '500'
                }}
                className="hover-lift"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{
        maxHeight: '400px',
        minHeight: '200px',
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
              padding: '1rem 1.25rem',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' 
                ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                : 'white',
              color: msg.role === 'user' ? '#1F2937' : '#111827',
              fontSize: '0.9375rem',
              lineHeight: '1.6',
              boxShadow: msg.role === 'user' 
                ? '0 2px 8px rgba(255, 215, 0, 0.3)' 
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
            padding: '1rem 1.25rem',
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

      {/* Input */}
      <div style={{
        padding: '1rem 1.5rem',
        background: 'white',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Posez votre question..."
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
            background: input.trim() && !loading ? 'linear-gradient(135deg, #FFD700, #FFA500)' : '#E5E7EB',
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
        <button
          style={{
            padding: '0.875rem',
            background: '#F3F4F6',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          title="Assistant vocal (bientôt disponible)"
        >
          <Mic size={20} color="#6B7280" />
        </button>
      </div>

      <style>{`
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-color: #FFD700;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
