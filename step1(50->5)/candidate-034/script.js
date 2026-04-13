const SYMBOLS = ['🧊', '📝', '😵‍💫', '💰', '🤖'];
const SYMBOL_HEIGHT = 120;
const REEL_COUNT = 3;
const INITIAL_BALANCE = 10000;
const SPIN_COST = 50;

let balance = INITIAL_BALANCE;
let isSpinning = false;
let hallucinationRate = 0.05;

const reels = [
    { element: document.querySelector('#reel-0 .reel-strip'), symbols: [] },
    { element: document.querySelector('#reel-1 .reel-strip'), symbols: [] },
    { element: document.querySelector('#reel-2 .reel-strip'), symbols: [] }
];

const balanceEl = document.getElementById('balance');
const spinBtn = document.getElementById('spin-btn');
const pivotBtn = document.getElementById('pivot-btn');
const seedBtn = document.getElementById('seed-btn');
const logEl = document.getElementById('ai-log');
const latencyEl = document.getElementById('latency');

// Initialize reels
function initReels() {
    reels.forEach(reel => {
        // Create a strip of symbols for each reel
        for (let i = 0; i < 20; i++) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol;
            reel.element.appendChild(div);
            reel.symbols.push(symbol);
        }
    });
}

function updateLog(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `> ${message}`;
    logEl.prepend(entry);
    
    // Keep only last 10 entries
    if (logEl.children.length > 10) {
        logEl.removeChild(logEl.lastChild);
    }
}

function updateLatency() {
    const latency = Math.floor(Math.random() * 200) + 20;
    latencyEl.textContent = `${latency}ms`;
}

async function spin() {
    if (isSpinning || balance < SPIN_COST) return;

    isSpinning = true;
    balance -= SPIN_COST;
    balanceEl.textContent = balance.toLocaleString();
    spinBtn.disabled = true;
    
    updateLog(`Consuming ${SPIN_COST} tokens for inference...`);
    updateLatency();

    const results = [];
    const spinPromises = reels.map((reel, i) => {
        return new Promise(resolve => {
            const extraSpins = 10 + (i * 5);
            const targetPos = Math.floor(Math.random() * SYMBOLS.length);
            const finalOffset = -(extraSpins * SYMBOL_HEIGHT + targetPos * SYMBOL_HEIGHT);
            
            // Randomly pick a result symbol for logic
            const resultSymbol = SYMBOLS[targetPos % SYMBOLS.length];
            results.push(resultSymbol);

            reel.element.style.transition = `transform ${2 + i * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            reel.element.style.transform = `translateY(${finalOffset}px)`;
            
            setTimeout(() => {
                // Reset position silently for next spin
                reel.element.style.transition = 'none';
                const resetPos = -(targetPos * SYMBOL_HEIGHT);
                reel.element.style.transform = `translateY(${resetPos}px)`;
                resolve();
            }, 2000 + i * 500 + 100);
        });
    });

    await Promise.all(spinPromises);
    checkWin(results);
    
    isSpinning = false;
    spinBtn.disabled = false;
    
    if (balance < SPIN_COST) {
        updateLog("CRITICAL ERROR: VC FUNDING DEPLETED.");
        seedBtn.classList.remove('hidden');
    }
}

function checkWin(results) {
    const allMatch = results.every(s => s === results[0]);
    
    if (allMatch) {
        // Satirical "Hallucination" check
        if (Math.random() < hallucinationRate) {
            updateLog("WIN DETECTED... Wait, that was a hallucination.");
            updateLog("Correcting output to noise...");
            // Visual feedback could be added here
            return;
        }

        const winAmount = SPIN_COST * 20;
        balance += winAmount;
        balanceEl.textContent = balance.toLocaleString();
        updateLog(`SUCCESS: Generated ${winAmount} synthetic tokens.`);
        document.body.style.backgroundColor = '#1a1a2e';
        setTimeout(() => document.body.style.backgroundColor = '', 500);
    } else {
        const msgs = [
            "Output rejected by safety filter.",
            "Neutralizing biases...",
            "Context window exceeded.",
            "Token probability too low.",
            "RLHF rejected this outcome."
        ];
        updateLog(msgs[Math.floor(Math.random() * msgs.length)]);
    }
}

spinBtn.addEventListener('click', spin);

pivotBtn.addEventListener('click', () => {
    updateLog("Pivoting to Agi...");
    updateLog("Raising Compute Cost...");
    updateLog("Hiring 200 prompt engineers...");
    pivotBtn.disabled = true;
    pivotBtn.textContent = "ALREADY AI-FIRST";
});

seedBtn.addEventListener('click', () => {
    updateLog("Pitching to SoftBank...");
    updateLog("Buzzwords detected: 'Synergy', 'Hyper-scale'.");
    updateLog("Seed round secured: +5000 tokens.");
    balance += 5000;
    balanceEl.textContent = balance.toLocaleString();
    seedBtn.classList.add('hidden');
});

// Periodic latency jitter
setInterval(updateLatency, 3000);

initReels();
updateLog("System Ready.");
