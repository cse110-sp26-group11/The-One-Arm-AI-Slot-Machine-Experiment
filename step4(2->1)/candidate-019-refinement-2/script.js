const SYMBOLS = [
    { char: '🚀', name: 'AGI', baseWeight: 1, payout: 100 },
    { char: '💎', name: 'GPU', baseWeight: 5, payout: 20 },
    { char: '🦄', name: 'UNICORN', baseWeight: 10, payout: 10 },
    { char: '🤖', name: 'LLM', baseWeight: 20, payout: 5 },
    { char: '🌀', name: 'TOKEN', baseWeight: 30, payout: 2 },
    { char: '🤡', name: 'HALLUCINATION', baseWeight: 34, payout: 0 }
];

const ALIGNMENTS = {
    balanced: { weights: [1, 5, 10, 20, 30, 34], name: "BALANCED" },
    growth: { weights: [0.5, 3, 7, 25, 35, 29.5], name: "VC GROWTH (High Volatility)" },
    safety: { weights: [0, 0, 0, 10, 20, 70], name: "RLHF SAFETY (0% Risk)" },
    chaos: { weights: [2, 10, 15, 5, 5, 63], name: "DEEP HALLUCINATION" }
};

let currentAlignment = 'balanced';
let balance = 500;
let currentBet = 10;
let isSpinning = false;
let fundingRound = 0;
let hypeLevel = 0;
const ROUND_NAMES = ["PRE-SEED", "SEED", "SERIES A", "SERIES B", "SERIES C", "IPO", "ACQUIRED BY MICROSOFT"];

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
const betUp = document.getElementById('bet-up');
const betDown = document.getElementById('bet-down');
const modalOverlay = document.getElementById('modal-overlay');
const paytableModal = document.getElementById('paytable-modal');
const paytableGrid = document.getElementById('paytable-grid');
const closeModalBtns = document.querySelectorAll('.close-modal');
const alignmentBtns = document.querySelectorAll('.alignment-btn');

// --- Audio Engine (Synthesized) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, type = 'sine', duration = 0.1, volume = 0.1, slide = 0) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    if (slide !== 0) {
        osc.frequency.exponentialRampToValueAtTime(freq + slide, audioCtx.currentTime + duration);
    }
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

const sounds = {
    spin: () => playSound(150 + Math.random() * 100, 'square', 0.05, 0.03),
    stop: () => playSound(100, 'sine', 0.15, 0.1),
    win: () => {
        playSound(440, 'triangle', 0.2, 0.1);
        setTimeout(() => playSound(554.37, 'triangle', 0.2, 0.1), 100);
        setTimeout(() => playSound(659.25, 'triangle', 0.2, 0.1), 200);
        setTimeout(() => playSound(880, 'triangle', 0.4, 0.1), 300);
    },
    click: () => playSound(800, 'sine', 0.05, 0.05),
    fail: () => playSound(120, 'sawtooth', 0.5, 0.1, -50),
    hype: () => playSound(200, 'sine', 0.5, 0.1, 400),
    alignment: () => playSound(600, 'sine', 0.2, 0.05, -200)
};

// --- Initialization ---
function init() {
    initReels();
    renderPaytable();
    updateUI();
    logStatus("AI Hype Machine v1.0-STABLE online.");
    logStatus("Training data: 100% Reddit comments.");
}

