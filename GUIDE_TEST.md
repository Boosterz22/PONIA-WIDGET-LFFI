# 🧪 Guide de Test PONIA AI

## Test rapide (2 minutes)

### 1. Créer un compte test
- Va sur `/login`
- Email : `test@boulangerie.fr`
- Commerce : `Ma Boulangerie Test`
- Type : `Boulangerie / Pâtisserie`
- Clique **"Commencer Gratuitement"**

### 2. Observer les produits pré-configurés
✅ Tu devrais voir 5 produits automatiques :
- Farine (50 kg)
- Beurre (30 kg)
- Œufs (200 pièces)
- Levure (15 sachets)
- Chocolat (20 kg)

### 3. Tester l'IA - Scénario Rupture Imminente 🔴

**Objectif** : Voir l'IA détecter une rupture urgente

1. **Trouve "Farine"** dans la liste
2. **Clique plusieurs fois sur "-10"** jusqu'à arriver à ~5 kg
3. **Scroll vers le haut** → Regarde le panel "🤖 PONIA AI"

**Ce que tu dois voir :**
- 🔴 Score santé : **~80%** (baisse car 1 produit critique)
- 🔴 **"URGENT : 1 produit en rupture imminente !"**
- 🔴 Action prioritaire : **"Commande urgente - Farine - Commandez AUJOURD'HUI"**
- Stats : **1 Rupture imminente** en rouge

### 4. Tester l'IA - Stock Parfait 🟢

1. **Clique "+10" sur Farine** pour remonter à 50 kg
2. **Vérifie tous les produits** sont au-dessus de leur seuil
3. **Regarde le panel IA**

**Ce que tu dois voir :**
- 🟢 Score santé : **100%**
- 🎉 **"Parfait ! Votre stock est bien géré."**
- Action : **"Votre gestion de stock est optimale"**
- Stats : **5 Stock OK** en vert

### 5. Tester l'IA - Stock Faible 🟠

1. **Sur "Beurre"**, descends à ~15 kg (proche du seuil)
2. **Regarde le panel IA**

**Ce que tu dois voir :**
- 🟠 Score santé : **~80%**
- 🟠 **"Attention : 1 produit en stock faible"**
- 🟠 Action : **"Planifier commande - Beurre - Commandez cette semaine"**

---

## Ce qui fonctionne maintenant ✅

### Navigation
- ✅ Logo cliquable ramène à l'accueil (landing page)
- ✅ Navigation fluide entre pages
- ✅ Déconnexion fonctionne

### IA PONIA
- ✅ **Score santé dynamique** (0-100%) selon état du stock
- ✅ **3 niveaux d'alerte** : 🟢 Parfait / 🟠 Attention / 🔴 Urgent
- ✅ **Actions prioritaires** : top 3 des choses à faire
- ✅ **Stats visuelles** : Rupture / Stock faible / Stock OK
- ✅ **Messages contextuels** selon gravité

### Plan Gratuit
- ✅ Maximum 10 produits
- ✅ Badge "GRATUIT" visible
- ✅ Code de parrainage généré (ex: TEST-BOUL42)
- ✅ Modal parrainage avec partage WhatsApp/Email
- ✅ CTA "Passer à Standard" partout

---

## Prochaine étape : Vrai test avec tes 2 commerces intéressés

**Tu peux maintenant leur montrer :**
1. Landing page pro (stats ROI, témoignages)
2. Inscription 30 secondes
3. Produits pré-configurés (gain de temps)
4. IA qui analyse en temps réel
5. Plan gratuit à vie pour tester

**Pitch rapide :**
> "Regarde, je te configure ça en 2 minutes.  
> Tu ajoutes ton stock une fois, ensuite tu updates en 30 secondes/jour.  
> L'IA te dit quand commander avant la rupture.  
> **Gratuit jusqu'à 10 produits**, après c'est 25€/mois.  
> Deal ?"
