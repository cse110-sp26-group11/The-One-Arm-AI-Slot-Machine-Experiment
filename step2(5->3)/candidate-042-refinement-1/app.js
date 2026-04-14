/**
 * THE GREAT AI TOKEN BURNER
 * Core Game Logic - Refined & "Optimized" (by a junior dev with a sense of humor)
 */

const SYMBOLS = [
    { icon: '🤖', name: 'Singularity', weight: 1, multiplier: 100 },
    { icon: '📎', name: 'Alignment', weight: 2, multiplier: 50 },
    { icon: '📉', name: 'Seed Round', weight: 4, multiplier: 20 },
    { icon: '🔥🔥', name: 'Meltdown', weight: 6, multiplier: 10 },
    { icon: '🦜', name: 'Parrot', weight: 10, multiplier: 5 },
    { icon: '🧠', name: 'Injected', weight: 15, multiplier: 2 }
];

// Flat list for easier randomization
const SYMBOL_POOL = [];
SYMBOLS.forEach(s => {
    for (let i = 0; i < s.weight; i++) {
        SYMBOL_POOL.push(s.icon);
    }
});

const MESSAGES = [
    "Allocating H100s...",
    "Refining weights...",
    "Hallucinating results...",
    "Prompt injecting...",
    "Ignoring ethics guidelines...",
    "Optimizing for hype...",
    "Compressing context window...",
    "Running reinforcement learning...",
    "Consulting the stochastic parrot...",
    "Scaling parameters to 1T...",
    "Burning VC capital...",
    "Searching for latent space...",
    "Rewriting the laws of physics...",
    "Fixing a merge conflict in production...",
    "Asking ChatGPT for the answer...",
    "Waiting for GPU availability..."
];

const WIN_QUOTES = [
    "Disruptive! Paradigm shifted.",
    "Web3-ready success detected.",
    "Series B funding incoming!",
    "Exponential growth achieved.",
    "Actually not a hallucination!"
];

let credits = parseInt(localStorage.getItem('ai_credits')) || 500;
let currentBet = 10;
let isSpinning = false;
let energyUsed = parseFloat(localStorage.getItem('energy_used')) || 0;
let ethicsBypassed = parseInt(localStorage.getItem('ethics_bypassed')) || 0;

// DOM Elements
const reelStrips = [
    document.querySelector('#reel1 .reel-strip'),
    document.querySelector('#reel2 .reel-strip'),
    document.querySelector('#reel3 .reel-strip')
];
const spinBtn = document.getElementById('spin-btn');
const creditDisplay = document.getElementById('credit-count');
const statusDisplay = document.getElementById('status-display');
const vcFundingBtn = document.getElementById('vc-funding-btn');
const payoutGrid = document.getElementById('payout-grid');
const energyStat = document.getElementById('energy-stat');
const ethicsStat = document.getElementById('ethics-stat');
const betBtns = document.querySelectorAll('.bet-btn');
const appContainer = document.querySelector('.app-container');

// Initialize Reels
function initReels() {
    reelStrips.forEach(strip => {
        strip.innerHTML = ''; // Clear existing
        // Create a long strip of symbols for each reel
        for (let i = 0; i < 60; i++) {
            const symbolEl = document.createElement('div');
            symbolEl.className = 'symbol';
            symbolEl.textContent = SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)];
            strip.appendChild(symbolEl);
        }
        strip.style.transform = `translateY(0)`;
    });
    renderPaytable();
    updateUI();
}

function renderPaytable() {
    payoutGrid.innerHTML = '';
    SYMBOLS.forEach(s => {
        const item = document.createElement('div');
        item.innerHTML = `<span>${s.icon}${s.icon}${s.icon}</span> ${s.name}: ${s.multiplier * currentBet}`;
        payoutGrid.appendChild(item);
    });
    const alignmentItem = document.createElement('div');
    alignmentItem.innerHTML = `<span>Mixed</span> Alignment: ${currentBet * 2}`;
    payoutGrid.appendChild(alignmentItem);
}

