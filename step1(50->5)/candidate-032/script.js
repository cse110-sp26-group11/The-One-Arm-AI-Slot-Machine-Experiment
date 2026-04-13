const SYMBOLS = [
    { icon: '🎰', name: 'AGI', value: 10000 },
    { icon: '⚡', name: 'H100 GPU', value: 2000 },
    { icon: '📉', name: 'TOKEN BURN', value: 500 },
    { icon: '🐍', name: 'PYTHON', value: 200 },
    { icon: '🗑️', name: 'SYNTHETIC DATA', value: 50 }
];

const SNARK_MESSAGES = [
    "Optimizing loss function...",
    "Quantizing to 4-bit...",
    "Scraping Reddit for data...",
    "Bypassing safety filters...",
    "Running out of H100s...",
    "Hallucinating a jackpot...",
    "Ignoring ethical guidelines...",
    "Pivot to Crypto? No, keep spinning!",
    "Scaling parameters to infinity...",
    "Downloading more VRAM..."
];

let tokens = 5000;
let credits = 0;
let isSpinning = false;

const tokenDisplay = document.getElementById('token-balance');
const creditDisplay = document.getElementById('credit-balance');
const statusText = document.getElementById('status-text');
const spinButton = document.getElementById('spin-button');
const vramFill = document.getElementById('vram-fill');
const reels = [
    document.querySelector('#reel-1 .symbols'),
    document.querySelector('#reel-2 .symbols'),
    document.querySelector('#reel-3 .symbols')
];

function initReels() {
    reels.forEach(reel => {
        reel.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.icon;
            reel.appendChild(div);
        }
    });
}

function updateUI() {
    tokenDisplay.textContent = tokens;
    creditDisplay.textContent = credits;
    vramFill.style.width = Math.min(100, (tokens / 5000) * 100) + '%';
    
    if (tokens < 500) {
        spinButton.disabled = true;
        spinButton.textContent = "OUT OF TOKENS (INSUFFICIENT CAPITAL)";
    }
}

async function spin() {
    if (isSpinning || tokens < 500) return;

    isSpinning = true;
    tokens -= 500;
    updateUI();
    
    spinButton.disabled = true;
    spinButton.textContent = "EXECUTING...";
    
    statusText.textContent = SNARK_MESSAGES[Math.floor(Math.random() * SNARK_MESSAGES.length)];

    const results = [];
    const spinDurations = [2000, 2500, 3000];
    
    reels.forEach((reel, index) => {
        reel.classList.add('spinning');
        
        setTimeout(() => {
            reel.classList.remove('spinning');
            const finalSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            results[index] = finalSymbol;
            
            // Set final position
            reel.innerHTML = '';
            // Add some padding symbols
            for(let i=0; i<3; i++) {
                const div = document.createElement('div');
                div.className = 'symbol';
                div.textContent = (i === 1) ? finalSymbol.icon : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].icon;
                if (i === 1) div.id = `final-${index}`;
                reel.appendChild(div);
            }
            reel.style.top = '0px';

            if (results.length === 3 && results.filter(r => r).length === 3) {
                checkWin(results);
            }
        }, spinDurations[index]);
    });
}

function checkWin(results) {
    isSpinning = false;
    spinButton.disabled = tokens < 500;
    spinButton.textContent = tokens < 500 ? "OUT OF TOKENS" : "EXECUTE PROMPT (500 Tokens)";

    const [s1, s2, s3] = results;
    
    if (s1.name === s2.name && s2.name === s3.name) {
        // WINNER!
        const winAmount = s1.value;
        
        // Parody "Hallucination" check
        if (s1.name === 'AGI' && Math.random() > 0.1) {
            statusText.textContent = "ERROR: AGI hallucinated. Payout downgraded to Synthetic Data.";
            credits += 50;
        } else {
            credits += winAmount;
            statusText.textContent = `SUCCESS: Inference complete. Gained ${winAmount} Compute Credits!`;
            
            // Add visual flair
            [0, 1, 2].forEach(i => {
                document.getElementById(`final-${i}`).classList.add('winner');
            });
        }
    } else {
        statusText.textContent = "Inference failed: Model produced gibberish. Try again.";
    }
    
    updateUI();
}

spinButton.addEventListener('click', spin);

// Init
initReels();
updateUI();
