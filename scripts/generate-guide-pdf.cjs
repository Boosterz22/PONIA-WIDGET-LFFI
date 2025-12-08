const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Paths to logo files
const LOGO_FULL = path.join(__dirname, '..', 'attached_assets', 'IMG_3757_2_1765194934787.png');
const LOGO_ICON = path.join(__dirname, '..', 'attached_assets', 'B62A4137-511E-493D-AF31-CF4EBA16B5BE-removebg-preview_1765194934787.png');

// Brand colors
const COLORS = {
  primary: '#F5A623',
  dark: '#1A1A1A',
  white: '#FFFFFF',
  textDark: '#333333',
  textGray: '#555555',
  lightBg: '#F8F8F8',
  green: '#22C55E',
  red: '#DC2626',
  orange: '#F59E0B'
};

// Page settings
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN_LEFT = 60;
const MARGIN_RIGHT = 60;
const MARGIN_TOP = 65;
const MARGIN_BOTTOM = 70;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const MAX_Y = PAGE_HEIGHT - MARGIN_BOTTOM;

// Create document
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, left: MARGIN_LEFT, right: MARGIN_RIGHT },
  bufferPages: true,
  autoFirstPage: false
});

const outputPath = path.join(__dirname, '..', 'public', 'Guide-PONIA-A-Z.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// ============================================
// HELPER FUNCTIONS
// ============================================

function newPage() {
  doc.addPage();
  return MARGIN_TOP;
}

function getTextHeight(text, options = {}) {
  return doc.heightOfString(text, {
    width: options.width || CONTENT_WIDTH,
    lineGap: options.lineGap || 4
  });
}

function ensureSpace(needed) {
  if (doc.y + needed > MAX_Y) {
    newPage();
    return true;
  }
  return false;
}

function writeText(text, options = {}) {
  const fontSize = options.size || 11;
  const lineGap = options.lineGap || 5;
  const width = options.width || CONTENT_WIDTH;
  
  doc.font(options.font || 'Helvetica')
     .fontSize(fontSize)
     .fillColor(options.color || COLORS.textGray);
  
  const height = getTextHeight(text, { width, lineGap });
  ensureSpace(height + 20);
  
  doc.text(text, options.x || MARGIN_LEFT, doc.y, {
    width: width,
    align: options.align || 'justify',
    lineGap: lineGap
  });
  
  doc.moveDown(options.after || 0.8);
}

function writeTitle(text, level = 1) {
  const sizes = { 1: 26, 2: 18, 3: 14 };
  const spacing = { 1: 1.2, 2: 1, 3: 0.8 };
  
  ensureSpace(50);
  
  doc.font('Helvetica-Bold')
     .fontSize(sizes[level] || 14)
     .fillColor(level === 1 ? COLORS.primary : COLORS.dark)
     .text(text, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH });
  
  doc.moveDown(spacing[level] || 0.8);
}

function writeBullet(text) {
  doc.font('Helvetica')
     .fontSize(11)
     .fillColor(COLORS.textGray);
  
  const height = getTextHeight(text, { width: CONTENT_WIDTH - 20 });
  ensureSpace(height + 15);
  
  const bulletY = doc.y;
  doc.fillColor(COLORS.primary)
     .text('•', MARGIN_LEFT, bulletY);
  
  doc.fillColor(COLORS.textGray)
     .text(text, MARGIN_LEFT + 18, bulletY, { 
       width: CONTENT_WIDTH - 18,
       lineGap: 4
     });
  
  doc.moveDown(0.5);
}

function writeNumbered(num, text) {
  doc.font('Helvetica')
     .fontSize(11);
  
  const height = getTextHeight(text, { width: CONTENT_WIDTH - 25 });
  ensureSpace(height + 15);
  
  const startY = doc.y;
  
  doc.font('Helvetica-Bold')
     .fillColor(COLORS.primary)
     .text(num, MARGIN_LEFT, startY);
  
  doc.font('Helvetica')
     .fillColor(COLORS.textGray)
     .text(text, MARGIN_LEFT + 25, startY, { 
       width: CONTENT_WIDTH - 25,
       lineGap: 4
     });
  
  doc.moveDown(0.6);
}

