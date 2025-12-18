import PDFDocument from 'pdfkit'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function generateCommercialKitPDF() {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        bufferPages: true
      })
      
      const chunks = []
      doc.on('data', chunk => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      const BLACK = '#000000'
      const GRAY = '#4a4a4a'
      const LIGHT_GRAY = '#666666'
      const pageWidth = 495
      const leftMargin = 50

      // Helper function for bold underline text
      const boldUnderline = (text, x, y, options = {}) => {
        doc.font('Helvetica-Bold').text(text, x, y, { ...options, underline: true })
        doc.font('Helvetica')
      }

      // Check if we need a new page
      const checkNewPage = (currentY, needed = 100) => {
        if (currentY > 750 - needed) {
          doc.addPage()
          return 50
        }
        return currentY
      }

      // ===============================================
      // PAGE 1 - COUVERTURE
      // ===============================================
      
      doc.rect(0, 0, 595, 842).fill('#1a1a1a')
      
      try {
        const logoPath = path.join(__dirname, '../attached_assets/IMG_3757_2_1766021386713.png')
        // Logo centré au milieu de la page
        doc.image(logoPath, 147, 350, { width: 300 })
      } catch (e) {
        doc.fontSize(56).fillColor('#FFD700').font('Helvetica-Bold').text('PONIA', 0, 400, { align: 'center' })
      }
      
      doc.fontSize(10).fillColor('#888888').font('Helvetica')
         .text('Document confidentiel - Usage interne uniquement', 0, 750, { align: 'center' })

      // ===============================================
      // PAGE 2 - SOMMAIRE
      // ===============================================
      doc.addPage()
      let y = 50
      
      doc.fontSize(24).fillColor(BLACK).font('Helvetica-Bold').text('SOMMAIRE', leftMargin, y)
      y += 50
      
      const sommaire = [
        ['1.', 'Fiche Produit PONIA'],
        ['2.', 'PONIA Chat : Notre Différenciation Majeure'],
        ['3.', 'Toutes les Fonctionnalités'],
        ['4.', 'Arguments Clés vs Concurrence'],
        ['5.', 'Le Temps, c\'est de l\'Argent'],
        ['6.', 'Pitch Commercial Complet'],
        ['7.', 'Méthode de Vente Terrain Détaillée'],
        ['8.', 'Réponses aux Objections'],
        ['9.', 'Les 3 Plans Tarifaires'],
        ['10.', 'Grille de Commissionnement']
      ]
      
      sommaire.forEach(([num, title]) => {
        doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text(num, leftMargin, y)
        doc.font('Helvetica').text(title, leftMargin + 30, y)
        y += 28
      })

      // ===============================================
      // SECTION 1 - FICHE PRODUIT PONIA
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('1. FICHE PRODUIT PONIA', leftMargin, y)
      y += 35
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Présentation générale', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('PONIA est une application de gestion de stock intelligente conçue spécifiquement pour les petits commerces alimentaires français : boulangeries, pâtisseries, restaurants, traiteurs, bars, cafés, caves à vin, boucheries, charcuteries, fromageries, épiceries et supérettes. Notre solution se distingue radicalement de la concurrence par son approche centrée sur l\'intelligence artificielle conversationnelle.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 75
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('PONIA est disponible sur ordinateur et sur téléphone. L\'application fonctionne parfaitement sur les deux supports, ce qui permet aux commerçants de gérer leurs stocks depuis leur bureau ou en mobilité dans leur commerce. Pour les démonstrations commerciales, nous recommandons d\'utiliser un ordinateur portable qui offre un affichage plus professionnel et permet de mieux montrer toutes les fonctionnalités.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 75
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Notre mission', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Notre mission est simple : faire gagner du temps aux commerçants. Le temps, c\'est de l\'argent, et chaque heure passée à compter des stocks, à faire des inventaires manuels ou à gérer des commandes sur papier est une heure qui n\'est pas consacrée aux clients ou au développement de l\'activité. PONIA automatise toutes ces tâches chronophages grâce à l\'intelligence artificielle.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 70
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Synchronisation avec les caisses enregistreuses', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('PONIA se connecte directement aux principales caisses enregistreuses du marché français : SumUp, Zettle (PayPal), Square, Hiboutik et Tiller. Une fois la connexion établie, chaque vente enregistrée en caisse met automatiquement à jour le stock dans PONIA. Plus besoin de saisie manuelle, plus d\'erreurs de comptage, plus de surprise en fin de journée. Le commerçant voit son stock en temps réel, synchronisé avec ses ventes.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 80
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('Procédure pour les caisses non encore supportées :', leftMargin, y, { underline: true })
      y += 20
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Si le commerçant utilise une caisse qui n\'est pas dans la liste des caisses supportées, voici la procédure à suivre :', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 35
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('1. Notez le nom exact de la caisse utilisée par le commerçant.', leftMargin + 15, y, { width: pageWidth - 30, underline: true })
      y += 20
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('2. Dites au client : "Je vérifie la compatibilité avec mon équipe technique et je reviens vous voir demain avec une réponse."', leftMargin + 15, y, { width: pageWidth - 30, underline: true })
      y += 30
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('3. Envoyez immédiatement le nom de la caisse à votre responsable pour vérification.', leftMargin + 15, y, { width: pageWidth - 30, underline: true })
      y += 30
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Dans la majorité des cas, nous pouvons trouver une solution. Et même sans synchronisation automatique, PONIA reste extrêmement utile pour la gestion des stocks, les alertes et les prédictions.', leftMargin, y, { width: pageWidth, lineGap: 3 })

      // ===============================================
      // SECTION 2 - PONIA CHAT
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('2. PONIA CHAT : NOTRE DIFFÉRENCIATION MAJEURE', leftMargin, y)
      y += 45
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('L\'intelligence artificielle conversationnelle au cœur de PONIA', leftMargin, y)
      y += 28
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('PONIA Chat est le cœur de notre solution et notre principal avantage concurrentiel. Contrairement aux logiciels de gestion de stock traditionnels qui nécessitent de naviguer dans des menus complexes, de remplir des formulaires et de comprendre des interfaces techniques, PONIA Chat permet au commerçant de simplement poser des questions en langage naturel, exactement comme il parlerait à un assistant humain.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 75
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('PONIA Chat comprend le contexte, se souvient des conversations précédentes, et apprend les habitudes du commerçant au fil du temps. Plus le commerçant utilise PONIA Chat, plus les réponses deviennent pertinentes et personnalisées. C\'est une véritable intelligence artificielle qui s\'adapte à chaque commerce.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 65
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('L\'interface de PONIA Chat est particulièrement agréable sur téléphone pour les interactions rapides en mobilité, mais elle fonctionne tout aussi bien sur ordinateur pour les sessions de travail plus longues. Le commerçant peut utiliser le support qui lui convient le mieux selon la situation.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text('Exemples de questions que le commerçant peut poser à PONIA Chat :', leftMargin, y)
      y += 22
      
      const exemplesChat = [
        '"Qu\'est-ce que je dois commander cette semaine ?" → L\'IA analyse les stocks actuels, l\'historique des ventes, les tendances saisonnières et même la météo pour générer automatiquement une liste de commande optimisée et personnalisée.',
        '"Quels produits vont bientôt périmer ?" → L\'IA identifie tous les produits proches de leur date de péremption, les classe par urgence et suggère des actions concrètes : promotion, mise en avant, retrait de la vente.',
        '"Comment se sont passées mes ventes de croissants ce mois-ci ?" → L\'IA fournit une analyse détaillée avec des chiffres précis, des comparaisons avec les mois précédents et des tendances.',
        '"Préviens-moi quand je n\'ai plus que 10 baguettes en stock" → L\'IA crée automatiquement une alerte personnalisée qui se déclenchera au bon moment.',
        '"Quel est mon produit le plus rentable ?" → L\'IA analyse les marges et les volumes pour identifier les produits stars du commerce.',
        '"Est-ce que je vais manquer de farine la semaine prochaine ?" → L\'IA prédit les ruptures de stock avant qu\'elles ne se produisent.'
      ]
      
      exemplesChat.forEach(ex => {
        y = checkNewPage(y, 50)
        doc.fontSize(10).fillColor(GRAY).font('Helvetica').text('• ' + ex, leftMargin, y, { width: pageWidth, lineGap: 2 })
        y += doc.heightOfString('• ' + ex, { width: pageWidth, lineGap: 2 }) + 12
      })
      
      y += 10
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Mémoire à long terme de l\'IA', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('L\'IA de PONIA dispose d\'une mémoire à long terme exceptionnelle. Elle retient les préférences du commerçant, ses fournisseurs habituels, ses jours de forte affluence (marché le samedi, match de foot le dimanche...), ses produits phares, ses contraintes spécifiques. Au fil du temps, les recommandations deviennent de plus en plus pertinentes et personnalisées. C\'est comme avoir un assistant personnel qui connaît parfaitement le commerce et son fonctionnement.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 85
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('C\'est cette intelligence artificielle conversationnelle qui fait de PONIA une solution unique sur le marché.', leftMargin, y, { width: pageWidth, underline: true })

      // ===============================================
      // SECTION 3 - TOUTES LES FONCTIONNALITÉS
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('3. TOUTES LES FONCTIONNALITÉS', leftMargin, y)
      y += 35
      
      const fonctionnalites = [
        ['Dashboard (Tableau de bord)', 'Le tableau de bord est la page d\'accueil de PONIA. Il offre une vue d\'ensemble immédiate de l\'état du commerce : niveau de santé global des stocks (score sur 100), alertes en cours (ruptures imminentes, produits à périmer), temps économisé cette semaine, et accès direct à PONIA Chat. Le commerçant voit en un coup d\'œil ce qui nécessite son attention. Les indicateurs sont visuels avec des codes couleur (vert = tout va bien, orange = attention requise, rouge = action urgente).'],
        ['Gestion des Stocks', 'La page des stocks affiche tous les produits du commerce avec leur quantité actuelle, leur seuil d\'alerte, leur date de péremption si applicable, et leur statut. L\'affichage est visuel avec des cartes colorées qui permettent d\'identifier instantanément les produits en rupture (rouge), les produits bas (orange) et les produits en surstock (bleu). Le commerçant peut ajuster les quantités en un clic, ajouter de nouveaux produits, modifier les seuils d\'alerte. Tout est pensé pour être rapide et intuitif.'],
        ['Alertes Proactives Intelligentes', 'PONIA ne se contente pas d\'alerter quand un problème survient. L\'IA anticipe les problèmes avant qu\'ils ne se produisent. Elle analyse les tendances de vente, la saisonnalité, la météo prévue, les événements locaux pour prédire les ruptures de stock et les surstocks. Le commerçant reçoit des alertes personnalisées : "Attention, au rythme actuel vous serez en rupture de croissants vendredi" ou "La météo annonce une canicule, pensez à commander plus de boissons fraîches". Ces alertes sont affichées dans l\'application et peuvent être envoyées par email.'],
        ['Historique et Analyses', 'La section historique permet de consulter toutes les données passées : ventes par produit, par jour, par semaine, par mois. Le commerçant peut identifier les tendances, comparer les performances, comprendre quels produits se vendent mieux à quelles périodes. Ces analyses sont présentées sous forme de graphiques clairs et de tableaux synthétiques. C\'est un outil précieux pour optimiser les commandes et réduire le gaspillage.'],
        ['Analytics (Statistiques avancées)', 'La page analytics va plus loin dans l\'analyse. Elle présente des métriques avancées : taux de rotation des stocks, produits les plus rentables, produits les moins performants, prévisions de vente, estimation des économies réalisées. Ces données permettent au commerçant de prendre des décisions éclairées pour améliorer la rentabilité de son commerce.'],
        ['Génération Automatique de Commandes', 'PONIA peut générer automatiquement des bons de commande optimisés. En analysant les stocks actuels, les ventes prévues et les délais de livraison des fournisseurs, l\'IA propose une liste de commande parfaitement calibrée. Le commerçant peut l\'exporter en PDF, l\'envoyer par email ou la copier pour WhatsApp. Plus besoin de calculer manuellement les quantités à commander.'],
        ['Gestion des Dates de Péremption', 'Pour les commerces alimentaires, la gestion des dates de péremption est cruciale. PONIA suit automatiquement les DLC et DDM de chaque produit. L\'application alerte le commerçant plusieurs jours avant la péremption pour lui laisser le temps d\'agir : mettre le produit en promotion, le consommer en interne, ou le retirer de la vente. Cela réduit considérablement le gaspillage alimentaire et les pertes financières associées.'],
        ['Multi-établissements (Plan Pro)', 'Pour les commerçants qui gèrent plusieurs points de vente, PONIA Pro permet de gérer tous les établissements depuis une seule interface. Le commerçant peut basculer d\'un commerce à l\'autre, comparer les performances, centraliser les commandes. C\'est idéal pour les chaînes de boulangeries ou les restaurateurs multi-sites.']
      ]
      
      fonctionnalites.forEach(([title, desc]) => {
        y = checkNewPage(y, 90)
        doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text(title, leftMargin, y)
        y += 18
        doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(desc, leftMargin, y, { width: pageWidth, lineGap: 3 })
        y += doc.heightOfString(desc, { width: pageWidth, lineGap: 3 }) + 18
      })

      // ===============================================
      // SECTION 4 - ARGUMENTS VS CONCURRENCE
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('4. ARGUMENTS CLÉS VS CONCURRENCE', leftMargin, y)
      y += 35
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('PONIA se positionne face à des concurrents comme SumUp, Zettle, les modules de gestion de stock intégrés aux caisses, ou les solutions Excel/papier. Voici nos arguments différenciants que vous devez maîtriser parfaitement :', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 50
      
      const arguments_list = [
        ['IA Conversationnelle vs Interfaces Complexes', 'Les concurrents proposent des interfaces classiques avec des menus déroulants, des tableaux Excel, des formulaires à remplir. PONIA propose une conversation naturelle. Le commerçant parle à PONIA Chat comme il parlerait à un employé compétent. Pas de formation nécessaire, pas de manuel à lire, pas de courbe d\'apprentissage. C\'est intuitif dès la première utilisation, même pour quelqu\'un qui n\'est pas à l\'aise avec la technologie.'],
        ['Prédictions Intelligentes vs Alertes Basiques', 'Les concurrents envoient une alerte quand le stock est déjà bas. C\'est trop tard. PONIA prédit QUAND le stock sera bas, en analysant les tendances de vente, la météo, les événements. Le commerçant peut anticiper au lieu de réagir dans l\'urgence. C\'est la différence entre subir et maîtriser.'],
        ['Disponible sur Ordinateur ET Téléphone', 'Contrairement à certaines solutions uniquement mobiles ou uniquement desktop, PONIA fonctionne parfaitement sur les deux supports. Le commerçant peut travailler sur son ordinateur au bureau pour les tâches de fond, et utiliser son téléphone pour les vérifications rapides en mobilité. La synchronisation est instantanée entre les appareils.'],
        ['Valeur Immédiate dès le Premier Jour', 'Avec PONIA, le commerçant voit la valeur dès le premier jour. Pas besoin d\'attendre des semaines de configuration. L\'IA commence immédiatement à analyser les données et à fournir des recommandations utiles. Les alertes fonctionnent dès que les premiers produits sont entrés.'],
        ['Suivi des Dates de Péremption', 'Fonction cruciale pour les commerces alimentaires que beaucoup de concurrents négligent ou proposent en option payante. Chez PONIA, c\'est inclus dans le plan Standard. Le commerçant est alerté automatiquement avant que les produits ne périment.'],
        ['Prix Accessible et Transparent', 'À partir de 49 euros par mois pour le plan Standard, sans engagement. Pas de frais cachés, pas de coûts supplémentaires pour les fonctionnalités essentielles, pas de surprise sur la facture. Le plan Basique est même gratuit pour les très petits commerces.']
      ]
      
      arguments_list.forEach(([title, desc]) => {
        y = checkNewPage(y, 80)
        doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text(title, leftMargin, y)
        y += 18
        doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(desc, leftMargin, y, { width: pageWidth, lineGap: 3 })
        y += doc.heightOfString(desc, { width: pageWidth, lineGap: 3 }) + 18
      })

      // ===============================================
      // SECTION 5 - LE TEMPS C'EST DE L'ARGENT
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('5. LE TEMPS, C\'EST DE L\'ARGENT', leftMargin, y)
      y += 35
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('C\'est l\'argument central de PONIA. Vous devez le marteler à chaque présentation.', leftMargin, y, { width: pageWidth, underline: true })
      y += 30
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Le problème que nous résolvons', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Les commerçants passent en moyenne 7 à 10 heures par semaine sur des tâches liées à la gestion des stocks : comptage manuel des produits, vérification des dates de péremption, création des listes de commandes, appels aux fournisseurs, gestion des ruptures en urgence. Ce sont des heures qui ne sont pas consacrées à ce qui compte vraiment : servir les clients, développer l\'activité, ou simplement profiter de sa vie personnelle.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 80
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Ce que PONIA apporte', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('PONIA automatise toutes ces tâches chronophages. Notre mesure montre que nos clients gagnent en moyenne 7 heures par semaine. Sept heures ! C\'est presque une journée de travail complète. Sur un mois, cela représente 28 à 30 heures. Sur une année, plus de 350 heures économisées.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 65
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Traduisons en argent', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Si on valorise l\'heure de travail d\'un commerçant à 25 euros (estimation basse), 7 heures par semaine représentent 175 euros. Sur un mois, c\'est 700 euros de valeur générée. PONIA coûte 49 euros par mois. Le retour sur investissement est de 14 pour 1. Pour chaque euro investi dans PONIA, le commerçant récupère 14 euros en temps gagné.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 70
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Et ce calcul ne prend même pas en compte les économies réalisées grâce à la réduction du gaspillage alimentaire, l\'évitement des ruptures de stock (ventes non perdues), et l\'optimisation des commandes (moins de surstock).', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Comment présenter cet argument', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Posez d\'abord la question : "Combien de temps passez-vous chaque semaine sur vos stocks, vos inventaires, vos commandes ?" Écoutez la réponse. Si le commerçant dit "plusieurs heures", rebondissez : "Imaginez récupérer ces heures. Qu\'est-ce que vous en feriez ? Plus de temps avec vos clients ? Plus de temps chez vous avec votre famille ? PONIA vous rend ce temps."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 75
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('Phrase clé à retenir : "49 euros par mois, c\'est 1,60 euro par jour. Moins qu\'un café. Et vous récupérez 7 heures par semaine."', leftMargin, y, { width: pageWidth, underline: true })

      // ===============================================
      // SECTION 6 - PITCH COMMERCIAL COMPLET
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('6. PITCH COMMERCIAL COMPLET', leftMargin, y)
      y += 30
      
      doc.fontSize(10).fillColor(LIGHT_GRAY).font('Helvetica-Oblique')
         .text('Ce pitch est un guide détaillé. Vous n\'êtes pas obligé de le réciter mot pour mot. Inspirez-vous en, adaptez-le à votre style personnel et à chaque situation. L\'essentiel est d\'être naturel, authentique et à l\'écoute du commerçant. Si vous préférez tout retenir, c\'est possible aussi.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Accroche initiale (15-20 secondes)', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Bonjour, je suis [Prénom] de PONIA. On aide les commerçants comme vous à ne plus perdre de temps sur la gestion des stocks. Est-ce que vous avez 3 minutes ? Je vais vous montrer quelque chose sur mon ordinateur qui va vous intéresser."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 60
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Identification du problème (30-45 secondes)', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Je rencontre beaucoup de [boulangers/restaurateurs/cavistes/épiciers] et ils me disent tous la même chose : ils passent des heures chaque semaine à compter leurs stocks, à vérifier ce qui va périmer, à faire des listes de commandes. Et malgré tout ce temps passé, ils ont quand même des ruptures de stock sur leurs meilleurs produits. Ou des produits qu\'ils doivent jeter parce qu\'ils ont périmé sans qu\'ils s\'en rendent compte. Ça vous parle ?"', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 85
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('[Attendez la réponse. Si le commerçant acquiesce ou partage son expérience, vous avez son attention. Rebondissez sur ce qu\'il dit.]', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 40
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Présentation de la solution - PONIA Chat en star (3-5 minutes)', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"PONIA, c\'est une application qui gère tout ça pour vous. Elle fonctionne sur ordinateur et sur téléphone. Mais le truc vraiment révolutionnaire, ce qui nous rend complètement différents de tout ce qui existe sur le marché, c\'est PONIA Chat."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('[Ouvrez votre ordinateur portable et montrez l\'application PONIA - Allez directement sur PONIA Chat]', leftMargin, y, { width: pageWidth })
      y += 25
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('DÉMONSTRATION DE PONIA CHAT (C\'EST LA STAR DE VOTRE PRÉSENTATION)', leftMargin, y, { width: pageWidth, underline: true })
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Regardez, voici PONIA Chat. C\'est un assistant intelligent basé sur l\'intelligence artificielle. Vous lui parlez normalement, comme vous me parlez là, et il vous répond. Pas de menus compliqués, pas de boutons partout, pas de formation à suivre. Vous posez une question, vous avez la réponse."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 65
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Je vais vous montrer. Je lui demande : Qu\'est-ce que je dois commander cette semaine ?"', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 30
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('[Montrez la réponse de l\'IA qui génère une liste de commande détaillée]', leftMargin, y, { width: pageWidth })
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Vous voyez ? En une seconde, l\'IA a analysé tous vos stocks, regardé votre historique de ventes des dernières semaines, tenu compte de la saisonnalité, et elle vous donne une liste de commande précise avec les quantités exactes. Essayez de faire ça à la main, ça vous prend combien de temps ? Une heure ? Deux heures ? Là c\'est instantané."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 75
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Mais ce n\'est pas tout. Je peux lui demander autre chose. Par exemple : Quels produits vont bientôt périmer ?"', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 30
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('[Montrez la réponse sur les dates de péremption]', leftMargin, y, { width: pageWidth })
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"L\'IA vous liste tous les produits qui arrivent à péremption, classés par urgence. Elle vous dit même quoi faire : mettre en promotion, consommer en priorité, ou retirer de la vente. Plus de produits jetés parce que vous n\'aviez pas vu la date."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 60
      
      y = checkNewPage(y, 250)
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Je peux aussi lui demander des analyses. Par exemple : Comment se sont passées mes ventes de croissants ce mois-ci ?"', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 30
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('[Montrez la réponse analytique]', leftMargin, y, { width: pageWidth })
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"L\'IA vous donne les chiffres précis, compare avec le mois dernier, identifie les tendances. Vous avez un vrai business analyst dans votre poche, disponible 24h/24."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 50
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Et le plus impressionnant : PONIA Chat a une mémoire. Elle retient vos préférences, vos fournisseurs habituels, vos jours de forte affluence. Si vous lui dites une fois que le samedi c\'est jour de marché et que vous vendez deux fois plus, elle s\'en souviendra. La prochaine fois qu\'elle vous propose une commande pour le week-end, elle en tiendra compte automatiquement. C\'est comme un assistant qui vous connaît parfaitement."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 85
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('PONIA Chat, c\'est vraiment ça notre différence. Aucun concurrent ne propose ça. C\'est ce qui fait de PONIA une solution unique.', leftMargin, y, { width: pageWidth, underline: true })
      y += 35
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Et si vous avez une caisse comme SumUp, Zettle, Square, Hiboutik ou Tiller, vos ventes se synchronisent automatiquement avec PONIA. Chaque vente en caisse met à jour votre stock. L\'IA sait exactement ce que vous avez vendu et peut faire des prédictions encore plus précises."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 65
      
      y = checkNewPage(y, 200)
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('LES AUTRES FONCTIONNALITÉS (après PONIA Chat)', leftMargin, y, { width: pageWidth, underline: true })
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('[Montrez le Dashboard]', leftMargin, y, { width: pageWidth })
      y += 20
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"En plus de PONIA Chat, vous avez le tableau de bord. C\'est votre vue d\'ensemble. En un coup d\'œil vous voyez l\'état de vos stocks avec un score de santé sur 100. Les alertes s\'affichent ici : produits bientôt en rupture, produits qui vont périmer. Et vous voyez combien de temps PONIA vous a fait gagner cette semaine - parce que le temps, c\'est de l\'argent."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 75
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('[Montrez la page Stocks]', leftMargin, y, { width: pageWidth })
      y += 20
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"La page des stocks est très visuelle. Chaque produit a sa carte avec un code couleur immédiatement compréhensible. Rouge = rupture urgente, il faut commander tout de suite. Orange = stock bas, attention. Vert = tout va bien. Bleu = surstock, vous avez commandé trop. Vous pouvez ajuster les quantités en un clic, ajouter des produits, modifier les seuils d\'alerte. Tout est pensé pour être rapide."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 80
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('[Montrez les Alertes Proactives]', leftMargin, y, { width: pageWidth })
      y += 20
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Les alertes sont intelligentes et proactives. PONIA ne vous alerte pas quand le stock est déjà vide - là c\'est trop tard. Elle vous prévient AVANT. Elle calcule à quel rythme vous vendez, analyse les tendances, et vous dit : dans 3 jours vous serez en rupture de baguettes si vous ne commandez pas maintenant. Elle regarde même la météo : s\'il fait très chaud, elle vous prévient de commander plus de boissons fraîches. Vous avez toujours le temps d\'agir."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 90
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('[Montrez l\'Historique]', leftMargin, y, { width: pageWidth })
      y += 20
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"L\'historique vous permet de voir toutes vos ventes passées, jour par jour, semaine par semaine, mois par mois. Vous pouvez comparer les performances, identifier les tendances, comprendre quels produits marchent mieux à quelles périodes. C\'est précieux pour optimiser vos commandes."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 65
      
      y = checkNewPage(y, 150)
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('[Montrez la page Analytics]', leftMargin, y, { width: pageWidth })
      y += 20
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Et enfin les statistiques avancées. Vous voyez quels produits se vendent le mieux, lesquels sont les plus rentables, comment évoluent vos ventes dans le temps. Ces données vous aident à prendre les bonnes décisions pour développer votre commerce. C\'est comme avoir un comptable et un conseiller en gestion disponibles à tout moment."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 70
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('[Montrez la génération de commande]', leftMargin, y, { width: pageWidth })
      y += 20
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Et pour finir, PONIA peut générer automatiquement vos bons de commande. L\'IA calcule exactement ce dont vous avez besoin, crée un document propre que vous pouvez exporter en PDF, envoyer par email à votre fournisseur, ou copier pour WhatsApp. En 10 secondes, votre commande est prête. Combien de temps vous passez normalement à préparer vos commandes ?"', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 75
      
      y = checkNewPage(y, 150)
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Bénéfices concrets (30-45 secondes)', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Nos clients nous disent qu\'ils gagnent en moyenne 7 heures par semaine. Sept heures ! C\'est presque une journée de travail. Du temps que vous pouvez passer avec vos clients, à développer votre activité, ou simplement chez vous avec votre famille. Et vous réduisez le gaspillage parce que vous êtes alerté avant que les produits périment. En moyenne nos clients économisent 200 à 300 euros par mois en produits non jetés."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 80
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Appel à l\'action (20 secondes)', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"On propose un essai gratuit de 14 jours, sans engagement, sans carte bancaire. Ça vous permet de tester tranquillement sur votre commerce et de voir par vous-même les résultats. Est-ce que vous voulez qu\'on vous inscrive maintenant ? Ça prend 2 minutes."', leftMargin, y, { width: pageWidth, lineGap: 3 })

      // ===============================================
      // SECTION 7 - MÉTHODE DE VENTE TERRAIN
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('7. MÉTHODE DE VENTE TERRAIN DÉTAILLÉE', leftMargin, y)
      y += 35
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Préparation avant la visite', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Avant de partir en prospection, assurez-vous d\'avoir votre ordinateur portable chargé avec l\'application PONIA ouverte sur un compte de démonstration. Vérifiez que vous avez une connexion internet (partage de connexion depuis votre téléphone si nécessaire). Ayez vos cartes de visite avec votre code commercial. Habillez-vous de manière professionnelle mais accessible - pas trop formel pour ne pas intimider les commerçants.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 80
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Phase 1 : L\'approche à l\'entrée du commerce', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Entrez dans le commerce avec le sourire, sans précipitation. Observez rapidement l\'environnement : est-ce que le commerçant est occupé avec un client ? Est-ce qu\'il y a du monde ? Si oui, attendez patiemment votre tour ou revenez plus tard. N\'interrompez jamais une vente en cours.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 60
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Quand le commerçant est disponible, approchez-vous de manière détendue. Établissez un contact visuel, souriez, et lancez votre accroche. Soyez naturel, pas robotique. Vous êtes là pour l\'aider, pas pour lui vendre quelque chose à tout prix. Cette posture se ressent et inspire confiance.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 70
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Phase 2 : Les questions de découverte', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('L\'objectif est de comprendre les douleurs du commerçant avant de présenter la solution. Plus vous comprenez ses problèmes spécifiques, plus votre présentation sera pertinente et convaincante. Posez des questions ouvertes et écoutez attentivement les réponses. Ne coupez pas la parole.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 60
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold').text('Questions recommandées :', leftMargin, y)
      y += 20
      
      const questions = [
        '"Comment gérez-vous vos stocks aujourd\'hui ? Vous faites ça sur papier, sur Excel, ou vous avez un système ?"',
        '"Ça vous prend combien de temps par semaine, entre l\'inventaire, les commandes, la vérification des dates ?"',
        '"Est-ce que ça vous arrive d\'avoir des ruptures de stock sur des produits qui se vendent bien ?"',
        '"Et des produits que vous devez jeter parce qu\'ils ont périmé ?"',
        '"Quelle caisse enregistreuse vous utilisez ?"'
      ]
      
      questions.forEach(q => {
        doc.fontSize(10).fillColor(GRAY).font('Helvetica').text('• ' + q, leftMargin, y, { width: pageWidth, lineGap: 2 })
        y += doc.heightOfString('• ' + q, { width: pageWidth, lineGap: 2 }) + 10
      })
      
      y += 10
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('Si la caisse n\'est pas dans notre liste (SumUp, Zettle, Square, Hiboutik, Tiller), notez soigneusement son nom exact.', leftMargin, y, { width: pageWidth, underline: true })
      y += 35
      
      y = checkNewPage(y, 180)
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Phase 3 : La démonstration sur ordinateur', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('C\'est le moment de sortir votre ordinateur portable et de montrer PONIA en action. Installez-vous à côté du commerçant (pas en face) pour qu\'il voie bien l\'écran. Montrez les fonctionnalités en lien direct avec les problèmes qu\'il vient de vous décrire.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold').text('Ordre de démonstration recommandé :', leftMargin, y)
      y += 20
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('1. PONIA Chat : Commencez toujours par PONIA Chat. C\'est notre différenciation majeure. Montrez une question simple ("Qu\'est-ce que je dois commander ?") et la réponse de l\'IA. Insistez sur le fait qu\'il suffit de parler normalement.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 50
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('2. Dashboard : Montrez la vue d\'ensemble avec le score de santé et les alertes. Expliquez les codes couleur.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 35
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('3. Page Stocks : Montrez l\'affichage visuel des produits. Montrez comme c\'est facile d\'ajuster une quantité.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 35
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('4. Alertes : Montrez comment les alertes anticipent les problèmes.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('5. Génération de commande : Si le temps le permet, montrez comment PONIA génère automatiquement un bon de commande.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 40
      
      y = checkNewPage(y, 180)
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Phase 4 : Le traitement des objections', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Écoutez l\'objection jusqu\'au bout sans interrompre. Reformulez pour montrer que vous avez compris ("Si je comprends bien, votre préoccupation c\'est..."). Répondez calmement avec les arguments préparés (voir section 8). Ne soyez jamais agressif ou insistant. Si le commerçant dit non fermement, respectez sa décision et laissez une bonne impression. Il pourra changer d\'avis plus tard.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 80
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Phase 5 : Le closing et les prochaines étapes', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('Si le commerçant est intéressé :', leftMargin, y, { underline: true })
      y += 20
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Aidez-le à s\'inscrire immédiatement sur son propre téléphone ou ordinateur. Guidez-le étape par étape. Assurez-vous qu\'il entre votre code commercial lors de l\'inscription pour que la vente vous soit attribuée. Vérifiez que l\'inscription est complète avant de partir.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('Si le commerçant hésite :', leftMargin, y, { underline: true })
      y += 20
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Proposez-lui de réfléchir mais rappelez l\'essai gratuit de 14 jours sans engagement. Laissez votre carte de visite avec votre code commercial. Proposez de repasser dans quelques jours pour répondre à ses questions.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('Si la caisse n\'est pas supportée :', leftMargin, y, { underline: true })
      y += 20
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('Notez le nom exact de la caisse, expliquez que vous vérifiez la compatibilité avec votre équipe technique, et revenez le lendemain avec une réponse. Ne promettez jamais quelque chose que vous ne pouvez pas garantir.', leftMargin, y, { width: pageWidth, lineGap: 3, underline: true })

      // ===============================================
      // SECTION 8 - RÉPONSES AUX OBJECTIONS
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('8. RÉPONSES AUX OBJECTIONS', leftMargin, y)
      y += 35
      
      const objections = [
        ['"C\'est trop cher"', 
         '"Je comprends, le budget c\'est important. Mais regardons les chiffres ensemble. 49 euros par mois, ça fait 1,60 euro par jour. C\'est moins que le prix d\'un café. Et en échange, vous gagnez 7 heures par semaine. Si on valorise votre heure à seulement 20 euros, c\'est 140 euros de temps gagné par semaine, 560 euros par mois. Sans compter les économies sur le gaspillage. La plupart de nos clients rentabilisent PONIA dès la première semaine. Ce n\'est pas une dépense, c\'est un investissement qui se rembourse tout seul."'],
        ['"Je n\'ai pas le temps"', 
         '"C\'est justement pour ça que PONIA existe ! L\'inscription prend 2 minutes, et ensuite l\'application vous FAIT gagner du temps. Vous n\'avez rien à apprendre, vous parlez simplement à PONIA Chat comme vous me parlez là. En 14 jours d\'essai gratuit, vous allez voir la différence. Et le temps que vous investissez maintenant dans ces 2 minutes d\'inscription, vous le récupérez 100 fois dans les semaines qui suivent."'],
        ['"Je gère déjà bien mes stocks"', 
         '"C\'est super, ça veut dire que vous êtes organisé et rigoureux. PONIA va vous permettre d\'être encore plus efficace. Même les commerçants les plus organisés découvrent des choses qu\'ils ne voyaient pas : des produits qui se vendent mieux certains jours, des tendances saisonnières, des opportunités d\'optimisation. Et surtout, le temps que vous passez à gérer vos stocks, même si vous le faites très bien, c\'est du temps que vous pourriez passer ailleurs. PONIA vous rend ce temps."'],
        ['"Je vais réfléchir"', 
         '"Bien sûr, prenez le temps qu\'il vous faut. C\'est une décision importante. En attendant, pourquoi ne pas profiter de l\'essai gratuit de 14 jours ? Comme ça vous pouvez réfléchir en testant vraiment l\'application sur votre commerce, avec vos propres produits. Si ça ne vous convient pas, vous arrêtez, c\'est tout. Pas d\'engagement, pas de carte bancaire demandée. Ça vous permet de vous faire une vraie opinion basée sur votre expérience, pas juste sur ce que je vous dis."'],
        ['"Ma caisse n\'est pas dans la liste"', 
         '"Pas de problème, on travaille avec de plus en plus de caisses et on en ajoute régulièrement. Donnez-moi le nom exact de votre caisse, je vérifie la compatibilité avec mon équipe technique et je reviens vous voir demain avec la réponse. Dans beaucoup de cas, on peut trouver une solution. Et même si la synchronisation automatique n\'est pas possible immédiatement, PONIA reste très utile pour la gestion des stocks, les alertes, les prédictions et PONIA Chat."'],
        ['"J\'ai déjà essayé des logiciels, c\'est trop compliqué"', 
         '"Je vous comprends totalement, beaucoup de commerçants me disent la même chose. C\'est justement pour ça qu\'on a créé PONIA différemment. On n\'a pas fait un logiciel avec des menus et des boutons partout. On a créé un assistant à qui vous parlez normalement. Vous lui posez des questions en français, il vous répond. C\'est aussi simple que d\'envoyer un message. Essayez 2 minutes sur mon ordinateur, vous allez voir tout de suite la différence."'],
        ['"Je ne suis pas à l\'aise avec la technologie"', 
         '"C\'est exactement pour des personnes comme vous qu\'on a conçu PONIA. Si vous savez envoyer un SMS ou parler à quelqu\'un, vous savez utiliser PONIA. C\'est vraiment aussi simple que ça. Et si jamais vous avez une question, notre support répond en moins de 24 heures. On ne vous laisse pas seul face à l\'écran. Beaucoup de nos clients avaient les mêmes inquiétudes que vous au départ, et maintenant ils ne pourraient plus s\'en passer."'],
        ['"Je préfère mon système actuel (papier/Excel)"', 
         '"Votre système fonctionne, et c\'est très bien. Mais combien de temps y passez-vous chaque semaine ? Et est-ce que votre système vous prévient avant une rupture de stock ? Est-ce qu\'il vous dit quoi commander et en quelle quantité ? Est-ce qu\'il analyse vos ventes pour vous aider à prendre de meilleures décisions ? PONIA fait tout ça automatiquement. Et les 14 jours d\'essai gratuit vous permettent de comparer sans risque."']
      ]
      
      objections.forEach(([obj, rep]) => {
        y = checkNewPage(y, 100)
        doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text(obj, leftMargin, y)
        y += 20
        doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(rep, leftMargin, y, { width: pageWidth, lineGap: 3 })
        y += doc.heightOfString(rep, { width: pageWidth, lineGap: 3 }) + 22
      })

      // ===============================================
      // SECTION 9 - LES 3 PLANS TARIFAIRES
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('9. LES 3 PLANS TARIFAIRES', leftMargin, y)
      y += 35
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Plan BASIQUE - Gratuit (pour toujours)', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Le plan Basique est entièrement gratuit et le reste pour toujours. Il permet aux très petits commerces ou aux commerçants qui veulent découvrir PONIA de commencer sans aucun investissement.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 45
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Ce qui est inclus : Jusqu\'à 10 produits en stock, 5 messages à PONIA Chat par jour, alertes de stock basiques, accès sur ordinateur et téléphone.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 35
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Ce qui n\'est pas inclus : Synchronisation avec les caisses enregistreuses, prédictions avancées, gestion des dates de péremption, génération automatique de commandes.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 50
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Plan STANDARD - 49€/mois (RECOMMANDÉ)', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('C\'est le plan que vous devez recommander en priorité. Il correspond aux besoins de 90% des commerçants.', leftMargin, y, { width: pageWidth, underline: true })
      y += 30
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Ce qui est inclus : Jusqu\'à 100 produits en stock, messages PONIA Chat illimités, synchronisation automatique avec les caisses enregistreuses (SumUp, Zettle, Square, Hiboutik, Tiller), prédictions intelligentes sur 7 jours, gestion complète des dates de péremption avec alertes, génération automatique de bons de commande (PDF, email, WhatsApp), alertes proactives personnalisées, accès aux statistiques et analyses, accès sur ordinateur et téléphone, support par email.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 90
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Essai gratuit : 14 jours sans engagement et sans carte bancaire.', leftMargin, y, { width: pageWidth })
      y += 20
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Prix annuel : 470€/an (soit environ 39€/mois - 2 mois offerts).', leftMargin, y, { width: pageWidth })
      y += 40
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Plan PRO - 69€/mois', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Le plan Pro est destiné aux commerces plus importants ou à ceux qui veulent bénéficier de toutes les fonctionnalités avancées sans aucune limite.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 40
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Tout ce qui est inclus dans Standard, plus : Nombre de produits illimité, prédictions sur 30 jours, commandes vocales (parler à PONIA Chat par la voix), support prioritaire (réponse en moins de 4 heures), gestion multi-établissements (plusieurs points de vente), rapports avancés et analyses détaillées, export de données complet.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 70
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Prix annuel : 660€/an (soit 55€/mois - 2 mois offerts).', leftMargin, y, { width: pageWidth })

      // ===============================================
      // SECTION 10 - GRILLE DE COMMISSIONNEMENT
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('10. GRILLE DE COMMISSIONNEMENT', leftMargin, y)
      y += 35
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Commission par vente', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Vous percevez une commission de 35% sur chaque premier paiement effectué par un client que vous avez apporté. La commission est calculée après la fin de la période d\'essai gratuit de 14 jours, une fois que le client a effectué son premier paiement réel.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('Important : Seuls les clients qui passent en abonnement payant après leur essai gratuit génèrent une commission.', leftMargin, y, { width: pageWidth, underline: true })
      y += 35
      
      doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text('Détail des commissions :', leftMargin, y)
      y += 22
      
      const commissions = [
        'Plan Standard mensuel (49€) → Votre commission : 17,15€',
        'Plan Pro mensuel (69€) → Votre commission : 24,15€',
        'Abonnement annuel Standard (470€) → Votre commission : 164,50€',
        'Abonnement annuel Pro (660€) → Votre commission : 231€'
      ]
      
      commissions.forEach(c => {
        doc.fontSize(10).fillColor(GRAY).font('Helvetica').text('• ' + c, leftMargin, y, { width: pageWidth })
        y += 22
      })
      
      y += 15
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Prime de performance mensuelle', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('En plus des commissions individuelles, vous bénéficiez d\'une prime de 100 euros lorsque vous atteignez 7 clients payants dans le même mois calendaire. Cette prime est cumulable avec vos commissions sur les ventes.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text('Exemples de revenus mensuels :', leftMargin, y)
      y += 22
      
      const exemples = [
        '5 ventes Standard/mois : 5 × 17,15€ = 85,75€',
        '7 ventes Standard/mois : 7 × 17,15€ + 100€ (prime) = 220,05€',
        '10 ventes Standard/mois : 10 × 17,15€ + 100€ (prime) = 271,50€',
        '10 Standard + 5 Pro/mois : (10 × 17,15€) + (5 × 24,15€) + 100€ = 392,25€',
        '2 ventes annuelles Standard : 2 × 164,50€ = 329€ (une seule vente, gros gain)'
      ]
      
      exemples.forEach(e => {
        doc.fontSize(10).fillColor(GRAY).font('Helvetica').text('• ' + e, leftMargin, y, { width: pageWidth })
        y += 22
      })
      
      y += 15
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Conditions de paiement', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Les commissions sont calculées à la fin de chaque mois calendaire. Le paiement est effectué dans les 15 jours suivant la clôture du mois, par virement bancaire sur le compte que vous aurez fourni lors de votre inscription comme commercial.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Un client qui annule son abonnement dans les 30 premiers jours suivant son premier paiement peut entraîner l\'annulation de la commission correspondante (clause de clawback).', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 50
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Votre code commercial personnel', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Vous disposez d\'un code commercial personnel au format COM-XXXXXX. Ce code doit absolument être utilisé par chaque client lors de son inscription pour que la vente vous soit attribuée. Communiquez ce code clairement à chaque prospect et vérifiez qu\'il l\'a bien saisi dans le formulaire d\'inscription.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 60
      
      doc.fontSize(10).fillColor(BLACK).font('Helvetica-Bold')
         .text('Rappel : Sans votre code commercial, la vente ne vous sera pas attribuée et vous ne toucherez pas de commission.', leftMargin, y, { width: pageWidth, underline: true })
      y += 35
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Vous pouvez suivre vos performances en temps réel sur votre tableau de bord commercial accessible à l\'adresse myponia.fr/commercial en entrant votre code.', leftMargin, y, { width: pageWidth, lineGap: 3 })

      // ===============================================
      // PAGE FINALE
      // ===============================================
      doc.addPage()
      y = 280
      
      doc.fontSize(18).fillColor(BLACK).font('Helvetica-Bold').text('Bonne prospection et bonnes ventes !', 0, y, { align: 'center' })
      y += 50
      
      doc.fontSize(11).fillColor(GRAY).font('Helvetica')
         .text('Pour toute question, contactez votre responsable commercial', 0, y, { align: 'center' })
      y += 22
      
      doc.fontSize(11).fillColor(GRAY).font('Helvetica')
         .text('ou envoyez un email à contact@myponia.fr', 0, y, { align: 'center' })
      y += 60
      
      doc.fontSize(10).fillColor(LIGHT_GRAY).font('Helvetica')
         .text('PONIA - Gestion de stock intelligente', 0, y, { align: 'center' })
      y += 18
      doc.fontSize(10).fillColor(LIGHT_GRAY).font('Helvetica')
         .text('www.myponia.fr', 0, y, { align: 'center' })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
