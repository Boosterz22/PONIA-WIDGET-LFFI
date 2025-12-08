const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const COLORS = {
  primary: '#F5A623',
  dark: '#1A1A1A',
  white: '#FFFFFF',
  gray: '#555555',
  lightGray: '#F5F5F5',
  accent: '#E8940F',
  green: '#22C55E',
  red: '#EF4444',
  orange: '#F59E0B'
};

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 55, right: 55 },
  bufferPages: true
});

const outputPath = path.join(__dirname, '..', 'public', 'Guide-PONIA-A-Z.pdf');
doc.pipe(fs.createWriteStream(outputPath));

let currentY = 50;

function resetY() {
  currentY = 60;
}

function checkSpace(needed) {
  if (currentY + needed > 780) {
    doc.addPage();
    resetY();
    return true;
  }
  return false;
}

function addTitle(text, size = 22) {
  checkSpace(50);
  doc.fontSize(size)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text(text, 55, currentY);
  currentY = doc.y + 15;
}

function addSubtitle(text) {
  checkSpace(40);
  doc.fontSize(14)
     .fillColor(COLORS.dark)
     .font('Helvetica-Bold')
     .text(text, 55, currentY);
  currentY = doc.y + 10;
}

function addText(text, options = {}) {
  checkSpace(60);
  doc.fontSize(options.size || 10.5)
     .fillColor(options.color || COLORS.gray)
     .font(options.font || 'Helvetica')
     .text(text, 55, currentY, { 
       width: 485, 
       align: options.align || 'justify',
       lineGap: 3
     });
  currentY = doc.y + (options.spacing || 12);
}

function addBullet(text, indent = 0) {
  checkSpace(25);
  const x = 55 + indent;
  doc.fontSize(10.5)
     .fillColor(COLORS.primary)
     .text('•', x, currentY);
  doc.fillColor(COLORS.gray)
     .font('Helvetica')
     .text(text, x + 15, currentY - 12, { width: 470 - indent, lineGap: 2 });
  currentY = doc.y + 6;
}

function addNumberedItem(num, text) {
  checkSpace(30);
  doc.fontSize(11)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text(num, 55, currentY);
  doc.fillColor(COLORS.gray)
     .font('Helvetica')
     .text(text, 80, currentY - 12, { width: 460, lineGap: 2 });
  currentY = doc.y + 8;
}

function addHighlight(title, content) {
  checkSpace(90);
  const boxHeight = 70;
  doc.rect(55, currentY, 485, boxHeight).fill(COLORS.lightGray);
  doc.rect(55, currentY, 4, boxHeight).fill(COLORS.primary);
  
  doc.fontSize(11)
     .fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .text(title, 70, currentY + 12, { width: 460 });
  
  doc.fontSize(10)
     .fillColor(COLORS.dark)
     .font('Helvetica')
     .text(content, 70, currentY + 30, { width: 460, lineGap: 2 });
  
  currentY += boxHeight + 15;
}

function addExamples(title, items) {
  checkSpace(30 + items.length * 18);
  doc.fontSize(10)
     .fillColor(COLORS.accent)
     .font('Helvetica-BoldOblique')
     .text(title, 55, currentY);
  currentY = doc.y + 5;
  
  items.forEach(item => {
    doc.fontSize(9.5)
       .fillColor(COLORS.gray)
       .font('Helvetica-Oblique')
       .text(`"${item}"`, 65, currentY, { width: 475 });
    currentY = doc.y + 3;
  });
  currentY += 10;
}

function addAlert(color, title, desc) {
  checkSpace(70);
  doc.rect(55, currentY, 4, 55).fill(color);
  doc.fontSize(11)
     .fillColor(COLORS.dark)
     .font('Helvetica-Bold')
     .text(title, 70, currentY + 5);
  doc.fontSize(10)
     .fillColor(COLORS.gray)
     .font('Helvetica')
     .text(desc, 70, currentY + 22, { width: 465, lineGap: 2 });
  currentY += 65;
}

function addCTA() {
  checkSpace(100);
  doc.rect(55, currentY, 485, 80).fill(COLORS.primary);
  doc.fontSize(16)
     .fillColor(COLORS.dark)
     .font('Helvetica-Bold')
     .text("Pret a gagner du temps et de l'argent ?", 75, currentY + 18);
  doc.fontSize(11)
     .text("Essai gratuit 14 jours - Sans engagement - Sans carte bancaire", 75, currentY + 42);
  doc.fontSize(14)
     .text("myponia.fr", 75, currentY + 60);
  currentY += 95;
}