function writeHighlight(title, content) {
  doc.font('Helvetica').fontSize(10);
  const contentHeight = getTextHeight(content, { width: CONTENT_WIDTH - 40 });
  const boxHeight = contentHeight + 55;
  
  ensureSpace(boxHeight + 20);
  
  const startY = doc.y;
  
  // Background
  doc.rect(MARGIN_LEFT, startY, CONTENT_WIDTH, boxHeight)
     .fill(COLORS.lightBg);
  
  // Left accent bar
  doc.rect(MARGIN_LEFT, startY, 5, boxHeight)
     .fill(COLORS.primary);
  
  // Title
  doc.font('Helvetica-Bold')
     .fontSize(12)
     .fillColor(COLORS.primary)
     .text(title, MARGIN_LEFT + 20, startY + 15, { width: CONTENT_WIDTH - 40 });
  
  // Content
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor(COLORS.dark)
     .text(content, MARGIN_LEFT + 20, doc.y + 5, { 
       width: CONTENT_WIDTH - 40,
       lineGap: 4
     });
  
  doc.y = startY + boxHeight + 20;
}

function writeAlertBox(color, title, description) {
  doc.font('Helvetica').fontSize(10);
  const descHeight = getTextHeight(description, { width: CONTENT_WIDTH - 30 });
  const boxHeight = descHeight + 45;
  
  ensureSpace(boxHeight + 15);
  
  const startY = doc.y;
  
  // Left color bar
  doc.rect(MARGIN_LEFT, startY, 5, boxHeight)
     .fill(color);
  
  // Title
  doc.font('Helvetica-Bold')
     .fontSize(12)
     .fillColor(COLORS.dark)
     .text(title, MARGIN_LEFT + 18, startY + 8);
  
  // Description
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor(COLORS.textGray)
     .text(description, MARGIN_LEFT + 18, doc.y + 5, { 
       width: CONTENT_WIDTH - 30,
       lineGap: 4
     });
  
  doc.y = startY + boxHeight + 15;
}

function writeExamples(title, items) {
  ensureSpace(30 + items.length * 22);
  
  doc.font('Helvetica-BoldOblique')
     .fontSize(11)
     .fillColor(COLORS.orange)
     .text(title, MARGIN_LEFT, doc.y);
  
  doc.moveDown(0.4);
  
  items.forEach(item => {
    doc.font('Helvetica-Oblique')
       .fontSize(10)
       .fillColor(COLORS.textGray)
       .text(`"${item}"`, MARGIN_LEFT + 15, doc.y, { width: CONTENT_WIDTH - 15 });
    doc.moveDown(0.3);
  });
  
  doc.moveDown(0.6);
}

// ============================================
// PAGE 1: COVER
// ============================================
doc.addPage();
doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.dark);

// Logo - positioned higher
if (fs.existsSync(LOGO_FULL)) {
  doc.image(LOGO_FULL, (PAGE_WIDTH - 300) / 2, 180, { width: 300 });
}

// Subtitle - much lower to avoid overlap
doc.font('Helvetica')
   .fontSize(24)
   .fillColor(COLORS.white)
   .text('Guide Complet de A a Z', 0, 420, { align: 'center', width: PAGE_WIDTH });

// Tagline
doc.fontSize(16)
   .fillColor(COLORS.primary)
   .text("L'intelligence artificielle au service", 0, 500, { align: 'center', width: PAGE_WIDTH });
doc.text("des commerces alimentaires", 0, 525, { align: 'center', width: PAGE_WIDTH });

// Industries
doc.fontSize(11)
   .fillColor('#888888')
   .text('Boulangeries - Restaurants - Bars - Caves a vin - Fromageries', 0, 600, { align: 'center', width: PAGE_WIDTH });

// Edition
doc.fontSize(9)
   .fillColor('#666666')
   .text('Edition 2024', 0, 780, { align: 'center', width: PAGE_WIDTH });

// ============================================
// PAGE 2: SOMMAIRE
// ============================================
newPage();

doc.font('Helvetica-Bold')
   .fontSize(28)
   .fillColor(COLORS.primary)
   .text('Sommaire', MARGIN_LEFT, MARGIN_TOP);

doc.moveDown(2);

