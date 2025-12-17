import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function TermsPage() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      <nav style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        boxShadow: '0 2px 20px rgba(255, 215, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/ponia-icon.png" alt="PONIA" style={{ height: '45px' }} />
          </div>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: '#0a0a0a',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Retour à l'accueil
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{
          background: 'rgba(26, 26, 46, 0.9)',
          borderRadius: '16px',
          padding: '3rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 215, 0, 0.2)'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem' 
          }}>
            Conditions Générales d'Utilisation
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '2rem' }}>
            Dernière mise à jour : 9 novembre 2025
          </p>

          <Section title="1. Identification de l'éditeur">
            <div style={{ padding: '1.5rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#FFD700' }}>
                PONIA
              </p>
              <p style={{ margin: '0.25rem 0', color: 'rgba(255, 255, 255, 0.8)' }}>
                Enock Ligue - Auto-entrepreneur
              </p>
              <p style={{ margin: '0.25rem 0', color: 'rgba(255, 255, 255, 0.8)' }}>
                SIRET : 99445226600012
              </p>
              <p style={{ margin: '0.25rem 0', color: 'rgba(255, 255, 255, 0.8)' }}>
                Siège social : Paris, France
              </p>
              <p style={{ margin: '0.25rem 0', color: 'rgba(255, 255, 255, 0.8)' }}>
                Représentant légal : Enock Ligue
              </p>
              <p style={{ margin: '0.25rem 0', color: 'rgba(255, 255, 255, 0.8)' }}>
                Email : support@myponia.fr
              </p>
              <p style={{ margin: '0.25rem 0', color: 'rgba(255, 255, 255, 0.8)' }}>
                Hébergement : Supabase Inc. (serveurs européens conformes RGPD)
              </p>
            </div>
          </Section>

          <Section title="2. Acceptation des conditions">
            <p>
              En créant un compte PONIA, vous acceptez sans réserve les présentes Conditions Générales d'Utilisation (CGU). 
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
            </p>
          </Section>

          <Section title="3. Description du service">
            <p>
              PONIA est une plateforme SaaS de gestion de stock intelligente destinée aux commerces de proximité 
              (boulangeries, restaurants, bars, caves à vin, etc.). Le service comprend :
            </p>
            <ul style={{ lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.8)', marginLeft: '1.5rem' }}>
              <li>Suivi en temps réel des stocks avec alertes automatiques</li>
              <li>Prédictions IA de rupture et surstock</li>
              <li>Génération automatisée de commandes fournisseurs</li>
              <li>Alertes d'expiration produits</li>
              <li>Analyses et recommandations personnalisées</li>
            </ul>
          </Section>

          <Section title="4. Essai gratuit et plans d'abonnement">
            <div style={{ padding: '1.5rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '12px', marginBottom: '1.5rem', borderLeft: '4px solid #FFD700' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFD700', marginBottom: '0.5rem' }}>
                Essai gratuit 14 jours
              </h3>
              <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
                Tout nouveau compte bénéficie de 14 jours d'essai gratuit avec accès complet au plan Standard. 
                Aucune carte bancaire requise. À la fin de l'essai, vous pouvez choisir de vous abonner ou continuer avec le plan Basique (gratuit).
              </p>
            </div>

            <p><strong style={{ color: '#FFD700' }}>Plans disponibles :</strong></p>
            <ul style={{ lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.8)', marginLeft: '1.5rem' }}>
              <li><strong style={{ color: '#FFD700' }}>Basique (Gratuit) :</strong> 10 produits max, alertes simples, pas d'IA</li>
              <li><strong style={{ color: '#FFD700' }}>Standard (49€/mois) :</strong> 100 produits, prédictions IA 7 jours, génération commandes</li>
              <li><strong style={{ color: '#FFD700' }}>Pro (69,99€/mois) :</strong> Produits illimités, prédictions IA 30 jours, multi-magasins, support prioritaire</li>
            </ul>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Les tarifs sont exprimés HT et peuvent être soumis à TVA selon votre situation fiscale.
            </p>
          </Section>

          <Section title="5. Paiement et facturation">
            <ul style={{ lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.8)', marginLeft: '1.5rem' }}>
              <li>Les abonnements sont facturés mensuellement par anticipation</li>
              <li>Le paiement s'effectue par carte bancaire via notre partenaire sécurisé Stripe</li>
              <li>En cas de défaut de paiement, l'accès aux fonctionnalités premium est suspendu</li>
              <li>Les factures sont envoyées par email au début de chaque période de facturation</li>
            </ul>
          </Section>

          <Section title="6. Résiliation et remboursement">
            <div style={{ padding: '1.5rem', background: 'rgba(251, 146, 60, 0.1)', borderRadius: '12px', marginBottom: '1rem', borderLeft: '4px solid #fb923c' }}>
              <p style={{ margin: 0, fontWeight: '600', color: '#fb923c' }}>
                Vous pouvez résilier votre abonnement à tout moment depuis votre espace Paramètres.
              </p>
            </div>
            <ul style={{ lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.8)', marginLeft: '1.5rem' }}>
              <li>La résiliation prend effet à la fin de la période de facturation en cours</li>
              <li>Aucun remboursement pro-rata n'est effectué pour le mois en cours</li>
              <li>Vos données sont conservées 30 jours après résiliation, puis supprimées définitivement</li>
              <li>Vous pouvez réactiver votre compte pendant ces 30 jours sans perte de données</li>
            </ul>
          </Section>

          <Section title="7. Responsabilités de l'utilisateur">
            <p>En utilisant PONIA, vous vous engagez à :</p>
            <ul style={{ lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.8)', marginLeft: '1.5rem' }}>
              <li>Fournir des informations exactes et à jour lors de votre inscription</li>
              <li>Maintenir la confidentialité de vos identifiants de connexion</li>
              <li>Utiliser le service uniquement pour la gestion légitime de votre commerce</li>
              <li>Ne pas tenter de contourner les limitations techniques ou de sécurité</li>
              <li>Saisir des données de stock exactes et à jour pour bénéficier de prédictions IA fiables</li>
            </ul>
          </Section>

          <Section title="8. Responsabilités de PONIA">
            <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', marginBottom: '1rem', borderLeft: '4px solid #ef4444' }}>
              <p style={{ margin: 0, fontWeight: '600', color: '#ef4444' }}>
                Clause de limitation de responsabilité importante
              </p>
            </div>
            <ul style={{ lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.8)', marginLeft: '1.5rem' }}>
              <li>PONIA est un outil d'aide à la décision, pas un garant de vos stocks</li>
              <li>Les prédictions IA sont des estimations basées sur vos données historiques</li>
              <li>Vous restez seul responsable de vos décisions de commande et de gestion</li>
              <li>Nous garantissons une disponibilité du service de 99% (hors maintenance programmée)</li>
              <li>Notre responsabilité financière est limitée au montant payé au cours des 12 derniers mois</li>
            </ul>
          </Section>

          <Section title="9. Propriété intellectuelle">
            <p>
              PONIA, son logo, ses fonctionnalités et son code source sont protégés par les droits d'auteur. 
              Vous disposez d'un droit d'utilisation non-exclusif et non-transférable du service.
            </p>
            <p style={{ marginTop: '1rem', fontWeight: '600', color: '#FFD700' }}>
              Vos données vous appartiennent à 100% - Vous pouvez les exporter à tout moment.
            </p>
          </Section>

          <Section title="10. Protection des données">
            <p>
              Vos données personnelles sont traitées conformément à notre{' '}
              <a href="/privacy" style={{ color: '#FFD700', fontWeight: '600', textDecoration: 'none' }}>
                Politique de Confidentialité
              </a>{' '}
              et au RGPD.
            </p>
          </Section>

          <Section title="11. Suspension et résiliation du compte">
            <p>Nous nous réservons le droit de suspendre ou résilier votre compte en cas de :</p>
            <ul style={{ lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.8)', marginLeft: '1.5rem' }}>
              <li>Violation des présentes CGU</li>
              <li>Utilisation frauduleuse ou abusive du service</li>
              <li>Défaut de paiement persistant (après relances)</li>
              <li>Activité suspecte mettant en danger la sécurité de nos systèmes</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              Nous nous efforcerons de vous notifier 7 jours avant toute suspension (sauf urgence sécuritaire).
            </p>
          </Section>

          <Section title="12. Modifications des CGU">
            <p>
              Nous pouvons modifier ces CGU à tout moment. Les modifications substantielles seront notifiées 
              par email 30 jours avant leur entrée en vigueur. L'utilisation continue du service après cette 
              période vaut acceptation des nouvelles conditions.
            </p>
          </Section>

          <Section title="13. Loi applicable et juridiction">
            <p>
              Les présentes CGU sont régies par le droit français. En cas de litige, et après échec d'une résolution amiable, 
              compétence exclusive est attribuée aux tribunaux compétents de Paris, 
              sauf dispositions d'ordre public contraires.
            </p>
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '12px', borderLeft: '4px solid #FFD700' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#FFD700' }}>
                Médiation des litiges de consommation
              </p>
              <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
                Conformément à l'article L.612-1 du Code de la consommation, nous vous informons que vous pouvez recourir 
                à un médiateur de la consommation en cas de contestation :<br/><br/>
                <strong style={{ color: '#FFD700' }}>Médiateur de la consommation CNPM :</strong><br/>
                27 avenue de la Libération, 42400 Saint-Chamond<br/>
                Email : <a href="mailto:contact@cnpm-mediation-consommation.eu" style={{ color: '#FFD700' }}>contact@cnpm-mediation-consommation.eu</a><br/>
                Site : <a href="https://cnpm-mediation-consommation.eu" target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700' }}>cnpm-mediation-consommation.eu</a>
              </p>
            </div>
            <p style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <strong style={{ color: '#FFD700' }}>Résolution amiable prioritaire :</strong> Avant tout recours à la médiation ou aux tribunaux, 
              contactez-nous à support@myponia.fr - nous répondons sous 48h et privilégions toujours le dialogue.
            </p>
          </Section>

          <Section title="14. Contact">
            <div style={{ padding: '1.5rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '12px', marginTop: '1rem', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#FFD700' }}>
                Pour toute question concernant ces CGU :
              </p>
              <p style={{ margin: '0.25rem 0', color: 'rgba(255, 255, 255, 0.8)' }}>
                Email : <a href="mailto:support@myponia.fr" style={{ color: '#FFD700', fontWeight: '600', textDecoration: 'none' }}>support@myponia.fr</a>
              </p>
              <p style={{ margin: '0.25rem 0', color: 'rgba(255, 255, 255, 0.8)' }}>
                Site web : <a href="https://myponia.fr" style={{ color: '#FFD700', textDecoration: 'none' }}>myponia.fr</a>
              </p>
            </div>
          </Section>
        </div>

        <footer style={{ textAlign: 'center', marginTop: '3rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <a href="/privacy" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
               onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}>
              Politique de confidentialité
            </a>
            <a href="/pricing" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
               onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}>
              Tarifs
            </a>
            <a href="mailto:support@myponia.fr" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
               onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}>
              Contact
            </a>
          </div>
          <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
            © {new Date().getFullYear()} PONIA - Tous droits réservés
          </p>
        </footer>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ 
        fontSize: '1.4rem', 
        fontWeight: '700', 
        color: '#FFD700', 
        marginBottom: '1rem', 
        borderBottom: '2px solid rgba(255, 215, 0, 0.3)', 
        paddingBottom: '0.5rem' 
      }}>
        {title}
      </h2>
      <div style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.8)' }}>
        {children}
      </div>
    </div>
  )
}
