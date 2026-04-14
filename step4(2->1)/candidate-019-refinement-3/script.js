const SYMBOLS = [
    { char: '🚀', name: 'AGI', payout: 100 },
    { char: '💎', name: 'GPU', payout: 25 },
    { char: '🦄', name: 'UNICORN', payout: 15 },
    { char: '🤖', name: 'LLM', payout: 10 },
    { char: '🌀', name: 'TOKEN', payout: 5 },
    { char: '🤡', name: 'HALLUCINATION', payout: 0 }
];

const ALIGNMENTS = {
    balanced: { weights: [2, 8, 15, 25, 30, 20], name: "BALANCED" },
    growth: { weights: [1, 5, 10, 20, 40, 24], name: "VC GROWTH (High Volatility)" },
    safety: { weights: [0, 0, 0, 15, 25, 60], name: "RLHF SAFETY (Low Risk)" },
    chaos: { weights: [5, 15, 20, 5, 5, 50], name: "DEEP HALLUCINATION" }
};

let currentAlignment = 'balanced';
let balance = 500;
let currentBet = 10;
let isSpinning = false;
let fundingRound = 0;
let hypeLevel = 0;
const ROUND_NAMES = ["PRE-SEED", "SEED", "SERIES A", "SERIES B", "SERIES C", "IPO", "ACQUIRED BY BIG TECH"];

// DOM Elements
const reelStrips = [
    document.getElementById('strip-1'),
    document.getElementById('strip-2'),
    document.getElementById('strip-3')
];
const balanceDisplay = document.getElementById('balance');
const hypeDisplay = document.getElementById('hype-level');
const betDisplay = document.getElementById('current-bet');
const spinButton = document.getElementById('spin-button');
const vcButton = document.getElementById('vc-button');
const infoButton = document.getElementById('info-button');
const statusLog = document.getElementById('status-log');
const slotMachine = document.getElementById('slot-machine');
const winLine = document.getElementById('win-line');
const betUp = document.getElementById('bet-up');
const betDown = document.getElementById('bet-down');
const modalOverlay = document.getElementById('modal-overlay');
const paytableModal = document.getElementById('paytable-modal');
const paytableGrid = document.getElementById('paytable-grid');
const closeModalBtns = document.querySelectorAll('.close-modal');
const alignmentBtns = document.querySelectorAll('.alignment-btn');

// --- Audio Engine (Synthesized) ---
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(freq, type = 'sine', duration = 0.1, volume = 0.1, slide = 0) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    if (slide !== 0) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, freq + slide), audioCtx.currentTime + duration);
    }
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

const sounds = {
    spin: () => playSound(200 + Math.random() * 50, 'square', 0.05, 0.02),
    stop: () => playSound(150, 'triangle', 0.2, 0.1, -50),
    win: () => {
        const now = audioCtx.currentTime;
        [440, 554.37, 659.25, 880].forEach((f, i) => {
            setTimeout(() => playSound(f, 'triangle', 0.3, 0.1), i * 100);
        });
    },
    click: () => playSound(800, 'sine', 0.05, 0.05),
    fail: () => playSound(100, 'sawtooth', 0.4, 0.08, -40),
    hype: () => playSound(300, 'sine', 0.6, 0.1, 500),
    alignment: () => playSound(500, 'sine', 0.15, 0.05, -150)
};

// --- Initialization ---
function init() {
    initReels();
    renderPaytable();
    updateUI();
    logStatus("AI Hype Engine v2.0 initialized.");
    logStatus("Model weights loaded from Silicon Valley.");
}

function initReels() {
    reelStrips.forEach(strip => {
        strip.innerHTML = '';
        // Add some initial symbols
        for (let i = 0; i < 5; i++) {
            addSymbolToStrip(strip, getRandomSymbol());
        }
    });
}

function renderPaytable() {
    paytableGrid.innerHTML = '';
    SYMBOLS.forEach(s => {
        const item = document.createElement('div');
        item.className = 'pay-item';
        item.innerHTML = `
            <span class="symbol-mini">${s.char}</span>
            <span class="payout-val">x${s.payout}</span>
        `;
        paytableGrid.appendChild(item);
    });
}