const tocItems = [
  { text: 'PARTIE 1 : QU\'EST-CE QUE PONIA ?', bold: true },
  { text: '   Notre vision et notre mission', bold: false },
  { text: '   Les 4 problemes que nous resolvons', bold: false },
  { text: '   Pourquoi l\'IA change tout', bold: false },
  { text: '', bold: false },
  { text: 'PARTIE 2 : TOUTES LES FONCTIONNALITES', bold: true },
  { text: '   PONIA Chat - Votre assistant IA', bold: false },
  { text: '   Les alertes predictives intelligentes', bold: false },
  { text: '   Generation automatique des commandes', bold: false },
  { text: '   Connexion aux caisses enregistreuses', bold: false },
  { text: '   Tableau de bord et statistiques', bold: false },
  { text: '   Gestion multi-etablissements', bold: false },
  { text: '   Interface mobile-first', bold: false },
  { text: '', bold: false },
  { text: 'PARTIE 3 : TARIFS ET FORMULES', bold: true },
  { text: '   Comparatif des 3 offres', bold: false },
  { text: '   Retour sur investissement', bold: false },
  { text: '   Comment demarrer', bold: false }
];

tocItems.forEach(item => {
  if (item.text === '') {
    doc.moveDown(0.5);
    return;
  }
  doc.font(item.bold ? 'Helvetica-Bold' : 'Helvetica')
     .fontSize(item.bold ? 13 : 11)
     .fillColor(item.bold ? COLORS.dark : COLORS.textGray)
     .text(item.text, MARGIN_LEFT, doc.y);
  doc.moveDown(item.bold ? 0.8 : 0.5);
});

// ============================================
// PARTIE 1: QU'EST-CE QUE PONIA ?
// ============================================
newPage();

// Section header with icon
if (fs.existsSync(LOGO_ICON)) {
  doc.image(LOGO_ICON, MARGIN_LEFT, MARGIN_TOP - 5, { width: 40 });
}

doc.font('Helvetica-Bold')
   .fontSize(13)
   .fillColor(COLORS.primary)
   .text('PARTIE 1', MARGIN_LEFT + 50, MARGIN_TOP + 5);

doc.font('Helvetica-Bold')
   .fontSize(24)
   .fillColor(COLORS.dark)
   .text("Qu'est-ce que PONIA ?", MARGIN_LEFT + 50, MARGIN_TOP + 25);

doc.y = MARGIN_TOP + 70;
doc.moveDown(1);

writeTitle('Notre vision', 2);

writeText(
  "PONIA est une solution logicielle d'intelligence artificielle specialement concue pour les commerces alimentaires de proximite francais. Nous ciblons les boulangeries, patisseries, restaurants, bars, caves a vin, fromageries, epiceries fines et traiteurs."
);

writeText(
  "Notre constat de depart est simple : les grandes enseignes de distribution disposent d'equipes entieres dediees a l'optimisation des stocks, avec des logiciels coutant des dizaines de milliers d'euros. Les petits commercants, eux, sont laisses de cote. Ils gerent leurs stocks sur un cahier, un bout de papier, ou au mieux un fichier Excel."
);

writeText(
  "PONIA change la donne. Nous mettons l'intelligence artificielle de niveau entreprise a la portee de tous les commercants, pour une fraction du cout. Notre objectif : que chaque boulanger de quartier, chaque restaurateur independant, chaque caviste passionne puisse beneficier des memes outils que les grands groupes."
);

writeHighlight(
  'Notre promesse',
  "Vous faire gagner 7 heures par semaine minimum sur la gestion de vos stocks, reduire le gaspillage de 20 a 40%, et eliminer definitivement les ruptures de stock. Le tout en moins de 2 minutes d'utilisation par jour."
);

writeTitle('Notre mission', 2);

writeText(
  "Democratiser l'acces a l'intelligence artificielle pour les TPE alimentaires francaises. Nous croyons que la technologie doit simplifier la vie des commercants, pas la compliquer. C'est pourquoi nous avons concu PONIA pour etre utilisable sans aucune formation technique, directement depuis votre telephone."
);

writeText(
  "Nous comprenons votre quotidien : vous etes debout a 4h du matin pour preparer le pain, vous courez toute la journee entre les clients et les fournisseurs, vous n'avez pas le temps de vous former sur des logiciels complexes. PONIA s'adapte a vous, pas l'inverse."
);

writeTitle('Les 4 problemes que PONIA resout', 2);

writeTitle('Probleme 1 : Le gaspillage alimentaire', 3);

