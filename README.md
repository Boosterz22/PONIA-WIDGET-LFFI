# 💰 PONIA - Cross-Chain Payment Widget

**Ultra-fast crypto deposits for Web3 gaming & gambling platforms**

---

## 🚀 **Quick Start**

### **For Casinos (5 minutes setup)**

1. **Copy this code** into your deposit page:

```html
<iframe 
  src="https://ponia-widget.replit.dev?chain=polygon&token=usdc&lang=en" 
  width="450" 
  height="700"
  style="border: none; border-radius: 16px;"
></iframe>
```

2. **Done!** Your users can now deposit from any chain to your platform.

📖 **Full integration guide:** See `INTEGRATION_GUIDE.md`

---

## ✨ **Features**

### **💵 Stablecoins Support**
- ✅ USDC (all chains)
- ✅ USDT (all chains)
- ✅ Native tokens (ETH, POL, BNB)

**Why stablecoins?**
- No volatility ($100 = always $100)
- Bigger transaction volumes
- Stable PONIA fees (1.5% of a stable amount)

### **🎨 White-Label Customization**
- Customize colors to match your brand
- Add your casino logo
- Custom button styles and border radius
- Your users see YOUR brand, not ours

**Example themes:**
- `theme=default` - PONIA yellow
- `theme=stake` - Stake green
- `theme=rollbit` - Rollbit purple
- `theme=YOUR_CASINO` - Contact us for custom theme

### **🌍 Multi-Language**
Auto-detects user's browser language or force specific:

- 🇬🇧 English (`lang=en`)
- 🇫🇷 Français (`lang=fr`)
- 🇪🇸 Español (`lang=es`)
- 🇧🇷 Português (`lang=pt`)
- 🇨🇳 中文 (`lang=zh`)

---

## 🔧 **Technical Stack**

- **Wallet Connection:** Reown AppKit (300+ wallets)
- **Bridging:** Across Protocol (1-3 min transfers)
- **Supported Chains:** Ethereum, Polygon, BNB Chain, Arbitrum
- **Revenue Model:** 1.5% fee per transaction

---

## 📊 **Configuration Parameters**

| Parameter | Description | Example Values |
|-----------|-------------|----------------|
| `chain` | Destination blockchain | `polygon`, `ethereum`, `bsc`, `arbitrum` |
| `token` | Token to use | `native`, `usdc`, `usdt` |
| `lang` | Interface language | `en`, `fr`, `es`, `pt`, `zh` |
| `theme` | Visual theme | `default`, `stake`, `rollbit` |
| `casino` | Your casino ID (analytics) | `mycasino123` |

### **Example URLs:**

**USDC deposits to Polygon (English):**
```
https://ponia-widget.replit.dev?chain=polygon&token=usdc&lang=en
```

**Custom theme + Spanish:**
```
https://ponia-widget.replit.dev?chain=polygon&theme=mycasino&lang=es
```

**With analytics tracking:**
```
https://ponia-widget.replit.dev?chain=polygon&casino=mycasino&token=usdc
```

---

## 💼 **For Developers**

### **Project Structure**
```
/
├── index.html           # Widget UI (3-stage flow)
├── main.js              # Core logic (Across + AppKit)
├── config.js            # White-label & i18n config
├── package.json         # Dependencies
├── INTEGRATION_GUIDE.md # Full integration docs
└── examples/
    └── casino-integration.html  # Live demo
```

### **Local Development**
```bash
npm install
npm run dev
```

### **Build for Production**
```bash
npm run build
```

---

## 📈 **Pricing**

**1.5% fee per transaction**

**Examples:**
- $100 USDC deposit → $1.50 PONIA fee
- $1,000 USDC deposit → $15 PONIA fee
- 0.1 ETH deposit (~$300) → ~$4.50 PONIA fee

**No setup fees. No monthly fees. Pay only on successful transactions.**

---

## 🎯 **Use Cases**

✅ **Crypto Casinos** - Fast deposits from any chain
✅ **NFT Gaming** - Cross-chain item purchases
✅ **Prediction Markets** - USDC deposits from anywhere
✅ **DeFi Platforms** - Universal onboarding
✅ **Web3 Apps** - Accept payments from any blockchain

---

## 📞 **Support**

- 📧 Email: support@ponia.xyz
- 💬 Discord: discord.gg/ponia
- 📖 Docs: Full guide in `INTEGRATION_GUIDE.md`

**Response time: < 24h**

---

## 🚀 **Deployment**

### **Deploy on Replit**
1. Click "Deploy" button
2. Choose "Autoscale" deployment
3. Done! Your widget is live with a public URL

### **Custom Domain**
Contact us to set up your custom domain (e.g., `widget.yourcasino.com`)

---

## 📝 **License**

Proprietary - Contact us for licensing options

---

**Built with ❤️ for the Web3 gaming community**

**Ready in 5 minutes. Growing your revenue from day 1.** 💰
