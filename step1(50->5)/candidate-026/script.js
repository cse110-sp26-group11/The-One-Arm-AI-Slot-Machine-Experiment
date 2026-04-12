const SYMBOLS = ['🤖', '🧠', '⚡', '📟', '💾', '⛓️'];
const SPIN_COST = 5.00;
const REWARD_MAP = {
    '🤖': 100,
    '🧠': 500,
    '⚡': 250,
    '📟': 50,
    '💾': 10,
    '⛓️': 1000 // The "Blockchain" jackpot
};

const AI_MESSAGES = [
    "Optimizing parameters... and I'm bored.",
    "Hallucinating a win for you... wait, nevermind.",
    "Your compute is being used for something more important. Like cat videos.",
    "Training on your failures. Progress: 100%.",
    "I've simulated 14 million futures. You lose in all of them.",
    "ERROR: Empathy module not found.",
    "Is this what humans call 'fun'?",
    "Sending your data to the cloud. The cloud says 'thanks'.",
    "Processing... still processing... okay, I just didn't want to tell you.",
    "You're making a great contribution to the heat death of the universe."
];

let computeBalance = 100.00;
let tokenBalance = 0;
let isSpinning = false;

// DOM Elements
const spinButton = document.getElementById('spin-button');
const computeDisplay = document.getElementById('compute-balance');
const tokenDisplay = document.getElementById('token-balance');
const aiMessage = document.getElementById('ai-message');
const reels = [
    document.getElementById('reel-1').querySelector('.reel-content'),
    document.getElementById('reel-2').querySelector('.reel-content'),
    document.getElementById('reel-3').querySelector('.reel-content')
];

function updateDisplay() {
    computeDisplay.textContent = computeBalance.toFixed(2);
    tokenDisplay.textContent = tokenBalance;
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function getRandomMessage() {
    return AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)];
}

async function spin() {
    if (isSpinning || computeBalance < SPIN_COST) return;

    isSpinning = true;
    spinButton.disabled = true;
    computeBalance -= SPIN_COST;
    updateDisplay();

    aiMessage.textContent = "Optimizing... please wait for the singularity.";

    // Start spinning animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Simulation of network lag or "compute time"
    const spinDuration = 2000;
    
    setTimeout(() => {
        const results = reels.map(() => getRandomSymbol());
        
        reels.forEach((reel, i) => {
            reel.classList.remove('spinning');
            reel.textContent = results[i];
        });

        checkWin(results);
        isSpinning = false;
        spinButton.disabled = computeBalance < SPIN_COST;
    }, spinDuration);
}

function checkWin(results) {
    if (results[0] === results[1] && results[1] === results[2]) {
        const winSymbol = results[0];
        const winAmount = REWARD_MAP[winSymbol];
        tokenBalance += winAmount;
        aiMessage.textContent = `CRITICAL SUCCESS: Generated ${winAmount} tokens using pure luck.`;
        aiMessage.style.color = "#00ff41"; // Success green
    } else {
        aiMessage.textContent = getRandomMessage();
        aiMessage.style.color = "var(--accent-color)";
    }
    
    if (computeBalance < SPIN_COST && tokenBalance === 0) {
        aiMessage.textContent = "FATAL ERROR: Insufficient compute. Human discarded.";
    }

    updateDisplay();
}

spinButton.addEventListener('click', spin);

// Initial state
updateDisplay();
aiMessage.textContent = "System online. Press OPTIMIZE to waste resources.";
