import { useNavigate } from 'react-router-dom'

export default function PrivacyPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <nav style={{
        background: 'rgba(255,255,255,0.95)',
        padding: '1rem 2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>
            PONIA AI
          </h1>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Retour à l'accueil
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '3rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
            Politique de Confidentialité
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '2rem' }}>
            Dernière mise à jour : 9 novembre 2025
          </p>

          <Section title="1. Responsable du traitement">
            <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '12px', marginBottom: '1rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#1a1a1a' }}>
                ENOCK LIGUE
              </p>
              <p style={{ margin: '0.25rem 0', color: '#444' }}>
                📧 Email : support@myponia.fr
              </p>
            </div>
            <p>
              PONIA AI s'engage à protéger la confidentialité de vos données personnelles conformément au RGPD.
            </p>
          </Section>

          <Section title="2. Données collectées">
            <p>Nous collectons les informations suivantes :</p>
            <ul style={{ lineHeight: '1.8', color: '#444', marginLeft: '1.5rem' }}>
              <li><strong>Informations de compte :</strong> Adresse email, nom du commerce, type d'activité</li>
              <li><strong>Données de gestion de stock :</strong> Produits, quantités, alertes, historique</li>
              <li><strong>Données d'utilisation :</strong> Interactions avec l'IA, commandes générées, préférences</li>
              <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, système d'exploitation (pour la sécurité)</li>
            </ul>
          </Section>

          <Section title="3. Bases légales du traitement">
            <p>Nous traitons vos données sur les bases légales suivantes :</p>
            <ul style={{ lineHeight: '1.8', color: '#444', marginLeft: '1.5rem' }}>
              <li><strong>Exécution du contrat :</strong> Fourniture des services PONIA AI (article 6.1.b RGPD)</li>
              <li><strong>Intérêt légitime :</strong> Amélioration du service, prévention des fraudes, sécurité (article 6.1.f RGPD)</li>
              <li><strong>Consentement :</strong> Envoi de communications marketing (article 6.1.a RGPD)</li>
              <li><strong>Obligation légale :</strong> Conservation des données de facturation (article 6.1.c RGPD)</li>
            </ul>
          </Section>

          <Section title="4. Utilisation des données">
            <p>Vos données sont utilisées exclusivement pour :</p>
            <ul style={{ lineHeight: '1.8', color: '#444', marginLeft: '1.5rem' }}>
              <li>Fournir et améliorer nos services de gestion de stock</li>
              <li>Générer des prédictions IA personnalisées pour votre commerce</li>
              <li>Envoyer des alertes de stock et notifications importantes</li>
              <li>Assurer la sécurité et prévenir les fraudes</li>
              <li>Répondre à vos demandes de support</li>
            </ul>
            <p style={{ marginTop: '1rem', fontWeight: '600', color: '#667eea' }}>
              Nous ne vendons JAMAIS vos données à des tiers.
            </p>
          </Section>

          <Section title="5. Partage et transferts internationaux">
            <p>Nous partageons vos données uniquement avec nos partenaires techniques essentiels :</p>
            <ul style={{ lineHeight: '1.8', color: '#444', marginLeft: '1.5rem' }}>
              <li><strong>Supabase :</strong> Hébergement sécurisé de la base de données (serveurs européens conformes RGPD)</li>
              <li><strong>OpenAI :</strong> Traitement des requêtes IA (données anonymisées, pas de stockage long-terme)</li>
              <li><strong>Stripe :</strong> Traitement des paiements (uniquement pour les abonnements payants)</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              Tous nos partenaires sont conformes RGPD et ne traitent vos données que selon nos instructions strictes.
            </p>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff7ed', borderRadius: '8px', borderLeft: '4px solid #fb923c' }}>
              <p style={{ margin: 0, fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                Transferts hors UE
              </p>
              <p style={{ margin: 0, color: '#444' }}>
                Certains sous-traitants (OpenAI) peuvent traiter vos données hors de l'Union Européenne. Dans ce cas, 
                nous garantissons un niveau de protection équivalent via les Clauses Contractuelles Types (CCT) validées par la Commission Européenne.
              </p>
            </div>
          </Section>

          <Section title="6. Vos droits (RGPD)">
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul style={{ lineHeight: '1.8', color: '#444', marginLeft: '1.5rem' }}>
              <li><strong>Droit d'accès (Art. 15) :</strong> Consulter toutes les données que nous détenons sur vous</li>
              <li><strong>Droit de rectification (Art. 16) :</strong> Corriger vos informations inexactes</li>
              <li><strong>Droit à l'effacement (Art. 17) :</strong> Supprimer définitivement votre compte et toutes vos données</li>
              <li><strong>Droit à la portabilité (Art. 20) :</strong> Récupérer vos données dans un format exploitable (JSON/CSV)</li>
              <li><strong>Droit d'opposition (Art. 21) :</strong> Refuser le traitement de vos données à des fins marketing</li>
              <li><strong>Droit à la limitation (Art. 18) :</strong> Limiter temporairement le traitement de vos données</li>
            </ul>
            <p style={{ marginTop: '1rem', padding: '1rem', background: '#f0f4ff', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
              Pour exercer vos droits, contactez-nous à <strong>support@myponia.fr</strong> - Réponse garantie sous 72h (1 mois maximum).
            </p>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
              <p style={{ margin: 0, fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                Droit de réclamation
              </p>
              <p style={{ margin: 0, color: '#444' }}>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de la 
                <strong> CNIL (Commission Nationale de l'Informatique et des Libertés)</strong> :<br/>
                • En ligne : <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>www.cnil.fr/fr/plaintes</a><br/>
                • Par courrier : CNIL, 3 Place de Fontenoy, TSA 80715, 75334 PARIS CEDEX 07
              </p>
            </div>
          </Section>

          <Section title="7. Sécurité des données">
            <p>Nous mettons en œuvre des mesures de sécurité strictes :</p>
            <ul style={{ lineHeight: '1.8', color: '#444', marginLeft: '1.5rem' }}>
              <li>Chiffrement SSL/TLS de toutes les communications</li>
              <li>Authentification JWT sécurisée avec vérification systématique</li>
              <li>Hébergement sur serveurs sécurisés conformes ISO 27001</li>
              <li>Sauvegardes quotidiennes automatiques</li>
              <li>Accès aux données strictement limité aux personnels autorisés</li>
            </ul>
          </Section>

          <Section title="8. Cookies et traceurs">
            <p>
              PONIA AI utilise uniquement des cookies essentiels au fonctionnement du service (session utilisateur, authentification).
              Nous n'utilisons pas de cookies publicitaires ou de suivi tiers.
            </p>
          </Section>

          <Section title="9. Conservation des données">
            <ul style={{ lineHeight: '1.8', color: '#444', marginLeft: '1.5rem' }}>
              <li><strong>Compte actif :</strong> Vos données sont conservées tant que votre compte est actif</li>
              <li><strong>Après suppression :</strong> Effacement définitif sous 30 jours (sauf obligations légales)</li>
              <li><strong>Données de facturation :</strong> Conservées 10 ans (obligation légale comptable)</li>
            </ul>
          </Section>

          <Section title="10. Modifications de la politique">
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité. Toute modification 
              substantielle sera notifiée par email 30 jours avant son entrée en vigueur.
            </p>
          </Section>

          <Section title="11. Contact">
            <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '12px', marginTop: '1rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#1a1a1a' }}>
                ENOCK LIGUE
              </p>
              <p style={{ margin: '0.25rem 0', color: '#444' }}>
                📧 Email : <a href="mailto:support@myponia.fr" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>support@myponia.fr</a>
              </p>
            </div>
          </Section>
        </div>

        <footer style={{ textAlign: 'center', marginTop: '3rem', color: 'white' }}>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1rem' }}>
            <a href="/terms" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>Conditions d'utilisation</a>
            <a href="/pricing" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>Tarifs</a>
            <a href="mailto:support@myponia.fr" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>Contact</a>
          </div>
          <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
            © {new Date().getFullYear()} ENOCK LIGUE - Tous droits réservés
          </p>
        </footer>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>
        {title}
      </h2>
      <div style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#444' }}>
        {children}
      </div>
    </div>
  )
}
