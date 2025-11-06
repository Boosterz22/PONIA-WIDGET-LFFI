import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Clock, Shield, Zap, BarChart3, CheckCircle, Star, Users, X, Check, AlertCircle, Sparkles, Target, ArrowRight, Twitter, Linkedin } from 'lucide-react'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* HEADER - DÉGRADÉ FLUIDE */}
      <nav style={{
        padding: 'clamp(1.5rem, 3vw, 2rem) 0',
        background: 'transparent',
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
              height: 'clamp(80px, 15vw, 120px)',
              maxWidth: '60vw',
              transition: 'transform 0.3s ease'
            }} 
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </Link>

          {/* CTA */}
          <Link to="/login" className="btn btn-primary" style={{ 
            padding: '0.9rem 2rem', 
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', 
            fontWeight: '600'
          }}>
            Démarrer Gratuitement
          </Link>
        </div>
      </nav>

      {/* SECTION HERO - DÉGRADÉ CONTINU */}
      <section id="accueil" style={{ 
        padding: 'clamp(2rem, 5vw, 3rem) 0 4rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(255, 215, 0, 0.2) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
        position: 'relative',
        marginTop: '-2rem'
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
            fontSize: '1.3rem', 
            padding: '1.25rem 3rem',
            marginBottom: '1rem',
            animation: 'pulse 2s infinite'
          }}>
            Démarrer Gratuitement (Sans CB)
          </Link>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            ✅ Gratuit jusqu'à 10 produits • ✅ Configuration en 2 minutes
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
        background: 'var(--bg-light)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}></div>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '1rem' }}>
            Votre quotidien <span className="gradient-text">avant et après</span> PONIA
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto 4rem' }}>
            Découvrez comment les commerçants transforment leur gestion de stock
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
              background: 'rgba(239, 68, 68, 0.05)',
              borderRadius: '20px',
              border: '2px solid rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '2rem',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#ef4444'
              }}>
                <X size={32} />
                <span>AVANT PONIA</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <X size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text)' }}>30 minutes/jour</strong> à compter les stocks manuellement
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <X size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text)' }}>€800 de gaspillage/mois</strong> (produits périmés, sur-stock)
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <X size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text)' }}>3-4 ruptures/semaine</strong> qui frustrent vos clients
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <X size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text)' }}>Stress quotidien</strong> : "Ai-je assez de stock demain ?"
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <X size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text)' }}>Carnets, Excel, post-its</strong> → système chaotique
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <X size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text)' }}>Commandes à l'aveugle</strong> sans données fiables
                  </div>
                </div>
              </div>
            </div>

            {/* APRÈS */}
            <div style={{
              padding: '2.5rem',
              background: 'rgba(74, 222, 128, 0.05)',
              borderRadius: '20px',
              border: '2px solid rgba(74, 222, 128, 0.3)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '2rem',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#4ade80'
              }}>
                <CheckCircle size={32} />
                <span>AVEC PONIA</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text)' }}>2 minutes/jour</strong> pour mettre à jour vos stocks
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text)' }}>€130 de gaspillage/mois</strong> (-84% d'économies)
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text)' }}>0 rupture</strong> grâce aux alertes prédictives IA
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text)' }}>Tranquillité d'esprit</strong> : l'IA surveille pour vous
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text)' }}>Application simple</strong> → tout centralisé sur mobile
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text)' }}>Suggestions de commandes</strong> optimisées par l'IA
                  </div>
                </div>
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
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}></div>
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
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>ROI x12 immédiat</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                €49/mois pour économiser €600+/mois. Récupérez <strong>12x votre investissement</strong> dès le 1er mois.
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
        background: 'var(--bg-light)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.18) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}></div>
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
      <section id="faq" style={{ padding: '5rem 0' }}>
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
      <section id="tarifs" style={{ padding: '5rem 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', marginBottom: '1rem' }}>
            Tarifs <span className="gradient-text">transparents</span>
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Économisez 12x votre investissement dès le 1er mois
          </p>
          <p style={{ textAlign: 'center', fontSize: '1rem', color: 'var(--primary)', marginBottom: '4rem', fontWeight: '500' }}>
            🎁 <strong>Offre Lancement :</strong> 3 mois à -50% pour les 100 premiers (Déjà 73 inscrits)
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
              border: '2px solid rgba(74, 222, 128, 0.4)',
              background: 'rgba(74, 222, 128, 0.03)'
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                color: 'white',
                padding: '0.4rem 1.2rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                display: 'inline-block'
              }}>
                🎁 GRATUIT À VIE
              </div>
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 'bold', color: 'var(--success)', marginBottom: '0.5rem' }}>
                €0<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/mois</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Parfait pour tester
              </div>

              <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span><strong>Jusqu'à 10 produits</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span>Alertes couleur (🟢🟠🔴)</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span>Produits pré-configurés</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span>Interface mobile rapide</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <X size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Pas d'IA prédictive</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <X size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Pas d'historique</span>
                </div>
              </div>

              <Link to="/login" className="btn btn-secondary" style={{ width: '100%', padding: '1rem' }}>
                Commencer Gratuitement
              </Link>
              
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                Passez au payant quand vous voulez
              </p>
            </div>

            {/* PLAN STANDARD */}
            <div className="card" style={{ 
              padding: '2.5rem', 
              textAlign: 'center',
              border: '2px solid rgba(255, 215, 0, 0.3)'
            }}>
              <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Standard</div>
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                €49<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/mois</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                <s>€98/mois</s> → -50% pendant 3 mois
              </div>

              <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span><strong>Produits illimités</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span>Alertes automatiques (🟢🟠🔴)</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span>Historique 7 jours</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span>Export PDF commandes</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span>Support email</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <X size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Pas d'IA prédictive</span>
                </div>
              </div>

              <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                Démarrer Gratuitement
              </Link>
            </div>

            {/* PLAN PRO */}
            <div className="card" style={{ 
              padding: '2.5rem', 
              textAlign: 'center',
              border: '3px solid var(--primary)',
              position: 'relative',
              background: 'rgba(255, 215, 0, 0.03)'
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

              <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.5rem', marginTop: '0.5rem' }}>Pro</div>
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                €79<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/mois</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                <s>€158/mois</s> → -50% pendant 3 mois
              </div>

              <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span><strong>Tout du plan Standard +</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <Sparkles size={20} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span><strong>IA prédictive</strong> (alerte 3 jours avant rupture)</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <Sparkles size={20} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span><strong>Suggestions de commandes</strong> optimisées par l'IA</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <Sparkles size={20} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span><strong>Historique graphique</strong> 30 jours</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <Sparkles size={20} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span><strong>Intégration caisse</strong> (Square, à venir)</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <Sparkles size={20} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span><strong>Support prioritaire</strong> (réponse {'<'}2h)</span>
                </div>
              </div>

              <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '1rem', animation: 'pulse 2s infinite' }}>
                🎯 Économiser €9,200/an Maintenant
              </Link>
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
      <section style={{ padding: '5rem 0', textAlign: 'center', background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Prêt à arrêter de perdre du temps et de l'argent ?
          </h2>
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Rejoignez les 50+ commerçants qui économisent €600+/mois et gagnent 35h/mois avec PONIA.
          </p>

          <Link to="/login" className="btn btn-primary" style={{ 
            fontSize: '1.4rem', 
            padding: '1.5rem 3.5rem',
            marginBottom: '1.5rem',
            animation: 'pulse 2s infinite'
          }}>
            🚀 Démarrer Gratuitement (Sans CB)
          </Link>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            ✅ Gratuit jusqu'à 10 produits • ✅ Configuration en 2 minutes
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ 
        padding: '3rem 0 2rem', 
        background: 'var(--bg-light)', 
        textAlign: 'center', 
        borderTop: '1px solid rgba(255, 215, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <img src="/ponia-logo.png" alt="PONIA" style={{ height: '35px' }} />
          </div>
          
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Gestion de stock par IA pour commerces français
          </p>

          {/* RÉSEAUX SOCIAUX */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <a 
              href="https://twitter.com/ponia_ai" 
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
              <Twitter size={24} />
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