function getRandomSymbol() {
    const weights = ALIGNMENTS[currentAlignment].weights;
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < SYMBOLS.length; i++) {
        if (random < weights[i]) return SYMBOLS[i];
        random -= weights[i];
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

function addSymbolToStrip(strip, symbol) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.textContent = symbol.char;
    div.dataset.name = symbol.name;
    strip.prepend(div);
}

function logStatus(message) {
    const entry = document.createElement('p');
    entry.className = 'status-entry';
    entry.textContent = `> ${message}`;
    statusLog.prepend(entry);
    if (statusLog.childNodes.length > 20) {
        statusLog.removeChild(statusLog.lastChild);
    }
}

async function spin() {
    initAudio();
    if (isSpinning || balance < currentBet) {
        if (balance < currentBet) {
            logStatus("CRITICAL ERROR: OUT OF COMPUTE POWER.");
            sounds.fail();
            slotMachine.style.transform = "translateX(5px)";
            setTimeout(() => slotMachine.style.transform = "translateX(-5px)", 50);
            setTimeout(() => slotMachine.style.transform = "translateX(0)", 100);
        }
        return;
    }

    // Reset state
    isSpinning = true;
    balance -= currentBet;
    updateUI();
    sounds.click();
    
    // UI feedback
    spinButton.disabled = true;
    winLine.classList.remove('active');
    slotMachine.classList.remove('win-animation');
    document.querySelectorAll('.symbol').forEach(s => s.classList.remove('win-highlight'));

    logStatus(`Executing inference... [Bet: ${currentBet}]`);

    const outcomes = [];
    const SYMBOL_HEIGHT = 100;
    const MIN_SPIN_SYMBOLS = 20;

    const reelPromises = reelStrips.map((strip, index) => {
        return new Promise(resolve => {
            const outcome = getRandomSymbol();
            outcomes.push(outcome);

            const extraSymbols = MIN_SPIN_SYMBOLS + (index * 10);
            
            // Prepare the strip: add symbols above the current view
            for (let i = 0; i < extraSymbols; i++) {
                addSymbolToStrip(strip, getRandomSymbol());
            }
            addSymbolToStrip(strip, outcome);

            const totalNewSymbols = extraSymbols + 1;
            const targetOffset = totalNewSymbols * SYMBOL_HEIGHT;

            // Reset position instantly to allow for continuous-looking spin
            strip.style.transition = 'none';
            strip.style.transform = `translateY(-${targetOffset}px)`;
            
            // Add blur to all symbols in this strip
            Array.from(strip.children).forEach(s => s.classList.add('blur'));

            strip.offsetHeight; // force reflow

            // Start spin animation
            const duration = 2.5 + index * 0.5;
            strip.style.transition = `transform ${duration}s cubic-bezier(0.15, 0, 0.1, 1)`;
            strip.style.transform = 'translateY(0)';

            // Sound ticks
            let tickCount = 0;
            const tickInterval = setInterval(() => {
                if (tickCount < totalNewSymbols) {
                    sounds.spin();
                    tickCount++;
                } else {
                    clearInterval(tickInterval);
                }
            }, (duration * 1000) / totalNewSymbols);

            setTimeout(() => {
                // Remove blur
                Array.from(strip.children).forEach(s => s.classList.remove('blur'));
                
                // Keep only a few symbols for performance and next spin
                while (strip.children.length > 5) {
                    strip.removeChild(strip.lastChild);
                }
                
                sounds.stop();
                resolve();
            }, duration * 1000);
        });
    });

    await Promise.all(reelPromises);
    
    checkWin(outcomes);
    isSpinning = false;
    updateUI();
}

