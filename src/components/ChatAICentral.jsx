import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'

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
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadChatHistory()
  }, [])

  const loadChatHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/chat/messages', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages)
        } else {
          setMessages([{
            role: 'assistant',
            content: `${t('chat.greeting')} ${userName}, comment puis-je vous aider aujourd'hui ?`
          }])
        }
      } else {
        setMessages([{
          role: 'assistant',
          content: `${t('chat.greeting')} ${userName}, comment puis-je vous aider aujourd'hui ?`
        }])
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error)
      setMessages([{
        role: 'assistant',
        content: `${t('chat.greeting')} ${userName}, comment puis-je vous aider aujourd'hui ?`
      }])
    }
  }

  const saveMessage = async (role, content) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ role, content })
      })
    } catch (error) {
      console.error('Erreur sauvegarde message:', error)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setLoading(true)

    await saveMessage('user', userMessage)

    try {
      const response = await getChatResponse(userMessage, products, messages, null)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      await saveMessage('assistant', response)
    } catch (error) {
      const errorMessage = 'Désolé, j\'ai un souci technique. Réessayez dans quelques secondes.'
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }])
      await saveMessage('assistant', errorMessage)
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
    t('chat.q1'),
    t('chat.q2'),
    t('chat.q3'),
    t('chat.q4')
  ]

  const showSuggestions = messages.length <= 1

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'white',
      padding: '1.5rem',
      paddingBottom: '0'
    }}>
      {/* Messages container - scrollable */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '1rem',
        paddingRight: '0.5rem'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                padding: '0.875rem 1.125rem',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? '#FFD700' : '#F3F4F6',
                color: msg.role === 'user' ? '#000000' : '#111827',
                fontSize: '0.9375rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontWeight: msg.role === 'user' ? '500' : '400'
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#6B7280',
            fontSize: '0.875rem',
            marginBottom: '1rem'
          }}>
            <Loader size={16} className="spin" />
            <span>PONIA réfléchit...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Questions suggérées (seulement si conversation vide) */}
      {showSuggestions && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{
            fontSize: '0.75rem',
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
                  padding: '0.75rem 1rem',
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: '#374151',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#F9FAFB'
                  e.target.style.borderColor = '#D1D5DB'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white'
                  e.target.style.borderColor = '#E5E7EB'
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Barre de chat fixe en bas */}
      <div style={{
        padding: '1rem 0',
        paddingBottom: '1.5rem'
      }}>
        <div style={{
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
              border: '1px solid #E5E7EB',
              borderRadius: '24px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#9CA3AF'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: '0.875rem',
              background: (loading || !input.trim()) ? '#E5E7EB' : '#000000',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              width: '44px',
              height: '44px'
            }}
          >
            {loading ? <Loader size={20} className="spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}