writeText(
  "Chaque annee, un commerce alimentaire jette en moyenne 5 a 15% de sa marchandise. Pour une boulangerie realisant 300 000 euros de chiffre d'affaires annuel, cela represente 15 000 a 45 000 euros de pertes seches. Les produits perissent car personne n'a le temps de surveiller les dates de peremption de centaines de references."
);

writeText(
  "Les causes sont multiples : commandes basees sur l'intuition plutot que sur les donnees, manque de visibilite sur les dates de peremption, difficulte a anticiper les variations de frequentation, et surstock systematique par peur de manquer."
);

writeText(
  "PONIA surveille automatiquement TOUTES vos dates de peremption et vous alerte 3, 5 ou 7 jours avant l'expiration selon vos preferences. L'IA analyse egalement votre historique pour vous aider a commander les bonnes quantites. Resultat constate chez nos utilisateurs : 20 a 30% de gaspillage en moins des le premier mois."
);

writeTitle('Probleme 2 : Les ruptures de stock', 3);

writeText(
  "\"Desole, on n'a plus de croissants\" - cette phrase vous coute de l'argent et des clients. Une rupture de stock, c'est une vente perdue, mais c'est aussi un client decu qui risque d'aller chez le concurrent et de ne jamais revenir. On estime qu'une rupture coute 3 a 5 fois le prix du produit en manque a gagner."
);

writeText(
  "PONIA analyse vos ventes passees, les tendances saisonnieres, la meteo locale et les evenements pour predire EXACTEMENT combien vous allez vendre demain, dans 7 jours, dans 30 jours. L'IA vous alerte avant meme que le probleme n'arrive."
);

writeTitle('Probleme 3 : Le temps perdu en gestion', 3);

writeText(
  "Inventaire manuel, calcul des commandes sur un bout de papier, appels aux fournisseurs, verification des livraisons... Un commercant passe en moyenne 7 a 10 heures par semaine sur ces taches administratives. C'est du temps que vous ne passez pas avec vos clients ou a developper votre activite."
);

writeText(
  "PONIA automatise tout ce qui peut l'etre : l'inventaire se fait en 2 minutes sur votre telephone, les commandes sont generees automatiquement par l'IA, vous n'avez qu'a valider et envoyer par WhatsApp ou email."
);

writeTitle('Probleme 4 : Le manque de visibilite', 3);

writeText(
  "Combien avez-vous vendu de baguettes tradition le mois dernier ? Quel est votre produit le plus rentable ? Sans donnees precises, vous pilotez a vue. Les decisions sont prises au feeling, et les erreurs coutent cher."
);

writeText(
  "PONIA vous donne des tableaux de bord clairs : ventes par produit, tendances, previsions. Vous savez exactement ou vous en etes a tout moment, depuis votre telephone."
);

writeTitle("Pourquoi l'IA change tout", 2);

writeText(
  "L'intelligence artificielle permet d'analyser en quelques secondes des quantites de donnees qu'un humain mettrait des heures a traiter. Appliquee a votre commerce, l'IA peut :"
);

writeBullet("Analyser des milliers de donnees en temps reel : vos ventes, la meteo, la saisonnalite, les evenements locaux");
writeBullet("Faire des predictions fiables basees sur votre historique reel, pas sur des moyennes generiques");
writeBullet("Converser naturellement avec vous en francais, sans formation ni mode d'emploi");
writeBullet("Apprendre continuellement de vos habitudes pour ameliorer ses predictions chaque jour");

writeHighlight(
  "L'IA conversationnelle",
  "Contrairement aux logiciels avec des menus complexes, PONIA fonctionne comme une conversation. Vous posez vos questions en francais naturel et l'IA vous repond instantanement avec des recommandations chiffrees et expliquees."
);

// ============================================
// PARTIE 2: LES FONCTIONNALITES
// ============================================
newPage();

if (fs.existsSync(LOGO_ICON)) {
  doc.image(LOGO_ICON, MARGIN_LEFT, MARGIN_TOP - 5, { width: 40 });
}

doc.font('Helvetica-Bold')
   .fontSize(13)
   .fillColor(COLORS.primary)
   .text('PARTIE 2', MARGIN_LEFT + 50, MARGIN_TOP + 5);

