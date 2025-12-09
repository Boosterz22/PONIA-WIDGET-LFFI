import React, { useState, useEffect } from 'react'
import { Users, TrendingUp, CreditCard, ShoppingBag, Download, UserCheck, Percent, Euro, Filter } from 'lucide-react'
import Navigation from '../components/Navigation'
import { supabase } from '../services/supabase'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTrials: 0,
    paidUsers: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [referrerFilter, setReferrerFilter] = useState('')
  const [commercialStats, setCommercialStats] = useState([])

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      const response = await fetch('/api/admin/users-by-code', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setStats(data.stats)
        calculateCommercialStats(data.users)
      } else if (response.status === 401) {
        window.location.href = '/admin-login'
      } else {
        console.error('Admin API error:', response.status)
      }
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateCommercialStats = (usersList) => {
    const referrerMap = {}
    
    usersList.forEach(user => {
      if (user.referredBy) {
        if (!referrerMap[user.referredBy]) {
          referrerMap[user.referredBy] = {
            code: user.referredBy,
            totalReferred: 0,
            paidUsers: 0,
            revenue: 0,
            users: []
          }
        }
        referrerMap[user.referredBy].totalReferred++
        referrerMap[user.referredBy].users.push(user)
        
        if (user.plan !== 'basique') {
          referrerMap[user.referredBy].paidUsers++
          const monthlyRevenue = user.plan === 'pro' ? 69 : user.plan === 'standard' ? 49 : 0
          referrerMap[user.referredBy].revenue += monthlyRevenue
        }
      }
    })
    
    const statsArray = Object.values(referrerMap)
      .map(ref => ({
        ...ref,
        conversionRate: ref.totalReferred > 0 ? ((ref.paidUsers / ref.totalReferred) * 100).toFixed(1) : 0,
        commission: (ref.revenue * 0.25).toFixed(2)
      }))
      .sort((a, b) => b.revenue - a.revenue)
    
    setCommercialStats(statsArray)
  }

  const getFilteredUsers = () => {
    if (!referrerFilter) return users
    return users.filter(u => u.referredBy === referrerFilter)
  }

  const uniqueReferrers = [...new Set(users.filter(u => u.referredBy).map(u => u.referredBy))]

  const exportCSV = () => {
    const headers = ['Email', 'Commerce', 'Type', 'Plan', 'Statut Essai', 'Fin Essai', 'Inscription', 'Code Parrain', 'Parrainé Par']
    const rows = users.map(u => [
      u.email,
      u.businessName || '',
      u.businessType || '',
      u.plan,
      u.trialEndsAt ? (new Date(u.trialEndsAt) > new Date() ? 'En cours' : 'Expiré') : 'N/A',
      u.trialEndsAt ? new Date(u.trialEndsAt).toLocaleDateString('fr-FR') : 'N/A',
      new Date(u.createdAt).toLocaleDateString('fr-FR'),
      u.referralCode || '',
      u.referredBy || ''
    ])

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `ponia_users_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const getTrialStatus = (user) => {
    if (!user.trialEndsAt) return { text: 'N/A', color: '#6B7280' }
    const now = new Date()
    const trialEnd = new Date(user.trialEndsAt)
    const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))
    
    if (daysLeft > 7) return { text: `${daysLeft}j restants`, color: '#22c55e' }
    if (daysLeft > 0) return { text: `${daysLeft}j restants`, color: '#FFA500' }
    return { text: 'Expiré', color: '#ef4444' }
  }

  const getPlanBadge = (plan) => {
    const colors = {
      basique: '#22c55e',
      standard: '#FFA500',
      pro: '#a855f7'
    }
    return { color: colors[plan] || '#6B7280', text: plan.charAt(0).toUpperCase() + plan.slice(1) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', paddingBottom: '80px' }}>
      <Navigation />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              📊 Dashboard Admin
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
              Gérez tous vos utilisateurs et suivez vos revenus
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={18} />
            Exporter CSV
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Users size={40} style={{ color: '#3B82F6' }} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.totalUsers}</div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Utilisateurs totaux</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)', border: '2px solid #FFA500' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <TrendingUp size={40} style={{ color: '#EA580C' }} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#EA580C' }}>{stats.activeTrials}</div>
                <div style={{ fontSize: '0.875rem', color: '#9A3412', fontWeight: '600' }}>Essais actifs</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <CreditCard size={40} style={{ color: '#22c55e' }} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#22c55e' }}>{stats.paidUsers}</div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Clients payants</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', border: '2px solid #22c55e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <ShoppingBag size={40} style={{ color: '#16A34A' }} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#16A34A' }}>€{stats.totalRevenue}</div>
                <div style={{ fontSize: '0.875rem', color: '#15803D', fontWeight: '600' }}>MRR (revenus/mois)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'users' ? '#000' : '#fff',
              color: activeTab === 'users' ? '#fff' : '#374151',
              border: activeTab === 'users' ? 'none' : '1px solid #E5E7EB',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Users size={18} />
            Utilisateurs
          </button>
          <button
            onClick={() => setActiveTab('commercials')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'commercials' ? '#000' : '#fff',
              color: activeTab === 'commercials' ? '#fff' : '#374151',
              border: activeTab === 'commercials' ? 'none' : '1px solid #E5E7EB',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <UserCheck size={18} />
            Suivi Commerciaux
            {commercialStats.length > 0 && (
              <span style={{
                background: '#FFD700',
                color: '#000',
                padding: '0.125rem 0.5rem',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                {commercialStats.length}
              </span>
            )}
          </button>
        </div>

        {/* Onglet Utilisateurs */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                Liste des utilisateurs ({getFilteredUsers().length})
              </h2>
              
              {uniqueReferrers.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Filter size={16} color="#6B7280" />
                  <select
                    value={referrerFilter}
                    onChange={(e) => setReferrerFilter(e.target.value)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      background: '#fff'
                    }}
                  >
                    <option value="">Tous les utilisateurs</option>
                    {uniqueReferrers.map(ref => (
                      <option key={ref} value={ref}>Parrainés par: {ref}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                Chargement...
              </div>
            ) : getFilteredUsers().length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                Aucun utilisateur inscrit
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem', fontWeight: '600' }}>Email</th>
                      <th style={{ padding: '0.75rem', fontWeight: '600' }}>Commerce</th>
                      <th style={{ padding: '0.75rem', fontWeight: '600' }}>Type</th>
                      <th style={{ padding: '0.75rem', fontWeight: '600' }}>Plan</th>
                      <th style={{ padding: '0.75rem', fontWeight: '600' }}>Essai</th>
                      <th style={{ padding: '0.75rem', fontWeight: '600' }}>Inscription</th>
                      <th style={{ padding: '0.75rem', fontWeight: '600' }}>Parrainé par</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredUsers().map((user, idx) => {
                      const trialStatus = getTrialStatus(user)
                      const planBadge = getPlanBadge(user.plan)
                      
                      return (
                        <tr key={user.id} style={{ 
                          borderBottom: '1px solid #F3F4F6',
                          background: idx % 2 === 0 ? '#fff' : '#F9FAFB'
                        }}>
                          <td style={{ padding: '1rem' }}>{user.email}</td>
                          <td style={{ padding: '1rem' }}>{user.businessName || '-'}</td>
                          <td style={{ padding: '1rem' }}>{user.businessType || '-'}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              background: planBadge.color,
                              color: '#fff',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }}>
                              {planBadge.text}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ color: trialStatus.color, fontWeight: '600' }}>
                              {trialStatus.text}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: '#6B7280' }}>
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td style={{ padding: '1rem', color: '#6B7280', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {user.referredBy || '-'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Onglet Suivi Commerciaux */}
        {activeTab === 'commercials' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Performance des Commerciaux
              </h2>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                Suivi des parrainages et commissions (25% du MRR)
              </p>
              <p style={{ 
                color: '#9CA3AF', 
                fontSize: '0.75rem', 
                marginTop: '0.25rem',
                fontStyle: 'italic'
              }}>
                * Calculs basés sur les tarifs mensuels (Standard: 49€, Pro: 69€). Les abonnements annuels sont comptabilisés au prorata mensuel.
              </p>
            </div>

            {commercialStats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                <UserCheck size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Aucun parrainage enregistré pour le moment</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Les commerciaux apparaîtront ici dès qu'ils auront parrainé des clients
                </p>
              </div>
            ) : (
              <>
                {/* Stats globales commerciaux */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #F59E0B'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <UserCheck size={28} color="#B45309" />
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#92400E' }}>
                          {commercialStats.reduce((sum, c) => sum + c.totalReferred, 0)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#B45309' }}>Clients parrainés</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #10B981'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Percent size={28} color="#047857" />
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#065F46' }}>
                          {commercialStats.length > 0 
                            ? (commercialStats.reduce((sum, c) => sum + parseFloat(c.conversionRate), 0) / commercialStats.length).toFixed(1)
                            : 0}%
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#047857' }}>Taux conversion moyen</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #8B5CF6'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Euro size={28} color="#6D28D9" />
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#5B21B6' }}>
                          €{commercialStats.reduce((sum, c) => sum + parseFloat(c.commission), 0).toFixed(0)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6D28D9' }}>Commissions totales/mois</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tableau des commerciaux */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem', fontWeight: '600' }}>Code Parrain</th>
                        <th style={{ padding: '0.75rem', fontWeight: '600' }}>Clients parrainés</th>
                        <th style={{ padding: '0.75rem', fontWeight: '600' }}>Clients payants</th>
                        <th style={{ padding: '0.75rem', fontWeight: '600' }}>Taux conversion</th>
                        <th style={{ padding: '0.75rem', fontWeight: '600' }}>MRR généré</th>
                        <th style={{ padding: '0.75rem', fontWeight: '600' }}>Commission (25%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commercialStats.map((commercial, idx) => (
                        <tr key={commercial.code} style={{ 
                          borderBottom: '1px solid #F3F4F6',
                          background: idx % 2 === 0 ? '#fff' : '#F9FAFB'
                        }}>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              background: '#F3F4F6',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '6px',
                              fontFamily: 'monospace',
                              fontWeight: '600',
                              color: '#111827'
                            }}>
                              {commercial.code}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', fontWeight: '600' }}>
                            {commercial.totalReferred}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              background: commercial.paidUsers > 0 ? '#D1FAE5' : '#F3F4F6',
                              color: commercial.paidUsers > 0 ? '#065F46' : '#6B7280',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontWeight: '600'
                            }}>
                              {commercial.paidUsers}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{
                                width: '60px',
                                height: '8px',
                                background: '#E5E7EB',
                                borderRadius: '4px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  width: `${Math.min(commercial.conversionRate, 100)}%`,
                                  height: '100%',
                                  background: commercial.conversionRate >= 50 ? '#10B981' : commercial.conversionRate >= 25 ? '#F59E0B' : '#EF4444',
                                  borderRadius: '4px'
                                }} />
                              </div>
                              <span style={{ 
                                fontWeight: '600',
                                color: commercial.conversionRate >= 50 ? '#10B981' : commercial.conversionRate >= 25 ? '#F59E0B' : '#EF4444'
                              }}>
                                {commercial.conversionRate}%
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem', fontWeight: '700', color: '#16A34A' }}>
                            €{commercial.revenue}/mois
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                              color: '#000',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '8px',
                              fontWeight: '700',
                              fontSize: '0.9rem'
                            }}>
                              €{commercial.commission}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Détails par commercial */}
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
                    Détails des clients par commercial
                  </h3>
                  {commercialStats.map(commercial => (
                    <details key={commercial.code} style={{ marginBottom: '0.5rem' }}>
                      <summary style={{
                        padding: '0.75rem 1rem',
                        background: '#F9FAFB',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ fontFamily: 'monospace', color: '#6B7280' }}>{commercial.code}</span>
                        <span style={{ color: '#111827' }}>— {commercial.totalReferred} client(s)</span>
                      </summary>
                      <div style={{ padding: '0.75rem 1rem', background: '#fff', border: '1px solid #E5E7EB', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
                        {commercial.users.map(user => (
                          <div key={user.id} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '0.5rem 0',
                            borderBottom: '1px solid #F3F4F6',
                            fontSize: '0.875rem'
                          }}>
                            <span>{user.email}</span>
                            <span style={{
                              background: user.plan === 'pro' ? '#a855f7' : user.plan === 'standard' ? '#FFA500' : '#22c55e',
                              color: '#fff',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }}>
                              {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
