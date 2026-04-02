from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import re

# ============================================
#   AI SCAM SHIELD — FastAPI Backend
#   BIT Bandits | Hacknovate 7.0
# ============================================

app = FastAPI(title="AI Scam Shield API", version="1.0.0")

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REQUEST MODEL ---
class MessageRequest(BaseModel):
    message: str

# --- PATTERN DATABASE ---
PATTERNS = {
    "urgency": {
        "keywords": [
            "immediately", "urgent", "right now", "act now", "hurry", "asap",
            "within 24 hours", "within 2 hours", "expiring", "expires today",
            "last chance", "limited time", "don't delay", "तुरंत", "अभी",
            "do not ignore", "final warning", "last reminder"
        ],
        "weight": 25,
        "label": "Urgency Detected",
        "emoji": "⚡",
        "level": "danger"
    },
    "threat": {
        "keywords": [
            "blocked", "suspended", "deactivated", "terminated", "legal action",
            "arrested", "fir", "police", "court", "penalty", "fine", "banned",
            "account will be", "will be blocked", "will be suspended",
            "action will be taken", "बंद", "कार्रवाई", "warrant", "cybercrime"
        ],
        "weight": 30,
        "label": "Threat Pattern",
        "emoji": "🚨",
        "level": "danger"
    },
    "otp": {
        "keywords": [
            "otp", "one time password", "verification code", "enter code",
            "share code", "send otp", "share otp", "passcode", "cvv",
            "share pin", "do not share", "never share", "pin number"
        ],
        "weight": 35,
        "label": "OTP / PIN Request",
        "emoji": "🔑",
        "level": "danger"
    },
    "suspicious_link": {
        "keywords": [
            "click here", "click now", "click link", "bit.ly", "tinyurl",
            "goo.gl", "t.co", "ow.ly", "is.gd", "verify now", "login here",
            "update here", "http://", ".xyz", ".tk", ".ml", ".cf", ".pw"
        ],
        "weight": 30,
        "label": "Suspicious Link",
        "emoji": "🔗",
        "level": "danger"
    },
    "financial_lure": {
        "keywords": [
            "you have won", "congratulations", "winner", "prize", "lottery",
            "reward", "cashback", "refund", "claim now", "gift card",
            "lucky draw", "lakh", "crore", "transfer money", "send money",
            "processing fee", "registration fee", "advance fee"
        ],
        "weight": 20,
        "label": "Financial Lure",
        "emoji": "💰",
        "level": "warning"
    },
    "impersonation": {
        "keywords": [
            "rbi", "reserve bank", "income tax", "it department", "government",
            "sbi", "hdfc", "icici", "axis bank", "paytm", "google pay",
            "phonepe", "amazon", "flipkart", "official", "helpline",
            "customer care", "support team", "verify your account"
        ],
        "weight": 20,
        "label": "Impersonation Risk",
        "emoji": "🏦",
        "level": "warning"
    },
    "personal_info": {
        "keywords": [
            "aadhaar", "aadhar", "pan card", "pan number", "passport",
            "date of birth", "dob", "mother's name", "father's name",
            "account number", "ifsc", "kyc", "full name", "address proof"
        ],
        "weight": 25,
        "label": "Personal Info Request",
        "emoji": "🪪",
        "level": "warning"
    }
}

# --- DETECTION ENGINE ---
def analyze_text(text: str):
    text_lower = text.lower()
    total_score = 0
    detected_signals = []
    matched_categories = []

    for category, pattern in PATTERNS.items():
        matched_keywords = []
        for kw in pattern["keywords"]:
            if kw.lower() in text_lower:
                matched_keywords.append(kw)

        if matched_keywords:
            total_score += pattern["weight"]
            matched_categories.append(category)
            detected_signals.append({
                "label": pattern["label"],
                "emoji": pattern["emoji"],
                "level": pattern["level"],
                "matched": matched_keywords[:3]  # show up to 3 matched keywords
            })

    # Cap score
    total_score = min(total_score, 100)

    # Determine risk level
    if total_score >= 50:
        risk_level = "HIGH"
        risk_class = "danger"
    elif total_score >= 25:
        risk_level = "MEDIUM"
        risk_class = "warning"
    else:
        risk_level = "SAFE"
        risk_class = "safe"
        total_score = max(total_score, 5)

    # Generate AI summary
    word_count = len(text.split())
    summary = generate_summary(risk_class, detected_signals, word_count)

    # Generate recommendation
    recommendation = generate_recommendation(risk_class)

    return {
        "score": total_score,
        "risk_level": risk_level,
        "risk_class": risk_class,
        "signals": detected_signals,
        "summary": summary,
        "recommendation": recommendation,
        "word_count": word_count,
        "categories_matched": matched_categories
    }

def generate_summary(risk_class: str, signals: list, word_count: int) -> str:
    signal_names = [s["label"] for s in signals]

    if risk_class == "danger":
        return (
            f"Our NLP engine detected {len(signals)} high-risk pattern(s) across {word_count} words. "
            f"Signals found: {', '.join(signal_names)}. "
            f"This combination is a classic indicator of digital fraud. "
            f"Scammers use urgency and fear to bypass rational thinking — do not engage."
        )
    elif risk_class == "warning":
        return (
            f"This message contains {len(signals)} suspicious element(s): {', '.join(signal_names)}. "
            f"While not definitively a scam, these patterns are commonly used in phishing attempts. "
            f"Always verify through official channels before taking any action."
        )
    else:
        return (
            f"After scanning {word_count} words across {len(PATTERNS)} pattern categories, "
            f"no significant fraud indicators were detected. "
            f"The message language appears neutral with no urgency triggers, "
            f"threat patterns, or suspicious structures."
        )

def generate_recommendation(risk_class: str) -> dict:
    recs = {
        "danger": {
            "icon": "🛑",
            "title": "Do NOT engage with this message",
            "text": (
                "Do not call any number, click any link, or share any OTP or personal information. "
                "Report this to cybercrime.gov.in or call 1930 (National Cyber Helpline)."
            )
        },
        "warning": {
            "icon": "⚠️",
            "title": "Verify before you act",
            "text": (
                "Do not respond immediately. Independently verify by calling the official number "
                "of the organization from their website — not from this message."
            )
        },
        "safe": {
            "icon": "✅",
            "title": "Message appears legitimate",
            "text": (
                "No scam patterns found. However, always stay alert — "
                "if something feels off, trust your instincts and verify independently."
            )
        }
    }
    return recs[risk_class]

# ============================================
#   API ROUTES
# ============================================

@app.get("/")
def root():
    return {
        "message": "AI Scam Shield API is running",
        "version": "1.0.0",
        "team": "BIT Bandits",
        "hackathon": "Hacknovate 7.0"
    }

@app.post("/analyze")
def analyze(request: MessageRequest):
    if not request.message.strip():
        return {"error": "Message cannot be empty"}

    result = analyze_text(request.message)
    return result

@app.get("/health")
def health():
    return {"status": "ok", "model": "rule-based NLP + pattern matching"}

# Serve frontend static files
app.mount("/", StaticFiles(directory=".", html=True), name="static")