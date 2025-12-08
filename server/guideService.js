import PDFDocument from 'pdfkit'
import path from 'path'

export function generateGuidePDF() {
  const doc = new PDFDocument({ 
    size: 'A4',
    margin: 50,
    autoFirstPage: true
  })

  const BLACK = '#000000'
  const DARK_GRAY = '#333333'
  const MEDIUM_GRAY = '#666666'
  const LIGHT_GRAY = '#999999'
  const BORDER_GRAY = '#CCCCCC'

  const pageWidth = 595
  const contentWidth = 495
  const marginLeft = 50
  const bottomLimit = 760

  let currentPage = 1

  function checkSpace(needed) {
    if (doc.y + needed > bottomLimit) {
      doc.fontSize(8).fillColor(LIGHT_GRAY)
         .text(`- ${currentPage} -`, marginLeft, 805, { width: contentWidth, align: 'center' })
      doc.addPage()
      currentPage++
      doc.y = 50
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 1 - COUVERTURE
  // ═══════════════════════════════════════════════════════════════════════

  doc.rect(0, 0, pageWidth, 842).fill(BLACK)

  try {
    const logoPath = path.join(process.cwd(), 'attached_assets', 'A42D7ABB-7E36-43B3-BD70-585DF8064575_1765216861539.png')
    doc.image(logoPath, (pageWidth - 280) / 2, 220, { width: 280 })
  } catch (error) {
    doc.fontSize(48).fillColor('white').font('Helvetica-Bold')
       .text('PONIA', marginLeft, 240, { width: contentWidth, align: 'center' })
  }

  doc.fontSize(14).fillColor('white').font('Helvetica')
     .text('Gestion Intelligente de Stock', marginLeft, 360, { width: contentWidth, align: 'center' })

  doc.moveTo(180, 400).lineTo(415, 400).strokeColor('#FFFFFF').lineWidth(1).stroke()

  doc.fontSize(28).fillColor('white').font('Helvetica-Bold')
     .text('GUIDE COMPLET', marginLeft, 440, { width: contentWidth, align: 'center' })
  doc.fontSize(18).fillColor('white').font('Helvetica')
     .text('DE A \u00e0 Z', marginLeft, 475, { width: contentWidth, align: 'center' })

  doc.fontSize(10).fillColor('white').font('Helvetica')
     .text('myponia.fr', marginLeft, 780, { width: contentWidth, align: 'center' })

  doc.fontSize(8).fillColor(LIGHT_GRAY)
     .text(`- ${currentPage} -`, marginLeft, 805, { width: contentWidth, align: 'center' })

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 2+ - CONTENU
  // ═══════════════════════════════════════════════════════════════════════

  doc.addPage()
  currentPage++

  // SECTION: Pourquoi PONIA ?
  doc.fontSize(18).fillColor(BLACK).font('Helvetica-Bold')
     .text('Pourquoi PONIA ?', marginLeft, 50)
  doc.moveTo(marginLeft, 72).lineTo(180, 72).strokeColor(BLACK).lineWidth(2).stroke()
  doc.y = 85

  doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold')
     .text('Le probl\u00e8me que vous vivez chaque jour', marginLeft)
  doc.moveDown(0.3)

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'En tant que commer\u00e7ant dans le secteur alimentaire, vous connaissez cette situation : vous arrivez le matin et d\u00e9couvrez que vous \u00eates en rupture de stock sur un produit essentiel. Vos clients repartent d\u00e9\u00e7us, et vous perdez des ventes. \u00c0 l\'inverse, vous retrouvez r\u00e9guli\u00e8rement des produits p\u00e9rim\u00e9s au fond de votre r\u00e9serve, de l\'argent litt\u00e9ralement jet\u00e9 \u00e0 la poubelle.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 3 }
     )
  doc.moveDown(0.5)

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'G\u00e9rer son stock prend un temps fou. Entre les comptages manuels, les commandes \u00e0 passer aux diff\u00e9rents fournisseurs, le suivi des dates de p\u00e9remption, vous passez en moyenne 7 heures par semaine sur ces t\u00e2ches administratives. C\'est du temps que vous ne consacrez pas \u00e0 vos clients, \u00e0 la qualit\u00e9 de vos produits ou simplement \u00e0 votre vie personnelle.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 3 }
     )
  doc.moveDown(1)

  doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold')
     .text('PONIA : votre assistant de gestion intelligent', marginLeft)
  doc.moveDown(0.3)

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA est une application mobile et web con\u00e7ue sp\u00e9cifiquement pour les petits commerces alimentaires fran\u00e7ais. Notre intelligence artificielle analyse en continu votre stock, vos habitudes de vente et m\u00eame la m\u00e9t\u00e9o locale pour vous fournir des pr\u00e9dictions pr\u00e9cises et des recommandations personnalis\u00e9es.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 3 }
     )
  doc.moveDown(0.5)

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Contrairement aux logiciels complexes destin\u00e9s aux grandes surfaces, PONIA a \u00e9t\u00e9 pens\u00e9 pour \u00eatre utilis\u00e9 en 2 minutes par jour maximum, directement depuis votre t\u00e9l\u00e9phone pendant que vous \u00eates en r\u00e9serve ou derri\u00e8re votre comptoir. Pas besoin d\'\u00eatre un expert en informatique : si vous savez utiliser WhatsApp, vous savez utiliser PONIA.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 3 }
     )
  doc.moveDown(1)

  doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold')
     .text('Ce que PONIA change pour vous', marginLeft)
  doc.moveDown(0.3)

  const benefits = [
    { title: 'Z\u00e9ro rupture de stock', desc: 'L\'IA d\u00e9tecte les produits qui vont manquer avant que cela n\'arrive et vous alerte automatiquement.' },
    { title: 'Z\u00e9ro gaspillage', desc: 'Les alertes de p\u00e9remption vous pr\u00e9viennent 7 jours \u00e0 l\'avance pour \u00e9couler vos produits.' },
    { title: 'Plus de 7 heures lib\u00e9r\u00e9es par semaine', desc: 'Commandes automatiques, comptages simplifi\u00e9s, alertes intelligentes.' },
    { title: 'Des d\u00e9cisions \u00e9clair\u00e9es', desc: 'Gr\u00e2ce aux statistiques et pr\u00e9dictions IA, vous savez quoi commander et quand.' }
  ]

  benefits.forEach((b) => {
    checkSpace(30)
    doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold').text('\u2022 ' + b.title, marginLeft)
    doc.fontSize(9).fillColor(MEDIUM_GRAY).font('Helvetica')
       .text('  ' + b.desc, marginLeft, doc.y, { width: contentWidth, lineGap: 2 })
    doc.moveDown(0.4)
  })

  doc.moveDown(1)
  checkSpace(80)

  // SECTION: D\u00e9marrer avec PONIA
  doc.fontSize(18).fillColor(BLACK).font('Helvetica-Bold')
     .text('D\u00e9marrer avec PONIA', marginLeft)
  doc.moveTo(marginLeft, doc.y + 3).lineTo(210, doc.y + 3).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(0.8)

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La mise en place de PONIA dans votre commerce se fait en trois \u00e9tapes simples. En moins de 15 minutes, vous serez op\u00e9rationnel.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 3 }
     )
  doc.moveDown(0.8)

  const steps = [
    { num: '1', title: 'Cr\u00e9ez votre compte', desc: 'Rendez-vous sur myponia.fr et cliquez sur "Essai gratuit". Renseignez votre email, le nom de votre commerce et son adresse. Pas de carte bancaire demand\u00e9e. En 30 secondes, vous b\u00e9n\u00e9ficiez de 14 jours d\'essai gratuit.' },
    { num: '2', title: 'Ajoutez vos produits', desc: 'Depuis l\'onglet Stock, ajoutez vos produits avec leur nom, quantit\u00e9, unit\u00e9 de mesure et seuil d\'alerte. Commencez par vos 10 produits les plus importants.' },
    { num: '3', title: 'Laissez l\'IA travailler', desc: 'D\u00e8s que vos produits sont enregistr\u00e9s, PONIA analyse votre stock, d\u00e9tecte les risques et pr\u00e9pare ses recommandations. Votre seul travail : mettre \u00e0 jour les quantit\u00e9s en quelques clics.' }
  ]

  steps.forEach((s) => {
    checkSpace(55)
    const boxY = doc.y
    doc.roundedRect(marginLeft, boxY, contentWidth, 50, 5).strokeColor(BORDER_GRAY).lineWidth(1).stroke()
    doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text(s.num, marginLeft + 15, boxY + 15)
    doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold').text(s.title, marginLeft + 45, boxY + 8)
    doc.fontSize(9).fillColor(DARK_GRAY).font('Helvetica')
       .text(s.desc, marginLeft + 45, boxY + 22, { width: contentWidth - 60, lineGap: 2 })
    doc.y = boxY + 55
  })

  doc.moveDown(1)
  checkSpace(80)

  // SECTION: G\u00e9rer votre stock
  doc.fontSize(18).fillColor(BLACK).font('Helvetica-Bold')
     .text('G\u00e9rer votre stock au quotidien', marginLeft)
  doc.moveTo(marginLeft, doc.y + 3).lineTo(260, doc.y + 3).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(0.8)

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'interface de gestion de stock a \u00e9t\u00e9 con\u00e7ue pour \u00eatre utilis\u00e9e rapidement, m\u00eame pendant un rush. Chaque fonctionnalit\u00e9 est accessible en un ou deux clics.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 3 }
     )
  doc.moveDown(0.8)

  const stockFeatures = [
    { title: 'Ajouter un produit', desc: 'Renseignez le nom, la cat\u00e9gorie, la quantit\u00e9 en stock, l\'unit\u00e9 de mesure, le seuil d\'alerte, le prix d\'achat et la date de p\u00e9remption si applicable.' },
    { title: 'Ajustements rapides', desc: 'Boutons "+" et "-" pour ajuster les quantit\u00e9s instantan\u00e9ment. Un appui prolong\u00e9 permet de saisir un nombre pr\u00e9cis.' },
    { title: 'Seuils d\'alerte', desc: 'D\u00e9finissez la quantit\u00e9 minimale sous laquelle PONIA vous pr\u00e9vient qu\'il est temps de commander.' },
    { title: 'Codes couleur', desc: 'Vert = stock sain, Orange = stock bas, Rouge = stock critique. Identifiez l\'\u00e9tat de votre stock en un coup d\'oeil.' }
  ]

  stockFeatures.forEach((f) => {
    checkSpace(35)
    doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold').text('\u2022 ' + f.title, marginLeft)
    doc.fontSize(9).fillColor(MEDIUM_GRAY).font('Helvetica')
       .text('  ' + f.desc, marginLeft, doc.y, { width: contentWidth, lineGap: 2 })
    doc.moveDown(0.5)
  })

  doc.moveDown(1)
  checkSpace(80)

  // SECTION: L'IA PONIA
  doc.fontSize(18).fillColor(BLACK).font('Helvetica-Bold')
     .text('L\'intelligence artificielle PONIA', marginLeft)
  doc.moveTo(marginLeft, doc.y + 3).lineTo(280, doc.y + 3).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(0.8)

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Ce qui diff\u00e9rencie PONIA des simples tableurs, c\'est son intelligence artificielle. Elle analyse vos donn\u00e9es en permanence pour vous fournir des informations exploitables.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 3 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold').text('Les 8 types de suggestions intelligentes', marginLeft)
  doc.moveDown(0.4)

  const suggestions = [
    'Alertes de p\u00e9remption : produits expirant dans les 7 jours',
    'Pr\u00e9dictions de rupture : anticipation des stocks \u00e0 z\u00e9ro',
    'D\u00e9tection de surstock : produits qui stagnent trop longtemps',
    'Pr\u00e9dictions m\u00e9t\u00e9o : impact du temps sur vos ventes',
    'D\u00e9tection d\'anomalies : erreurs de saisie ou vols potentiels',
    'Id\u00e9es plat du jour : suggestions pour \u00e9couler les produits',
    'Rappels de commande : cycles de commande appris automatiquement',
    'Tendances de vente : pics de demande anticip\u00e9s'
  ]

  suggestions.forEach((s, i) => {
    checkSpace(15)
    doc.fontSize(9).fillColor(DARK_GRAY).font('Helvetica')
       .text((i + 1) + '. ' + s, marginLeft + 10, doc.y)
    doc.moveDown(0.2)
  })

  doc.moveDown(0.6)
  checkSpace(50)

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold').text('Le Chat IA', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(9).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Posez vos questions en langage naturel : "Qu\'est-ce que je dois commander ?", "Quels produits vont p\u00e9rimer ?". L\'IA r\u00e9pond instantan\u00e9ment avec des informations personnalis\u00e9es.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 2 }
     )

  doc.moveDown(1)
  checkSpace(80)

  // SECTION: Commandes et alertes
  doc.fontSize(18).fillColor(BLACK).font('Helvetica-Bold')
     .text('Commandes et alertes', marginLeft)
  doc.moveTo(marginLeft, doc.y + 3).lineTo(210, doc.y + 3).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold').text('G\u00e9n\u00e9ration automatique des bons de commande', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(9).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'En un clic, l\'IA analyse vos produits, identifie ceux qui n\u00e9cessitent un r\u00e9approvisionnement et g\u00e9n\u00e8re un document PDF complet avec la liste des produits, les quantit\u00e9s sugg\u00e9r\u00e9es, les prix et le montant total.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 2 }
     )
  doc.moveDown(0.6)

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold').text('Trois fa\u00e7ons d\'envoyer vos commandes', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(9).fillColor(DARK_GRAY).font('Helvetica')
     .text('\u2022 T\u00e9l\u00e9chargement PDF : imprimez ou envoyez par email', marginLeft)
     .text('\u2022 Copie WhatsApp : collez directement dans une conversation', marginLeft)
     .text('\u2022 Envoi par email : directement au fournisseur', marginLeft)
  doc.moveDown(0.6)

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold').text('Syst\u00e8me d\'alertes', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(9).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Alertes automatiques par email ou dans l\'application : stock bas, p\u00e9remption (7j, 3j, 1j avant), anomalies, r\u00e9sum\u00e9 quotidien. Les alertes sont group\u00e9es intelligemment pour ne pas vous submerger.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 2 }
     )

  doc.moveDown(1)
  checkSpace(180)

  // SECTION: Offres tarifaires
  doc.fontSize(18).fillColor(BLACK).font('Helvetica-Bold')
     .text('Nos offres tarifaires', marginLeft)
  doc.moveTo(marginLeft, doc.y + 3).lineTo(190, doc.y + 3).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(0.8)

  doc.fontSize(9).fillColor(DARK_GRAY).font('Helvetica')
     .text('Toutes les formules incluent un essai gratuit de 14 jours sans engagement.', marginLeft)
  doc.moveDown(0.6)

  const plans = [
    { name: 'BASIQUE - GRATUIT', features: '10 produits, 5 messages IA/jour, alertes stock bas' },
    { name: 'STANDARD - 49\u20ac/mois', features: '50 produits, IA illimit\u00e9e, int\u00e9grations POS, pr\u00e9dictions 7 jours, support email 24h' },
    { name: 'PRO - 69\u20ac/mois', features: 'Produits illimit\u00e9s, commandes vocales, pr\u00e9dictions 30 jours, multi-magasins, support prioritaire' }
  ]

  plans.forEach((p, i) => {
    checkSpace(40)
    const boxY = doc.y
    const lineW = i === 1 ? 2 : 1
    doc.roundedRect(marginLeft, boxY, contentWidth, 35, 5).strokeColor(BLACK).lineWidth(lineW).stroke()
    doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold').text(p.name, marginLeft + 15, boxY + 8)
    doc.fontSize(9).fillColor(MEDIUM_GRAY).font('Helvetica').text(p.features, marginLeft + 15, boxY + 22, { width: contentWidth - 30 })
    doc.y = boxY + 40
  })

  doc.moveDown(0.5)
  doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
     .text('Sans engagement - Annulation possible \u00e0 tout moment', marginLeft, doc.y, { width: contentWidth, align: 'center' })

  doc.moveDown(1)
  checkSpace(120)

  // SECTION: Contact et FAQ
  doc.fontSize(18).fillColor(BLACK).font('Helvetica-Bold')
     .text('Contact et support', marginLeft)
  doc.moveTo(marginLeft, doc.y + 3).lineTo(180, doc.y + 3).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(0.8)

  doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold').text('Email : ', marginLeft, doc.y, { continued: true })
  doc.font('Helvetica').fillColor(DARK_GRAY).text('support@myponia.fr')
  doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold').text('Site web : ', marginLeft, doc.y, { continued: true })
  doc.font('Helvetica').fillColor(DARK_GRAY).text('myponia.fr')
  doc.fontSize(9).fillColor(MEDIUM_GRAY).font('Helvetica').text('R\u00e9ponse garantie sous 24 heures ouvrables', marginLeft)

  doc.moveDown(0.8)
  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold').text('Questions fr\u00e9quentes', marginLeft)
  doc.moveDown(0.4)

  const faqs = [
    { q: 'Mes donn\u00e9es sont-elles s\u00e9curis\u00e9es ?', a: 'Oui. Donn\u00e9es chiffr\u00e9es, serveurs s\u00e9curis\u00e9s en Europe, aucun partage avec des tiers.' },
    { q: 'Puis-je annuler \u00e0 tout moment ?', a: 'Oui, sans engagement. Annulation en un clic depuis votre compte.' },
    { q: 'PONIA fonctionne avec ma caisse ?', a: 'Int\u00e9grations Square, Zettle, SumUp, Lightspeed incluses (Standard/Pro).' }
  ]

  faqs.forEach((faq) => {
    checkSpace(35)
    doc.fontSize(9).fillColor(BLACK).font('Helvetica-Bold').text(faq.q, marginLeft)
    doc.fontSize(8).fillColor(MEDIUM_GRAY).font('Helvetica')
       .text(faq.a, marginLeft + 10, doc.y, { width: contentWidth - 15, lineGap: 1 })
    doc.moveDown(0.4)
  })

  doc.moveDown(1)

  doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold')
     .text('Merci de votre confiance', marginLeft, doc.y, { width: contentWidth, align: 'center' })
  doc.fontSize(10).fillColor(MEDIUM_GRAY).font('Helvetica')
     .text('L\'\u00e9quipe PONIA', marginLeft, doc.y, { width: contentWidth, align: 'center' })

  doc.moveDown(1)

  try {
    const logoPath = path.join(process.cwd(), 'attached_assets', 'F9D5EF8F-6E89-4D34-B41E-18582D13423F_1765216861539.png')
    doc.image(logoPath, (pageWidth - 50) / 2, doc.y, { width: 50 })
  } catch (error) {
    doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
       .text('PONIA', marginLeft, doc.y, { width: contentWidth, align: 'center' })
  }

  doc.fontSize(8).fillColor(LIGHT_GRAY)
     .text(`- ${currentPage} -`, marginLeft, 805, { width: contentWidth, align: 'center' })

  return doc
}
