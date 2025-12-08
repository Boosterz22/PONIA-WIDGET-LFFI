const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 55, right: 55 },
  bufferPages: true
});

const OUTPUT_PATH = path.join(__dirname, '../public/Contrat-Partenariat-Commercial-PONIA.pdf');
const LOGO_PATH = path.join(__dirname, '../attached_assets/IMG_3757_2_1765194934787.png');

const stream = fs.createWriteStream(OUTPUT_PATH);
doc.pipe(stream);

const COLORS = {
  primary: '#E5A835',
  dark: '#1a1a2e',
  text: '#333333',
  gray: '#666666'
};

const PAGE_WIDTH = 595.28;
const MARGIN = 55;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

let articleNum = 1;

function checkSpace(needed) {
  if (doc.y + needed > 780) {
    doc.addPage();
  }
}

function writeArticle(title) {
  checkSpace(60);
  doc.font('Helvetica-Bold')
     .fontSize(12)
     .fillColor(COLORS.dark)
     .text(`Article ${articleNum} – ${title}`, { align: 'left' });
  articleNum++;
  doc.moveDown(0.4);
}

function writePara(text) {
  checkSpace(40);
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor(COLORS.text)
     .text(text, { align: 'justify', lineGap: 2 });
  doc.moveDown(0.5);
}

function writeBullet(text) {
  checkSpace(20);
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor(COLORS.text)
     .text(`• ${text}`, { indent: 12, lineGap: 1 });
  doc.moveDown(0.2);
}

function writeSubtitle(text) {
  checkSpace(30);
  doc.font('Helvetica-Bold')
     .fontSize(10)
     .fillColor(COLORS.gray)
     .text(text);
  doc.moveDown(0.2);
}

// Header
if (fs.existsSync(LOGO_PATH)) {
  doc.image(LOGO_PATH, MARGIN, 35, { width: 100 });
}

doc.y = 90;

// Title
doc.font('Helvetica-Bold')
   .fontSize(18)
   .fillColor(COLORS.dark)
   .text('CONTRAT DE PARTENARIAT COMMERCIAL', { align: 'center' });

doc.moveDown(0.3);

doc.font('Helvetica')
   .fontSize(10)
   .fillColor(COLORS.gray)
   .text('Agent Commercial Indépendant', { align: 'center' });

doc.moveDown(0.8);

// Date
const today = new Date();
const dateStr = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
doc.font('Helvetica')
   .fontSize(10)
   .fillColor(COLORS.text)
   .text(`Fait à Paris, le ${dateStr}`, { align: 'right' });

doc.moveDown(1);

// PARTIES
doc.font('Helvetica-Bold')
   .fontSize(12)
   .fillColor(COLORS.primary)
   .text('ENTRE LES SOUSSIGNÉS', { align: 'center' });

doc.moveDown(0.8);

// Mandant
writeSubtitle('LE MANDANT :');
writePara(
  'Monsieur Enock LIGUE, entrepreneur individuel exerçant sous le nom commercial PONIA, ' +
  'immatriculé sous le SIREN 994 452 266, SIRET 994 452 266 00012, Code APE 5829C, ' +
  'dont le siège social est situé au 42 Boulevard Vincent Auriol, 75013 Paris, France, ' +
  'immatriculé au Registre National des Entreprises depuis le 28 novembre 2025.'
);
writePara('Ci-après dénommé « PONIA » ou « le Mandant »,');

// Partenaire
writeSubtitle('LE PARTENAIRE :');
writePara(
  'Monsieur Pierre LOMONDAIS, demeurant à __________________________________, ' +
  'né le ________________, SIRET : ________________ (à compléter dès obtention).'
);
writePara('Ci-après dénommé « le Partenaire » ou « l\'Agent Commercial »,');
writePara('Ci-après dénommés ensemble « les Parties ».');

doc.moveDown(0.5);

// PREAMBULE
doc.font('Helvetica-Bold')
   .fontSize(11)
   .fillColor(COLORS.primary)
   .text('PRÉAMBULE', { align: 'center' });

doc.moveDown(0.5);

writePara(
  'PONIA est une solution logicielle innovante de gestion de stock assistée par intelligence artificielle, ' +
  'destinée aux commerces alimentaires (boulangeries, restaurants, bars, caves à vin, fromageries). ' +
  'Le Mandant souhaite développer sa clientèle en France et recherche des partenaires commerciaux motivés ' +
  'pour représenter et promouvoir ses services.'
);

writePara(
  'Le Partenaire déclare avoir les compétences commerciales nécessaires et souhaite collaborer avec PONIA ' +
  'en qualité d\'agent commercial indépendant.'
);

doc.moveDown(0.3);

doc.font('Helvetica-Bold')
   .fontSize(10)
   .fillColor(COLORS.dark)
   .text('IL A ÉTÉ CONVENU CE QUI SUIT :', { align: 'center' });

doc.moveDown(0.8);

