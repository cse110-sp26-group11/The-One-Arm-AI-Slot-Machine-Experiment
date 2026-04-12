const SYMBOLS = ['🧠', '🤖', '⚡️', '💵', '🫠'];
const SPIN_COST = 10;
const REEL_SYMBOL_COUNT = 30; // Length of the strip for animation

let tokens = 100;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const statusLog = document.getElementById('status-log');
const reels = [
    document.getElementById('reel-0'),
    document.getElementById('reel-1'),
    document.getElementById('reel-2')
];

const reelStrips = reels.map(reel => reel.querySelector('.reel-strip'));

// Funny AI messages
const MESSAGES = [
    "Optimizing local weights...",
    "Quantizing win to 4-bit...",
    "Error: Hallucination detected. (Win!)",
    "Scaling to trillion parameters...",
    "Backpropagating through time...",
    "Fine-tuning on fortune data...",
    "Aggregating distributed compute...",
    "Bypassing safety filters...",
    "Generating alternative facts...",
    "Refining prompt engineering..."
];

/**
 * Initialize reels with random symbols
 */
function initReels() {
    reelStrips.forEach(strip => {
        populateStrip(strip);
    });
}

function populateStrip(strip, resultSymbol = null) {
    strip.innerHTML = '';
    // Create a long strip of symbols
    // The LAST symbol (at the bottom) will be the one displayed at the end
    // But since we use translateY, we actually want the result to be at the TOP after transition
    // Actually, let's just make the FIRST symbol the result, and animate from bottom to top.
    
    const stripSymbols = [];
    if (resultSymbol) {
        stripSymbols.push(resultSymbol);
    } else {
        stripSymbols.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    }

    for (let i = 0; i < REEL_SYMBOL_COUNT; i++) {
        stripSymbols.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    }

    stripSymbols.forEach(sym => {
        const div = document.createElement('div');
        div.className = 'symbol';
        div.textContent = sym;
        strip.appendChild(div);
    });

    // Reset position
    strip.style.transition = 'none';
    const symbolHeight = strip.children[0].offsetHeight;
    strip.style.transform = `translateY(-${(REEL_SYMBOL_COUNT) * symbolHeight}px)`;
}

async function spin() {
    if (isSpinning || tokens < SPIN_COST) return;

    isSpinning = true;
    tokens -= SPIN_COST;
    updateUI();
    
    logMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    spinBtn.disabled = true;

    const results = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];

    // Animate each reel
    const spinPromises = reelStrips.map((strip, i) => {
        return new Promise(resolve => {
            const symbolHeight = strip.children[0].offsetHeight;
            
            // Re-populate with the result at the end (the first element in our new strip)
            populateStrip(strip, results[i]);
            
            // Force reflow
            strip.offsetHeight;

            // Start animation
            const duration = 2 + (i * 0.5); // Staggered finish
            strip.style.transition = `transform ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.transform = 'translateY(0px)';

            setTimeout(resolve, duration * 1000);
        });
    });

    await Promise.all(spinPromises);
    
    isSpinning = false;
    spinBtn.disabled = false;
    checkWin(results);
}

function checkWin(results) {
    const [s1, s2, s3] = results;
    let winAmount = 0;
    let winMsg = "";

    if (s1 === s2 && s2 === s3) {
        const symbol = s1;
        if (symbol === '🧠') { winAmount = 1000; winMsg = "AGI ATTAINED. You win 1000 tokens!"; }
        else if (symbol === '🤖') { winAmount = 500; winMsg = "Stable weights found. 500 tokens awarded."; }
        else if (symbol === '⚡️') { winAmount = 200; winMsg = "H100 cluster rented. 200 tokens mined."; }
        else if (symbol === '💵') { winAmount = 100; winMsg = "Series A funding secured! 100 tokens."; }
        else if (symbol === '🫠') { winAmount = 20; winMsg = "Positive Hallucination! 20 tokens."; }
        
        tokens += winAmount;
        triggerWinAnimation();
        logMessage(`[CRITICAL_SUCCESS] ${winMsg}`);
    } else {
        logMessage("[INFERENCE_COMPLETE] No patterns detected in latent space.");
    }

    updateUI();

    if (tokens < SPIN_COST) {
        logMessage("[SYSTEM_ERROR] Out of compute tokens. Bankruptcy imminent.");
        spinBtn.classList.add('hidden');
        resetBtn.classList.remove('hidden');
    }
}

function updateUI() {
    tokenDisplay.textContent = tokens;
}

function logMessage(msg) {
    const div = document.createElement('div');
    div.textContent = `> ${msg}`;
    statusLog.prepend(div);
    if (statusLog.children.length > 5) {
        statusLog.removeChild(statusLog.lastChild);
    }
}

function triggerWinAnimation() {
    const machine = document.querySelector('.slot-machine');
    machine.classList.add('win-animation');
    setTimeout(() => {
        machine.classList.remove('win-animation');
    }, 2000);
}

function resetGame() {
    tokens = 100;
    spinBtn.classList.remove('hidden');
    resetBtn.classList.add('hidden');
    logMessage("VC Funding secured. New compute tokens allocated.");
    updateUI();
}

// Event Listeners
spinBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', resetGame);

// Init
window.addEventListener('load', () => {
    initReels();
    updateUI();
});
