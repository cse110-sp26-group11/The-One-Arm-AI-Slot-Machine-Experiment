// AI Symbols and their "payouts"
const SYMBOLS = [
    { icon: '🧠', name: 'Model', weight: 3 },
    { icon: '⚡', name: 'Compute', weight: 4 },
    { icon: '💸', name: 'VC Funding', weight: 2 },
    { icon: '📉', name: 'Hallucination', weight: 5 },
    { icon: '☁️', name: 'Cloud Ops', weight: 4 },
    { icon: '🤖', name: 'Agent', weight: 3 }
];

const SPIN_COST = 50;
const REEL_COUNT = 3;
const SYMBOLS_PER_REEL = 20;

let tokenBalance = 1000;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-balance');
const statusText = document.getElementById('status-text');
const generateBtn = document.getElementById('generate-btn');
const fundingBtn = document.getElementById('funding-btn');
const reelStrips = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];

// Initialize Reels
function initReels() {
    reelStrips.forEach(strip => {
        strip.innerHTML = '';
        // Create a long strip of random symbols
        for (let i = 0; i < SYMBOLS_PER_REEL; i++) {
            const symbol = getRandomSymbol();
            const symbolEl = document.createElement('div');
            symbolEl.className = 'symbol';
            symbolEl.textContent = symbol.icon;
            strip.appendChild(symbolEl);
        }
    });
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
    if (isSpinning || tokenBalance < SPIN_COST) return;

    isSpinning = true;
    updateTokens(-SPIN_COST);
    generateBtn.disabled = true;
    statusText.textContent = "Processing request...";
    statusText.classList.remove('glitch');
    statusText.style.color = '';

    // Reset reels to top immediately before spin
    reelStrips.forEach(strip => {
        strip.style.transition = 'none';
        strip.style.top = '0px';
        // Re-randomize for fresh symbols
        strip.innerHTML = '';
        for (let i = 0; i < SYMBOLS_PER_REEL; i++) {
            const symbol = getRandomSymbol();
            const symbolEl = document.createElement('div');
            symbolEl.className = 'symbol';
            symbolEl.textContent = symbol.icon;
            strip.appendChild(symbolEl);
        }
    });

    // Force reflow
    void document.body.offsetHeight;

    const results = [];
    const spinAnimations = reelStrips.map((strip, index) => {
        // Target is near the end of the strip
        const resultIndex = SYMBOLS_PER_REEL - 1; 
        const targetSymbol = strip.children[resultIndex].textContent;
        results.push(targetSymbol);

        const offset = resultIndex * 120;
        
        return new Promise(resolve => {
            strip.style.transition = `top ${2 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.top = `-${offset}px`;
            
            setTimeout(resolve, (2 + index * 0.5) * 1000);
        });
    });

    await Promise.all(spinAnimations);
    checkResults(results);
    isSpinning = false;
    updateUI();
}

function checkResults(results) {
    const [r1, r2, r3] = results;
    
    // Logic for wins
    if (r1 === r2 && r2 === r3) {
        // Jackpots
        if (r1 === '💸') {
            handleWin(2000, "SERIES A FUNDING SECURED! +2000 tokens");
        } else if (r1 === '🧠') {
            handleWin(1000, "AGI ACHIEVED (Marketed)! +1000 tokens");
        } else if (r1 === '📉') {
            handleLoss("CATASTROPHIC HALLUCINATION. Token burn accelerated.");
            updateTokens(-200);
        } else {
            handleWin(500, "Context window expanded! +500 tokens");
        }
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Partial matches
        handleWin(100, "Optimizing weights... +100 tokens");
    } else if (results.includes('📉')) {
        handleLoss("Minor hallucination detected. No tokens generated.");
        statusText.classList.add('glitch');
    } else {
        statusText.textContent = "Inference complete. No meaningful output.";
    }
}

function handleWin(amount, message) {
    tokenBalance += amount;
    statusText.textContent = message;
    statusText.style.color = 'var(--success)';
    setTimeout(() => statusText.style.color = '', 2000);
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
    
    if (tokenBalance < SPIN_COST) {
        generateBtn.disabled = true;
        fundingBtn.classList.remove('hidden');
        statusText.textContent = "OUT OF TOKENS. Your AI startup is bankrupt.";
    } else {
        generateBtn.disabled = isSpinning;
        fundingBtn.classList.add('hidden');
    }
}

// Event Listeners
generateBtn.addEventListener('click', spin);
fundingBtn.addEventListener('click', () => {
    tokenBalance = 500;
    statusText.textContent = "Pivoted! Received emergency seed funding.";
    updateUI();
});

// Start
initReels();
updateUI();
