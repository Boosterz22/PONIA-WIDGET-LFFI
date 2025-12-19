import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Clock, Shield, Zap, BarChart3, CheckCircle, Star, Users, X, Check, AlertCircle, Sparkles, Target, ArrowRight, Linkedin, Building2, Radar } from 'lucide-react'

function PricingCards() {
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  
  const plans = [
    {
      name: 'Basique',
      price: 0,
      priceYearly: 0,
      icon: Zap,
      color: '#6B7280',
      description: 'Pour tester PONIA',
      features: [
        { text: '10 produits maximum', included: true },
        { text: 'Alertes de stock simples', included: true },
        { text: 'Chat IA limité (5 msg/jour)', included: true },
        { text: 'Gestion manuelle', included: true },
        { text: 'Prédictions IA', included: false },
        { text: 'Intégrations caisses', included: false },
        { text: 'Multi-magasins', included: false },
        { text: 'Support', included: false }
      ],
      cta: 'Commencer gratuitement',
      popular: false
    },
    {
      name: 'Standard',
      price: 49,
      priceYearly: 39,
      savings: 120,
      icon: TrendingUp,
      color: '#FFD700',
      description: 'Pour commerces sérieux',
      features: [
        { text: '100 produits maximum', included: true },
        { text: 'Chat IA illimité', included: true },
        { text: 'Prédictions IA 7 jours', included: true },
        { text: 'Génération commandes auto', included: true },
        { text: 'Alertes expiration produits', included: true },
        { text: 'Intégrations caisses (Square, Zettle...)', included: true },
        { text: 'Support par email', included: true },
        { text: 'Multi-magasins', included: false }
      ],
      cta: 'Essai gratuit 14 jours',
      popular: true
    },
    {
      name: 'Pro',
      price: 69,
      priceYearly: 55,
      savings: 168,
      icon: Building2,
      color: '#FFD700',
      description: 'Pour réseaux et chaînes',
      features: [
        { text: 'Produits ILLIMITÉS', included: true },
        { text: 'Prédictions IA 30 jours', included: true },
        { text: 'Multi-magasins illimité', included: true },
        { text: 'Génération commandes avancée', included: true },
        { text: 'Intégrations caisses (Square, Zettle...)', included: true },
        { text: 'Commandes vocales', included: true },
        { text: 'Analytics avancées', included: true },
        { text: 'Support prioritaire dédié', included: true }
      ],
      cta: 'Essai gratuit 14 jours',
      popular: false
    }
  ]

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50px',
          padding: '5px',
          border: '1px solid rgba(255, 215, 0, 0.3)'
        }}>
          <button
            onClick={() => setBillingPeriod('monthly')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: billingPeriod === 'monthly' ? '#FFD700' : 'transparent',
              color: billingPeriod === 'monthly' ? '#1a1a1a' : '#1a1a1a'
            }}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: billingPeriod === 'yearly' ? '#FFD700' : 'transparent',
              color: billingPeriod === 'yearly' ? '#1a1a1a' : '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Annuel
            <span style={{
              background: '#22c55e',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              -20%
            </span>
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {plans.map((plan, idx) => {
          const Icon = plan.icon
          const displayPrice = billingPeriod === 'yearly' ? plan.priceYearly : plan.price
          return (
            <div key={idx} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2.5rem',
              boxShadow: plan.popular ? '0 10px 40px rgba(255, 215, 0, 0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
              border: plan.popular ? `3px solid ${plan.color}` : '1px solid #e5e7eb',
              position: 'relative',
              transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.3s'
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: plan.color,
                  color: '#1a1a1a',
                  padding: '0.4rem 1.5rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
                }}>
                  ⭐ RECOMMANDÉ
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Icon size={40} color={plan.color} style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1.5rem' }}>
                  {plan.description}
                </p>
                <div style={{ marginBottom: '0.5rem' }}>
                  {displayPrice === 0 ? (
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: plan.color }}>
                      Gratuit
                    </div>
                  ) : (
                    <>
                      {billingPeriod === 'yearly' && plan.price > 0 && (
                        <span style={{ 
                          fontSize: '1.2rem', 
                          color: '#999', 
                          textDecoration: 'line-through',
                          marginRight: '0.5rem'
                        }}>
                          {plan.price}€
                        </span>
                      )}
                      <span style={{ fontSize: '3rem', fontWeight: '700', color: plan.color }}>
                        {displayPrice}€
                      </span>
                      <span style={{ fontSize: '1.1rem', color: '#666' }}>/mois</span>
                    </>
                  )}
                </div>
                {billingPeriod === 'yearly' && plan.savings > 0 && (
                  <div style={{
                    background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                    color: '#166534',
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    display: 'inline-block'
                  }}>
                    Économisez {plan.savings}€/an
                  </div>
                )}
              </div>

              <Link
                to="/login"
                style={{
                  width: '100%',
                  display: 'block',
                  textAlign: 'center',
                  background: plan.popular ? plan.color : 'white',
                  color: plan.popular ? '#1a1a1a' : plan.color,
                  border: `2px solid ${plan.color}`,
                  padding: '1rem',
                  borderRadius: '10px',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  marginBottom: '2rem'
                }}
              >
                {plan.cta}
              </Link>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.9rem',
                    fontSize: '0.95rem',
                    color: feature.included ? '#1a1a1a' : '#999'
                  }}>
                    {feature.included ? (
                      <Check size={20} color={plan.color} style={{ flexShrink: 0 }} />
                    ) : (
                      <X size={20} color="#cbd5e1" style={{ flexShrink: 0 }} />
                    )}
                    <span style={{ textDecoration: feature.included ? 'none' : 'line-through' }}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </>
  )
}

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
      {/* HEADER - Transparent mobile, doré desktop */}
      <nav style={{
        padding: 'clamp(1.5rem, 3vw, 2rem) 0',
        background: window.innerWidth > 768 
          ? 'linear-gradient(180deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 215, 0, 0.08) 50%, rgba(255, 215, 0, 0.04) 100%)'
          : 'transparent',
        backdropFilter: window.innerWidth > 768 ? 'blur(10px)' : 'none',
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
            Alertes prédictives • Synchronisation caisse automatique • Sans formation
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
              <CheckCircle size={20} color="#FFD700" />
              <span><strong style={{ color: 'var(--success)' }}>50+</strong> commerces utilisent PONIA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} color="#FFD700" />
              <span><strong style={{ color: 'var(--primary)' }}>4.9/5</strong> satisfaction client</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="#FFD700" />
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
            ✅ Plan Basique jusqu'à 10 produits • ✅ Synchronisation caisse automatique
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
              background: 'rgba(255, 215, 0, 0.08)',
              borderRadius: '20px',
              border: '3px solid rgba(255, 215, 0, 0.5)',
              boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1.5rem',
                fontSize: '1.6rem',
                fontWeight: 'bold',
                color: '#FFD700'
              }}>
                <Sparkles size={36} />
                <span>AVEC PONIA : LA PERFECTION</span>
              </div>

              <p style={{ fontSize: '1.05rem', color: '#FFD700', marginBottom: '2rem', fontWeight: '600', lineHeight: 1.6 }}>
                Imaginez : votre stock géré parfaitement, automatiquement, sans effort. C'est possible maintenant.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#FFD700', fontSize: '1.05rem' }}>PONIA Chat : votre assistant IA personnel</strong> — posez vos questions en langage naturel. <span style={{ color: 'var(--text-muted)' }}>"Qu'est-ce que je dois commander cette semaine ?" L'IA répond instantanément.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#FFD700', fontSize: '1.05rem' }}>7 heures gagnées chaque semaine</strong> — fini les comptages manuels et les commandes au pif. <span style={{ color: 'var(--text-muted)' }}>Votre temps économisé s'affiche en direct sur votre tableau de bord.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#FFD700', fontSize: '1.05rem' }}>€670 économisés chaque mois</strong> — gaspillage réduit à €130/mois (-84%). <span style={{ color: 'var(--text-muted)' }}>C'est €8,040/an qui restent dans votre poche.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#FFD700', fontSize: '1.05rem' }}>Suggestions IA proactives</strong> — alertes météo, péremptions, anomalies détectées automatiquement. <span style={{ color: 'var(--text-muted)' }}>L'IA anticipe vos besoins avant même que vous y pensiez.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#FFD700', fontSize: '1.05rem' }}>Zéro rupture garantie</strong> — l'IA vous alerte 3 jours AVANT que vous manquiez de quelque chose. <span style={{ color: 'var(--text-muted)' }}>Vos clients sont toujours satisfaits.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#FFD700', fontSize: '1.05rem' }}>Sync automatique avec votre caisse</strong> — Square, Zettle, SumUp, Lightspeed connectés en 2 clics. <span style={{ color: 'var(--text-muted)' }}>Vos ventes mettent à jour votre stock automatiquement.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#FFD700', fontSize: '1.05rem' }}>Bon de commande intelligent en 1 clic</strong> — l'IA calcule exactement ce qu'il faut commander. <span style={{ color: 'var(--text-muted)' }}>Envoyez-le par WhatsApp ou email directement.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={22} color="#FFD700" style={{ flexShrink: 0, marginTop: '0.3rem' }} />
                  <div>
                    <strong style={{ color: '#FFD700', fontSize: '1.05rem' }}>Et plein d'autres fonctionnalités...</strong> — scan code-barres, historique des mouvements, alertes email personnalisées, multi-langues, et bien plus encore.
                  </div>
                </div>
              </div>

              <div style={{ 
                marginTop: '2rem', 
                padding: '1.5rem', 
                background: 'rgba(255, 215, 0, 0.2)', 
                borderRadius: '12px',
                borderLeft: '4px solid #FFD700'
              }}>
                <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold', color: '#FFD700', marginBottom: '0.5rem' }}>
                  ✨ Résultat : 7h/semaine récupérées + €8,040/an économisés
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  Pour seulement €49/mois. ROI x15 — l'IA PONIA travaille pour vous 24/7.
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

      {/* IA CONVERSATIONNELLE */}
      <section style={{ 
        padding: '4rem 0',
        background: 'white'
      }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', textAlign: 'center', marginBottom: '0.75rem' }}>
            Posez vos questions à l'IA
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Parlez naturellement, obtenez des réponses instantanées
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '1.25rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {[
              "Quels produits risquent la rupture ce weekend ?",
              "Mon beurre expire bientôt, que puis-je préparer ?",
              "Génère ma commande fournisseur pour la semaine",
              "Analyse mes pertes et dis-moi comment les réduire",
              "Quel est mon produit le plus rentable ?"
            ].map((question, i) => (
              <div 
                key={i}
                className="card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Sparkles size={20} color="#FFD700" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.95rem', color: 'var(--text)' }}>"{question}"</span>
              </div>
            ))}
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
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Synchronisation automatique</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Connectez votre caisse une seule fois. Vos ventes et stocks se mettent à jour automatiquement, en temps réel.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <Sparkles size={48} color="#FFD700" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>IA Conversationnelle</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <strong>Parlez à votre assistant comme à un expert.</strong> Posez vos questions, obtenez des conseils personnalisés instantanément.
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
              <Radar size={48} color="#FFD700" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Tour de Contrôle IA</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <strong>60+ types d'alertes intelligentes</strong> : stock, recettes, ventes, finance, conformité. Votre copilote IA surveille tout pour vous.
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
              <Shield size={48} color="#FFD700" style={{ margin: '0 auto 1.5rem' }} />
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
                  background: 'linear-gradient(135deg, #FFD700, #FFD700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem'
                }}>
                  🥖
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Sophie Martinet</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Boulangerie Le Levain d'Or, Paris 11e</div>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px', 
                marginBottom: '1rem',
                borderLeft: '3px solid #ef4444'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>❌ AVANT PONIA</div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "Tous les weekends, je jetais des baguettes et des croissants. Beaucoup trop. J'avais honte de gâcher autant, et en même temps je refusais des clients à 18h parce que j'étais en rupture..."
                </p>
              </div>

              <div style={{ 
                background: 'rgba(255, 215, 0, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px',
                borderLeft: '3px solid #FFD700'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#FFD700', marginBottom: '0.5rem' }}>✅ AVEC PONIA</div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "Maintenant je ne jette presque plus rien et j'ai toujours ce qu'il faut. PONIA m'alerte avant les ruptures et me dit quoi commander. Mes samedis sont beaucoup plus sereins."
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
                  background: '#FFD700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem'
                }}>
                  🍕
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Marc Dubois</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bistrot Les Canailles, Lyon 6e</div>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px', 
                marginBottom: '1rem',
                borderLeft: '3px solid #ef4444'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>❌ AVANT PONIA</div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "Tous les lundis, je vidais mon frigo plein de légumes pourris et de viande périmée. Je commandais trop par peur de manquer. Le gaspillage me rendait malade mais je ne savais pas comment faire mieux."
                </p>
              </div>

              <div style={{ 
                background: 'rgba(255, 215, 0, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px',
                borderLeft: '3px solid #FFD700'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#FFD700', marginBottom: '0.5rem' }}>✅ AVEC PONIA</div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "Le gaspillage a vraiment baissé. PONIA me dit exactement quoi commander et quand. Hier il m'a suggéré d'utiliser mon stock de bœuf pour un plat du jour. Tout s'est vendu. Je commande juste ce qu'il faut maintenant."
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
                  background: '#FFD700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem'
                }}>
                  🍷
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Élise Renault</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Cave La Vigne Libre, Marseille</div>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px', 
                marginBottom: '1rem',
                borderLeft: '3px solid #ef4444'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>❌ AVANT PONIA</div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "Avec toutes mes références de vin, c'était ingérable. Je passais des heures à compter mes bouteilles chaque weekend. Des clients repartaient chez le concurrent parce que je pensais avoir du stock mais en fait non."
                </p>
              </div>

              <div style={{ 
                background: 'rgba(255, 215, 0, 0.1)', 
                padding: '1rem', 
                borderRadius: '10px',
                borderLeft: '3px solid #FFD700'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#FFD700', marginBottom: '0.5rem' }}>✅ AVEC PONIA</div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "Mon inventaire prend moins de 10 minutes maintenant. PONIA m'alerte quand mes bestsellers baissent et je commande à temps. Plus de rupture, plus de client perdu. Mes weekends sont beaucoup plus calmes."
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
                <strong style={{ color: 'var(--text)' }}>✅ Zéro apprentissage.</strong> Connectez votre caisse, c'est terminé. 
                Vos stocks se mettent à jour tout seuls. <strong>Vous ne touchez plus à rien.</strong>
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                ❓ "Je ne suis pas à l'aise avec la technologie"
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
                <strong style={{ color: 'var(--text)' }}>✅ Si vous savez envoyer un SMS, vous savez utiliser PONIA.</strong> 
                Gros boutons. Couleurs claires (🟢 = OK, 🔴 = urgent). <strong>Rien à configurer, rien à comprendre.</strong>
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                ❓ "Ça marche vraiment pour mon commerce ?"
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
                <strong style={{ color: 'var(--text)' }}>✅ 20 produits ou 2000, PONIA s'adapte.</strong> 
                Boulangerie, restaurant, bar, cave à vin, fromagerie... L'IA apprend VOS habitudes. 
                <strong>En 48h, vous savez déjà ce qui va manquer la semaine prochaine.</strong>
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                ❓ "Et si ça ne marche pas pour moi ?"
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
                <strong style={{ color: 'var(--text)' }}>✅ 14 jours gratuits. Pas de CB. Pas d'engagement.</strong> 
                Vous testez, vous voyez les résultats. Si ça ne vous convient pas, vous partez en 1 clic. 
                <strong>Zéro risque.</strong>
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                ❓ "L'IA peut vraiment prédire mes ruptures ?"
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
                <strong style={{ color: 'var(--text)' }}>✅ Oui. Elle lit vos ventes.</strong> 
                Vous vendez 50 baguettes/jour, il en reste 80 ? L'IA sait qu'il vous reste 1,5 jour. 
                Elle vous alerte AVANT la rupture. <strong>Plus jamais de "désolé, on n'en a plus".</strong>
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
            Des tarifs <span className="gradient-text">simples et transparents</span>
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Choisissez le plan qui correspond à votre commerce. Pas de frais cachés, résiliez quand vous voulez.
          </p>


          <PricingCards />

          <div style={{
            background: '#FFD700',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
            marginTop: '4rem',
            boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)'
          }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
              Économisez €9,200/an en moyenne 💰
            </h3>
            <p style={{ fontSize: '1.1rem', color: '#1a1a1a', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem', fontWeight: '500' }}>
              Nos clients réduisent le gaspillage de 63% et évitent les ruptures de stock coûteuses. 
              Pour un investissement de €49/mois, c'est un ROI de x15.
            </p>
            <Link to="/login" className="btn" style={{
              background: 'white',
              color: '#1a1a1a',
              border: 'none',
              padding: '1rem 3rem',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s',
              textDecoration: 'none',
              display: 'inline-block'
            }}>
              Essayer gratuitement 14 jours
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem', maxWidth: '700px', margin: '3rem auto 0' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              <Shield size={18} style={{ verticalAlign: 'middle', color: 'var(--success)' }} /> 
              <strong style={{ color: 'var(--text)' }}> 14 jours d'essai gratuit</strong> • Annulation en 1 clic • Sans carte bancaire • 
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
            ✅ Plan Basique jusqu'à 10 produits • ✅ Synchronisation caisse automatique
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
              href="https://x.com/ponia_hq" 
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
              href="https://www.linkedin.com/in/enock-ligue-238230396" 
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
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.9rem', flexWrap: 'wrap' }}>
              <Link to="/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                Tarifs
              </Link>
              <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                Conditions d'utilisation
              </Link>
              <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                Confidentialité
              </Link>
              <a href="mailto:support@myponia.fr" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                Contact
              </a>
            </div>
            <p style={{ margin: '0 0 0.5rem', fontWeight: '500' }}>
              © Copyright 2025 - PONIA
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