// ===== COUVERTURE =====
doc.rect(0, 0, 595, 842).fill(COLORS.dark);

doc.fontSize(72)
   .fillColor(COLORS.primary)
   .font('Helvetica-Bold')
   .text('PONIA', 0, 250, { align: 'center' });

doc.fontSize(24)
   .fillColor(COLORS.white)
   .font('Helvetica')
   .text('Guide Complet de A a Z', 0, 340, { align: 'center' });

doc.fontSize(14)
   .fillColor(COLORS.primary)
   .text("L'intelligence artificielle au service", 0, 420, { align: 'center' });
doc.text("des commerces alimentaires", 0, 440, { align: 'center' });

doc.fontSize(11)
   .fillColor(COLORS.gray)
   .text('Boulangeries - Restaurants - Bars - Caves a vin - Fromageries', 0, 520, { align: 'center' });

doc.fontSize(9)
   .text('Edition 2024', 0, 790, { align: 'center' });

// ===== SOMMAIRE =====
doc.addPage();
resetY();

doc.fontSize(28)
   .fillColor(COLORS.primary)
   .font('Helvetica-Bold')
   .text('Sommaire', 55, currentY);
currentY = 110;

const toc = [
  { t: 'PARTIE 1 : QU\'EST-CE QUE PONIA ?', b: true },
  { t: '   Notre vision et notre mission', b: false },
  { t: '   Les 4 problemes que nous resolvons', b: false },
  { t: '   Pourquoi l\'IA change tout pour vous', b: false },
  { t: 'PARTIE 2 : TOUTES LES FONCTIONNALITES', b: true },
  { t: '   PONIA Chat - Votre assistant IA personnel', b: false },
  { t: '   Les alertes predictives intelligentes', b: false },
  { t: '   Generation automatique des commandes', b: false },
  { t: '   Connexion aux caisses enregistreuses', b: false },
  { t: '   Tableau de bord et statistiques', b: false },
  { t: '   Gestion multi-etablissements', b: false },
  { t: '   Interface mobile-first', b: false },
  { t: 'PARTIE 3 : TARIFS ET FORMULES', b: true },
  { t: '   Comparatif detaille des 3 offres', b: false },
  { t: '   Retour sur investissement', b: false },
  { t: '   Comment demarrer en 5 minutes', b: false }
];

toc.forEach(item => {
  doc.fontSize(item.b ? 12 : 10.5)
     .fillColor(item.b ? COLORS.dark : COLORS.gray)
     .font(item.b ? 'Helvetica-Bold' : 'Helvetica')
     .text(item.t, 55, currentY);
  currentY += item.b ? 28 : 22;
});

// ===== PARTIE 1 =====
doc.addPage();
resetY();

doc.fontSize(32)
   .fillColor(COLORS.primary)
   .font('Helvetica-Bold')
   .text('PARTIE 1', 55, currentY);
currentY += 40;

doc.fontSize(22)
   .fillColor(COLORS.dark)
   .text("Qu'est-ce que PONIA ?", 55, currentY);
currentY += 50;

addSubtitle('Notre vision');

addText(
  "PONIA est une solution logicielle d'intelligence artificielle specialement concue pour les commerces alimentaires de proximite francais. Nous ciblons les boulangeries, patisseries, restaurants, bars, caves a vin, fromageries, epiceries fines et traiteurs - tous ces commerces qui font vivre nos quartiers et nos villages."
);

addText(
  "Notre constat de depart est simple : les grandes enseignes de distribution disposent d'equipes entieres dediees a l'optimisation des stocks, avec des logiciels coutant des dizaines de milliers d'euros. Les petits commercants, eux, sont laisses de cote. Ils gerent leurs stocks sur un cahier, un bout de papier, ou au mieux un fichier Excel. Resultat : du gaspillage, des ruptures, du temps perdu."
);

addText(
  "PONIA change la donne. Nous mettons l'intelligence artificielle de niveau entreprise a la portee de tous les commercants, pour une fraction du cout. Notre objectif : que chaque boulanger de quartier, chaque restaurateur independant, chaque caviste passione puisse beneficier des memes outils que les grands groupes."
);