doc.font('Helvetica-Bold')
   .fontSize(24)
   .fillColor(COLORS.dark)
   .text('Toutes les fonctionnalites', MARGIN_LEFT + 50, MARGIN_TOP + 25);

doc.y = MARGIN_TOP + 70;
doc.moveDown(1);

writeTitle('PONIA Chat - Votre assistant IA personnel', 2);

writeText(
  "PONIA Chat est le coeur de notre solution. C'est votre assistant personnel disponible 24 heures sur 24, 7 jours sur 7, qui repond a toutes vos questions sur vos stocks en langage naturel. Pas besoin de formation, pas de manuel a lire : vous parlez a PONIA comme vous parleriez a un employe experimente."
);

writeTitle('Comment ca marche ?', 3);

writeText(
  "Vous ouvrez l'application sur votre telephone, et vous posez votre question a l'oral ou a l'ecrit. L'IA analyse instantanement vos stocks actuels, vos historiques de vente, les tendances du marche, la meteo prevue, et vous donne une reponse precise et actionnable en quelques secondes."
);

writeText(
  "Par exemple, si vous demandez \"Qu'est-ce que je dois commander pour le week-end prochain ?\", PONIA va analyser vos ventes des week-ends precedents, verifier la meteo annoncee, regarder s'il y a des evenements locaux, et vous generer une liste de commande optimisee avec les quantites exactes pour chaque produit."
);

writeExamples('Exemples de questions que vous pouvez poser :', [
  "Prepare-moi la commande boulanger pour lundi",
  "Quels produits risquent la rupture cette semaine ?",
  "Qu'est-ce qui va bientot perimer dans mon stock ?",
  "Quel est mon produit le plus rentable ce mois-ci ?",
  "Combien de croissants j'ai vendu la semaine derniere ?",
  "Donne-moi un resume de ma situation stock"
]);

writeTitle('Les capacites de PONIA Chat', 3);

writeBullet("Analyse predictive : L'IA anticipe vos besoins en se basant sur l'historique, la saisonnalite, la meteo et les evenements locaux");
writeBullet("Recommandations personnalisees : Chaque conseil est adapte a VOTRE commerce, VOTRE clientele, VOS habitudes");
writeBullet("Generation de commandes : En une phrase, l'IA genere une commande complete et optimisee prete a envoyer");
writeBullet("Alertes proactives : PONIA vous previent des problemes avant meme que vous ne posiez la question");
writeBullet("Apprentissage continu : Plus vous utilisez PONIA, plus l'IA comprend votre commerce");
writeBullet("Disponibilite totale : 24h/24, 7j/7, meme les jours feries");

writeHighlight(
  'Gain de temps estime',
  "PONIA Chat vous fait economiser 30 minutes a 1 heure par jour en repondant instantanement aux questions qui vous prendraient des heures de recherche manuelle."
);

writeTitle('Les alertes predictives intelligentes', 2);

writeText(
  "PONIA ne se contente pas de repondre a vos questions : l'IA surveille en permanence vos stocks et vous alerte AVANT que les problemes n'arrivent. C'est comme avoir un employe ultra-vigilant qui ne dort jamais."
);

writeTitle('Les 3 types d\'alertes', 3);

writeAlertBox(COLORS.red, 'Alertes de rupture de stock',
  "L'IA analyse vos ventes prevues pour les prochains jours et compare avec votre stock actuel. Si une rupture est probable, vous recevez une alerte avec le produit concerne, la date estimee de rupture, et la quantite a commander."
);

writeAlertBox(COLORS.orange, 'Alertes de peremption',
  "PONIA surveille toutes les dates de peremption de vos produits. Vous definissez vos seuils (3, 5 ou 7 jours avant expiration), et l'IA vous alerte automatiquement avec des suggestions d'actions."
);

writeAlertBox(COLORS.primary, 'Alertes de surstock',
  "Avoir trop de stock, c'est de l'argent immobilise et un risque de gaspillage. PONIA detecte les produits dont vous avez commande trop par rapport a vos ventes habituelles."
);

writeTitle('Comment sont calculees les alertes', 3);

writeBullet("Votre historique de ventes : patterns quotidiens, hebdomadaires, mensuels et annuels");
writeBullet("La meteo locale : un jour de pluie = moins de passage, une canicule = plus de boissons");
writeBullet("La saisonnalite : vacances scolaires, fetes, rentree, etc.");
writeBullet("Les evenements locaux : marches, concerts, matchs, manifestations");
writeBullet("Vos seuils personnalises par produit");

