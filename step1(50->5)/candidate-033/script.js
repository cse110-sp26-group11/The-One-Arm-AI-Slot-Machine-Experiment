const SYMBOLS = [
    { char: '🤖', value: 50, name: 'AGI', weight: 5 },
    { char: '💎', value: 20, name: 'VC Funding', weight: 10 },
    { char: '🧠', value: 10, name: 'Neural Net', weight: 15 },
    { char: '☁️', value: 5, name: 'The Cloud', weight: 20 },
    { char: '🔥', value: 2, name: 'GPU Heat', weight: 25 },
    { char: '📉', value: 0, name: 'Hallucination', weight: 25 }
];

const MESSAGES = [
    "Optimizing weights...",
    "Injecting randomness...",
    "Calculating loss function...",
    "Consulting the transformer...",
    "Bypassing safety filters...",
    "Hallucinating a jackpot...",
    "Prompt engineering in progress...",
    "Vectorizing your hope...",
    "Minimizing training error...",
    "Expanding context window..."
];

const WIN_MESSAGES = [
    "Jackpot! Inference successful.",
    "VC Funding secured! Series A starts now.",
    "Neural Net converged on wealth.",
    "Training complete. You are rich.",
    "Model output: PURE GOLD."
];

const LOSS_MESSAGES = [
    "Overfitting detected. Tokens lost.",
    "Hallucination error: Balance decreased.",
    "GPU meltdown! System rebooting...",
    "Out of tokens. Please upgrade your plan.",
    "Safety filter triggered: Jackpot blocked."
];

let tokens = 1000;
let currentBet = 10;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-balance');
const betDisplay = document.getElementById('current-bet');
const statusDisplay = document.getElementById('status-message');
const spinButton = document.getElementById('spin-button');
const betIncrease = document.getElementById('bet-increase');
const betDecrease = document.getElementById('bet-decrease');
const reelStrips = document.querySelectorAll('.reel-strip');
const slotMachine = document.querySelector('.slot-machine');

// Initialize Reels
function initReels() {
    reelStrips.forEach(strip => {
        // Create a long strip of symbols for each reel
        for (let i = 0; i < 30; i++) {
            const symbol = getRandomSymbol();
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.char;
            strip.appendChild(div);
        }
    });
}

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const symbol of SYMBOLS) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

function updateBet(amount) {
    if (isSpinning) return;
    const newBet = currentBet + amount;
    if (newBet >= 10 && newBet <= tokens) {
        currentBet = newBet;
        betDisplay.textContent = currentBet;
    }
}

async function spin() {
    if (isSpinning || tokens < currentBet) return;

    isSpinning = true;
    tokens -= currentBet;
    tokenDisplay.textContent = tokens;
    spinButton.disabled = true;
    
    // Update status to a random "AI" message
    statusDisplay.textContent = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    statusDisplay.style.color = '#3fb950';

    const results = [];
    const reelPromises = [];

    reelStrips.forEach((strip, index) => {
        const promise = new Promise(resolve => {
            const reelResult = getRandomSymbol();
            results.push(reelResult);

            // Calculate the move
            const symbolHeight = 150; // Match CSS --reel-height
            const totalSymbols = strip.children.length;
            
            // Add the new result to the bottom of the strip to ensure it's what we land on
            const resultDiv = document.createElement('div');
            resultDiv.className = 'symbol';
            resultDiv.textContent = reelResult.char;
            strip.appendChild(resultDiv);

            // Animation timing
            const delay = index * 200;
            const duration = 2000 + (index * 500);

            setTimeout(() => {
                strip.style.transition = `transform ${duration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
                const offset = (totalSymbols) * symbolHeight;
                strip.style.transform = `translateY(-${offset}px)`;

                setTimeout(() => {
                    resolve();
                }, duration);
            }, delay);
        });
        reelPromises.push(promise);
    });

    await Promise.all(reelPromises);
    checkWin(results);
    isSpinning = false;
    spinButton.disabled = false;
    
    // Reset strips for next spin (teleport back to top with new symbols)
    resetStrips(results);
}

function resetStrips(lastResults) {
    reelStrips.forEach((strip, index) => {
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        
        // Keep the last result as the first symbol
        strip.innerHTML = '';
        const firstDiv = document.createElement('div');
        firstDiv.className = 'symbol';
        firstDiv.textContent = lastResults[index].char;
        strip.appendChild(firstDiv);

        // Re-fill the rest
        for (let i = 0; i < 30; i++) {
            const symbol = getRandomSymbol();
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.char;
            strip.appendChild(div);
        }
    });
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    let winAmount = 0;

    if (r1.char === r2.char && r2.char === r3.char) {
        // Three of a kind
        winAmount = r1.value * currentBet;
        statusDisplay.textContent = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
        statusDisplay.style.color = '#f2cc60';
        slotMachine.classList.add('win-animation');
        setTimeout(() => slotMachine.classList.remove('win-animation'), 2000);
    } else if (r1.char === r2.char || r2.char === r3.char || r1.char === r3.char) {
        // Two of a kind
        const pairSymbol = (r1.char === r2.char || r1.char === r3.char) ? r1 : r2;
        winAmount = Math.floor(pairSymbol.value * 0.5 * currentBet);
        statusDisplay.textContent = "Partial convergence detected. Small gain.";
        statusDisplay.style.color = '#58a6ff';
    } else {
        statusDisplay.textContent = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
        statusDisplay.style.color = '#da3633';
    }

    if (winAmount > 0) {
        tokens += winAmount;
        tokenDisplay.textContent = tokens;
    }

    if (tokens <= 0) {
        statusDisplay.textContent = "BANKRUPT! Refresh to beg for more tokens.";
        spinButton.disabled = true;
    }
}

// Event Listeners
spinButton.addEventListener('click', spin);
betIncrease.addEventListener('click', () => updateBet(10));
betDecrease.addEventListener('click', () => updateBet(-10));

// Start the machine
initReels();
