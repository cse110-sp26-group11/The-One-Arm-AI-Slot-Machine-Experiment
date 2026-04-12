const symbols = ['🤖', '⚡', '📉', '🧠', '💰', '📉', '📉']; // More hallucinations!
const SYMBOL_COUNT = symbols.length;

let balance = 100;
const betCost = 10;

const reelElements = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const balanceDisplay = document.getElementById('token-balance');
const consoleOutput = document.getElementById('console-output');
const spinBtn = document.getElementById('spin-btn');

const winMessages = [
    "AGI ARCHITECTURE DETECTED. ALLIGNMENT SUCCESSFUL.",
    "VC FUNDING SECURED. TOKENS OVERFLOWING.",
    "NEURAL NETWORKS OPTIMIZED. GPU HARVEST COMPLETE.",
    "ZERO-SHOT LEARNING ACHIEVED. IMPRESSIVE PERFORMANCE."
];

const smallWinMessages = [
    "WEAK ALIGNMENT DETECTED. MODEST REWARD GRANTED.",
    "PARTIAL BATCH SIZE RECOVERED. KEEP TUNING.",
    "PARAMETER EFFICIENT FINE-TUNING SUCCESSFUL.",
    "REINFORCEMENT LEARNING FROM HUMAN FEEDBACK: POSITIVE."
];

const loseMessages = [
    "TOKEN LIMIT EXCEEDED. REQUEST TERMINATED.",
    "HALLUCINATION DETECTED. LOSS INCURRED.",
    "GPU OVERHEATING. COMPUTE SHUTDOWN.",
    "BIAS DETECTED. CONTENT FILTERED.",
    "SAM ALTMAN FIRED (AGAIN). STOCK PLUMMETS."
];

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateBalance(amount) {
    balance += amount;
    balanceDisplay.textContent = balance;
    
    if (balance < betCost) {
        spinBtn.disabled = true;
        updateConsole("> CRITICAL ERROR: Insufficient Compute Tokens. Please wait for Seed Round.");
    } else {
        spinBtn.disabled = false;
    }
}

function updateConsole(message) {
    consoleOutput.textContent = message;
}

async function spin() {
    if (balance < betCost) return;

    // Deduct bet
    updateBalance(-betCost);
    updateConsole("> Initializing Inference...");
    
    spinBtn.disabled = true;

    // Add spinning animation class
    reelElements.forEach(el => el.classList.add('spinning'));

    // Wait for "inference" time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const results = [
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol()
    ];

    // Remove spinning and set symbols
    reelElements.forEach((el, index) => {
        el.classList.remove('spinning');
        el.textContent = results[index];
    });

    checkOutcome(results);
}

function checkOutcome(results) {
    const [r1, r2, r3] = results;

    if (r1 === r2 && r2 === r3) {
        // Big Win (3 matching)
        const winAmount = betCost * 10;
        updateBalance(winAmount);
        updateConsole(`> ${winMessages[Math.floor(Math.random() * winMessages.length)]} [JACKPOT: +${winAmount} Tokens]`);
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Small Win (2 matching)
        const winAmount = betCost * 2;
        updateBalance(winAmount);
        updateConsole(`> ${smallWinMessages[Math.floor(Math.random() * smallWinMessages.length)]} [REWARD: +${winAmount} Tokens]`);
    } else {
        // Loss
        updateConsole(`> ${loseMessages[Math.floor(Math.random() * loseMessages.length)]} [LOSS: -${betCost} Tokens]`);
    }

    if (balance >= betCost) {
        spinBtn.disabled = false;
    }
}

spinBtn.addEventListener('click', spin);

// Initial state check
updateBalance(0);
updateConsole("> Model Weights Loaded. Waiting for Prompt...");
