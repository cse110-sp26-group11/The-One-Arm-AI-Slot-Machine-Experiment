const SYMBOLS = ['🤖', '📉', '🔥', '🌪️', '✨'];
const MESSAGES = [
    "Scraping personal data for training...",
    "Hallucinating a profitable quarter...",
    "Overfitting to Venture Capitalists...",
    "Moving fast and breaking laws...",
    "Replacing junior devs with regex...",
    "Buying 5000 more H100 GPUs...",
    "Pivoting to 'Generative Salami'...",
    "Optimizing for maximum engagement...",
    "Raising Series B at a $10B valuation...",
    "Warning: Entropy detected in training set."
];

const SPIN_COST = 5;
const WIN_PRIZE = 50;
const JACKPOT_PRIZE = 500;

let state = {
    tokens: parseInt(localStorage.getItem('hype_tokens')) || 100,
    equity: 0,
    isSpinning: false
};

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const equityDisplay = document.getElementById('equity-pct');
const statusLog = document.getElementById('status-log');
const spinBtn = document.getElementById('spin-btn');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

function updateUI() {
    tokenDisplay.innerText = state.tokens;
    equityDisplay.innerText = `${state.equity}%`;
    spinBtn.disabled = state.isSpinning || state.tokens < SPIN_COST;
    localStorage.setItem('hype_tokens', state.tokens);
}

function logMessage(msg) {
    const p = document.createElement('p');
    p.innerText = `> ${msg}`;
    statusLog.prepend(p);
    
    // Keep log short
    if (statusLog.children.length > 5) {
        statusLog.removeChild(statusLog.lastChild);
    }
}

async function spin() {
    if (state.isSpinning || state.tokens < SPIN_COST) return;

    state.isSpinning = true;
    state.tokens -= SPIN_COST;
    updateUI();
    logMessage(`Burnt ${SPIN_COST} tokens. Compute active...`);

    // Add spinning class
    reels.forEach(reel => {
        reel.querySelector('.reel-content').classList.add('spinning');
    });

    // Random durations for "suspense"
    const results = [];
    for (let i = 0; i < 3; i++) {
        const waitTime = 1000 + (i * 500);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        results.push(symbol);
        
        const content = reels[i].querySelector('.reel-content');
        content.classList.remove('spinning');
        content.innerText = symbol;
        
        logMessage(`Reel ${i+1} converged on: ${symbol}`);
    }

    checkWin(results);
    state.isSpinning = false;
    updateUI();
}

function checkWin(results) {
    const [r1, r2, r3] = results;

    if (r1 === r2 && r2 === r3) {
        if (r1 === '✨') {
            state.tokens += JACKPOT_PRIZE;
            state.equity += 10;
            logMessage(`SINGULARITY REACHED! +${JACKPOT_PRIZE} tokens. 10% equity gained.`);
        } else {
            state.tokens += WIN_PRIZE;
            state.equity += 1;
            logMessage(`ALGORITHMIC SUCCESS! +${WIN_PRIZE} tokens. 1% equity gained.`);
        }
    } else {
        logMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    }
}

spinBtn.addEventListener('click', spin);

// Initial UI sync
updateUI();
