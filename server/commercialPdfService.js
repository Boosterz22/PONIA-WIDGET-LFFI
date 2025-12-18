import PDFDocument from 'pdfkit'

export function generateCommercialKitPDF() {
  const doc = new PDFDocument({ 
    size: 'A4',
    margin: 40,
    autoFirstPage: true
  })

  const GOLD = '#FFD700'
  const DARK = '#1F2937'
  const GRAY = '#6B7280'
  const GREEN = '#10B981'
  const RED = '#DC2626'
  const BLUE = '#3B82F6'

  const tableLeft = 40
  const tableWidth = 515
  const pageHeight = 842

  // ===============================================
  // PAGE 1 - FICHE PRODUIT
  // ===============================================
  
  doc.rect(0, 0, 595, 120).fill('#1a1a1a')
  doc.fontSize(28).fillColor(GOLD).font('Helvetica-Bold').text('PONIA', tableLeft, 35)
  doc.fontSize(12).fillColor('#fff').font('Helvetica').text('Kit Commercial Terrain', tableLeft, 70)
  doc.fontSize(10).fillColor(GRAY).text('Document confidentiel - Usage interne uniquement', tableLeft, 90)

  let y = 140

  doc.fontSize(18).fillColor(DARK).font('Helvetica-Bold').text('1. FICHE PRODUIT', tableLeft, y)
  y += 30

  doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text('Qu\'est-ce que PONIA ?', tableLeft, y)
  y += 18
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
     .text('PONIA est une application de gestion de stock intelligente avec IA, conçue pour les commerces alimentaires (boulangeries, restaurants, bars, caves à vin, fromageries). L\'application permet de gérer les stocks en temps réel, recevoir des alertes automatiques et optimiser les commandes grâce à l\'intelligence artificielle.', tableLeft, y, { width: tableWidth, lineGap: 3 })
  y += 60

  doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text('Pour plus de détails : Consultez le Guide PONIA de A à Z fourni séparément.', tableLeft, y)
  y += 35

  // Les 3 plans
  doc.fontSize(14).fillColor(DARK).font('Helvetica-Bold').text('LES 3 PLANS', tableLeft, y)
  y += 20

  const planWidth = (tableWidth - 20) / 3
  
  // Plan Basique
  doc.roundedRect(tableLeft, y, planWidth, 120, 6).fillAndStroke('#f9fafb', '#e5e7eb')
  doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold').text('BASIQUE', tableLeft + 10, y + 12)
  doc.fontSize(18).fillColor(GRAY).font('Helvetica-Bold').text('0€', tableLeft + 10, y + 32)
  doc.fontSize(8).fillColor(GRAY).font('Helvetica')
     .text('• 10 produits max', tableLeft + 10, y + 58)
     .text('• 5 messages IA/jour', tableLeft + 10, y + 70)
     .text('• Alertes basiques', tableLeft + 10, y + 82)
     .text('• Pas de caisse', tableLeft + 10, y + 94)

  // Plan Standard (recommandé)
  const stdX = tableLeft + planWidth + 10
  doc.roundedRect(stdX, y - 5, planWidth, 130, 6).fillAndStroke('#FEF3C7', GOLD)
  doc.fontSize(8).fillColor('#92400E').font('Helvetica-Bold').text('RECOMMANDE', stdX + 10, y + 2)
  doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold').text('STANDARD', stdX + 10, y + 17)
  doc.fontSize(18).fillColor(GOLD).font('Helvetica-Bold').text('49€/mois', stdX + 10, y + 37)
  doc.fontSize(8).fillColor(DARK).font('Helvetica')
     .text('• 100 produits', stdX + 10, y + 63)
     .text('• IA illimitée', stdX + 10, y + 75)
     .text('• Connexion caisse', stdX + 10, y + 87)
     .text('• Prédictions 7 jours', stdX + 10, y + 99)

  // Plan Pro
  const proX = stdX + planWidth + 10
  doc.roundedRect(proX, y, planWidth, 120, 6).fillAndStroke('#1a1a1a', '#1a1a1a')
  doc.fontSize(12).fillColor(GOLD).font('Helvetica-Bold').text('PRO', proX + 10, y + 12)
  doc.fontSize(18).fillColor('#fff').font('Helvetica-Bold').text('69€/mois', proX + 10, y + 32)
  doc.fontSize(8).fillColor('#d1d5db').font('Helvetica')
     .text('• Produits illimités', proX + 10, y + 58)
     .text('• Commandes vocales', proX + 10, y + 70)
     .text('• Support prioritaire', proX + 10, y + 82)
     .text('• Prédictions 30 jours', proX + 10, y + 94)

  y += 140

  // Caisses supportées
  doc.fontSize(14).fillColor(DARK).font('Helvetica-Bold').text('CAISSES SUPPORTEES', tableLeft, y)
  y += 18
  doc.fontSize(10).fillColor(GREEN).font('Helvetica-Bold')
     .text('✓ SumUp / Tiller    ✓ Zettle (PayPal)    ✓ Square    ✓ Hiboutik', tableLeft, y)
  y += 25

  doc.fontSize(10).fillColor(RED).font('Helvetica-Bold').text('CAISSE NON SUPPORTEE ?', tableLeft, y)
  y += 15
  doc.fontSize(9).fillColor(GRAY).font('Helvetica')
     .text('1. Notez le nom exact de la caisse du client', tableLeft, y)
  y += 12
  doc.text('2. Dites au client : "Je vérifie la compatibilité et je reviens demain pour finaliser"', tableLeft, y)
  y += 12
  doc.text('3. Envoyez le nom de la caisse à votre responsable immédiatement', tableLeft, y)
  y += 30

  // Arguments clés
  doc.fontSize(14).fillColor(DARK).font('Helvetica-Bold').text('ARGUMENTS CLES', tableLeft, y)
  y += 18
  
  const args = [
    ['⏱️ Gain de temps', 'Économisez 7h/semaine sur la gestion des stocks'],
    ['🤖 IA intégrée', 'L\'assistant vous dit quoi commander et quand'],
    ['📱 100% mobile', 'Fonctionne sur votre téléphone, pas besoin de PC'],
    ['🔄 Synchronisation caisse', 'Vos ventes mettent à jour le stock automatiquement'],
    ['⚠️ Alertes intelligentes', 'Soyez prévenu avant la rupture ou la péremption'],
    ['💰 ROI immédiat', 'Rentabilisé dès le 1er mois (réduction gaspillage)']
  ]

  args.forEach(([title, desc]) => {
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text(title, tableLeft, y)
    doc.fontSize(9).fillColor(GRAY).font('Helvetica').text(desc, tableLeft + 120, y)
    y += 16
  })

  // ===============================================
  // PAGE 2 - SCRIPT TERRAIN
  // ===============================================
  doc.addPage()
  y = 40

  doc.rect(0, 0, 595, 80).fill('#1a1a1a')
  doc.fontSize(20).fillColor(GOLD).font('Helvetica-Bold').text('2. SCRIPT DE PROSPECTION TERRAIN', tableLeft, 25)
  doc.fontSize(10).fillColor('#d1d5db').text('Adaptez ce script à votre style - l\'essentiel est la relation humaine', tableLeft, 52)

  y = 100

  // Phase 1 - Approche
  doc.roundedRect(tableLeft, y, tableWidth, 95, 6).stroke(BLUE)
  doc.fontSize(12).fillColor(BLUE).font('Helvetica-Bold').text('PHASE 1 : APPROCHE (30 secondes)', tableLeft + 10, y + 10)
  doc.fontSize(9).fillColor(DARK).font('Helvetica')
     .text('Entrez dans le commerce avec le sourire. Attendez que le commerçant soit disponible.', tableLeft + 10, y + 30, { width: tableWidth - 20 })
  doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold')
     .text('"Bonjour ! Je suis [Prénom] de PONIA. On aide les [boulangeries/restaurants/bars] à ne plus perdre de temps sur les stocks. Vous avez 2 minutes ?"', tableLeft + 10, y + 50, { width: tableWidth - 20 })
  y += 110

  // Phase 2 - Découverte
  doc.roundedRect(tableLeft, y, tableWidth, 130, 6).stroke(GREEN)
  doc.fontSize(12).fillColor(GREEN).font('Helvetica-Bold').text('PHASE 2 : DECOUVERTE (2 minutes)', tableLeft + 10, y + 10)
  doc.fontSize(9).fillColor(DARK).font('Helvetica').text('Questions pour comprendre ses douleurs :', tableLeft + 10, y + 28)
  doc.fontSize(9).fillColor(GRAY).font('Helvetica')
     .text('• "Vous faites vos inventaires comment aujourd\'hui ? À la main ?"', tableLeft + 10, y + 44)
     .text('• "Ça vous prend combien de temps par semaine ?"', tableLeft + 10, y + 58)
     .text('• "Vous avez déjà eu des ruptures de stock sur un produit qui se vend bien ?"', tableLeft + 10, y + 72)
     .text('• "Et des produits jetés parce que périmés ?"', tableLeft + 10, y + 86)
     .text('• "Quelle caisse vous utilisez ?" (Notez le nom si pas dans la liste)', tableLeft + 10, y + 100)
  y += 145

  // Phase 3 - Démonstration
  doc.roundedRect(tableLeft, y, tableWidth, 115, 6).stroke(GOLD)
  doc.fontSize(12).fillColor('#B8860B').font('Helvetica-Bold').text('PHASE 3 : DEMONSTRATION (2 minutes)', tableLeft + 10, y + 10)
  doc.fontSize(9).fillColor(DARK).font('Helvetica')
     .text('Sortez votre téléphone et montrez l\'application :', tableLeft + 10, y + 28)
  doc.fontSize(9).fillColor(GRAY).font('Helvetica')
     .text('• Montrez le tableau de bord avec les alertes', tableLeft + 10, y + 44)
     .text('• Montrez le Chat IA : "Regardez, je peux lui demander quoi commander cette semaine"', tableLeft + 10, y + 58)
     .text('• Montrez la page stocks : "Tout est visuel, en un coup d\'œil vous voyez ce qui manque"', tableLeft + 10, y + 72)
  doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold')
     .text('"Avec ça, vous gagnez 7h par semaine. C\'est 7h de plus avec vos clients ou votre famille."', tableLeft + 10, y + 92)
  y += 130

  // Phase 4 - Closing
  doc.roundedRect(tableLeft, y, tableWidth, 130, 6).stroke(RED)
  doc.fontSize(12).fillColor(RED).font('Helvetica-Bold').text('PHASE 4 : CLOSING', tableLeft + 10, y + 10)
  doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold')
     .text('"On a un essai gratuit de 14 jours, sans engagement. Vous voulez qu\'on vous inscrive maintenant ?"', tableLeft + 10, y + 30, { width: tableWidth - 20 })
  doc.fontSize(9).fillColor(GRAY).font('Helvetica')
     .text('SI OUI : Aidez-le à s\'inscrire sur son téléphone avec votre code commercial', tableLeft + 10, y + 55)
     .text('SI NON : "Pas de souci, je vous laisse ma carte. Le site c\'est myponia.fr"', tableLeft + 10, y + 70)
     .text('SI CAISSE NON SUPPORTÉE : "Je vérifie la compatibilité et je repasse demain !"', tableLeft + 10, y + 85)
  doc.fontSize(9).fillColor(GREEN).font('Helvetica-Bold')
     .text('IMPORTANT : Donnez toujours votre code commercial pour que le client s\'inscrive avec !', tableLeft + 10, y + 105, { width: tableWidth - 20 })

  // ===============================================
  // PAGE 3 - OBJECTIONS + COMMISSIONS
  // ===============================================
  doc.addPage()
  y = 40

  doc.fontSize(16).fillColor(DARK).font('Helvetica-Bold').text('3. REPONSES AUX OBJECTIONS', tableLeft, y)
  y += 25

  const objections = [
    ['"C\'est trop cher"', '"49€/mois, c\'est 1,60€/jour. Moins qu\'un café. Et vous récupérez 7h/semaine. C\'est un investissement qui se rembourse tout seul."'],
    ['"J\'ai pas le temps"', '"Justement, PONIA vous FAIT gagner du temps. L\'inscription prend 2 minutes, et après c\'est automatique."'],
    ['"Je gère déjà bien mes stocks"', '"Super ! PONIA va vous faire gagner encore plus de temps et vous alerter automatiquement avant les ruptures."'],
    ['"Je vais réfléchir"', '"Bien sûr. En attendant, essayez gratuitement 14 jours. Si ça vous plaît pas, vous arrêtez. Simple."'],
    ['"Ma caisse n\'est pas compatible"', '"Je note le nom et je vérifie. Je repasse demain vous confirmer. Souvent on peut quand même vous aider."']
  ]

  objections.forEach(([obj, rep]) => {
    doc.roundedRect(tableLeft, y, tableWidth, 50, 4).fillAndStroke('#fef3c7', GOLD)
    doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text(obj, tableLeft + 10, y + 8, { width: tableWidth - 20 })
    doc.fontSize(9).fillColor(GRAY).font('Helvetica').text(rep, tableLeft + 10, y + 24, { width: tableWidth - 20, lineGap: 2 })
    y += 58
  })

  y += 20

  // Grille de commissionnement
  doc.fontSize(16).fillColor(DARK).font('Helvetica-Bold').text('4. GRILLE DE COMMISSIONNEMENT', tableLeft, y)
  y += 25

  doc.roundedRect(tableLeft, y, tableWidth, 180, 8).fillAndStroke('#f0fdf4', GREEN)
  
  doc.fontSize(12).fillColor(GREEN).font('Helvetica-Bold').text('VOTRE REMUNERATION', tableLeft + 15, y + 15)
  y += 35

  doc.fontSize(24).fillColor(DARK).font('Helvetica-Bold').text('35%', tableLeft + 15, y)
  doc.fontSize(12).fillColor(GRAY).font('Helvetica').text('de commission sur chaque vente payante', tableLeft + 70, y + 8)
  y += 35

  doc.fontSize(10).fillColor(DARK).font('Helvetica')
     .text('• Plan Standard (49€) → Vous gagnez : 17,15€', tableLeft + 15, y)
  y += 18
  doc.text('• Plan Pro (69€) → Vous gagnez : 24,15€', tableLeft + 15, y)
  y += 25

  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
     .text('La commission est versée une seule fois, quand le client souscrit après sa période d\'essai gratuit de 14 jours.', tableLeft + 15, y, { width: tableWidth - 30 })
  y += 35

  doc.roundedRect(tableLeft + 15, y, tableWidth - 30, 40, 6).fillAndStroke(GOLD, GOLD)
  doc.fontSize(11).fillColor('#1a1a1a').font('Helvetica-Bold')
     .text('PRIME BONUS : +100€ si 7 clients payants dans le mois !', tableLeft + 25, y + 13, { align: 'center', width: tableWidth - 50 })

  y += 60

  // Rappel dashboard
  doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold').text('SUIVI DE VOS VENTES', tableLeft, y)
  y += 18
  doc.fontSize(10).fillColor(GRAY).font('Helvetica')
     .text('Connectez-vous à votre Dashboard Commercial sur myponia.fr/commercial avec votre code personnel pour suivre en temps réel :', tableLeft, y, { width: tableWidth })
  y += 30
  doc.fontSize(9).fillColor(DARK).font('Helvetica')
     .text('• Nombre de clients inscrits avec votre code', tableLeft + 15, y)
  y += 14
  doc.text('• Nombre de clients ayant souscrit (payants)', tableLeft + 15, y)
  y += 14
  doc.text('• Votre commission en cours', tableLeft + 15, y)
  y += 14
  doc.text('• Progression vers la prime mensuelle', tableLeft + 15, y)

  // Footer
  doc.fontSize(8).fillColor(GRAY).font('Helvetica')
     .text('Document généré par PONIA - myponia.fr - Confidentiel', tableLeft, pageHeight - 50)

  return doc
}
