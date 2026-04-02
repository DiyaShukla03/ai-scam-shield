// ============================================
//   AI SCAM SHIELD — Frontend Logic
//   Connects to FastAPI Backend
//   BIT Bandits | Hacknovate 7.0
// ============================================

const API_URL = "http://127.0.0.1:8000";

const examples = {
  scam1: "Your SBI bank account has been blocked due to incomplete KYC. Click here immediately to verify: bit.ly/sbi-kyc-verify or your account will be permanently suspended within 24 hours. Contact helpline: 9876543210",
  scam2: "URGENT: Your Aadhaar-linked mobile OTP is 847291. Share this OTP with our RBI representative on call to unlock your frozen account. Do NOT delay — legal action will be initiated.",
  scam3: "Congratulations! You have won ₹25,00,000 in the Government Lucky Draw 2024. To claim your prize money, send your full name, account number, IFSC code and a processing fee of ₹499 to PhonePe: 9876500000. Limited time offer!",
  safe1: "Hi! Your order #ORD-48291 has been shipped. Expected delivery by Friday, 5th April. Track your package at our official website. Thank you for shopping with us!"
};

const messageInput = document.getElementById('messageInput');
const charCount = document.getElementById('charCount');
const resultPanel = document.getElementById('resultPanel');
const resultHeader = document.getElementById('resultHeader');
const riskIcon = document.getElementById('riskIcon');
const riskLabel = document.getElementById('riskLabel');
const riskSublabel = document.getElementById('riskSublabel');
const riskScoreNum = document.getElementById('riskScoreNum');
const signalsGrid = document.getElementById('signalsGrid');
const aiSummary = document.getElementById('aiSummary');
const recommendationBox = document.getElementById('recommendationBox');
const recIcon = document.getElementById('recIcon');
const recTitle = document.getElementById('recTitle');
const recText = document.getElementById('recText');
const analyzeBtn = document.getElementById('analyzeBtn');

const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);

messageInput.addEventListener('input', () => {
  const len = messageInput.value.length;
  charCount.textContent = `${len} / 500`;
  if (len > 500) messageInput.value = messageInput.value.slice(0, 500);
});

function loadExample(key) {
  messageInput.value = examples[key];
  charCount.textContent = `${examples[key].length} / 500`;
  resultPanel.classList.remove('visible');
  messageInput.focus();
}

