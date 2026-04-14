// AI Symbols and their "payouts"
const SYMBOLS = [
    { icon: '🧠', name: 'Neural Net', weight: 4 },
    { icon: '⚡', name: 'GPU Clusters', weight: 4 },
    { icon: '💸', name: 'VC Funding', weight: 2 },
    { icon: '📉', name: 'Hallucination', weight: 5 },
    { icon: '☁️', name: 'Cloud Spend', weight: 4 },
    { icon: '🤖', name: 'Agentic Workflow', weight: 3 },
    { icon: '🦄', name: 'Unicorn Status', weight: 1 },
    { icon: '🔒', name: 'Data Breach', weight: 2 }
];

const MULTIPLIERS = {
    '💸💸💸': 100,
    '🦄🦄🦄': 500,
    '🧠🧠🧠': 20,
    '🤖🤖🤖': 15,
    '⚡⚡⚡': 10,
    '☁️☁️☁️': 5,
    '📉📉📉': -50, 
    '🔒🔒🔒': -100,
    '💸💸': 10,
    'ANY2': 2,
    '💸': 1
};

const WIN_MESSAGES = [
    "SERIES A FUNDING SECURED!",
    "Product Hunt #1 of the day!",
    "Acquired by Big Tech (for parts)!",
    "Token utility confirmed by SEC!",
    "Viral growth achieved (mostly bots)!",
    "Prompt engineering worked first try!",
    "GPU lead times shortened!",
    "Hired a 10x developer (actually a 10x expensive one)!",
    "Sam Altman liked your tweet!",
    "NVIDIA CEO signed your leather jacket!"
];

const LOSS_MESSAGES = [
    "Burn rate too high. Pivot needed.",
    "Hallucination rate exceeded safety limits.",
    "Open source competitor released for free.",
    "Investors stopped answering calls.",
    "Technical debt interest due.",
    "API rate limited by the provider.",
    "Cloud bill came in higher than revenue.",
    "CEO tweeted something regrettable.",
    "Model collapsed due to training on its own output.",
    "Safety team resigned en masse."
];

const REEL_COUNT = 3;
const SYMBOLS_PER_REEL = 30;

let tokenBalance = 1000;
let currentBet = 50;
let isSpinning = false;
let hallucinationLevel = 95;
let confidenceBias = 100;
let safetyFilterActive = true;

// Sound Manager using Web Audio API
class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    playOsc(freq, type, duration, volume = 0.1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playSpin() {
        this.playOsc(150, 'sawtooth', 0.1, 0.05);
    }

    playWin() {
        const now = this.ctx.currentTime;
        [440, 554.37, 659.25, 880].forEach((f, i) => {
            setTimeout(() => this.playOsc(f, 'square', 0.5, 0.1), i * 100);
        });
    }

    playLoss() {
        this.playOsc(100, 'sine', 0.8, 0.2);
        this.playOsc(70, 'sawtooth', 0.8, 0.1);
    }

    playClick() {
        this.playOsc(800, 'sine', 0.05, 0.05);
    }
}

const sounds = new SoundManager();

// DOM Elements
const tokenDisplay = document.getElementById('token-balance');
const statusText = document.getElementById('status-text');
const generateBtn = document.getElementById('generate-btn');
const fundingBtn = document.getElementById('funding-btn');
const betButtons = document.querySelectorAll('.bet-btn');
const btnCostDisplay = document.querySelector('.btn-cost');
const machineBorder = document.querySelector('.machine-border');
const hypeProgress = document.getElementById('hype-progress');
const burnProgress = document.getElementById('burn-progress');
const hallucinationSlider = document.getElementById('hallucination-slider');
const confidenceSlider = document.getElementById('confidence-slider');
const safetyToggle = document.getElementById('safety-toggle');

// Initialize Reels
function initReels() {
    reelStrips.forEach(strip => {
        populateStrip(strip);
    });
}

function populateStrip(strip) {
    strip.innerHTML = '';
    for (let i = 0; i < SYMBOLS_PER_REEL; i++) {
        const symbol = getRandomSymbol();
        const symbolEl = document.createElement('div');
        symbolEl.className = 'symbol';
        symbolEl.textContent = symbol.icon;
        strip.appendChild(symbolEl);
    }
}

