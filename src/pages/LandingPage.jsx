import React from 'react'
import { Link } from 'react-router-dom'
import { Package, TrendingUp, AlertTriangle, Brain, Clock, Euro } from 'lucide-react'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{
        borderBottom: '1px solid var(--border)',
        padding: '1rem 0',
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
            <Package size={32} color="#FFD700" />
            <span>PONIA AI</span>
          </div>
          <Link to="/login" className="btn btn-primary">
            Commencer
          </Link>
        </div>
      </nav>

      <section style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: 1.2 }}>
            Gérez vos stocks avec<br />
            <span style={{ color: 'var(--primary)' }}>l'Intelligence Artificielle</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Fini les ruptures de stock, le gaspillage et les heures perdues. 
            PONIA AI prédit vos besoins et optimise vos commandes automatiquement.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
              Essai gratuit 30 jours
            </Link>
            <a href="#features" className="btn btn-secondary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
              Découvrir
            </a>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem', 
            marginTop: '4rem',
            maxWidth: '800px',
            margin: '4rem auto 0'
          }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>35h</div>
              <div style={{ color: 'var(--text-muted)' }}>gagnées par mois</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>-30%</div>
              <div style={{ color: 'var(--text-muted)' }}>de gaspillage</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>0</div>
              <div style={{ color: 'var(--text-muted)' }}>rupture de stock</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" style={{ padding: '5rem 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>
            Pourquoi PONIA AI ?
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card">
              <Brain size={40} color="#FFD700" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>IA Prédictive</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                L'IA analyse vos ventes et prédit vos besoins 3 jours à l'avance. Plus jamais de rupture surprise.
              </p>
            </div>
            
            <div className="card">
              <AlertTriangle size={40} color="#fb923c" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Alertes Intelligentes</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Notifications personnalisées quand un produit arrive bientôt en rupture. Vous anticipez au lieu de réagir.
              </p>
            </div>
            
            <div className="card">
              <TrendingUp size={40} color="#4ade80" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Optimisation Auto</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Suggestions de commandes basées sur votre historique. Commandez exactement ce qu'il faut, quand il faut.
              </p>
            </div>
            
            <div className="card">
              <Clock size={40} color="#FFD700" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Gain de Temps</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                15 minutes par semaine au lieu de 3 heures. L'IA fait le travail pendant que vous gérez votre commerce.
              </p>
            </div>
            
            <div className="card">
              <Package size={40} color="#4ade80" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Multi-Commerces</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Boulangerie, restaurant, cave à vin, tabac... Templates adaptés à votre type de commerce.
              </p>
            </div>
            
            <div className="card">
              <Euro size={40} color="#4ade80" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>ROI Garanti</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Économisez 150-200€/mois en gaspillage évité. L'outil se paye tout seul et bien plus.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Prêt à optimiser vos stocks ?</h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            30 jours d'essai gratuit. Sans engagement. Annulez quand vous voulez.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
            Commencer maintenant
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="container">
          <p>PONIA AI - Gestion de stock intelligente pour tous les commerces</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            One widget. Any chain. Anywhere.
          </p>
        </div>
      </footer>
    </div>
  )
}
