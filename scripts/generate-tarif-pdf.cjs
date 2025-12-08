const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 40, right: 40 },
  bufferPages: true
});

const OUTPUT_PATH = path.join(__dirname, '../public/Fiche-Tarifs-PONIA.pdf');
const LOGO_PATH = path.join(__dirname, '../attached_assets/IMG_3757_2_1765194934787.png');

const stream = fs.createWriteStream(OUTPUT_PATH);
doc.pipe(stream);

const COLORS = {
  primary: '#E5A835',
  dark: '#1a1a2e',
  text: '#333333',
  gray: '#666666',
  lightGray: '#f5f5f5',
  green: '#22C55E',
  white: '#ffffff'
};

const PAGE_WIDTH = 595.28;
const MARGIN = 40;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

if (fs.existsSync(LOGO_PATH)) {
  doc.image(LOGO_PATH, MARGIN, 30, { width: 120 });
}

doc.font('Helvetica-Bold')
   .fontSize(22)
   .fillColor(COLORS.dark)
   .text('Grille Tarifaire PONIA', PAGE_WIDTH / 2 - 50, 45, { width: 250 });

doc.font('Helvetica')
   .fontSize(10)
   .fillColor(COLORS.gray)
   .text('Effective au 1er decembre 2024', PAGE_WIDTH / 2 - 50, 70, { width: 250 });

doc.moveDown(4);
doc.y = 110;

doc.font('Helvetica-Bold')
   .fontSize(14)
   .fillColor(COLORS.primary)
   .text('3 formules adaptees a vos besoins', MARGIN, doc.y, { align: 'center', width: CONTENT_WIDTH });

doc.moveDown(1.5);

const COL_WIDTH = (CONTENT_WIDTH - 20) / 3;
const START_Y = doc.y;

function drawPlanBox(x, y, plan) {
  const boxHeight = 380;
  
  doc.roundedRect(x, y, COL_WIDTH, boxHeight, 8)
     .fill(plan.highlight ? COLORS.primary : COLORS.lightGray);
  
  if (plan.highlight) {
    doc.font('Helvetica-Bold')
       .fontSize(9)
       .fillColor(COLORS.dark)
       .text('RECOMMANDE', x, y + 8, { width: COL_WIDTH, align: 'center' });
  }
  
  const headerY = plan.highlight ? y + 25 : y + 15;
  
  doc.font('Helvetica-Bold')
     .fontSize(16)
     .fillColor(plan.highlight ? COLORS.dark : COLORS.dark)
     .text(plan.name, x, headerY, { width: COL_WIDTH, align: 'center' });
  
  doc.font('Helvetica-Bold')
     .fontSize(28)
     .fillColor(plan.highlight ? COLORS.dark : COLORS.primary)
     .text(plan.price, x, headerY + 25, { width: COL_WIDTH, align: 'center' });
  
  doc.font('Helvetica')
     .fontSize(9)
     .fillColor(plan.highlight ? COLORS.dark : COLORS.gray)
     .text(plan.priceNote, x, headerY + 55, { width: COL_WIDTH, align: 'center' });
  
  let featureY = headerY + 80;
  
  plan.features.forEach((feature, index) => {
    const isIncluded = !feature.startsWith('X ');
    const text = feature.replace('X ', '');
    
    doc.font('Helvetica')
       .fontSize(9)
       .fillColor(isIncluded ? (plan.highlight ? COLORS.dark : COLORS.text) : '#999999');
    
    const icon = isIncluded ? '✓' : '✗';
    doc.fillColor(isIncluded ? COLORS.green : '#cc0000')
       .text(icon, x + 10, featureY);
    
    doc.fillColor(isIncluded ? (plan.highlight ? COLORS.dark : COLORS.text) : '#999999')
       .text(text, x + 25, featureY, { width: COL_WIDTH - 35 });
    
    featureY += 18;
  });
  
  const btnY = y + boxHeight - 45;
  const btnWidth = COL_WIDTH - 30;
  const btnX = x + 15;
  
  doc.roundedRect(btnX, btnY, btnWidth, 30, 5)
     .fill(plan.highlight ? COLORS.dark : COLORS.primary);
  
  doc.font('Helvetica-Bold')
     .fontSize(10)
     .fillColor(COLORS.white)
     .text(plan.cta, btnX, btnY + 10, { width: btnWidth, align: 'center' });
}