function getRandomSymbol() {
    // Adjust weights based on "Model Settings"
    const adjustedSymbols = SYMBOLS.map(s => {
        let weight = s.weight;
        if (s.icon === '📉') weight *= (hallucinationLevel / 50); // More hallucination = more 📉
        if (s.icon === '💸' || s.icon === '🦄') weight *= (confidenceBias / 100); // More confidence = more "perceived" value
        return { ...s, weight };
    });

    const totalWeight = adjustedSymbols.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of adjustedSymbols) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return adjustedSymbols[0];
}

async function spin() {
    if (isSpinning || tokenBalance < currentBet) return;

    if (sounds.ctx.state === 'suspended') sounds.ctx.resume();

    isSpinning = true;
    updateTokens(-currentBet);
    generateBtn.disabled = true;
    statusText.textContent = "Scaling infrastructure...";
    statusText.classList.remove('glitch');
    statusText.style.color = '';
    machineBorder.classList.add('spinning');
    machineBorder.classList.remove('win-flash');

    // Prepare reels
    reelStrips.forEach(strip => {
        strip.style.transition = 'none';
        strip.style.top = '0px';
        populateStrip(strip);
    });

    // Force reflow
    void document.body.offsetHeight;

    const results = [];
    const spinAnimations = reelStrips.map((strip, index) => {
        const resultIndex = SYMBOLS_PER_REEL - 1; 
        results.push(strip.children[resultIndex].textContent);

        const offset = resultIndex * 120;
        
        // Spin sounds
        const spinInterval = setInterval(() => sounds.playSpin(), 100);
        
        return new Promise(resolve => {
            strip.style.transition = `top ${1.5 + index * 0.4}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.top = `-${offset}px`;
            setTimeout(() => {
                clearInterval(spinInterval);
                sounds.playClick();
                resolve();
            }, (1.5 + index * 0.4) * 1000);
        });
    });

    await Promise.all(spinAnimations);
    machineBorder.classList.remove('spinning');
    checkResults(results);
    isSpinning = false;
    updateUI();
}

function checkResults(results) {
    const [r1, r2, r3] = results;
    let multiplier = 0;
    let message = "";
    let isWin = false;

    // Safety Filter Check
    if (safetyFilterActive && Math.random() < 0.15) {
        const potentialWin = (r1 === r2 && r2 === r3) || results.includes('💸');
        if (potentialWin) {
            handleLoss("CENSORED: Output deemed unsafe for enterprise deployment. No tokens awarded.");
            return;
        }
    }

    // 3 of a kind
    if (r1 === r2 && r2 === r3) {
        const key = `${r1}${r2}${r3}`;
        multiplier = MULTIPLIERS[key] || 10; 
        isWin = multiplier > 0;
        message = isWin ? "CONVERGENCE ACHIEVED! " : "MODEL COLLAPSE! ";
    } 
    // Unicorn / VC Special
    else if ((r1 === '💸' && r2 === '💸') || (r2 === '💸' && r3 === '💸') || (r1 === '💸' && r3 === '💸')) {
        multiplier = MULTIPLIERS['💸💸'];
        isWin = true;
        message = "Series B secured! ";
    }
    // Any 2 match (excluding bad ones)
    else if ((r1 === r2 || r2 === r3 || r1 === r3) && !results.includes('📉') && !results.includes('🔒')) {
        multiplier = MULTIPLIERS['ANY2'];
        isWin = true;
        message = "Incremental growth! ";
    }
    // Single VC Funding
    else if (results.includes('💸')) {
        multiplier = MULTIPLIERS['💸'];
        isWin = true;
        message = "Seed interest! ";
    }

    if (isWin) {
        let winAmount = currentBet * multiplier;
        
        // Hype Bonus: if hype is > 80%, double the win
        const currentHype = parseInt(hypeProgress.style.width) || 0;
        if (currentHype > 80) {
            winAmount *= 2;
            message = "BULL MARKET BONUS! " + message;
            hypeProgress.style.width = '40%'; // Reset hype after big win
        }

        handleWin(winAmount, message + WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]);
        hypeProgress.style.width = Math.min(100, (parseInt(hypeProgress.style.width) || 0) + 15) + '%';
        sounds.playWin();
    } else if (multiplier < 0) {
        const lossAmount = Math.abs(currentBet * multiplier);
        updateTokens(-lossAmount);
        
        let lossMsg = "SYSTEM ERROR! Loss of " + lossAmount + " tokens. ";
        if (results.includes('🔒')) {
            lossMsg = "DATA BREACH! GDPR fines of " + lossAmount + " tokens. ";
        }
        
        handleLoss(lossMsg + LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)]);
        sounds.playLoss();
        hypeProgress.style.width = Math.max(0, (parseInt(hypeProgress.style.width) || 0) - 20) + '%';
    } else {
        statusText.textContent = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
        burnProgress.style.width = Math.min(100, (parseInt(burnProgress.style.width) || 0) + 10) + '%';
        sounds.playLoss();
    }
}

function handleWin(amount, message) {
    tokenBalance += amount;
    statusText.textContent = message;
    statusText.style.color = 'var(--success)';
    machineBorder.classList.add('win-flash');
    setTimeout(() => statusText.style.color = '', 3000);
}

function handleLoss(message) {
    statusText.textContent = message;
    statusText.classList.add('glitch');
}

function updateTokens(amount) {
    tokenBalance += amount;
    updateUI();
}

function updateUI() {
    tokenDisplay.textContent = tokenBalance.toLocaleString();
    btnCostDisplay.textContent = `(-${currentBet} tokens)`;
    
    betButtons.forEach(btn => {
        const amount = parseInt(btn.dataset.amount);
        btn.disabled = isSpinning;
        if (amount === currentBet) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (tokenBalance < currentBet) {
        generateBtn.disabled = true;
        fundingBtn.classList.remove('hidden');
        if (tokenBalance <= 0) {
            statusText.textContent = "OUT OF TOKENS. Your AI startup is bankrupt.";
        }
    } else {
        generateBtn.disabled = isSpinning;
        fundingBtn.classList.add('hidden');
    }
}

// Event Listeners
generateBtn.addEventListener('click', spin);

betButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isSpinning) return;
        sounds.playClick();
        currentBet = parseInt(btn.dataset.amount);
        updateUI();
    });
});

fundingBtn.addEventListener('click', async () => {
    if (sounds.ctx.state === 'suspended') sounds.ctx.resume();
    fundingBtn.disabled = true;
    sounds.playClick();
    statusText.textContent = "Pitching to VCs... please wait for the term sheet.";
    
    // Simulate a "pitch" delay
    await new Promise(r => setTimeout(r, 2000));
    
    tokenBalance += 500;
    statusText.textContent = "Pivoted! Received emergency bridge funding (+500 tokens).";
    fundingBtn.disabled = false;
    burnProgress.style.width = '10%'; // Reset burn slightly
    updateUI();
    sounds.playWin();
});

hallucinationSlider.addEventListener('input', (e) => {
    hallucinationLevel = parseInt(e.target.value);
});

confidenceSlider.addEventListener('input', (e) => {
    confidenceBias = parseInt(e.target.value);
});

safetyToggle.addEventListener('change', (e) => {
    safetyFilterActive = e.target.checked;
});

// Start
initReels();
updateUI();
burnProgress.style.width = '20%';
hypeProgress.style.width = '40%';

// Passive Token Economy
setInterval(() => {
    const hype = parseInt(hypeProgress.style.width) || 0;
    const burn = parseInt(burnProgress.style.width) || 0;

    if (hype > 70) {
        updateTokens(10); // "Passive recurring revenue" (mostly from fake users)
        statusText.textContent = "SaaS Subscriptions +10 tokens (Fake user growth +5%)";
    }

    if (burn > 80) {
        updateTokens(-20); // "Cloud bill interest"
        statusText.textContent = "CLOUD OVERAGE! -20 tokens. Scale down or get more funding.";
        statusText.style.color = 'var(--danger)';
        setTimeout(() => statusText.style.color = '', 2000);
    }
}, 10000);
