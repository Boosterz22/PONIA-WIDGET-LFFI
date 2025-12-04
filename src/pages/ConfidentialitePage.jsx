import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import poniaLogo from '../assets/ponia-logo.png'

export default function ConfidentialitePage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem 1.5rem' 
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: '#6B7280',
            cursor: 'pointer',
            marginBottom: '2rem',
            fontSize: '0.875rem'
          }}
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <img 
              src={poniaLogo} 
              alt="PONIA" 
              style={{ height: '48px', marginBottom: '1rem' }} 
            />
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', margin: 0 }}>
              Politique de confidentialité
            </h1>
          </div>

          <div style={{ lineHeight: '1.8', color: '#374151' }}>
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Responsable du traitement
              </h2>
              <p style={{ margin: '0.5rem 0' }}><strong>Nom :</strong> Enock Ligue</p>
              <p style={{ margin: '0.5rem 0' }}><strong>SIRET :</strong> 99445226600012</p>
              <p style={{ margin: '0.5rem 0' }}><strong>Email :</strong> support@myponia.fr</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Données collectées
              </h2>
              <p>Dans le cadre de l'utilisation de PONIA, nous collectons les données suivantes :</p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>Informations d'identification : nom, prénom, adresse email</li>
                <li>Informations professionnelles : nom du commerce, type d'activité, adresse</li>
                <li>Données d'inventaire : produits, stocks, fournisseurs</li>
                <li>Données de connexion : logs d'accès, adresse IP</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Finalités du traitement
              </h2>
              <p>Vos données sont utilisées pour :</p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>Fournir les services de gestion de stock et d'intelligence artificielle</li>
                <li>Personnaliser les recommandations et alertes</li>
                <li>Améliorer nos services et développer de nouvelles fonctionnalités</li>
                <li>Assurer la sécurité et prévenir les fraudes</li>
                <li>Communiquer avec vous concernant votre compte</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Base légale
              </h2>
              <p>
                Le traitement de vos données repose sur l'exécution du contrat (fourniture du service PONIA) 
                et votre consentement lors de l'inscription. Certains traitements peuvent également être fondés 
                sur notre intérêt légitime (amélioration des services, sécurité).
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Conservation des données
              </h2>
              <p>
                Vos données sont conservées pendant toute la durée de votre utilisation du service, 
                puis pendant une durée de 3 ans après la cessation de votre compte, conformément 
                aux obligations légales et comptables.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Partage des données
              </h2>
              <p>
                Vos données ne sont pas vendues ni louées à des tiers. Elles peuvent être partagées avec :
              </p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>Nos sous-traitants techniques (hébergement, paiement) dans le cadre strict de leurs missions</li>
                <li>Les autorités compétentes en cas d'obligation légale</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Vos droits
              </h2>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement ("droit à l'oubli")</li>
                <li>Droit à la portabilité de vos données</li>
                <li>Droit d'opposition et de limitation du traitement</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>
                Pour exercer ces droits, contactez-nous à : <strong>support@myponia.fr</strong>
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Sécurité
              </h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger 
                vos données contre tout accès non autorisé, modification, divulgation ou destruction. 
                Les données sont chiffrées en transit (HTTPS) et au repos.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Cookies
              </h2>
              <p>
                PONIA utilise des cookies essentiels au fonctionnement du service (session, authentification). 
                Aucun cookie publicitaire ou de tracking tiers n'est utilisé.
              </p>
            </section>

            <p style={{ 
              marginTop: '2rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid #E5E7EB',
              fontSize: '0.8125rem',
              color: '#6B7280' 
            }}>
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
