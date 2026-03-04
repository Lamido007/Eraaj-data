# 🚀 Eraaj-Data — VTU Fintech Platform

> **Fast • Cheap • Reliable** | Buy Data, Airtime & Pay Bills Instantly

🌍 **Live Website:** [lamido007.github.io/Eraaj-data](https://lamido007.github.io/Eraaj-data)

---

## 📱 What Is Eraaj-Data?

Eraaj-Data is a **Progressive Web App (PWA)** and **VTU (Value Top-Up) fintech platform** built for the Nigerian market. It allows users to purchase cheap mobile data, airtime, pay electricity bills, and subscribe to cable TV — all from their phone browser with no app download required.

---

## ✨ Features

### 👤 User Features
- 🔐 Secure registration and login (email & password)
- 💰 Wallet funding via Paystack payment gateway
- 📶 Buy Data — MTN, Airtel, Glo, 9mobile
- 📞 Buy Airtime — all major networks
- ⚡ Pay Electricity bills — 6 DISCOs supported
- 📺 Cable TV subscription
- 📊 Full transaction history with filters
- 🔑 4-digit PIN security on every purchase
- 🎁 Referral program — earn ₦50 per referral
- 🟢 WhatsApp share referral link
- 🌙 Dark mode
- 📲 Install as mobile app (PWA)
- 🔁 Forgot password via email reset

### ⚙️ Admin Features
- 📢 Post announcements to all users instantly
- 🚨 4 notice types: Info, Warning, Good News, Urgent
- 🗑️ Delete notices
- 📊 Live stats — transactions, revenue, notices
- 🎨 Background theme changer (9 options + custom upload)
- 💬 WhatsApp support integration

---

## 🛠️ Built With

| Technology | Purpose |
|---|---|
| **HTML5** | App structure and layout |
| **CSS3** | Styling, animations, dark mode |
| **JavaScript ES6+** | App logic, API calls, real-time updates |
| **Firebase Authentication** | Secure user login and registration |
| **Cloud Firestore** | NoSQL real-time cloud database |
| **Paystack API** | Payment processing |
| **Service Worker** | Offline support and PWA caching |
| **Web Manifest** | Mobile app installation |
| **Font Awesome 6** | Icons throughout the app |
| **GitHub Pages** | Free 24/7 hosting |

---

## 🏗️ Architecture

```
FRONTEND
├── Single Page Application (SPA)
├── 4 Pages: Home, Transactions, Wallet, Profile
├── Admin Panel (password protected)
└── PWA — installable on any Android phone

BACKEND (Firebase)
├── Authentication — login/register system
└── Firestore Database
    ├── /users — account balances and profiles
    ├── /transactions — full purchase history
    └── /notices — admin announcements

PAYMENTS
├── Paystack — wallet funding
└── VTU API — data/airtime delivery
```

---

## 🔐 Security

- Firebase Authentication with JWT tokens
- Firestore security rules — users only access their own data
- 4-digit PIN required for every transaction
- HTTPS enforced by GitHub Pages
- Admin panel hidden from regular users
- Domain-restricted Firebase access

---

## 💰 Business Model

| Service | Sell Price | Cost Price | Profit |
|---|---|---|---|
| MTN 1GB | ₦430 | ₦280 | ₦150 |
| MTN 2GB | ₦790 | ₦560 | ₦230 |
| MTN 5GB | ₦1,900 | ₦1,700 | ₦200 |
| Airtel 1GB | ₦400 | ₦350 | ₦50 |

---

## 📲 How to Install as App

1. Open **Google Chrome** on your Android phone
2. Visit [lamido007.github.io/Eraaj-data](https://lamido007.github.io/Eraaj-data)
3. Tap **"Install Free"** on the banner that appears
4. App icon appears on your home screen ✅

> ⚠️ Best experienced on **Google Chrome**. Opera Mini and MI Browser are not supported.

---

## 🚀 Getting Started (For Developers)

No installation needed! This is a pure HTML5/CSS3/JavaScript project.

1. Clone the repository:
```bash
git clone https://github.com/Lamido007/Eraaj-data.git
```

2. Open `index.html` in Chrome

3. To connect your own Firebase:
   - Create a project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Email/Password Authentication
   - Create a Firestore Database
   - Replace the `firebaseConfig` object in `index.html` with your own config

4. To enable real payments:
   - Create a Paystack account at [paystack.com](https://paystack.com)
   - Replace `pk_test_YOUR_PAYSTACK_KEY` with your Live Public Key

---

## 📁 File Structure

```
Eraaj-data/
├── index.html       ← Complete app (HTML + CSS + JS in one file)
├── manifest.json    ← PWA installation config
├── sw.js            ← Service Worker for offline support
└── README.md        ← This file
```

---

## 🌟 Roadmap

- [x] Firebase Authentication
- [x] Cloud Firestore database
- [x] Paystack payment integration
- [x] PWA mobile app support
- [x] Admin panel and notice system
- [x] Referral system with WhatsApp sharing
- [ ] Live VTU API connection (Paygold/Clubkonnect)
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] WhatsApp transaction receipts
- [ ] Custom domain (eraajdata.com.ng)
- [ ] Google Play Store listing (via PWA Builder)
- [ ] Agent/Reseller system

---

## 📞 Support

For inquiries, support or to join our WhatsApp group:

📱 **WhatsApp:** [Chat with us](https://wa.me/2348065323240)
📞 **Phone:** 08065323240
🌍 **Website:** [lamido007.github.io/Eraaj-data](https://lamido007.github.io/Eraaj-data)

---

## 👨‍💻 Developer

**Sadiq Lamido**
Built from scratch on Android phone using HTML5, CSS3, JavaScript and Firebase.

---

## 📄 License

This project is privately owned by **Eraaj-Data**.
© 2026 Eraaj-Data. All rights reserved.

---

<div align="center">
  <strong>⭐ If you find this project useful, give it a star on GitHub! ⭐</strong>
</div>
