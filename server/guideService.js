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
  const BG_LIGHT = '#F5F5F5'

  const pageWidth = 595
  const contentWidth = 495
  const marginLeft = 50
  const marginRight = 545

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
     .text('DE A a Z', marginLeft, 435, { width: contentWidth, align: 'center' })

  doc.fontSize(11).fillColor(LIGHT_GRAY).font('Helvetica')
     .text('Pour les boulangeries, restaurants, bars,', marginLeft, 520, { width: contentWidth, align: 'center' })
     .text('caves a vin et fromageries', marginLeft, 535, { width: contentWidth, align: 'center' })

  doc.fontSize(10).fillColor('white').font('Helvetica')
     .text('myponia.fr', marginLeft, 750, { width: contentWidth, align: 'center' })

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 2 - PRESENTATION PONIA
  // ═══════════════════════════════════════════════════════════════════════

  newPage()

  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Pourquoi PONIA ?', marginLeft, 50)

  doc.moveTo(marginLeft, 78).lineTo(200, 78).strokeColor(BLACK).lineWidth(2).stroke()

  // Le probleme
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Le probleme que vous vivez chaque jour', marginLeft, 100)

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'En tant que commercant dans le secteur alimentaire, vous connaissez cette situation : vous arrivez le matin et decouvrez que vous etes en rupture de stock sur un produit essentiel. Vos clients repartent decus, et vous perdez des ventes. A l\'inverse, vous retrouvez regulierement des produits perimes au fond de votre reserve, de l\'argent litteralement jete a la poubelle.',
       marginLeft, 120, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Gerer son stock prend un temps fou. Entre les comptages manuels, les commandes a passer aux differents fournisseurs, le suivi des dates de peremption, vous passez en moyenne 7 heures par semaine sur ces taches administratives. C\'est du temps que vous ne consacrez pas a vos clients, a la qualite de vos produits ou simplement a votre vie personnelle.',
       marginLeft, 175, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  // La solution
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('PONIA : votre assistant de gestion intelligent', marginLeft, 245)

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA est une application mobile et web concue specifiquement pour les petits commerces alimentaires francais. Notre intelligence artificielle analyse en continu votre stock, vos habitudes de vente et meme la meteo locale pour vous fournir des predictions precises et des recommandations personnalisees.',
       marginLeft, 265, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Contrairement aux logiciels complexes destines aux grandes surfaces, PONIA a ete pense pour etre utilise en 2 minutes par jour maximum, directement depuis votre telephone pendant que vous etes en reserve ou derriere votre comptoir. Pas besoin d\'etre un expert en informatique : si vous savez utiliser WhatsApp, vous savez utiliser PONIA.',
       marginLeft, 320, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  // Les benefices
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Ce que PONIA change pour vous', marginLeft, 390)

  const benefits = [
    { title: 'Zero rupture de stock', desc: 'L\'IA detecte les produits qui vont manquer avant que cela n\'arrive et vous alerte automatiquement. Vous ne perdez plus de ventes.' },
    { title: 'Zero gaspillage', desc: 'Les alertes de peremption vous previennent 7 jours a l\'avance. Vous avez le temps d\'ecouler vos produits via des promotions ou le plat du jour.' },
    { title: 'Plus de 7 heures liberees par semaine', desc: 'Les commandes sont generees automatiquement, les comptages sont simplifies, les alertes remplacent votre charge mentale. Vous gagnez du temps.' },
    { title: 'Des decisions eclairees', desc: 'Grace aux statistiques et aux predictions de l\'IA, vous savez exactement ce qu\'il faut commander, en quelle quantite et a quel moment.' }
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
     .text('Demarrer avec PONIA', marginLeft, 50)

  doc.moveTo(marginLeft, 78).lineTo(240, 78).strokeColor(BLACK).lineWidth(2).stroke()

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La mise en place de PONIA dans votre commerce se fait en trois etapes simples. En moins de 15 minutes, vous serez operationnel et l\'intelligence artificielle commencera a travailler pour vous.',
       marginLeft, 95, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  // Etape 1
  doc.roundedRect(marginLeft, 140, contentWidth, 120, 8).strokeColor(BORDER_GRAY).lineWidth(1).stroke()
  doc.fontSize(32).fillColor(BLACK).font('Helvetica-Bold').text('1', marginLeft + 20, 160)
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Creez votre compte', marginLeft + 60, 155)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Rendez-vous sur myponia.fr et cliquez sur "Essai gratuit". Renseignez simplement votre adresse email, le nom de votre commerce et son adresse. C\'est tout. Pas de carte bancaire demandee, pas de formulaire interminable. En 30 secondes, votre compte est cree et vous beneficiez automatiquement de 14 jours d\'essai gratuit avec toutes les fonctionnalites.',
       marginLeft + 60, 175, { width: contentWidth - 80, align: 'justify', lineGap: 3 }
     )

  // Etape 2
  doc.roundedRect(marginLeft, 275, contentWidth, 140, 8).strokeColor(BORDER_GRAY).lineWidth(1).stroke()
  doc.fontSize(32).fillColor(BLACK).font('Helvetica-Bold').text('2', marginLeft + 20, 295)
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Ajoutez vos premiers produits', marginLeft + 60, 290)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Depuis l\'onglet "Stock", appuyez sur le bouton "Ajouter un produit". Pour chaque article, indiquez son nom, la quantite actuellement en stock, l\'unite de mesure (pieces, kilos, litres) et le seuil d\'alerte souhaite. Ce seuil represente la quantite minimale en dessous de laquelle vous souhaitez etre prevenu.',
       marginLeft + 60, 310, { width: contentWidth - 80, align: 'justify', lineGap: 3 }
     )
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Conseil : commencez par vos 10 produits les plus importants. Vous pourrez toujours en ajouter d\'autres progressivement. L\'objectif est de demarrer rapidement, pas de tout saisir d\'un coup.',
       marginLeft + 60, 365, { width: contentWidth - 80, align: 'justify', lineGap: 3 }
     )

  // Etape 3
  doc.roundedRect(marginLeft, 430, contentWidth, 120, 8).strokeColor(BORDER_GRAY).lineWidth(1).stroke()
  doc.fontSize(32).fillColor(BLACK).font('Helvetica-Bold').text('3', marginLeft + 20, 450)
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Laissez l\'IA travailler pour vous', marginLeft + 60, 445)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Des que vos produits sont enregistres, PONIA commence son analyse. L\'intelligence artificielle calcule votre score de sante stock, detecte les risques de rupture et de peremption, et prepare ses premieres recommandations. Vous recevrez des alertes par email et dans l\'application des qu\'une action est necessaire. Votre seul travail quotidien : mettre a jour les quantites en quelques clics apres chaque reception ou vente importante.',
       marginLeft + 60, 465, { width: contentWidth - 80, align: 'justify', lineGap: 3 }
     )

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold')
     .text('Temps total de mise en place : environ 15 minutes', marginLeft, 580, { width: contentWidth, align: 'center' })

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 4 - GESTION DU STOCK
  // ═══════════════════════════════════════════════════════════════════════

  newPage()

  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Gerer votre stock au quotidien', marginLeft, 50)

  doc.moveTo(marginLeft, 78).lineTo(290, 78).strokeColor(BLACK).lineWidth(2).stroke()

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'interface de gestion de stock de PONIA a ete concue pour etre utilisee rapidement, meme avec les mains occupees ou pendant un rush. Chaque fonctionnalite est accessible en un ou deux clics maximum.',
       marginLeft, 95, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  // Ajouter un produit
  doc.fontSize(13).fillColor(BLACK).font('Helvetica-Bold').text('Ajouter un produit', marginLeft, 140)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Pour chaque produit, vous pouvez renseigner : le nom du produit, la categorie (boulangerie, boissons, frais, etc.), la quantite en stock, l\'unite de mesure, le seuil d\'alerte minimum, le prix d\'achat unitaire, le fournisseur associe et la date de peremption si applicable. Seuls le nom, la quantite et le seuil sont obligatoires. Les autres informations permettent a l\'IA de vous fournir des recommandations plus precises.',
       marginLeft, 158, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  // Ajustements rapides
  doc.fontSize(13).fillColor(BLACK).font('Helvetica-Bold').text('Ajustements rapides', marginLeft, 225)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Chaque produit affiche deux boutons : un "+" pour ajouter du stock lors d\'une reception, et un "-" pour retirer du stock apres une vente ou une perte. Un simple appui ajuste la quantite d\'une unite. Un appui prolonge permet de saisir un nombre precis. Cette methode vous permet de mettre a jour votre stock en moins de 30 secondes, directement depuis votre telephone.',
       marginLeft, 243, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  // Seuils d'alerte
  doc.fontSize(13).fillColor(BLACK).font('Helvetica-Bold').text('Les seuils d\'alerte', marginLeft, 310)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le seuil d\'alerte est la quantite minimale en dessous de laquelle PONIA vous previent qu\'il est temps de commander. Par exemple, si vous definissez un seuil de 5 pour votre farine, des que votre stock passe a 4 sacs ou moins, vous recevez une notification. Choisissez ce seuil en fonction de vos delais de livraison habituels : si votre fournisseur livre en 48 heures et que vous utilisez 2 sacs par jour, un seuil de 5 vous laisse une marge de securite.',
       marginLeft, 328, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  // Codes couleur
  doc.fontSize(13).fillColor(BLACK).font('Helvetica-Bold').text('Le systeme de couleurs', marginLeft, 400)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Pour identifier en un coup d\'oeil l\'etat de votre stock, chaque produit est colore selon son niveau :',
       marginLeft, 418, { width: contentWidth, lineGap: 3 }
     )

  const colors = [
    { label: 'Vert', desc: 'Stock sain, au-dessus du seuil d\'alerte. Aucune action requise.' },
    { label: 'Orange', desc: 'Stock bas, proche du seuil. Il serait prudent de prevoir une commande.' },
    { label: 'Rouge', desc: 'Stock critique, en dessous du seuil. Commande urgente recommandee.' }
  ]

  yPos = 445
  colors.forEach((c) => {
    doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold').text(c.label + ' :', marginLeft + 15, yPos, { continued: true })
    doc.font('Helvetica').fillColor(DARK_GRAY).text(' ' + c.desc)
    yPos += 20
  })

  // Recherche et filtres
  doc.fontSize(13).fillColor(BLACK).font('Helvetica-Bold').text('Recherche et filtres', marginLeft, 520)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La barre de recherche vous permet de trouver instantanement un produit par son nom. Les filtres vous permettent d\'afficher uniquement les produits d\'une categorie, ceux en stock bas, ou ceux proches de la peremption. Ces outils sont particulierement utiles lorsque vous gerez plus de 30 produits.',
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
       'Ce qui differencie PONIA des simples tableurs ou applications de stock basiques, c\'est son intelligence artificielle. Elle analyse vos donnees en permanence pour vous fournir des informations exploitables, pas juste des chiffres.',
       marginLeft, 95, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  // Les 8 types de suggestions
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Les huit types de suggestions intelligentes', marginLeft, 145)

  const suggestions = [
    { title: 'Alertes de peremption', desc: 'L\'IA identifie les produits qui vont expirer dans les 7 prochains jours et vous suggere des actions : promotion, plat du jour, don.' },
    { title: 'Predictions de rupture', desc: 'En analysant votre rythme de consommation, PONIA prevoit quand un produit va tomber en rupture et vous alerte plusieurs jours a l\'avance.' },
    { title: 'Detection de surstock', desc: 'L\'IA repere les produits qui stagnent depuis trop longtemps et qui risquent de se perimer ou de vous immobiliser de la tresorerie.' },
    { title: 'Predictions meteo', desc: 'PONIA integre les previsions meteorologiques locales. Il sait que les jours de canicule, vous vendez plus de boissons fraiches.' },
    { title: 'Detection d\'anomalies', desc: 'Si une quantite semble anormale (erreur de saisie, vol potentiel), l\'IA vous le signale pour verification.' },
    { title: 'Idees plat du jour', desc: 'En fonction des produits a ecouler rapidement, PONIA peut suggerer des idees de plats ou de promotions pertinentes.' },
    { title: 'Rappels de commande', desc: 'L\'IA apprend vos cycles de commande et vous rappelle quand il est temps de passer commande aupres de vos fournisseurs habituels.' },
    { title: 'Tendances de vente', desc: 'Analyse des tendances sur plusieurs semaines pour anticiper les pics de demande (fetes, vacances, evenements locaux).' }
  ]

  yPos = 165
  suggestions.forEach((s, i) => {
    doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold').text((i + 1) + '. ' + s.title, marginLeft, yPos)
    doc.fontSize(9).fillColor(MEDIUM_GRAY).font('Helvetica')
       .text(s.desc, marginLeft + 10, yPos + 12, { width: contentWidth - 15, lineGap: 1 })
    yPos += 38
  })

  // Le Chat IA
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Le Chat IA', marginLeft, 480)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Vous pouvez poser des questions a PONIA en langage naturel, comme si vous parliez a un assistant : "Qu\'est-ce que je dois commander cette semaine ?", "Quels produits vont bientot perimer ?", "Comment se porte mon stock de boissons ?". L\'IA vous repond instantanement avec des informations personnalisees basees sur vos donnees.',
       marginLeft, 498, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  // Score de sante et temps economise
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Score de sante et temps economise', marginLeft, 565)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le tableau de bord affiche deux indicateurs cles. Le score de sante stock (de 0 a 100%) mesure l\'equilibre global de votre inventaire : combien de produits sont dans le vert, l\'orange ou le rouge. Le compteur de temps economise calcule les minutes gagnees grace a PONIA : alertes automatiques, commandes generees, decisions accelerees. Ces indicateurs vous montrent concretement la valeur que PONIA apporte a votre commerce.',
       marginLeft, 583, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 6 - COMMANDES ET ALERTES
  // ═══════════════════════════════════════════════════════════════════════

  newPage()

  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Commandes et alertes', marginLeft, 50)

  doc.moveTo(marginLeft, 78).lineTo(240, 78).strokeColor(BLACK).lineWidth(2).stroke()

  // Bons de commande
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Generation automatique des bons de commande', marginLeft, 100)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'une des fonctionnalites les plus appreciees de PONIA est la generation automatique des bons de commande. En un clic, l\'IA analyse tous vos produits, identifie ceux qui necessitent un reapprovisionnement et genere un document PDF complet, pret a etre envoye a vos fournisseurs.',
       marginLeft, 118, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text('Chaque bon de commande comprend :', marginLeft, 170, { width: contentWidth })

  const orderItems = [
    'La liste des produits a commander avec les quantites suggerees',
    'La distinction entre commandes urgentes (livraison sous 48h) et commandes hebdomadaires',
    'Les prix unitaires et le montant total estimatif',
    'Les recommandations personnalisees de l\'IA'
  ]

  yPos = 190
  orderItems.forEach((item) => {
    doc.fontSize(9).fillColor(DARK_GRAY).font('Helvetica')
       .text('- ' + item, marginLeft + 15, yPos)
    yPos += 14
  })

  // Modes d'envoi
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Trois facons d\'envoyer vos commandes', marginLeft, 260)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Telechargement PDF : Le bon de commande est genere au format PDF que vous pouvez imprimer, archiver ou envoyer par email manuellement.',
       marginLeft, 280, { width: contentWidth, align: 'justify', lineGap: 3 }
     )
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Copie WhatsApp : Le contenu de la commande est formate pour etre colle directement dans une conversation WhatsApp avec votre fournisseur. Pratique si vos fournisseurs preferent ce canal.',
       marginLeft, 318, { width: contentWidth, align: 'justify', lineGap: 3 }
     )
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Envoi par email : PONIA peut envoyer la commande directement par email a l\'adresse de votre fournisseur si vous l\'avez renseignee dans les parametres produit.',
       marginLeft, 356, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  // Alertes et notifications
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Le systeme d\'alertes', marginLeft, 410)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA vous envoie des alertes automatiques pour ne jamais manquer une information importante. Vous choisissez vos preferences de notification : par email, dans l\'application, ou les deux. Les alertes sont groupees intelligemment pour eviter de vous submerger de messages. Vous recevez un resume quotidien plutot que des dizaines de notifications separees.',
       marginLeft, 428, { width: contentWidth, align: 'justify', lineGap: 3 }
     )

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text('Types d\'alertes disponibles :', marginLeft, 485, { width: contentWidth })

  const alertTypes = [
    'Alerte stock bas : lorsqu\'un produit passe sous son seuil d\'alerte',
    'Alerte peremption : 7 jours, 3 jours et 1 jour avant expiration',
    'Alerte anomalie : quantite inhabituelle detectee',
    'Resume quotidien : synthese de l\'etat de votre stock chaque matin'
  ]

  yPos = 505
  alertTypes.forEach((item) => {
    doc.fontSize(9).fillColor(DARK_GRAY).font('Helvetica')
       .text('- ' + item, marginLeft + 15, yPos)
    yPos += 14
  })

  // Personnalisation
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Personnalisation des preferences', marginLeft, 575)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Depuis les parametres de votre compte, vous pouvez activer ou desactiver chaque type d\'alerte, choisir les canaux de notification, et definir les horaires de reception. Par exemple, vous pouvez demander a recevoir le resume quotidien a 6h du matin, avant l\'ouverture de votre commerce.',
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
       'PONIA propose trois formules adaptees a la taille de votre commerce et a vos besoins. Toutes les formules incluent un essai gratuit de 14 jours sans engagement et sans carte bancaire.',
       marginLeft, 95, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  // Plan Basique
  doc.roundedRect(marginLeft, 140, contentWidth, 130, 8).strokeColor(BLACK).lineWidth(1).stroke()
  doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold').text('BASIQUE', marginLeft + 20, 155)
  doc.fontSize(24).fillColor(BLACK).font('Helvetica-Bold').text('GRATUIT', marginLeft + 20, 175)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La formule Basique est ideale pour tester PONIA ou pour les tres petits commerces avec un stock limite. Elle inclut la gestion de 10 produits maximum, 5 messages par jour avec l\'assistant IA, les alertes de stock bas, et l\'acces a l\'interface complete. C\'est suffisant pour une petite epicerie de quartier ou un commerce qui demarre.',
       marginLeft + 20, 205, { width: contentWidth - 40, align: 'justify', lineGap: 3 }
     )

  // Plan Standard
  doc.roundedRect(marginLeft, 285, contentWidth, 150, 8).strokeColor(BLACK).lineWidth(2).stroke()
  doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
     .text('RECOMMANDE', marginLeft + 200, 280, { width: 100, align: 'center' })
  doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold').text('STANDARD', marginLeft + 20, 305)
  doc.fontSize(24).fillColor(BLACK).font('Helvetica-Bold').text('49 euros / mois', marginLeft + 20, 325)
  doc.fontSize(10).fillColor(LIGHT_GRAY).font('Helvetica').text('ou 470 euros/an (2 mois offerts)', marginLeft + 20, 352)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La formule Standard est concue pour la majorite des commerces alimentaires : boulangeries, bars, petits restaurants. Elle inclut jusqu\'a 50 produits, un acces illimite a l\'assistant IA, les integrations avec les caisses enregistreuses (Square, Zettle, SumUp), les predictions avancees a 7 jours, la generation illimitee de bons de commande, et le support par email sous 24h.',
       marginLeft + 20, 370, { width: contentWidth - 40, align: 'justify', lineGap: 3 }
     )

  // Plan Pro
  doc.roundedRect(marginLeft, 450, contentWidth, 150, 8).strokeColor(BLACK).lineWidth(1).stroke()
  doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold').text('PRO', marginLeft + 20, 470)
  doc.fontSize(24).fillColor(BLACK).font('Helvetica-Bold').text('69 euros / mois', marginLeft + 20, 490)
  doc.fontSize(10).fillColor(LIGHT_GRAY).font('Helvetica').text('ou 660 euros/an (2 mois offerts)', marginLeft + 20, 517)
  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La formule Pro s\'adresse aux commerces plus importants ou aux chaines avec plusieurs points de vente. Elle inclut un nombre illimite de produits, les commandes vocales pour une utilisation mains libres, les predictions avancees a 30 jours, la gestion multi-magasins, un support prioritaire par telephone, et un accompagnement personnalise lors de la mise en place.',
       marginLeft + 20, 535, { width: contentWidth - 40, align: 'justify', lineGap: 3 }
     )

  // Engagement
  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold')
     .text('Sans engagement - Annulation possible a tout moment', marginLeft, 620, { width: contentWidth, align: 'center' })

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 8 - CONTACT ET SUPPORT
  // ═══════════════════════════════════════════════════════════════════════

  newPage()

  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Contact et support', marginLeft, 50)

  doc.moveTo(marginLeft, 78).lineTo(210, 78).strokeColor(BLACK).lineWidth(2).stroke()

  doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'equipe PONIA est a votre disposition pour repondre a vos questions, vous accompagner dans la prise en main de l\'application et resoudre tout probleme technique. Nous comprenons que la technologie peut parfois sembler intimidante : nous sommes la pour vous simplifier la vie, pas pour la compliquer.',
       marginLeft, 95, { width: contentWidth, align: 'justify', lineGap: 4 }
     )

  // Contact
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Nous contacter', marginLeft, 155)

  doc.roundedRect(marginLeft, 175, contentWidth, 100, 8).strokeColor(BORDER_GRAY).lineWidth(1).stroke()

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold').text('Email :', marginLeft + 30, 195)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica').text('support@myponia.fr', marginLeft + 80, 195)

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold').text('Site web :', marginLeft + 30, 220)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica').text('myponia.fr', marginLeft + 95, 220)

  doc.fontSize(9).fillColor(MEDIUM_GRAY).font('Helvetica')
     .text('Reponse garantie sous 24 heures ouvrables', marginLeft + 30, 250)

  // FAQ
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Questions frequentes', marginLeft, 300)

  const faqs = [
    { q: 'Mes donnees sont-elles securisees ?', a: 'Oui. Toutes vos donnees sont chiffrees et stockees sur des serveurs securises en Europe. Nous ne partageons jamais vos informations avec des tiers.' },
    { q: 'Puis-je annuler mon abonnement a tout moment ?', a: 'Absolument. Il n\'y a aucun engagement. Vous pouvez annuler depuis votre compte en un clic, et vous conservez l\'acces jusqu\'a la fin de la periode payee.' },
    { q: 'L\'application fonctionne-t-elle hors connexion ?', a: 'L\'application necessite une connexion internet pour synchroniser vos donnees et acceder a l\'IA. Cependant, les modifications faites hors ligne sont enregistrees localement et synchronisees des que la connexion est retablie.' },
    { q: 'Comment importer mes produits existants ?', a: 'Vous pouvez ajouter vos produits un par un via l\'interface, ou nous contacter pour un import en masse depuis un fichier Excel si vous avez deja une liste.' },
    { q: 'PONIA fonctionne-t-il avec ma caisse enregistreuse ?', a: 'La formule Standard et Pro inclut des integrations avec les principales caisses : Square, Zettle, SumUp, Lightspeed. Contactez-nous pour verifier la compatibilite avec votre modele.' }
  ]

  yPos = 320
  faqs.forEach((faq) => {
    doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold').text(faq.q, marginLeft, yPos)
    doc.fontSize(9).fillColor(MEDIUM_GRAY).font('Helvetica')
       .text(faq.a, marginLeft + 10, yPos + 13, { width: contentWidth - 15, align: 'justify', lineGap: 2 })
    yPos += 52
  })

  // Merci
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Merci de votre confiance', marginLeft, 600, { width: contentWidth, align: 'center' })
  doc.fontSize(10).fillColor(MEDIUM_GRAY).font('Helvetica')
     .text('L\'equipe PONIA', marginLeft, 620, { width: contentWidth, align: 'center' })

  // Logo final
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
