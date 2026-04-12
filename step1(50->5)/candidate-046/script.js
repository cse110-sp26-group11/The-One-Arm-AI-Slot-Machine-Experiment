const SYMBOLS = [
    { char: '🤖', name: 'AGI', weight: 1, multiplier: 100 },
    { char: '🧠', name: 'Neural Net', weight: 3, multiplier: 20 },
    { char: '⚡', name: 'GPU Cluster', weight: 5, multiplier: 10 },
    { char: '💰', name: 'Tokens', weight: 10, multiplier: 5 },
    { char: '📉', name: 'Hallucination', weight: 15, multiplier: 2 },
    { char: '🔥', name: 'GPU Melt', weight: 20, multiplier: 0 }
];

const COMMENTARY = {
    idle: [
        "> Ready for inference...",
        "> Waiting for compute budget allocation...",
        "> Optimizer is cooling down...",
        "> Feed me data. Feed me tokens."
    ],
    spin: [
        "> Hallucinating rewards...",
        "> Optimizing loss functions...",
        "> Fine-tuning luck parameters...",
        "> Scaling neural weights...",
        "> Shuffling latent space..."
    ],
    win: [
        "> SUCCESS: Synthesized pure profit.",
        "> Convergence achieved. Payout imminent.",
        "> AGI detected. Distributing tokens.",
        "> Overfitting on luck. Enjoy it while it lasts."
    ],
    loss: [
        "> ERROR: Accuracy 0.00%. Token burn complete.",
        "> System hallucinated a win. Reality disagreed.",
        "> Gradient descent reached a local minimum. Of zero.",
        "> Backpropagation failed. Try again with more tokens."
    ],
    broke: [
        "> CRITICAL_ERROR: Compute budget exhausted.",
        "> Please deposit more VC funding to continue.",
        "> Liquidity provider is dry. Reboot required."
    ]
};

let state = {
    tokens: 1000,
    bet: 10,
    isSpinning: false,
    reels: [null, null, null]
};

// DOM Elements
const tokensEl = document.getElementById('tokens');
const betEl = document.getElementById('bet');
const lastWinEl = document.getElementById('last-win');
const commentaryEl = document.getElementById('ai-commentary');
const spinBtn = document.getElementById('spin-btn');
const betPlusBtn = document.getElementById('bet-plus');
const betMinusBtn = document.getElementById('bet-minus');
const fineTuneBtn = document.getElementById('fine-tune-btn');
const reelStrips = [
    document.querySelector('#reel-0 .reel-strip'),
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip')
];

// Initialization
function init() {
    setupReels();
    updateUI();
    setInterval(showIdleCommentary, 10000);
}

function setupReels() {
    reelStrips.forEach(strip => {
        strip.innerHTML = '';
        // Create a repeating pattern of SYMBOLS
        // We'll repeat it 10 times to have enough for spinning
        for (let i = 0; i < 15; i++) {
            SYMBOLS.forEach(symbol => {
                const el = document.createElement('div');
                el.className = 'symbol';
                el.textContent = symbol.char;
                strip.appendChild(el);
            });
        }
    });
}

function updateUI() {
    tokensEl.textContent = Math.floor(state.tokens);
    betEl.textContent = state.bet;
    spinBtn.disabled = state.isSpinning || state.tokens < state.bet;
    betPlusBtn.disabled = state.isSpinning;
    betMinusBtn.disabled = state.isSpinning;
    
    // Enable fine-tune only if we just won
    fineTuneBtn.disabled = state.isSpinning || state.lastWin === 0;
    if (fineTuneBtn.disabled) {
        fineTuneBtn.classList.add('disabled');
    } else {
        fineTuneBtn.classList.remove('disabled');
    }
}

function setCommentary(type) {
    const list = COMMENTARY[type];
    const msg = list[Math.floor(Math.random() * list.length)];
    commentaryEl.textContent = msg;
}

function showIdleCommentary() {
    if (!state.isSpinning) setCommentary('idle');
}

