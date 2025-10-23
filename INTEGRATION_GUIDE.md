# 🚀 PONIA Widget - Guide d'Intégration

## 📦 **Méthode 1 : Iframe Simple (Recommandé)**

### **Intégration basique**
```html
<iframe 
  src="https://ponia-widget.replit.dev?chain=polygon" 
  width="450" 
  height="700"
  style="border: none; border-radius: 16px;"
></iframe>
```

### **Paramètres disponibles**

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| `chain` | Chaîne de destination | `polygon`, `ethereum`, `bsc`, `arbitrum` |
| `token` | Token à utiliser | `native`, `usdc`, `usdt` |
| `theme` | Thème personnalisé | `default`, `casino1`, `stake` |
| `lang` | Langue | `en`, `fr`, `es`, `pt`, `zh` |
| `casino` | ID du casino (analytics) | `mycasino` |

### **Exemples d'URLs**

**Configuration standard :**
```
https://ponia-widget.replit.dev?chain=polygon&token=usdc&lang=en
```

**White-label personnalisé :**
```
https://ponia-widget.replit.dev?chain=polygon&theme=stake&lang=es
```

**Avec analytics :**
```
https://ponia-widget.replit.dev?chain=polygon&casino=mycasino&lang=fr
```

---

## 🎨 **White-Label : Personnalisation**

### **Créer votre thème personnalisé**

1. **Contactez PONIA** avec vos couleurs :
   - Couleur primaire (ex: `#FF6B6B`)
   - Logo (texte ou URL image)
   - Nom de votre casino
   - Radius des bordures (optionnel)

2. **Nous créons votre thème** → vous recevez votre `themeId`

3. **Utilisez votre thème :**
```html
<iframe 
  src="https://ponia-widget.replit.dev?chain=polygon&theme=VOTRE_THEME_ID" 
  width="450" 
  height="700"
></iframe>
```

### **Exemple de thème personnalisé**

**Casino "Stake" (vert) :**
```
https://ponia-widget.replit.dev?chain=polygon&theme=stake
```

---

## 🌍 **Multi-langue : Support International**

### **Langues supportées**
- 🇬🇧 **Anglais** (`en`) - Par défaut
- 🇫🇷 **Français** (`fr`)
- 🇪🇸 **Espagnol** (`es`)
- 🇧🇷 **Portugais** (`pt`)
- 🇨🇳 **Chinois** (`zh`)

### **Détection automatique**

Le widget détecte automatiquement la langue du navigateur de l'utilisateur.

### **Forcer une langue**

```html
<!-- En français -->
<iframe src="https://ponia-widget.replit.dev?chain=polygon&lang=fr"></iframe>

<!-- En espagnol -->
<iframe src="https://ponia-widget.replit.dev?chain=polygon&lang=es"></iframe>
```

---

## 💵 **Stablecoins : USDC & USDT**

### **Pourquoi utiliser des stablecoins ?**
- ✅ **Pas de volatilité** : $100 = toujours $100
- ✅ **Volumes plus gros** : Les joueurs préfèrent les stablecoins
- ✅ **Frais PONIA stables** : 1.5% de $1000 = $15 (toujours)

### **Activer USDC**

```html
<iframe 
  src="https://ponia-widget.replit.dev?chain=polygon&token=usdc" 
  width="450" 
  height="700"
></iframe>
```

### **Activer USDT**

```html
<iframe 
  src="https://ponia-widget.replit.dev?chain=polygon&token=usdt" 
  width="450" 
  height="700"
></iframe>
```

### **Laisser l'utilisateur choisir**

Si vous ne spécifiez pas `token=`, le widget affichera un sélecteur de tokens (Native ETH, USDC, USDT).

---

## 🎯 **Exemple Complet : Casino International**

```html
<!DOCTYPE html>
<html>
<head>
  <title>MyCasino - Deposit</title>
</head>
<body>
  <h1>Make a Deposit</h1>
  
  <!-- Widget PONIA personnalisé -->
  <div style="display: flex; justify-content: center; padding: 20px;">
    <iframe 
      src="https://ponia-widget.replit.dev?chain=polygon&token=usdc&theme=mycasino&lang=es&casino=mycasino_analytics" 
      width="450" 
      height="750"
      style="border: none; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);"
    ></iframe>
  </div>
  
  <p style="text-align: center; color: #888; font-size: 12px;">
    Powered by PONIA • Ultra-fast cross-chain deposits
  </p>
</body>
</html>
```

**Ce code affichera :**
- ✅ Destination : Polygon
- ✅ Token : USDC (stablecoin)
- ✅ Thème : Votre thème personnalisé
- ✅ Langue : Espagnol
- ✅ Analytics : Trackage sous "mycasino_analytics"

---

## 📊 **Tracking & Analytics**

Utilisez le paramètre `casino=VOTRE_ID` pour tracker vos transactions.

**Exemple :**
```
https://ponia-widget.replit.dev?chain=polygon&casino=mycasino
```

Vous recevrez :
- Dashboard avec vos volumes
- Nombre de transactions
- Revenus générés
- Tokens les plus utilisés

---

## 💰 **Tarification**

**Frais PONIA : 1.5% par transaction**

**Exemples :**
- Transaction de $100 USDC → Frais PONIA : $1.50
- Transaction de $1,000 USDC → Frais PONIA : $15
- Transaction de 0.1 ETH (~$300) → Frais PONIA : ~$4.50

**Aucun frais d'intégration. Vous ne payez que sur les transactions réussies.**

---

## 🆘 **Support**

**Questions ? Problèmes d'intégration ?**

- 📧 Email : support@ponia.xyz
- 💬 Discord : discord.gg/ponia
- 📖 Docs : docs.ponia.xyz

**Réponse sous 24h garantie** ✅

---

## 🚀 **Prêt à commencer ?**

1. Copiez le code iframe
2. Personnalisez les paramètres (chain, token, lang, theme)
3. Collez dans votre site
4. **C'est tout ! Ça marche déjà !** 🎉

**Temps d'intégration : 5 minutes** ⏱️
