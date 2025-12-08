const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 60, bottom: 60, left: 60, right: 60 }
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
const MARGIN = 60;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

let articleNum = 1;

function writeTitle(text) {
  doc.font('Helvetica-Bold')
     .fontSize(14)
     .fillColor(COLORS.dark)
     .text(`Article ${articleNum} - ${text}`, { align: 'left' });
  articleNum++;
  doc.moveDown(0.5);
}

function writeParagraph(text) {
  doc.font('Helvetica')
     .fontSize(11)
     .fillColor(COLORS.text)
     .text(text, { align: 'justify', lineGap: 3 });
  doc.moveDown(0.8);
}

function writeBullet(text) {
  doc.font('Helvetica')
     .fontSize(11)
     .fillColor(COLORS.text)
     .text(`• ${text}`, { indent: 15, lineGap: 2 });
  doc.moveDown(0.3);
}

function writeSubtitle(text) {
  doc.font('Helvetica-Bold')
     .fontSize(11)
     .fillColor(COLORS.gray)
     .text(text);
  doc.moveDown(0.3);
}

// Header with logo
if (fs.existsSync(LOGO_PATH)) {
  doc.image(LOGO_PATH, MARGIN, 40, { width: 120 });
}

doc.moveDown(4);

// Main title
doc.font('Helvetica-Bold')
   .fontSize(22)
   .fillColor(COLORS.dark)
   .text('CONTRAT DE PARTENARIAT COMMERCIAL', { align: 'center' });

doc.moveDown(0.5);

doc.font('Helvetica')
   .fontSize(12)
   .fillColor(COLORS.gray)
   .text('Agent Commercial Independant', { align: 'center' });

doc.moveDown(2);

// Date
const today = new Date();
const dateStr = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
doc.font('Helvetica')
   .fontSize(11)
   .fillColor(COLORS.text)
   .text(`Fait a Paris, le ${dateStr}`, { align: 'right' });

doc.moveDown(2);

// PARTIES
doc.font('Helvetica-Bold')
   .fontSize(14)
   .fillColor(COLORS.primary)
   .text('ENTRE LES SOUSSIGNES', { align: 'center' });

doc.moveDown(1.5);

// Mandant
writeSubtitle('LE MANDANT :');
writeParagraph(
  'Monsieur Enock LIGUE, entrepreneur individuel exerçant sous le nom commercial PONIA, ' +
  'immatricule sous le SIREN 994 452 266, SIRET 994 452 266 00012, Code APE 5829C, ' +
  'dont le siege social est situe au 42 Boulevard Vincent Auriol, 75013 Paris, France, ' +
  'immatricule au Registre National des Entreprises depuis le 28 novembre 2025.'
);

writeParagraph('Ci-apres denomme "PONIA" ou "le Mandant",');

doc.moveDown(0.5);

// Partenaire
writeSubtitle('LE PARTENAIRE :');
writeParagraph(
  'Monsieur Pierre LOMONDAIS, ' +
  'demeurant a __________________________________, ' +
  'ne le ________________, ' +
  'SIRET : ________________ (a completer des obtention).'
);

writeParagraph('Ci-apres denomme "le Partenaire" ou "l\'Agent Commercial",');

doc.moveDown(0.5);
writeParagraph('Ci-apres denommes ensemble "les Parties".');

doc.moveDown(1);

// PREAMBULE
doc.font('Helvetica-Bold')
   .fontSize(14)
   .fillColor(COLORS.primary)
   .text('PREAMBULE', { align: 'center' });

doc.moveDown(1);

writeParagraph(
  'PONIA est une solution logicielle innovante de gestion de stock assistee par intelligence artificielle, ' +
  'destinee aux commerces alimentaires (boulangeries, restaurants, bars, caves a vin, fromageries). ' +
  'Le Mandant souhaite developper sa clientele en France et recherche des partenaires commerciaux motives ' +
  'pour representer et promouvoir ses services.'
);

writeParagraph(
  'Le Partenaire declare avoir les competences commerciales necessaires et souhaite collaborer avec PONIA ' +
  'en qualite d\'agent commercial independant.'
);

doc.moveDown(1);

// IL A ETE CONVENU
doc.font('Helvetica-Bold')
   .fontSize(12)
   .fillColor(COLORS.dark)
   .text('IL A ETE CONVENU CE QUI SUIT :', { align: 'center' });

doc.moveDown(1.5);

// ARTICLE 1 - OBJET
writeTitle('OBJET DU CONTRAT');
writeParagraph(
  'Le Mandant confie au Partenaire, qui accepte, la mission de prospecter, presenter et promouvoir ' +
  'les services PONIA aupres des commerces alimentaires sur le territoire francais.'
);
writeParagraph('Le Partenaire agit en qualite d\'agent commercial independant au sens des articles L.134-1 et suivants du Code de commerce.');