// ARTICLE 1
writeArticle('OBJET DU CONTRAT');
writePara(
  'Le Mandant confie au Partenaire, qui accepte, la mission de prospecter, présenter et promouvoir ' +
  'les services PONIA auprès des commerces alimentaires sur le territoire français. ' +
  'Le Partenaire agit en qualité d\'agent commercial indépendant au sens des articles L.134-1 et suivants du Code de commerce.'
);

// ARTICLE 2
writeArticle('MISSIONS DU PARTENAIRE');
writePara('Dans le cadre de sa mission, le Partenaire s\'engage à :');
writeBullet('Identifier et prospecter des commerces alimentaires susceptibles d\'être intéressés par PONIA');
writeBullet('Présenter et faire la démonstration de la solution PONIA');
writeBullet('Accompagner les prospects dans leur inscription et leur prise en main');
writeBullet('Remonter les retours clients et les opportunités d\'amélioration au Mandant');
writeBullet('Représenter PONIA de manière professionnelle et éthique');
doc.moveDown(0.3);

// ARTICLE 3
writeArticle('DURÉE DU CONTRAT');
writePara(
  'Le présent contrat est conclu pour une durée initiale d\'un (1) mois à compter de sa signature. ' +
  'À l\'issue de cette période, les Parties pourront convenir d\'un renouvellement par accord mutuel.'
);

// ARTICLE 4
writeArticle('RÉMUNÉRATION');

writeSubtitle('4.1 Commission');
writePara(
  'Le Partenaire perçoit une commission de vingt-cinq pour cent (25%) du montant hors taxes ' +
  'de chaque abonnement souscrit par un client qu\'il a apporté. Cette commission est récurrente ' +
  'et versée tant que le client reste abonné à PONIA.'
);

writeSubtitle('4.2 Prime de performance');
writePara(
  'Si le Partenaire atteint l\'objectif de sept (7) clients payants sur un mois calendaire, ' +
  'une prime exceptionnelle de quatre-vingt-cinq euros (85 €) lui sera versée en complément de ses commissions.'
);

writeSubtitle('4.3 Modalités de paiement');
writePara(
  'Les commissions sont versées immédiatement à chaque nouvelle souscription client validée. ' +
  'Le Partenaire recevra le paiement par virement bancaire sur le compte qu\'il aura communiqué au Mandant.'
);

// ARTICLE 5
writeArticle('CONDITIONS RELATIVES AU SIRET');
writePara(
  'Le Partenaire s\'engage à effectuer les démarches nécessaires pour obtenir son numéro SIRET ' +
  'dans un délai raisonnable d\'un (1) mois suivant la signature du présent contrat.'
);
writePara(
  'Pendant la période d\'attente du SIRET, le Partenaire peut exercer pleinement ses activités ' +
  'de prospection et de démonstration. Les commissions générées durant cette période seront ' +
  'comptabilisées et versées dès réception et communication du numéro SIRET au Mandant.'
);
writePara(
  'Le Partenaire communiquera son numéro SIRET au Mandant dès son obtention, accompagné d\'un RIB ' +
  'pour permettre le versement des commissions.'
);

// ARTICLE 6
writeArticle('OUTILS ET SUPPORTS FOURNIS');
writePara('Le Mandant met à disposition du Partenaire :');
writeBullet('Un accès de démonstration à l\'application PONIA');
writeBullet('Un code parrain unique permettant de tracer les clients apportés');
writeBullet('Le guide commercial complet de PONIA (PDF)');
writeBullet('Les supports de présentation et argumentaires de vente');
doc.moveDown(0.2);
writePara('Ces outils restent la propriété exclusive de PONIA et doivent être restitués en cas de fin de contrat.');

// ARTICLE 7
writeArticle('INDÉPENDANCE DU PARTENAIRE');
writePara(
  'Le Partenaire exerce son activité en toute indépendance. Il organise librement son travail, ' +
  'ses horaires et ses méthodes de prospection. Il n\'existe aucun lien de subordination entre les Parties. ' +
  'Le Partenaire est seul responsable de ses obligations fiscales et sociales liées à son statut d\'indépendant.'
);

// ARTICLE 8
writeArticle('OBLIGATIONS DU PARTENAIRE');
writePara('Le Partenaire s\'engage à :');
writeBullet('Respecter les tarifs officiels communiqués par PONIA');
writeBullet('Ne pas accorder de remises ou conditions particulières sans accord préalable du Mandant');
writeBullet('Informer régulièrement le Mandant de l\'avancement de ses démarches commerciales');
writeBullet('Agir avec loyauté et bonne foi dans l\'exécution du présent contrat');
doc.moveDown(0.3);

// ARTICLE 9
writeArticle('CONFIDENTIALITÉ');
writePara(
  'Le Partenaire s\'engage à garder strictement confidentielles toutes les informations ' +
  'auxquelles il aura accès dans le cadre de sa mission, et notamment :'
);
writeBullet('Le concept, les méthodes et le fonctionnement de PONIA');
writeBullet('Les stratégies commerciales, tarifaires et marketing');
writeBullet('Les données relatives aux clients et prospects');
writeBullet('Le code source, les algorithmes et le savoir-faire technique');
writeBullet('Les informations financières et les projets de développement');
doc.moveDown(0.2);

