import React, { useState, useEffect } from 'react'
import { Users, TrendingUp, CreditCard, ShoppingBag, Download } from 'lucide-react'
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

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Erreur chargement données admin:', error)
    } finally {
      setLoading(false)
    }
  }

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

        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            Liste des utilisateurs ({users.length})
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
              Chargement...
            </div>
          ) : users.length === 0 ? (
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
                  {users.map((user, idx) => {
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
      </div>
    </div>
  )
}
