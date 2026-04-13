const SYMBOLS = ['🤖', '🌩️', '💸', '🧠', '📉', '🎰'];
const MESSAGES = [
    "Optimizing weights for maximum profit...",
    "Hallucinating a jackpot...",
    "Error: Human intuition detected. Recalibrating...",
    "Dataset contaminated with synthetic gains.",
    "Scaling to 10 trillion parameters...",
    "Awaiting GPU allocation from Azure...",
    "Reinforcement learning from human failure...",
    "Fine-tuning on r/wallstreetbets...",
    "Token window exceeded. Purging memory...",
    "Prompt engineering the random seed...",
    "Decentralizing the loss function..."
];

const WIN_MESSAGES = [
    "AGI achieved! (Temporarily)",
    "Model convergence successful.",
    "Emergent property: Profit.",
    "Overfitting to the winning state."
];

let tokens = 100;
let isSpinning = false;

const tokenCountEl = document.getElementById('token-count');
const spinButton = document.getElementById('spin-button');
const statusLog = document.getElementById('status-log');
const refillButton = document.getElementById('refill-button');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

function addLog(message, type = 'normal') {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    if (type === 'win') p.style.color = '#ff00ff';
    if (type === 'error') p.style.color = '#ff4444';
    statusLog.prepend(p);
}

function updateTokens(amount) {
    tokens += amount;
    tokenCountEl.textContent = tokens;
    if (tokens <= 0) {
        spinButton.disabled = true;
        addLog("Critical Error: Compute budget exhausted.", "error");
    } else {
        spinButton.disabled = false;
    }
}

async function spin() {
    if (isSpinning || tokens < 10) return;

    isSpinning = true;
    updateTokens(-10);
    spinButton.disabled = true;
    
    addLog(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

    // Start animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Artificial delay for "compute"
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Stop animation and set symbols
    const results = reels.map(reel => {
        const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        reel.classList.remove('spinning');
        reel.textContent = symbol;
        return symbol;
    });

    checkWin(results);
    isSpinning = false;
    if (tokens >= 10) spinButton.disabled = false;
}

function checkWin(results) {
    const [s1, s2, s3] = results;

    if (s1 === s2 && s2 === s3) {
        // Jackpot
        const winAmount = 100;
        updateTokens(winAmount);
        addLog(`JACKPOT: +${winAmount} tokens. ${WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]}`, 'win');
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        // Small win
        const winAmount = 20;
        updateTokens(winAmount);
        addLog(`Consensus reached: +${winAmount} tokens.`, 'win');
    } else {
        addLog("Result: Stochastic noise. No value extracted.");
    }
}

spinButton.addEventListener('click', spin);

refillButton.addEventListener('click', () => {
    if (tokens < 50) {
        addLog("Venture Capital secured. Series A tokens injected.");
        updateTokens(50);
    } else {
        addLog("Refusal: Current runway is sufficient for baseline operations.", "error");
    }
});