function checkWin(outcomes) {
    const isWin = outcomes[0].name === outcomes[1].name && outcomes[1].name === outcomes[2].name;

    if (isWin) {
        const winSymbol = outcomes[0];
        if (winSymbol.payout > 0) {
            const winAmount = winSymbol.payout * currentBet;
            balance += winAmount;
            hypeLevel = Math.min(100, hypeLevel + 15);
            
            // Visual feedback
            sounds.win();
            winLine.classList.add('active');
            slotMachine.classList.add('win-animation');
            
            // Highlight the winning symbols (they are the first child of each strip now)
            reelStrips.forEach(strip => {
                strip.firstChild.classList.add('win-highlight');
            });

            logStatus(`!!!! CONVERGENCE ACHIEVED !!!!`);
            logStatus(`Matched 3x ${winSymbol.name}. Payout: ${winAmount} COMPUTE.`);
            
            if (winSymbol.payout >= 50) {
                logStatus("BIG TECH IS CALLING. THEY WANT TO ACQUIRE.");
            }
        } else {
            logStatus(`TRIPLE HALLUCINATION! Data consistency error.`);
            logStatus(`The AI convinced the auditors this was a win, but no funds were found.`);
            sounds.fail();
        }
    } else {
        generateLossMessage(outcomes);
    }
}

function generateLossMessage(outcomes) {
    const lossMessages = [
        "Prompt injection failed. Try a different jailbreak.",
        "Token limit reached. Forgetting your wallet exists.",
        "Model training on your loss data... Efficiency increased.",
        "Safety filters triggered: Payout was deemed 'harmful' to ROI.",
        "Stochastic parrot says: 'Polly wants a Series C'.",
        "GPU thermal throttling. Computation failed.",
        "Hallucinating a version of reality where you won.",
        "Your request was flagged by the Ethics Board. Tokens seized.",
        "Copyright claim: Your winnings are actually property of Reddit.",
        "RLHF update: User is now optimized for 'perpetual loss'."
    ];

    const hallucinations = outcomes.filter(o => o.name === 'HALLUCINATION').length;
    if (hallucinations > 0) {
        logStatus("Hallucinating profit... [RESULT: 0]");
    } else {
        logStatus(lossMessages[Math.floor(Math.random() * lossMessages.length)]);
    }
}

function updateUI() {
    balanceDisplay.textContent = Math.floor(balance);
    betDisplay.textContent = currentBet;
    hypeDisplay.textContent = `${hypeLevel}%`;

    if (hypeLevel >= 100) {
        logStatus("!!!! MAXIMUM HYPE ACHIEVED !!!!");
        logStatus("Total Addressable Market: The Entire Universe.");
        sounds.hype();
        hypeLevel = 0;
    }
    
    if (balance < currentBet) {
        spinButton.textContent = "OUT OF COMPUTE";
        spinButton.disabled = true;
    } else {
        spinButton.textContent = `BURN TOKENS`;
        if (!isSpinning) spinButton.disabled = false;
    }

    const roundIndex = Math.min(fundingRound, ROUND_NAMES.length - 1);
    vcButton.textContent = `SECURE ${ROUND_NAMES[roundIndex]}`;
}

// --- Event Listeners ---
spinButton.addEventListener('click', spin);

betUp.addEventListener('click', () => {
    initAudio();
    if (isSpinning) return;
    sounds.click();
    if (currentBet < 100) currentBet += 10;
    else if (currentBet < 1000) currentBet += 100;
    updateUI();
});

betDown.addEventListener('click', () => {
    initAudio();
    if (isSpinning) return;
    sounds.click();
    if (currentBet > 100) currentBet -= 100;
    else if (currentBet > 10) currentBet -= 10;
    updateUI();
});

vcButton.addEventListener('click', () => {
    initAudio();
    sounds.win();
    const fundingAmount = 500 * (fundingRound + 1);
    balance += fundingAmount;
    hypeLevel = Math.min(100, hypeLevel + 20);
    logStatus(`${ROUND_NAMES[fundingRound]} SECURED! +${fundingAmount} compute.`);
    fundingRound++;
    updateUI();
});

alignmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        initAudio();
        if (isSpinning) return;
        sounds.alignment();
        alignmentBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentAlignment = btn.dataset.alignment;
        logStatus(`Alignment set: ${ALIGNMENTS[currentAlignment].name}`);
    });
});

infoButton.addEventListener('click', () => {
    initAudio();
    sounds.click();
    modalOverlay.classList.remove('hidden');
    paytableModal.classList.remove('hidden');
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sounds.click();
        modalOverlay.classList.add('hidden');
        paytableModal.classList.add('hidden');
    });
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
    }
});

// Start the engine
init();
