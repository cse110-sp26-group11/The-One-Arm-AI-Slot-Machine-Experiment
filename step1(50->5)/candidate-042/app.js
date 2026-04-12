/**
 * THE GREAT AI TOKEN BURNER
 * Core Game Logic
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
    "Searching for latent space..."
];

const SPIN_COST = 10;
let credits = parseInt(localStorage.getItem('ai_credits')) || 500;
let isSpinning = false;

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

// Initialize Reels
function initReels() {
    reelStrips.forEach(strip => {
        // Create a long strip of symbols for each reel
        for (let i = 0; i < 60; i++) {
            const symbolEl = document.createElement('div');
            symbolEl.className = 'symbol';
            symbolEl.textContent = SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)];
            strip.appendChild(symbolEl);
        }
        // Set initial position
        strip.style.transform = `translateY(0)`;
    });
    updateUI();
}

function updateUI() {
    creditDisplay.textContent = credits;
    localStorage.setItem('ai_credits', credits);
    
    if (credits < SPIN_COST) {
        spinBtn.disabled = true;
        vcFundingBtn.style.display = 'block';
    } else if (!isSpinning) {
        spinBtn.disabled = false;
        vcFundingBtn.style.display = 'none';
    }
}

function getRandomSymbol() {
    return SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)];
}

async function spin() {
    if (isSpinning || credits < SPIN_COST) return;

    isSpinning = true;
    credits -= SPIN_COST;
    updateUI();
    spinBtn.disabled = true;

    // Reset reels to top instantly and add blur
    reelStrips.forEach(strip => {
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        strip.classList.add('blur');
    });

    // Short delay to let the 'transition: none' take effect
    await new Promise(r => setTimeout(r, 50));

    // Set a random training message
    const msgInterval = setInterval(() => {
        statusDisplay.textContent = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        statusDisplay.style.color = 'var(--neon-green)';
    }, 400);

    const results = [];
    const reelPromises = reelStrips.map((strip, index) => {
        return new Promise(resolve => {
            const symbolHeight = strip.children[0].offsetHeight || 120; // fallback
            const targetSymbol = getRandomSymbol();
            
            // We'll use symbols from the end of the strip as targets
            const targetIndex = 40 + Math.floor(Math.random() * 10); 
            strip.children[targetIndex].textContent = targetSymbol;
            
            results.push(targetSymbol);
            
            const targetY = -(targetIndex * symbolHeight);
            
            strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.15, 0, 0.15, 1)`;
            strip.style.transform = `translateY(${targetY}px)`;

            setTimeout(() => {
                strip.classList.remove('blur');
                resolve();
            }, (2 + index * 0.5) * 1000);
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
        const winAmount = SPIN_COST * winningSymbol.multiplier;
        credits += winAmount;
        statusDisplay.textContent = `CRITICAL HIT! ${winningSymbol.name.toUpperCase()} ACHIEVED! +${winAmount} tokens.`;
        statusDisplay.style.color = 'var(--neon-magenta)';
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Small "Alignment" win
        credits += SPIN_COST * 2;
        statusDisplay.textContent = "Soft alignment detected. +20 tokens.";
        statusDisplay.style.color = 'var(--neon-cyan)';
    } else {
        statusDisplay.textContent = "Hallucination complete. 0 tokens returned.";
        statusDisplay.style.color = 'var(--neon-green)';
    }
}

// Listeners
spinBtn.addEventListener('click', () => {
    spin();
});

vcFundingBtn.addEventListener('click', () => {
    credits += 500;
    statusDisplay.textContent = "Seed round closed. Burn it all again.";
    updateUI();
});

// Initialize on load
window.addEventListener('load', initReels);
