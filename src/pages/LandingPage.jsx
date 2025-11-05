import React from 'react'
import { Link } from 'react-router-dom'
import { Package, TrendingUp, AlertTriangle, Brain, Clock, Euro, CheckCircle, Zap, BarChart3, ShoppingCart } from 'lucide-react'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{
        borderBottom: '1px solid var(--border)',
        padding: '1.25rem 0',
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
            <Package size={36} color="#FFD700" />
            <span className="gradient-text">PONIA AI</span>
          </div>
          <Link to="/login" className="btn btn-primary" style={{ boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)' }}>
            Essai Gratuit
          </Link>
        </div>
      </nav>

      <section style={{ 
        padding: '6rem 0 4rem', 
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(255, 215, 0, 0.08) 0%, transparent 50%)'
      }} className="fade-in">
        <div className="container">
          <div style={{ 
            display: 'inline-block', 
            padding: '0.5rem 1.5rem', 
            background: 'rgba(255, 215, 0, 0.1)', 
            borderRadius: '50px',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <span style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '600' }}>
              ✨ Plus de 500,000 commerces en France peuvent en bénéficier
            </span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.75rem)', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem', 
            lineHeight: 1.1,
            maxWidth: '900px',
            margin: '0 auto 1.5rem'
          }}>
            Gérez vos stocks en <span className="gradient-text">2 minutes par jour</span> grâce à l'IA
          </h1>

          <p style={{ 
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', 
            color: 'var(--text-muted)', 
            maxWidth: '700px', 
            margin: '0 auto 3rem',
            lineHeight: 1.6
          }}>
            Fini les ruptures de stock, le gaspillage et les heures perdues. 
            PONIA prédit vos besoins et vous alerte <strong style={{ color: 'var(--text)' }}>avant</strong> la catastrophe.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ 
              fontSize: '1.125rem', 
              padding: '1.125rem 2.5rem',
              animation: 'pulse 2s infinite'
            }}>
              🚀 Essai Gratuit 30 Jours
            </Link>
            <a href="#demo" className="btn btn-secondary" style={{ fontSize: '1.125rem', padding: '1.125rem 2.5rem' }}>
              Voir la Démo
            </a>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem', 
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div className="stat-card">
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>35h</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>gagnées par mois</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>-70%</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>de gaspillage</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 'bold', color: 'var(--success)', marginBottom: '0.5rem' }}>€600+</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>économisés/mois</div>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" style={{ padding: '5rem 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
              Le problème que vous vivez <span style={{ color: 'var(--danger)' }}>tous les jours</span>
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
              Vous gérez votre stock sur un carnet, dans votre tête, ou sur Excel. Le résultat ?
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div className="card" style={{ borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
              <AlertTriangle size={40} color="#ef4444" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--danger)' }}>Ruptures imprévues</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                "Désolé, on n'a plus de pain au levain" → Client perdu = <strong>€8 de vente perdue</strong>. 5 fois par semaine = <strong>€160/mois</strong>.
              </p>
            </div>

            <div className="card" style={{ borderColor: 'var(--warning)', background: 'rgba(251, 146, 60, 0.05)' }}>
              <Euro size={40} color="#fb923c" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--warning)' }}>Gaspillage constant</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                10kg de farine périmée, œufs cassés, produits invendus → <strong>€150/mois</strong> à la poubelle.
              </p>
            </div>

            <div className="card" style={{ borderColor: 'var(--text-muted)', background: 'rgba(136, 136, 136, 0.05)' }}>
              <Clock size={40} color="#888888" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Temps gaspillé</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                3h/semaine à checker les stocks, faire les commandes, corriger les erreurs = <strong>12h/mois perdues</strong>.
              </p>
            </div>
          </div>

          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 215, 0, 0.3)'
          }}>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              = €310+ perdus chaque mois + 12h de votre vie
            </h3>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>
              PONIA AI vous fait économiser tout ça pour <strong style={{ color: 'var(--text)' }}>€49/mois</strong>
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
              Comment ça marche ? <span className="gradient-text">Simple.</span>
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
              3 étapes. 2 minutes par jour. Résultats immédiats.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {[
              {
                step: '1',
                icon: Package,
                title: 'Inscrivez-vous en 30 secondes',
                desc: 'Email + type de commerce. On pré-configure vos produits automatiquement (farine, beurre, œufs pour une boulangerie).'
              },
              {
                step: '2',
                icon: Zap,
                title: 'Mettez à jour vos stocks',
                desc: '2 minutes chaque matin. Boutons +1, +10, -1, -10 ultra-rapides. Codes couleur 🟢🟠🔴 pour voir d\'un coup d\'œil.'
              },
              {
                step: '3',
                icon: Brain,
                title: 'L\'IA travaille pour vous',
                desc: 'Elle analyse vos habitudes et vous alerte : "Plus que 2 jours de farine, commandez maintenant chez Moulins Bio".'
              }
            ].map((item, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  top: '-15px', 
                  left: '20px',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary) 0%, #FFA500 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'var(--secondary)',
                  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
                }}>
                  {item.step}
                </div>
                <div className="card" style={{ paddingTop: '2.5rem' }}>
                  <item.icon size={40} color="#FFD700" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
              Tout ce dont vous avez besoin
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
              Simple, puissant, pensé pour les commerçants
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { icon: Brain, color: '#FFD700', title: 'IA Prédictive', desc: 'Prédit vos ruptures 3 jours à l\'avance' },
              { icon: AlertTriangle, color: '#fb923c', title: 'Alertes Intelligentes', desc: 'Notifications avant chaque rupture' },
              { icon: BarChart3, color: '#4ade80', title: 'Historique Graphique', desc: 'Visualisez vos consommations' },
              { icon: ShoppingCart, color: '#FFD700', title: 'Suggestions Commandes', desc: 'L\'IA calcule les quantités optimales' },
              { icon: Clock, color: '#4ade80', title: 'Gain de Temps Massif', desc: '2 min/jour au lieu de 30 min' },
              { icon: Euro, color: '#4ade80', title: 'ROI Immédiat', desc: 'Économisez €300-800/mois dès le 1er mois' }
            ].map((feature, i) => (
              <div key={i} className="card">
                <feature.icon size={40} color={feature.color} style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
              Prix transparent. ROI garanti.
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
              Essayez 30 jours gratuits. Annulez quand vous voulez.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', border: '2px solid var(--border)' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '1rem' }}>STANDARD</div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text)', marginBottom: '0.5rem' }}>
                €49<span style={{ fontSize: '1.25rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>/mois</span>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Parfait pour débuter</p>
              
              <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                {['Alertes stock en temps réel', 'Templates produits', 'Codes couleur visuels', 'Support email'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <CheckCircle size={20} color="#4ade80" />
                    <span style={{ color: 'var(--text-muted)' }}>{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>
                Essai Gratuit 30 Jours
              </Link>
            </div>

            <div className="card" style={{ 
              padding: '2.5rem', 
              textAlign: 'center', 
              border: '3px solid var(--primary)',
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 100%)',
              position: 'relative',
              transform: 'scale(1.05)'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '-15px', 
                right: '20px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #FFA500 100%)',
                color: 'var(--secondary)',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}>
                RECOMMANDÉ
              </div>
              
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '1rem' }}>PRO</div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text)', marginBottom: '0.5rem' }}>
                €79<span style={{ fontSize: '1.25rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>/mois</span>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Pour les pros exigeants</p>
              
              <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                {[
                  'Tout du Standard', 
                  '🧠 IA prédictive avancée', 
                  '📊 Historique & graphiques', 
                  '🤖 Suggestions commandes auto',
                  '⚡ Support prioritaire'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <CheckCircle size={20} color="#FFD700" />
                    <span style={{ color: 'var(--text)' }}>{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                Essai Gratuit 30 Jours
              </Link>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
            <p>✅ Sans engagement • Annulez en 1 clic • Données sécurisées</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)', borderTop: '1px solid rgba(255, 215, 0, 0.2)', borderBottom: '1px solid rgba(255, 215, 0, 0.2)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1.5rem' }}>
            Prêt à arrêter de perdre de l'argent ?
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            Rejoignez les commerçants qui ont repris le contrôle de leurs stocks. 
            <strong style={{ color: 'var(--text)' }}> 30 jours d'essai gratuit</strong>, aucune carte bancaire requise.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ 
            fontSize: '1.25rem', 
            padding: '1.25rem 3rem',
            boxShadow: '0 8px 30px rgba(255, 215, 0, 0.4)'
          }}>
            Démarrer Maintenant - Gratuit
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '3rem 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Package size={32} color="#FFD700" />
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="gradient-text">PONIA AI</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Gestion de stock intelligente pour tous les commerces
              </p>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'right' }}>
              <p>🇫🇷 Fait avec ❤️ à Paris</p>
              <p style={{ marginTop: '0.5rem' }}>© 2025 PONIA AI. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