function setLoading(isLoading) {
  if (isLoading) {
    analyzeBtn.classList.add('loading');
    analyzeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="animation:spin 0.8s linear infinite"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" stroke-dasharray="31" stroke-dashoffset="10"/></svg> Analyzing...`;
  } else {
    analyzeBtn.classList.remove('loading');
    analyzeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="white" stroke-width="1.8"/><path d="M21 21l-4.35-4.35" stroke="white" stroke-width="1.8" stroke-linecap="round"/><path d="M11 8v6M8 11h6" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg> Analyze Message`;
  }
}

async function analyzeMessage() {
  const msg = messageInput.value.trim();
  if (!msg) {
    messageInput.focus();
    messageInput.style.borderColor = 'var(--danger)';
    setTimeout(() => { messageInput.style.borderColor = ''; }, 1500);
    return;
  }
  setLoading(true);
  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });
    if (!response.ok) throw new Error("Backend error");
    const result = await response.json();
    displayResult(result);
  } catch (error) {
    console.warn("Backend unreachable, using local detection:", error);
    const result = localFallbackDetection(msg);
    displayResult(result);
  } finally {
    setLoading(false);
  }
}

function localFallbackDetection(text) {
  const patterns = {
    urgency: { keywords: ["immediately","urgent","right now","act now","hurry","asap","within 24 hours","last chance","limited time"], weight: 25, label: "Urgency Detected", emoji: "⚡", level: "danger" },
    threat: { keywords: ["blocked","suspended","legal action","arrested","fir","police","court","penalty","banned","will be blocked"], weight: 30, label: "Threat Pattern", emoji: "🚨", level: "danger" },
    otp: { keywords: ["otp","one time password","verification code","share otp","passcode","cvv","share pin"], weight: 35, label: "OTP / PIN Request", emoji: "🔑", level: "danger" },
    suspicious_link: { keywords: ["click here","click now","bit.ly","tinyurl","verify now","http://",".xyz",".tk"], weight: 30, label: "Suspicious Link", emoji: "🔗", level: "danger" },
    financial_lure: { keywords: ["you have won","congratulations","winner","prize","lottery","reward","cashback","claim now"], weight: 20, label: "Financial Lure", emoji: "💰", level: "warning" },
    impersonation: { keywords: ["rbi","reserve bank","income tax","sbi","hdfc","icici","government","official","helpline"], weight: 20, label: "Impersonation Risk", emoji: "🏦", level: "warning" },
    personal_info: { keywords: ["aadhaar","pan card","pan number","passport","date of birth","account number","ifsc","kyc"], weight: 25, label: "Personal Info Request", emoji: "🪪", level: "warning" }
  };
  const lower = text.toLowerCase();
  let score = 0, signals = [];
  for (const [, p] of Object.entries(patterns)) {
    const matched = p.keywords.filter(kw => lower.includes(kw));
    if (matched.length > 0) {
      score += p.weight;
      signals.push({ label: p.label, emoji: p.emoji, level: p.level, matched: matched.slice(0,3) });
    }
  }
  score = Math.min(score, 100);
  const risk_class = score >= 50 ? "danger" : score >= 25 ? "warning" : "safe";
  const risk_level = score >= 50 ? "HIGH" : score >= 25 ? "MEDIUM" : "SAFE";
  if (risk_class === "safe") score = Math.max(score, 5);
  const summaries = {
    danger: `NLP engine detected ${signals.length} high-risk pattern(s). Signals: ${signals.map(s=>s.label).join(", ")}. This is a classic digital fraud attempt.`,
    warning: `${signals.length} suspicious element(s) detected: ${signals.map(s=>s.label).join(", ")}. Verify through official channels before acting.`,
    safe: `Scanned ${text.split(" ").length} words across 7 pattern categories. No significant fraud indicators detected.`
  };
  const recs = {
    danger: { icon: "🛑", title: "Do NOT engage with this message", text: "Do not call any number, click any link, or share any OTP. Report to cybercrime.gov.in or call 1930." },
    warning: { icon: "⚠️", title: "Verify before you act", text: "Do not respond immediately. Call the official number from the organization's website." },
    safe: { icon: "✅", title: "Message appears legitimate", text: "No scam patterns found. Stay alert — if something feels off, verify independently." }
  };
  return { score, risk_level, risk_class, signals, summary: summaries[risk_class], recommendation: recs[risk_class] };
}

function displayResult(result) {
  const { score, risk_class, signals, summary, recommendation } = result;
  resultPanel.classList.add('visible');
  resultHeader.className = `result-header ${risk_class}`;
  const icons = { danger: '🚨', warning: '⚠️', safe: '✅' };
  const iconBg = { danger: 'var(--danger-bg)', warning: 'var(--warn-bg)', safe: 'var(--safe-bg)' };
  riskIcon.textContent = icons[risk_class];
  riskIcon.style.background = iconBg[risk_class];
  const labels = { danger: '⚠️ HIGH RISK SCAM', warning: '🟡 SUSPICIOUS MESSAGE', safe: '✅ SAFE MESSAGE' };
  riskLabel.textContent = labels[risk_class];
  riskLabel.style.color = risk_class === 'danger' ? 'var(--danger)' : risk_class === 'warning' ? 'var(--warn)' : 'var(--safe)';
  riskSublabel.textContent = '';
  animateScore(0, score, riskScoreNum);
  signalsGrid.innerHTML = '';
  if (!signals || signals.length === 0) {
    signalsGrid.innerHTML = `<span class="signal-chip safe">✓ No fraud patterns detected</span>`;
  } else {
    signals.forEach((sig, i) => {
      const chip = document.createElement('span');
      chip.className = `signal-chip ${sig.level}`;
      chip.style.animationDelay = `${i * 0.07}s`;
      chip.textContent = `${sig.emoji} ${sig.label}`;
      if (sig.matched && sig.matched.length > 0) chip.title = `Matched: ${sig.matched.join(", ")}`;
      signalsGrid.appendChild(chip);
    });
  }
  aiSummary.textContent = summary;
  recommendationBox.className = `recommendation-box ${risk_class}`;
  recIcon.textContent = recommendation.icon;
  recTitle.textContent = recommendation.title;
  recText.textContent = recommendation.text;
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function animateScore(from, to, el) {
  const duration = 800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

messageInput.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') analyzeMessage();
});