addHighlight(
  'Notre promesse',
  "Vous faire gagner 7 heures par semaine minimum sur la gestion de vos stocks, reduire le gaspillage de 20 a 40%, et eliminer definitivement les ruptures de stock. Le tout en moins de 2 minutes d'utilisation par jour."
);

addSubtitle('Notre mission');

addText(
  "Democratiser l'acces a l'intelligence artificielle pour les TPE alimentaires francaises. Nous croyons que la technologie doit simplifier la vie des commercants, pas la compliquer. C'est pourquoi nous avons concu PONIA pour etre utilisable sans aucune formation technique, directement depuis votre telephone."
);

addText(
  "Nous comprenons votre quotidien : vous etes debout a 4h du matin pour preparer le pain, vous courez toute la journee entre les clients et les fournisseurs, vous n'avez pas le temps de vous former sur des logiciels complexes. PONIA s'adapte a vous, pas l'inverse."
);

addSubtitle('Les 4 problemes que PONIA resout');

currentY += 5;

addText('PROBLEME 1 : LE GASPILLAGE ALIMENTAIRE', { font: 'Helvetica-Bold', color: COLORS.dark });

addText(
  "Chaque annee, un commerce alimentaire jette en moyenne 5 a 15% de sa marchandise. Pour une boulangerie realisant 300 000 euros de chiffre d'affaires annuel, cela represente 15 000 a 45 000 euros de pertes seches. Les produits perissent car personne n'a le temps de surveiller les dates de peremption de centaines de references."
);

addText(
  "Les causes sont multiples : commandes basees sur l'intuition plutot que sur les donnees, manque de visibilite sur les dates de peremption, difficulte a anticiper les variations de frequentation, et surstock systematique par peur de manquer."
);

addText(
  "PONIA surveille automatiquement TOUTES vos dates de peremption et vous alerte 3, 5 ou 7 jours avant l'expiration selon vos preferences. L'IA analyse egalement votre historique pour vous aider a commander les bonnes quantites. Resultat constate chez nos utilisateurs : 20 a 30% de gaspillage en moins des le premier mois."
);

addText('PROBLEME 2 : LES RUPTURES DE STOCK', { font: 'Helvetica-Bold', color: COLORS.dark });

addText(
  "\"Desole, on n'a plus de croissants\" - cette phrase vous coute de l'argent et des clients. Une rupture de stock, c'est une vente perdue, mais c'est aussi un client decu qui risque d'aller chez le concurrent et de ne jamais revenir. On estime qu'une rupture coute 3 a 5 fois le prix du produit en manque a gagner."
);

addText(
  "Les causes : pas d'alerte avant qu'il soit trop tard, mauvaise estimation des besoins, oublis lors des commandes fournisseurs, manque de temps pour surveiller chaque produit individuellement."
);

addText(
  "PONIA analyse vos ventes passees, les tendances saisonnieres, la meteo locale et les evenements (marches, fetes, vacances) pour predire EXACTEMENT combien vous allez vendre demain, dans 7 jours, dans 30 jours. L'IA vous alerte avant meme que le probleme n'arrive, vous laissant le temps de reagir et de commander."
);

addText('PROBLEME 3 : LE TEMPS PERDU EN GESTION', { font: 'Helvetica-Bold', color: COLORS.dark });

addText(
  "Inventaire manuel, calcul des commandes sur un bout de papier, appels aux fournisseurs, verification des livraisons, comparaison des prix... Un commercant passe en moyenne 7 a 10 heures par semaine sur ces taches administratives. C'est du temps que vous ne passez pas avec vos clients ou a developper votre activite."
);

addText(
  "PONIA automatise tout ce qui peut l'etre : l'inventaire se fait en 2 minutes sur votre telephone grace au scan de codes-barres, les commandes sont generees automatiquement par l'IA selon vos besoins reels, vous n'avez qu'a valider et envoyer par WhatsApp ou email en un clic."
);

addText('PROBLEME 4 : LE MANQUE DE VISIBILITE', { font: 'Helvetica-Bold', color: COLORS.dark });

addText(
  "Combien avez-vous vendu de baguettes tradition le mois dernier ? Quel est votre produit le plus rentable ? Quand devez-vous commander plus de farine ? Sans donnees precises, vous pilotez a vue. Les decisions sont prises au feeling, et les erreurs coutent cher."
);

