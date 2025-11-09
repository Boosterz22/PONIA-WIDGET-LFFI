import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Clock, Shield, Zap, BarChart3, CheckCircle, Star, Users, X, Check, AlertCircle, Sparkles, Target, ArrowRight, Linkedin } from 'lucide-react'

export default function LandingPage() {
  const [showHeaderCTA, setShowHeaderCTA] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const tarifsSection = document.getElementById('tarifs')
      if (tarifsSection) {
        const rect = tarifsSection.getBoundingClientRect()
        const isInView = rect.top <= 100 && rect.bottom >= 0
        setShowHeaderCTA(!isInView)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'white'
    }}>
      {/* HEADER TRANSPARENT */}
      <nav style={{
        padding: 'clamp(1.5rem, 3vw, 2rem) 0',
        background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 215, 0, 0.08) 50%, rgba(255, 215, 0, 0.04) 100%)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          {/* LOGO RESPONSIVE */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', cursor: 'pointer' }}>
            <img src="/ponia-logo.png" alt="PONIA" style={{ 
              height: 'clamp(120px, 20vw, 180px)',
              maxWidth: '70vw',
              transition: 'transform 0.3s ease'
            }} 
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </Link>

          {/* CTA */}
          {showHeaderCTA && (
            <Link to="/login" className="btn btn-primary" style={{ 
              padding: '0.75rem 1.5rem', 
              fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)', 
              fontWeight: '600',
              transition: 'all 0.3s ease',
              opacity: showHeaderCTA ? 1 : 0
            }}>
              Démarrer
            </Link>
          )}
        </div>
      </nav>

      {/* SECTION HERO - TRANSPARENT */}
      <section id="accueil" style={{ 
        padding: 'clamp(2rem, 5vw, 3rem) 0 4rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.04) 0%, rgba(255, 215, 0, 0.08) 30%, rgba(255, 215, 0, 0.12) 60%, transparent 100%)',
        position: 'relative'
      }} className="fade-in">
        <div className="container">

          {/* TITRE PRINCIPAL - OUTCOME-FOCUSED */}
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem', 
            lineHeight: 1.1
          }}>
            Zéro Rupture, Zéro Gaspillage : <span className="gradient-text">L'Outil qui Sauve €9,200/an</span>
          </h1>

          <p style={{ 
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', 
            color: 'var(--text-muted)', 
            maxWidth: '800px', 
            margin: '0 auto 1.5rem',
            lineHeight: 1.6
          }}>
            <strong style={{ color: 'var(--primary)' }}>Gestion de stock par IA pour boulangeries, restaurants & commerces</strong><br/>
            Alertes prédictives • 2 minutes/jour • Sans formation
          </p>

          {/* SOCIAL PROOF RAPIDE */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '2rem', 
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
            fontSize: '0.95rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} color="#4ade80" />
              <span><strong style={{ color: 'var(--success)' }}>50+</strong> commerces utilisent PONIA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} color="#FFD700" />
              <span><strong style={{ color: 'var(--primary)' }}>4.9/5</strong> satisfaction client</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="#4ade80" />
              <span><strong style={{ color: 'var(--success)' }}>100%</strong> sécurisé</span>
            </div>
          </div>

          {/* CTA HERO - FRICTION RÉDUITE */}
          <Link to="/login" className="btn btn-primary" style={{ 
            fontSize: '1.1rem', 
            padding: '1rem 2.5rem',
            marginBottom: '1rem',
            animation: 'pulse 2s infinite'
          }}>
            Démarrer (Sans CB)
          </Link>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            ✅ Plan Basique jusqu'à 10 produits • ✅ Configuration en 2 minutes
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
            ✅ Aucune carte bancaire requise
          </p>

          {/* STATS ROI ANNUEL */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '2rem', 
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '2.5rem',
            background: 'rgba(255, 215, 0, 0.05)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 215, 0, 0.2)'
          }}>
            <div className="stat-card">
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 'bold', color: 'var(--primary)' }}>€9,200</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>économisés/an</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                (pour €588 d'abonnement)
              </div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 'bold', color: 'var(--success)' }}>420h</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>gagnées/an</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                (35h par mois)
              </div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 'bold', color: 'var(--primary)' }}>-84%</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>gaspillage</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                (€800 → €130/mois)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION AVANT/APRÈS */}
      <section style={{ 
        padding: '5rem 0',
        background: 'linear-gradient(to bottom, rgba(255, 215, 0, 0.08) 0%, rgba(255, 255, 255, 0.95) 15%, white 30%)'
      }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '1rem' }}>
            La <span style={{ color: '#ef4444' }}>galère quotidienne</span> vs. <span className="gradient-text">la solution parfaite</span>
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.35rem', color: 'var(--text-muted)', marginBottom: '1rem', maxWidth: '850px', margin: '0 auto 1rem' }}>
            <strong>Reconnaissez-vous cette situation ?</strong> Découvrez comment 50+ commerçants ont transformé leur quotidien
          </p>
          <p style={{ textAlign: 'center', fontSize: '1rem', color: '#ef4444', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto 4rem', fontWeight: '600' }}>
            ⚠️ Chaque jour sans PONIA vous coûte €25 en gaspillage et ruptures
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '3rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* AVANT */}
            <div style={{
              padding: '2.5rem',
              background: 'rgba(239, 68, 68, 0.08)',
              borderRadius: '20px',
              border: '3px solid rgba(239, 68, 68, 0.4)',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.12)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1.5rem',
                fontSize: '1.6rem',
                fontWeight: 'bold',
                color: '#ef4444'
              }}>
                <AlertCircle size={36} />
                <span>SANS PONIA : LA GALÈRE</span>
              </div>

              <p style={{ fontSize: '1.05rem', color: '#ef4444', marginBottom: '2rem', fontWeight: '600', lineHeight: 1.6 }}>
                Vous reconnaissez cette routine épuisante ? Chaque jour c'est la même chose...
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <X size={22} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#ef4444', fontSize: '1.05rem' }}>30-45 minutes perdues chaque jour</strong> à compter vos stocks avec un stylo et un carnet sale. <span style={{ color: 'var(--text-muted)' }}>C'est chronophage, pénible et vous avez mieux à faire.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <X size={22} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#ef4444', fontSize: '1.05rem' }}>€600-900 jetés à la poubelle chaque mois</strong> : produits périmés, sur-stock que vous n'arrivez pas à écouler. <span style={{ color: 'var(--text-muted)' }}>Ça fait mal au portefeuille et au moral.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <X size={22} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#ef4444', fontSize: '1.05rem' }}>3-5 ruptures par semaine minimum</strong> — vos clients repartent déçus, certains ne reviennent jamais. <span style={{ color: 'var(--text-muted)' }}>Vous perdez du CA et votre réputation en souffre.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <X size={22} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#ef4444', fontSize: '1.05rem' }}>Stress permanent 24/7</strong> : "Ai-je commandé assez ? Est-ce que je vais manquer de farine demain matin ?". <span style={{ color: 'var(--text-muted)' }}>Vous ne dormez plus tranquille.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <X size={22} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#ef4444', fontSize: '1.05rem' }}>Méthode chaotique et archaïque</strong> : carnets griffonnés, Excel compliqué, post-its partout... <span style={{ color: 'var(--text-muted)' }}>C'est le bordel et vous ne savez plus où vous en êtes.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <X size={22} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#ef4444', fontSize: '1.05rem' }}>Commandes au pif sans données</strong> — vous commandez trop ou pas assez, jamais la bonne quantité. <span style={{ color: 'var(--text-muted)' }}>C'est de la roulette russe avec votre argent.</span>
                  </div>
                </div>
              </div>

              <div style={{ 
                marginTop: '2rem', 
                padding: '1.25rem', 
                background: 'rgba(239, 68, 68, 0.15)', 
                borderRadius: '12px',
                borderLeft: '4px solid #ef4444'
              }}>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#dc2626' }}>
                  💸 Résultat : Vous perdez €9,600/an en temps + gaspillage + ruptures
                </p>
              </div>
            </div>

            {/* APRÈS */}
            <div style={{
              padding: '2.5rem',
              background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.08) 0%, rgba(255, 215, 0, 0.06) 100%)',
              borderRadius: '20px',
              border: '3px solid rgba(74, 222, 128, 0.5)',
              boxShadow: '0 8px 32px rgba(74, 222, 128, 0.2)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1.5rem',
                fontSize: '1.6rem',
                fontWeight: 'bold',
                color: '#16a34a'
              }}>
                <Sparkles size={36} />
                <span>AVEC PONIA : LA PERFECTION</span>
              </div>

              <p style={{ fontSize: '1.05rem', color: '#16a34a', marginBottom: '2rem', fontWeight: '600', lineHeight: 1.6 }}>
                Imaginez : votre stock géré parfaitement, automatiquement, sans effort. C'est possible maintenant.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#16a34a', fontSize: '1.05rem' }}>2 minutes chrono par jour</strong> avec l'application mobile ultra-simple (boutons +1, -5, +10). <span style={{ color: 'var(--text-muted)' }}>Aussi facile que d'envoyer un SMS. Même votre grand-mère comprendrait.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#16a34a', fontSize: '1.05rem' }}>€670 économisés chaque mois</strong> — gaspillage réduit à €130/mois (-84%). <span style={{ color: 'var(--text-muted)' }}>C'est €8,040/an qui restent dans votre poche. De quoi faire de beaux investissements.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#16a34a', fontSize: '1.05rem' }}>Zéro rupture garantie</strong> — l'IA vous alerte 3 jours AVANT que vous manquiez de quelque chose. <span style={{ color: 'var(--text-muted)' }}>Vos clients sont toujours satisfaits, votre réputation monte en flèche.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#16a34a', fontSize: '1.05rem' }}>Sérénité absolue 24/7</strong> : dormez tranquille, PONIA surveille tout pour vous jour et nuit. <span style={{ color: 'var(--text-muted)' }}>Fini le stress. Vous pouvez enfin profiter de vos soirées et weekends en paix.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#16a34a', fontSize: '1.05rem' }}>Tout centralisé sur votre téléphone</strong> — plus de carnets, plus de post-its, plus d'Excel. <span style={{ color: 'var(--text-muted)' }}>Une seule app claire et organisée. C'est magique.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#16a34a', fontSize: '1.05rem' }}>Bon de commande intelligent généré en 1 clic</strong> — l'IA calcule exactement ce qu'il faut commander. <span style={{ color: 'var(--text-muted)' }}>Plus de devinettes. Précision mathématique basée sur vos vraies données.</span>
                  </div>
                </div>
              </div>

              <div style={{ 
                marginTop: '2rem', 
                padding: '1.5rem', 
                background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(255, 215, 0, 0.15) 100%)', 
                borderRadius: '12px',
                borderLeft: '4px solid #16a34a'
              }}>
                <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.5rem' }}>
                  ✨ Résultat : Vous gagnez €9,200/an + 420h de temps libre
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  Pour seulement €49/mois. C'est du ROI x15 — impossible de refuser.
                </p>
              </div>
            </div>
          </div>

          {/* CTA APRÈS COMPARAISON */}
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ 
              fontSize: '1.2rem', 
              padding: '1.15rem 2.5rem'
            }}>
              🛑 Stop au Gaspillage - Commencer Maintenant
            </Link>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section id="fonctionnalites" style={{ 
        padding: '5rem 0',
        background: 'white'
      }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '1rem' }}>
            Comment PONIA transforme votre quotidien
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Simple. Rapide. Intelligent.
          </p>
          <p style={{ textAlign: 'center', fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto 4rem' }}>
            Conçu pour les commerçants qui n'ont ni le temps ni l'envie d'apprendre un logiciel compliqué
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <Zap size={48} color="#FFD700" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2 minutes par jour</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Boutons +1, -10 ultra-rapides. Interface aussi simple que WhatsApp. Zéro courbe d'apprentissage.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <TrendingUp size={48} color="#4ade80" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>IA Prédictive</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <strong>L'IA vous alerte 3 jours avant</strong> chaque rupture. Elle analyse vos ventes et anticipe vos besoins.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <BarChart3 size={48} color="#FFD700" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>ROI x15 garanti</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Investissez €49/mois, économisez €767/mois. Chaque euro investi vous rapporte <strong>€15 en retour</strong>. Rentable dès le premier mois.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <Target size={48} color="#4ade80" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Alertes intelligentes</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                🔴 Rouge (critique), 🟠 Orange (faible), 🟢 Vert (OK). Vous savez en 1 coup d'œil ce qui urge.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <Clock size={48} color="#FFD700" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Templates automatiques</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Boulangerie, restaurant, cave à vin... Vos produits types sont pré-configurés. Démarrez en 1 clic.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <Shield size={48} color="#4ade80" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>100% sécurisé</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Vos données chiffrées et hébergées en France. Conforme RGPD. Sauvegarde automatique 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES AVANT/APRÈS */}
      <section id="temoignages" style={{ 
        padding: '5rem 0',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '1rem' }}>
            Ils ont testé. Ils ont adopté.
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '4rem' }}>
            Les résultats parlent d'eux-mêmes
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2.5rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* TÉMOIGNAGE 1 - BOULANGERIE */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem'
                }}>
                  🥖
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Karim B.</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Boulangerie artisanale, Paris 13e</div>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px', 
                marginBottom: '1rem',
                borderLeft: '3px solid #ef4444'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>❌ AVANT</div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "Je manquais de baguettes 2-3 fois par semaine. Ça me faisait perdre <strong>€150 de ventes</strong>. Le weekend, c'était le stress total."
                </p>
              </div>

              <div style={{ 
                background: 'rgba(74, 222, 128, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px',
                borderLeft: '3px solid #4ade80'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4ade80', marginBottom: '0.5rem' }}>✅ APRÈS 1 MOIS</div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "<strong>Zéro rupture depuis 4 semaines.</strong> Mon CA weekend a augmenté de 18%. PONIA m'alerte 2 jours avant, je commande pile ce qu'il faut."
                </p>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.25rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#FFD700" color="#FFD700" />)}
              </div>
            </div>

            {/* TÉMOIGNAGE 2 - RESTAURANT */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem'
                }}>
                  🍕
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Lina M.</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pizzeria napolitaine, Lyon</div>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px', 
                marginBottom: '1rem',
                borderLeft: '3px solid #ef4444'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>❌ AVANT</div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "Je jetais <strong>€400 de produits périmés/mois</strong> (tomates, mozzarella). J'achetais trop par peur de manquer."
                </p>
              </div>

              <div style={{ 
                background: 'rgba(74, 222, 128, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px',
                borderLeft: '3px solid #4ade80'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4ade80', marginBottom: '0.5rem' }}>✅ APRÈS 6 SEMAINES</div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "Gaspillage réduit à <strong>€80/mois (-80%)</strong>. L'IA me dit exactement combien commander. J'ai récupéré mon investissement en 4 jours."
                </p>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.25rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#FFD700" color="#FFD700" />)}
              </div>
            </div>

            {/* TÉMOIGNAGE 3 - CAVE À VIN */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem'
                }}>
                  🍷
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Julien R.</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Caviste indépendant, Bordeaux</div>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px', 
                marginBottom: '1rem',
                borderLeft: '3px solid #ef4444'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>❌ AVANT</div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "Je passais <strong>1h30/semaine</strong> à inventorier 200+ références. Erreurs fréquentes, clients déçus quand un vin n'était plus dispo."
                </p>
              </div>

              <div style={{ 
                background: 'rgba(74, 222, 128, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px',
                borderLeft: '3px solid #4ade80'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4ade80', marginBottom: '0.5rem' }}>✅ APRÈS 3 SEMAINES</div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "<strong>10 minutes/semaine maximum.</strong> L'app est tellement rapide. Alertes automatiques quand un Bordeaux populaire descend. Mes clients adorent."
                </p>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.25rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#FFD700" color="#FFD700" />)}
              </div>
            </div>
          </div>

          {/* CTA APRÈS TÉMOIGNAGES */}
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ 
              fontSize: '1.2rem', 
              padding: '1.15rem 2.5rem'
            }}>
              💪 Rejoindre les 50+ Commerçants qui Économisent
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ 
        padding: '5rem 0',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '1rem' }}>
            Questions fréquentes
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '4rem' }}>
            Tout ce que vous devez savoir
          </p>

          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* FAQ 1 */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                ❓ "Je n'ai pas le temps d'apprendre un nouvel outil"
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
                <strong style={{ color: 'var(--text)' }}>✅ 2 minutes de setup.</strong> Interface aussi simple que WhatsApp. 
                Vous créez votre compte, choisissez votre type de commerce (boulangerie, restaurant...), 
                et vos produits types sont déjà là. Cliquez sur +1 ou -10 pour ajuster. C'est tout.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                ❓ "Je ne suis pas à l'aise avec la technologie"
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
                <strong style={{ color: 'var(--text)' }}>✅ Aucune compétence technique requise.</strong> Si vous utilisez un téléphone pour appeler ou envoyer des SMS, 
                vous savez utiliser PONIA. Des boutons gros et clairs. Des couleurs pour voir en 1 coup d'œil (🟢 OK, 🔴 urgent). 
                Marie (62 ans, boulangère) l'utilise sans problème.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                ❓ "Ça marche vraiment pour ma petite boulangerie/restaurant ?"
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
                <strong style={{ color: 'var(--text)' }}>✅ Fait exactement pour vous.</strong> PONIA a été conçu après 9 visites terrain 
                auprès de petits commerçants parisiens (boulangeries, restaurants, bars, caves). 
                6 sur 9 ont cité le stock comme leur plus gros problème. 
                On a validé la solution directement avec eux. <strong>Marie (Boulangerie Paris 13e) économise €400/mois depuis 2 mois.</strong>
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                ❓ "Et si ça ne marche pas pour moi ?"
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
                <strong style={{ color: 'var(--text)' }}>✅ 30 jours gratuits, sans carte bancaire.</strong> 
                Testez PONIA pendant 1 mois. Si vous n'êtes pas convaincu, annulez en 1 clic. 
                Pas de frais cachés. Pas d'engagement. Pas de justification à donner. 
                <strong>Vous économisez dès le 1er mois</strong> ou vous partez sans rien payer.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                ❓ "L'IA peut vraiment prédire mes ruptures ?"
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
                <strong style={{ color: 'var(--text)' }}>✅ Oui. Voici comment :</strong> PONIA analyse votre consommation des 7-30 derniers jours. 
                Si vous utilisez 50 kg de farine par semaine en moyenne, et qu'il vous en reste 15 kg, 
                l'IA calcule qu'il vous reste ~2 jours. Elle vous alerte immédiatement. 
                Plus vous utilisez PONIA, plus les prédictions sont précises (elle apprend vos pics de weekend, fêtes, etc.).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" style={{ 
        padding: '5rem 0', 
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '1rem' }}>
            Tarifs <span className="gradient-text">transparents</span>
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '4rem' }}>
            Économisez 12x votre investissement dès le 1er mois
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* PLAN GRATUIT */}
            <div className="card" style={{ 
              padding: '2.5rem', 
              textAlign: 'center',
              border: '2px solid rgba(200, 200, 200, 0.3)',
              background: 'rgba(250, 250, 250, 0.5)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                color: '#065f46',
                padding: '0.4rem 1.2rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                display: 'inline-block',
                alignSelf: 'center'
              }}>
                BASIQUE
              </div>
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 'bold', color: '#6b7280', marginBottom: '0.5rem' }}>
                €0<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/mois</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem', minHeight: '1.5rem' }}>
                Pour découvrir
              </div>

              <Link to="/login" className="btn btn-secondary" style={{ width: '100%', padding: '1rem', background: '#e5e7eb', color: '#6b7280' }}>
                Démarrer
              </Link>

              <div style={{ flexGrow: 1, minHeight: '1.5rem' }} />

              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#9ca3af" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Max 10 produits</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#9ca3af" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Alertes visuelles 🟢🟠🔴</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#9ca3af" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>IA basique (score santé)</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#9ca3af" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Templates produits</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#9ca3af" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Support email</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <X size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>20 actions/jour max</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <X size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>5 commandes vocales/jour</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <X size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pas d'historique</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <X size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pas de prédictions futures</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <X size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pas d'export PDF</span>
                </div>
              </div>
            </div>

            {/* PLAN STANDARD */}
            <div className="card" style={{ 
              padding: '2.5rem', 
              textAlign: 'center',
              border: '3px solid var(--primary)',
              boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.5rem', minHeight: '1.5rem' }}>Standard</div>
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                €49<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/mois</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem', minHeight: '1.5rem' }}>
                Le plus populaire
              </div>

              <Link to="/login?plan=standard" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem' }}>
                ⚡ Passer à Standard
              </Link>

              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}><strong>Produits illimités</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}><strong>Actions illimitées</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}><strong>Commandes vocales illimitées</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}><strong>IA intermédiaire</strong> (prédictions 7j)</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Suggestions de commandes IA</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Historique 30 jours</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Export PDF/CSV</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Notifications Email</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Gestion fournisseurs</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>3 utilisateurs</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Support email rapide</span>
                </div>
              </div>
            </div>

            {/* PLAN PRO */}
            <div className="card" style={{ 
              padding: '2.5rem', 
              textAlign: 'center',
              border: '3px solid var(--primary)',
              position: 'relative',
              background: 'rgba(255, 215, 0, 0.03)',
              boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '-15px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                background: 'var(--primary)',
                color: 'var(--bg)',
                padding: '0.4rem 1.5rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}>
                ⭐ RECOMMANDÉ
              </div>

              <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.5rem', minHeight: '1.5rem' }}>Pro</div>
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                €69<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/mois</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem', minHeight: '1.5rem' }}>
                Pour les commerces exigeants
              </div>

              <Link to="/login?plan=pro" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', animation: 'pulse 2s infinite' }}>
                🚀 Passer à Pro
              </Link>

              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}><strong>Tout du Standard +</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <Sparkles size={18} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}><strong>IA avancée</strong> (prédictions 30j)</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <Sparkles size={18} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}><strong>Multi-sites illimité</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <Sparkles size={18} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}><strong>Utilisateurs illimités</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <Sparkles size={18} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Intégration météo & événements</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <Sparkles size={18} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Historique 90 jours</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <Sparkles size={18} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Intégrations POS (Square)</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <Sparkles size={18} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Commandes auto-envoyées</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <Sparkles size={18} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Analytics (marges, COGS)</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <Sparkles size={18} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.9rem' }}>Support prioritaire ({'<'}2h)</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem', maxWidth: '700px', margin: '3rem auto 0' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              <Shield size={18} style={{ verticalAlign: 'middle', color: 'var(--success)' }} /> 
              <strong style={{ color: 'var(--text)' }}> 30 jours gratuits</strong> • Annulation en 1 clic • Sans carte bancaire • 
              <strong style={{ color: 'var(--text)' }}> Données sécurisées en France</strong> (RGPD)
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '5rem 0', textAlign: 'center', background: 'transparent' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Prêt à arrêter de perdre du temps et de l'argent ?
          </h2>
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Rejoignez les 50+ commerçants qui économisent €767/mois et gagnent 35h/mois avec PONIA.
          </p>

          <Link to="/login" className="btn btn-primary" style={{ 
            fontSize: '1.4rem', 
            padding: '1.5rem 3.5rem',
            marginBottom: '1.5rem',
            animation: 'pulse 2s infinite'
          }}>
            🚀 Démarrer (Sans CB)
          </Link>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            ✅ Plan Basique jusqu'à 10 produits • ✅ Configuration en 2 minutes
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ 
        padding: '3rem 0 2rem', 
        background: 'transparent', 
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <img src="/ponia-icon.png" alt="PONIA" style={{ height: '50px' }} />
          </div>
          
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Gestion de stock par IA pour commerces français
          </p>

          {/* RÉSEAUX SOCIAUX */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <a 
              href="https://x.com/ponia_ai" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: 'var(--text-muted)', 
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                const svg = e.currentTarget.querySelector('svg')
                if (svg) svg.style.fill = 'var(--primary)'
              }}
              onMouseLeave={(e) => {
                const svg = e.currentTarget.querySelector('svg')
                if (svg) svg.style.fill = 'var(--text-muted)'
              }}
            >
              <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" style={{ fill: 'currentColor', transition: 'fill 0.2s' }}>
                <path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66" />
              </svg>
            </a>
            <a 
              href="https://linkedin.com/company/ponia" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: 'var(--text-muted)', 
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Linkedin size={24} />
            </a>
          </div>

          <div style={{ 
            paddingTop: '2rem', 
            borderTop: '1px solid rgba(255, 215, 0, 0.1)',
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.9rem' }}>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); alert('Conditions Générales de Vente - Page à venir') }}>
                CGV
              </a>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); alert('Mentions Légales - Page à venir') }}>
                Mentions Légales
              </a>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); alert('Politique de Confidentialité - Page à venir') }}>
                Confidentialité
              </a>
            </div>
            <p style={{ margin: '0 0 0.5rem', fontWeight: '500' }}>
              © Copyright 2025 - Ponia SAS
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem' }}>
              Données hébergées en France • Conforme RGPD
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
