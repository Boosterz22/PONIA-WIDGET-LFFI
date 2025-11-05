import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Clock, Shield, Zap, BarChart3, CheckCircle, Star, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* NAVBAR */}
      <nav style={{
        borderBottom: '1px solid var(--border)',
        padding: '1rem 0',
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src="/ponia-logo.png" alt="PONIA AI" style={{ height: '150px' }} />
          <Link to="/login" className="btn btn-primary">
            Essai Gratuit
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{ 
        padding: '5rem 0 4rem', 
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(255, 215, 0, 0.1) 0%, transparent 60%)'
      }} className="fade-in">
        <div className="container">
          {/* 1️⃣ ACCROCHE ULTRA-COURTE */}
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem', 
            lineHeight: 1.1
          }}>
            Gérez votre stock en <span className="gradient-text">2 minutes</span>
          </h1>

          {/* 2️⃣ PROPOSITION DE VALEUR CLAIRE (3 secondes max) */}
          <p style={{ 
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', 
            color: 'var(--text-muted)', 
            maxWidth: '800px', 
            margin: '0 auto 1.5rem',
            lineHeight: 1.5
          }}>
            <strong style={{ color: 'var(--text)' }}>Application IA</strong> pour boulangeries, restaurants et commerces français.<br/>
            <span style={{ color: 'var(--primary)' }}>Prévient les ruptures. Réduit le gaspillage. Vous fait gagner du temps.</span>
          </p>

          {/* 3️⃣ PREUVE/CRÉDIBILITÉ */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '2rem', 
            flexWrap: 'wrap',
            marginBottom: '3rem',
            fontSize: '0.95rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="#FFD700" />
              <span><strong style={{ color: 'var(--text)' }}>500K+</strong> commerces éligibles</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} color="#FFD700" />
              <span><strong style={{ color: 'var(--text)' }}>9/9</strong> commerçants validés terrain</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="#4ade80" />
              <span><strong style={{ color: 'var(--success)' }}>100%</strong> données sécurisées</span>
            </div>
          </div>

          {/* 5️⃣ CTA PRINCIPAL */}
          <Link to="/login" className="btn btn-primary" style={{ 
            fontSize: '1.25rem', 
            padding: '1.25rem 3rem',
            marginBottom: '1rem',
            animation: 'pulse 2s infinite'
          }}>
            🚀 Essai Gratuit 30 Jours
          </Link>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Sans carte bancaire • Annulez en 1 clic
          </p>

          {/* 4️⃣ VISUEL QUI RETIENT - Stats clés */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem', 
            maxWidth: '900px',
            margin: '4rem auto 0',
            padding: '2rem',
            background: 'rgba(255, 215, 0, 0.05)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 215, 0, 0.2)'
          }}>
            <div className="stat-card">
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 'bold', color: 'var(--primary)' }}>35h</div>
              <div style={{ color: 'var(--text-muted)' }}>gagnées/mois</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 'bold', color: 'var(--primary)' }}>-70%</div>
              <div style={{ color: 'var(--text-muted)' }}>gaspillage</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 'bold', color: 'var(--success)' }}>€600+</div>
              <div style={{ color: 'var(--text-muted)' }}>économisés/mois</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6️⃣ BLOC 1 : POURQUOI NOUS ? */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '3rem' }}>
            Pourquoi PONIA AI ?
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <Zap size={48} color="#FFD700" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ultra-rapide</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                2 minutes par jour pour mettre à jour vos stocks. Boutons +1, -10 rapides. Zéro paperasse.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <TrendingUp size={48} color="#4ade80" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>IA Prédictive</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                L'IA analyse vos habitudes et vous alerte 3 jours avant chaque rupture. Commandez au bon moment.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <BarChart3 size={48} color="#FFD700" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>ROI Immédiat</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                €49/mois pour économiser €600+/mois. Moins de gaspillage, zéro rupture, clients satisfaits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6️⃣ BLOC 2 : COMMENT ÇA MARCHE ? */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '1rem' }}>
            Comment ça marche ?
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '4rem' }}>
            3 étapes. C'est tout.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '3rem',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, #FFA500 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'var(--secondary)',
                margin: '0 auto 1.5rem',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Inscrivez-vous</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Email + type de commerce. 30 secondes. On pré-configure vos produits automatiquement.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, #FFA500 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'var(--secondary)',
                margin: '0 auto 1.5rem',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Mettez à jour</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                2 minutes chaque matin. Cliquez +1, -10 pour ajuster. Codes couleur 🟢🟠🔴 ultra-visuels.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, #FFA500 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'var(--secondary)',
                margin: '0 auto 1.5rem',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Laissez l'IA gérer</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Alertes automatiques. Suggestions de commandes. Prédictions ruptures. Vous dormez tranquille.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6️⃣ BLOC 3 : CONFIANCE / SÉCURITÉ */}
      <section style={{ 
        padding: '4rem 0', 
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 100%)',
        borderTop: '1px solid rgba(255, 215, 0, 0.1)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.1)'
      }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem',
            textAlign: 'center'
          }}>
            <div>
              <Shield size={40} color="#4ade80" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Données sécurisées</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Hébergement EU. Chiffrement SSL. RGPD compliant.</p>
            </div>
            
            <div>
              <CheckCircle size={40} color="#FFD700" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Sans engagement</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>30 jours gratuits. Annulez en 1 clic. Aucune carte requise.</p>
            </div>

            <div>
              <Users size={40} color="#FFD700" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Validé terrain</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>9 visites terrain à Paris. 6/9 ont cité le stock comme problème #1.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6️⃣ BLOC 4 : SOCIAL PROOF / TÉMOIGNAGES */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '3rem' }}>
            Ce que disent les commerçants
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#FFD700" color="#FFD700" />)}
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontStyle: 'italic', lineHeight: 1.7 }}>
                "Avant je passais 30 minutes chaque matin à checker mes stocks. Maintenant 2 minutes top chrono. Un vrai game-changer."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #FFA500 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  M
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Marie L.</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Boulangerie, Paris 13e</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#FFD700" color="#FFD700" />)}
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontStyle: 'italic', lineHeight: 1.7 }}>
                "Plus de ruptures de stock depuis que j'utilise PONIA. Mes clients trouvent toujours ce qu'ils cherchent. Le CA a augmenté de 15%."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #FFA500 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  J
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Jean-Marc P.</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Cave à vin, Paris 6e</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#FFD700" color="#FFD700" />)}
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontStyle: 'italic', lineHeight: 1.7 }}>
                "L'interface est tellement simple que même mon équipe l'utilise sans formation. En 1 semaine on a divisé notre gaspillage par 2."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #FFA500 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  S
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Sophie D.</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Restaurant, Paris 11e</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SIMPLE */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '1rem' }}>
            Tarifs transparents
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '4rem' }}>
            Essayez 30 jours gratuits. Sans carte bancaire.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2rem', 
            maxWidth: '900px', 
            margin: '0 auto' 
          }}>
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '1rem' }}>STANDARD</div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                €49<span style={{ fontSize: '1.25rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>/mois</span>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Parfait pour débuter</p>
              
              <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                {['Alertes stock temps réel', 'Templates produits', 'Support email', 'Codes couleur visuels'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <CheckCircle size={20} color="#4ade80" />
                    <span style={{ color: 'var(--text-muted)' }}>{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>
                Commencer
              </Link>
            </div>

            <div className="card" style={{ 
              padding: '2.5rem', 
              textAlign: 'center', 
              border: '3px solid var(--primary)',
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 100%)',
              position: 'relative'
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
                POPULAIRE
              </div>
              
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '1rem' }}>PRO</div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                €79<span style={{ fontSize: '1.25rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>/mois</span>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Pour maximiser vos économies</p>
              
              <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                {[
                  'Tout du Standard', 
                  '🧠 IA prédictive avancée', 
                  '📊 Historique & graphiques', 
                  '🤖 Suggestions auto',
                  '⚡ Support prioritaire'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <CheckCircle size={20} color="#FFD700" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                Commencer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ 
        padding: '5rem 0', 
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
        borderTop: '1px solid rgba(255, 215, 0, 0.2)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1.5rem' }}>
            Prêt à gagner du temps ?
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            Rejoignez les commerçants qui gèrent leur stock en 2 minutes par jour.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ 
            fontSize: '1.25rem', 
            padding: '1.25rem 3rem',
            boxShadow: '0 8px 30px rgba(255, 215, 0, 0.4)'
          }}>
            Essai Gratuit 30 Jours
          </Link>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Sans carte bancaire • Annulez quand vous voulez
          </p>
        </div>
      </section>

      {/* 7️⃣ FOOTER BIEN ORGANISÉ */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '3rem 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            <div>
              <img src="/ponia-logo.png" alt="PONIA AI" style={{ height: '45px', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Gestion de stock intelligente pour les commerçants français. Gagnez du temps, réduisez le gaspillage.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Produit</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Fonctionnalités</a>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Tarifs</a>
                <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Essai gratuit</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Légal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Mentions légales</a>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Politique de confidentialité</a>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>CGU</a>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="mailto:contact@ponia.ai" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>contact@ponia.ai</a>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>🇫🇷 Paris, France</p>
              </div>
            </div>
          </div>

          <div style={{ 
            borderTop: '1px solid var(--border)', 
            paddingTop: '2rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.875rem'
          }}>
            <p>© 2025 PONIA AI. Tous droits réservés.</p>
            <p style={{ marginTop: '0.5rem' }}>
              <strong style={{ color: 'var(--primary)' }}>Gérez votre stock en 2 minutes.</strong> Gagnez du temps, gagnez de l'argent.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