addText(
  "PONIA vous donne des tableaux de bord clairs et visuels : ventes par produit, tendances sur la semaine/mois/annee, previsions pour les prochains jours, alertes prioritaires. Vous savez exactement ou vous en etes a tout moment, depuis votre telephone."
);

addSubtitle("Pourquoi l'intelligence artificielle change tout");

addText(
  "L'intelligence artificielle n'est pas un gadget marketing. C'est une revolution technologique qui permet d'analyser en quelques secondes des quantites de donnees qu'un humain mettrait des heures a traiter. Appliquee a votre commerce, l'IA peut :"
);

addBullet("Analyser des milliers de donnees en temps reel : vos ventes, la meteo, la saisonnalite, les evenements locaux");
addBullet("Faire des predictions fiables basees sur votre historique reel, pas sur des moyennes generiques");
addBullet("Converser naturellement avec vous en francais, sans formation ni mode d'emploi complique");
addBullet("Apprendre continuellement de vos habitudes pour ameliorer ses predictions chaque jour");

addText(
  "Ce qui distingue PONIA des logiciels traditionnels, c'est cette capacite a comprendre le contexte. Un logiciel classique vous dira que votre stock de croissants est a 10 unites. PONIA vous dira : \"Attention, avec la meteo prevue ce week-end et le match de foot dimanche, vos 10 croissants ne suffiront pas. Je vous recommande d'en commander 50 de plus pour samedi matin.\""
);

addHighlight(
  'L\'IA conversationnelle',
  "Contrairement aux logiciels avec des menus complexes, PONIA fonctionne comme une conversation. Vous posez vos questions en francais naturel et l'IA vous repond instantanement avec des recommandations chiffrees et expliquees."
);

// ===== PARTIE 2 =====
doc.addPage();
resetY();

doc.fontSize(32)
   .fillColor(COLORS.primary)
   .font('Helvetica-Bold')
   .text('PARTIE 2', 55, currentY);
currentY += 40;

doc.fontSize(22)
   .fillColor(COLORS.dark)
   .text('Toutes les fonctionnalites en detail', 55, currentY);
currentY += 50;

addSubtitle('PONIA Chat - Votre assistant IA personnel');

addText(
  "PONIA Chat est le coeur de notre solution. C'est votre assistant personnel disponible 24 heures sur 24, 7 jours sur 7, qui repond a toutes vos questions sur vos stocks en langage naturel. Pas besoin de formation, pas de manuel a lire, pas de menus compliques a naviguer : vous parlez a PONIA comme vous parleriez a un employe experimente."
);

addText('Comment ca marche concretement ?', { font: 'Helvetica-Bold', color: COLORS.dark });

addText(
  "Vous ouvrez l'application sur votre telephone, et vous posez votre question a l'oral (reconnaissance vocale) ou a l'ecrit. L'IA analyse instantanement vos stocks actuels, vos historiques de vente, les tendances du marche, la meteo prevue, et vous donne une reponse precise et actionnable en quelques secondes."
);

addText(
  "Par exemple, si vous demandez \"Qu'est-ce que je dois commander pour le week-end prochain ?\", PONIA va analyser vos ventes des week-ends precedents, verifier la meteo annoncee (un week-end ensoleille = plus de monde), regarder s'il y a des evenements locaux (marche, fete, concert), et vous generer une liste de commande optimisee avec les quantites exactes pour chaque produit."
);

addExamples('Exemples de questions que vous pouvez poser :', [
  "Prepare-moi la commande boulanger pour lundi",
  "Quels produits risquent la rupture cette semaine ?",
  "Qu'est-ce qui va bientot perimer dans mon stock ?",
  "Quel est mon produit le plus rentable ce mois-ci ?",
  "Combien de croissants j'ai vendu la semaine derniere ?",
  "Donne-moi un resume de ma situation stock",
  "Pourquoi mes ventes de pain ont baisse ce mois-ci ?"
]);

addText('Les capacites de PONIA Chat :', { font: 'Helvetica-Bold', color: COLORS.dark });

addBullet("Analyse predictive : L'IA anticipe vos besoins en se basant sur l'historique, la saisonnalite, la meteo et les evenements locaux");
addBullet("Recommandations personnalisees : Chaque conseil est adapte a VOTRE commerce, VOTRE clientele, VOS habitudes specifiques");
addBullet("Generation de commandes : En une phrase, l'IA genere une commande complete et optimisee prete a envoyer");
addBullet("Alertes proactives : PONIA vous previent des problemes avant meme que vous ne posiez la question");
addBullet("Apprentissage continu : Plus vous utilisez PONIA, plus l'IA comprend votre commerce et affine ses predictions");
addBullet("Disponibilite totale : 24h/24, 7j/7, meme les jours feries, meme a 4h du matin");

