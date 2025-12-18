import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader, Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight, Edit2, Check, X } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import poniaLogo from '../assets/ponia-logo.png'

function TypingMessage({ content, onComplete, isNew = false }) {
  const [displayedText, setDisplayedText] = useState(isNew ? '' : content)
  const [isTyping, setIsTyping] = useState(isNew)
  
  useEffect(() => {
    if (!isNew || !content) {
      setDisplayedText(content)
      setIsTyping(false)
      return
    }
    
    const words = content.split(' ')
    let currentIndex = 0
    
    const typingInterval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedText(words.slice(0, currentIndex + 1).join(' '))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
        if (onComplete) onComplete()
      }
    }, 50)
    
    return () => clearInterval(typingInterval)
  }, [content, isNew])
  
  return (
    <span>
      {displayedText}
      {isTyping && <span className="typing-cursor">|</span>}
    </span>
  )
}

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

    if (response.status === 403) {
      const errorData = await response.json()
      if (errorData.upgradeRequired) {
        return `⚠️ ${errorData.message}\n\n👉 Rendez-vous dans Paramètres → Abonnement pour passer au plan Standard et profiter du chat IA illimité !`
      }
    }

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
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [editingConversationId, setEditingConversationId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [typingMessageId, setTypingMessageId] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/chat/conversations', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
        
        if (data.conversations && data.conversations.length > 0) {
          loadConversation(data.conversations[0].id)
        } else {
          setMessages([{
            role: 'assistant',
            content: `Bonjour ${userName} ! Je suis PONIA, votre assistant IA. Comment puis-je vous aider aujourd'hui ?`
          }])
        }
      }
    } catch (error) {
      console.error('Erreur chargement conversations:', error)
      setMessages([{
        role: 'assistant',
        content: `Bonjour ${userName} ! Je suis PONIA, votre assistant IA. Comment puis-je vous aider aujourd'hui ?`
      }])
    }
  }

  const loadConversation = async (conversationId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentConversationId(conversationId)
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages)
        } else {
          setMessages([{
            role: 'assistant',
            content: `Bonjour ${userName} ! Comment puis-je vous aider ?`
          }])
        }
      }
    } catch (error) {
      console.error('Erreur chargement conversation:', error)
    }
  }

  const createNewConversation = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ title: 'Nouvelle conversation' })
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(prev => [data.conversation, ...prev])
        setCurrentConversationId(data.conversation.id)
        setMessages([{
          role: 'assistant',
          content: `Bonjour ${userName} ! Comment puis-je vous aider ?`
        }])
      }
    } catch (error) {
      console.error('Erreur création conversation:', error)
    }
  }

  const deleteConversation = async (conversationId, e) => {
    e.stopPropagation()
    if (!confirm('Supprimer cette conversation ?')) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== conversationId))
        if (currentConversationId === conversationId) {
          const remaining = conversations.filter(c => c.id !== conversationId)
          if (remaining.length > 0) {
            loadConversation(remaining[0].id)
          } else {
            setCurrentConversationId(null)
            setMessages([{
              role: 'assistant',
              content: `Bonjour ${userName} ! Comment puis-je vous aider ?`
            }])
          }
        }
      }
    } catch (error) {
      console.error('Erreur suppression conversation:', error)
    }
  }

  const startEditingConversation = (conversation, e) => {
    e.stopPropagation()
    setEditingConversationId(conversation.id)
    setEditingTitle(conversation.title)
  }

  const saveConversationTitle = async (conversationId, e) => {
    e.stopPropagation()
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ title: editingTitle })
      })

      if (response.ok) {
        setConversations(prev => prev.map(c => 
          c.id === conversationId ? { ...c, title: editingTitle } : c
        ))
      }
    } catch (error) {
      console.error('Erreur renommage conversation:', error)
    }
    setEditingConversationId(null)
  }

  const saveMessage = async (role, content) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      if (!currentConversationId) {
        const convResponse = await fetch('/api/chat/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ title: content.length > 50 ? content.substring(0, 50) + '...' : content })
        })

        if (convResponse.ok) {
          const convData = await convResponse.json()
          setCurrentConversationId(convData.conversation.id)
          setConversations(prev => [convData.conversation, ...prev])

          await fetch(`/api/chat/conversations/${convData.conversation.id}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ role, content })
          })
        }
      } else {
        await fetch(`/api/chat/conversations/${currentConversationId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ role, content })
        })
      }
    } catch (error) {
      console.error('Erreur sauvegarde message:', error)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    const newMessages = [...messages, { role: 'user', content: userMessage, id: Date.now() }]
    setMessages(newMessages)
    setLoading(true)

    await saveMessage('user', userMessage)

    try {
      const response = await getChatResponse(userMessage, products, messages, null)
      const newMessageId = Date.now()
      setMessages(prev => [...prev, { role: 'assistant', content: response, id: newMessageId }])
      setTypingMessageId(newMessageId)
      await saveMessage('assistant', response)
    } catch (error) {
      const errorMessage = 'Désolé, j\'ai un souci technique. Réessayez dans quelques secondes.'
      const errorMsgId = Date.now()
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage,
        id: errorMsgId
      }])
      setTypingMessageId(errorMsgId)
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Aujourd'hui"
    if (days === 1) return "Hier"
    if (days < 7) return `Il y a ${days} jours`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setShowSidebar(false)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ 
      display: 'flex',
      height: '100%',
      background: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {isMobile && showSidebar && (
        <div 
          onClick={() => setShowSidebar(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 5
          }}
        />
      )}
      {/* Sidebar des conversations */}
      <div style={{
        width: showSidebar ? (isMobile ? '280px' : '280px') : '0px',
        minWidth: showSidebar ? (isMobile ? '280px' : '280px') : '0px',
        borderRight: showSidebar ? '1px solid #E5E7EB' : 'none',
        display: 'flex',
        flexDirection: 'column',
        background: '#F9FAFB',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        position: isMobile ? 'absolute' : 'relative',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: isMobile ? 10 : 1
      }}>
        {/* Header sidebar */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', margin: 0 }}>
            Conversations
          </h3>
          <button
            onClick={createNewConversation}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              background: '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'white'
            }}
            title="Nouvelle conversation"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Liste des conversations */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {conversations.length === 0 ? (
            <div style={{ 
              padding: '2rem 1rem', 
              textAlign: 'center', 
              color: '#6B7280',
              fontSize: '0.875rem'
            }}>
              Aucune conversation
            </div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  marginBottom: '0.25rem',
                  cursor: 'pointer',
                  background: currentConversationId === conv.id ? '#E5E7EB' : 'transparent',
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (currentConversationId !== conv.id) {
                    e.currentTarget.style.background = '#F3F4F6'
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentConversationId !== conv.id) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <MessageSquare size={16} color="#6B7280" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingConversationId === conv.id ? (
                    <div style={{ display: 'flex', gap: '0.25rem' }} onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          fontSize: '0.8125rem'
                        }}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveConversationTitle(conv.id, e)
                          if (e.key === 'Escape') setEditingConversationId(null)
                        }}
                      />
                      <button onClick={(e) => saveConversationTitle(conv.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                        <Check size={14} color="#10B981" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setEditingConversationId(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                        <X size={14} color="#EF4444" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{
                        fontSize: '0.8125rem',
                        fontWeight: '500',
                        color: '#111827',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {conv.title}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280'
                      }}>
                        {formatDate(conv.updatedAt || conv.createdAt)}
                      </div>
                    </>
                  )}
                </div>
                {editingConversationId !== conv.id && (
                  <div style={{ display: 'flex', gap: '0.25rem', opacity: 0.7 }}>
                    <button
                      onClick={(e) => startEditingConversation(conv, e)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                      title="Renommer"
                    >
                      <Edit2 size={14} color="#6B7280" />
                    </button>
                    <button
                      onClick={(e) => deleteConversation(conv.id, e)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                      title="Supprimer"
                    >
                      <Trash2 size={14} color="#EF4444" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toggle sidebar */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        style={{
          position: 'absolute',
          left: showSidebar && !isMobile ? '268px' : (showSidebar && isMobile ? '268px' : '0px'),
          top: isMobile ? '10px' : '50%',
          transform: isMobile ? 'none' : 'translateY(-50%)',
          zIndex: 15,
          width: '32px',
          height: '32px',
          background: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'left 0.3s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {showSidebar ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Zone de chat principale */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        minWidth: 0
      }}>
        {/* Header avec logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '0.75rem' : '1rem',
          background: 'white',
          flexShrink: 0,
          paddingLeft: isMobile ? '48px' : '1rem'
        }}>
          <img 
            src={poniaLogo} 
            alt="PONIA" 
            style={{ 
              height: isMobile ? '32px' : '40px',
              objectFit: 'contain'
            }} 
          />
        </div>

        {/* Messages container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? '1rem' : '1.5rem',
          paddingBottom: '1rem',
          scrollBehavior: 'smooth'
        }}>
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
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
                {msg.role === 'assistant' ? (
                  <TypingMessage 
                    content={msg.content} 
                    isNew={msg.id === typingMessageId}
                    onComplete={() => setTypingMessageId(null)}
                  />
                ) : (
                  msg.content
                )}
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

        {/* Questions suggérées */}
        {showSuggestions && (
          <div style={{ padding: isMobile ? '0 1rem' : '0 1.5rem', marginBottom: '0.75rem', flexShrink: 0 }}>
            <p style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#6B7280',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {t('chat.suggestedQuestions')}
            </p>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(question)}
                  style={{
                    padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem',
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    color: '#374151',
                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flex: isMobile ? '1 1 calc(50% - 0.25rem)' : 'none'
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

        {/* Barre de saisie */}
        <div style={{
          padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem',
          paddingBottom: isMobile ? '1rem' : '1.5rem',
          background: 'white',
          flexShrink: 0,
          borderTop: '1px solid #F3F4F6'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
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
                padding: isMobile ? '0.75rem 1rem' : '0.875rem 1.25rem',
                fontSize: isMobile ? '16px' : '0.9375rem',
                border: '1px solid #E5E7EB',
                borderRadius: '24px',
                outline: 'none',
                transition: 'all 0.2s',
                minWidth: 0
              }}
              onFocus={(e) => e.target.style.borderColor = '#9CA3AF'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                padding: '0.75rem',
                background: (loading || !input.trim()) ? '#E5E7EB' : '#000000',
                border: 'none',
                borderRadius: '50%',
                color: 'white',
                cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                width: isMobile ? '40px' : '44px',
                height: isMobile ? '40px' : '44px',
                flexShrink: 0
              }}
            >
              {loading ? <Loader size={18} className="spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
