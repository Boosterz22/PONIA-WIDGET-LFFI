const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const COLORS = {
  yellow: '#F5C518',
  black: '#000000',
  darkGray: '#1a1a1a',
  lightGray: '#f5f5f5',
  mediumGray: '#6B7280',
  white: '#FFFFFF',
  red: '#EF4444',
  orange: '#F59E0B',
  green: '#10B981'
};

function createGuidePDF() {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true
  });

  const outputPath = path.join(__dirname, '..', 'public', 'Guide-PONIA-A-Z.pdf');
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const logoPath = path.join(__dirname, '..', 'attached_assets', 'IMG_3757_2_1765191614191.png');
  const iconPath = path.join(__dirname, '..', 'attached_assets', 'B62A4137-511E-493D-AF31-CF4EBA16B5BE-removebg-preview_1765191614192.png');

  // ============ COVER PAGE ============
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(COLORS.black);
  
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 120, 200, { width: 350 });
  } else {
    doc.fillColor(COLORS.yellow).fontSize(60).font('Helvetica-Bold').text('PONIA', 0, 250, { align: 'center' });
  }

  doc.fillColor(COLORS.yellow).fontSize(28).font('Helvetica-Bold')
    .text('Guide Complet', 0, 380, { align: 'center' });
  
  doc.fillColor(COLORS.white).fontSize(18).font('Helvetica')
    .text("L'IA qui révolutionne la gestion des commerces alimentaires", 0, 430, { align: 'center' });

  doc.fillColor(COLORS.mediumGray).fontSize(12).font('Helvetica')
    .text('Version 1.0 - 2024', 0, 750, { align: 'center' });

  // ============ TABLE OF CONTENTS ============
  doc.addPage();
  addPageHeader(doc, 'Table des matières', iconPath);

  doc.fillColor(COLORS.black).fontSize(14).font('Helvetica');
  const toc = [
    { title: 'PARTIE 1 : PRÉSENTATION', page: 3 },
    { title: "   1.1 Qu'est-ce que PONIA ?", page: 3 },
    { title: '   1.2 Les problèmes que PONIA résout', page: 3 },
    { title: '   1.3 Notre mission', page: 5 },
    { title: "   1.4 Pourquoi l'IA change tout", page: 5 },
    { title: 'PARTIE 2 : FONCTIONNALITÉS', page: 6 },
    { title: "   2.1 PONIA Chat - L'IA conversationnelle", page: 6 },
    { title: '   2.2 Alertes prédictives intelligentes', page: 7 },
    { title: '   2.3 Génération automatique des commandes', page: 8 },
    { title: '   2.4 Connexion aux caisses enregistreuses', page: 9 },
    { title: '   2.5 Tableau de bord et analytics', page: 9 },
    { title: '   2.6 Multi-établissements', page: 10 },
    { title: '   2.7 Interface mobile-first', page: 10 },
    { title: 'PARTIE 3 : TARIFS', page: 11 },
    { title: '   3.1 Nos offres', page: 11 },
    { title: '   3.2 Essai gratuit', page: 11 },
    { title: '   3.3 Retour sur investissement', page: 12 }
  ];

  let tocY = 140;
  toc.forEach(item => {
    const isBold = !item.title.startsWith('   ');
    doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica')
      .fillColor(isBold ? COLORS.black : COLORS.mediumGray)
      .fontSize(isBold ? 13 : 11)
      .text(item.title, 60, tocY);
    tocY += 28;
  });

  // ============ PARTIE 1 : PRÉSENTATION ============
  doc.addPage();
  addPartTitle(doc, 'PARTIE 1', 'PRÉSENTATION', iconPath);

  // 1.1 Qu'est-ce que PONIA ?
  doc.addPage();
  addPageHeader(doc, "1.1 Qu'est-ce que PONIA ?", iconPath);

  addParagraph(doc, 120, 
    "PONIA est un assistant intelligent propulsé par l'intelligence artificielle, conçu spécifiquement pour les commerces alimentaires français : boulangeries, restaurants, bars, caves à vin, fromageries et épiceries fines."
  );

  addParagraph(doc, 190,
    "Contrairement aux logiciels de gestion de stock traditionnels qui se contentent d'enregistrer les entrées et sorties, PONIA anticipe, prédit et agit. C'est comme avoir un collaborateur expert disponible 24h/24 qui connaît parfaitement votre activité, vos produits et vos clients."
  );

  addHighlightBox(doc, 280, 
    "Au cœur de l'expérience : PONIA Chat, une intelligence artificielle conversationnelle. Vous posez vos questions en français, comme vous le feriez à un collègue, et PONIA répond instantanément avec des recommandations concrètes."
  );

  // 1.2 Les problèmes
  doc.addPage();
  addPageHeader(doc, '1.2 Les problèmes que PONIA résout', iconPath);

  addProblemSection(doc, 120, 'Le gaspillage alimentaire', 
    "En France, un restaurant jette en moyenne 14% de ses achats alimentaires. Pour une boulangerie, c'est entre 5% et 10% de la production quotidienne.",
    [
      "Commandes basées sur l'intuition plutôt que sur les données",
      "Pas de visibilité sur les dates de péremption",
      "Difficulté à anticiper les variations de fréquentation",
      "Surstock par peur de manquer"
    ],
    "L'IA analyse votre historique de ventes, croise avec la météo et les événements locaux, et vous dit exactement quoi commander. Résultat : 20 à 30% de gaspillage en moins."
  );

  doc.addPage();
  addPageHeader(doc, '1.2 Les problèmes que PONIA résout (suite)', iconPath);

  addProblemSection(doc, 120, 'Les ruptures de stock',
    "Une rupture de stock, c'est une vente perdue. Un client qui ne trouve pas ce qu'il cherche, c'est un client qui part — et souvent qui ne revient pas.",
    [
      "Pas d'alerte avant qu'il soit trop tard",
      "Mauvaise estimation des besoins",
      "Oublis lors des commandes fournisseurs",
      "Manque de temps pour surveiller chaque produit"
    ],
    "PONIA surveille chaque produit en temps réel et vous alerte AVANT la rupture. Vous avez le temps de réagir et de commander. Résultat : zéro vente perdue."
  );

  doc.addPage();
  addPageHeader(doc, '1.2 Les problèmes que PONIA résout (suite)', iconPath);

  addProblemSection(doc, 120, 'Le temps perdu en gestion',
    "Un commerçant passe en moyenne 7 à 10 heures par semaine sur des tâches administratives : compter les stocks, préparer les commandes, vérifier les dates, appeler les fournisseurs.",
    [
      "Processus manuels (papier, Excel)",
      "Multiples allers-retours avec les fournisseurs",
      "Vérifications répétitives",
      "Pas d'outil adapté aux métiers alimentaires"
    ],
    "PONIA automatise tout ce qui peut l'être. Une commande fournisseur ? 30 secondes au lieu de 30 minutes. Résultat : 7 heures par semaine libérées."
  );

  // 1.3 Mission
  doc.addPage();
  addPageHeader(doc, '1.3 Notre mission', iconPath);

  doc.fillColor(COLORS.yellow).rect(50, 120, 495, 80).fill();
  doc.fillColor(COLORS.black).fontSize(18).font('Helvetica-Bold')
    .text("Démocratiser l'IA pour les petits commerces.", 70, 145, { width: 455 });

  addParagraph(doc, 230,
    "Les grandes enseignes ont des équipes entières dédiées à l'optimisation des stocks. Les TPE n'ont ni le temps, ni le budget, ni les compétences pour ça."
  );

  addParagraph(doc, 300,
    "PONIA donne aux boulangeries de quartier, aux restaurants familiaux et aux bars indépendants les mêmes armes que les grands groupes — à un prix accessible et avec une simplicité d'utilisation totale."
  );

  // 1.4 Pourquoi l'IA
  addPageHeader(doc, "1.4 Pourquoi l'IA change tout", iconPath, 420);

  doc.fillColor(COLORS.black).fontSize(11).font('Helvetica-Bold')
    .text("Ce que l'IA apporte :", 50, 460);

  const aiAdvantages = [
    "Analyse en temps réel de milliers de données (ventes, météo, saisons)",
    "Prédictions fiables basées sur votre historique réel",
    "Conversation naturelle : pas besoin de formation",
    "Apprentissage continu : plus vous utilisez PONIA, plus il devient précis"
  ];

  aiAdvantages.forEach((adv, i) => {
    doc.fillColor(COLORS.green).fontSize(10).text('✓', 60, 485 + i * 22);
    doc.fillColor(COLORS.black).fontSize(10).font('Helvetica').text(adv, 80, 485 + i * 22);
  });

  // ============ PARTIE 2 : FONCTIONNALITÉS ============
  doc.addPage();
  addPartTitle(doc, 'PARTIE 2', 'FONCTIONNALITÉS', iconPath);

  // 2.1 PONIA Chat
  doc.addPage();
  addPageHeader(doc, "2.1 PONIA Chat — L'IA conversationnelle", iconPath);

  addParagraph(doc, 120,
    "PONIA Chat est une interface de conversation où vous posez vos questions en langage naturel. Pas de menus compliqués, pas de formations, pas de mode d'emploi. Vous écrivez comme vous parleriez à un collègue."
  );

  doc.fillColor(COLORS.black).fontSize(12).font('Helvetica-Bold')
    .text("Exemples de questions :", 50, 200);

  const chatExamples = [
    { cat: "Gestion des commandes", q: '"Qu\'est-ce que je dois commander pour ce week-end ?"' },
    { cat: "", q: '"Prépare ma commande boulanger pour jeudi matin"' },
    { cat: "Analyse et prédictions", q: '"Quels produits risquent la rupture cette semaine ?"' },
    { cat: "", q: '"Quel est mon produit le plus rentable ce mois-ci ?"' },
    { cat: "Opérationnel", q: '"Quels produits arrivent à péremption dans les 3 jours ?"' },
    { cat: "", q: '"Combien j\'ai vendu de croissants le mois dernier ?"' }
  ];

  let exY = 225;
  chatExamples.forEach(ex => {
    if (ex.cat) {
      doc.fillColor(COLORS.yellow).fontSize(10).font('Helvetica-Bold').text(ex.cat, 60, exY);
      exY += 18;
    }
    doc.fillColor(COLORS.mediumGray).fontSize(10).font('Helvetica').text('→ ' + ex.q, 70, exY);
    exY += 20;
  });

  addHighlightBox(doc, 400,
    "Disponibilité : 24h/24, 7j/7 • Sur mobile et ordinateur • En français"
  );

  // 2.2 Alertes prédictives
  doc.addPage();
  addPageHeader(doc, '2.2 Alertes prédictives intelligentes', iconPath);

  doc.fillColor(COLORS.black).fontSize(12).font('Helvetica-Bold')
    .text("Trois types d'alertes :", 50, 120);

  const alerts = [
    { color: COLORS.red, title: 'Alerte Rupture', desc: "PONIA détecte qu'un produit va tomber en rupture avant que ça n'arrive. Vous recevez une notification avec le temps restant estimé." },
    { color: COLORS.orange, title: 'Alerte Péremption', desc: "Les produits qui approchent de leur date limite sont signalés automatiquement. Vous pouvez agir : promotion, utilisation prioritaire, don." },
    { color: COLORS.yellow, title: 'Alerte Surstock', desc: "Trop de stock = argent immobilisé + risque de perte. PONIA vous alerte quand un produit stagne et vous suggère des actions." }
  ];

  let alertY = 150;
  alerts.forEach(alert => {
    doc.fillColor(alert.color).rect(50, alertY, 8, 60).fill();
    doc.fillColor(COLORS.black).fontSize(11).font('Helvetica-Bold').text(alert.title, 70, alertY + 5);
    doc.fillColor(COLORS.mediumGray).fontSize(10).font('Helvetica').text(alert.desc, 70, alertY + 22, { width: 460 });
    alertY += 75;
  });

  doc.fillColor(COLORS.black).fontSize(12).font('Helvetica-Bold')
    .text("Comment sont calculées les alertes :", 50, 390);

  const factors = [
    "Votre historique de ventes (patterns quotidiens, hebdomadaires, mensuels)",
    "La météo locale (un jour de pluie = moins de passage)",
    "La saisonnalité (vacances, fêtes, événements locaux)",
    "Vos seuils personnalisés par produit"
  ];

  factors.forEach((f, i) => {
    doc.fillColor(COLORS.yellow).fontSize(10).text('●', 60, 420 + i * 20);
    doc.fillColor(COLORS.black).fontSize(10).font('Helvetica').text(f, 80, 420 + i * 20);
  });

  // 2.3 Commandes auto
  doc.addPage();
  addPageHeader(doc, '2.3 Génération automatique des commandes', iconPath);

  doc.fillColor(COLORS.black).fontSize(12).font('Helvetica-Bold')
    .text("Le problème classique :", 50, 120);

  addParagraph(doc, 140,
    "Préparer une commande fournisseur prend du temps : regarder ce qu'il reste, estimer les besoins, écrire la liste, l'envoyer... Temps moyen : 30 à 45 minutes par commande."
  );

  doc.fillColor(COLORS.black).fontSize(12).font('Helvetica-Bold')
    .text("La solution PONIA :", 50, 220);

  doc.fillColor(COLORS.yellow).rect(50, 245, 495, 100).fill();
  doc.fillColor(COLORS.black).fontSize(11).font('Helvetica')
    .text('Vous dites : "Prépare ma commande boulanger pour lundi"', 70, 260);
  doc.fontSize(10).text('PONIA :', 70, 285);
  doc.text('1. Analyse vos ventes prévues pour la semaine', 80, 300);
  doc.text('2. Vérifie votre stock actuel', 80, 315);
  doc.text('3. Calcule les quantités optimales', 80, 330);
  doc.text('4. Génère un PDF professionnel prêt à envoyer', 80, 345);

  doc.fillColor(COLORS.green).fontSize(14).font('Helvetica-Bold')
    .text("Temps avec PONIA : 30 secondes", 50, 380);

  doc.fillColor(COLORS.black).fontSize(11).font('Helvetica-Bold')
    .text("Le PDF inclut :", 50, 420);

  const pdfContents = [
    "Nom du fournisseur",
    "Liste des produits avec quantités",
    "Date de livraison souhaitée",
    "Vos coordonnées"
  ];

  pdfContents.forEach((c, i) => {
    doc.fillColor(COLORS.black).fontSize(10).font('Helvetica').text('• ' + c, 60, 445 + i * 18);
  });

  // 2.4 Connexion caisses
  doc.addPage();
  addPageHeader(doc, '2.4 Connexion aux caisses enregistreuses', iconPath);

  doc.fillColor(COLORS.black).fontSize(12).font('Helvetica-Bold')
    .text("Intégrations disponibles :", 50, 120);

  const integrations = [
    { name: 'Lightspeed Restaurant', status: '✓ Disponible', sync: 'Temps réel' },
    { name: 'Square', status: '✓ Disponible', sync: 'Temps réel' },
    { name: 'Zettle (PayPal)', status: '✓ Disponible', sync: 'Temps réel' },
    { name: 'SumUp / Tiller', status: '✓ Disponible', sync: 'Temps réel' },
    { name: 'Hiboutik', status: '✓ Disponible', sync: 'Temps réel' }
  ];

  doc.fillColor(COLORS.lightGray).rect(50, 145, 495, 25).fill();
  doc.fillColor(COLORS.black).fontSize(10).font('Helvetica-Bold')
    .text('Caisse', 60, 152)
    .text('Statut', 250, 152)
    .text('Synchronisation', 400, 152);

  integrations.forEach((int, i) => {
    const y = 175 + i * 25;
    if (i % 2 === 0) doc.fillColor('#fafafa').rect(50, y - 3, 495, 25).fill();
    doc.fillColor(COLORS.black).fontSize(10).font('Helvetica').text(int.name, 60, y);
    doc.fillColor(COLORS.green).text(int.status, 250, y);
    doc.fillColor(COLORS.black).text(int.sync, 400, y);
  });

  doc.fillColor(COLORS.black).fontSize(11).font('Helvetica-Bold')
    .text("Avantages de la connexion :", 50, 320);

  const connAdvantages = [
    "Les ventes remontent automatiquement",
    "Stock mis à jour en temps réel",
    "Prédictions plus précises",
    "Zéro saisie manuelle"
  ];

  connAdvantages.forEach((a, i) => {
    doc.fillColor(COLORS.green).fontSize(10).text('✓', 60, 345 + i * 20);
    doc.fillColor(COLORS.black).fontSize(10).font('Helvetica').text(a, 80, 345 + i * 20);
  });

  // 2.5 Dashboard
  doc.addPage();
  addPageHeader(doc, '2.5 Tableau de bord et analytics', iconPath);

  doc.fillColor(COLORS.black).fontSize(12).font('Helvetica-Bold')
    .text("Vue d'ensemble instantanée :", 50, 120);

  addParagraph(doc, 140,
    "Dès l'ouverture de PONIA, vous voyez : la santé du stock (score global), les alertes actives, le temps économisé cette semaine, et les économies réalisées en euros."
  );

  doc.fillColor(COLORS.black).fontSize(11).font('Helvetica-Bold')
    .text("Graphiques et tendances :", 50, 220);

  const dashFeatures = [
    "Évolution des ventes par produit",
    "Comparaison semaine/mois précédent",
    "Produits les plus vendus",
    "Produits à surveiller",
    "Export PDF pour votre comptable"
  ];

  dashFeatures.forEach((f, i) => {
    doc.fillColor(COLORS.yellow).fontSize(10).text('●', 60, 245 + i * 22);
    doc.fillColor(COLORS.black).fontSize(10).font('Helvetica').text(f, 80, 245 + i * 22);
  });

  // 2.6 Multi-établissements
  addPageHeader(doc, '2.6 Multi-établissements (Plan Pro)', iconPath, 380);

  doc.fillColor(COLORS.black).fontSize(11).font('Helvetica')
    .text("Pour les commerçants avec plusieurs points de vente :", 50, 420);

  const multiFeatures = [
    "Vue consolidée de tous vos établissements",
    "Alertes par établissement",
    "Comparaison des performances",
    "Transferts de stock suggérés entre sites",
    "Un seul compte, une seule interface, tous vos commerces"
  ];

  multiFeatures.forEach((f, i) => {
    doc.fillColor(COLORS.green).fontSize(10).text('✓', 60, 450 + i * 20);
    doc.fillColor(COLORS.black).fontSize(10).font('Helvetica').text(f, 80, 450 + i * 20);
  });

  // 2.7 Mobile-first
  doc.addPage();
  addPageHeader(doc, '2.7 Interface mobile-first', iconPath);

  addParagraph(doc, 120,
    "PONIA a été pensé pour être utilisé pendant le service, entre deux clients, dans la réserve. Pas besoin d'être assis devant un ordinateur."
  );

  doc.fillColor(COLORS.black).fontSize(11).font('Helvetica-Bold')
    .text("Caractéristiques :", 50, 190);

  const mobileFeatures = [
    "Boutons larges, faciles à toucher",
    "Chargement ultra-rapide",
    "Fonctionne en 4G/5G",
    "Optimisé pour tous les smartphones"
  ];

  mobileFeatures.forEach((f, i) => {
    doc.fillColor(COLORS.yellow).fontSize(10).text('●', 60, 215 + i * 22);
    doc.fillColor(COLORS.black).fontSize(10).font('Helvetica').text(f, 80, 215 + i * 22);
  });

  doc.fillColor(COLORS.yellow).rect(50, 310, 495, 50).fill();
  doc.fillColor(COLORS.black).fontSize(14).font('Helvetica-Bold')
    .text("Temps d'utilisation quotidien : 2 minutes maximum", 70, 325, { width: 455 });

  // ============ PARTIE 3 : TARIFS ============
  doc.addPage();
  addPartTitle(doc, 'PARTIE 3', 'TARIFS', iconPath);

  // 3.1 Offres
  doc.addPage();
  addPageHeader(doc, '3.1 Nos offres', iconPath);

  // Pricing table
  const plans = [
    { name: 'BASIQUE', monthly: 'Gratuit', annual: 'Gratuit', color: COLORS.mediumGray },
    { name: 'STANDARD', monthly: '49€/mois', annual: '39€/mois', color: COLORS.yellow },
    { name: 'PRO', monthly: '69€/mois', annual: '55€/mois', color: COLORS.black }
  ];

  let planX = 50;
  plans.forEach(plan => {
    doc.fillColor(plan.color).rect(planX, 120, 160, 40).fill();
    doc.fillColor(plan.color === COLORS.black ? COLORS.yellow : COLORS.black)
      .fontSize(14).font('Helvetica-Bold').text(plan.name, planX, 133, { width: 160, align: 'center' });

    doc.fillColor(COLORS.lightGray).rect(planX, 160, 160, 80).fill();
    doc.fillColor(COLORS.black).fontSize(11).font('Helvetica-Bold')
      .text(plan.monthly, planX, 175, { width: 160, align: 'center' });
    doc.fillColor(COLORS.mediumGray).fontSize(9).font('Helvetica')
      .text('ou', planX, 195, { width: 160, align: 'center' })
      .text(plan.annual + ' (annuel)', planX, 210, { width: 160, align: 'center' });

    planX += 170;
  });

  // Features comparison
  const features = [
    { name: 'Établissements', basique: '1', standard: '1', pro: 'Illimité' },
    { name: 'Produits', basique: '50 max', standard: 'Illimité', pro: 'Illimité' },
    { name: 'PONIA Chat', basique: '✓', standard: '✓', pro: '✓' },
    { name: 'Alertes prédictives', basique: 'Basiques', standard: '7 jours', pro: '30 jours' },
    { name: 'Commandes auto', basique: '—', standard: '✓', pro: '✓' },
    { name: 'Connexion caisse', basique: '—', standard: '✓', pro: '✓' },
    { name: 'Support', basique: 'FAQ', standard: 'Email 48h', pro: 'Prioritaire 24h' }
  ];

  let featY = 260;
  features.forEach((f, i) => {
    if (i % 2 === 0) doc.fillColor('#fafafa').rect(50, featY - 3, 495, 25).fill();
    doc.fillColor(COLORS.black).fontSize(10).font('Helvetica').text(f.name, 60, featY);
    doc.text(f.basique, 130, featY, { width: 160, align: 'center' });
    doc.text(f.standard, 300, featY, { width: 160, align: 'center' });
    doc.fillColor(COLORS.black).font('Helvetica-Bold').text(f.pro, 470, featY, { width: 75, align: 'center' });
    featY += 28;
  });

  // 3.2 Essai gratuit
  doc.addPage();
  addPageHeader(doc, '3.2 Essai gratuit', iconPath);

  doc.fillColor(COLORS.yellow).rect(50, 120, 495, 80).fill();
  doc.fillColor(COLORS.black).fontSize(18).font('Helvetica-Bold')
    .text("14 jours d'essai gratuit", 70, 135);
  doc.fontSize(12).font('Helvetica')
    .text("sur les plans Standard et Pro", 70, 160);

  const trialFeatures = [
    "Aucune carte bancaire requise",
    "Accès complet à toutes les fonctionnalités",
    "Données conservées si vous passez payant",
    "Annulation en un clic"
  ];

  trialFeatures.forEach((f, i) => {
    doc.fillColor(COLORS.green).fontSize(11).text('✓', 60, 230 + i * 25);
    doc.fillColor(COLORS.black).fontSize(11).font('Helvetica').text(f, 85, 230 + i * 25);
  });

  // 3.3 ROI
  addPageHeader(doc, '3.3 Retour sur investissement', iconPath, 360);

  doc.fillColor(COLORS.black).fontSize(11).font('Helvetica-Bold')
    .text("Le plan Standard à 49€/mois est rentabilisé si vous évitez :", 50, 400);

  const roiExamples = [
    "1 produit gaspillé par semaine (~12€)",
    "OU 1 rupture de stock par semaine (~15€ de vente perdue)",
    "OU 1 heure de gestion économisée (~15€ de temps)"
  ];

  roiExamples.forEach((r, i) => {
    doc.fillColor(COLORS.yellow).fontSize(10).text('●', 60, 430 + i * 22);
    doc.fillColor(COLORS.black).fontSize(10).font('Helvetica').text(r, 80, 430 + i * 22);
  });

  doc.fillColor(COLORS.green).rect(50, 510, 495, 40).fill();
  doc.fillColor(COLORS.white).fontSize(12).font('Helvetica-Bold')
    .text("En moyenne, nos clients récupèrent 3 à 5 fois leur abonnement", 70, 522, { width: 455 });

  // ============ BACK COVER ============
  doc.addPage();
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(COLORS.black);

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 150, 280, { width: 280 });
  }

  doc.fillColor(COLORS.white).fontSize(16).font('Helvetica')
    .text("www.myponia.fr", 0, 400, { align: 'center' });

  doc.fillColor(COLORS.mediumGray).fontSize(11)
    .text("L'IA qui révolutionne la gestion des commerces alimentaires", 0, 440, { align: 'center' });

  doc.fillColor(COLORS.yellow).fontSize(12).font('Helvetica-Bold')
    .text("Essai gratuit 14 jours", 0, 500, { align: 'center' });

  // Finalize
  doc.end();

  writeStream.on('finish', () => {
    console.log('PDF generated successfully:', outputPath);
  });
}