addHighlight(
  'Gain de temps estime',
  "PONIA Chat vous fait economiser 30 minutes a 1 heure par jour en repondant instantanement aux questions qui vous prendraient des heures de recherche manuelle dans vos cahiers ou tableurs."
);

addSubtitle('Les alertes predictives intelligentes');

addText(
  "PONIA ne se contente pas de repondre a vos questions : l'IA surveille en permanence vos stocks et vous alerte AVANT que les problemes n'arrivent. C'est comme avoir un employe ultra-vigilant qui ne dort jamais et qui connait parfaitement votre business."
);

addText('Les 3 types d\'alertes :', { font: 'Helvetica-Bold', color: COLORS.dark });

addAlert(COLORS.red, 'Alertes de rupture de stock',
  "L'IA analyse vos ventes prevues pour les prochains jours et compare avec votre stock actuel. Si une rupture est probable, vous recevez une alerte avec : le produit concerne, la date estimee de rupture, la quantite a commander immediatement, et le fournisseur recommande."
);

addAlert(COLORS.orange, 'Alertes de peremption',
  "PONIA surveille toutes les dates de peremption de vos produits. Vous definissez vos seuils (3, 5 ou 7 jours avant expiration), et l'IA vous alerte automatiquement. Elle vous suggere des actions : mettre le produit en promotion flash, l'utiliser en priorite, le transformer en autre produit, ou le donner a une association."
);

addAlert(COLORS.primary, 'Alertes de surstock',
  "Avoir trop de stock, c'est de l'argent immobilise et un risque de gaspillage. PONIA detecte les produits dont vous avez commande trop par rapport a vos ventes habituelles et vous aide a ajuster vos futures commandes pour eviter ce probleme."
);

addText('Comment sont calculees les alertes :', { font: 'Helvetica-Bold', color: COLORS.dark });

addBullet("Votre historique de ventes : patterns quotidiens, hebdomadaires, mensuels et annuels");
addBullet("La meteo locale : un jour de pluie = moins de passage, une canicule = plus de boissons fraiches");
addBullet("La saisonnalite : vacances scolaires, fetes (Noel, Paques, 14 juillet), rentree, etc.");
addBullet("Les evenements locaux : marches, concerts, matchs de foot, manifestations");
addBullet("Vos seuils personnalises par produit : vous definissez le stock minimum acceptable");

addHighlight(
  'Notifications personnalisables',
  "Vous choisissez comment recevoir vos alertes : notification push sur votre telephone, email quotidien recapitulatif, ou les deux. Vous definissez aussi les horaires de notification pour ne pas etre derange pendant la nuit."
);

addSubtitle('Generation automatique des commandes');

addText(
  "C'est LA fonctionnalite qui vous fera gagner le plus de temps au quotidien. Fini les heures passees a calculer combien commander de chaque produit, a verifier les stocks un par un, a preparer les bons de commande a la main. PONIA genere automatiquement vos commandes fournisseurs en quelques secondes."
);

addText('Le processus en 3 etapes :', { font: 'Helvetica-Bold', color: COLORS.dark });

addNumberedItem('1.', 'ANALYSE - L\'IA analyse votre stock actuel pour chaque produit, vos ventes prevues pour les prochains jours, vos dates de peremption, et vos seuils minimum configures.');

addNumberedItem('2.', 'CALCUL - L\'IA calcule la quantite optimale a commander pour chaque produit, en tenant compte des delais de livraison de vos fournisseurs et des quantites minimum de commande.');

addNumberedItem('3.', 'GENERATION - Une commande professionnelle est generee au format PDF, avec toutes les informations necessaires. Vous pouvez l\'envoyer par email ou copier le texte pour WhatsApp.');

addText('Ce que contient une commande generee :', { font: 'Helvetica-Bold', color: COLORS.dark });

addBullet("Liste complete des produits avec les quantites optimisees par l'IA");
addBullet("Justification IA : pourquoi ces quantites sont recommandees (basees sur vos ventes, la meteo, etc.)");
addBullet("Date de livraison souhaitee calculee automatiquement selon vos delais habituels");
addBullet("Format professionnel avec vos coordonnees et celles du fournisseur pre-remplies");
addBullet("Total estime de la commande si vous avez renseigne vos prix d'achat");

