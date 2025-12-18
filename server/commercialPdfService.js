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

      // ===============================================
      // PAGE 1 - COUVERTURE
      // ===============================================
      
      // Fond noir pour la couverture
      doc.rect(0, 0, 595, 842).fill('#1a1a1a')
      
      // Logo PONIA
      try {
        const logoPath = path.join(__dirname, '../attached_assets/IMG_3757_2_1766021386713.png')
        doc.image(logoPath, 175, 280, { width: 250 })
      } catch (e) {
        doc.fontSize(48).fillColor('#FFD700').font('Helvetica-Bold').text('PONIA', 0, 320, { align: 'center' })
      }
      
      // Titre principal
      doc.fontSize(28).fillColor('#FFFFFF').font('Helvetica-Bold')
         .text('KIT COMMERCIAL', 0, 480, { align: 'center' })
      
      doc.fontSize(14).fillColor('#CCCCCC').font('Helvetica')
         .text('Guide complet pour les commerciaux terrain', 0, 520, { align: 'center' })
      
      doc.fontSize(11).fillColor('#888888').font('Helvetica')
         .text('Document confidentiel - Usage interne uniquement', 0, 750, { align: 'center' })

      // ===============================================
      // PAGE 2 - SOMMAIRE
      // ===============================================
      doc.addPage()
      let y = 50
      
      doc.fontSize(24).fillColor(BLACK).font('Helvetica-Bold').text('SOMMAIRE', leftMargin, y)
      y += 50
      
      const sommaire = [
        ['1.', 'Fiche Produit PONIA', '3'],
        ['2.', 'Arguments Cles vs Concurrence', '4'],
        ['3.', 'Pitch Commercial Complet', '5'],
        ['4.', 'Reponses aux Objections', '7'],
        ['5.', 'Methode de Vente Terrain', '9'],
        ['6.', 'Les 3 Plans Tarifaires', '11'],
        ['7.', 'Grille de Commissionnement', '12']
      ]
      
      sommaire.forEach(([num, title, page]) => {
        doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text(num, leftMargin, y)
        doc.font('Helvetica').text(title, leftMargin + 25, y)
        doc.text(page, leftMargin + pageWidth - 20, y, { align: 'right' })
        y += 28
      })

      // ===============================================
      // PAGE 3 - FICHE PRODUIT PONIA
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('1. FICHE PRODUIT PONIA', leftMargin, y)
      y += 40
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Presentation generale', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('PONIA est une application de gestion de stock intelligente concue specifiquement pour les petits commerces alimentaires francais : boulangeries, restaurants, bars, caves a vin, boucheries, fromageries et epiceries. Notre solution se distingue radicalement de la concurrence par son approche "IA-first" : au coeur de PONIA se trouve PONIA Chat, un assistant conversationnel base sur l\'intelligence artificielle qui permet aux commercants de gerer leurs stocks simplement en parlant a leur telephone.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 80
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('PONIA Chat : Notre Differenciation Majeure', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('PONIA Chat est le coeur de notre solution. Contrairement aux logiciels de gestion de stock traditionnels qui necessitent de naviguer dans des menus complexes, PONIA Chat permet au commercant de simplement poser des questions en langage naturel :', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      const exemples = [
        '"Qu\'est-ce que je dois commander cette semaine ?" - L\'IA analyse les stocks, l\'historique des ventes et les tendances pour generer automatiquement une liste de commande optimisee.',
        '"Quels produits vont bientot perimer ?" - L\'IA identifie tous les produits proches de leur date de peremption et suggere des actions (promotion, retrait).',
        '"Comment se sont passees mes ventes de croissants ce mois-ci ?" - L\'IA fournit une analyse detaillee avec graphiques et comparaisons.',
        '"Previens-moi quand je n\'ai plus que 10 baguettes en stock" - L\'IA cree automatiquement une alerte personnalisee.'
      ]
      
      exemples.forEach(ex => {
        doc.fontSize(10).fillColor(GRAY).font('Helvetica').text('- ' + ex, leftMargin + 10, y, { width: pageWidth - 20, lineGap: 2 })
        y += 40
      })
      
      y += 10
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Memoire Long Terme de l\'IA', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('L\'IA de PONIA dispose d\'une memoire a long terme. Elle retient les preferences du commercant, ses fournisseurs habituels, ses jours de forte affluence, ses produits phares. Au fil du temps, les recommandations deviennent de plus en plus pertinentes et personnalisees. C\'est comme avoir un assistant personnel qui connait parfaitement votre commerce.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 70
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Synchronisation avec les Caisses Enregistreuses', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('PONIA se connecte directement aux principales caisses enregistreuses du marche francais (SumUp, Zettle, Square, Hiboutik, Tiller). Une fois connecte, chaque vente enregistree en caisse met automatiquement a jour le stock dans PONIA. Plus besoin de saisie manuelle, plus d\'erreurs de comptage, plus de surprise en fin de journee.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 60
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Pour les caisses non encore supportees, le commercial note le nom de la caisse, nous verifions la compatibilite sous 24h, et revenons vers le client avec une solution.', leftMargin, y, { width: pageWidth, lineGap: 3 })

      // ===============================================
      // PAGE 4 - ARGUMENTS VS CONCURRENCE
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('2. ARGUMENTS CLES VS CONCURRENCE', leftMargin, y)
      y += 40
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('PONIA se positionne face a des concurrents comme SumUp, Zettle ou les modules de gestion de stock integres aux caisses. Voici nos arguments differenciants :', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 40
      
      const arguments_list = [
        ['IA Conversationnelle vs Interfaces Complexes', 'Les concurrents proposent des interfaces avec des menus, des tableaux et des formulaires. PONIA propose une conversation. Le commercant parle a son telephone comme il parlerait a un assistant. Pas de formation necessaire, pas de manuel a lire. C\'est intuitif des la premiere utilisation.'],
        ['Predictions Intelligentes vs Alertes Basiques', 'Les concurrents envoient une alerte quand le stock est bas. PONIA predit QUAND le stock sera bas, en analysant les tendances de vente, la meteo, les evenements locaux. Le commercant peut anticiper au lieu de reagir dans l\'urgence.'],
        ['Gain de Temps Mesurable', 'Nous avons calcule que PONIA fait gagner en moyenne 7 heures par semaine aux commercants. C\'est du temps qu\'ils peuvent consacrer a leurs clients, a leur famille, ou a developper leur activite. 7 heures par semaine, c\'est 30 heures par mois, c\'est presque une semaine de travail.'],
        ['100% Mobile, Zero Installation', 'Pas besoin d\'ordinateur, pas besoin de technicien. PONIA fonctionne entierement sur smartphone. Le commercant s\'inscrit en 2 minutes et commence immediatement a utiliser l\'application.'],
        ['Suivi des Dates de Peremption', 'Fonction cruciale pour les commerces alimentaires que beaucoup de concurrents negligent. PONIA alerte automatiquement sur les produits proches de la peremption, permettant d\'eviter le gaspillage et les pertes financieres.'],
        ['Prix Accessible et Transparent', 'A partir de 49 euros par mois pour le plan Standard, sans engagement. Pas de frais caches, pas de surprise. Le plan Basique est meme gratuit pour les tres petits commerces (limite a 10 produits).']
      ]
      
      arguments_list.forEach(([title, desc]) => {
        if (y > 700) {
          doc.addPage()
          y = 50
        }
        doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text(title, leftMargin, y)
        y += 20
        doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(desc, leftMargin, y, { width: pageWidth, lineGap: 3 })
        y += doc.heightOfString(desc, { width: pageWidth, lineGap: 3 }) + 20
      })

      // ===============================================
      // PAGE 5-6 - PITCH COMMERCIAL COMPLET
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('3. PITCH COMMERCIAL COMPLET', leftMargin, y)
      y += 30
      
      doc.fontSize(10).fillColor(LIGHT_GRAY).font('Helvetica-Oblique')
         .text('Ce pitch est un guide. Vous n\'etes pas oblige de le reciter mot pour mot. Inspirez-vous en, adaptez-le a votre style et a chaque situation. L\'essentiel est d\'etre naturel et authentique.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 50
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Accroche (15 secondes)', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Bonjour, je suis [Prenom] de PONIA. On aide les commercants comme vous a ne plus perdre de temps sur la gestion des stocks. Est-ce que vous avez 2 minutes ? Je vais vous montrer quelque chose qui va vous changer la vie."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 60
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Identification du Probleme (30 secondes)', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Je rencontre beaucoup de [boulangers/restaurateurs/cavistes] et ils me disent tous la meme chose : ils passent des heures a compter leurs stocks, a faire des listes de commandes, a verifier ce qui va perimer. Et malgre ca, ils ont quand meme des ruptures de stock sur leurs meilleurs produits, ou des produits jetes parce que perimes. Ca vous parle ?"', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 80
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Presentation de la Solution (1 minute)', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"PONIA, c\'est une application sur votre telephone qui gere tout ca pour vous. Le truc genial, c\'est que vous n\'avez pas besoin d\'apprendre a utiliser un logiciel complique. Vous parlez simplement a l\'application, comme vous me parlez la maintenant."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('[Sortez votre telephone et montrez l\'application]', leftMargin, y, { width: pageWidth })
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Regardez, je peux lui demander : Qu\'est-ce que je dois commander cette semaine ? Et l\'IA me repond avec une liste precise, basee sur mes ventes reelles. Elle sait ce qui se vend bien, ce qui se vend moins, et elle anticipe meme en fonction de la meteo ou des evenements."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 65
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Et si vous avez une caisse enregistreuse comme [nommer leur caisse si connue, sinon SumUp, Zettle, Square], PONIA se synchronise automatiquement. Chaque vente met a jour votre stock. Plus de comptage manuel, plus d\'erreurs."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 60
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Benefices Concrets (30 secondes)', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"Nos clients nous disent qu\'ils gagnent en moyenne 7 heures par semaine. 7 heures ! C\'est presque une journee de travail. Du temps que vous pouvez passer avec vos clients, ou chez vous avec votre famille. Et en plus, vous reduisez le gaspillage parce que vous etes alerte avant que les produits periment."', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 70
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Appel a l\'Action (15 secondes)', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('"On propose un essai gratuit de 14 jours, sans engagement, sans carte bancaire. Ca vous permet de tester tranquillement et de voir par vous-meme. Est-ce que vous voulez qu\'on vous inscrive maintenant ? Ca prend 2 minutes."', leftMargin, y, { width: pageWidth, lineGap: 3 })

      // ===============================================
      // PAGE 7-8 - REPONSES AUX OBJECTIONS
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('4. REPONSES AUX OBJECTIONS', leftMargin, y)
      y += 40
      
      const objections = [
        ['"C\'est trop cher"', 
         '"Je comprends, le budget c\'est important. Mais regardons les chiffres : 49 euros par mois, ca fait 1,60 euro par jour. Moins qu\'un cafe. Et en echange, vous gagnez 7 heures par semaine et vous reduisez le gaspillage. La plupart de nos clients rentabilisent PONIA des le premier mois grace aux economies sur les produits jetes. C\'est un investissement, pas une depense."'],
        ['"Je n\'ai pas le temps"', 
         '"Justement, c\'est exactement pour ca que PONIA existe ! L\'inscription prend 2 minutes, et apres l\'application vous FAIT gagner du temps. Vous n\'avez rien a apprendre, vous parlez simplement a votre telephone. En 14 jours d\'essai gratuit, vous allez voir la difference."'],
        ['"Je gere deja bien mes stocks"', 
         '"C\'est super, ca veut dire que vous etes organise. PONIA va vous permettre d\'etre encore plus efficace. Meme les commercants les plus organises nous disent qu\'ils ont decouvert des choses qu\'ils ne voyaient pas : des produits qui se vendent mieux certains jours, des tendances saisonnieres. Et le temps que vous passez a gerer vos stocks, meme si vous le faites bien, c\'est du temps que vous pourriez passer ailleurs."'],
        ['"Je vais reflechir"', 
         '"Bien sur, prenez le temps qu\'il vous faut. En attendant, pourquoi ne pas profiter de l\'essai gratuit de 14 jours ? Comme ca vous pouvez reflechir en testant vraiment l\'application. Si ca ne vous convient pas, vous arretez, c\'est tout. Pas d\'engagement, pas de carte bancaire. Ca vous permet de vous faire une vraie opinion."'],
        ['"Ma caisse n\'est pas dans la liste"', 
         '"Pas de probleme, on travaille avec de plus en plus de caisses. Donnez-moi le nom exact de votre caisse, je verifie la compatibilite avec mon equipe technique et je reviens vous voir demain avec la reponse. Dans beaucoup de cas, on peut trouver une solution. Et meme sans synchronisation automatique, PONIA reste tres utile pour la gestion des stocks et les alertes."'],
        ['"J\'ai deja essaye des logiciels, c\'est trop complique"', 
         '"Je comprends totalement, et c\'est justement ca qui fait la difference avec PONIA. On n\'a pas cree un logiciel avec des menus et des boutons partout. On a cree un assistant a qui vous parlez. Vous lui posez des questions en francais normal, il vous repond. C\'est comme envoyer un message a un ami qui connait parfaitement votre commerce. Essayez 2 minutes, vous allez voir."'],
        ['"Je ne suis pas a l\'aise avec la technologie"', 
         '"C\'est exactement pour des commercants comme vous qu\'on a cree PONIA. Si vous savez envoyer un SMS, vous savez utiliser PONIA. C\'est vraiment aussi simple que ca. Et si vous avez la moindre question, notre support repond en moins de 24h. On ne vous laisse pas seul."']
      ]
      
      objections.forEach(([obj, rep]) => {
        if (y > 680) {
          doc.addPage()
          y = 50
        }
        doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text(obj, leftMargin, y)
        y += 22
        doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(rep, leftMargin, y, { width: pageWidth, lineGap: 3 })
        y += doc.heightOfString(rep, { width: pageWidth, lineGap: 3 }) + 25
      })

      // ===============================================
      // PAGE 9-10 - METHODE DE VENTE TERRAIN
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('5. METHODE DE VENTE TERRAIN', leftMargin, y)
      y += 40
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Phase 1 : Approche a l\'entree du commerce', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Entrez dans le commerce avec le sourire, sans precipitation. Observez rapidement l\'environnement : est-ce que le commercant est occupe avec un client ? Est-ce qu\'il y a du monde ? Attendez le bon moment.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 50
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Quand le commercant est disponible, approchez-vous de maniere detendue. Etablissez un contact visuel, souriez, et lancez votre accroche. Soyez naturel, pas robotique. Vous etes la pour l\'aider, pas pour lui vendre quelque chose a tout prix.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 60
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Phase 2 : Questions de decouverte', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('L\'objectif est de comprendre les douleurs du commercant avant de presenter la solution. Posez des questions ouvertes et ecoutez attentivement les reponses. Plus vous comprenez ses problemes specifiques, plus votre presentation sera pertinente.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      const questions = [
        '"Comment gerez-vous vos stocks aujourd\'hui ? Vous faites ca a la main, sur papier ?"',
        '"Ca vous prend combien de temps par semaine, l\'inventaire et les commandes ?"',
        '"Est-ce que ca vous arrive d\'avoir des ruptures de stock sur des produits qui se vendent bien ?"',
        '"Et des produits que vous devez jeter parce qu\'ils ont perime ?"',
        '"Quelle caisse enregistreuse vous utilisez ?" (Notez le nom si elle n\'est pas dans la liste)'
      ]
      
      questions.forEach(q => {
        doc.fontSize(10).fillColor(GRAY).font('Helvetica').text('- ' + q, leftMargin + 10, y, { width: pageWidth - 20, lineGap: 2 })
        y += 25
      })
      
      y += 15
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Phase 3 : Presentation de la solution avec demo mobile', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('C\'est le moment de sortir votre telephone et de montrer PONIA en action. Ayez toujours l\'application ouverte sur votre telephone avec un compte de demonstration. Montrez les fonctionnalites en lien direct avec les problemes que le commercant vient de vous decrire.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Points cles a montrer :', leftMargin, y, { width: pageWidth })
      y += 20
      
      const demos = [
        'Le Chat IA : montrez une question simple et la reponse de l\'IA',
        'Le tableau de bord avec les alertes visuelles',
        'La liste des stocks avec les codes couleur',
        'La generation automatique de commande'
      ]
      
      demos.forEach(d => {
        doc.fontSize(10).fillColor(GRAY).font('Helvetica').text('- ' + d, leftMargin + 10, y, { width: pageWidth - 20 })
        y += 20
      })
      
      y += 15
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Phase 4 : Traitement des objections', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Ecoutez l\'objection jusqu\'au bout sans interrompre. Reformulez pour montrer que vous avez compris. Repondez calmement avec les arguments prepares (voir section 4). Ne soyez jamais agressif ou insistant. Si le commercant dit non, respectez sa decision et laissez une bonne impression.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 60
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Phase 5 : Closing et prochaines etapes', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Si le commercant est interesse, aidez-le a s\'inscrire immediatement sur son propre telephone. Guidez-le etape par etape. Assurez-vous qu\'il utilise votre code commercial lors de l\'inscription pour que la vente vous soit attribuee.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 55
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Si le commercant hesite, proposez-lui de reflechir mais rappelez l\'essai gratuit sans engagement. Laissez vos coordonnees et proposez de repasser dans quelques jours.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 45
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Si la caisse n\'est pas supportee, notez son nom exact, expliquez que vous verifiez la compatibilite, et revenez le lendemain avec une reponse. Ne promettez pas quelque chose que vous ne pouvez pas garantir.', leftMargin, y, { width: pageWidth, lineGap: 3 })

      // ===============================================
      // PAGE 11 - LES 3 PLANS TARIFAIRES
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('6. LES 3 PLANS TARIFAIRES', leftMargin, y)
      y += 40
      
      // Plan Basique
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Plan BASIQUE - Gratuit', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Le plan Basique est gratuit et permanent. Il permet aux tres petits commerces de decouvrir PONIA sans aucun engagement financier.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 35
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Inclus : Jusqu\'a 10 produits en stock, 5 messages IA par jour, alertes de stock basiques, acces mobile complet.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 35
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Limite : Pas de synchronisation caisse, pas de predictions avancees, pas de gestion des dates de peremption.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 45
      
      // Plan Standard
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Plan STANDARD - 49 euros/mois (RECOMMANDE)', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Le plan Standard est notre offre principale, adaptee a la grande majorite des commerces. C\'est le plan que vous devez mettre en avant lors de vos prospections.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 40
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Inclus : Jusqu\'a 100 produits en stock, messages IA illimites, synchronisation avec les principales caisses enregistreuses (SumUp, Zettle, Square, Hiboutik, Tiller), predictions intelligentes sur 7 jours, gestion des dates de peremption, alertes personnalisees, generation automatique de commandes, export PDF des commandes.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 65
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Essai gratuit : 14 jours sans engagement et sans carte bancaire.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 35
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Prix annuel : 470 euros/an (soit 39 euros/mois, 2 mois offerts).', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 45
      
      // Plan Pro
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Plan PRO - 69 euros/mois', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Le plan Pro est destine aux commerces plus importants ou a ceux qui veulent beneficier de toutes les fonctionnalites avancees.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 35
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Inclus : Tout le plan Standard, plus : produits illimites, predictions sur 30 jours, commandes vocales, support prioritaire (reponse en moins de 4h), multi-etablissements (gestion de plusieurs points de vente), rapports avances et analyses detaillees.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 60
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Prix annuel : 660 euros/an (soit 55 euros/mois, 2 mois offerts).', leftMargin, y, { width: pageWidth, lineGap: 3 })

      // ===============================================
      // PAGE 12 - GRILLE DE COMMISSIONNEMENT
      // ===============================================
      doc.addPage()
      y = 50
      
      doc.fontSize(20).fillColor(BLACK).font('Helvetica-Bold').text('7. GRILLE DE COMMISSIONNEMENT', leftMargin, y)
      y += 40
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Commission par vente', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Vous percevez une commission de 35% sur chaque premiere mensualite payee par un client que vous avez apporte. La commission est versee apres la fin de la periode d\'essai, une fois que le client a effectue son premier paiement.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 50
      
      doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text('Montants des commissions :', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('- Plan Standard (49 euros/mois) : Vous gagnez 17,15 euros par vente', leftMargin + 10, y, { width: pageWidth - 20 })
      y += 20
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('- Plan Pro (69 euros/mois) : Vous gagnez 24,15 euros par vente', leftMargin + 10, y, { width: pageWidth - 20 })
      y += 20
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('- Abonnement annuel Standard (470 euros) : Vous gagnez 164,50 euros par vente', leftMargin + 10, y, { width: pageWidth - 20 })
      y += 20
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('- Abonnement annuel Pro (660 euros) : Vous gagnez 231 euros par vente', leftMargin + 10, y, { width: pageWidth - 20 })
      y += 40
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Prime de performance', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('En plus des commissions individuelles, vous beneficiez d\'une prime de 100 euros lorsque vous atteignez 7 clients payants dans le meme mois calendaire. Cette prime est cumulable avec les commissions.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 50
      
      doc.fontSize(12).fillColor(BLACK).font('Helvetica-Bold').text('Exemple de gains mensuels :', leftMargin, y)
      y += 22
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('- 5 ventes Standard par mois : 5 x 17,15 = 85,75 euros', leftMargin + 10, y, { width: pageWidth - 20 })
      y += 20
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('- 7 ventes Standard par mois : 7 x 17,15 + 100 (prime) = 220 euros', leftMargin + 10, y, { width: pageWidth - 20 })
      y += 20
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('- 10 ventes Standard par mois : 10 x 17,15 + 100 (prime) = 271,50 euros', leftMargin + 10, y, { width: pageWidth - 20 })
      y += 20
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('- 15 ventes mixtes (10 Standard + 5 Pro) : (10 x 17,15) + (5 x 24,15) + 100 = 392,25 euros', leftMargin + 10, y, { width: pageWidth - 20 })
      y += 45
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Conditions de paiement', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Les commissions sont calculees a la fin de chaque mois calendaire. Le paiement est effectue dans les 15 jours suivant la cloture du mois, par virement bancaire sur le compte que vous aurez fourni.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 50
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Important : Seules les ventes aboutissant a un premier paiement reel declenchent une commission. Les inscriptions en essai gratuit qui ne se convertissent pas en abonnement payant ne generent pas de commission. Un client qui annule son abonnement dans les 30 premiers jours peut entrainer l\'annulation de la commission correspondante.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 70
      
      doc.fontSize(14).fillColor(BLACK).font('Helvetica-Bold').text('Votre code commercial', leftMargin, y)
      y += 25
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Vous disposez d\'un code commercial personnel au format COM-XXXXXX. Ce code doit etre utilise par chaque client lors de son inscription pour que la vente vous soit attribuee. Communiquez ce code clairement a chaque prospect et verifiez qu\'il l\'a bien saisi.', leftMargin, y, { width: pageWidth, lineGap: 3 })
      y += 50
      
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
         .text('Vous pouvez suivre vos performances en temps reel sur votre tableau de bord commercial accessible a l\'adresse myponia.fr/commercial en entrant votre code.', leftMargin, y, { width: pageWidth, lineGap: 3 })

      // ===============================================
      // FIN DU DOCUMENT
      // ===============================================
      doc.addPage()
      y = 300
      
      doc.fontSize(16).fillColor(BLACK).font('Helvetica-Bold').text('Bonne prospection !', 0, y, { align: 'center' })
      y += 40
      
      doc.fontSize(11).fillColor(GRAY).font('Helvetica')
         .text('Pour toute question, contactez votre responsable commercial', 0, y, { align: 'center' })
      y += 25
      
      doc.fontSize(11).fillColor(GRAY).font('Helvetica')
         .text('ou envoyez un email a contact@myponia.fr', 0, y, { align: 'center' })
      y += 60
      
      doc.fontSize(10).fillColor(LIGHT_GRAY).font('Helvetica')
         .text('PONIA - Gestion de stock intelligente', 0, y, { align: 'center' })
      y += 20
      doc.fontSize(10).fillColor(LIGHT_GRAY).font('Helvetica')
         .text('www.myponia.fr', 0, y, { align: 'center' })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
