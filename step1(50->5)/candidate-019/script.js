const SYMBOLS = [
    { char: '🎰', name: 'AGI', weight: 1, payout: 100 },
    { char: '🖥️', name: 'GPU', weight: 5, payout: 20 },
    { char: '💸', name: 'VC', weight: 10, payout: 10 },
    { char: '🤖', name: 'LLM', weight: 20, payout: 5 },
    { char: '🌀', name: 'TOKEN', weight: 30, payout: 2 },
    { char: '🤡', name: 'HALLUCINATION', weight: 34, payout: 0 }
];

const SPIN_COST = 10;
let balance = 500;
let isSpinning = false;

const reelStrips = [
    document.getElementById('strip-1'),
    document.getElementById('strip-2'),
    document.getElementById('strip-3')
];
const balanceDisplay = document.getElementById('balance');
const spinButton = document.getElementById('spin-button');
const vcButton = document.getElementById('vc-button');
const statusLog = document.getElementById('status-log');
const slotMachine = document.getElementById('slot-machine');

// Initialize reels with random symbols
function initReels() {
    reelStrips.forEach(strip => {
        strip.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            addSymbolToStrip(strip, getRandomSymbol(), true);
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

function addSymbolToStrip(strip, symbol, atBottom = false) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.textContent = symbol.char;
    div.dataset.name = symbol.name;
    if (atBottom) {
        strip.appendChild(div);
    } else {
        strip.prepend(div);
    }
}

function logStatus(message) {
    const entry = document.createElement('p');
    entry.className = 'status-entry';
    entry.textContent = `> ${message}`;
    statusLog.prepend(entry);
    if (statusLog.childNodes.length > 10) {
        statusLog.removeChild(statusLog.lastChild);
    }
}

async function spin() {
    if (isSpinning || balance < SPIN_COST) return;

    isSpinning = true;
    balance -= SPIN_COST;
    updateUI();
    logStatus(`Burning ${SPIN_COST} tokens for training...`);
    spinButton.disabled = true;
    slotMachine.classList.remove('win-animation');

    const outcomes = [];
    const reelPromises = reelStrips.map((strip, index) => {
        return new Promise(resolve => {
            const outcome = getRandomSymbol();
            outcomes.push(outcome);

            const spinLength = 20 + (index * 10);
            for (let i = 0; i < spinLength; i++) {
                addSymbolToStrip(strip, getRandomSymbol());
            }
            addSymbolToStrip(strip, outcome);

            const offset = (spinLength + 1) * 100;
            strip.style.transition = 'none';
            strip.style.transform = `translateY(-${offset}px)`;

            strip.offsetHeight; // force reflow

            strip.style.transition = `transform ${2 + index}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.transform = 'translateY(0)';

            setTimeout(() => {
                while (strip.childNodes.length > 5) {
                    strip.removeChild(strip.lastChild);
                }
                resolve();
            }, (2 + index) * 1000);
        });
    });

    await Promise.all(reelPromises);
    checkWin(outcomes);
    isSpinning = false;
    updateUI();
}

function checkWin(outcomes) {
    const allMatch = outcomes[0].name === outcomes[1].name && outcomes[1].name === outcomes[2].name;

    if (allMatch) {
        const winSymbol = outcomes[0];
        const winAmount = winSymbol.payout * SPIN_COST;
        balance += winAmount;
        logStatus(`CRITICAL HIT! Matched ${winSymbol.name}. Claimed ${winAmount} tokens.`);
        logStatus(`"This AI is definitely sentient," says local VC.`);
        slotMachine.classList.add('win-animation');
    } else {
        generateLossMessage(outcomes);
    }
}

function generateLossMessage(outcomes) {
    const lossMessages = [
        "Hallucinating a win... wait, no, you lost.",
        "Prompt engineering failed. Try a different seed.",
        "LLM context window full. Forgetting your investment.",
        "Weights initialized to zero. Payout unlikely.",
        "Reinforcement learning: User exhibits 'gambler' behavior.",
        "GPU over-allocation. Computing loss...",
        "Stochastic parrot says: 'Polly wants a token'.",
        "Loss function minimized. Your wallet, specifically.",
        "Emergent behavior: The machine kept your tokens.",
        "Safety alignment triggered: Payout would be 'dangerous'."
    ];

    const hallucinations = outcomes.filter(o => o.name === 'HALLUCINATION').length;
    if (hallucinations > 0) {
        logStatus(`Detected ${hallucinations} hallucination(s). Reality compromised.`);
    }

    const msg = lossMessages[Math.floor(Math.random() * lossMessages.length)];
    logStatus(msg);
}

function updateUI() {
    balanceDisplay.textContent = balance;
    if (balance <= 0) {
        logStatus("LIQUIDATION COMPLETE. Please insert more venture capital.");
        spinButton.textContent = "OUT OF COMPUTE";
        spinButton.disabled = true;
    } else {
        spinButton.textContent = `BURN TOKENS (${SPIN_COST})`;
        if (!isSpinning) spinButton.disabled = false;
    }
}

vcButton.addEventListener('click', () => {
    balance += 500;
    logStatus("Series A secured. 80% equity dilution achieved.");
    logStatus("Burn rate increased. Scaling compute...");
    updateUI();
});

spinButton.addEventListener('click', spin);

initReels();
logStatus("AI Hype Machine v0.1-alpha online.");