addHighlight(
  'Economies realisees',
  "En moyenne, nos utilisateurs reduisent leurs commandes excessives de 15 a 25%, ce qui represente une economie directe de plusieurs centaines d'euros par mois, tout en eliminant les ruptures de stock."
);

addSubtitle('Connexion aux caisses enregistreuses');

addText(
  "Pour que PONIA soit vraiment intelligent et fasse des predictions precises, il a besoin de connaitre vos ventes en temps reel. C'est pourquoi nous proposons une integration directe avec les principales caisses enregistreuses du marche. Une fois connecte, vos ventes remontent automatiquement et PONIA ajuste ses predictions en continu."
);

addText('Caisses compatibles :', { font: 'Helvetica-Bold', color: COLORS.dark });

addBullet("Square - Leader mondial des solutions de paiement pour commerces");
addBullet("SumUp - Solution populaire et abordable pour les TPE francaises");
addBullet("Zettle by PayPal - Anciennement iZettle, tres repandu en France");
addBullet("Lightspeed Restaurant - Solution professionnelle pour la restauration");
addBullet("Lightspeed Retail (K-Series) - Pour les commerces de detail");
addBullet("Hiboutik - Solution francaise economique et complete");
addBullet("Tiller - Specialiste de la restauration en France");

addText(
  "L'integration est simple et ne necessite aucune competence technique : vous vous connectez a votre compte caisse depuis PONIA, vous autorisez l'acces, et c'est fait. Vos ventes sont synchronisees automatiquement toutes les heures."
);

addHighlight(
  'Pas de caisse compatible ?',
  "Pas de probleme ! Vous pouvez entrer vos ventes manuellement en quelques clics, ou importer un fichier CSV depuis n'importe quel systeme. Nous ajoutons regulierement de nouvelles integrations selon les demandes de nos utilisateurs."
);

addSubtitle('Tableau de bord et statistiques');

addText(
  "PONIA vous offre une vue d'ensemble claire et visuelle de votre activite. Le tableau de bord a ete concu pour etre comprehensible en un coup d'oeil, meme si vous n'etes pas familier avec les outils informatiques ou les graphiques."
);

addText('Ce que vous voyez sur votre tableau de bord :', { font: 'Helvetica-Bold', color: COLORS.dark });

addBullet("Score de sante global : Un indicateur de 0 a 100 qui resume l'etat de vos stocks (vert = tout va bien, orange = attention requise, rouge = action urgente necessaire)");
addBullet("Temps economise : PONIA calcule et affiche combien d'heures vous avez gagnees cette semaine et ce mois grace a l'automatisation");
addBullet("Alertes en cours : Les problemes qui necessitent votre attention, classes par priorite (ruptures imminentes, peremptions, surstock)");
addBullet("Graphiques de ventes : Visualisez vos tendances sur la semaine, le mois ou l'annee avec des courbes simples a lire");
addBullet("Top produits : Vos meilleures ventes et vos produits les plus rentables, pour savoir ou concentrer vos efforts");
addBullet("Previsions : Ce que l'IA prevoit pour les 7 ou 30 prochains jours selon votre formule");

addHighlight(
  'Donnees exportables',
  "Toutes vos donnees peuvent etre exportees en CSV ou PDF pour votre comptable, votre banquier, ou pour vos propres analyses. PONIA s'integre parfaitement dans votre workflow existant."
);

addSubtitle('Gestion multi-etablissements');

addText(
  "Vous avez plusieurs points de vente ? PONIA gere tout depuis une seule interface. C'est ideal pour les boulangeries avec plusieurs boutiques, les restaurateurs avec plusieurs adresses, ou les franchises en developpement."
);

addText('Fonctionnalites multi-sites :', { font: 'Helvetica-Bold', color: COLORS.dark });

addBullet("Vue consolidee : Voyez l'etat de tous vos etablissements sur un seul ecran, avec les alertes de chaque site");
addBullet("Vue par etablissement : Zoomez sur un site specifique pour voir les details et les statistiques");
addBullet("Transferts inter-sites : L'IA suggere des transferts de stock entre etablissements pour eviter les ruptures et le gaspillage");
addBullet("Comparaison de performance : Comparez les ventes et la gestion entre vos differents sites");
addBullet("Commandes centralisees ou separees : Vous choisissez de grouper les commandes fournisseurs ou de les gerer separement");
addBullet("Acces equipe : Donnez des acces a vos responsables de site avec des droits personnalises");