writeHighlight(
  'Notifications personnalisables',
  "Vous choisissez comment recevoir vos alertes : notification push sur votre telephone, email quotidien recapitulatif, ou les deux. Vous definissez aussi les horaires de notification."
);

writeTitle('Generation automatique des commandes', 2);

writeText(
  "C'est LA fonctionnalite qui vous fera gagner le plus de temps. Fini les heures passees a calculer combien commander de chaque produit. PONIA genere automatiquement vos commandes fournisseurs en quelques secondes."
);

writeTitle('Le processus en 3 etapes', 3);

writeNumbered('1.', "ANALYSE - L'IA analyse votre stock actuel, vos ventes prevues pour les prochains jours, vos dates de peremption, et vos seuils minimum configures.");

writeNumbered('2.', "CALCUL - L'IA calcule la quantite optimale a commander pour chaque produit, en tenant compte des delais de livraison et des quantites minimum de commande.");

writeNumbered('3.', "GENERATION - Une commande professionnelle est generee au format PDF, prete a envoyer par email ou WhatsApp.");

writeTitle('Ce que contient une commande generee', 3);

writeBullet("Liste complete des produits avec les quantites optimisees par l'IA");
writeBullet("Justification IA : pourquoi ces quantites sont recommandees");
writeBullet("Date de livraison souhaitee calculee automatiquement");
writeBullet("Format professionnel avec vos coordonnees pre-remplies");
writeBullet("Total estime de la commande si vous avez renseigne vos prix d'achat");

writeHighlight(
  'Economies realisees',
  "En moyenne, nos utilisateurs reduisent leurs commandes excessives de 15 a 25%, ce qui represente une economie directe de plusieurs centaines d'euros par mois."
);

writeTitle('Connexion aux caisses enregistreuses', 2);

writeText(
  "Pour que PONIA fasse des predictions precises, il a besoin de connaitre vos ventes en temps reel. C'est pourquoi nous proposons une integration directe avec les principales caisses enregistreuses du marche."
);

writeTitle('Caisses compatibles', 3);

writeBullet("Square - Leader mondial des solutions de paiement");
writeBullet("SumUp - Solution populaire et abordable pour les TPE");
writeBullet("Zettle by PayPal - Anciennement iZettle, tres repandu");
writeBullet("Lightspeed Restaurant - Solution professionnelle pour la restauration");
writeBullet("Lightspeed Retail (K-Series) - Pour les commerces de detail");
writeBullet("Hiboutik - Solution francaise economique et complete");
writeBullet("Tiller - Specialiste de la restauration en France");

writeText(
  "L'integration est simple : vous vous connectez a votre compte caisse depuis PONIA, vous autorisez l'acces, et c'est fait. Vos ventes sont synchronisees automatiquement."
);

writeHighlight(
  'Pas de caisse compatible ?',
  "Vous pouvez entrer vos ventes manuellement en quelques clics, ou importer un fichier CSV depuis n'importe quel systeme. Nous ajoutons regulierement de nouvelles integrations."
);

writeTitle('Tableau de bord et statistiques', 2);

writeText(
  "PONIA vous offre une vue d'ensemble claire et visuelle de votre activite. Le tableau de bord a ete concu pour etre comprehensible en un coup d'oeil."
);

writeBullet("Score de sante global : Un indicateur de 0 a 100 qui resume l'etat de vos stocks");
writeBullet("Temps economise : Combien d'heures vous avez gagnees cette semaine");
writeBullet("Alertes en cours : Les problemes qui necessitent votre attention, classes par priorite");
writeBullet("Graphiques de ventes : Visualisez vos tendances sur la semaine, le mois ou l'annee");
writeBullet("Top produits : Vos meilleures ventes et vos produits les plus rentables");
writeBullet("Previsions : Ce que l'IA prevoit pour les prochains jours");

writeTitle('Gestion multi-etablissements', 2);

writeText(
  "Vous avez plusieurs points de vente ? PONIA gere tout depuis une seule interface. Ideal pour les boulangeries avec plusieurs boutiques ou les restaurateurs avec plusieurs adresses."
);

