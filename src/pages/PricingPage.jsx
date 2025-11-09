import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Zap, TrendingUp, Building2 } from 'lucide-react'

export default function PricingPage() {
  const navigate = useNavigate()
  const [billingPeriod, setBillingPeriod] = useState('monthly')

  const plans = [
    {
      name: 'Basique',
      price: 0,
      priceYearly: 0,
      icon: Zap,
      color: '#6B7280',
      description: 'Pour tester PONIA AI',
      features: [
        { text: '10 produits maximum', included: true },
        { text: 'Alertes de stock simples', included: true },
        { text: 'Gestion manuelle', included: true },
        { text: 'Support email standard', included: true },
        { text: 'Prédictions IA', included: false },
        { text: 'Génération de commandes', included: false },
        { text: 'Alertes expiration', included: false },
        { text: 'Multi-magasins', included: false }
      ],
      cta: 'Commencer gratuitement',
      popular: false
    },
    {
      name: 'Standard',
      price: 49,
      priceYearly: 470,
      savings: 118,
      icon: TrendingUp,
      color: '#FFD700',
      description: 'Pour commerces sérieux',
      features: [
        { text: '50 produits maximum', included: true },
        { text: 'Prédictions IA 7 jours', included: true },
        { text: 'Génération commandes auto', included: true },
        { text: 'Alertes expiration produits', included: true },
        { text: 'Commandes vocales', included: true },
        { text: 'Chat IA illimité', included: true },
        { text: 'Support prioritaire', included: true },
        { text: 'Multi-magasins', included: false }
      ],
      cta: 'Essai gratuit 14 jours',
      popular: true
    },
    {
      name: 'Pro',
      price: 69,
      priceYearly: 660,
      savings: 168,
      icon: Building2,
      color: '#FFD700',
      description: 'Pour réseaux et chaînes',
      features: [
        { text: 'Produits ILLIMITÉS', included: true },
        { text: 'Prédictions IA 30 jours', included: true },
        { text: 'Multi-magasins illimité', included: true },
        { text: 'Génération commandes avancée', included: true },
        { text: 'Analytics avancées', included: true },
        { text: 'Support prioritaire 24/7', included: true },
        { text: 'Onboarding personnalisé', included: true },
        { text: 'API développeur', included: true }
      ],
      cta: 'Essai gratuit 14 jours',
      popular: false
    }
  ]

  const faqs = [
    {
      q: "L'essai gratuit nécessite-t-il une carte bancaire ?",
      a: "Non ! Vous pouvez tester PONIA AI pendant 14 jours sans aucune carte bancaire. À la fin de l'essai, vous décidez si vous souhaitez vous abonner ou continuer avec le plan Basique gratuit."
    },
    {
      q: "Puis-je changer de plan à tout moment ?",
      a: "Oui, vous pouvez upgrader ou downgrader à tout moment depuis votre espace Paramètres. Les changements prennent effet immédiatement."
    },
    {
      q: "Comment fonctionne l'IA de prédiction ?",
      a: "L'IA analyse votre historique de ventes, détecte les tendances saisonnières, prend en compte les événements locaux (via Google Calendar) et la météo pour prédire vos besoins futurs. Plus vous utilisez PONIA, plus les prédictions deviennent précises."
    },
    {
      q: "Que se passe-t-il si j'annule mon abonnement ?",
      a: "Vous gardez l'accès à votre plan payant jusqu'à la fin de la période facturée. Ensuite, vous basculez automatiquement sur le plan Basique (gratuit) avec 10 produits max. Vos données sont conservées 30 jours si vous souhaitez réactiver."
    },
    {
      q: "Les prix incluent-ils la TVA ?",
      a: "Les prix affichés sont HT. La TVA applicable (20% en France) sera ajoutée lors du paiement selon votre situation fiscale."
    },
    {
      q: "Puis-je obtenir une réduction pour paiement annuel ?",
      a: "Oui ! Le paiement annuel vous fait économiser 2 mois (soit ~17% de réduction). Activez l'option 'Annuel' ci-dessus pour voir les économies."
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <nav style={{
        background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 215, 0, 0.08) 50%, rgba(255, 215, 0, 0.04) 100%)',
        padding: '1.5rem 2rem',
        boxShadow: '0 2px 8px rgba(255, 215, 0, 0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img 
            src="/ponia-logo.png" 
            alt="PONIA" 
            style={{ 
              height: 'clamp(120px, 20vw, 180px)',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#FFD700',
              color: '#1a1a1a',
              border: 'none',
              padding: '0.75rem 1.75rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Retour à l'accueil
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
            Des tarifs simples et transparents
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Choisissez le plan qui correspond à votre commerce. Pas de frais cachés, résiliez quand vous voulez.
          </p>

          <div style={{
            display: 'inline-flex',
            background: 'white',
            borderRadius: '12px',
            padding: '0.4rem',
            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.2)'
          }}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              style={{
                padding: '0.7rem 2rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: billingPeriod === 'monthly' ? '#FFD700' : 'transparent',
                color: billingPeriod === 'monthly' ? '#1a1a1a' : '#666',
                transition: 'all 0.2s'
              }}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              style={{
                padding: '0.7rem 2rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: billingPeriod === 'yearly' ? '#FFD700' : 'transparent',
                color: billingPeriod === 'yearly' ? '#1a1a1a' : '#666',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              Annuel
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#FFD700',
                color: 'white',
                fontSize: '0.65rem',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px',
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
          marginBottom: '5rem'
        }}>
          {plans.map((plan, idx) => (
            <PlanCard key={idx} plan={plan} billingPeriod={billingPeriod} navigate={navigate} />
          ))}
        </div>

        <div style={{
          background: '#FFD700',
          borderRadius: '16px',
          padding: '3rem',
          textAlign: 'center',
          marginBottom: '5rem',
          boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
            Économisez €9,200/an en moyenne 💰
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#1a1a1a', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem', fontWeight: '500' }}>
            Nos clients réduisent le gaspillage de 63% et évitent les ruptures de stock coûteuses. 
            Pour un investissement de €49/mois, c'est un ROI de x15.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'white',
              color: '#1a1a1a',
              border: 'none',
              padding: '1rem 3rem',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Essayer gratuitement 14 jours
          </button>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginBottom: '3rem' }}>
            Questions fréquentes
          </h2>
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.q} answer={faq.a} />
          ))}
        </div>

        <div style={{
          background: '#f9fafb',
          borderRadius: '16px',
          padding: '3rem',
          textAlign: 'center',
          marginTop: '4rem'
        }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
            Besoin d'un plan personnalisé ?
          </h3>
          <p style={{ fontSize: '1.05rem', color: '#666', marginBottom: '2rem' }}>
            Vous gérez plus de 3 magasins ou avez des besoins spécifiques ? Contactez-nous pour un devis sur mesure.
          </p>
          <a
            href="mailto:support@myponia.fr"
            style={{
              display: 'inline-block',
              background: '#FFD700',
              color: '#1a1a1a',
              padding: '0.9rem 2.5rem',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '700',
              textDecoration: 'none',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Contacter notre équipe
          </a>
        </div>
      </div>

      <footer style={{ background: '#1a1a1a', color: 'white', padding: '3rem 1.5rem', marginTop: '5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <a href="/privacy" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem' }}>Politique de confidentialité</a>
            <a href="/terms" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem' }}>Conditions d'utilisation</a>
            <a href="mailto:support@myponia.fr" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem' }}>Contact</a>
          </div>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            © {new Date().getFullYear()} PONIA AI - Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  )
}

function PlanCard({ plan, billingPeriod, navigate }) {
  const Icon = plan.icon
  const displayPrice = billingPeriod === 'yearly' ? plan.priceYearly : plan.price
  const displaySavings = billingPeriod === 'yearly' ? plan.savings : null

  return (
    <div style={{
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
          color: 'white',
          padding: '0.4rem 1.5rem',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: '700',
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
        }}>
          ⭐ PLUS POPULAIRE
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
              <span style={{ fontSize: '3rem', fontWeight: '700', color: plan.color }}>
                {billingPeriod === 'yearly' ? Math.round(displayPrice / 12) : displayPrice}€
              </span>
              <span style={{ fontSize: '1.1rem', color: '#666' }}>/mois</span>
            </>
          )}
        </div>
        {billingPeriod === 'yearly' && displaySavings && (
          <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: '600' }}>
            Économisez {displaySavings}€/an
          </div>
        )}
        {billingPeriod === 'yearly' && displayPrice > 0 && (
          <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.25rem' }}>
            Soit {displayPrice}€ facturés annuellement
          </div>
        )}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
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

      <button
        onClick={() => navigate('/login')}
        style={{
          width: '100%',
          background: plan.popular ? plan.color : 'white',
          color: plan.popular ? 'white' : plan.color,
          border: `2px solid ${plan.color}`,
          padding: '1rem',
          borderRadius: '10px',
          fontSize: '1.05rem',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (!plan.popular) {
            e.target.style.background = `linear-gradient(135deg, ${plan.color} 0%, ${plan.color} 100%)`
            e.target.style.color = '#1a1a1a'
          } else {
            e.target.style.transform = 'scale(1.02)'
          }
        }}
        onMouseLeave={(e) => {
          if (!plan.popular) {
            e.target.style.background = 'white'
            e.target.style.color = plan.color
          } else {
            e.target.style.transform = 'scale(1)'
          }
        }}
      >
        {plan.cta}
      </button>
    </div>
  )
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      cursor: 'pointer'
    }} onClick={() => setIsOpen(!isOpen)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
          {question}
        </h4>
        <span style={{ fontSize: '1.5rem', color: '#FFD700', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
          ↓
        </span>
      </div>
      {isOpen && (
        <p style={{ fontSize: '0.95rem', color: '#666', marginTop: '1rem', lineHeight: '1.7', marginBottom: 0 }}>
          {answer}
        </p>
      )}
    </div>
  )
}