addText(
  "Chaque etablissement peut avoir ses propres parametres (fournisseurs, seuils d'alerte, equipe d'acces), tout en beneficiant de l'intelligence collective : l'IA apprend de tous vos sites pour ameliorer ses predictions."
);

addSubtitle('Interface mobile-first');

addText(
  "PONIA a ete concu des le depart pour etre utilise sur smartphone. Nous savons que vous etes rarement assis derriere un ordinateur : vous etes en cuisine, en boutique, en reserve, entre deux clients. Votre telephone est toujours dans votre poche, et PONIA aussi."
);

addText('Avantages de l\'interface mobile :', { font: 'Helvetica-Bold', color: COLORS.dark });

addBullet("Inventaire ultra-rapide : Mettez a jour vos stocks en 2 minutes en scannant les codes-barres ou en tapant les quantites");
addBullet("Notifications push : Recevez les alertes importantes directement sur votre telephone, meme quand l'app est fermee");
addBullet("Interface tactile optimisee : Gros boutons, navigation intuitive, zero formation necessaire");
addBullet("Fonctionne sur tous les smartphones : iPhone et Android, meme les modeles de plus de 5 ans");
addBullet("Connexion 4G/5G : Fonctionne parfaitement meme avec une connexion mobile standard");
addBullet("Mode hors connexion : Les fonctions de base marchent meme sans internet, avec synchronisation automatique apres");

addHighlight(
  'Mise a jour en 2 minutes par jour',
  "Notre objectif : vous ne devez pas passer plus de 2 minutes par jour sur PONIA. L'interface est optimisee pour des mises a jour rapides, et l'IA fait le reste du travail en arriere-plan."
);

// ===== PARTIE 3 =====
doc.addPage();
resetY();

doc.fontSize(32)
   .fillColor(COLORS.primary)
   .font('Helvetica-Bold')
   .text('PARTIE 3', 55, currentY);
currentY += 40;

doc.fontSize(22)
   .fillColor(COLORS.dark)
   .text('Tarifs et formules', 55, currentY);
currentY += 50;

addSubtitle('Comparatif detaille des 3 offres');

addText(
  "PONIA propose trois formules adaptees a la taille et aux besoins de votre commerce. Toutes les formules incluent un essai gratuit de 14 jours sans engagement et sans carte bancaire."
);

currentY += 10;

addText('FORMULE BASIQUE - Gratuit', { font: 'Helvetica-Bold', color: COLORS.primary, size: 13 });

addText("Ideale pour : Les tres petits commerces qui debutent avec la gestion de stock digitale et veulent tester le concept.");

addBullet("Jusqu'a 50 produits dans votre catalogue");
addBullet("1 seul etablissement");
addBullet("PONIA Chat avec reponses basiques");
addBullet("Alertes de stock simples (seuils manuels)");
addBullet("Tableau de bord simplifie");
addBullet("Support par email sous 72h");

currentY += 5;

addText('FORMULE STANDARD - 49 euros/mois (ou 39 euros/mois en annuel)', { font: 'Helvetica-Bold', color: COLORS.primary, size: 13 });

addText("Ideale pour : La majorite des commerces alimentaires independants qui veulent profiter pleinement de l'IA.");

addBullet("Produits illimites dans votre catalogue");
addBullet("Jusqu'a 2 etablissements");
addBullet("PONIA Chat IA complet avec analyse avancee");
addBullet("Predictions de ventes a 7 jours");
addBullet("Alertes intelligentes : rupture, peremption, surstock");
addBullet("Generation automatique des commandes fournisseurs");
addBullet("Connexion a votre caisse enregistreuse");
addBullet("Export des donnees en CSV et PDF");
addBullet("Support prioritaire par email sous 48h et chat en ligne");

currentY += 5;

addText('FORMULE PRO - 69 euros/mois (ou 55 euros/mois en annuel)', { font: 'Helvetica-Bold', color: COLORS.primary, size: 13 });

addText("Ideale pour : Les commerces multi-sites et ceux qui veulent le maximum d'automatisation et de precision.");