writeBullet("Vue consolidee : Voyez l'etat de tous vos etablissements sur un seul ecran");
writeBullet("Vue par etablissement : Zoomez sur un site specifique pour les details");
writeBullet("Transferts inter-sites : L'IA suggere des transferts de stock entre etablissements");
writeBullet("Comparaison de performance : Comparez les ventes entre vos differents sites");
writeBullet("Commandes centralisees ou separees : Vous choisissez");

writeTitle('Interface mobile-first', 2);

writeText(
  "PONIA a ete concu pour etre utilise sur smartphone. Vous etes rarement assis derriere un ordinateur : vous etes en cuisine, en boutique, en reserve. Votre telephone est toujours dans votre poche, et PONIA aussi."
);

writeBullet("Inventaire ultra-rapide : Mettez a jour vos stocks en 2 minutes");
writeBullet("Notifications push : Recevez les alertes importantes directement");
writeBullet("Interface tactile optimisee : Gros boutons, navigation intuitive");
writeBullet("Fonctionne sur tous les smartphones : iPhone et Android");
writeBullet("Connexion 4G/5G : Fonctionne parfaitement meme avec une connexion mobile");

writeHighlight(
  'Mise a jour en 2 minutes par jour',
  "Notre objectif : vous ne devez pas passer plus de 2 minutes par jour sur PONIA. L'interface est optimisee pour des mises a jour rapides, et l'IA fait le reste."
);

// ============================================
// PARTIE 3: TARIFS
// ============================================
newPage();

if (fs.existsSync(LOGO_ICON)) {
  doc.image(LOGO_ICON, MARGIN_LEFT, MARGIN_TOP - 5, { width: 40 });
}

doc.font('Helvetica-Bold')
   .fontSize(13)
   .fillColor(COLORS.primary)
   .text('PARTIE 3', MARGIN_LEFT + 50, MARGIN_TOP + 5);

doc.font('Helvetica-Bold')
   .fontSize(24)
   .fillColor(COLORS.dark)
   .text('Tarifs et formules', MARGIN_LEFT + 50, MARGIN_TOP + 25);

doc.y = MARGIN_TOP + 70;
doc.moveDown(1);

writeTitle('Comparatif des 3 offres', 2);

writeText(
  "PONIA propose trois formules adaptees a la taille et aux besoins de votre commerce. Toutes les formules incluent un essai gratuit de 14 jours sans engagement et sans carte bancaire."
);

writeTitle('FORMULE BASIQUE - Gratuit', 3);

writeText(
  "Ideale pour les tres petits commerces qui debutent avec la gestion de stock digitale."
);

writeBullet("Jusqu'a 50 produits dans votre catalogue");
writeBullet("1 seul etablissement");
writeBullet("PONIA Chat avec reponses basiques");
writeBullet("Alertes de stock simples");
writeBullet("Tableau de bord simplifie");
writeBullet("Support par email sous 72h");

writeTitle('FORMULE STANDARD - 49 euros/mois (ou 39 euros/mois en annuel)', 3);

writeText(
  "Ideale pour la majorite des commerces alimentaires independants."
);

writeBullet("Produits illimites dans votre catalogue");
writeBullet("Jusqu'a 2 etablissements");
writeBullet("PONIA Chat IA complet avec analyse avancee");
writeBullet("Predictions de ventes a 7 jours");
writeBullet("Alertes intelligentes : rupture, peremption, surstock");
writeBullet("Generation automatique des commandes fournisseurs");
writeBullet("Connexion a votre caisse enregistreuse");
writeBullet("Export des donnees en CSV et PDF");
writeBullet("Support prioritaire par email sous 48h et chat");

writeTitle('FORMULE PRO - 69 euros/mois (ou 55 euros/mois en annuel)', 3);

writeText(
  "Ideale pour les commerces multi-sites et ceux qui veulent le maximum d'automatisation."
);

writeBullet("Tout le Standard, plus :");
writeBullet("Etablissements illimites avec vue consolidee");
writeBullet("Predictions de ventes a 30 jours");
writeBullet("Analyse avancee meteo et evenements locaux");
writeBullet("Suggestions de transferts entre etablissements");
writeBullet("Rapports personnalises avec votre logo");
writeBullet("API pour integrations personnalisees");
writeBullet("Support telephonique dedie");
writeBullet("Formation personnalisee a l'onboarding");

writeTitle('Retour sur investissement', 2);

