import React from 'react'
import { ArrowLeft, Linkedin, Twitter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import poniaLogo from '../assets/ponia-logo.png'

export default function MentionsLegalesPage() {
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
              Mentions légales
            </h1>
          </div>

          <div style={{ lineHeight: '1.8', color: '#374151' }}>
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Éditeur du site
              </h2>
              <p style={{ margin: '0.5rem 0' }}><strong>Nom :</strong> Enock Ligue</p>
              <p style={{ margin: '0.5rem 0' }}><strong>Statut :</strong> Entrepreneur individuel</p>
              <p style={{ margin: '0.5rem 0' }}><strong>SIRET :</strong> 99445226600012</p>
              <p style={{ margin: '0.5rem 0' }}><strong>Email :</strong> support@myponia.fr</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Hébergement
              </h2>
              <p style={{ margin: '0.5rem 0' }}><strong>Hébergeur :</strong> Replit, Inc.</p>
              <p style={{ margin: '0.5rem 0' }}>San Francisco, Californie, États-Unis</p>
              <p style={{ margin: '0.5rem 0' }}>Site : replit.com</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Propriété intellectuelle
              </h2>
              <p>
                L'ensemble des contenus présents sur le site PONIA (textes, images, graphismes, logo, icônes) 
                sont la propriété exclusive d'Enock Ligue, sauf mention contraire. Toute reproduction, distribution, 
                modification ou utilisation de ces contenus sans autorisation préalable est interdite.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Responsabilité
              </h2>
              <p>
                PONIA s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. 
                Toutefois, PONIA ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations 
                mises à disposition. En conséquence, PONIA décline toute responsabilité pour les éventuelles 
                imprécisions, inexactitudes ou omissions.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Nous suivre
              </h2>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <a
                  href="https://www.linkedin.com/in/enock-ligue-238230396"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: '#0077B5',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  <Linkedin size={18} />
                  LinkedIn
                </a>
                <a
                  href="https://x.com/ponia_hq"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: '#000000',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  <Twitter size={18} />
                  X (Twitter)
                </a>
              </div>
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
