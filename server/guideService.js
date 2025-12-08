import PDFDocument from 'pdfkit'
import path from 'path'

export function generateGuidePDF() {
  const doc = new PDFDocument({ 
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    autoFirstPage: true,
    bufferPages: true
  })

  const BLACK = '#000000'
  const DARK_GRAY = '#333333'
  const MEDIUM_GRAY = '#555555'
  const LIGHT_GRAY = '#888888'

  const pageWidth = 595
  const contentWidth = 495
  const marginLeft = 50

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE DE COUVERTURE
  // ═══════════════════════════════════════════════════════════════════════

  doc.rect(0, 0, pageWidth, 842).fill(BLACK)

  try {
    const logoPath = path.join(process.cwd(), 'public', 'ponia-logo.png')
    doc.image(logoPath, (pageWidth - 180) / 2, 80, { width: 180 })
  } catch (error) {
    doc.fontSize(48).fillColor('white').font('Helvetica-Bold')
       .text('PONIA', marginLeft, 120, { width: contentWidth, align: 'center' })
  }

  doc.fontSize(32).fillColor('white').font('Helvetica-Bold')
     .text('GUIDE COMPLET', marginLeft, 320, { width: contentWidth, align: 'center' })

  doc.moveTo(150, 365).lineTo(445, 365).strokeColor('#FFFFFF').lineWidth(1).stroke()

  doc.fontSize(16).fillColor('white').font('Helvetica')
     .text('Tout savoir sur PONIA de A \u00e0 Z', marginLeft, 385, { width: contentWidth, align: 'center' })

  doc.fontSize(12).fillColor('#CCCCCC').font('Helvetica')
     .text('Gestion de stock intelligente', marginLeft, 420, { width: contentWidth, align: 'center' })
     .text('propuls\u00e9e par l\'intelligence artificielle', marginLeft, 438, { width: contentWidth, align: 'center' })

  doc.fontSize(10).fillColor('#999999').font('Helvetica')
     .text('myponia.fr', marginLeft, 780, { width: contentWidth, align: 'center' })

  // ═══════════════════════════════════════════════════════════════════════
  // CONTENU - FLUX CONTINU SANS SAUT DE PAGE FORC\u00c9
  // ═══════════════════════════════════════════════════════════════════════

  doc.addPage()

  // --- INTRODUCTION ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Pourquoi PONIA ?', marginLeft, 50)
  doc.moveTo(marginLeft, 78).lineTo(200, 78).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA est n\u00e9 d\'un constat simple : les petits commer\u00e7ants alimentaires fran\u00e7ais passent un temps consid\u00e9rable \u00e0 g\u00e9rer leur stock manuellement, souvent avec des m\u00e9thodes d\u00e9pass\u00e9es comme le papier, les tableurs Excel ou simplement leur m\u00e9moire. Cette gestion approximative entra\u00eene deux probl\u00e8mes majeurs qui co\u00fbtent cher : les ruptures de stock qui font perdre des ventes et d\u00e9\u00e7oivent les clients, et le gaspillage de produits p\u00e9rim\u00e9s qui repr\u00e9sente de l\'argent jet\u00e9 \u00e0 la poubelle.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'En moyenne, un commer\u00e7ant alimentaire consacre plus de 7 heures par semaine aux t\u00e2ches li\u00e9es \u00e0 la gestion de son stock : comptage des produits, v\u00e9rification des dates de p\u00e9remption, r\u00e9daction des commandes fournisseurs, suivi des livraisons. Ce temps pr\u00e9cieux pourrait \u00eatre consacr\u00e9 \u00e0 ce qui compte vraiment : accueillir les clients, am\u00e9liorer la qualit\u00e9 des produits, d\u00e9velopper son commerce ou tout simplement profiter d\'une vie personnelle \u00e9quilibr\u00e9e.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA apporte une solution compl\u00e8te \u00e0 ces probl\u00e9matiques gr\u00e2ce \u00e0 l\'intelligence artificielle. Notre application analyse en permanence votre stock, apprend vos habitudes de vente, anticipe vos besoins et vous accompagne au quotidien avec des recommandations personnalis\u00e9es. Contrairement aux logiciels complexes con\u00e7us pour les grandes surfaces, PONIA a \u00e9t\u00e9 pens\u00e9 sp\u00e9cifiquement pour les petits commerces : une interface simple, utilisable en 2 minutes par jour depuis votre t\u00e9l\u00e9phone, m\u00eame si vous n\'\u00eates pas \u00e0 l\'aise avec la technologie.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // --- LES OBJECTIFS ---
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les objectifs de PONIA', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Notre mission est de permettre \u00e0 chaque petit commer\u00e7ant alimentaire de b\u00e9n\u00e9ficier des m\u00eames outils de gestion que les grandes enseignes, mais adapt\u00e9s \u00e0 leur r\u00e9alit\u00e9 quotidienne. Nous poursuivons quatre objectifs principaux :',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Premi\u00e8rement, \u00e9liminer les ruptures de stock. Lorsqu\'un client entre dans votre boutique pour acheter son pain quotidien ou sa bouteille de vin pr\u00e9f\u00e9r\u00e9e et repart les mains vides, c\'est une vente perdue et potentiellement un client qui ne reviendra pas. L\'intelligence artificielle de PONIA analyse vos tendances de vente, d\u00e9tecte les produits dont le stock baisse anormalement vite et vous alerte avant qu\'il ne soit trop tard pour commander.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Deuxi\u00e8mement, r\u00e9duire le gaspillage alimentaire. Chaque produit qui finit \u00e0 la poubelle repr\u00e9sente une perte financi\u00e8re directe. PONIA suit les dates de p\u00e9remption de tous vos produits et vous envoie des alertes 7 jours, 3 jours et 1 jour avant l\'expiration. Ces rappels vous permettent d\'organiser des promotions, de mettre en avant certains produits ou simplement de les utiliser dans vos pr\u00e9parations avant qu\'ils ne soient perdus.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Troisi\u00e8mement, vous faire gagner du temps. Le temps pass\u00e9 \u00e0 compter les produits, \u00e0 r\u00e9diger les commandes et \u00e0 v\u00e9rifier les stocks est du temps que vous ne consacrez pas \u00e0 votre coeur de m\u00e9tier. PONIA automatise ces t\u00e2ches fastidieuses : g\u00e9n\u00e9ration automatique des bons de commande, mise \u00e0 jour des stocks en quelques clics, alertes intelligentes qui vous \u00e9vitent de tout surveiller en permanence.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Quatri\u00e8mement, vous aider \u00e0 prendre de meilleures d\u00e9cisions. Gr\u00e2ce aux statistiques d\u00e9taill\u00e9es et aux pr\u00e9dictions de l\'IA, vous savez exactement quoi commander, en quelle quantit\u00e9 et \u00e0 quel moment. Vous anticipez les pics de demande li\u00e9s \u00e0 la m\u00e9t\u00e9o, aux jours f\u00e9ri\u00e9s ou aux \u00e9v\u00e9nements locaux. Vous identifiez vos produits les plus rentables et ceux qui vous co\u00fbtent de l\'argent.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // --- LES AVANTAGES ---
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les avantages concrets pour votre commerce', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Augmentation du chiffre d\'affaires : en \u00e9vitant les ruptures de stock sur vos produits phares, vous ne manquez plus aucune vente. Nos utilisateurs constatent en moyenne une augmentation de 8 \u00e0 15% de leur chiffre d\'affaires apr\u00e8s trois mois d\'utilisation, simplement parce qu\'ils ont toujours les bons produits disponibles au bon moment.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'R\u00e9duction des pertes : le suivi pr\u00e9cis des dates de p\u00e9remption et les alertes proactives permettent de r\u00e9duire le gaspillage de 40 \u00e0 60% en moyenne. Pour un commerce qui jetait 500 euros de marchandises par mois, cela repr\u00e9sente une \u00e9conomie de 200 \u00e0 300 euros mensuels, soit bien plus que le co\u00fbt de l\'abonnement PONIA.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Gain de temps consid\u00e9rable : nos utilisateurs rapportent gagner entre 5 et 10 heures par semaine sur la gestion de leur stock. Ce temps lib\u00e9r\u00e9 peut \u00eatre r\u00e9investi dans l\'accueil des clients, le d\u00e9veloppement de nouveaux produits, la communication ou tout simplement dans une meilleure qualit\u00e9 de vie personnelle.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'S\u00e9r\u00e9nit\u00e9 au quotidien : plus besoin de vous inqui\u00e9ter en permanence de l\'\u00e9tat de votre stock. PONIA surveille tout pour vous et vous alerte uniquement quand c\'est n\u00e9cessaire. Vous pouvez vous concentrer sur votre m\u00e9tier en sachant que rien ne vous \u00e9chappera.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // --- FONCTIONNALIT\u00c9S D\u00c9TAILL\u00c9ES ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Fonctionnalit\u00e9s d\u00e9taill\u00e9es', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(250, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  // Dashboard
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Le tableau de bord intelligent', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le tableau de bord est la premi\u00e8re chose que vous voyez en ouvrant PONIA. Il a \u00e9t\u00e9 con\u00e7u pour vous donner une vision compl\u00e8te de l\'\u00e9tat de votre commerce en un seul coup d\'oeil, sans avoir \u00e0 naviguer dans plusieurs menus ou \u00e0 chercher l\'information.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Au centre du tableau de bord se trouve le Chat IA, votre assistant personnel. Vous pouvez lui poser n\'importe quelle question concernant votre stock en langage naturel, exactement comme vous parleriez \u00e0 un employ\u00e9. Par exemple : "Qu\'est-ce que je dois commander pour cette semaine ?", "Quels produits vont bient\u00f4t p\u00e9rimer ?", "Comment se portent mes ventes de vin ce mois-ci ?". L\'IA analyse instantan\u00e9ment vos donn\u00e9es et vous r\u00e9pond avec des informations pr\u00e9cises et personnalis\u00e9es.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le widget "Temps \u00e9conomis\u00e9" affiche en temps r\u00e9el le nombre d\'heures que PONIA vous a fait gagner cette semaine et ce mois-ci. Ce compteur est calcul\u00e9 en fonction de vos interactions avec l\'application : chaque commande g\u00e9n\u00e9r\u00e9e automatiquement, chaque alerte qui vous \u00e9vite une v\u00e9rification manuelle, chaque mise \u00e0 jour de stock effectu\u00e9e en un clic. Ce rappel visuel constant vous montre la valeur concr\u00e8te que PONIA apporte \u00e0 votre quotidien.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les indicateurs cl\u00e9s de performance (KPI) sont affich\u00e9s sous forme de cartes color\u00e9es. Vous voyez imm\u00e9diatement le nombre total de produits en stock, la valeur totale de votre inventaire, le nombre de produits en alerte (stock bas ou p\u00e9remption proche), et le score de sant\u00e9 global de votre stock calcul\u00e9 par l\'IA. Ces indicateurs changent de couleur selon leur \u00e9tat : vert quand tout va bien, orange quand une attention est requise, rouge quand une action urgente est n\u00e9cessaire.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // Chat IA
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Le Chat IA : votre assistant personnel', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le Chat IA est le coeur de l\'exp\u00e9rience PONIA. Il utilise la technologie GPT-4o-mini d\'OpenAI, sp\u00e9cialement configur\u00e9e et entra\u00een\u00e9e pour comprendre les besoins des commer\u00e7ants alimentaires. Contrairement \u00e0 un assistant g\u00e9n\u00e9rique, notre IA conna\u00eet les sp\u00e9cificit\u00e9s de votre m\u00e9tier : les contraintes de fra\u00eecheur, les variations saisonni\u00e8res, les habitudes des clients fran\u00e7ais.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Vous pouvez poser vos questions de mani\u00e8re naturelle, sans utiliser de mots-cl\u00e9s sp\u00e9cifiques ou de syntaxe particuli\u00e8re. L\'IA comprend le contexte et l\'intention derri\u00e8re vos questions. Elle a acc\u00e8s \u00e0 l\'ensemble de vos donn\u00e9es : historique des stocks, tendances de vente, dates de p\u00e9remption, seuils d\'alerte. Elle peut donc vous fournir des r\u00e9ponses pr\u00e9cises et actionables.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Des suggestions de questions sont affich\u00e9es pour vous aider \u00e0 d\u00e9couvrir toutes les possibilit\u00e9s. Par exemple : "Quel est l\'\u00e9tat de mon stock ?", "G\u00e9n\u00e8re un bon de commande", "Quels produits dois-je \u00e9couler en priorit\u00e9 ?", "Analyse mes ventes du mois dernier". Ces suggestions sont personnalis\u00e9es en fonction de votre activit\u00e9 et de l\'\u00e9tat actuel de votre stock.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // Gestion de stock
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('La gestion de stock simplifi\u00e9e', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'interface de gestion de stock a \u00e9t\u00e9 con\u00e7ue avec un objectif en t\u00eate : permettre une mise \u00e0 jour compl\u00e8te en moins de 2 minutes, m\u00eame pendant un rush. Chaque \u00e9l\u00e9ment a \u00e9t\u00e9 optimis\u00e9 pour minimiser le nombre de clics et le temps de r\u00e9flexion n\u00e9cessaire.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'ajout d\'un produit se fait via un formulaire simple et intuitif. Vous renseignez le nom du produit, sa cat\u00e9gorie (boissons, \u00e9picerie, frais, surgel\u00e9s, etc.), la quantit\u00e9 actuellement en stock, l\'unit\u00e9 de mesure (pi\u00e8ces, kilogrammes, litres, bo\u00eetes), le seuil d\'alerte en dessous duquel vous souhaitez \u00eatre pr\u00e9venu, le prix d\'achat unitaire pour le suivi de la valeur de votre stock, et optionnellement la date de p\u00e9remption pour les produits concern\u00e9s.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les ajustements rapides de quantit\u00e9 se font directement depuis la liste des produits gr\u00e2ce aux boutons "+" et "-" plac\u00e9s \u00e0 c\u00f4t\u00e9 de chaque article. Un simple appui ajoute ou retire une unit\u00e9. Pour des modifications plus importantes, un appui long ouvre un champ de saisie num\u00e9rique o\u00f9 vous pouvez entrer directement la nouvelle quantit\u00e9. Ces modifications sont enregistr\u00e9es instantan\u00e9ment, sans besoin de valider ou de sauvegarder.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le syst\u00e8me de codes couleur vous permet d\'identifier l\'\u00e9tat de chaque produit en un coup d\'oeil. Le vert indique un stock sain, sup\u00e9rieur au seuil d\'alerte. L\'orange signale un stock bas, proche du seuil. Le rouge alerte sur un stock critique, \u00e9gal ou inf\u00e9rieur au seuil, n\u00e9cessitant une commande urgente. Un badge sp\u00e9cial appara\u00eet \u00e9galement sur les produits dont la date de p\u00e9remption approche.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La recherche et le filtrage permettent de retrouver rapidement n\'importe quel produit parmi des centaines. Vous pouvez rechercher par nom, filtrer par cat\u00e9gorie, afficher uniquement les produits en alerte ou trier par diff\u00e9rents crit\u00e8res (nom, quantit\u00e9, date de p\u00e9remption, valeur). Ces filtres se combinent pour vous permettre de cibler exactement ce que vous cherchez.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // Suggestions IA
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les suggestions intelligentes de l\'IA', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA ne se contente pas d\'attendre vos questions : l\'application analyse en permanence vos donn\u00e9es et vous envoie proactivement des suggestions pertinentes. Ces suggestions apparaissent sous forme de notifications discr\u00e8tes, accessibles via l\'ic\u00f4ne de cloche dans la barre de navigation. Un badge num\u00e9rique indique le nombre de suggestions non lues.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Huit types de suggestions intelligentes sont g\u00e9n\u00e9r\u00e9s automatiquement. Les alertes de p\u00e9remption vous pr\u00e9viennent des produits qui vont expirer dans les 7 prochains jours, vous laissant le temps d\'organiser leur \u00e9coulement. Les pr\u00e9dictions de rupture identifient les produits dont le rythme de consommation actuel m\u00e8nera \u00e0 une rupture de stock, m\u00eame si le niveau actuel semble suffisant.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les alertes de surstock d\u00e9tectent les produits qui stagnent trop longtemps dans vos r\u00e9serves, immobilisant de la tr\u00e9sorerie inutilement. Les pr\u00e9dictions m\u00e9t\u00e9o analysent les pr\u00e9visions locales et leur impact potentiel sur vos ventes : plus de boissons fra\u00eeches quand il fait chaud, plus de soupes quand il fait froid, adaptation aux jours de pluie qui modifient la fr\u00e9quentation.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La d\u00e9tection d\'anomalies rep\u00e8re les variations inhabituelles dans vos stocks qui pourraient indiquer des erreurs de saisie, des probl\u00e8mes de livraison ou m\u00eame des vols. Les id\u00e9es de plat du jour sugg\u00e8rent des recettes ou des associations de produits pour \u00e9couler ceux qui approchent de leur date de p\u00e9remption. Les rappels de commande apprennent vos cycles de r\u00e9approvisionnement et vous rappellent quand il est temps de passer commande aupr\u00e8s de chaque fournisseur.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Enfin, les tendances de vente analysent l\'historique de vos mouvements de stock pour identifier les pics de demande r\u00e9currents : week-ends, d\u00e9buts de mois, p\u00e9riodes de vacances, \u00e9v\u00e9nements locaux. Ces informations vous permettent d\'anticiper et de vous pr\u00e9parer en cons\u00e9quence.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // Commandes
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('La g\u00e9n\u00e9ration automatique de commandes', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'une des fonctionnalit\u00e9s les plus appr\u00e9ci\u00e9es de PONIA est la g\u00e9n\u00e9ration automatique des bons de commande. En un seul clic, l\'IA analyse l\'\u00e9tat complet de votre stock, identifie tous les produits n\u00e9cessitant un r\u00e9approvisionnement, calcule les quantit\u00e9s optimales \u00e0 commander en fonction de vos habitudes de vente, et g\u00e9n\u00e8re un document professionnel pr\u00eat \u00e0 \u00eatre envoy\u00e9 \u00e0 vos fournisseurs.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le bon de commande g\u00e9n\u00e9r\u00e9 inclut la liste compl\u00e8te des produits \u00e0 commander avec leurs r\u00e9f\u00e9rences, les quantit\u00e9s sugg\u00e9r\u00e9es par l\'IA (que vous pouvez ajuster), les prix unitaires et le montant total estim\u00e9 de la commande. Le document est format\u00e9 de mani\u00e8re professionnelle et peut \u00eatre personnalis\u00e9 avec le nom de votre commerce.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Trois options d\'envoi sont disponibles. Le t\u00e9l\u00e9chargement PDF vous permet d\'obtenir un fichier que vous pouvez imprimer, envoyer par email ou archiver. La fonction "Copier pour WhatsApp" formate la commande en texte simple que vous pouvez coller directement dans une conversation WhatsApp avec votre fournisseur, une m\u00e9thode tr\u00e8s populaire chez les petits commer\u00e7ants. L\'envoi par email int\u00e9gr\u00e9 vous permet d\'envoyer la commande directement depuis PONIA si vous avez enregistr\u00e9 l\'adresse email de vos fournisseurs.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // Alertes
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Le syst\u00e8me d\'alertes personnalisables', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA vous tient inform\u00e9 de l\'\u00e9tat de votre stock sans vous submerger de notifications. Le syst\u00e8me d\'alertes a \u00e9t\u00e9 con\u00e7u pour \u00eatre intelligent : les notifications sont group\u00e9es, prioris\u00e9es et envoy\u00e9es aux moments opportuns. Vous pouvez personnaliser enti\u00e8rement vos pr\u00e9f\u00e9rences pour recevoir exactement les informations dont vous avez besoin.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les alertes de stock bas sont d\u00e9clench\u00e9es lorsqu\'un produit passe sous son seuil d\'alerte personnalis\u00e9. Vous d\u00e9finissez ce seuil pour chaque produit en fonction de son importance et de son d\u00e9lai de r\u00e9approvisionnement. Les alertes de p\u00e9remption sont envoy\u00e9es 7 jours, 3 jours et 1 jour avant la date d\'expiration, vous laissant le temps d\'agir. Vous pouvez choisir de recevoir ces alertes par email, dans l\'application, ou les deux.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Un r\u00e9sum\u00e9 quotidien optionnel peut \u00eatre envoy\u00e9 chaque matin \u00e0 l\'heure de votre choix. Ce r\u00e9sum\u00e9 compile toutes les informations importantes : produits \u00e0 commander, articles expirant bient\u00f4t, anomalies d\u00e9tect\u00e9es, pr\u00e9visions m\u00e9t\u00e9o et leur impact sur vos ventes. C\'est un excellent moyen de commencer la journ\u00e9e avec une vision claire de ce qui vous attend.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // Statistiques
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les statistiques et analyses', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'onglet Statistiques vous donne acc\u00e8s \u00e0 une vision approfondie de votre activit\u00e9. Des graphiques clairs et lisibles pr\u00e9sentent l\'\u00e9volution de votre stock dans le temps, les tendances de consommation par cat\u00e9gorie, la valeur de votre inventaire, et les performances de chaque produit.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Vous pouvez analyser vos donn\u00e9es sur diff\u00e9rentes p\u00e9riodes : la semaine en cours, le mois, le trimestre ou l\'ann\u00e9e. Les comparaisons avec les p\u00e9riodes pr\u00e9c\u00e9dentes vous permettent d\'identifier les \u00e9volutions et les tendances. Par exemple, vous pouvez voir si vos ventes de tel produit ont augment\u00e9 ou diminu\u00e9 par rapport au m\u00eame mois l\'ann\u00e9e derni\u00e8re.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le score de sant\u00e9 du stock est un indicateur synth\u00e9tique calcul\u00e9 par l\'IA qui prend en compte de nombreux facteurs : niveau des stocks par rapport aux seuils, proximit\u00e9 des dates de p\u00e9remption, \u00e9quilibre entre les cat\u00e9gories, rotation des produits. Ce score vous donne une id\u00e9e imm\u00e9diate de la situation globale et de son \u00e9volution dans le temps.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // Int\u00e9grations POS
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les int\u00e9grations avec les caisses enregistreuses', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Pour les abonn\u00e9s Standard et Pro, PONIA peut se connecter directement \u00e0 votre caisse enregistreuse pour synchroniser automatiquement les mouvements de stock. Chaque vente enregistr\u00e9e sur votre caisse est automatiquement r\u00e9percut\u00e9e dans PONIA, \u00e9liminant le besoin de mises \u00e0 jour manuelles.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les syst\u00e8mes de caisse actuellement support\u00e9s incluent Square, Zettle (anciennement iZettle, groupe PayPal), SumUp, Tiller, Lightspeed X-Series, Lightspeed K-Series et Hiboutik. D\'autres int\u00e9grations sont r\u00e9guli\u00e8rement ajout\u00e9es en fonction des demandes des utilisateurs. Si votre syst\u00e8me de caisse n\'est pas encore support\u00e9, n\'h\u00e9sitez pas \u00e0 nous contacter pour que nous \u00e9tudiions la possibilit\u00e9 de l\'int\u00e9grer.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La configuration de l\'int\u00e9gration est simple et guid\u00e9e pas \u00e0 pas. Vous n\'avez pas besoin de comp\u00e9tences techniques particuli\u00e8res. Une fois l\'int\u00e9gration activ\u00e9e, la synchronisation est automatique et en temps r\u00e9el. Vous pouvez \u00e0 tout moment v\u00e9rifier l\'\u00e9tat de la connexion et consulter l\'historique des synchronisations.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // Multi-magasins
  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('La gestion multi-magasins', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Pour les commer\u00e7ants qui poss\u00e8dent plusieurs points de vente, PONIA Pro offre une gestion centralis\u00e9e de tous les \u00e9tablissements. Depuis un seul compte, vous pouvez visualiser et g\u00e9rer le stock de chacun de vos magasins, comparer leurs performances et optimiser les transferts de marchandises entre eux.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Chaque magasin dispose de son propre inventaire, de ses propres seuils d\'alerte et de ses propres statistiques. L\'IA analyse s\u00e9par\u00e9ment les tendances de chaque \u00e9tablissement, car les habitudes de consommation peuvent varier d\'un quartier ou d\'une ville \u00e0 l\'autre. Vous pouvez cependant g\u00e9n\u00e9rer des commandes group\u00e9es pour b\u00e9n\u00e9ficier de meilleures conditions aupr\u00e8s de vos fournisseurs.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // --- D\u00c9MARRAGE ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('D\u00e9marrer avec PONIA', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(230, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La mise en place de PONIA dans votre commerce se fait en quelques minutes. Aucune installation complexe, aucune formation pr\u00e9alable n\'est n\u00e9cessaire. Voici les trois \u00e9tapes pour commencer :',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text('\u00c9tape 1 : Cr\u00e9ez votre compte gratuit', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Rendez-vous sur myponia.fr et cliquez sur le bouton "Essai gratuit". Renseignez votre adresse email, choisissez un mot de passe, puis indiquez le nom de votre commerce et son adresse. Cette adresse permet \u00e0 PONIA de vous fournir des pr\u00e9visions m\u00e9t\u00e9o localis\u00e9es. Aucune carte bancaire n\'est demand\u00e9e pour l\'essai. Vous b\u00e9n\u00e9ficiez imm\u00e9diatement de 14 jours d\'acc\u00e8s complet \u00e0 toutes les fonctionnalit\u00e9s.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text('\u00c9tape 2 : Ajoutez vos premiers produits', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Depuis l\'onglet Stock, commencez par ajouter vos produits les plus importants. Nous vous conseillons de d\u00e9buter avec une dizaine d\'articles cl\u00e9s plut\u00f4t que d\'essayer de tout saisir d\'un coup. Pour chaque produit, indiquez le nom, la cat\u00e9gorie, la quantit\u00e9 actuelle et le seuil d\'alerte souhait\u00e9. Vous pourrez compl\u00e9ter votre catalogue progressivement dans les jours suivants.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text('\u00c9tape 3 : Laissez l\'IA travailler pour vous', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'D\u00e8s que vos premiers produits sont enregistr\u00e9s, PONIA commence \u00e0 analyser votre stock et \u00e0 pr\u00e9parer ses recommandations. Vous recevrez vos premi\u00e8res alertes et suggestions dans les heures qui suivent. Votre seule t\u00e2che quotidienne sera de mettre \u00e0 jour les quantit\u00e9s en quelques clics lorsque vous recevez des livraisons ou constatez des mouvements. L\'IA s\'occupe du reste.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // --- TARIFS ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Nos offres tarifaires', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(210, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA propose trois formules adapt\u00e9es \u00e0 diff\u00e9rents besoins et tailles de commerce. Toutes les formules incluent un essai gratuit de 14 jours sans engagement et sans carte bancaire requise. Vous pouvez changer de formule ou annuler \u00e0 tout moment.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('BASIQUE - Gratuit', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La formule Basique est enti\u00e8rement gratuite et sans limite de dur\u00e9e. Elle permet de g\u00e9rer jusqu\'\u00e0 10 produits, ce qui convient aux tr\u00e8s petits commerces ou pour tester l\'application sur une s\u00e9lection de produits cl\u00e9s. Vous b\u00e9n\u00e9ficiez de 5 messages par jour avec l\'assistant IA, des alertes de stock bas, et du score de sant\u00e9 de votre stock.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('STANDARD - 49\u20ac par mois', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La formule Standard est con\u00e7ue pour les commerces de taille moyenne. Elle permet de g\u00e9rer jusqu\'\u00e0 50 produits avec un acc\u00e8s illimit\u00e9 \u00e0 l\'assistant IA. Vous b\u00e9n\u00e9ficiez des pr\u00e9dictions de stock sur 7 jours, des int\u00e9grations avec les principales caisses enregistreuses, des alertes de p\u00e9remption, de la g\u00e9n\u00e9ration automatique de commandes et du support par email avec r\u00e9ponse garantie sous 24 heures.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('PRO - 69\u20ac par mois', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La formule Pro offre toutes les fonctionnalit\u00e9s de PONIA sans aucune limite. Nombre de produits illimit\u00e9, pr\u00e9dictions de stock sur 30 jours, gestion multi-magasins pour ceux qui poss\u00e8dent plusieurs points de vente, commandes vocales pour une utilisation encore plus rapide les mains occup\u00e9es, et support prioritaire avec r\u00e9ponse garantie sous 4 heures. C\'est la formule id\u00e9ale pour les commerces ambitieux qui veulent tirer le maximum de l\'IA.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold')
     .text('Sans engagement - Annulation possible \u00e0 tout moment en un clic', marginLeft, doc.y, { width: contentWidth, align: 'center' })
  doc.moveDown(1.5)

  // --- CONTACT ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Contact et support', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(200, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Notre \u00e9quipe est \u00e0 votre disposition pour r\u00e9pondre \u00e0 toutes vos questions, vous aider \u00e0 configurer votre compte ou r\u00e9soudre tout probl\u00e8me que vous pourriez rencontrer. Nous mettons un point d\'honneur \u00e0 offrir un support humain et r\u00e9actif, car nous savons que votre temps est pr\u00e9cieux.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text('Email : ', marginLeft, doc.y, { continued: true })
  doc.font('Helvetica').fillColor(DARK_GRAY).text('support@myponia.fr')
  doc.moveDown(0.3)
  doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text('Site web : ', marginLeft, doc.y, { continued: true })
  doc.font('Helvetica').fillColor(DARK_GRAY).text('myponia.fr')
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les abonn\u00e9s Standard b\u00e9n\u00e9ficient d\'une r\u00e9ponse garantie sous 24 heures ouvrables. Les abonn\u00e9s Pro disposent d\'un support prioritaire avec r\u00e9ponse garantie sous 4 heures. Pour les utilisateurs de la formule gratuite, nous faisons notre maximum pour r\u00e9pondre dans les meilleurs d\u00e9lais.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.5)

  // --- FAQ ---
  doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold')
     .text('Questions fr\u00e9quentes', marginLeft)
  doc.moveDown(0.8)

  const faqs = [
    { 
      q: 'Mes donn\u00e9es sont-elles s\u00e9curis\u00e9es ?', 
      a: 'Absolument. Toutes vos donn\u00e9es sont chiffr\u00e9es en transit et au repos. Nos serveurs sont h\u00e9berg\u00e9s en Europe dans des centres de donn\u00e9es certifi\u00e9s. Nous ne partageons jamais vos informations avec des tiers et vous restez propri\u00e9taire de toutes vos donn\u00e9es.' 
    },
    { 
      q: 'Puis-je annuler mon abonnement \u00e0 tout moment ?', 
      a: 'Oui, PONIA est sans engagement. Vous pouvez annuler votre abonnement en un clic depuis les param\u00e8tres de votre compte. L\'annulation prend effet \u00e0 la fin de la p\u00e9riode de facturation en cours et vous conservez l\'acc\u00e8s jusqu\'\u00e0 cette date.' 
    },
    { 
      q: 'PONIA fonctionne-t-il avec ma caisse enregistreuse ?', 
      a: 'PONIA s\'int\u00e8gre avec les principales solutions de caisse du march\u00e9 : Square, Zettle, SumUp, Tiller, Lightspeed et Hiboutik. Si votre syst\u00e8me n\'est pas encore support\u00e9, contactez-nous et nous \u00e9tudierons la possibilit\u00e9 de l\'ajouter.' 
    },
    { 
      q: 'Combien de temps faut-il pour configurer PONIA ?', 
      a: 'La cr\u00e9ation de compte prend moins d\'une minute. L\'ajout de vos premiers produits peut se faire en 10 \u00e0 15 minutes. Nous vous conseillons de commencer par une dizaine de produits cl\u00e9s et de compl\u00e9ter progressivement.' 
    },
    { 
      q: 'L\'IA fonctionne-t-elle vraiment pour les petits commerces ?', 
      a: 'Oui, notre IA a \u00e9t\u00e9 sp\u00e9cifiquement entra\u00een\u00e9e sur des donn\u00e9es de petits commerces alimentaires fran\u00e7ais. Elle comprend les sp\u00e9cificit\u00e9s de votre m\u00e9tier et s\'adapte \u00e0 vos habitudes de vente uniques.' 
    }
  ]

  faqs.forEach((faq) => {
    doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold').text(faq.q, marginLeft)
    doc.moveDown(0.2)
    doc.fontSize(10).fillColor(MEDIUM_GRAY).font('Helvetica')
       .text(faq.a, marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 3 })
    doc.moveDown(0.8)
  })

  doc.moveDown(1)

  // --- CONCLUSION ---
  doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold')
     .text('Merci de votre confiance', marginLeft, doc.y, { width: contentWidth, align: 'center' })
  doc.moveDown(0.5)
  doc.fontSize(11).fillColor(MEDIUM_GRAY).font('Helvetica')
     .text('L\'\u00e9quipe PONIA est \u00e0 vos c\u00f4t\u00e9s pour vous aider \u00e0 g\u00e9rer votre commerce plus sereinement.', marginLeft, doc.y, { width: contentWidth, align: 'center' })
  doc.moveDown(1)

  try {
    const logoPath = path.join(process.cwd(), 'public', 'ponia-logo.png')
    doc.image(logoPath, (pageWidth - 60) / 2, doc.y, { width: 60 })
  } catch (error) {
    doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
       .text('PONIA', marginLeft, doc.y, { width: contentWidth, align: 'center' })
  }

  // Num\u00e9rotation des pages
  const pages = doc.bufferedPageRange()
  for (let i = 1; i < pages.count; i++) {
    doc.switchToPage(i)
    doc.fontSize(8).fillColor(LIGHT_GRAY)
       .text(`- ${i + 1} -`, marginLeft, 810, { width: contentWidth, align: 'center' })
  }

  return doc
}