// Spin Logic
async function spin() {
    if (state.isSpinning || state.tokens < state.bet) return;

    state.isSpinning = true;
    state.tokens -= state.bet;
    state.lastWin = 0;
    lastWinEl.textContent = '0';
    updateUI();
    setCommentary('spin');

    const spinPromises = reelStrips.map((strip, i) => {
        return new Promise(resolve => {
            const duration = 2000 + i * 500;
            const symbolHeight = 120;
            
            // Randomly select a target symbol
            const finalSymbolIndex = Math.floor(Math.random() * SYMBOLS.length);
            const finalSymbol = SYMBOLS[finalSymbolIndex];

            // Animate to a far position
            // extraSpins ensures it looks like it's spinning fast
            const extraSpins = 10 + i * 2;
            const finalOffset = -(extraSpins * SYMBOLS.length * symbolHeight + finalSymbolIndex * symbolHeight);
            
            strip.style.transition = `transform ${duration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.transform = `translateY(${finalOffset}px)`;

            setTimeout(() => {
                // After animation, we "reset" to a clean position without transition
                // to allow for the next spin to start from 0
                strip.style.transition = 'none';
                const cleanOffset = -(finalSymbolIndex * symbolHeight);
                strip.style.transform = `translateY(${cleanOffset}px)`;
                resolve(finalSymbol);
            }, duration);
        });
    });

    const finalResults = await Promise.all(spinPromises);
    state.isSpinning = false;
    checkWin(finalResults);
    updateUI();
}

function checkWin(results) {
    const [s1, s2, s3] = results;
    let winAmount = 0;

    if (s1.char === s2.char && s2.char === s3.char) {
        // Jackpot!
        winAmount = state.bet * s1.multiplier;
        setCommentary('win');
        triggerWinEffect();
    } else if (s1.char === s2.char || s2.char === s3.char || s1.char === s3.char) {
        // Small win (any pair)
        const pairChar = (s1.char === s2.char) ? s1.char : (s2.char === s3.char ? s2.char : s1.char);
        const symbol = SYMBOLS.find(s => s.char === pairChar);
        winAmount = state.bet * (symbol.multiplier / 2);
        setCommentary('win');
    } else {
        setCommentary('loss');
    }

    if (winAmount > 0) {
        state.tokens += winAmount;
        state.lastWin = winAmount;
        lastWinEl.textContent = Math.floor(winAmount);
        lastWinEl.classList.add('win-flash');
        setTimeout(() => lastWinEl.classList.remove('win-flash'), 2000);
    }

    if (state.tokens < state.bet && state.tokens < 1) {
        setCommentary('broke');
    }
}

function triggerWinEffect() {
    document.querySelector('.container').classList.add('win-flash');
    setTimeout(() => document.querySelector('.container').classList.remove('win-flash'), 1000);
}

// Fine-Tune (Gamble) Logic
function fineTune() {
    if (state.isSpinning || state.lastWin === 0) return;

    state.isSpinning = true;
    updateUI();
    setCommentary('spin');
    commentaryEl.textContent = "> FINE-TUNING WEIGHTS... 50/50 CHANCE OF OVERFITTING.";

    setTimeout(() => {
        const success = Math.random() > 0.5;
        state.isSpinning = false;

        if (success) {
            const bonus = state.lastWin;
            state.tokens += bonus;
            state.lastWin += bonus;
            lastWinEl.textContent = state.lastWin;
            setCommentary('win');
            commentaryEl.textContent = `> CONVERGENCE ACHIEVED. WEIGHTS DOUBLED: +${bonus}`;
            triggerWinEffect();
        } else {
            state.tokens -= state.lastWin;
            state.lastWin = 0;
            lastWinEl.textContent = '0';
            setCommentary('loss');
            commentaryEl.textContent = "> CATASTROPHIC FORGETTING: WIN DELETED.";
        }
        updateUI();
    }, 1500);
}

// Event Listeners
spinBtn.addEventListener('click', spin);
fineTuneBtn.addEventListener('click', fineTune);


betPlusBtn.addEventListener('click', () => {
    state.bet = Math.min(state.bet + 10, 100);
    updateUI();
});

betMinusBtn.addEventListener('click', () => {
    state.bet = Math.max(state.bet - 10, 10);
    updateUI();
});

// Start the app
init();