// ARTICLE 2 - MISSIONS
writeTitle('MISSIONS DU PARTENAIRE');
writeParagraph('Dans le cadre de sa mission, le Partenaire s\'engage a :');
writeBullet('Identifier et prospecter des commerces alimentaires susceptibles d\'etre interesses par PONIA');
writeBullet('Presenter et faire la demonstration de la solution PONIA');
writeBullet('Accompagner les prospects dans leur inscription et leur prise en main');
writeBullet('Remonter les retours clients et les opportunites d\'amelioration au Mandant');
writeBullet('Representer PONIA de maniere professionnelle et ethique');
doc.moveDown(0.5);

// ARTICLE 3 - DUREE
writeTitle('DUREE DU CONTRAT');
writeParagraph(
  'Le present contrat est conclu pour une duree initiale d\'un (1) mois a compter de sa signature. ' +
  'A l\'issue de cette periode, les Parties pourront convenir d\'un renouvellement par accord mutuel.'
);

// New page
doc.addPage();

// ARTICLE 4 - REMUNERATION
writeTitle('REMUNERATION');

writeSubtitle('4.1 Commission');
writeParagraph(
  'Le Partenaire percoit une commission de vingt-cinq pour cent (25%) du montant hors taxes ' +
  'de chaque abonnement souscrit par un client qu\'il a apporte. Cette commission est recurrente ' +
  'et versee tant que le client reste abonne a PONIA.'
);

writeSubtitle('4.2 Prime de performance');
writeParagraph(
  'Si le Partenaire atteint l\'objectif de sept (7) clients payants sur un mois calendaire, ' +
  'une prime exceptionnelle de quatre-vingt-cinq euros (85€) lui sera versee en complement de ses commissions.'
);

writeSubtitle('4.3 Modalites de paiement');
writeParagraph(
  'Les commissions sont versees immediatement a chaque nouvelle souscription client validee. ' +
  'Le Partenaire recevra le paiement par virement bancaire sur le compte qu\'il aura communique au Mandant.'
);

// ARTICLE 5 - CONDITIONS SIRET
writeTitle('CONDITIONS RELATIVES AU SIRET');
writeParagraph(
  'Le Partenaire s\'engage a effectuer les demarches necessaires pour obtenir son numero SIRET ' +
  'dans un delai raisonnable d\'un (1) mois suivant la signature du present contrat.'
);
writeParagraph(
  'Pendant la periode d\'attente du SIRET, le Partenaire peut exercer pleinement ses activites ' +
  'de prospection et de demonstration. Les commissions generees durant cette periode seront ' +
  'comptabilisees et versees des reception et communication du numero SIRET au Mandant.'
);
writeParagraph(
  'Le Partenaire communiquera son numero SIRET au Mandant des son obtention, accompagne d\'un RIB ' +
  'pour permettre le versement des commissions.'
);

// ARTICLE 6 - OUTILS
writeTitle('OUTILS ET SUPPORTS FOURNIS');
writeParagraph('Le Mandant met a disposition du Partenaire :');
writeBullet('Un acces de demonstration a l\'application PONIA');
writeBullet('Un code parrain unique permettant de tracer les clients apportes');
writeBullet('Le guide commercial complet de PONIA (PDF)');
writeBullet('Les supports de presentation et argumentaires de vente');
doc.moveDown(0.5);
writeParagraph('Ces outils restent la propriete exclusive de PONIA et doivent etre restitues en cas de fin de contrat.');

// ARTICLE 7 - INDEPENDANCE
writeTitle('INDEPENDANCE DU PARTENAIRE');
writeParagraph(
  'Le Partenaire exerce son activite en toute independance. Il organise librement son travail, ' +
  'ses horaires et ses methodes de prospection. Il n\'existe aucun lien de subordination entre les Parties.'
);
writeParagraph(
  'Le Partenaire est seul responsable de ses obligations fiscales et sociales liees a son statut d\'independant.'
);

// ARTICLE 8 - OBLIGATIONS
writeTitle('OBLIGATIONS DU PARTENAIRE');
writeParagraph('Le Partenaire s\'engage a :');
writeBullet('Respecter les tarifs officiels communiques par PONIA');
writeBullet('Ne pas accorder de remises ou conditions particulieres sans accord prealable du Mandant');
writeBullet('Informer regulierement le Mandant de l\'avancement de ses demarches commerciales');
writeBullet('Agir avec loyaute et bonne foi dans l\'execution du present contrat');
doc.moveDown(0.5);

// New page
doc.addPage();

// ARTICLE 9 - CONFIDENTIALITE
writeTitle('CONFIDENTIALITE');

writeParagraph(
  'Le Partenaire s\'engage a garder strictement confidentielles toutes les informations ' +
  'auxquelles il aura acces dans le cadre de sa mission, et notamment :'
);
writeBullet('Le concept, les methodes et le fonctionnement de PONIA');
writeBullet('Les strategies commerciales, tarifaires et marketing');
writeBullet('Les donnees relatives aux clients et prospects');
writeBullet('Le code source, les algorithmes et le savoir-faire technique');
writeBullet('Les informations financieres et les projets de developpement');
doc.moveDown(0.5);