const plans = [
  {
    name: 'Basique',
    price: '0€',
    priceNote: 'Gratuit pour toujours',
    highlight: false,
    cta: 'Commencer gratuit',
    features: [
      '10 produits maximum',
      '1 etablissement',
      'Chat IA (5 msg/jour)',
      'Alertes simples',
      'Tableau de bord',
      'X Integrations caisses',
      'X Predictions avancees',
      'X Commandes vocales',
      'X Support client'
    ]
  },
  {
    name: 'Standard',
    price: '49€',
    priceNote: '/mois ou 39€/mois en annuel',
    highlight: false,
    cta: 'Essai 14 jours gratuit',
    features: [
      '50 produits',
      '2 etablissements',
      'Chat IA ILLIMITE',
      'Predictions 7 jours',
      'Alertes intelligentes',
      'Generation commandes',
      'Integrations caisses',
      'Export CSV/PDF',
      'Support email'
    ]
  },
  {
    name: 'Pro',
    price: '69€',
    priceNote: '/mois ou 55€/mois en annuel',
    highlight: true,
    cta: 'Essai 14 jours gratuit',
    features: [
      'Produits ILLIMITES',
      'Etablissements illimites',
      'Chat IA ILLIMITE',
      'Predictions 30 jours',
      'COMMANDES VOCALES',
      'Analyse meteo/events',
      'Transferts inter-sites',
      'Rapports personnalises',
      'Support PRIORITAIRE'
    ]
  }
];

drawPlanBox(MARGIN, START_Y, plans[0]);
drawPlanBox(MARGIN + COL_WIDTH + 10, START_Y, plans[1]);
drawPlanBox(MARGIN + (COL_WIDTH + 10) * 2, START_Y, plans[2]);

doc.y = START_Y + 400;

doc.font('Helvetica-Bold')
   .fontSize(12)
   .fillColor(COLORS.primary)
   .text('Pourquoi choisir PONIA ?', MARGIN, doc.y, { align: 'center', width: CONTENT_WIDTH });

doc.moveDown(0.8);

const benefits = [
  { icon: '⏱️', text: '7h/semaine economisees sur la gestion des stocks' },
  { icon: '💰', text: '20-30% de gaspillage en moins des le 1er mois' },
  { icon: '🚫', text: 'Zero rupture de stock grace aux predictions IA' },
  { icon: '📱', text: '2 minutes/jour suffisent pour tout gerer' }
];

let benefitY = doc.y;
const benefitColWidth = CONTENT_WIDTH / 2;

benefits.forEach((benefit, index) => {
  const col = index % 2;
  const row = Math.floor(index / 2);
  const x = MARGIN + (col * benefitColWidth);
  const y = benefitY + (row * 25);
  
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor(COLORS.text)
     .text(`${benefit.icon} ${benefit.text}`, x, y, { width: benefitColWidth - 10 });
});

doc.y = benefitY + 60;

doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 50)
   .fill(COLORS.dark);

doc.font('Helvetica-Bold')
   .fontSize(12)
   .fillColor(COLORS.white)
   .text('Essai gratuit 14 jours - Sans engagement - Sans carte bancaire', MARGIN, doc.y + 12, { width: CONTENT_WIDTH, align: 'center' });

doc.font('Helvetica-Bold')
   .fontSize(14)
   .fillColor(COLORS.primary)
   .text('myponia.fr', MARGIN, doc.y + 30, { width: CONTENT_WIDTH, align: 'center' });

doc.y += 70;

doc.font('Helvetica')
   .fontSize(8)
   .fillColor(COLORS.gray)
   .text('PONIA - Enock Ligue, Auto-entrepreneur | SIREN 994 452 266 | 42 Boulevard Vincent Auriol, 75013 Paris', MARGIN, doc.y, { width: CONTENT_WIDTH, align: 'center' });

doc.text('Contact : contact@myponia.fr | Support Pro : poniapro@proton.me', MARGIN, doc.y + 12, { width: CONTENT_WIDTH, align: 'center' });

doc.end();

stream.on('finish', () => {
  console.log('Fiche tarifaire PDF generee :', OUTPUT_PATH);
});
