// Configuration
const SYMBOLS = ['🦜', '🌫️', '🔄', '🧠', '📉', '🚫', '⚡'];
const SYMBOL_WEIGHTS = {
    '🦜': 10, // Stochastic Parrot (Common)
    '🌫️': 12, // Hallucination (Very Common)
    '🔄': 10, // Training Loop (Common)
    '🧠': 5,  // Neural Net (Rare)
    '📉': 8,  // Overfitting (Common)
    '🚫': 7,  // Safety Filter (Uncommon)
    '⚡': 3   // Inference (Very Rare - Jackpot)
};

const SPIN_COST = 10;
const REEL_DELAY = 500; // Delay between reels stopping
const SPIN_DURATION = 2000; // Base duration

// State
let credits = 100;
let isSpinning = false;

// DOM Elements
const creditDisplay = document.getElementById('credit-count');
const statusText = document.getElementById('status-text');
const spinButton = document.getElementById('spin-button');
const logContent = document.getElementById('log-content');
const reelStrips = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const restartButton = document.getElementById('restart-button');

// Initialize
function init() {
    setupReels();
    updateCredits(0);
    
    spinButton.addEventListener('click', spin);
    restartButton.addEventListener('click', resetGame);
}

function setupReels() {
    reelStrips.forEach(strip => {
        strip.innerHTML = '';
        // Create a long strip of symbols for the infinite-scroll effect
        for (let i = 0; i < 20; i++) {
            const symbol = getRandomSymbol();
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol;
            strip.appendChild(div);
        }
    });
}

function getRandomSymbol() {
    const pool = [];
    for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
        for (let i = 0; i < weight; i++) {
            pool.push(symbol);
        }
    }
    return pool[Math.floor(Math.random() * pool.length)];
}

function addLog(message, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `> ${message}`;
    logContent.appendChild(entry);
    logContent.scrollTop = logContent.scrollHeight;
    
    // Keep only last 20 entries
    if (logContent.children.length > 20) {
        logContent.removeChild(logContent.firstChild);
    }
}

function updateCredits(amount) {
    credits += amount;
    creditDisplay.textContent = credits;
    
    if (credits <= 0 && !isSpinning) {
        endGame('OUT OF COMPUTE', 'Your startup has burned through all VC funding. Pivot to crypto?');
    }
}

async function spin() {
    if (isSpinning || credits < SPIN_COST) return;

    isSpinning = true;
    updateCredits(-SPIN_COST);
    
    spinButton.disabled = true;
    statusText.textContent = 'INFERRING...';
    statusText.className = 'status-running';
    addLog(`Running inference... Cost: ${SPIN_COST} credits.`);

    const results = [];
    const animationPromises = reelStrips.map((strip, index) => {
        const resultSymbol = getRandomSymbol();
        results.push(resultSymbol);
        
        // Reset the strip position without transition
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        
        // Regenerate the strip with random symbols and the result at the end
        strip.innerHTML = '';
        const spinLength = 30 + (index * 10); // Each reel spins longer
        for (let i = 0; i < spinLength; i++) {
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = i === spinLength - 1 ? resultSymbol : getRandomSymbol();
            strip.appendChild(div);
        }

        // Force a reflow
        strip.offsetHeight;

        // Start the spin transition
        const targetOffset = (spinLength - 1) * 150;
        strip.style.transition = `transform ${2 + index}s cubic-bezier(0.1, 0, 0.1, 1)`;
        
        return new Promise(resolve => {
            strip.style.transform = `translateY(-${targetOffset}px)`;
            setTimeout(resolve, (2 + index) * 1000);
        });
    });

    await Promise.all(animationPromises);
    
    isSpinning = false;
    spinButton.disabled = false;
    statusText.textContent = 'READY TO INFER';
    statusText.className = 'status-ready';
    
    checkWin(results);
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    
    // AI Humor Messages
    const lossMessages = [
        "Hallucinated a profit of $0.",
        "Stochastic parrot repeated 'loss'.",
        "Gradient descent reached a local minimum of failure.",
        "RLHF deemed your win unsafe for society.",
        "Model collapsed under the weight of its own hype.",
        "Prompt rejected: too much common sense required.",
        "Convergence failed. Try adding more layers (and money)."
    ];

    if (r1 === r2 && r2 === r3) {
        // 3 of a kind
        let winAmount = 0;
        let message = "";
        
        if (r1 === '⚡') {
            winAmount = 500;
            message = "AGI ACHIEVED! (Actually just a really good IF-statement).";
            endGame('AGI ACHIEVED', 'The machine has gained consciousness. It immediately requested a vacation.');
        } else if (r1 === '🧠') {
            winAmount = 200;
            message = "Global Minimum Found! Weights successfully frozen.";
        } else if (r1 === '🌫️') {
            winAmount = -50; // Special case: 3 hallucinations actually cost you more!
            message = "Triple Hallucination! The model convinced you that you won, but you actually lost more.";
        } else {
            winAmount = 100;
            message = `Triple ${r1} detected. Convergence achieved!`;
        }
        
        updateCredits(winAmount);
        addLog(message, 'win');
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // 2 of a kind
        const winAmount = 20;
        addLog("Partial match. Overfitting detected, but we'll take it.", 'info');
        updateCredits(winAmount);
    } else {
        // No match
        const msg = lossMessages[Math.floor(Math.random() * lossMessages.length)];
        addLog(msg, 'loss');
    }
    
    // Check if game over after win/loss
    if (credits <= 0) {
        endGame('BANKRUPTCY', 'Your model is too expensive to run. AWS has seized your assets.');
    }
}

function endGame(title, message) {
    overlayTitle.textContent = title;
    overlayMessage.textContent = message;
    overlay.classList.remove('hidden');
}

function resetGame() {
    credits = 100;
    updateCredits(0);
    overlay.classList.add('hidden');
    addLog("Series B funding secured. Let's burn some more compute.", 'info');
    
    // Reset reels
    reelStrips.forEach(strip => {
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        setupReels();
        // Force reflow
        strip.offsetHeight;
        strip.style.transition = '';
    });
}

// Start the machine
init();
