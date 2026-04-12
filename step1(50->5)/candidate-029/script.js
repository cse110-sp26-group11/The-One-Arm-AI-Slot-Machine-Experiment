const SYMBOLS = [
    { name: 'AGI', icon: '🧠', value: 50, weight: 1 },
    { name: 'GPU', icon: '🌀', value: 10, weight: 5 },
    { name: 'LLM', icon: '🤖', value: 5, weight: 10 },
    { name: 'PIVOT', icon: '📉', value: 2, weight: 15 },
    { name: 'NOISE', icon: '🌫️', value: 0, weight: 69 }
];

const JARGON = [
    "Vectorizing embeddings...",
    "Aligning superintelligence...",
    "Scraping the open web...",
    "Scaling compute to planetary levels...",
    "Training on synthetic data...",
    "Minimizing loss function...",
    "Reinforcement learning from human feedback...",
    "Expanding context window...",
    "Fine-tuning on Reddit comments...",
    "Synthesizing hallucinations...",
    "Optimizing attention heads...",
    "Distilling knowledge into smaller models...",
    "Burning seed round capital...",
    "Negotiating with cloud providers...",
    "Pivoting to crypto... wait, wrong year.",
    "Bypassing safety filters...",
    "Generating deepfakes of the CEO..."
];

let balance = 1000.00;
const bet = 10.00;
let isSpinning = false;

const balanceEl = document.getElementById('balance');
const spinBtn = document.getElementById('spin-btn');
const consoleOutput = document.getElementById('console-output');
const reelStrips = [
    document.querySelector('#reel-0 .reel-strip'),
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip')
];

// Initialize reels with some symbols
function init() {
    reelStrips.forEach(strip => {
        for (let i = 0; i < 20; i++) {
            const symbol = getRandomSymbol();
            const div = document.createElement('div');
            div.className = 'symbol';
            div.innerText = symbol.icon;
            strip.appendChild(div);
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

function logToConsole(message) {
    const p = document.createElement('p');
    p.innerText = `> ${message}`;
    consoleOutput.prepend(p);
    if (consoleOutput.childNodes.length > 20) {
        consoleOutput.removeChild(consoleOutput.lastChild);
    }
}

async function spin() {
    if (isSpinning || balance < bet) {
        if (balance < bet) logToConsole("CRITICAL ERROR: Insufficient Compute Credits. Please seek more VC funding.");
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    balance -= bet;
    updateBalance();

    logToConsole(`Inference started. Deducting ${bet} TKN...`);
    
    // Pick winning symbols
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    // Animate reels
    const spinPromises = reelStrips.map((strip, index) => {
        return new Promise(resolve => {
            const delay = index * 300;
            setTimeout(() => {
                strip.classList.add('blur');
                
                // Randomly add jargon during spin
                const interval = setInterval(() => {
                    logToConsole(JARGON[Math.floor(Math.random() * JARGON.length)]);
                }, 800);

                // Add the target symbol at the end
                const finalSymbolDiv = document.createElement('div');
                finalSymbolDiv.className = 'symbol';
                finalSymbolDiv.innerText = results[index].icon;
                strip.prepend(finalSymbolDiv);

                // Position the strip so the new symbol is visible
                strip.style.transition = 'none';
                strip.style.top = '-150px';
                
                // Trigger reflow
                strip.offsetHeight;

                strip.style.transition = 'top 2s cubic-bezier(0.45, 0.05, 0.55, 0.95)';
                strip.style.top = '0px';

                setTimeout(() => {
                    strip.classList.remove('blur');
                    clearInterval(interval);
                    resolve();
                }, 2000);
            }, delay);
        });
    });

    await Promise.all(spinPromises);
    
    checkWin(results);
    isSpinning = false;
    spinBtn.disabled = false;
}

function checkWin(results) {
    const icons = results.map(r => r.icon);
    let winAmount = 0;

    if (icons[0] === icons[1] && icons[1] === icons[2]) {
        // 3 of a kind
        winAmount = bet * results[0].value;
        logToConsole(`SUCCESS: Pattern matched. Generating ${winAmount} TKN in value!`);
        highlightWinners();
    } else if (icons[0] === icons[1] || icons[1] === icons[2]) {
        // 2 of a kind (neighboring)
        const matchedSymbol = icons[0] === icons[1] ? results[0] : results[1];
        winAmount = bet * (matchedSymbol.value / 2);
        logToConsole(`PARTIAL MATCH: Modest breakthrough. Recovered ${winAmount} TKN.`);
    } else {
        logToConsole("INFERENCE FAILED: Results classified as pure noise. Credits lost.");
    }

    if (winAmount > 0) {
        balance += winAmount;
        updateBalance();
    }
}

function highlightWinners() {
    reelStrips.forEach(strip => {
        const firstSymbol = strip.querySelector('.symbol');
        firstSymbol.classList.add('winning-symbol');
        setTimeout(() => firstSymbol.classList.remove('winning-symbol'), 2000);
    });
}

function updateBalance() {
    balanceEl.innerText = balance.toFixed(2);
}

spinBtn.addEventListener('click', spin);

init();
logToConsole("Neural networks primed. Ready for venture capital destruction.");
