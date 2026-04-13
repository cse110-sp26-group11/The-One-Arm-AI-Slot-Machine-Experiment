const SYMBOLS = [
    { char: '🤖', value: 100, name: 'AGI' },
    { char: '🧠', value: 50, name: 'Neural' },
    { char: '🧬', value: 20, name: 'Data' },
    { char: '🦾', value: 10, name: 'Robotics' },
    { char: '👁️‍🗨️', value: 5, name: 'Vision' },
    { char: '🤡', value: 0, name: 'Prompt Engineer' },
    { char: '📉', value: -10, name: 'Hallucination' }
];

const FLAVOR_TEXTS = [
    "Scaling is all you need...",
    "Wait, let me consult the latent space.",
    "Compressing reality into tokens...",
    "I'm sorry, as an AI I cannot grant you a jackpot.",
    "Overfitting your wallet in 3... 2... 1...",
    "Training on your hopes and dreams.",
    "Zero-shotting a loss into a bigger loss.",
    "My confidence score is 99.9% (approx).",
    "Hallucinating a brighter future for you.",
    "Parameters are converging on 'Broke'."
];

let tokens = 500;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const confidenceDisplay = document.getElementById('confidence-score');
const messageBox = document.getElementById('message-box');
const spinButton = document.getElementById('spin-button');
const betSelect = document.getElementById('bet-amount');
const reelContainers = [
    document.querySelector('#reel-1 .symbol-container'),
    document.querySelector('#reel-2 .symbol-container'),
    document.querySelector('#reel-3 .symbol-container')
];

// Initialize reels
function initReels() {
    reelContainers.forEach(container => {
        for (let i = 0; i < 20; i++) {
            const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = sym.char;
            container.appendChild(div);
        }
    });
}

function updateTokens(amount) {
    tokens += amount;
    tokenDisplay.textContent = tokens;
}

function setMessage(text) {
    messageBox.textContent = text;
}

function updateConfidence() {
    const score = (Math.random() * 50 + 50).toFixed(1);
    confidenceDisplay.textContent = score + '%';
}

async function spin() {
    if (isSpinning || tokens < parseInt(betSelect.value)) {
        if (tokens < parseInt(betSelect.value)) setMessage("Insufficient tokens for training.");
        return;
    }

    isSpinning = true;
    const bet = parseInt(betSelect.value);
    updateTokens(-bet);
    updateConfidence();
    setMessage(FLAVOR_TEXTS[Math.floor(Math.random() * FLAVOR_TEXTS.length)]);
    spinButton.disabled = true;

    const results = [];
    const spinPromises = reelContainers.map((container, index) => {
        return new Promise(resolve => {
            const spinDistance = 10 + Math.floor(Math.random() * 10);
            const targetSymbolIndex = Math.floor(Math.random() * SYMBOLS.length);
            const targetSymbol = SYMBOLS[targetSymbolIndex];
            results.push(targetSymbol);

            // Add the final target symbols at the top to land on them
            // We want to land on the 3rd symbol from the top for visual clarity
            // So we'll prepend the results
            for (let i = 0; i < spinDistance; i++) {
                const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                const div = document.createElement('div');
                div.className = 'symbol';
                div.textContent = (i === spinDistance - 1) ? targetSymbol.char : sym.char;
                container.prepend(div);
            }

            container.style.transition = 'none';
            container.style.top = `-${spinDistance * 120}px`;
            
            // Trigger reflow
            container.offsetHeight;

            const duration = 2 + index * 0.5;
            container.style.transition = `top ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            container.style.top = '0px';

            setTimeout(() => resolve(), duration * 1000);
        });
    });

    await Promise.all(spinPromises);
    
    // Check for Hallucination Mutation
    const hallucinate = Math.random() < 0.20; // 20% chance
    if (hallucinate) {
        await handleHallucination(results);
    }

    calculateWin(results, bet);

    // Cleanup: Keep only the first 20 symbols to prevent DOM bloat
    reelContainers.forEach(container => {
        while (container.children.length > 20) {
            container.removeChild(container.lastChild);
        }
    });

    isSpinning = false;
    spinButton.disabled = false;
}

async function handleHallucination(results) {
    setMessage("⚠️ CRITICAL HALLUCINATION DETECTED ⚠️");
    const affectedReel = Math.floor(Math.random() * 3);
    const reelElement = document.querySelectorAll('.reel')[affectedReel];
    
    reelElement.classList.add('hallucinating');
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Mutate the result
    const oldSym = results[affectedReel];
    const newSym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    results[affectedReel] = newSym;
    
    const symbolDiv = reelContainers[affectedReel].querySelector('.symbol');
    symbolDiv.textContent = newSym.char;
    symbolDiv.style.filter = 'hue-rotate(180deg) invert(1)';
    
    setTimeout(() => {
        reelElement.classList.remove('hallucinating');
        symbolDiv.style.filter = 'none';
    }, 500);
}

function calculateWin(results, bet) {
    const chars = results.map(r => r.char);
    const counts = {};
    chars.forEach(c => counts[c] = (counts[c] || 0) + 1);

    let winAmount = 0;
    const uniqueChars = Object.keys(counts);

    if (uniqueChars.length === 1) {
        // 3 of a kind
        const sym = SYMBOLS.find(s => s.char === uniqueChars[0]);
        winAmount = sym.value * bet;
        setMessage(`JACKPOT! Data points converged on ${sym.name}. +${winAmount} Tokens.`);
    } else if (uniqueChars.length === 2) {
        // 2 of a kind
        const pairChar = uniqueChars.find(c => counts[c] === 2);
        const sym = SYMBOLS.find(s => s.char === pairChar);
        winAmount = Math.floor(sym.value * bet * 0.5);
        setMessage(`Partial convergence. Found a ${sym.name} pattern. +${winAmount} Tokens.`);
    } else {
        setMessage("Zero-shot failure. No patterns detected in the noise.");
    }

    if (winAmount > 0) {
        updateTokens(winAmount);
        updateConfidence();
    } else {
        // Punish for 📉
        if (chars.includes('📉')) {
            setMessage("Market crash! Your weights have diverged significantly.");
        }
    }

    if (tokens <= 0) {
        setMessage("BANKRUPT. Please seek VC funding or a new job in agriculture.");
        spinButton.disabled = true;
    }
}

spinButton.addEventListener('click', spin);
initReels();
