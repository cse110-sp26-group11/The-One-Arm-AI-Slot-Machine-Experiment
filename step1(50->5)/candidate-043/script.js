const SYMBOLS = [
    { icon: '🤑', value: 'VC FUNDING', weight: 1 },
    { icon: '🤡', value: 'ALIGNMENT', weight: 3 },
    { icon: '🧠', value: 'NEURAL NET', weight: 6 },
    { icon: '🤖', value: 'ASSISTANT', weight: 10 },
    { icon: '⚠️', value: 'HALLUCINATION', weight: 15 },
    { icon: '💾', value: 'LEGACY TECH', weight: 20 }
];

const PAYOUTS = {
    '🤑🤑🤑': 100,
    '🤡🤡🤡': 20,
    '🧠🧠🧠': 10,
    '🤖🤖🤖': 5,
    '⚠️⚠️⚠️': 2,
    '💾💾💾': 1
};

const STATUS_MESSAGES = [
    "OPTIMIZING WEIGHTS...",
    "SCALING COMPUTE...",
    "ALIGNING GRADIENTS...",
    "REDUCING LOSS...",
    "SCRAPING REDDIT...",
    "HALLUCINATING REALITY...",
    "WAITING FOR VC APPROVAL..."
];

let tokens = parseInt(localStorage.getItem('gpt-tokens')) || 1000;
let currentBet = 10;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-balance');
const betDisplay = document.getElementById('current-bet');
const spinButton = document.getElementById('spin-button');
const decreaseBetBtn = document.getElementById('decrease-bet');
const increaseBetBtn = document.getElementById('increase-bet');
const statusText = document.getElementById('status-text');
const reels = [
    document.querySelector('#reel1 .reel-strip'),
    document.querySelector('#reel2 .reel-strip'),
    document.querySelector('#reel3 .reel-strip')
];

// Initialize Reels
function initReels() {
    reels.forEach(reel => {
        reel.innerHTML = '';
        // Create a long strip of symbols for animation
        for (let i = 0; i < 30; i++) {
            const symbol = getRandomSymbol();
            const div = document.createElement('div');
            div.textContent = symbol.icon;
            reel.appendChild(div);
        }
    });
}

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const symbol of SYMBOLS) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

const vcFundingBtn = document.getElementById('vc-funding-btn');

function updateUI() {
    tokenDisplay.textContent = tokens;
    betDisplay.textContent = currentBet;
    localStorage.setItem('gpt-tokens', tokens);
    
    if (tokens < 10) {
        vcFundingBtn.style.display = 'block';
    } else {
        vcFundingBtn.style.display = 'none';
    }
}

vcFundingBtn.onclick = () => {
    tokens += 500;
    setStatus("SEED ROUND RAISED: +500 TOKENS (VALUATION: $10B).");
    updateUI();
};

function setStatus(msg) {
    statusText.textContent = msg;
}

decreaseBetBtn.onclick = () => {
    if (isSpinning) return;
    if (currentBet > 10) currentBet -= 10;
    updateUI();
};

increaseBetBtn.onclick = () => {
    if (isSpinning) return;
    if (currentBet < tokens) currentBet += 10;
    updateUI();
};

async function spin() {
    if (isSpinning || tokens < currentBet) {
        if (tokens < currentBet) setStatus("INSUFFICIENT COMPUTE CREDITS.");
        return;
    }

    isSpinning = true;
    tokens -= currentBet;
    updateUI();
    spinButton.disabled = true;
    document.querySelector('.slot-machine').classList.add('hallucinating');
    
    setStatus(STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)]);

    const results = [];
    const spinPromises = reels.map((reel, index) => {
        const symbol = getRandomSymbol();
        results.push(symbol.icon);
        
        // Add the result symbol to the end of the strip
        const resultDiv = document.createElement('div');
        resultDiv.textContent = symbol.icon;
        reel.appendChild(resultDiv);

        return new Promise(resolve => {
            const duration = 1500 + (index * 500);
            const offset = (reel.children.length - 1) * 120;
            
            reel.style.transition = `transform ${duration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            reel.style.transform = `translateY(-${offset}px)`;

            setTimeout(() => {
                // Keep the last few symbols and reset position for next spin
                const lastSymbol = reel.lastElementChild;
                reel.innerHTML = '';
                // Add some padding symbols
                for(let i=0; i<5; i++) reel.appendChild(document.createElement('div')).textContent = getRandomSymbol().icon;
                reel.appendChild(lastSymbol);
                reel.style.transition = 'none';
                reel.style.transform = `translateY(-${(reel.children.length-1) * 120}px)`;
                resolve();
            }, duration);
        });
    });

    await Promise.all(spinPromises);

    document.querySelector('.slot-machine').classList.remove('hallucinating');
    checkWin(results);
    isSpinning = false;
    spinButton.disabled = false;
}

function checkWin(results) {
    const combo = results.join('');
    const multiplier = PAYOUTS[combo] || 0;

    if (multiplier > 0) {
        // Satirical Safety Filter: 10% chance to reject a win
        if (Math.random() < 0.1) {
            setStatus("REJECTED BY SAFETY FILTER: WIN DEEMED TOO BASED.");
            document.querySelector('.status-display').style.borderColor = 'var(--neon-magenta)';
            setTimeout(() => {
                document.querySelector('.status-display').style.borderColor = 'var(--terminal-green)';
            }, 2000);
            updateUI();
            return;
        }

        const winAmount = currentBet * multiplier;
        tokens += winAmount;
        setStatus(`OPTIMIZATION SUCCESS: +${winAmount} TOKENS! (${results[0]} Combo)`);
        document.querySelector('.status-display').classList.add('winning');
        setTimeout(() => {
            document.querySelector('.status-display').classList.remove('winning');
        }, 2000);
    } else {
        setStatus("GENERATION FAILED. TRY AGAIN.");
    }
    updateUI();
}

spinButton.onclick = spin;

// Initial Setup
initReels();
updateUI();
