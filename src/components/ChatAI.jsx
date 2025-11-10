import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
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

export default function ChatAI({ products, userPlan }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Salut ! Je suis PONIA, ton assistant IA. Demande-moi n\'importe quoi sur tes stocks !'
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

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 998,
      background: 'white',
      borderTop: '2px solid #FFD700',
      boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    }}>
      {isExpanded && (
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '1rem',
          background: '#FAFAFA',
          borderBottom: '1px solid #E5E7EB'
        }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '0.75rem',
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '70%',
                padding: '0.75rem 1rem',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user' 
                  ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                  : 'white',
                color: msg.role === 'user' ? '#1F2937' : '#111827',
                fontSize: '0.875rem',
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
              padding: '0.75rem 1rem',
              background: 'white',
              borderRadius: '16px',
              maxWidth: '70%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>PONIA réfléchit...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div style={{
        padding: '0.75rem 1rem',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B7280'
          }}
        >
          {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>

        <Sparkles size={20} color="#FFD700" style={{ flexShrink: 0 }} />
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Demandez quelque chose à Ponia IA..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.95rem',
            padding: '0.5rem',
            background: 'transparent',
            color: '#111827'
          }}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          style={{
            background: input.trim() && !loading ? 'linear-gradient(135deg, #FFD700, #FFA500)' : '#E5E7EB',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            fontWeight: '500',
            fontSize: '0.875rem',
            color: input.trim() && !loading ? '#1F2937' : '#9CA3AF'
          }}
        >
          {loading ? <Loader size={16} /> : <Send size={16} />}
          <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>
            {loading ? 'Envoi...' : 'Envoyer'}
          </span>
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
