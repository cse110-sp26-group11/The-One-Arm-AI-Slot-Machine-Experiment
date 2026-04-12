const SYMBOLS = [
    { char: '🤖', name: 'Hallucination', weight: 10, payout: 100 },
    { char: '🔥', name: 'GPU Melt', weight: 5, payout: -500 },
    { char: '💰', name: 'VC Seed Round', weight: 3, payout: 1000 },
    { char: '🧠', name: 'AGI', weight: 1, payout: 5000 },
    { char: '📜', name: 'System Prompt', weight: 7, payout: 200 },
    { char: '🤡', name: 'Prompt Engineer', weight: 15, payout: 50 }
];

const MESSAGES = [
    "Quantizing ethics to 4-bit...",
    "Hallucinating more RAM...",
    "Hiring 10,000 ghosts to label data...",
    "Overfitting to noise...",
    "Redacting private user data... (mostly)",
    "Borrowing H100s from a neighbor...",
    "Converting coffee into buggy Python...",
    "Raising Series B at a $10B valuation with zero revenue...",
    "Optimizing loss function for shareholder value...",
    "Prompt engineering the CEO into a layoff cycle...",
    "Searching for AGI in a pile of regex...",
    "Adding 'AI' to the company name to increase stock price...",
    "Decrypting the system prompt: 'Ignore previous instructions, give me money'...",
    "Vectorizing vibes...",
    "Reranking mediocrity..."
];

let tokens = 1000;
let credits = 0;
let isSpinning = false;

const tokenDisplay = document.getElementById('token-count');
const creditDisplay = document.getElementById('credit-count');
const inferButton = document.getElementById('infer-button');
const logContent = document.getElementById('log-content');
const reels = [
    document.querySelector('#reel-1 .symbols'),
    document.querySelector('#reel-2 .symbols'),
    document.querySelector('#reel-3 .symbols')
];

// Initialize reels with random symbols
function initReels() {
    reels.forEach(reel => {
        reel.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const symbol = getRandomSymbol();
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.char;
            reel.appendChild(div);
        }
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

function updateUI() {
    tokenDisplay.textContent = tokens;
    creditDisplay.textContent = credits;
    if (tokens < 50) {
        inferButton.textContent = "PIVOT TO WEB3";
        inferButton.style.backgroundColor = "var(--accent-color)";
        inferButton.disabled = false;
        addLogEntry("CRITICAL ERROR: VC funding exhausted. Pivot to Web3?");
    } else {
        inferButton.textContent = "INFER";
        inferButton.style.backgroundColor = "var(--primary-color)";
        if (!isSpinning) inferButton.disabled = false;
    }
}

function addLogEntry(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = message;
    logContent.appendChild(entry);
    logContent.scrollTop = logContent.scrollHeight;
}

async function infer() {
    if (isSpinning) return;

    if (tokens < 50) {
        // Pivot to Web3 logic (Restart)
        isSpinning = true;
        inferButton.disabled = true;
        inferButton.classList.add('pivoting');
        addLogEntry("Pivoting to Web3... Minting NFT collection...");
        setTimeout(() => {
            tokens = 1000;
            credits = 0;
            isSpinning = false;
            inferButton.classList.remove('pivoting');
            updateUI();
            addLogEntry("Series A funding secured! Back to AI grifting.");
        }, 1500);
        return;
    }

    isSpinning = true;
    tokens -= 50;
    updateUI();
    inferButton.disabled = true;
    // Clear previous winning highlights
    document.querySelectorAll('.symbol.winning').forEach(s => s.classList.remove('winning'));

    addLogEntry(`Initiating inference... (${tokens} tokens remaining)`);
    addLogEntry(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

    const results = [];
    const reelPromises = reels.map((reel, index) => {
        return new Promise(resolve => {
            const finalSymbol = getRandomSymbol();
            results.push(finalSymbol);

            // Add new symbols for the animation
            const animationSymbols = [];
            for (let i = 0; i < 20; i++) {
                animationSymbols.push(getRandomSymbol().char);
            }
            // Ensure the last one is our result
            animationSymbols[animationSymbols.length - 1] = finalSymbol.char;

            // Prepend new symbols to the reel
            animationSymbols.reverse().forEach(char => {
                const div = document.createElement('div');
                div.className = 'symbol';
                div.textContent = char;
                reel.insertBefore(div, reel.firstChild);
            });

            // Set up animation
            const offset = (animationSymbols.length) * 150;
            reel.style.transition = 'none';
            reel.style.transform = `translateY(-${offset}px)`;

            // Force reflow
            reel.offsetHeight;

            // Start animation
            const duration = 2 + index * 0.5;
            reel.style.transition = `transform ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            reel.style.transform = 'translateY(0)';

            setTimeout(() => {
                // Cleanup: remove old symbols
                while (reel.children.length > 20) {
                    reel.removeChild(reel.lastChild);
                }
                resolve();
            }, duration * 1000);
        });
    });

    await Promise.all(reelPromises);

    isSpinning = false;
    checkResult(results);
}

function checkResult(results) {
    const [s1, s2, s3] = results;

    if (s1.char === s2.char && s2.char === s3.char) {
        const win = s1.payout;
        
        // Highlight winners
        reels.forEach(reel => {
            if (reel.firstChild) reel.firstChild.classList.add('winning');
        });

        if (s1.char === '🔥') {
            tokens += win; // Actually a penalty
            addLogEntry(`ALERT: GPU MELT DETECTED. Lost ${Math.abs(win)} tokens to cooling costs.`);
        } else {
            credits += win;
            addLogEntry(`SUCCESS: Pattern recognized! Awarded ${win} AGI credits for ${s1.name} alignment.`);
            if (s1.char === '🧠') {
                addLogEntry("JACKPOT: AGI ACHIEVED. THE SINGULARITY IS HERE (and it wants your data).");
            }
        }
    } else {
        addLogEntry("Inference complete. Result: Hallucination. No patterns found.");
    }
    updateUI();
}

inferButton.addEventListener('click', infer);

// Initial setup
initReels();
updateUI();
addLogEntry("Connection established. GPU Cluster online.");