addBullet("Tout ce qui est inclus dans la formule Standard, plus :");
addBullet("Etablissements illimites avec vue consolidee");
addBullet("Predictions de ventes a 30 jours");
addBullet("Analyse avancee meteo et evenements locaux");
addBullet("Suggestions de transferts entre etablissements");
addBullet("Rapports personnalises avec votre logo");
addBullet("API pour integrations personnalisees avec vos autres outils");
addBullet("Support telephonique dedie");
addBullet("Formation personnalisee a l'onboarding");

addSubtitle('Retour sur investissement');

addText(
  "PONIA n'est pas une depense, c'est un investissement qui se rentabilise des le premier mois. Voici un calcul concret base sur nos clients existants :"
);

addText('Exemple : Boulangerie avec 200 000 euros de CA annuel', { font: 'Helvetica-Bold', color: COLORS.dark });

addBullet("Gaspillage actuel estime : 8% du CA = 16 000 euros/an de pertes");
addBullet("Reduction du gaspillage avec PONIA : -30% = 4 800 euros economies/an");
addBullet("Ruptures de stock evitees : +5% de ventes = 10 000 euros/an de CA supplementaire");
addBullet("Temps gagne : 7h/semaine x 52 semaines = 364 heures/an liberees");
addBullet("Valeur du temps economise (SMIC horaire) : 364 x 11,65 euros = 4 240 euros/an");

addHighlight(
  'Bilan annuel',
  "Economies totales : 19 040 euros/an. Cout PONIA Standard annuel : 468 euros. Retour sur investissement : 40 fois le cout de l'abonnement. Vous gagnez plus de 18 500 euros net par an."
);

addText(
  "Et ce calcul ne prend pas en compte les benefices indirects : moins de stress au quotidien, meilleure satisfaction client (plus de ruptures), possibilite de vous concentrer sur le developpement de votre activite plutot que sur l'administratif."
);

addSubtitle('Comment demarrer en 5 minutes');

addText(
  "Commencer avec PONIA est simple et rapide. Aucune installation technique, aucun equipement a acheter, aucune formation longue. Vous pouvez etre operationnel en moins de 5 minutes."
);

addText('Les 4 etapes pour demarrer :', { font: 'Helvetica-Bold', color: COLORS.dark });

addNumberedItem('1.', 'INSCRIPTION - Creez votre compte gratuit sur myponia.fr. Il vous faut juste votre email et un mot de passe. Aucune carte bancaire demandee.');

addNumberedItem('2.', 'CONFIGURATION - Ajoutez vos produits. Vous pouvez le faire manuellement, scanner les codes-barres, ou importer un fichier depuis votre ancien systeme. Notre assistant vous guide pas a pas.');

addNumberedItem('3.', 'CONNEXION CAISSE - Si vous avez une caisse compatible (Square, SumUp, Lightspeed, etc.), connectez-la en quelques clics pour synchroniser vos ventes automatiquement.');

addNumberedItem('4.', 'UTILISATION - C\'est parti ! Posez votre premiere question a PONIA Chat et decouvrez la puissance de l\'IA. Vous recevrez vos premieres alertes intelligentes des le lendemain.');

addCTA();

// ===== PAGE DE FIN =====
doc.addPage();
doc.rect(0, 0, 595, 842).fill(COLORS.dark);

doc.fontSize(60)
   .fillColor(COLORS.primary)
   .font('Helvetica-Bold')
   .text('PONIA', 0, 300, { align: 'center' });

doc.fontSize(16)
   .fillColor(COLORS.white)
   .font('Helvetica')
   .text("L'IA au service de votre commerce", 0, 380, { align: 'center' });

doc.fontSize(14)
   .fillColor(COLORS.primary)
   .text('myponia.fr', 0, 450, { align: 'center' });

doc.fontSize(11)
   .fillColor(COLORS.gray)
   .text('contact@myponia.fr', 0, 480, { align: 'center' });

doc.fontSize(10)
   .text('2024 PONIA - Tous droits reserves', 0, 750, { align: 'center' });
doc.text('Auto-entrepreneur Enock Ligue', 0, 765, { align: 'center' });

// Numerotation des pages
const range = doc.bufferedPageRange();
for (let i = 1; i < range.count - 1; i++) {
  doc.switchToPage(i);
  doc.fontSize(9)
     .fillColor(COLORS.gray)
     .text(String(i), 0, 810, { align: 'center', width: 595 });
}

doc.end();

console.log(`PDF generated successfully: ${outputPath}`);
