// Configuration
const SYMBOLS = ['🤖', '💾', '🧠', '🔥', '🤡', '📉', '🚀'];
const PAYOUTS = {
    '🚀🚀🚀': 100,
    '🧠🧠🧠': 50,
    '🤖🤖🤖': 20,
    '💾💾💾': 10,
    '🤡🤡🤡': 5,
    '🔥🔥🔥': -50, // GPU Burn out!
};

const LOG_MESSAGES = [
    "Optimizing backpropagation...",
    "Stochastic gradient descent in progress...",
    "Normalizing weight vectors...",
    "Synthesizing emergent behavior...",
    "Quantizing latent space...",
    "Hallucinating statistical anomalies...",
    "Scraping the internet for luck...",
    "Overfitting to your betting patterns...",
    "Reducing loss function...",
    "Regularizing neural pathways...",
];

// State
let tokens = 100;
let bet = 5;
let isSpinning = false;

// DOM Elements
const logDisplay = document.getElementById('log-content');
const tokenDisplay = document.getElementById('token-count');
const betDisplay = document.getElementById('bet-amount');
const spinBtn = document.getElementById('spin-btn');
const adjustBetBtn = document.getElementById('adjust-bet');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Functions
function log(message, type = 'info') {
    logDisplay.innerText = `> ${message}`;
    logDisplay.style.color = type === 'error' ? 'var(--error-color)' : 'var(--text-color)';
    // Reset animation
    logDisplay.style.animation = 'none';
    logDisplay.offsetHeight; // trigger reflow
    logDisplay.style.animation = null;
}

function updateStats() {
    tokenDisplay.innerText = tokens;
    betDisplay.innerText = bet;
    
    if (tokens <= 0) {
        log("OUT OF MEMORY ERROR. INSUFFICIENT TOKENS.", "error");
        spinBtn.disabled = true;
    }
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

async function spin() {
    if (isSpinning || tokens < bet) return;

    isSpinning = true;
    tokens -= bet;
    updateStats();
    
    log(LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]);
    
    // Start animation
    reels.forEach(reel => reel.classList.add('spinning'));
    spinBtn.disabled = true;

    // Simulate training time with interim symbols
    const interval = setInterval(() => {
        reels.forEach(reel => {
            if (reel.classList.contains('spinning')) {
                reel.innerText = getRandomSymbol();
            }
        });
    }, 100);

    await new Promise(resolve => setTimeout(resolve, 1500));
    clearInterval(interval);

    // Stop animation and set symbols
    const results = reels.map(reel => {
        const symbol = getRandomSymbol();
        reel.innerText = symbol;
        reel.classList.remove('spinning');
        return symbol;
    });

    evaluate(results);
    isSpinning = false;
    spinBtn.disabled = tokens < bet;
}

function evaluate(results) {
    const combo = results.join('');
    let winAmount = 0;

    if (PAYOUTS[combo]) {
        winAmount = PAYOUTS[combo] * (bet / 5);
        tokens += winAmount;
        
        if (winAmount > 0) {
            log(`SUCCESS: Emergent luck detected! +${winAmount} tokens.`, 'info');
        } else {
            log(`CRITICAL FAILURE: GPU Thermal Throttling. ${winAmount} tokens.`, 'error');
        }
    } else {
        // Partial wins?
        if (results[0] === results[1] || results[1] === results[2]) {
            log("Convergence failure. Partial match identified.", 'info');
        } else {
            log("Convergence failed. Model collapsed.", 'info');
        }
    }

    updateStats();
}

function adjustBet() {
    const bets = [5, 10, 25, 50];
    const currentIndex = bets.indexOf(bet);
    bet = bets[(currentIndex + 1) % bets.length];
    log(`Hyperparameters adjusted. Learning rate (Bet) set to ${bet}.`);
    updateStats();
}

// Event Listeners
spinBtn.addEventListener('click', spin);
adjustBetBtn.addEventListener('click', adjustBet);

// Initial State
updateStats();
log("System online. Neural weights initialized.");
