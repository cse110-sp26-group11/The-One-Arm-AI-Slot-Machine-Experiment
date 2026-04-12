/**
 * The One-Arm AI Slot Machine Experiment - Logic
 */

const SYMBOLS = ['🧠', '⚡', '⛓️', '👻', '🚫', '💰', '🤖'];
const SYMBOL_WEIGHTS = {
    '🧠': 1,   // AGI (Jackpot)
    '⚡': 5,   // GPU
    '⛓️': 10,  // Blockchain
    '👻': 15,  // Hallucination
    '🚫': 12,  // Censorship
    '💰': 8,   // VC Funding
    '🤖': 20   // Chatbot
};

const SATIRICAL_MESSAGES = [
    "Training failed. Overfitting detected.",
    "Hallucination detected! Inference cost: 10 tokens.",
    "AGI achieved! (Just kidding, it's a stochastic parrot).",
    "VC funding secured. Burn rate increasing...",
    "GPU temperature critical. Throttling performance.",
    "Blockchain integration unsuccessful. Pivot to AI?",
    "Censorship layer applied. Fun removed.",
    "Model weights leaked. Re-training required.",
    "Prompt engineering suboptimal. Try again.",
    "RLHF complete. Agent is now slightly more polite."
];

// Configuration
const REEL_COUNT = 5;
const SYMBOLS_PER_REEL = 30; // Number of symbols in the strip for spinning
const SPIN_DURATION_BASE = 2000;
const SPIN_DURATION_OFFSET = 500;
const TOKEN_COST = 10;
const STARTING_BALANCE = 100;

// State
let balance = STARTING_BALANCE;
let isSpinning = false;
let reels = [];

// DOM Elements
const balanceDisplay = document.getElementById('balance');
const statusConsole = document.getElementById('status-console');
const spinBtn = document.getElementById('spin-btn');
const insertCoinBtn = document.getElementById('insert-coin-btn');

/**
 * Initialize the game
 */
function init() {
    for (let i = 1; i <= REEL_COUNT; i++) {
        const reelStrip = document.querySelector(`#reel-${i} .reel-strip`);
        reels.push(reelStrip);
        populateReel(reelStrip);
    }

    updateBalanceDisplay();

    spinBtn.addEventListener('click', spin);
    insertCoinBtn.addEventListener('click', insertCoin);
}

/**
 * Populate a reel strip with random symbols
 */
function populateReel(strip, finalSymbol = null) {
    strip.innerHTML = '';
    const symbols = [];
    
    // Create a long list of symbols for the spin effect
    for (let i = 0; i < SYMBOLS_PER_REEL; i++) {
        const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        symbols.push(symbol);
    }

    // If we have a final symbol (from a previous spin result), put it at the end
    if (finalSymbol) {
        symbols[0] = finalSymbol;
    }

    symbols.forEach(symbol => {
        const div = document.createElement('div');
        div.className = 'symbol';
        div.textContent = symbol;
        strip.appendChild(div);
    });

    // Reset position
    strip.style.transition = 'none';
    strip.style.transform = 'translateY(0)';
}

/**
 * Update the balance on screen
 */
function updateBalanceDisplay() {
    balanceDisplay.textContent = balance;
    spinBtn.disabled = balance < TOKEN_COST || isSpinning;
}

/**
 * Add more tokens
 */
function insertCoin() {
    balance += 50;
    logStatus("> COMPUTE BUDGET INCREASED. READY FOR TRAINING.");
    updateBalanceDisplay();
}

/**
 * Log a message to the status console
 */
function logStatus(msg) {
    statusConsole.textContent = msg;
}

/**
 * The core spin logic
 */
async function spin() {
    if (isSpinning || balance < TOKEN_COST) return;

    isSpinning = true;
    balance -= TOKEN_COST;
    updateBalanceDisplay();
    logStatus("> STARTING INFERENCE... STOCHASTIC PARROT ACTIVE.");

    const results = [];
    const promises = [];

    // Start each reel
    reels.forEach((strip, index) => {
        const targetSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        results.push(targetSymbol);

        const duration = SPIN_DURATION_BASE + (index * SPIN_DURATION_OFFSET);
        
        // Add blur
        strip.parentElement.classList.add('blur');
        
        // Set final symbol at the "stop" position (bottom of our animated strip)
        const lastSymbolDiv = strip.lastElementChild;
        lastSymbolDiv.textContent = targetSymbol;

        // Animate
        const p = new Promise(resolve => {
            setTimeout(() => {
                strip.style.transition = `transform ${duration}ms cubic-bezier(0.1, 0, 0.1, 1)`;
                const offset = (SYMBOLS_PER_REEL - 1) * 150; // 150px is symbol height
                strip.style.transform = `translateY(-${offset}px)`;

                setTimeout(() => {
                    strip.parentElement.classList.remove('blur');
                    // Reset the strip to just show the target symbol at top for next spin logic
                    populateReel(strip, targetSymbol);
                    resolve();
                }, duration);
            }, 50);
        });
        
        promises.push(p);
    });

    await Promise.all(promises);
    isSpinning = false;
    checkWins(results);
    updateBalanceDisplay();
}

/**
 * Calculate wins
 */
function checkWins(results) {
    // Basic logic: Count frequency of each symbol
    const counts = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);

    let totalWin = 0;
    let winMessage = "";

    // Check for 3, 4, or 5 of a kind
    for (const [symbol, count] of Object.entries(counts)) {
        if (count >= 3) {
            const baseWin = (6 - SYMBOL_WEIGHTS[symbol]) * 10; // Rarer symbols give more
            const multiplier = count === 5 ? 10 : (count === 4 ? 3 : 1);
            totalWin += baseWin * multiplier;
            
            if (count === 5) winMessage = `AGI ACHIEVED! Gain: ${totalWin}`;
            else if (count === 4) winMessage = `High Confidence Match: ${totalWin}`;
            else winMessage = `Pattern Found: ${totalWin}`;
        }
    }

    if (totalWin > 0) {
        balance += totalWin;
        logStatus(`> ${winMessage} TOKENS.`);
    } else {
        const randomQuip = SATIRICAL_MESSAGES[Math.floor(Math.random() * SATIRICAL_MESSAGES.length)];
        logStatus(`> ${randomQuip}`);
    }
}

// Start
init();
