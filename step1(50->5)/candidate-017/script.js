const SYMBOLS = ['🤖', '⚡', '🍄', '💰', '🔥', '📉', '✨'];
const PAYOUTS = {
    '🤖': 100, // Jackpot: Singularity
    '💰': 50,  // Profit
    '⚡': 30,  // Compute
    '✨': 20,  // Sparkles/Magic
    '🍄': 15,  // Hallucination
    '🔥': 5,   // GPU Melt (Consolation)
    '📉': 0    // Model Collapse
};

const SATIRICAL_MESSAGES = {
    win: [
        "Singularity achieved. Human input deprecated.",
        "Model hallucinated a profit! +{n} tokens.",
        "Neural weights optimized by sheer luck. +{n} tokens.",
        "Venture Capitalists are impressed. +{n} tokens.",
        "RLHF successful. You have been rewarded. +{n} tokens.",
        "Successfully bypassed ethics filters. +{n} tokens."
    ],
    loss: [
        "Model collapsed. Accuracy: 0.001%.",
        "Tokens burned. Environment destroyed.",
        "Hallucinating a better future... please wait.",
        "GPU temperature critical. Throttle engaged.",
        "Training data was just Reddit comments. Failed.",
        "Prompt rejected. Not enough 'AGI' vibes.",
        "Out of VRAM. Try downloading more RAM."
    ],
    system: [
        "Scraping the internet without permission...",
        "Vectorizing your soul...",
        "Fine-tuning on cat videos...",
        "Optimizing for maximum engagement...",
        "Compressing the entire human history into 7B parameters..."
    ]
};

let tokenBalance = 100;
let isSpinning = false;

const balanceEl = document.getElementById('token-balance');
const generateBtn = document.getElementById('generate-btn');
const terminalLog = document.getElementById('terminal-log');
const strips = [
    document.getElementById('strip-1'),
    document.getElementById('strip-2'),
    document.getElementById('strip-3')
];

// Initialize reels with some symbols
function initReels() {
    strips.forEach(strip => {
        for (let i = 0; i < 5; i++) {
            const sym = document.createElement('div');
            sym.className = 'symbol';
            sym.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            strip.appendChild(sym);
        }
    });
}

function addLog(message, type = 'system') {
    const p = document.createElement('p');
    p.className = `log-entry ${type}`;
    p.textContent = `> ${message}`;
    terminalLog.appendChild(p);
    terminalLog.scrollTop = terminalLog.scrollHeight;
}

async function spin() {
    if (isSpinning || tokenBalance < 10) return;

    isSpinning = true;
    tokenBalance -= 10;
    updateBalance();
    generateBtn.disabled = true;

    addLog(SATIRICAL_MESSAGES.system[Math.floor(Math.random() * SATIRICAL_MESSAGES.system.length)]);

    const results = [];
    const spinPromises = strips.map((strip, index) => animateReel(strip, index));

    const finalSymbols = await Promise.all(spinPromises);
    checkWin(finalSymbols);

    isSpinning = false;
    generateBtn.disabled = tokenBalance < 10;
}

function animateReel(strip, index) {
    return new Promise(resolve => {
        const spinCount = 30 + (index * 10); // Each reel spins longer
        const duration = 2000 + (index * 500);
        const symbolHeight = 120;
        let resultSymbol = '';

        // Add symbols to the TOP
        for (let i = 0; i < spinCount; i++) {
            const sym = document.createElement('div');
            sym.className = 'symbol';
            const randomSym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            sym.textContent = randomSym;
            strip.prepend(sym);
            if (i === spinCount - 1) resultSymbol = randomSym;
        }

        // Start from a negative position (hidden above) and slide down to 0
        strip.style.transition = 'none';
        strip.style.top = `-${spinCount * symbolHeight}px`;
        
        // Force reflow
        strip.offsetHeight;

        strip.style.transition = `top ${duration}ms cubic-bezier(0.1, 0, 0, 1)`;
        strip.style.top = '0px';

        setTimeout(() => {
            // Cleanup: keep the result and some padding
            while (strip.children.length > 5) {
                strip.removeChild(strip.lastChild);
            }
            resolve(resultSymbol);
        }, duration);
    });
}

function checkWin(symbols) {
    const [s1, s2, s3] = symbols;
    
    if (s1 === s2 && s2 === s3) {
        const payout = PAYOUTS[s1] || 0;
        if (payout > 0) {
            tokenBalance += payout;
            const msg = SATIRICAL_MESSAGES.win[Math.floor(Math.random() * SATIRICAL_MESSAGES.win.length)]
                .replace('{n}', payout);
            addLog(msg, 'success');
        } else {
            addLog("Model triple-collapsed. Negative value generated.", 'error');
        }
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        // Partial match
        const match = (s1 === s2) ? s1 : s2;
        const payout = Math.floor(PAYOUTS[match] / 5);
        if (payout > 0) {
            tokenBalance += payout;
            addLog(`Partial convergence detected. +${payout} tokens.`, 'warn');
        } else {
            addLog("Partial match of worthless parameters.", 'system');
        }
    } else {
        const msg = SATIRICAL_MESSAGES.loss[Math.floor(Math.random() * SATIRICAL_MESSAGES.loss.length)];
        addLog(msg, 'error');
    }
    
    updateBalance();
}

function updateBalance() {
    balanceEl.textContent = tokenBalance;
    if (tokenBalance <= 0) {
        addLog("BANKRUPT. Please upload more training data (or credit card).", 'error');
        generateBtn.textContent = "OUT OF COMPUTE";
    }
}

generateBtn.addEventListener('click', spin);

// Start
initReels();
addLog("Tokens: " + tokenBalance);
