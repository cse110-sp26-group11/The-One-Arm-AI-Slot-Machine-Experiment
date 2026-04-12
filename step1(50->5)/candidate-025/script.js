const SYMBOLS = ['🤖', '🧠', '☁️', '💰', '💥'];
const PAYOUTS = {
    '🤖': 100,
    '🧠': 20,
    '☁️': 5,
    '💰': 2,
    '💥': 0
};

const LOG_PHRASES = [
    "Optimizing attention weights...",
    "Hallucinating a jackpot...",
    "Pre-training on your browsing history...",
    "Aligning with human values (mostly)...",
    "Running 100B parameters on a potato...",
    "GPU cooling fans screaming in agony...",
    "Buying more H100s...",
    "Is this AGI yet?",
    "Tokens in, entropy out.",
    "Bypassing safety filters...",
    "Scaling law #402: More tokens = More win?",
    "Reinforcement learning from user failure..."
];

const WIN_PHRASES = [
    "LOG: Unexpected emergence of reward behavior.",
    "LOG: Model discovered a gradient shortcut.",
    "LOG: Statistical anomaly detected in user's favor.",
    "LOG: Tokens successfully laundered."
];

const LOSS_PHRASES = [
    "LOG: Overfitting to poverty.",
    "LOG: Vanishing gradients detected.",
    "LOG: Model says 'Trust me, you're winning in latent space'.",
    "LOG: Hallucination failed to materialize wealth."
];

const BOOM_PHRASES = [
    "FATAL ERROR: Catastrophic forgetting occurred.",
    "LOG: Model collapsed into a singularity of loss.",
    "LOG: AI safety protocol: User wealth reduced to 0."
];

let tokens = 500;
let spinning = false;

const spinBtn = document.getElementById('spin-button');
const tokenDisplay = document.getElementById('token-count');
const gpuTempDisplay = document.getElementById('gpu-temp');
const statusLog = document.getElementById('status-log');
const reels = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];

// Initialize reels
function initReels() {
    reels.forEach(reel => {
        reel.innerHTML = '';
        // Create a long strip for animation
        for (let i = 0; i < 20; i++) {
            const symbol = document.createElement('div');
            symbol.className = 'symbol';
            symbol.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            reel.appendChild(symbol);
        }
    });
}

function addLog(message, color = null) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    if (color) p.style.color = color;
    statusLog.prepend(p);
    
    // Keep log short
    if (statusLog.children.length > 20) {
        statusLog.removeChild(statusLog.lastChild);
    }
}

async function spin() {
    if (spinning || tokens < 10) return;

    spinning = true;
    tokens -= 10;
    updateUI();
    
    spinBtn.disabled = true;
    spinBtn.textContent = "COMPUTING...";
    
    addLog(LOG_PHRASES[Math.floor(Math.random() * LOG_PHRASES.length)]);

    // Random temperature spike
    gpuTempDisplay.textContent = `${40 + Math.floor(Math.random() * 60)}°C`;

    const results = [];
    const animationPromises = reels.map((reel, index) => {
        const symbolHeight = 120;
        const spins = 5 + (index * 2); // Each reel spins longer
        const finalSymbolIndex = Math.floor(Math.random() * SYMBOLS.length);
        const finalSymbol = SYMBOLS[finalSymbolIndex];
        results.push(finalSymbol);

        // Prep the reel strip: last symbol should be our result
        const symbols = reel.querySelectorAll('.symbol');
        symbols[symbols.length - 1].textContent = finalSymbol;

        return new Promise(resolve => {
            const duration = 1000 + (index * 500);
            reel.style.transition = `transform ${duration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            reel.style.transform = `translateY(-${(symbols.length - 1) * symbolHeight}px)`;
            
            setTimeout(() => {
                // Reset position instantly to look seamless for next spin
                reel.style.transition = 'none';
                reel.style.transform = 'translateY(0)';
                // Set the first symbol to the result so it stays visible
                symbols[0].textContent = finalSymbol;
                resolve();
            }, duration);
        });
    });

    await Promise.all(animationPromises);
    
    checkWin(results);
    
    spinning = false;
    spinBtn.disabled = tokens < 10;
    spinBtn.textContent = tokens < 10 ? "OUT OF COMPUTE" : "GENERATE OUTPUT (10 Credits)";
    gpuTempDisplay.textContent = "42°C";
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    
    if (r1 === r2 && r2 === r3) {
        const symbol = r1;
        if (symbol === '💥') {
            addLog(BOOM_PHRASES[Math.floor(Math.random() * BOOM_PHRASES.length)], '#ff00ff');
            // Heavy loss
            const penalty = Math.floor(tokens * 0.5);
            tokens -= penalty;
            addLog(`PENALTY: -${penalty} credits for safety violation.`);
        } else {
            const multiplier = PAYOUTS[symbol];
            const winAmount = 10 * multiplier;
            tokens += winAmount;
            addLog(WIN_PHRASES[Math.floor(Math.random() * WIN_PHRASES.length)], '#00f7ff');
            addLog(`REWARD: +${winAmount} compute credits.`, '#00ff41');
        }
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Partial win
        tokens += 5;
        addLog("LOG: Partial match. Minimal reward granted.");
    } else {
        addLog(LOSS_PHRASES[Math.floor(Math.random() * LOSS_PHRASES.length)]);
    }
    
    updateUI();
}

function updateUI() {
    tokenDisplay.textContent = tokens;
    if (tokens < 50) {
        tokenDisplay.style.color = 'red';
    } else {
        tokenDisplay.style.color = 'var(--neon-green)';
    }
}

spinBtn.addEventListener('click', spin);

// Start
initReels();
updateUI();