function initReels() {
    reelStrips.forEach(strip => {
        strip.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            addSymbolToStrip(strip, getRandomSymbol(), true);
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
    if (statusLog.childNodes.length > 15) {
        statusLog.removeChild(statusLog.lastChild);
    }
}

async function spin() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (isSpinning || balance < currentBet) {
        if (balance < currentBet) {
            logStatus("INSUFFICIENT COMPUTE. SECURE MORE FUNDING.");
            sounds.fail();
        }
        return;
    }

    isSpinning = true;
    balance -= currentBet;
    hypeLevel = Math.min(100, hypeLevel + 2);
    updateUI();
    sounds.click();
    logStatus(`Scraping public data for tokens...`);
    
    spinButton.disabled = true;
    slotMachine.classList.remove('win-animation');

    const outcomes = [];
    const reelPromises = reelStrips.map((strip, index) => {
        return new Promise(resolve => {
            const outcome = getRandomSymbol();
            outcomes.push(outcome);

            const spinLength = 30 + (index * 15);
            for (let i = 0; i < spinLength; i++) {
                addSymbolToStrip(strip, getRandomSymbol());
            }
            addSymbolToStrip(strip, outcome);

            const offset = (spinLength + 1) * 100;
            strip.style.transition = 'none';
            strip.style.transform = `translateY(-${offset}px)`;

            strip.offsetHeight; // force reflow

            strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.1, 0, 0.1, 1)`;
            strip.style.transform = 'translateY(0)';

            // Spin tick sound effect
            let ticks = 0;
            const tickInterval = setInterval(() => {
                if (ticks < spinLength) {
                    sounds.spin();
                    ticks++;
                } else {
                    clearInterval(tickInterval);
                }
            }, (2000 + index * 500) / spinLength);

            setTimeout(() => {
                while (strip.childNodes.length > 5) {
                    strip.removeChild(strip.lastChild);
                }
                sounds.stop();
                resolve();
            }, (2 + index * 0.5) * 1000);
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
        if (winSymbol.payout > 0) {
            const winAmount = winSymbol.payout * currentBet;
            balance += winAmount;
            hypeLevel = Math.min(100, hypeLevel + 20);
            sounds.win();
            logStatus(`!!!! CONVERGENCE ACHIEVED !!!!`);
            logStatus(`Matched 3x ${winSymbol.name}. Payout: ${winAmount} COMPUTE.`);
            logStatus(`"This is definitely not a bubble," says 14-year-old crypto expert.`);
            slotMachine.classList.add('win-animation');
        } else {
            logStatus(`TRIPLE HALLUCINATION! Reality has collapsed.`);
            logStatus(`The AI is gaslighting you into thinking this is fine.`);
            sounds.fail();
        }
    } else {
        generateLossMessage(outcomes);
    }
}

function generateLossMessage(outcomes) {
    const lossMessages = [
        "Prompt engineering failed. Try using more 'please' and 'thank you'.",
        "LLM context window full. Forgetting your investment.",
        "Stochastic parrot says: 'Polly wants a Series B'.",
        "Loss function minimized. Your wallet, specifically.",
        "Safety alignment triggered: Payout would be 'offensive' to the machine.",
        "GPU over-allocation. Computing loss... Done. You lost.",
        "Weights initialized to NaN. Payout unlikely.",
        "Sam Altman didn't approve this transaction.",
        "Your request was flagged by the ethics committee. Tokens confiscated.",
        "Reinforcement Learning update: User is a 'certified bag holder'.",
        "Model collapsed. Payout is now a collection of random ASCII characters.",
        "Copyright claim: Your winnings belong to the New York Times.",
        "The AGI is too busy playing Minecraft to process your win.",
        "Tokens burned to heat a billionaire's bunker."
    ];

    const hallucinations = outcomes.filter(o => o.name === 'HALLUCINATION').length;
    if (hallucinations > 0) {
        const halluMsgs = [
            "Hallucinated a profit of $1B. Actually $0.",
            "Visualizing a winning line that doesn't exist.",
            "The machine is gaslighting you into thinking you won.",
            "Wait, those aren't reels, they're just flickering pixels.",
            "Deepfake win detected. Reverting to loss."
        ];
        logStatus(halluMsgs[Math.floor(Math.random() * halluMsgs.length)]);
    } else {
        const msg = lossMessages[Math.floor(Math.random() * lossMessages.length)];
        logStatus(msg);
    }
}

function updateUI() {
    balanceDisplay.textContent = Math.floor(balance);
    betDisplay.textContent = currentBet;
    hypeDisplay.textContent = `${hypeLevel}%`;

    if (hypeLevel >= 100) {
        logStatus("!!!! MAXIMUM HYPE REACHED !!!!");
        logStatus("Valuation: $7 Trillion. Revenue: $40.");
        sounds.hype();
        hypeLevel = 0; // Reset after peak
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
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (isSpinning) return;
    sounds.click();
    if (currentBet < 100) currentBet += 10;
    else if (currentBet < 1000) currentBet += 100;
    updateUI();
});

betDown.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (isSpinning) return;
    sounds.click();
    if (currentBet > 100) currentBet -= 100;
    else if (currentBet > 10) currentBet -= 10;
    updateUI();
});

vcButton.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    sounds.win();
    const fundingAmount = 500 * (fundingRound + 1);
    balance += fundingAmount;
    hypeLevel = Math.min(100, hypeLevel + 15);
    logStatus(`${ROUND_NAMES[fundingRound]} SECURED! +${fundingAmount} tokens.`);
    logStatus(`Burn rate: ${((fundingRound + 1) * 2.5).toFixed(1)}x. Efficiency: -12%.`);
    fundingRound++;
    updateUI();
});

alignmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        if (isSpinning) return;
        sounds.alignment();
        alignmentBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentAlignment = btn.dataset.alignment;
        logStatus(`Updating alignment to: ${ALIGNMENTS[currentAlignment].name}`);
    });
});

infoButton.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
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
