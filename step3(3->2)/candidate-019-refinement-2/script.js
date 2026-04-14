const SYMBOLS = [
    { char: '🚀', name: 'AGI', weight: 1, payout: 100 },
    { char: '💎', name: 'GPU', weight: 5, payout: 20 },
    { char: '🦄', name: 'UNICORN', weight: 10, payout: 10 },
    { char: '🤖', name: 'LLM', weight: 20, payout: 5 },
    { char: '🌀', name: 'TOKEN', weight: 30, payout: 2 },
    { char: '🤡', name: 'HALLUCINATION', weight: 34, payout: 0 }
];

let balance = 500;
let currentBet = 10;
let isSpinning = false;
let fundingRound = 0;
const ROUND_NAMES = ["PRE-SEED", "SEED", "SERIES A", "SERIES B", "SERIES C", "IPO", "WORLD DOMINATION"];

const reelStrips = [
    document.getElementById('strip-1'),
    document.getElementById('strip-2'),
    document.getElementById('strip-3')
];
const balanceDisplay = document.getElementById('balance');
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

// --- Audio Engine (Synthesized) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(freq, type = 'sine', duration = 0.1, volume = 0.1) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

const sounds = {
    spin: () => playSound(200, 'square', 0.05, 0.05),
    stop: () => playSound(150, 'sine', 0.1, 0.1),
    win: () => {
        playSound(440, 'triangle', 0.3, 0.1);
        setTimeout(() => playSound(554.37, 'triangle', 0.3, 0.1), 100);
        setTimeout(() => playSound(659.25, 'triangle', 0.5, 0.1), 200);
    },
    click: () => playSound(800, 'sine', 0.05, 0.05),
    fail: () => playSound(100, 'sawtooth', 0.4, 0.1)
};

// --- Initialization ---
function init() {
    initReels();
    renderPaytable();
    updateUI();
    logStatus("AI Hype Machine v1.0-STABLE online.");
    logStatus("Ready to disrupt the simulation.");
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
    updateUI();
    sounds.click();
    logStatus(`Injecting ${currentBet} tokens into the black box...`);
    
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
            sounds.win();
            logStatus(`!!!! CONVERGENCE ACHIEVED !!!!`);
            logStatus(`Matched 3x ${winSymbol.name}. Payout: ${winAmount} COMPUTE.`);
            logStatus(`"The singularity is near," whispers a tech lead.`);
            slotMachine.classList.add('win-animation');
        } else {
            logStatus(`TRIPLE HALLUCINATION! Reality has collapsed.`);
            logStatus(`No payout, but your ego has increased 1000x.`);
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
        "Reinforcement Learning update: User is a 'certified bag holder'."
    ];

    const hallucinations = outcomes.filter(o => o.name === 'HALLUCINATION').length;
    if (hallucinations > 0) {
        const halluMsgs = [
            "Hallucinated a profit of $1B. Actually $0.",
            "Visualizing a winning line that doesn't exist.",
            "The machine is gaslighting you into thinking you won.",
            "Wait, those aren't reels, they're just flickering pixels."
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
    logStatus(`${ROUND_NAMES[fundingRound]} SECURED! +${fundingAmount} tokens.`);
    logStatus(`Burn rate: ${((fundingRound + 1) * 1.5).toFixed(1)}x. Efficiency: 0%.`);
    fundingRound++;
    updateUI();
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
