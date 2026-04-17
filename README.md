# 🩺 HealthAI — Intelligent Medical Assistant
> Powered by Groq API (llama-3.3-70b-versatile)

An advanced GenAI health system that analyzes skin conditions and body symptoms, providing comprehensive insights, home remedies, medications, and specialist recommendations.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔬 **Skin Analyzer** | Diagnose rashes, acne, dryness, pigmentation & more |
| 🫀 **Body Health** | Analyze fever, pain, fatigue, cold, flu & all symptoms |
| 💊 **Medications** | OTC + Prescription drug recommendations |
| 🌿 **Home Remedies** | Natural & proven home treatment plans |
| 🥗 **Nutrition Guide** | Foods to eat & avoid per condition |
| 👨‍⚕️ **Doctor Types** | Which specialist to consult & when |
| ⚠️ **Warning Signs** | Red flags that need immediate care |
| 🛡️ **Prevention Tips** | Long-term care & lifestyle changes |
| ✨ **Skincare Routine** | Morning/evening routines (skin mode) |

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get your FREE Groq API Key
1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Go to **API Keys** → **Create API Key**
4. Copy your API key

### Step 2: Install dependencies
```bash
cd health-ai
npm install
```

### Step 3: Add your API Key
Open the `.env` file and replace `your_groq_api_key_here` with your actual key:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Start the server
```bash
# Normal start
npm start

# Development mode (auto-restart on changes)
npm run dev
```

### Step 5: Open in browser
```
http://localhost:3000
```

---

## 📁 Project Structure

```
health-ai/
├── server.js          ← Express backend + Groq API calls
├── package.json       ← Node.js dependencies
├── .env               ← Your API key (never commit this!)
└── public/
    └── index.html     ← Full frontend (HTML + CSS + JS)
```

---

## 🧠 How It Works

```
User Input → Express Server → Groq API (llama-3.3-70b-versatile)
                                    ↓
                         Structured JSON Analysis
                                    ↓
           Beautiful UI → Tabs: Overview, Remedies, Meds, Nutrition, Doctors
```

---

## ⚙️ Tech Stack

- **Backend**: Node.js + Express
- **AI Model**: Groq `llama-3.3-70b-versatile` (ultra-fast inference)
- **Frontend**: Pure HTML5 + CSS3 + Vanilla JS (no frameworks needed)
- **Fonts**: Syne + DM Sans + JetBrains Mono

---

## 🛠 Customization

### Change the AI model
In `server.js`, find this line:
```js
model: "llama-3.3-70b-versatile",
```
Change to any available Groq model (e.g., `llama-3.1-8b-instant` for faster responses).

### Change the port
In `.env`:
```
PORT=8080
```

---

## ⚠️ Disclaimer

This application is for **educational purposes only**. The AI-generated health information should **not** replace professional medical advice. Always consult a qualified healthcare professional for diagnosis and treatment.

---

## 📦 Dependencies

```json
{
  "express": "Web server framework",
  "groq-sdk": "Official Groq AI client",
  "dotenv": "Environment variable loader",
  "cors": "Cross-origin request handler",
  "nodemon": "Auto-restart in dev mode"
}
```
# 🩺 HealthAI — Intelligent Medical Assistant
> **Developer:** Pasala Neelima
> **Tech:** Groq API (llama-3.3-70b-versatile) | Node.js | Express