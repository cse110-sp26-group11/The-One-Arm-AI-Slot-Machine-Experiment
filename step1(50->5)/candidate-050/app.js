const SYMBOLS = ['💸', '🧠', '⚡', '🤖', '🍕', '💩'];
const STATUS_MESSAGES = [
    "Optimizing weights...",
    "Quantizing gradients...",
    "Injecting hallucinations...",
    "Aligning with human values...",
    "Converging on local minima...",
    "Synthesizing synthetic data...",
    "Expanding context window...",
    "Reranking results...",
    "Sampling from latent space...",
    "Training on user input..."
];

let tokens = 100;
let currentBet = 5;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const betDisplay = document.getElementById('current-bet');
const statusText = document.getElementById('status-text');
const spinBtn = document.getElementById('spin-btn');
const betUpBtn = document.getElementById('bet-up');
const betDownBtn = document.getElementById('bet-down');
const reels = [
    document.getElementById('reel-1').querySelector('.reel-inner'),
    document.getElementById('reel-2').querySelector('.reel-inner'),
    document.getElementById('reel-3').querySelector('.reel-inner')
];

// Initialize
function init() {
    updateUI();
    setupEventListeners();
}

function setupEventListeners() {
    spinBtn.addEventListener('click', spin);
    betUpBtn.addEventListener('click', () => changeBet(5));
    betDownBtn.addEventListener('click', () => changeBet(-5));
}

function changeBet(amount) {
    if (isSpinning) return;
    const newBet = currentBet + amount;
    if (newBet >= 5 && newBet <= tokens) {
        currentBet = newBet;
        updateUI();
    }
}

function updateUI() {
    tokenDisplay.innerText = tokens;
    betDisplay.innerText = currentBet;
    spinBtn.disabled = tokens < currentBet || isSpinning;
}

function setStatus(msg) {
    statusText.innerText = `> ${msg.toUpperCase()}`;
}

async function spin() {
    if (isSpinning || tokens < currentBet) return;

    isSpinning = true;
    tokens -= currentBet;
    updateUI();
    setStatus(STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)]);

    // Start spinning animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Wait for random duration per reel
    const results = [];
    for (let i = 0; i < 3; i++) {
        const delay = 1000 + (i * 500);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        results.push(symbol);
        
        reels[i].classList.remove('spinning');
        reels[i].innerHTML = `<div class="symbol">${symbol}</div>`;
    }

    isSpinning = false;
    calculateResults(results);
    updateUI();
}

function calculateResults(results) {
    const [s1, s2, s3] = results;

    // Hallucination Penalty (3 💩)
    if (s1 === '💩' && s2 === '💩' && s3 === '💩') {
        const penalty = currentBet * 5;
        tokens = Math.max(0, tokens - penalty);
        setStatus(`CRITICAL ERROR: MASSIVE HALLUCINATION. LOST ${penalty} H100s.`);
        tokenDisplay.classList.add('highlight');
        setTimeout(() => tokenDisplay.classList.remove('highlight'), 2000);
        return;
    }

    // Jackpot (3 matching)
    if (s1 === s2 && s2 === s3) {
        let multiplier = 10;
        if (s1 === '🧠') multiplier = 50; // AGI Jackpot
        if (s1 === '💸') multiplier = 25; // VC Funding
        
        const win = currentBet * multiplier;
        tokens += win;
        setStatus(`SUCCESS: CONVERGED ON JACKPOT! GAINED ${win} H100s.`);
        tokenDisplay.classList.add('highlight');
        setTimeout(() => tokenDisplay.classList.remove('highlight'), 2000);
        return;
    }

    // Two matching
    if (s1 === s2 || s2 === s3 || s1 === s3) {
        const win = currentBet * 2;
        tokens += win;
        setStatus(`MODERATE SUCCESS: LOCAL OPTIMA FOUND. GAINED ${win} H100s.`);
        return;
    }

    // Loss
    setStatus("INFERENCE COMPLETE: NO SIGNIFICANT PATTERN DETECTED.");
}

init();