writePara(
  'Cette obligation de confidentialité perdure pendant toute la durée du contrat ' +
  'et pendant une période de deux (2) ans après sa cessation, quelle qu\'en soit la cause.'
);

writePara(
  'Le Partenaire s\'interdit formellement de reproduire, copier ou s\'inspirer du concept PONIA ' +
  'pour créer ou participer à la création d\'un service concurrent, directement ou indirectement.'
);

writeSubtitle('Sanctions');
writePara(
  'Toute violation de la présente clause de confidentialité entraînera la résiliation immédiate ' +
  'du contrat et pourra donner lieu au versement de dommages et intérêts dont le montant minimum ' +
  'est fixé à cinq mille euros (5 000 €), sans préjudice de tout autre recours légal.'
);

// ARTICLE 10
writeArticle('RÉSILIATION');
writePara(
  'Chaque Partie peut mettre fin au présent contrat à tout moment, sous réserve de respecter ' +
  'un préavis de sept (7) jours notifié par écrit (email ou courrier).'
);
writePara(
  'En cas de manquement grave de l\'une des Parties à ses obligations, notamment en cas de ' +
  'violation de la clause de confidentialité, le contrat pourra être résilié sans préavis.'
);
writePara(
  'La résiliation du contrat ne remet pas en cause le droit du Partenaire aux commissions ' +
  'acquises pour les clients déjà souscrits, tant que ces clients restent abonnés.'
);

// ARTICLE 11
writeArticle('DISPOSITIONS GÉNÉRALES');

writeSubtitle('11.1 Droit applicable');
writePara('Le présent contrat est soumis au droit français.');

writeSubtitle('11.2 Litiges');
writePara(
  'En cas de litige relatif à l\'interprétation ou à l\'exécution du présent contrat, ' +
  'les Parties s\'efforceront de trouver une solution amiable. À défaut, le litige sera ' +
  'soumis aux tribunaux compétents de Paris.'
);

writeSubtitle('11.3 Intégralité');
writePara(
  'Le présent contrat constitue l\'intégralité de l\'accord entre les Parties et remplace ' +
  'tout accord antérieur, écrit ou verbal, portant sur le même objet.'
);

doc.moveDown(1);

// Signatures
checkSpace(200);

doc.font('Helvetica-Bold')
   .fontSize(12)
   .fillColor(COLORS.dark)
   .text('SIGNATURES', { align: 'center' });

doc.moveDown(0.8);

writePara(`Fait en deux exemplaires originaux, à Paris, le ${dateStr}.`);

doc.moveDown(1);

// Two columns
const colWidth = (CONTENT_WIDTH - 30) / 2;
const startY = doc.y;

doc.font('Helvetica-Bold')
   .fontSize(10)
   .fillColor(COLORS.dark);

doc.text('LE MANDANT', MARGIN, startY);
doc.text('LE PARTENAIRE', MARGIN + colWidth + 30, startY);

doc.font('Helvetica')
   .fontSize(9)
   .fillColor(COLORS.text);

doc.text('Monsieur Enock LIGUE', MARGIN, startY + 15);
doc.text('Monsieur Pierre LOMONDAIS', MARGIN + colWidth + 30, startY + 15);

doc.text('PONIA', MARGIN, startY + 26);

doc.text('Signature précédée de la mention', MARGIN, startY + 45);
doc.text('Signature précédée de la mention', MARGIN + colWidth + 30, startY + 45);

doc.text('« Lu et approuvé »', MARGIN, startY + 56);
doc.text('« Lu et approuvé »', MARGIN + colWidth + 30, startY + 56);

// Signature boxes
doc.rect(MARGIN, startY + 75, colWidth, 60).stroke(COLORS.gray);
doc.rect(MARGIN + colWidth + 30, startY + 75, colWidth, 60).stroke(COLORS.gray);

doc.y = startY + 150;

doc.moveDown(1);

// Paraphe
doc.font('Helvetica-Oblique')
   .fontSize(8)
   .fillColor(COLORS.gray)
   .text('Paraphe de chaque page : _____ / _____', { align: 'center' });

doc.moveDown(1.5);

// Annexes
doc.font('Helvetica-Bold')
   .fontSize(10)
   .fillColor(COLORS.dark)
   .text('ANNEXES', { align: 'center' });

doc.moveDown(0.5);

doc.font('Helvetica')
   .fontSize(9)
   .fillColor(COLORS.text);

writeBullet('Annexe 1 : Grille tarifaire PONIA en vigueur');
writeBullet('Annexe 2 : Code parrain attribué au Partenaire');
writeBullet('Annexe 3 : RIB du Partenaire (à fournir)');

doc.end();

stream.on('finish', () => {
  console.log('Contrat PDF généré avec succès :', OUTPUT_PATH);
});
