const symbols = [
    { icon: '🧠', name: 'AGI', value: 500, weight: 1 },
    { icon: '⚡', name: 'GPU', value: 100, weight: 3 },
    { icon: '🦜', name: 'Parrot', value: 50, weight: 6 },
    { icon: '🌫️', name: 'Hallucination', value: 20, weight: 8 },
    { icon: '📉', name: 'Gradient', value: 0, weight: 10 }
];

const statusMessages = [
    "Synthesizing latent space...",
    "Optimizing weights...",
    "Prompt engineering in progress...",
    "Scraping the internet for answers...",
    "Feeding the stochastic parrots...",
    "Waiting for human feedback...",
    "Injecting bias for better results...",
    "Quantizing the universe..."
];

const winMessages = [
    "AGI ACHIEVED! Model is sentient.",
    "Hallucination successful! It looks like money.",
    "Overfitting to your wallet! You win!",
    "Reinforcement Learning payout triggered.",
    "Loss function minimized. Profit maximized."
];

const lossMessages = [
    "Model collapsed. Try a larger prompt.",
    "Hallucination! You thought you won.",
    "Backpropagation failed. Tokens lost.",
    "Out of memory error. Economy crashed.",
    "Bias detected. System rebooting."
];

let tokens = 1000;
const costPerSpin = 50;

const tokenDisplay = document.getElementById('token-count');
const statusDisplay = document.getElementById('status-message');
const spinBtn = document.getElementById('spin-btn');
const reelStrips = [
    document.querySelector('#reel1 .reel-strip'),
    document.querySelector('#reel2 .reel-strip'),
    document.querySelector('#reel3 .reel-strip')
];

// Initialize reels with some symbols
function initReels() {
    reelStrips.forEach(strip => {
        for (let i = 0; i < 20; i++) {
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.icon;
            strip.appendChild(div);
        }
    });
}

function getRandomSymbol() {
    const totalWeight = symbols.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of symbols) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return symbols[symbols.length - 1];
}

async function spin() {
    if (tokens < costPerSpin) {
        statusDisplay.textContent = "Insufficient Compute! Buy more tokens.";
        return;
    }

    tokens -= costPerSpin;
    updateDisplay();
    
    spinBtn.disabled = true;
    statusDisplay.textContent = statusMessages[Math.floor(Math.random() * statusMessages.length)];
    statusDisplay.classList.remove('win-glitch');

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    const symbolHeight = 130;
    const spins = 10; // Number of "rotations" to simulate

    reelStrips.forEach((strip, index) => {
        // Reset position without animation
        strip.style.transition = 'none';
        strip.style.transform = `translateY(0)`;
        
        // Clear and refill strip for animation
        strip.innerHTML = '';
        for (let i = 0; i < spins + 3; i++) {
            const div = document.createElement('div');
            div.className = 'symbol';
            // Last symbols should be the results
            if (i >= spins) {
                div.textContent = results[index].icon;
            } else {
                div.textContent = symbols[Math.floor(Math.random() * symbols.length)].icon;
            }
            strip.appendChild(div);
        }

        // Trigger animation
        setTimeout(() => {
            strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.transform = `translateY(-${spins * symbolHeight}px)`;
        }, 50);
    });

    // Wait for last reel to stop
    await new Promise(resolve => setTimeout(resolve, 3500));

    checkResults(results);
    spinBtn.disabled = false;
}

function checkResults(results) {
    const [s1, s2, s3] = results;
    let winAmount = 0;

    if (s1.name === s2.name && s2.name === s3.name) {
        // 3 of a kind
        winAmount = s1.value * 5;
    } else if (s1.name === s2.name || s2.name === s3.name || s1.name === s3.name) {
        // 2 of a kind
        const match = (s1.name === s2.name) ? s1 : (s2.name === s3.name ? s2 : s1);
        winAmount = match.value;
    }

    if (winAmount > 0) {
        tokens += winAmount;
        statusDisplay.textContent = `WIN: +${winAmount} TOKENS! ${winMessages[Math.floor(Math.random() * winMessages.length)]}`;
        statusDisplay.classList.add('win-glitch');
    } else {
        statusDisplay.textContent = lossMessages[Math.floor(Math.random() * lossMessages.length)];
    }

    updateDisplay();
}

function updateDisplay() {
    tokenDisplay.textContent = tokens;
    if (tokens < costPerSpin) {
        spinBtn.disabled = true;
    }
}

spinBtn.addEventListener('click', spin);
initReels();