writeText(
  "PONIA n'est pas une depense, c'est un investissement qui se rentabilise des le premier mois. Voici un calcul concret :"
);

writeTitle('Exemple : Boulangerie avec 200 000 euros de CA annuel', 3);

writeBullet("Gaspillage actuel estime : 8% du CA = 16 000 euros/an de pertes");
writeBullet("Reduction du gaspillage avec PONIA : -30% = 4 800 euros economies/an");
writeBullet("Ruptures de stock evitees : +5% de ventes = 10 000 euros/an");
writeBullet("Temps gagne : 7h/semaine x 52 semaines = 364 heures/an");
writeBullet("Valeur du temps economise : 364 x 11,65 euros = 4 240 euros/an");

writeHighlight(
  'Bilan annuel',
  "Economies totales : 19 040 euros/an. Cout PONIA Standard annuel : 468 euros. Retour sur investissement : 40 fois le cout de l'abonnement. Vous gagnez plus de 18 500 euros net par an."
);

writeTitle('Comment demarrer', 2);

writeText(
  "Commencer avec PONIA est simple et rapide. Aucune installation technique, aucun equipement a acheter. Vous pouvez etre operationnel en moins de 5 minutes."
);

writeTitle('Les 4 etapes pour demarrer', 3);

writeNumbered('1.', "INSCRIPTION - Creez votre compte gratuit sur myponia.fr. Il vous faut juste votre email et un mot de passe. Aucune carte bancaire demandee.");

writeNumbered('2.', "CONFIGURATION - Ajoutez vos produits manuellement, scannez les codes-barres, ou importez un fichier. Notre assistant vous guide.");

writeNumbered('3.', "CONNEXION CAISSE - Si vous avez une caisse compatible, connectez-la en quelques clics pour synchroniser vos ventes automatiquement.");

writeNumbered('4.', "UTILISATION - C'est parti ! Posez votre premiere question a PONIA Chat et decouvrez la puissance de l'IA.");

// CTA Box
ensureSpace(100);
const ctaY = doc.y + 10;
doc.rect(MARGIN_LEFT, ctaY, CONTENT_WIDTH, 85)
   .fill(COLORS.primary);

doc.font('Helvetica-Bold')
   .fontSize(18)
   .fillColor(COLORS.dark)
   .text("Pret a gagner du temps et de l'argent ?", MARGIN_LEFT + 20, ctaY + 18);

doc.font('Helvetica')
   .fontSize(12)
   .text("Essai gratuit 14 jours - Sans engagement - Sans carte bancaire", MARGIN_LEFT + 20, ctaY + 45);

doc.font('Helvetica-Bold')
   .fontSize(16)
   .text("myponia.fr", MARGIN_LEFT + 20, ctaY + 65);

// ============================================
// BACK COVER
// ============================================
newPage();
doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.dark);

if (fs.existsSync(LOGO_FULL)) {
  doc.image(LOGO_FULL, (PAGE_WIDTH - 280) / 2, 300, { width: 280 });
}

doc.font('Helvetica')
   .fontSize(16)
   .fillColor(COLORS.white)
   .text("L'IA au service de votre commerce", 0, 420, { align: 'center', width: PAGE_WIDTH });

doc.fontSize(18)
   .fillColor(COLORS.primary)
   .text('myponia.fr', 0, 480, { align: 'center', width: PAGE_WIDTH });

doc.fontSize(11)
   .fillColor('#888888')
   .text('contact@myponia.fr', 0, 510, { align: 'center', width: PAGE_WIDTH });

doc.fontSize(10)
   .fillColor('#666666')
   .text('2024 PONIA - Tous droits reserves', 0, 760, { align: 'center', width: PAGE_WIDTH });
doc.text('Auto-entrepreneur Enock Ligue', 0, 775, { align: 'center', width: PAGE_WIDTH });

// ============================================
// PAGE NUMBERS
// ============================================
const range = doc.bufferedPageRange();
for (let i = 1; i < range.count - 1; i++) {
  doc.switchToPage(i);
  doc.font('Helvetica')
     .fontSize(9)
     .fillColor('#999999')
     .text(String(i), 0, PAGE_HEIGHT - 40, { 
       align: 'center', 
       width: PAGE_WIDTH 
     });
}

doc.end();

console.log(`PDF generated successfully: ${outputPath}`);
