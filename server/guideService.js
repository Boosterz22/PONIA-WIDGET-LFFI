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

  let currentPage = 1

  function addPageNumber() {
    doc.fontSize(9).fillColor(LIGHT_GRAY)
       .text(`Page ${currentPage}`, marginLeft, 800, { width: contentWidth, align: 'center' })
  }

  function newPage() {
    addPageNumber()
    doc.addPage()
    currentPage++
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 1 - COUVERTURE
  // ═══════════════════════════════════════════════════════════════════════

  doc.rect(0, 0, pageWidth, 842).fill(BLACK)

  try {
    const logoPath = path.join(process.cwd(), 'attached_assets', 'A42D7ABB-7E36-43B3-BD70-585DF8064575_1765216861539.png')
    doc.image(logoPath, (pageWidth - 280) / 2, 180, { width: 280 })
  } catch (error) {
    doc.fontSize(48).fillColor('white').font('Helvetica-Bold')
       .text('PONIA', marginLeft, 200, { width: contentWidth, align: 'center' })
  }

  doc.fontSize(14).fillColor('white').font('Helvetica')
     .text('Gestion Intelligente de Stock', marginLeft, 320, { width: contentWidth, align: 'center' })

  doc.moveTo(180, 360).lineTo(415, 360).strokeColor('#FFFFFF').lineWidth(1).stroke()

  doc.fontSize(28).fillColor('white').font('Helvetica-Bold')
     .text('GUIDE COMPLET', marginLeft, 400, { width: contentWidth, align: 'center' })
  doc.fontSize(18).fillColor('white').font('Helvetica')
     .text('DE A \u00e0 Z', marginLeft, 435, { width: contentWidth, align: 'center' })

  doc.fontSize(11).fillColor(LIGHT_GRAY).font('Helvetica')
     .text('Pour les boulangeries, restaurants, bars,', marginLeft, 520, { width: contentWidth, align: 'center' })
     .text('caves \u00e0 vin et fromageries', marginLeft, 535, { width: contentWidth, align: 'center' })

  doc.fontSize(10).fillColor('white').font('Helvetica')
     .text('myponia.fr', marginLeft, 750, { width: contentWidth, align: 'center' })

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 2 - PRESENTATION PONIA
  // ═══════════════════════════════════════════════════════════════════════

  newPage()

  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Pourquoi PONIA ?', marginLeft, 50)

  doc.moveTo(marginLeft, 78).lineTo(200, 78).strokeColor(BLACK).lineWidth(2).stroke()

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Le probl\u00e8me que vous vivez chaque jour', marginLeft, 100)

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'En tant que commer\u00e7ant dans le secteur alimentaire, vous connaissez cette situation : vous arrivez le matin et d\u00e9couvrez que vous \u00eates en rupture de stock sur un produit essentiel. Vos clients repartent d\u00e9\u00e7us, et vous perdez des ventes. \u00c0 l\'inverse, vous retrouvez r\u00e9guli\u00e8rement des produits p\u00e9rim\u00e9s au fond de votre r\u00e9serve, de l\'argent litt\u00e9ralement jet\u00e9 \u00e0 la poubelle.',
       marginLeft, 120, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'G\u00e9rer son stock prend un temps fou. Entre les comptages manuels, les commandes \u00e0 passer aux diff\u00e9rents fournisseurs, le suivi des dates de p\u00e9remption, vous passez en moyenne 7 heures par semaine sur ces t\u00e2ches administratives. C\'est du temps que vous ne consacrez pas \u00e0 vos clients, \u00e0 la qualit\u00e9 de vos produits ou simplement \u00e0 votre vie personnelle.',
       marginLeft, 175, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('PONIA : votre assistant de gestion intelligent', marginLeft, 245)

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA est une application mobile et web con\u00e7ue sp\u00e9cifiquement pour les petits commerces alimentaires fran\u00e7ais. Notre intelligence artificielle analyse en continu votre stock, vos habitudes de vente et m\u00eame la m\u00e9t\u00e9o locale pour vous fournir des pr\u00e9dictions pr\u00e9cises et des recommandations personnalis\u00e9es.',
       marginLeft, 265, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Contrairement aux logiciels complexes destin\u00e9s aux grandes surfaces, PONIA a \u00e9t\u00e9 pens\u00e9 pour \u00eatre utilis\u00e9 en 2 minutes par jour maximum, directement depuis votre t\u00e9l\u00e9phone pendant que vous \u00eates en r\u00e9serve ou derri\u00e8re votre comptoir. Pas besoin d\'\u00eatre un expert en informatique : si vous savez utiliser WhatsApp, vous savez utiliser PONIA.',
       marginLeft, 320, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Ce que PONIA change pour vous', marginLeft, 390)

  const benefits = [
    { title: 'Z\u00e9ro rupture de stock', desc: 'L\'IA d\u00e9tecte les produits qui vont manquer avant que cela n\'arrive et vous alerte automatiquement. Vous ne perdez plus de ventes.' },
    { title: 'Z\u00e9ro gaspillage', desc: 'Les alertes de p\u00e9remption vous pr\u00e9viennent 7 jours \u00e0 l\'avance. Vous avez le temps d\'\u00e9couler vos produits via des promotions ou le plat du jour.' },
    { title: 'Plus de 7 heures lib\u00e9r\u00e9es par semaine', desc: 'Les commandes sont g\u00e9n\u00e9r\u00e9es automatiquement, les comptages sont simplifi\u00e9s, les alertes remplacent votre charge mentale. Vous gagnez du temps.' },
    { title: 'Des d\u00e9cisions \u00e9clair\u00e9es', desc: 'Gr\u00e2ce aux statistiques et aux pr\u00e9dictions de l\'IA, vous savez exactement ce qu\'il faut commander, en quelle quantit\u00e9 et \u00e0 quel moment.' }
  ]

  let yPos = 410
  benefits.forEach((b) => {
    doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
       .text(b.title, marginLeft + 15, yPos)
    doc.fontSize(9).fillColor(MEDIUM_GRAY).font('Helvetica')
       .text(b.desc, marginLeft + 15, yPos + 12, { width: contentWidth - 20, lineGap: 2 })
    yPos += 48
  })

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 3 - DEMARRAGE RAPIDE
  // ═══════════════════════════════════════════════════════════════════════

  newPage()

  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('D\u00e9marrer avec PONIA', marginLeft, 50)

  doc.moveTo(marginLeft, 78).lineTo(240, 78).strokeColor(BLACK).lineWidth(2).stroke()

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La mise en place de PONIA dans votre commerce se fait en trois \u00e9tapes simples. En moins de 15 minutes, vous serez op\u00e9rationnel et l\'intelligence artificielle commencera \u00e0 travailler pour vous.',
       marginLeft, 95, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  doc.roundedRect(marginLeft, 140, contentWidth, 120, 8).strokeColor(BORDER_GRAY).lineWidth(1).stroke()
  doc.fontSize(32).fillColor(BLACK).font('Helvetica-Bold').text('1', marginLeft + 20, 160)
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Cr\u00e9ez votre compte', marginLeft + 60, 155)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Rendez-vous sur myponia.fr et cliquez sur "Essai gratuit". Renseignez simplement votre adresse email, le nom de votre commerce et son adresse. C\'est tout. Pas de carte bancaire demand\u00e9e, pas de formulaire interminable. En 30 secondes, votre compte est cr\u00e9\u00e9 et vous b\u00e9n\u00e9ficiez automatiquement de 14 jours d\'essai gratuit avec toutes les fonctionnalit\u00e9s.',
       marginLeft + 60, 175, { width: contentWidth - 80, align: 'justify', lineGap: 3 }
     )

  doc.roundedRect(marginLeft, 275, contentWidth, 140, 8).strokeColor(BORDER_GRAY).lineWidth(1).stroke()
  doc.fontSize(32).fillColor(BLACK).font('Helvetica-Bold').text('2', marginLeft + 20, 295)
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Ajoutez vos premiers produits', marginLeft + 60, 290)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Depuis l\'onglet "Stock", appuyez sur le bouton "Ajouter un produit". Pour chaque article, indiquez son nom, la quantit\u00e9 actuellement en stock, l\'unit\u00e9 de mesure (pi\u00e8ces, kilos, litres) et le seuil d\'alerte souhait\u00e9. Ce seuil repr\u00e9sente la quantit\u00e9 minimale en dessous de laquelle vous souhaitez \u00eatre pr\u00e9venu.',
       marginLeft + 60, 310, { width: contentWidth - 80, align: 'justify', lineGap: 3 }
     )
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Conseil : commencez par vos 10 produits les plus importants. Vous pourrez toujours en ajouter d\'autres progressivement. L\'objectif est de d\u00e9marrer rapidement, pas de tout saisir d\'un coup.',
       marginLeft + 60, 365, { width: contentWidth - 80, align: 'justify', lineGap: 3 }
     )

  doc.roundedRect(marginLeft, 430, contentWidth, 120, 8).strokeColor(BORDER_GRAY).lineWidth(1).stroke()
  doc.fontSize(32).fillColor(BLACK).font('Helvetica-Bold').text('3', marginLeft + 20, 450)
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Laissez l\'IA travailler pour vous', marginLeft + 60, 445)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'D\u00e8s que vos produits sont enregistr\u00e9s, PONIA commence son analyse. L\'intelligence artificielle calcule votre score de sant\u00e9 stock, d\u00e9tecte les risques de rupture et de p\u00e9remption, et pr\u00e9pare ses premi\u00e8res recommandations. Vous recevrez des alertes par email et dans l\'application d\u00e8s qu\'une action est n\u00e9cessaire. Votre seul travail quotidien : mettre \u00e0 jour les quantit\u00e9s en quelques clics apr\u00e8s chaque r\u00e9ception ou vente importante.',
       marginLeft + 60, 465, { width: contentWidth - 80, align: 'justify', lineGap: 3 }
     )

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold')
     .text('Temps total de mise en place : environ 15 minutes', marginLeft, 580, { width: contentWidth, align: 'center' })

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 4 - GESTION DU STOCK
  // ═══════════════════════════════════════════════════════════════════════

  newPage()

  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('G\u00e9rer votre stock au quotidien', marginLeft, 50)

  doc.moveTo(marginLeft, 78).lineTo(290, 78).strokeColor(BLACK).lineWidth(2).stroke()

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'interface de gestion de stock de PONIA a \u00e9t\u00e9 con\u00e7ue pour \u00eatre utilis\u00e9e rapidement, m\u00eame avec les mains occup\u00e9es ou pendant un rush. Chaque fonctionnalit\u00e9 est accessible en un ou deux clics maximum.',
       marginLeft, 95, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  doc.fontSize(13).fillColor(BLACK).font('Helvetica-Bold').text('Ajouter un produit', marginLeft, 140)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Pour chaque produit, vous pouvez renseigner : le nom du produit, la cat\u00e9gorie (boulangerie, boissons, frais, etc.), la quantit\u00e9 en stock, l\'unit\u00e9 de mesure, le seuil d\'alerte minimum, le prix d\'achat unitaire, le fournisseur associ\u00e9 et la date de p\u00e9remption si applicable. Seuls le nom, la quantit\u00e9 et le seuil sont obligatoires. Les autres informations permettent \u00e0 l\'IA de vous fournir des recommandations plus pr\u00e9cises.',
       marginLeft, 158, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  doc.fontSize(13).fillColor(BLACK).font('Helvetica-Bold').text('Ajustements rapides', marginLeft, 225)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Chaque produit affiche deux boutons : un "+" pour ajouter du stock lors d\'une r\u00e9ception, et un "-" pour retirer du stock apr\u00e8s une vente ou une perte. Un simple appui ajuste la quantit\u00e9 d\'une unit\u00e9. Un appui prolong\u00e9 permet de saisir un nombre pr\u00e9cis. Cette m\u00e9thode vous permet de mettre \u00e0 jour votre stock en moins de 30 secondes, directement depuis votre t\u00e9l\u00e9phone.',
       marginLeft, 243, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  doc.fontSize(13).fillColor(BLACK).font('Helvetica-Bold').text('Les seuils d\'alerte', marginLeft, 310)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le seuil d\'alerte est la quantit\u00e9 minimale en dessous de laquelle PONIA vous pr\u00e9vient qu\'il est temps de commander. Par exemple, si vous d\u00e9finissez un seuil de 5 pour votre farine, d\u00e8s que votre stock passe \u00e0 4 sacs ou moins, vous recevez une notification. Choisissez ce seuil en fonction de vos d\u00e9lais de livraison habituels : si votre fournisseur livre en 48 heures et que vous utilisez 2 sacs par jour, un seuil de 5 vous laisse une marge de s\u00e9curit\u00e9.',
       marginLeft, 328, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  doc.fontSize(13).fillColor(BLACK).font('Helvetica-Bold').text('Le syst\u00e8me de couleurs', marginLeft, 400)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Pour identifier en un coup d\'oeil l\'\u00e9tat de votre stock, chaque produit est color\u00e9 selon son niveau :',
       marginLeft, 418, { width: contentWidth, lineGap: 3 }
     )

  const colors = [
    { label: 'Vert', desc: 'Stock sain, au-dessus du seuil d\'alerte. Aucune action requise.' },
    { label: 'Orange', desc: 'Stock bas, proche du seuil. Il serait prudent de pr\u00e9voir une commande.' },
    { label: 'Rouge', desc: 'Stock critique, en dessous du seuil. Commande urgente recommand\u00e9e.' }
  ]

  yPos = 445
  colors.forEach((c) => {
    doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold').text(c.label + ' :', marginLeft + 15, yPos, { continued: true })
    doc.font('Helvetica').fillColor(DARK_GRAY).text(' ' + c.desc)
    yPos += 20
  })

  doc.fontSize(13).fillColor(BLACK).font('Helvetica-Bold').text('Recherche et filtres', marginLeft, 520)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La barre de recherche vous permet de trouver instantan\u00e9ment un produit par son nom. Les filtres vous permettent d\'afficher uniquement les produits d\'une cat\u00e9gorie, ceux en stock bas, ou ceux proches de la p\u00e9remption. Ces outils sont particuli\u00e8rement utiles lorsque vous g\u00e9rez plus de 30 produits.',
       marginLeft, 538, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 5 - L'IA PONIA
  // ═══════════════════════════════════════════════════════════════════════

  newPage()

  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('L\'intelligence artificielle PONIA', marginLeft, 50)

  doc.moveTo(marginLeft, 78).lineTo(320, 78).strokeColor(BLACK).lineWidth(2).stroke()

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Ce qui diff\u00e9rencie PONIA des simples tableurs ou applications de stock basiques, c\'est son intelligence artificielle. Elle analyse vos donn\u00e9es en permanence pour vous fournir des informations exploitables, pas juste des chiffres.',
       marginLeft, 95, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Les huit types de suggestions intelligentes', marginLeft, 145)

  const suggestions = [
    { title: 'Alertes de p\u00e9remption', desc: 'L\'IA identifie les produits qui vont expirer dans les 7 prochains jours et vous sugg\u00e8re des actions : promotion, plat du jour, don.' },
    { title: 'Pr\u00e9dictions de rupture', desc: 'En analysant votre rythme de consommation, PONIA pr\u00e9voit quand un produit va tomber en rupture et vous alerte plusieurs jours \u00e0 l\'avance.' },
    { title: 'D\u00e9tection de surstock', desc: 'L\'IA rep\u00e8re les produits qui stagnent depuis trop longtemps et qui risquent de se p\u00e9rimer ou de vous immobiliser de la tr\u00e9sorerie.' },
    { title: 'Pr\u00e9dictions m\u00e9t\u00e9o', desc: 'PONIA int\u00e8gre les pr\u00e9visions m\u00e9t\u00e9orologiques locales. Il sait que les jours de canicule, vous vendez plus de boissons fra\u00eeches.' },
    { title: 'D\u00e9tection d\'anomalies', desc: 'Si une quantit\u00e9 semble anormale (erreur de saisie, vol potentiel), l\'IA vous le signale pour v\u00e9rification.' },
    { title: 'Id\u00e9es plat du jour', desc: 'En fonction des produits \u00e0 \u00e9couler rapidement, PONIA peut sugg\u00e9rer des id\u00e9es de plats ou de promotions pertinentes.' },
    { title: 'Rappels de commande', desc: 'L\'IA apprend vos cycles de commande et vous rappelle quand il est temps de passer commande aupr\u00e8s de vos fournisseurs habituels.' },
    { title: 'Tendances de vente', desc: 'Analyse des tendances sur plusieurs semaines pour anticiper les pics de demande (f\u00eates, vacances, \u00e9v\u00e9nements locaux).' }
  ]

  yPos = 165
  suggestions.forEach((s, i) => {
    doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold').text((i + 1) + '. ' + s.title, marginLeft, yPos)
    doc.fontSize(9).fillColor(MEDIUM_GRAY).font('Helvetica')
       .text(s.desc, marginLeft + 10, yPos + 12, { width: contentWidth - 15, lineGap: 1 })
    yPos += 38
  })

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Le Chat IA', marginLeft, 480)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Vous pouvez poser des questions \u00e0 PONIA en langage naturel, comme si vous parliez \u00e0 un assistant : "Qu\'est-ce que je dois commander cette semaine ?", "Quels produits vont bient\u00f4t p\u00e9rimer ?", "Comment se porte mon stock de boissons ?". L\'IA vous r\u00e9pond instantan\u00e9ment avec des informations personnalis\u00e9es bas\u00e9es sur vos donn\u00e9es.',
       marginLeft, 498, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Score de sant\u00e9 et temps \u00e9conomis\u00e9', marginLeft, 565)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le tableau de bord affiche deux indicateurs cl\u00e9s. Le score de sant\u00e9 stock (de 0 \u00e0 100%) mesure l\'\u00e9quilibre global de votre inventaire : combien de produits sont dans le vert, l\'orange ou le rouge. Le compteur de temps \u00e9conomis\u00e9 calcule les minutes gagn\u00e9es gr\u00e2ce \u00e0 PONIA : alertes automatiques, commandes g\u00e9n\u00e9r\u00e9es, d\u00e9cisions acc\u00e9l\u00e9r\u00e9es. Ces indicateurs vous montrent concr\u00e8tement la valeur que PONIA apporte \u00e0 votre commerce.',
       marginLeft, 583, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 6 - COMMANDES ET ALERTES
  // ═══════════════════════════════════════════════════════════════════════

  newPage()

  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Commandes et alertes', marginLeft, 50)

  doc.moveTo(marginLeft, 78).lineTo(240, 78).strokeColor(BLACK).lineWidth(2).stroke()

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('G\u00e9n\u00e9ration automatique des bons de commande', marginLeft, 100)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'une des fonctionnalit\u00e9s les plus appr\u00e9ci\u00e9es de PONIA est la g\u00e9n\u00e9ration automatique des bons de commande. En un clic, l\'IA analyse tous vos produits, identifie ceux qui n\u00e9cessitent un r\u00e9approvisionnement et g\u00e9n\u00e8re un document PDF complet, pr\u00eat \u00e0 \u00eatre envoy\u00e9 \u00e0 vos fournisseurs.',
       marginLeft, 118, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text('Chaque bon de commande comprend :', marginLeft, 170, { width: contentWidth })

  const orderItems = [
    'La liste des produits \u00e0 commander avec les quantit\u00e9s sugg\u00e9r\u00e9es',
    'La distinction entre commandes urgentes (livraison sous 48h) et commandes hebdomadaires',
    'Les prix unitaires et le montant total estimatif',
    'Les recommandations personnalis\u00e9es de l\'IA'
  ]

  yPos = 190
  orderItems.forEach((item) => {
    doc.fontSize(9).fillColor(DARK_GRAY).font('Helvetica')
       .text('- ' + item, marginLeft + 15, yPos)
    yPos += 14
  })

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Trois fa\u00e7ons d\'envoyer vos commandes', marginLeft, 260)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'T\u00e9l\u00e9chargement PDF : Le bon de commande est g\u00e9n\u00e9r\u00e9 au format PDF que vous pouvez imprimer, archiver ou envoyer par email manuellement.',
       marginLeft, 280, { width: contentWidth, align: 'justify', lineGap: 3 }
     )
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Copie WhatsApp : Le contenu de la commande est format\u00e9 pour \u00eatre coll\u00e9 directement dans une conversation WhatsApp avec votre fournisseur. Pratique si vos fournisseurs pr\u00e9f\u00e8rent ce canal.',
       marginLeft, 318, { width: contentWidth, align: 'justify', lineGap: 3 }
     )
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Envoi par email : PONIA peut envoyer la commande directement par email \u00e0 l\'adresse de votre fournisseur si vous l\'avez renseign\u00e9e dans les param\u00e8tres produit.',
       marginLeft, 356, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Le syst\u00e8me d\'alertes', marginLeft, 410)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA vous envoie des alertes automatiques pour ne jamais manquer une information importante. Vous choisissez vos pr\u00e9f\u00e9rences de notification : par email, dans l\'application, ou les deux. Les alertes sont group\u00e9es intelligemment pour \u00e9viter de vous submerger de messages. Vous recevez un r\u00e9sum\u00e9 quotidien plut\u00f4t que des dizaines de notifications s\u00e9par\u00e9es.',
       marginLeft, 428, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text('Types d\'alertes disponibles :', marginLeft, 485, { width: contentWidth })

  const alertTypes = [
    'Alerte stock bas : lorsqu\'un produit passe sous son seuil d\'alerte',
    'Alerte p\u00e9remption : 7 jours, 3 jours et 1 jour avant expiration',
    'Alerte anomalie : quantit\u00e9 inhabituelle d\u00e9tect\u00e9e',
    'R\u00e9sum\u00e9 quotidien : synth\u00e8se de l\'\u00e9tat de votre stock chaque matin'
  ]

  yPos = 505
  alertTypes.forEach((item) => {
    doc.fontSize(9).fillColor(DARK_GRAY).font('Helvetica')
       .text('- ' + item, marginLeft + 15, yPos)
    yPos += 14
  })

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Personnalisation des pr\u00e9f\u00e9rences', marginLeft, 575)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Depuis les param\u00e8tres de votre compte, vous pouvez activer ou d\u00e9sactiver chaque type d\'alerte, choisir les canaux de notification, et d\u00e9finir les horaires de r\u00e9ception. Par exemple, vous pouvez demander \u00e0 recevoir le r\u00e9sum\u00e9 quotidien \u00e0 6h du matin, avant l\'ouverture de votre commerce.',
       marginLeft, 593, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 7 - OFFRES TARIFAIRES
  // ═══════════════════════════════════════════════════════════════════════

  newPage()

  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Nos offres tarifaires', marginLeft, 50)

  doc.moveTo(marginLeft, 78).lineTo(220, 78).strokeColor(BLACK).lineWidth(2).stroke()

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA propose trois formules adapt\u00e9es \u00e0 la taille de votre commerce et \u00e0 vos besoins. Toutes les formules incluent un essai gratuit de 14 jours sans engagement et sans carte bancaire.',
       marginLeft, 95, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  doc.roundedRect(marginLeft, 140, contentWidth, 130, 8).strokeColor(BLACK).lineWidth(1).stroke()
  doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold').text('BASIQUE', marginLeft + 20, 155)
  doc.fontSize(24).fillColor(BLACK).font('Helvetica-Bold').text('GRATUIT', marginLeft + 20, 175)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La formule Basique est id\u00e9ale pour tester PONIA ou pour les tr\u00e8s petits commerces avec un stock limit\u00e9. Elle inclut la gestion de 10 produits maximum, 5 messages par jour avec l\'assistant IA, les alertes de stock bas, et l\'acc\u00e8s \u00e0 l\'interface compl\u00e8te. C\'est suffisant pour une petite \u00e9picerie de quartier ou un commerce qui d\u00e9marre.',
       marginLeft + 20, 205, { width: contentWidth - 40, align: 'justify', lineGap: 3 }
     )

  doc.roundedRect(marginLeft, 285, contentWidth, 150, 8).strokeColor(BLACK).lineWidth(2).stroke()
  doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
     .text('RECOMMANDE', marginLeft + 200, 280, { width: 100, align: 'center' })
  doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold').text('STANDARD', marginLeft + 20, 305)
  doc.fontSize(24).fillColor(BLACK).font('Helvetica-Bold').text('49 euros / mois', marginLeft + 20, 325)
  doc.fontSize(10).fillColor(LIGHT_GRAY).font('Helvetica').text('ou 470 euros/an (2 mois offerts)', marginLeft + 20, 352)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La formule Standard est con\u00e7ue pour la majorit\u00e9 des commerces alimentaires : boulangeries, bars, petits restaurants. Elle inclut jusqu\'\u00e0 50 produits, un acc\u00e8s illimit\u00e9 \u00e0 l\'assistant IA, les int\u00e9grations avec les caisses enregistreuses (Square, Zettle, SumUp), les pr\u00e9dictions avanc\u00e9es \u00e0 7 jours, la g\u00e9n\u00e9ration illimit\u00e9e de bons de commande, et le support par email sous 24h.',
       marginLeft + 20, 370, { width: contentWidth - 40, align: 'justify', lineGap: 3 }
     )

  doc.roundedRect(marginLeft, 450, contentWidth, 150, 8).strokeColor(BLACK).lineWidth(1).stroke()
  doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold').text('PRO', marginLeft + 20, 470)
  doc.fontSize(24).fillColor(BLACK).font('Helvetica-Bold').text('69 euros / mois', marginLeft + 20, 490)
  doc.fontSize(10).fillColor(LIGHT_GRAY).font('Helvetica').text('ou 660 euros/an (2 mois offerts)', marginLeft + 20, 517)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La formule Pro s\'adresse aux commerces plus importants ou aux cha\u00eenes avec plusieurs points de vente. Elle inclut un nombre illimit\u00e9 de produits, les commandes vocales pour une utilisation mains libres, les pr\u00e9dictions avanc\u00e9es \u00e0 30 jours, la gestion multi-magasins, un support prioritaire par t\u00e9l\u00e9phone, et un accompagnement personnalis\u00e9 lors de la mise en place.',
       marginLeft + 20, 535, { width: contentWidth - 40, align: 'justify', lineGap: 3 }
     )

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold')
     .text('Sans engagement - Annulation possible \u00e0 tout moment', marginLeft, 620, { width: contentWidth, align: 'center' })

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 8 - CONTACT ET SUPPORT
  // ═══════════════════════════════════════════════════════════════════════

  newPage()

  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Contact et support', marginLeft, 50)

  doc.moveTo(marginLeft, 78).lineTo(210, 78).strokeColor(BLACK).lineWidth(2).stroke()

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'\u00e9quipe PONIA est \u00e0 votre disposition pour r\u00e9pondre \u00e0 vos questions, vous accompagner dans la prise en main de l\'application et r\u00e9soudre tout probl\u00e8me technique. Nous comprenons que la technologie peut parfois sembler intimidante : nous sommes l\u00e0 pour vous simplifier la vie, pas pour la compliquer.',
       marginLeft, 95, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Nous contacter', marginLeft, 155)

  doc.roundedRect(marginLeft, 175, contentWidth, 100, 8).strokeColor(BORDER_GRAY).lineWidth(1).stroke()

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold').text('Email :', marginLeft + 30, 195)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica').text('support@myponia.fr', marginLeft + 80, 195)

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold').text('Site web :', marginLeft + 30, 220)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica').text('myponia.fr', marginLeft + 95, 220)

  doc.fontSize(9).fillColor(MEDIUM_GRAY).font('Helvetica')
     .text('R\u00e9ponse garantie sous 24 heures ouvrables', marginLeft + 30, 250)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Questions fr\u00e9quentes', marginLeft, 300)

  const faqs = [
    { q: 'Mes donn\u00e9es sont-elles s\u00e9curis\u00e9es ?', a: 'Oui. Toutes vos donn\u00e9es sont chiffr\u00e9es et stock\u00e9es sur des serveurs s\u00e9curis\u00e9s en Europe. Nous ne partageons jamais vos informations avec des tiers.' },
    { q: 'Puis-je annuler mon abonnement \u00e0 tout moment ?', a: 'Absolument. Il n\'y a aucun engagement. Vous pouvez annuler depuis votre compte en un clic, et vous conservez l\'acc\u00e8s jusqu\'\u00e0 la fin de la p\u00e9riode pay\u00e9e.' },
    { q: 'L\'application fonctionne-t-elle hors connexion ?', a: 'L\'application n\u00e9cessite une connexion internet pour synchroniser vos donn\u00e9es et acc\u00e9der \u00e0 l\'IA. Cependant, les modifications faites hors ligne sont enregistr\u00e9es localement et synchronis\u00e9es d\u00e8s que la connexion est r\u00e9tablie.' },
    { q: 'Comment importer mes produits existants ?', a: 'Vous pouvez ajouter vos produits un par un via l\'interface, ou nous contacter pour un import en masse depuis un fichier Excel si vous avez d\u00e9j\u00e0 une liste.' },
    { q: 'PONIA fonctionne-t-il avec ma caisse enregistreuse ?', a: 'La formule Standard et Pro inclut des int\u00e9grations avec les principales caisses : Square, Zettle, SumUp, Lightspeed. Contactez-nous pour v\u00e9rifier la compatibilit\u00e9 avec votre mod\u00e8le.' }
  ]

  yPos = 320
  faqs.forEach((faq) => {
    doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold').text(faq.q, marginLeft, yPos)
    doc.fontSize(9).fillColor(MEDIUM_GRAY).font('Helvetica')
       .text(faq.a, marginLeft + 10, yPos + 13, { width: contentWidth - 15, align: 'justify', lineGap: 2 })
    yPos += 52
  })

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Merci de votre confiance', marginLeft, 600, { width: contentWidth, align: 'center' })
  doc.fontSize(10).fillColor(MEDIUM_GRAY).font('Helvetica')
     .text('L\'\u00e9quipe PONIA', marginLeft, 620, { width: contentWidth, align: 'center' })

  try {
    const logoPath = path.join(process.cwd(), 'attached_assets', 'F9D5EF8F-6E89-4D34-B41E-18582D13423F_1765216861539.png')
    doc.image(logoPath, (pageWidth - 60) / 2, 660, { width: 60 })
  } catch (error) {
    doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold')
       .text('PONIA', marginLeft, 670, { width: contentWidth, align: 'center' })
  }

  addPageNumber()

  return doc
}
