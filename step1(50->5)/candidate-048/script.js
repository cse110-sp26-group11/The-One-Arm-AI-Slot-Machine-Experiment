const SYMBOLS = ['🤖', '⚡', '🧠', '💩', '💸', '🧬', '💾'];
const SPIN_COST = 10;
const WIN_MULTIPLIER = 50; // Big win for 3 of a kind

const STATUS_MESSAGES = [
    "Synthesizing nonsense...",
    "Querying GPU clusters...",
    "Hallucinating a jackpot...",
    "Spending VC funding...",
    "Optimizing loss curve...",
    "Fine-tuning weights...",
    "Awaiting Sam Altman's approval...",
    "Scraping training data...",
    "Calculating alignment...",
    "Entering latent space...",
    "Tokenizing reality...",
    "Overfitting to your luck...",
    "Bypassing safety filters...",
    "Scaling parameters..."
];

let balance = 1000;
let isSpinning = false;

// DOM Elements
const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const balanceDisplay = document.getElementById('token-balance');
const statusDisplay = document.getElementById('model-status');
const spinBtn = document.getElementById('spin-btn');

function updateUI() {
    balanceDisplay.textContent = balance;
    spinBtn.disabled = balance < SPIN_COST || isSpinning;
    
    if (balance < 50 && balance >= SPIN_COST) {
        balanceDisplay.style.color = 'var(--neon-pink)';
        balanceDisplay.textContent += " (RUNNING OUT OF FUNDING!)";
    } else {
        balanceDisplay.style.color = 'var(--neon-blue)';
    }
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function getRandomStatus() {
    return STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)];
}

async function spin() {
    if (isSpinning || balance < SPIN_COST) return;

    isSpinning = true;
    balance -= SPIN_COST;
    updateUI();

    statusDisplay.textContent = getRandomStatus();
    statusDisplay.classList.remove('critical-error');
    
    // Reset reel styles
    reelElements.forEach(reel => {
        reel.classList.add('spinning');
        reel.classList.remove('winning-glow');
    });

    // Simulation of spinning time
    const results = [null, null, null];
    
    // Resolve reels one by one
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + i * 300));
        results[i] = getRandomSymbol();
        reelElements[i].textContent = results[i];
        reelElements[i].classList.remove('spinning');
    }

    isSpinning = false;
    checkWin(results);
    updateUI();
}

function checkWin(results) {
    const [r1, r2, r3] = results;

    if (r1 === r2 && r2 === r3) {
        let winAmount = SPIN_COST * WIN_MULTIPLIER;
        
        // Special multiplier for the AI brain symbol
        if (r1 === '🧠') winAmount *= 2;
        // Penality for the poop symbol
        if (r1 === '💩') winAmount = 1;

        balance += winAmount;
        
        if (r1 === '💩') {
            statusDisplay.textContent = "CRITICAL ERROR: Hallucinated a win. Payout: 1 token.";
            statusDisplay.classList.add('critical-error');
        } else {
            statusDisplay.textContent = `SUCCESS: Synthesis complete! Gained ${winAmount} tokens.`;
            reelElements.forEach(reel => reel.classList.add('winning-glow'));
        }
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Small win for 2 matches
        const winAmount = SPIN_COST * 2;
        balance += winAmount;
        statusDisplay.textContent = `PARTIAL MATCH: High confidence score. Gained ${winAmount} tokens.`;
        
        // Glow only the matching reels
        if (r1 === r2) {
            reelElements[0].classList.add('winning-glow');
            reelElements[1].classList.add('winning-glow');
        } else if (r2 === r3) {
            reelElements[1].classList.add('winning-glow');
            reelElements[2].classList.add('winning-glow');
        } else if (r1 === r3) {
            reelElements[0].classList.add('winning-glow');
            reelElements[2].classList.add('winning-glow');
        }
    } else {
        statusDisplay.textContent = "INFERENCE FAILED: Model produced noise.";
        
        // Randomly lose extra tokens for "GPU Overheating"
        if (Math.random() < 0.1) {
            const extraLoss = 5;
            balance = Math.max(0, balance - extraLoss);
            statusDisplay.textContent = `HARDWARE ERROR: GPU overheated. Lost extra ${extraLoss} tokens.`;
            statusDisplay.classList.add('critical-error');
        }
    }
}

spinBtn.addEventListener('click', spin);

// Initial UI state
updateUI();
