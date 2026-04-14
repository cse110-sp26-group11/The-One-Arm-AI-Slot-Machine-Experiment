// AI Symbols and their "payouts"
const SYMBOLS = [
    { icon: '🧠', name: 'Model', weight: 4 },
    { icon: '⚡', name: 'Compute', weight: 4 },
    { icon: '💸', name: 'VC Funding', weight: 2 },
    { icon: '📉', name: 'Hallucination', weight: 5 },
    { icon: '☁️', name: 'Cloud Ops', weight: 4 },
    { icon: '🤖', name: 'Agent', weight: 3 }
];

const MULTIPLIERS = {
    '💸💸💸': 50,
    '🧠🧠🧠': 20,
    '🤖🤖🤖': 10,
    '⚡⚡⚡': 8,
    '☁️☁️☁️': 5,
    '📉📉📉': -20, // Debt!
    '💸💸': 5,
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
    "Hired a 10x developer (actually a 10x expensive one)!"
];

const LOSS_MESSAGES = [
    "Burn rate too high. Pivot needed.",
    "Hallucination rate exceeded safety limits.",
    "Open source competitor released for free.",
    "Investors stopped answering calls.",
    "Technical debt interest due.",
    "API rate limited by the provider.",
    "Cloud bill came in higher than revenue.",
    "CEO tweeted something regrettable."
];

const REEL_COUNT = 3;
const SYMBOLS_PER_REEL = 30;

let tokenBalance = 1000;
let currentBet = 50;
let isSpinning = false;

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

const reelStrips = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];

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
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of SYMBOLS) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return SYMBOLS[0];
}

async function spin() {
    if (isSpinning || tokenBalance < currentBet) return;

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
        
        return new Promise(resolve => {
            strip.style.transition = `top ${1.5 + index * 0.4}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.top = `-${offset}px`;
            setTimeout(resolve, (1.5 + index * 0.4) * 1000);
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

    // 3 of a kind
    if (r1 === r2 && r2 === r3) {
        const key = `${r1}${r2}${r3}`;
        multiplier = MULTIPLIERS[key] || 5; // Default for 3-match
        isWin = multiplier > 0;
        message = isWin ? "TRIPLE MATCH! " : "BANKRUPTCY! ";
    } 
    // Special 2x VC Funding
    else if ((r1 === '💸' && r2 === '💸') || (r2 === '💸' && r3 === '💸') || (r1 === '💸' && r3 === '💸')) {
        multiplier = MULTIPLIERS['💸💸'];
        isWin = true;
        message = "Series B secured! ";
    }
    // Any 2 match (excluding bad ones)
    else if ((r1 === r2 || r2 === r3 || r1 === r3) && !results.includes('📉')) {
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
        const winAmount = currentBet * multiplier;
        handleWin(winAmount, message + WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]);
        hypeProgress.style.width = Math.min(100, (parseInt(hypeProgress.style.width) || 0) + 10) + '%';
    } else if (multiplier < 0) {
        const lossAmount = Math.abs(currentBet * multiplier);
        updateTokens(-lossAmount);
        handleLoss("DEBT COLLECTORS! Loss of " + lossAmount + " tokens. " + LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)]);
    } else {
        statusText.textContent = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
        burnProgress.style.width = Math.min(100, (parseInt(burnProgress.style.width) || 0) + 5) + '%';
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
        currentBet = parseInt(btn.dataset.amount);
        updateUI();
    });
});

fundingBtn.addEventListener('click', async () => {
    fundingBtn.disabled = true;
    statusText.textContent = "Pitching to VCs... please wait for the term sheet.";
    
    // Simulate a "pitch" delay
    await new Promise(r => setTimeout(r, 2000));
    
    tokenBalance += 500;
    statusText.textContent = "Pivoted! Received emergency bridge funding (+500 tokens).";
    fundingBtn.disabled = false;
    burnProgress.style.width = '10%'; // Reset burn slightly
    updateUI();
});

// Start
initReels();
updateUI();
burnProgress.style.width = '20%';
hypeProgress.style.width = '40%';
