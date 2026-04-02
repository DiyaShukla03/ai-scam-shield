# 🛡️ AI Scam Shield

> Real-time scam detection using NLP & AI — Built for Hacknovate 7.0

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![Python](https://img.shields.io/badge/python-3.13-blue)
![FastAPI](https://img.shields.io/badge/backend-FastAPI-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)

---

## 🔴 The Problem

Every year, Indians lose **₹1000+ crores** to digital scams — phishing messages, OTP fraud, fake bank alerts, and prize scams. Most users **cannot distinguish real messages from fake ones** in real-time.

Existing tools like Truecaller only detect spam **calls** — they cannot analyze **message intent**.

**There is no real-time intelligent scam detection system for everyday users. Until now.**

---

## 💡 Our Solution — AI Scam Shield

An AI-powered web application that analyzes any SMS, WhatsApp, or email message and instantly detects whether it is a scam — before the user becomes a victim.

### How it works:
1. User pastes a suspicious message
2. Backend runs **dual-layer detection** — rule-based pattern matching + NLP intent analysis
3. System returns a **risk score (0–100)** with detected signals
4. User gets a clear **recommendation** on what to do

---

## ✨ Features

- ⚡ **Real-time analysis** — results in under 2 seconds
- 🔍 **7 detection categories** — urgency, threats, OTP requests, suspicious links, financial lures, impersonation, personal info requests
- 📊 **Risk scoring** — LOW / MEDIUM / HIGH with animated score
- 🧠 **AI-generated summary** — explains why a message is flagged
- 🌐 **Full-stack** — React-style frontend + FastAPI Python backend
- 📱 **Responsive** — works on mobile and desktop
- 🇮🇳 **India-focused** — detects Hindi keywords, Indian bank names, UPI fraud patterns

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, FastAPI |
| NLP | Rule-based pattern matching + keyword intent detection |
| Server | Uvicorn (ASGI) |

---

## 🚀 Run Locally

### Prerequisites
- Python 3.10+
- pip

### Steps

```bash
# Clone the repository
git clone https://github.com/DiyaShukla03/ai-scam-shield.git

# Navigate to project
cd ai-scam-shield

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload
```

Then open `index.html` in your browser (or use Live Server in VS Code).

Backend runs at: `http://127.0.0.1:8000`

API docs available at: `http://127.0.0.1:8000/docs`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check |
| POST | `/analyze` | Analyze a message for scam detection |
| GET | `/docs` | Interactive API documentation |

### Example Request
```json
POST /analyze
{
  "message": "Your bank account will be blocked. Send OTP immediately."
}
```

### Example Response
```json
{
  "score": 85,
  "risk_level": "HIGH",
  "risk_class": "danger",
  "signals": [
    { "label": "Threat Pattern", "emoji": "🚨", "level": "danger" },
    { "label": "OTP / PIN Request", "emoji": "🔑", "level": "danger" },
    { "label": "Urgency Detected", "emoji": "⚡", "level": "danger" }
  ],
  "summary": "NLP engine detected 3 high-risk patterns. This is a classic digital fraud attempt.",
  "recommendation": {
    "icon": "🛑",
    "title": "Do NOT engage with this message",
    "text": "Report to cybercrime.gov.in or call 1930."
  }
}
```

---

## 🎯 Detection Categories

| Category | Examples | Risk Level |
|----------|----------|------------|
| Urgency | "Act now", "Immediately", "Within 24 hours" | 🔴 High |
| Threat | "Account blocked", "Legal action", "FIR" | 🔴 High |
| OTP Request | "Share OTP", "Verification code", "PIN" | 🔴 High |
| Suspicious Link | "bit.ly", "Click here", ".xyz domains" | 🔴 High |
| Financial Lure | "You have won", "Prize", "Cashback" | 🟡 Medium |
| Impersonation | "RBI", "SBI", "Income Tax", "Government" | 🟡 Medium |
| Personal Info | "Aadhaar", "PAN card", "IFSC", "KYC" | 🟡 Medium |

---

## 👥 Team

**BIT Bandits** — Hacknovate 7.0

- Theme: Cybersecurity & AI
- Category: Software
- Problem Statement: Digital Fraud & Scam Detection

---

## 📞 Report Scams

If you receive a scam message:
- 🌐 Report at [cybercrime.gov.in](https://cybercrime.gov.in)
- 📞 Call **1930** — National Cyber Helpline

---

## 📄 License

MIT License — feel free to use and build upon this project.
