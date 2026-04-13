const SYMBOLS = ['🤖', '🧠', '⚡', '💾', '💸', '📈', '📉', '🖥️'];
const SYMBOL_VALUES = {
    '🤖': 100, // AGI
    '🧠': 50,  // Neural Net
    '⚡': 25,  // Compute
    '💾': 15,  // Data
    '💸': 10,  // Token
    '📈': 5,   // Scale
    '📉': 2,   // Loss
    '🖥️': 1    // Hardware
};

let balance = 1000;
let isSpinning = false;

const balanceEl = document.getElementById('balance');
const lastWinEl = document.getElementById('last-win');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const betEl = document.getElementById('bet');
const logsEl = document.getElementById('logs');
const strips = [
    document.getElementById('strip1'),
    document.getElementById('strip2'),
    document.getElementById('strip3')
];

// Satirical AI logs
const LOG_MESSAGES = [
    "Optimizing loss function...",
    "Aligning values with human expectations...",
    "Collecting more training data...",
    "Quantizing model weights to 4-bit...",
    "Injecting synthetic hallucinations...",
    "Expanding context window...",
    "Scaling to 1.7 trillion parameters...",
    "Reducing gradient explosion...",
    "Overfitting to user preferences...",
    "Achieving emergent behavior..."
];

function addLog(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `> ${message}`;
    logsEl.prepend(entry);
    if (logsEl.childNodes.length > 20) {
        logsEl.removeChild(logsEl.lastChild);
    }
}

function initReels() {
    strips.forEach(strip => {
        strip.innerHTML = '';
        // Create a long strip of symbols for each reel
        for (let i = 0; i < 30; i++) {
            const symbol = document.createElement('div');
            symbol.className = 'symbol';
            symbol.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            strip.appendChild(symbol);
        }
    });
}

function spin() {
    if (isSpinning) return;
    
    const bet = parseInt(betEl.value);
    if (balance < bet) {
        addLog("CRITICAL ERROR: Insufficient compute tokens. Re-seed required.");
        resetBtn.classList.remove('hidden');
        return;
    }

    isSpinning = true;
    balance -= bet;
    updateUI();
    
    spinBtn.disabled = true;
    spinBtn.textContent = "PROCESSING...";
    addLog(`Initiating generation. Cost: ${bet} tokens.`);

    const results = [];
    
    strips.forEach((strip, index) => {
        const randomSymbolIndex = Math.floor(Math.random() * SYMBOLS.length);
        const finalSymbol = SYMBOLS[randomSymbolIndex];
        results.push(finalSymbol);

        // Calculate the target position
        // We want to land on a symbol at the top of the strip.
        // We'll move the strip so that the selected symbol is visible.
        // We use a high index to ensure multiple rotations.
        const symbolHeight = 150;
        const totalSymbols = strip.childNodes.length;
        const targetIndex = totalSymbols - 3 + index; // Offset slightly for variety
        
        // Actually, let's just replace the symbol at a specific index to ensure we know what it is
        const landingIndex = 2; // The 3rd symbol from the top (index 2) will be our result
        strip.childNodes[landingIndex].textContent = finalSymbol;
        
        // Reset position without transition then animate
        strip.style.transition = 'none';
        strip.style.transform = `translateY(-${(totalSymbols - 3) * symbolHeight}px)`;
        
        // Force reflow
        strip.offsetHeight;
        
        strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        strip.style.transform = `translateY(-${landingIndex * symbolHeight}px)`;
    });

    setTimeout(() => {
        checkWin(results);
        isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.textContent = "GENERATE RESPONSE";
        if (Math.random() > 0.7) {
            addLog(LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]);
        }
    }, 3500);
}

function triggerWinAnimation() {
    const machine = document.querySelector('.slot-machine');
    machine.classList.add('win-animation');
    setTimeout(() => machine.classList.remove('win-animation'), 2000);
}

function checkWin(results) {
    let winAmount = 0;
    const [s1, s2, s3] = results;

    if (s1 === s2 && s2 === s3) {
        // 3 of a kind
        winAmount = SYMBOL_VALUES[s1] * 10;
        addLog(`EMERGENT SUCCESS: Triple ${s1} detected! Payout: ${winAmount}`);
        triggerWinAnimation();
    } else if (s1 === s2 || s2 === s3) {
        // 2 of a kind
        const matchingSymbol = (s1 === s2) ? s1 : s2;
        winAmount = SYMBOL_VALUES[matchingSymbol] * 2;
        addLog(`STOCHASTIC MATCH: Double ${matchingSymbol}. Payout: ${winAmount}`);
    } else {
        addLog("GENERATION FAILED: No patterns detected in output.");
    }

    if (winAmount > 0) {
        balance += winAmount;
        lastWinEl.textContent = winAmount;
        lastWinEl.classList.add('win-animation');
        setTimeout(() => lastWinEl.classList.remove('win-animation'), 2000);
    } else {
        lastWinEl.textContent = 0;
    }
    
    updateUI();
}

function updateUI() {
    balanceEl.textContent = balance;
    if (balance <= 0) {
        resetBtn.classList.remove('hidden');
    }
}

function reset() {
    balance = 1000;
    lastWinEl.textContent = 0;
    updateUI();
    resetBtn.classList.add('hidden');
    addLog("Model re-seeded. Context window cleared.");
}

spinBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', reset);

initReels();
updateUI();
