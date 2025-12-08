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
  // CONTENU
  // ═══════════════════════════════════════════════════════════════════════

  doc.addPage()

  // --- INTRODUCTION ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Qu\'est-ce que PONIA ?', marginLeft, 50)
  doc.moveTo(marginLeft, 78).lineTo(220, 78).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA est une application de gestion de stock intelligente con\u00e7ue sp\u00e9cifiquement pour les petits commerces alimentaires fran\u00e7ais. L\'application s\'adresse aux boulangeries, restaurants, bars, caves \u00e0 vin, fromageries et tous les commerces de proximit\u00e9 qui g\u00e8rent des produits p\u00e9rissables au quotidien. PONIA combine une interface mobile-first ultra-simple avec une intelligence artificielle avanc\u00e9e pour transformer la gestion de stock, traditionnellement chronophage et source d\'erreurs, en une t\u00e2che rapide et automatis\u00e9e ne prenant que deux minutes par jour.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le probl\u00e8me que PONIA r\u00e9sout est universel dans le secteur alimentaire : les commer\u00e7ants perdent en moyenne 7 heures par semaine sur des t\u00e2ches de gestion de stock manuelles, tout en subissant des ruptures de stock qui font perdre des ventes et du gaspillage de produits p\u00e9rim\u00e9s qui repr\u00e9sente de l\'argent jet\u00e9 \u00e0 la poubelle. Les solutions existantes sont soit trop complexes et con\u00e7ues pour les grandes surfaces, soit trop basiques et n\'apportent aucune intelligence. PONIA se positionne comme la premi\u00e8re solution v\u00e9ritablement adapt\u00e9e aux petits commerces, avec une IA qui comprend les sp\u00e9cificit\u00e9s du m\u00e9tier.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.2)

  // --- OBJECTIFS ---
  doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les objectifs de PONIA', marginLeft)
  doc.moveDown(0.6)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le premier objectif de PONIA est d\'\u00e9liminer totalement les ruptures de stock. L\'intelligence artificielle analyse en continu les niveaux de stock, les tendances de consommation, les cycles de vente hebdomadaires et m\u00eame les pr\u00e9visions m\u00e9t\u00e9orologiques pour d\u00e9tecter les produits qui risquent de manquer avant que la situation ne devienne critique. Des alertes sont envoy\u00e9es automatiquement par email et dans l\'application, permettant d\'anticiper les commandes et de ne jamais d\u00e9cevoir un client qui cherche un produit indisponible.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le deuxi\u00e8me objectif est de r\u00e9duire drastiquement le gaspillage alimentaire. PONIA suit les dates de p\u00e9remption de chaque produit et envoie des alertes \u00e0 7 jours, 3 jours et 1 jour avant l\'expiration. Ces rappels permettent d\'organiser des promotions, de mettre en avant certains produits en vitrine, ou de les utiliser dans des pr\u00e9parations avant qu\'ils ne soient perdus. L\'IA sugg\u00e8re \u00e9galement des id\u00e9es de plats du jour pour \u00e9couler intelligemment les produits approchant de leur date limite.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le troisi\u00e8me objectif est de faire gagner un temps consid\u00e9rable aux commer\u00e7ants. Entre les comptages manuels, la r\u00e9daction des commandes fournisseurs, le suivi des livraisons et la v\u00e9rification des dates de p\u00e9remption, un commer\u00e7ant passe en moyenne plus de 7 heures par semaine sur ces t\u00e2ches administratives. PONIA automatise l\'ensemble de ces processus : g\u00e9n\u00e9ration automatique des bons de commande, mise \u00e0 jour des stocks en quelques clics, alertes intelligentes qui \u00e9vitent de tout surveiller en permanence. Le temps lib\u00e9r\u00e9 peut \u00eatre r\u00e9investi dans l\'accueil des clients, la qualit\u00e9 des produits ou la vie personnelle.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le quatri\u00e8me objectif est d\'aider \u00e0 prendre de meilleures d\u00e9cisions commerciales. Gr\u00e2ce aux statistiques d\u00e9taill\u00e9es, aux graphiques d\'\u00e9volution et aux pr\u00e9dictions de l\'IA, PONIA permet de savoir exactement quoi commander, en quelle quantit\u00e9 et \u00e0 quel moment. L\'application identifie les produits les plus rentables, ceux qui stagnent trop longtemps, les pics de demande r\u00e9currents et les tendances saisonni\u00e8res. Ces informations transform\u00e9es en actions concr\u00e8tes am\u00e9liorent significativement la rentabilit\u00e9 du commerce.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.2)

  // --- AVANTAGES ---
  doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les avantages concrets de PONIA', marginLeft)
  doc.moveDown(0.6)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'augmentation du chiffre d\'affaires est le premier avantage mesurable. En \u00e9vitant les ruptures de stock sur les produits phares, aucune vente n\'est manqu\u00e9e. Les utilisateurs de PONIA constatent en moyenne une augmentation de 8 \u00e0 15% de leur chiffre d\'affaires apr\u00e8s trois mois d\'utilisation, simplement parce qu\'ils ont toujours les bons produits disponibles au bon moment. Les pr\u00e9dictions bas\u00e9es sur la m\u00e9t\u00e9o et les \u00e9v\u00e9nements locaux permettent \u00e9galement d\'anticiper les pics de demande et de s\'y pr\u00e9parer.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La r\u00e9duction des pertes financi\u00e8res li\u00e9es au gaspillage est le deuxi\u00e8me avantage majeur. Le suivi pr\u00e9cis des dates de p\u00e9remption et les alertes proactives permettent de r\u00e9duire le gaspillage de 40 \u00e0 60% en moyenne. Pour un commerce qui jetait 500 euros de marchandises par mois, cela repr\u00e9sente une \u00e9conomie de 200 \u00e0 300 euros mensuels, soit bien plus que le co\u00fbt de l\'abonnement PONIA. Cette r\u00e9duction du gaspillage a \u00e9galement un impact environnemental positif non n\u00e9gligeable.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le gain de temps est peut-\u00eatre l\'avantage le plus appr\u00e9ci\u00e9 par les utilisateurs. PONIA affiche en temps r\u00e9el le temps \u00e9conomis\u00e9 gr\u00e2ce \u00e0 l\'application via un widget d\u00e9di\u00e9. Ce compteur calcule les heures gagn\u00e9es sur les t\u00e2ches automatis\u00e9es : chaque commande g\u00e9n\u00e9r\u00e9e automatiquement, chaque alerte qui \u00e9vite une v\u00e9rification manuelle, chaque mise \u00e0 jour de stock effectu\u00e9e en un clic. Le temps \u00e9conomis\u00e9 est \u00e9galement converti en valeur mon\u00e9taire pour illustrer concr\u00e8tement que le temps, c\'est de l\'argent. Les utilisateurs rapportent gagner entre 5 et 10 heures par semaine.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La s\u00e9r\u00e9nit\u00e9 au quotidien est un avantage moins quantifiable mais tout aussi important. PONIA surveille le stock en permanence et alerte uniquement quand c\'est n\u00e9cessaire. Plus besoin de s\'inqui\u00e9ter en permanence de l\'\u00e9tat des r\u00e9serves, de noter mentalement les produits \u00e0 commander, ou de craindre d\'oublier quelque chose. L\'application prend en charge cette charge mentale et permet de se concentrer sur le coeur du m\u00e9tier.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.2)

  // --- TEMPS \u00c9CONOMIS\u00c9 ---
  doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold')
     .text('Le temps \u00e9conomis\u00e9 : la valeur centrale de PONIA', marginLeft)
  doc.moveDown(0.6)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA place le temps \u00e9conomis\u00e9 au coeur de sa proposition de valeur. Un widget d\u00e9di\u00e9 sur le tableau de bord affiche en permanence le temps gagn\u00e9 cette semaine et ce mois-ci. Ce calcul est bas\u00e9 sur les actions effectu\u00e9es dans l\'application : chaque produit ajout\u00e9 via le scan de code-barres plut\u00f4t que manuellement, chaque bon de commande g\u00e9n\u00e9r\u00e9 automatiquement par l\'IA plut\u00f4t que r\u00e9dig\u00e9 \u00e0 la main, chaque alerte qui \u00e9vite un tour de v\u00e9rification en r\u00e9serve.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le temps \u00e9conomis\u00e9 est \u00e9galement converti en valeur mon\u00e9taire. En consid\u00e9rant le co\u00fbt horaire moyen d\'un commer\u00e7ant, PONIA affiche combien d\'argent a \u00e9t\u00e9 \u00e9conomis\u00e9 en lib\u00e9rant ces heures de travail. Cette visualisation concr\u00e8te permet de mesurer le retour sur investissement de l\'abonnement. L\'objectif annonc\u00e9 est de faire gagner au minimum 7 heures par semaine \u00e0 chaque utilisateur, un objectif r\u00e9guli\u00e8rement d\u00e9pass\u00e9 selon les retours des utilisateurs.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.2)

  // --- 3 M\u00c9THODES D'AJOUT ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les trois m\u00e9thodes d\'ajout de produits', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(320, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA propose trois m\u00e9thodes distinctes pour ajouter des produits \u00e0 l\'inventaire, chacune adapt\u00e9e \u00e0 un contexte d\'utilisation diff\u00e9rent. Cette flexibilit\u00e9 permet de d\u00e9marrer rapidement avec l\'application et de l\'adapter \u00e0 ses habitudes de travail.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('M\u00e9thode 1 : La saisie manuelle', marginLeft)
  doc.moveDown(0.4)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La saisie manuelle est la m\u00e9thode traditionnelle qui permet d\'ajouter un produit en remplissant un formulaire complet. Cette m\u00e9thode est id\u00e9ale pour les produits artisanaux, les pr\u00e9parations maison ou les articles sans code-barres. Le formulaire demande le nom du produit, sa cat\u00e9gorie (les cat\u00e9gories sont adapt\u00e9es au type de commerce : boulangerie, restaurant, cave \u00e0 vin, etc.), la quantit\u00e9 actuelle en stock, l\'unit\u00e9 de mesure (pi\u00e8ces, kilogrammes, litres, bouteilles, etc.), le seuil d\'alerte en dessous duquel une notification sera envoy\u00e9e, le prix d\'achat unitaire pour le calcul de la valeur du stock, et optionnellement la date de p\u00e9remption pour les produits concern\u00e9s. La saisie manuelle prend environ 30 secondes par produit.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('M\u00e9thode 2 : Le scan de code-barres ou QR code', marginLeft)
  doc.moveDown(0.4)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le scan de code-barres est la m\u00e9thode la plus rapide pour ajouter des produits industriels. Il suffit de pointer la cam\u00e9ra du t\u00e9l\u00e9phone vers le code-barres ou le QR code d\'un produit. PONIA reconna\u00eet automatiquement le code et interroge la base de donn\u00e9es Open Food Facts, qui contient des millions de produits alimentaires r\u00e9f\u00e9renc\u00e9s. Si le produit est trouv\u00e9, son nom, sa cat\u00e9gorie et ses informations sont automatiquement renseign\u00e9s. Il ne reste plus qu\'\u00e0 indiquer la quantit\u00e9 en stock et le seuil d\'alerte souhait\u00e9. Cette m\u00e9thode permet d\'ajouter un produit en moins de 5 secondes. Si le produit n\'est pas r\u00e9f\u00e9renc\u00e9 dans la base de donn\u00e9es, le formulaire manuel s\'ouvre avec le code-barres d\u00e9j\u00e0 enregistr\u00e9.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('M\u00e9thode 3 : L\'import de document par IA', marginLeft)
  doc.moveDown(0.4)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'import de document est la m\u00e9thode la plus puissante pour ajouter de nombreux produits en une seule fois. Il suffit de prendre en photo une facture fournisseur, un bon de livraison, une liste de stock manuscrite ou tout autre document contenant une liste de produits. L\'intelligence artificielle de PONIA analyse l\'image, reconna\u00eet les noms de produits, les quantit\u00e9s et les unit\u00e9s, puis pr\u00e9sente une liste de produits d\u00e9tect\u00e9s. Chaque produit peut \u00eatre valid\u00e9, modifi\u00e9 ou ignor\u00e9 avant l\'import final. Cette m\u00e9thode est particuli\u00e8rement utile lors de la mise en place initiale de PONIA ou apr\u00e8s r\u00e9ception d\'une grosse livraison. L\'IA accepte les formats JPG, PNG et PDF, avec une taille maximale de 10 Mo. Plus l\'image est nette et bien cadr\u00e9e, meilleure sera la reconnaissance.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.2)

  // --- GESTION DE STOCK ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('La gestion de stock au quotidien', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(300, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'interface de gestion de stock de PONIA a \u00e9t\u00e9 con\u00e7ue avec un objectif en t\u00eate : permettre une mise \u00e0 jour compl\u00e8te de l\'inventaire en moins de deux minutes, m\u00eame pendant un rush. Chaque \u00e9l\u00e9ment de l\'interface a \u00e9t\u00e9 optimis\u00e9 pour minimiser le nombre de clics et le temps de r\u00e9flexion n\u00e9cessaire. L\'interface est enti\u00e8rement responsive et fonctionne aussi bien sur smartphone que sur tablette ou ordinateur.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les ajustements rapides de quantit\u00e9 se font directement depuis la liste des produits gr\u00e2ce aux boutons "+" et "-" plac\u00e9s \u00e0 c\u00f4t\u00e9 de chaque article. Un simple appui ajoute ou retire une unit\u00e9. Pour des modifications plus importantes, un appui long ouvre un champ de saisie num\u00e9rique permettant d\'entrer directement la nouvelle quantit\u00e9. Ces modifications sont enregistr\u00e9es instantan\u00e9ment gr\u00e2ce \u00e0 un syst\u00e8me de mise \u00e0 jour optimiste : l\'interface r\u00e9agit imm\u00e9diatement sans attendre la confirmation du serveur, ce qui rend l\'utilisation extr\u00eamement fluide.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le syst\u00e8me de codes couleur permet d\'identifier l\'\u00e9tat de chaque produit en un coup d\'oeil. Le vert indique un stock sain, sup\u00e9rieur au seuil d\'alerte d\u00e9fini. L\'orange signale un stock bas, proche du seuil, n\u00e9cessitant une attention dans les prochains jours. Le rouge alerte sur un stock critique, \u00e9gal ou inf\u00e9rieur au seuil, n\u00e9cessitant une commande urgente. Un badge sp\u00e9cifique appara\u00eet \u00e9galement sur les produits dont la date de p\u00e9remption approche, permettant d\'identifier imm\u00e9diatement les articles \u00e0 \u00e9couler en priorit\u00e9.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La recherche et le filtrage permettent de retrouver rapidement n\'importe quel produit parmi des centaines. Un champ de recherche permet de trouver un produit par son nom. Des filtres permettent d\'afficher uniquement les produits d\'une cat\u00e9gorie, uniquement ceux en alerte, ou de trier par diff\u00e9rents crit\u00e8res : nom alphab\u00e9tique, quantit\u00e9, date de p\u00e9remption, valeur. Ces filtres se combinent pour cibler exactement ce qui est recherch\u00e9.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'historique des mouvements de stock est conserv\u00e9 et accessible \u00e0 tout moment. Chaque modification de quantit\u00e9 est enregistr\u00e9e avec la date, l\'heure, la quantit\u00e9 avant et apr\u00e8s modification. Cet historique permet d\'analyser les tendances de consommation, d\'identifier les anomalies et de comprendre l\'\u00e9volution du stock dans le temps. L\'historique est accessible sur 30 jours pour les abonn\u00e9s Standard et 90 jours pour les abonn\u00e9s Pro.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.2)

  // --- INT\u00c9GRATIONS POS ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('La synchronisation automatique avec les caisses', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(370, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA s\'int\u00e8gre directement avec les principales solutions de caisse enregistreuse du march\u00e9. Une fois la connexion \u00e9tablie, la synchronisation est enti\u00e8rement automatique et se fait en temps r\u00e9el. Chaque vente enregistr\u00e9e sur la caisse est automatiquement r\u00e9percut\u00e9e dans PONIA : le stock du produit vendu est imm\u00e9diatement diminu\u00e9, sans aucune intervention manuelle n\u00e9cessaire. Cette automatisation \u00e9limine totalement le besoin de mettre \u00e0 jour manuellement les quantit\u00e9s apr\u00e8s chaque vente.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le syst\u00e8me utilise des webhooks, un m\u00e9canisme technique qui permet \u00e0 la caisse d\'envoyer instantan\u00e9ment une notification \u00e0 PONIA d\u00e8s qu\'une vente est effectu\u00e9e. Cette technologie garantit une synchronisation en temps r\u00e9el, sans d\u00e9lai. Le stock dans PONIA refl\u00e8te \u00e0 tout moment l\'\u00e9tat r\u00e9el des r\u00e9serves, ce qui permet \u00e0 l\'IA de fournir des pr\u00e9dictions et des alertes toujours bas\u00e9es sur des donn\u00e9es \u00e0 jour.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les syst\u00e8mes de caisse actuellement support\u00e9s incluent Square, Zettle (anciennement iZettle, groupe PayPal), SumUp, Tiller, Lightspeed X-Series, Lightspeed K-Series et Hiboutik. Ces int\u00e9grations couvrent la grande majorit\u00e9 des solutions utilis\u00e9es par les petits commerces fran\u00e7ais. De nouvelles int\u00e9grations sont r\u00e9guli\u00e8rement ajout\u00e9es en fonction des demandes des utilisateurs. La configuration de l\'int\u00e9gration se fait en quelques clics depuis les param\u00e8tres de l\'application, avec un guide pas \u00e0 pas qui ne n\u00e9cessite aucune comp\u00e9tence technique.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les int\u00e9grations avec les caisses enregistreuses sont disponibles pour les abonn\u00e9s Standard et Pro. Les utilisateurs de la formule Basique gratuite peuvent continuer \u00e0 mettre \u00e0 jour leur stock manuellement via les boutons + et - de l\'interface.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.2)

  // --- INTELLIGENCE ARTIFICIELLE ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('L\'intelligence artificielle de PONIA', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(320, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'intelligence artificielle est ce qui diff\u00e9rencie fondamentalement PONIA des simples tableurs ou applications de gestion basiques. PONIA utilise une approche hybride combinant un moteur de r\u00e8gles local pour les pr\u00e9dictions imm\u00e9diates et le mod\u00e8le GPT-4o-mini d\'OpenAI pour les analyses avanc\u00e9es et les conversations. Cette architecture permet d\'offrir des r\u00e9ponses instantan\u00e9es pour les op\u00e9rations courantes tout en b\u00e9n\u00e9ficiant de la puissance d\'une IA de pointe pour les analyses complexes.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les 8 types de suggestions intelligentes', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA g\u00e9n\u00e8re automatiquement 8 types de suggestions intelligentes qui apparaissent sous forme de notifications dans l\'application. Les alertes de p\u00e9remption pr\u00e9viennent des produits qui expirent dans les 7, 3 et 1 jour(s) \u00e0 venir, permettant d\'organiser leur \u00e9coulement avant qu\'ils ne soient perdus. Les pr\u00e9dictions de rupture identifient les produits dont le rythme de consommation actuel m\u00e8nera \u00e0 une rupture de stock, m\u00eame si le niveau actuel semble suffisant.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les alertes de surstock d\u00e9tectent les produits qui stagnent trop longtemps en r\u00e9serve, immobilisant de la tr\u00e9sorerie inutilement et risquant de p\u00e9rimer. Les pr\u00e9dictions m\u00e9t\u00e9o analysent les pr\u00e9visions locales et leur impact potentiel sur les ventes : plus de boissons fra\u00eeches et de glaces quand il fait chaud, plus de soupes et de boissons chaudes quand il fait froid, adaptation aux jours de pluie qui modifient la fr\u00e9quentation.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La d\u00e9tection d\'anomalies rep\u00e8re les variations inhabituelles dans les stocks qui pourraient indiquer des erreurs de saisie, des probl\u00e8mes de livraison ou m\u00eame des vols potentiels. Les id\u00e9es de plat du jour sont g\u00e9n\u00e9r\u00e9es par l\'IA GPT-4o-mini pour sugg\u00e9rer des recettes ou des associations de produits permettant d\'\u00e9couler ceux qui approchent de leur date de p\u00e9remption. Les rappels de commande apprennent les cycles de r\u00e9approvisionnement habituels et rappellent quand il est temps de passer commande aupr\u00e8s de chaque fournisseur. Enfin, les tendances de vente analysent l\'historique pour identifier les pics de demande r\u00e9currents.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Le Chat IA : un assistant conversationnel', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le Chat IA permet de poser des questions en langage naturel, exactement comme on parlerait \u00e0 un employ\u00e9. Il est possible de demander "Qu\'est-ce que je dois commander cette semaine ?", "Quels produits vont bient\u00f4t p\u00e9rimer ?", "Comment se portent mes ventes de vin ce mois-ci ?", ou toute autre question concernant le stock et l\'activit\u00e9. L\'IA analyse instantan\u00e9ment les donn\u00e9es et r\u00e9pond avec des informations pr\u00e9cises et personnalis\u00e9es.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le Chat IA a acc\u00e8s \u00e0 l\'ensemble des donn\u00e9es : historique des stocks, tendances de vente, dates de p\u00e9remption, seuils d\'alerte, pr\u00e9visions m\u00e9t\u00e9o et \u00e9v\u00e9nements locaux. Il peut donc fournir des r\u00e9ponses contextualis\u00e9es et actionables. Des suggestions de questions sont affich\u00e9es pour aider \u00e0 d\u00e9couvrir toutes les possibilit\u00e9s. La formule Basique inclut 5 messages par jour, tandis que les formules Standard et Pro offrent un acc\u00e8s illimit\u00e9 au Chat IA.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les pr\u00e9dictions m\u00e9t\u00e9o', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA int\u00e8gre les donn\u00e9es m\u00e9t\u00e9orologiques d\'OpenWeatherMap pour anticiper l\'impact du temps sur les ventes. Lors de l\'inscription, l\'adresse du commerce est g\u00e9olocalis\u00e9e gr\u00e2ce \u00e0 l\'API Adresse du gouvernement fran\u00e7ais, ce qui permet d\'obtenir des pr\u00e9visions m\u00e9t\u00e9o localis\u00e9es pr\u00e9cises. L\'IA analyse ces pr\u00e9visions et leur impact potentiel sur les diff\u00e9rentes cat\u00e9gories de produits.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Par exemple, une vague de chaleur annonc\u00e9e d\u00e9clenchera des suggestions d\'augmenter les stocks de boissons fra\u00eeches, de glaces et de salades. Une p\u00e9riode de froid intense sugg\u00e8rera de pr\u00e9voir plus de soupes, de boissons chaudes et de plats r\u00e9confortants. Les jours de pluie, qui modifient souvent la fr\u00e9quentation des commerces, sont \u00e9galement pris en compte dans les pr\u00e9dictions. Ces suggestions m\u00e9t\u00e9o-bas\u00e9es sont particuli\u00e8rement appr\u00e9ci\u00e9es par les restaurants et les bars.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les \u00e9v\u00e9nements locaux', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA int\u00e8gre \u00e9galement les donn\u00e9es d\'\u00e9v\u00e9nements locaux pour anticiper les pics de fr\u00e9quentation. Pour les commerces situ\u00e9s en r\u00e9gion parisienne, l\'application se connecte \u00e0 Paris OpenData pour r\u00e9cup\u00e9rer les \u00e9v\u00e9nements \u00e0 venir dans un rayon d\u00e9fini autour du commerce. Concerts, festivals, manifestations sportives, march\u00e9s sp\u00e9ciaux : tous ces \u00e9v\u00e9nements sont analys\u00e9s pour leur impact potentiel sur l\'activit\u00e9.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'IA estime le nombre de participants attendus, le type de public et l\'impact probable sur les ventes du commerce. Par exemple, un concert en soir\u00e9e \u00e0 proximit\u00e9 sugg\u00e8rera de pr\u00e9voir plus de boissons et de snacks. Un marathon passant devant le commerce d\u00e9clenchera des suggestions li\u00e9es aux spectateurs. Ces pr\u00e9dictions permettent d\'anticiper au lieu de subir les variations de fr\u00e9quentation li\u00e9es aux \u00e9v\u00e9nements.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.2)

  // --- COMMANDES ET ALERTES ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('La g\u00e9n\u00e9ration de commandes et les alertes', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(350, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('La g\u00e9n\u00e9ration automatique des bons de commande', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA permet de g\u00e9n\u00e9rer automatiquement des bons de commande complets en un seul clic. L\'IA analyse l\'\u00e9tat complet du stock, identifie tous les produits n\u00e9cessitant un r\u00e9approvisionnement, calcule les quantit\u00e9s optimales \u00e0 commander en fonction des habitudes de vente et des pr\u00e9visions, et g\u00e9n\u00e8re un document professionnel pr\u00eat \u00e0 \u00eatre envoy\u00e9 aux fournisseurs.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Le bon de commande g\u00e9n\u00e9r\u00e9 inclut la liste compl\u00e8te des produits \u00e0 commander avec leurs noms, les quantit\u00e9s sugg\u00e9r\u00e9es par l\'IA, les prix unitaires et le montant total estim\u00e9 de la commande. Le document est format\u00e9 de mani\u00e8re professionnelle et personnalis\u00e9 avec le nom du commerce. Trois options d\'envoi sont disponibles : t\u00e9l\u00e9chargement en PDF pour impression ou envoi par email, copie format\u00e9e pour WhatsApp permettant de coller directement dans une conversation avec un fournisseur, ou envoi par email int\u00e9gr\u00e9 directement depuis l\'application.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Le syst\u00e8me d\'alertes', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA dispose d\'un syst\u00e8me d\'alertes intelligent qui informe des \u00e9v\u00e9nements importants sans submerger de notifications. Les alertes sont group\u00e9es, prioris\u00e9es et envoy\u00e9es aux moments opportuns. Les pr\u00e9f\u00e9rences d\'alertes sont enti\u00e8rement personnalisables : fr\u00e9quence, canaux (email et/ou application), types d\'alertes activ\u00e9es.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les alertes de stock bas sont d\u00e9clench\u00e9es lorsqu\'un produit passe sous son seuil d\'alerte personnalis\u00e9. Les alertes de p\u00e9remption sont envoy\u00e9es 7 jours, 3 jours et 1 jour avant la date d\'expiration. Un r\u00e9sum\u00e9 quotidien optionnel peut \u00eatre envoy\u00e9 chaque matin, compilant toutes les informations importantes : produits \u00e0 commander, articles expirant bient\u00f4t, anomalies d\u00e9tect\u00e9es, pr\u00e9visions m\u00e9t\u00e9o et \u00e9v\u00e9nements locaux. Les emails sont envoy\u00e9s via le service Resend avec des templates HTML professionnels.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.2)

  // --- STATISTIQUES ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les statistiques et analyses', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(260, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'onglet Statistiques de PONIA donne acc\u00e8s \u00e0 une vision approfondie de l\'activit\u00e9. Des graphiques clairs et lisibles pr\u00e9sentent l\'\u00e9volution du stock dans le temps, les tendances de consommation par cat\u00e9gorie, la valeur totale de l\'inventaire et les performances de chaque produit. Ces visualisations sont g\u00e9n\u00e9r\u00e9es dynamiquement avec la biblioth\u00e8que Recharts.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les donn\u00e9es peuvent \u00eatre analys\u00e9es sur diff\u00e9rentes p\u00e9riodes : la semaine en cours, le mois, le trimestre ou l\'ann\u00e9e. Des comparaisons avec les p\u00e9riodes pr\u00e9c\u00e9dentes permettent d\'identifier les \u00e9volutions et les tendances. Le score de sant\u00e9 du stock est un indicateur synth\u00e9tique calcul\u00e9 par l\'IA qui prend en compte le niveau des stocks par rapport aux seuils, la proximit\u00e9 des dates de p\u00e9remption, l\'\u00e9quilibre entre les cat\u00e9gories et la rotation des produits. Ce score donne une id\u00e9e imm\u00e9diate de la situation globale.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.2)

  // --- FONCTIONNALIT\u00c9S AVANC\u00c9ES ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les fonctionnalit\u00e9s avanc\u00e9es', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(280, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les commandes vocales', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les abonn\u00e9s Pro b\u00e9n\u00e9ficient des commandes vocales pour une utilisation mains libres de l\'application. Cette fonctionnalit\u00e9 est particuli\u00e8rement utile lors des inventaires en r\u00e9serve, quand les mains sont occup\u00e9es \u00e0 manipuler des produits. Il est possible de dicter des mises \u00e0 jour de stock, de poser des questions \u00e0 l\'IA ou de demander la g\u00e9n\u00e9ration d\'un bon de commande simplement en parlant \u00e0 l\'application.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('Le support multi-langues', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA est disponible en 6 langues : fran\u00e7ais, anglais, espagnol, allemand, arabe et chinois. L\'interface compl\u00e8te est traduite, y compris les messages de l\'IA, les alertes et les \u00e9l\u00e9ments de navigation. La langue peut \u00eatre chang\u00e9e \u00e0 tout moment depuis les param\u00e8tres. Cette internationalisation permet \u00e0 PONIA de s\'adresser aux commerces tenus par des personnes de diff\u00e9rentes origines.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('La gestion multi-magasins', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Les abonn\u00e9s Pro qui poss\u00e8dent plusieurs points de vente b\u00e9n\u00e9ficient d\'une gestion centralis\u00e9e de tous les \u00e9tablissements. Depuis un seul compte, il est possible de visualiser et g\u00e9rer le stock de chaque magasin, de comparer leurs performances et d\'optimiser les transferts de marchandises entre eux. Chaque magasin dispose de son propre inventaire, de ses propres seuils d\'alerte et de ses propres statistiques. L\'IA analyse s\u00e9par\u00e9ment les tendances de chaque \u00e9tablissement.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold')
     .text('La s\u00e9curit\u00e9 des donn\u00e9es', marginLeft)
  doc.moveDown(0.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA accorde une importance capitale \u00e0 la s\u00e9curit\u00e9 des donn\u00e9es. Toutes les informations sont chiffr\u00e9es en transit (HTTPS) et au repos. L\'authentification est g\u00e9r\u00e9e par Supabase, une plateforme reconnue pour sa s\u00e9curit\u00e9. Les donn\u00e9es sont h\u00e9berg\u00e9es sur des serveurs s\u00e9curis\u00e9s en Europe, en conformit\u00e9 avec le RGPD. PONIA ne partage jamais les donn\u00e9es avec des tiers et les utilisateurs restent propri\u00e9taires de toutes leurs informations.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.2)

  // --- D\u00c9MARRAGE ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('D\u00e9marrer avec PONIA', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(230, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La mise en place de PONIA dans un commerce se fait en quelques minutes. Aucune installation complexe, aucune formation pr\u00e9alable n\'est n\u00e9cessaire. L\'application fonctionne directement dans un navigateur web, sur smartphone, tablette ou ordinateur.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1)

  doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text('\u00c9tape 1 : Cr\u00e9er un compte gratuit', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Sur myponia.fr, un clic sur "Essai gratuit" ouvre le formulaire d\'inscription. Il suffit de renseigner une adresse email, de choisir un mot de passe, puis d\'indiquer le nom du commerce, son type d\'activit\u00e9 et son adresse. L\'adresse permet \u00e0 PONIA de fournir des pr\u00e9visions m\u00e9t\u00e9o et \u00e9v\u00e9nements localis\u00e9s. Aucune carte bancaire n\'est demand\u00e9e. L\'essai gratuit de 14 jours donne acc\u00e8s \u00e0 toutes les fonctionnalit\u00e9s sans restriction.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text('\u00c9tape 2 : Ajouter les premiers produits', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'Depuis l\'onglet Stock, les produits peuvent \u00eatre ajout\u00e9s via l\'une des trois m\u00e9thodes : saisie manuelle, scan de code-barres ou import de document. Il est conseill\u00e9 de commencer par une dizaine de produits cl\u00e9s plut\u00f4t que d\'essayer de tout saisir d\'un coup. Le catalogue peut \u00eatre compl\u00e9t\u00e9 progressivement dans les jours suivants.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text('\u00c9tape 3 : Laisser l\'IA travailler', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'D\u00e8s que les premiers produits sont enregistr\u00e9s, PONIA commence \u00e0 analyser le stock et \u00e0 pr\u00e9parer ses recommandations. Les premi\u00e8res alertes et suggestions arrivent dans les heures qui suivent. La seule t\u00e2che quotidienne est de mettre \u00e0 jour les quantit\u00e9s en quelques clics lors des r\u00e9ceptions de livraisons ou des constatations de mouvements. L\'IA s\'occupe du reste.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.2)

  // --- TARIFS ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Les offres tarifaires', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(200, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'PONIA propose trois formules adapt\u00e9es \u00e0 diff\u00e9rents besoins et tailles de commerce. Toutes les formules incluent un essai gratuit de 14 jours sans engagement et sans carte bancaire requise. L\'abonnement peut \u00eatre modifi\u00e9 ou annul\u00e9 \u00e0 tout moment.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('BASIQUE - Gratuit', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La formule Basique est enti\u00e8rement gratuite et sans limite de dur\u00e9e. Elle permet de g\u00e9rer jusqu\'\u00e0 10 produits, ce qui convient aux tr\u00e8s petits commerces ou pour tester l\'application sur une s\u00e9lection de produits cl\u00e9s. Cette formule inclut 5 messages par jour avec l\'assistant IA, les alertes de stock bas et le score de sant\u00e9 du stock.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('STANDARD - 49\u20ac par mois', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La formule Standard est con\u00e7ue pour les commerces de taille moyenne. Elle permet de g\u00e9rer jusqu\'\u00e0 50 produits avec un acc\u00e8s illimit\u00e9 \u00e0 l\'assistant IA. Cette formule inclut les pr\u00e9dictions de stock sur 7 jours, les int\u00e9grations avec les caisses enregistreuses, les alertes de p\u00e9remption, la g\u00e9n\u00e9ration automatique de commandes, l\'historique sur 30 jours et le support par email avec r\u00e9ponse garantie sous 24 heures.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('PRO - 69\u20ac par mois', marginLeft)
  doc.moveDown(0.3)
  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'La formule Pro offre toutes les fonctionnalit\u00e9s de PONIA sans aucune limite. Nombre de produits illimit\u00e9, pr\u00e9dictions de stock sur 30 jours, gestion multi-magasins, commandes vocales pour une utilisation mains libres, historique sur 90 jours et support prioritaire avec r\u00e9ponse garantie sous 4 heures. Cette formule est id\u00e9ale pour les commerces ambitieux qui veulent tirer le maximum de l\'IA.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(0.8)

  doc.fontSize(11).fillColor(BLACK).font('Helvetica-Bold')
     .text('Sans engagement - Annulation possible \u00e0 tout moment en un clic', marginLeft, doc.y, { width: contentWidth, align: 'center' })
  doc.moveDown(1.2)

  // --- CONTACT ---
  doc.fontSize(22).fillColor(BLACK).font('Helvetica-Bold')
     .text('Contact et support', marginLeft)
  doc.moveTo(marginLeft, doc.y + 5).lineTo(200, doc.y + 5).strokeColor(BLACK).lineWidth(2).stroke()
  doc.moveDown(1.5)

  doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica')
     .text(
       'L\'\u00e9quipe PONIA est disponible pour r\u00e9pondre \u00e0 toutes les questions, aider \u00e0 configurer un compte ou r\u00e9soudre tout probl\u00e8me rencontr\u00e9. Un support humain et r\u00e9actif est une priorit\u00e9.',
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
       'Les abonn\u00e9s Standard b\u00e9n\u00e9ficient d\'une r\u00e9ponse garantie sous 24 heures ouvrables. Les abonn\u00e9s Pro disposent d\'un support prioritaire avec r\u00e9ponse garantie sous 4 heures. Pour les utilisateurs de la formule gratuite, l\'\u00e9quipe fait son maximum pour r\u00e9pondre dans les meilleurs d\u00e9lais.',
       marginLeft, doc.y, { width: contentWidth, align: 'justify', lineGap: 4 }
     )
  doc.moveDown(1.2)

  // --- FAQ ---
  doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold')
     .text('Questions fr\u00e9quentes', marginLeft)
  doc.moveDown(0.8)

  const faqs = [
    { 
      q: 'Les donn\u00e9es sont-elles s\u00e9curis\u00e9es ?', 
      a: 'Oui. Toutes les donn\u00e9es sont chiffr\u00e9es en transit et au repos. Les serveurs sont s\u00e9curis\u00e9s et h\u00e9berg\u00e9s en Europe en conformit\u00e9 avec le RGPD. Aucun partage avec des tiers.' 
    },
    { 
      q: 'L\'abonnement peut-il \u00eatre annul\u00e9 \u00e0 tout moment ?', 
      a: 'Oui, PONIA est sans engagement. L\'annulation se fait en un clic depuis les param\u00e8tres du compte. L\'acc\u00e8s est maintenu jusqu\'\u00e0 la fin de la p\u00e9riode de facturation en cours.' 
    },
    { 
      q: 'PONIA fonctionne-t-il avec toutes les caisses enregistreuses ?', 
      a: 'PONIA s\'int\u00e8gre avec Square, Zettle, SumUp, Tiller, Lightspeed et Hiboutik. D\'autres int\u00e9grations sont ajout\u00e9es r\u00e9guli\u00e8rement.' 
    },
    { 
      q: 'Combien de temps faut-il pour configurer PONIA ?', 
      a: 'La cr\u00e9ation de compte prend moins d\'une minute. L\'ajout des premiers produits peut se faire en 10 \u00e0 15 minutes. Il est conseill\u00e9 de commencer par une dizaine de produits cl\u00e9s.' 
    },
    { 
      q: 'L\'IA fonctionne-t-elle vraiment pour les petits commerces ?', 
      a: 'Oui. L\'IA de PONIA a \u00e9t\u00e9 sp\u00e9cifiquement entra\u00een\u00e9e sur des donn\u00e9es de petits commerces alimentaires fran\u00e7ais. Elle comprend les sp\u00e9cificit\u00e9s du m\u00e9tier et s\'adapte aux habitudes de vente uniques de chaque commerce.' 
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
     .text('PONIA : la gestion de stock intelligente', marginLeft, doc.y, { width: contentWidth, align: 'center' })
  doc.moveDown(0.5)
  doc.fontSize(11).fillColor(MEDIUM_GRAY).font('Helvetica')
     .text('Une application simple, rapide et intelligente pour les commer\u00e7ants qui veulent gagner du temps et de l\'argent.', marginLeft, doc.y, { width: contentWidth, align: 'center' })
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