writeParagraph(
  'Cette obligation de confidentialite perdure pendant toute la duree du contrat ' +
  'et pendant une periode de deux (2) ans apres sa cessation, quelle qu\'en soit la cause.'
);

writeParagraph(
  'Le Partenaire s\'interdit formellement de reproduire, copier ou s\'inspirer du concept PONIA ' +
  'pour creer ou participer a la creation d\'un service concurrent, directement ou indirectement.'
);

writeSubtitle('Sanctions');
writeParagraph(
  'Toute violation de la presente clause de confidentialite entrainera la resiliation immediate ' +
  'du contrat et pourra donner lieu au versement de dommages et interets dont le montant minimum ' +
  'est fixe a cinq mille euros (5 000€), sans prejudice de tout autre recours legal.'
);

// ARTICLE 10 - RESILIATION
writeTitle('RESILIATION');
writeParagraph(
  'Chaque Partie peut mettre fin au present contrat a tout moment, sous reserve de respecter ' +
  'un preavis de sept (7) jours notifie par ecrit (email ou courrier).'
);
writeParagraph(
  'En cas de manquement grave de l\'une des Parties a ses obligations, notamment en cas de ' +
  'violation de la clause de confidentialite, le contrat pourra etre resilie sans preavis.'
);
writeParagraph(
  'La resiliation du contrat ne remet pas en cause le droit du Partenaire aux commissions ' +
  'acquises pour les clients deja souscrits, tant que ces clients restent abonnes.'
);

// ARTICLE 11 - DISPOSITIONS GENERALES
writeTitle('DISPOSITIONS GENERALES');

writeSubtitle('11.1 Droit applicable');
writeParagraph('Le present contrat est soumis au droit francais.');

writeSubtitle('11.2 Litiges');
writeParagraph(
  'En cas de litige relatif a l\'interpretation ou a l\'execution du present contrat, ' +
  'les Parties s\'efforceront de trouver une solution amiable. A defaut, le litige sera ' +
  'soumis aux tribunaux competents de Paris.'
);

writeSubtitle('11.3 Integralite');
writeParagraph(
  'Le present contrat constitue l\'integralite de l\'accord entre les Parties et remplace ' +
  'tout accord anterieur, ecrit ou verbal, portant sur le meme objet.'
);

// New page for signatures
doc.addPage();

// Signatures
doc.font('Helvetica-Bold')
   .fontSize(14)
   .fillColor(COLORS.dark)
   .text('SIGNATURES', { align: 'center' });

doc.moveDown(2);

writeParagraph(
  'Fait en deux exemplaires originaux, a Paris, le ' + dateStr + '.'
);

doc.moveDown(2);

// Two columns for signatures
const colWidth = (CONTENT_WIDTH - 40) / 2;

doc.font('Helvetica-Bold')
   .fontSize(12)
   .fillColor(COLORS.dark);

doc.text('LE MANDANT', MARGIN, doc.y);
doc.text('LE PARTENAIRE', MARGIN + colWidth + 40, doc.y - 14);

doc.moveDown(0.5);

doc.font('Helvetica')
   .fontSize(11)
   .fillColor(COLORS.text);

doc.text('Monsieur Enock LIGUE', MARGIN, doc.y);
doc.text('Monsieur Pierre LOMONDAIS', MARGIN + colWidth + 40, doc.y - 14);

doc.text('PONIA', MARGIN, doc.y + 5);

doc.moveDown(1);

doc.text('Signature precedee de la mention', MARGIN, doc.y);
doc.text('Signature precedee de la mention', MARGIN + colWidth + 40, doc.y - 14);

doc.text('"Lu et approuve"', MARGIN, doc.y + 3);
doc.text('"Lu et approuve"', MARGIN + colWidth + 40, doc.y - 11);

doc.moveDown(4);

// Signature boxes
doc.rect(MARGIN, doc.y, colWidth, 80).stroke(COLORS.gray);
doc.rect(MARGIN + colWidth + 40, doc.y, colWidth, 80).stroke(COLORS.gray);

doc.moveDown(8);

// Footer note
doc.font('Helvetica-Oblique')
   .fontSize(9)
   .fillColor(COLORS.gray)
   .text(
     'Paraphe de chaque page : _____ / _____',
     { align: 'center' }
   );

doc.moveDown(3);

// Annexes
doc.font('Helvetica-Bold')
   .fontSize(12)
   .fillColor(COLORS.dark)
   .text('ANNEXES', { align: 'center' });

doc.moveDown(1);

doc.font('Helvetica')
   .fontSize(10)
   .fillColor(COLORS.text);

writeBullet('Annexe 1 : Grille tarifaire PONIA en vigueur');
writeBullet('Annexe 2 : Code parrain attribue au Partenaire');
writeBullet('Annexe 3 : RIB du Partenaire (a fournir)');

doc.end();

stream.on('finish', () => {
  console.log('Contrat PDF genere avec succes :', OUTPUT_PATH);
});
