const SYMBOLS = ['🤖', '🧠', '☁️', '💰', '📉', '🚀'];
const SYMBOL_MESSAGES = {
    '💰': "Series A Funding Secured!",
    '🚀': "Hype Train Departure!",
    '🤖': "AGI Achieved!",
    '📉': "Model Hallucinated...",
    '🧠': "Neural Net Converged.",
    '☁️': "Server Latency High."
};

let tokens = 100;
let isSpinning = false;

const tokenDisplay = document.getElementById('token-count');
const statusLog = document.getElementById('status-log');
const promptBtn = document.getElementById('prompt-btn');
const resetBtn = document.getElementById('reset-btn');
const reels = [
    document.getElementById('reel1').querySelector('.reel-strip'),
    document.getElementById('reel2').querySelector('.reel-strip'),
    document.getElementById('reel3').querySelector('.reel-strip')
];

function initReels() {
    reels.forEach(strip => {
        strip.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const sym = document.createElement('div');
            sym.className = 'symbol';
            sym.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            strip.appendChild(sym);
        }
    });
}

async function prompt() {
    if (isSpinning || tokens < 10) {
        if (tokens < 10 && tokens > 0) updateStatus("Insufficient compute tokens. Please wait for more VC funding.");
        return;
    }

    startSpin();

    const results = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    stopSpin(results);
}

function startSpin() {
    isSpinning = true;
    tokens -= 10;
    updateDisplay();
    promptBtn.disabled = true;
    updateStatus("Running inference... generating tokens...");

    reels.forEach(strip => {
        strip.classList.add('spinning');
    });
}

function stopSpin(results) {
    reels.forEach((strip, index) => {
        strip.classList.remove('spinning');
        const symbolElements = strip.querySelectorAll('.symbol');
        symbolElements[0].textContent = results[index];
    });

    isSpinning = false;
    promptBtn.disabled = false;
    checkWin(results);
}

function checkWin(results) {
    const [r1, r2, r3] = results;

    if (r1 === r2 && r2 === r3) {
        let winAmount = 0;
        let message = "";

        switch (r1) {
            case '💰': winAmount = 100; message = SYMBOL_MESSAGES[r1] + " (+$100B Val.)"; break;
            case '🚀': winAmount = 50; message = SYMBOL_MESSAGES[r1] + " (+50 Token Multiplier)"; break;
            case '🤖': winAmount = 200; message = SYMBOL_MESSAGES[r1] + " (Tokens Infinite-ish)"; break;
            case '📉': winAmount = -20; message = SYMBOL_MESSAGES[r1] + " (Token Burn Rate x2)"; break;
            default: winAmount = 30; message = "Triple " + r1 + "! Model Optimized.";
        }

        tokens += winAmount;
        updateStatus(message);
    } else {
        const unique = new Set(results).size;
        if (unique === 3) {
            updateStatus("Training failed: Diversity too high. Model failed to converge.");
        } else {
            updateStatus("Prompt completed with low confidence. No significant output.");
        }
    }

    updateDisplay();
    if (tokens <= 0) {
        tokens = 0;
        updateStatus("BANKRUPT. Your AI startup has been liquidated.");
        promptBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block';
        resetBtn.style.backgroundColor = 'var(--accent)';
        resetBtn.style.color = 'white';
        resetBtn.style.padding = '1rem 2rem';
        resetBtn.style.border = 'none';
        resetBtn.style.cursor = 'pointer';
        resetBtn.style.fontFamily = 'inherit';
    }
}

function resetGame() {
    tokens = 100;
    updateDisplay();
    updateStatus("New seed funding acquired. Ready for another burn cycle.");
    promptBtn.style.display = 'inline-block';
    promptBtn.disabled = false;
    resetBtn.style.display = 'none';
}

function updateDisplay() {
    tokenDisplay.textContent = tokens;
}

function updateStatus(msg) {
    statusLog.textContent = `> ${msg}`;
    statusLog.style.color = '#fff';
    setTimeout(() => {
        statusLog.style.color = 'var(--primary)';
    }, 100);
}

resetBtn.addEventListener('click', resetGame);
promptBtn.addEventListener('click', prompt);

initReels();
updateDisplay();