function addPageHeader(doc, title, iconPath, yPos = 50) {
  if (fs.existsSync(iconPath)) {
    doc.image(iconPath, 50, yPos, { width: 30 });
  }
  doc.fillColor(COLORS.black).fontSize(18).font('Helvetica-Bold')
    .text(title, 90, yPos + 5);
  doc.moveTo(50, yPos + 35).lineTo(545, yPos + 35).strokeColor(COLORS.yellow).lineWidth(2).stroke();
}

function addPartTitle(doc, partNum, partTitle, iconPath) {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(COLORS.black);

  if (fs.existsSync(iconPath)) {
    doc.image(iconPath, 230, 200, { width: 80 });
  }

  doc.fillColor(COLORS.yellow).fontSize(24).font('Helvetica-Bold')
    .text(partNum, 0, 320, { align: 'center' });

  doc.fillColor(COLORS.white).fontSize(36).font('Helvetica-Bold')
    .text(partTitle, 0, 360, { align: 'center' });
}

function addParagraph(doc, y, text) {
  doc.fillColor(COLORS.black).fontSize(11).font('Helvetica')
    .text(text, 50, y, { width: 495, lineGap: 4 });
}

function addHighlightBox(doc, y, text) {
  doc.fillColor(COLORS.yellow).rect(50, y, 495, 50).fill();
  doc.fillColor(COLORS.black).fontSize(11).font('Helvetica-Bold')
    .text(text, 70, y + 15, { width: 455 });
}

function addProblemSection(doc, y, title, reality, causes, solution) {
  doc.fillColor(COLORS.red).fontSize(14).font('Helvetica-Bold')
    .text('❌ ' + title, 50, y);

  doc.fillColor(COLORS.black).fontSize(10).font('Helvetica-Bold')
    .text("La réalité :", 50, y + 30);
  doc.fillColor(COLORS.mediumGray).fontSize(10).font('Helvetica')
    .text(reality, 50, y + 45, { width: 495 });

  doc.fillColor(COLORS.black).fontSize(10).font('Helvetica-Bold')
    .text("Les causes :", 50, y + 90);

  causes.forEach((c, i) => {
    doc.fillColor(COLORS.mediumGray).fontSize(9).font('Helvetica')
      .text('• ' + c, 60, y + 108 + i * 15);
  });

  const solY = y + 108 + causes.length * 15 + 15;
  doc.fillColor(COLORS.green).fontSize(10).font('Helvetica-Bold')
    .text("✓ La solution PONIA :", 50, solY);
  doc.fillColor(COLORS.black).fontSize(10).font('Helvetica')
    .text(solution, 50, solY + 15, { width: 495 });
}

createGuidePDF();