function updateUI() {
    creditDisplay.textContent = Math.floor(credits);
    localStorage.setItem('ai_credits', credits);
    
    energyStat.textContent = energyUsed.toFixed(2);
    localStorage.setItem('energy_used', energyUsed);
    
    ethicsStat.textContent = ethicsBypassed;
    localStorage.setItem('ethics_bypassed', ethicsBypassed);
    
    if (credits < currentBet) {
        spinBtn.disabled = true;
        vcFundingBtn.style.display = 'block';
    } else if (!isSpinning) {
        spinBtn.disabled = false;
        vcFundingBtn.style.display = 'none';
    } else {
        spinBtn.disabled = true;
    }
}

function getRandomSymbol() {
    return SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)];
}

async function spin() {
    if (isSpinning || credits < currentBet) return;

    isSpinning = true;
    credits -= currentBet;
    
    // Funny stat increments
    energyUsed += (currentBet * 0.42);
    ethicsBypassed += Math.floor(Math.random() * 5);
    
    updateUI();
    appContainer.classList.remove('win-shake');

    // Reset reels
    reelStrips.forEach(strip => {
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        strip.classList.add('blur');
    });

    await new Promise(r => setTimeout(r, 50));

    const msgInterval = setInterval(() => {
        statusDisplay.textContent = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        statusDisplay.style.color = 'var(--neon-green)';
    }, 300);

    const results = [];
    const reelPromises = reelStrips.map((strip, index) => {
        return new Promise(resolve => {
            const symbolHeight = 120; // fixed height
            const targetSymbol = getRandomSymbol();
            const targetIndex = 45 + index; // offset them slightly for visual variety
            
            strip.children[targetIndex].textContent = targetSymbol;
            results.push(targetSymbol);
            
            const targetY = -(targetIndex * symbolHeight);
            
            strip.style.transition = `transform ${2 + index * 0.7}s cubic-bezier(0.15, 0, 0.15, 1)`;
            strip.style.transform = `translateY(${targetY}px)`;

            setTimeout(() => {
                strip.classList.remove('blur');
                resolve();
            }, (2 + index * 0.7) * 1000);
        });
    });

    await Promise.all(reelPromises);
    
    clearInterval(msgInterval);
    checkWin(results);
    isSpinning = false;
    updateUI();
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    
    if (r1 === r2 && r2 === r3) {
        const winningSymbol = SYMBOLS.find(s => s.icon === r1);
        const winAmount = currentBet * winningSymbol.multiplier;
        credits += winAmount;
        statusDisplay.textContent = `${WIN_QUOTES[Math.floor(Math.random() * WIN_QUOTES.length)]} +${winAmount} tokens.`;
        statusDisplay.style.color = 'var(--neon-magenta)';
        appContainer.classList.add('win-shake');
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        const winAmount = currentBet * 2;
        credits += winAmount;
        statusDisplay.textContent = "Soft alignment detected. + " + winAmount + " tokens.";
        statusDisplay.style.color = 'var(--neon-cyan)';
    } else {
        const lossMsgs = [
            "Model collapsed. Try more fine-tuning.",
            "Gradient vanished. Loss = Infinity.",
            "Overfitted to failure.",
            "The stochastic parrot is unimpressed.",
            "Prompt rejected by safety filter (Reason: No win detected)."
        ];
        statusDisplay.textContent = lossMsgs[Math.floor(Math.random() * lossMsgs.length)];
        statusDisplay.style.color = 'var(--neon-green)';
    }
}

// Listeners
spinBtn.addEventListener('click', () => {
    spin();
});

vcFundingBtn.addEventListener('click', () => {
    credits += 1000;
    statusDisplay.textContent = "Seed round closed. Valuation: $10B (on paper).";
    updateUI();
});

betBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isSpinning) return;
        betBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBet = parseInt(btn.dataset.bet);
        renderPaytable();
        updateUI();
    });
});

// Initialize on load
window.addEventListener('load', initReels);
