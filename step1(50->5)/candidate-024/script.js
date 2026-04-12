// Configuration
const SYMBOLS = ['🧠', '🤖', '🤪', '💸', '🌟'];
const COST_PER_SPIN = 32768;
const INITIAL_BALANCE = 1000000;
const REEL_COUNT = 3;
const SYMBOLS_PER_REEL = 20; // Number of symbols in the spinning strip

// State
let balance = INITIAL_BALANCE;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-balance');
const statusMessage = document.getElementById('status-message');
const spinButton = document.getElementById('spin-button');
const promptInput = document.getElementById('prompt-input');
const strips = [
    document.getElementById('strip-0'),
    document.getElementById('strip-1'),
    document.getElementById('strip-2')
];

// Initialize
function init() {
    updateBalanceDisplay();
    strips.forEach((strip, index) => {
        populateStrip(strip, SYMBOLS[0]); // Start with Brains
    });
}

function populateStrip(strip, finalSymbol) {
    strip.innerHTML = '';
    // Create a long strip of symbols
    // The last symbol in the DOM (but first visible at top:0) is what we see
    // We actually want the strip to start at the bottom and move up
    // Or start at top and move down. 
    // Let's use: top: 0, and we translate Y downwards.
    
    for (let i = 0; i < SYMBOLS_PER_REEL; i++) {
        const symbolDiv = document.createElement('div');
        symbolDiv.className = 'symbol';
        // The last symbol (i = SYMBOLS_PER_REEL - 1) will be the one it lands on
        if (i === SYMBOLS_PER_REEL - 1) {
            symbolDiv.textContent = finalSymbol;
        } else {
            symbolDiv.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        }
        strip.appendChild(symbolDiv);
    }
}

function updateBalanceDisplay() {
    tokenDisplay.textContent = balance.toLocaleString();
    if (balance < COST_PER_SPIN) {
        tokenDisplay.style.color = 'var(--danger-color)';
    }
}

function getSatiricalMessage(results) {
    const counts = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);

    if (counts['🌟'] === 3) return "JACKPOT! AGI ACHIEVED. All problems solved forever. (Wait, why is the server melting?)";
    if (counts['🤖'] === 3) return "Congratulations! Your job has been automated. Here is your severance in compute tokens.";
    if (counts['🧠'] === 3) return "Model converged! Your prompt engineering was slightly more than placebo.";
    if (counts['🤪'] === 3) return "CRITICAL FAILURE: The model is hallucinating that it's a cat. Extra compute burned.";
    if (counts['💸'] === 3) return "Venture Capital Infusion! Keep burning those tokens, profitability is for the weak.";
    
    // Near misses or mixed
    if (Object.values(counts).includes(2)) {
        if (counts['🤪']) return "Hallucination detected. Output safety filtered. No tokens earned.";
        return "Almost intelligent! Just a few more billion parameters and we'll get there.";
    }

    const genericMessages = [
        "Prompt rejected by safety filters. Try again.",
        "Token limit exceeded. Please upgrade your subscription.",
        "Generating 'highly creative' nonsense...",
        "Context window overflow. Forgot what we were doing.",
        "Optimization failed. Try adding 'Think step by step' to your prompt."
    ];
    return genericMessages[Math.floor(Math.random() * genericMessages.length)];
}

function calculatePayout(results) {
    const counts = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);

    if (counts['🌟'] === 3) return 10000000; // Jackpot
    if (counts['🤖'] === 3) return 500000;
    if (counts['🧠'] === 3) return 250000;
    if (counts['💸'] === 3) return 750000;
    if (counts['🤪'] === 3) return -100000; // Penalty for hallucinations

    return 0;
}

async function spin() {
    if (isSpinning || balance < COST_PER_SPIN) {
        if (balance < COST_PER_SPIN) {
            statusMessage.textContent = "Insufficient tokens. Please wait for a government subsidy or a Series B.";
            document.querySelector('.stats-panel').classList.add('error-shake');
            setTimeout(() => document.querySelector('.stats-panel').classList.remove('error-shake'), 300);
        }
        return;
    }

    isSpinning = true;
    balance -= COST_PER_SPIN;
    updateBalanceDisplay();
    spinButton.disabled = true;
    statusMessage.textContent = "Inference in progress... Generating future...";

    const finalResults = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];

    // Special case for AGI rarity
    if (Math.random() > 0.05) { // 95% chance to replace AGI if it rolled
        finalResults.forEach((s, i) => {
            if (s === '🌟') finalResults[i] = SYMBOLS[Math.floor(Math.random() * 4)];
        });
    }

    // Prepare reels
    strips.forEach((strip, i) => {
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        populateStrip(strip, finalResults[i]);
    });

    // Force reflow
    void strips[0].offsetHeight;

    // Start animation
    strips.forEach((strip, i) => {
        strip.style.transition = `transform ${2 + i * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        // Move so the last symbol is visible
        // Each symbol is 200px. We want to show the last one.
        // There are SYMBOLS_PER_REEL symbols.
        // To show the last one (index SYMBOLS_PER_REEL - 1) at the top of the container:
        const travel = (SYMBOLS_PER_REEL - 1) * 200;
        strip.style.transform = `translateY(-${travel}px)`;
    });

    // Wait for the last reel to stop
    setTimeout(() => {
        isSpinning = false;
        spinButton.disabled = false;
        
        const payout = calculatePayout(finalResults);
        balance += payout;
        updateBalanceDisplay();
        
        statusMessage.textContent = getSatiricalMessage(finalResults);
    }, 3000); // Match longest transition duration
}

spinButton.addEventListener('click', spin);
promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') spin();
});

init();
