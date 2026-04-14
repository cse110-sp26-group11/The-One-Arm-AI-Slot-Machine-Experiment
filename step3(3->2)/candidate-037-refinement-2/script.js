const SYMBOLS = [
    { char: '🤖', value: 100, name: 'AGI' },
    { char: '🧠', value: 50, name: 'Neural' },
    { char: '🧬', value: 20, name: 'Data' },
    { char: '🦾', value: 10, name: 'Robotics' },
    { char: '👁️‍🗨️', value: 5, name: 'Vision' },
    { char: '🤡', value: 2, name: 'Prompt Engineer' },
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
    "Hallucinating a brighter future for you.",
    "Parameters are converging on 'Broke'.",
    "Adding '.ai' to your domain name for 10x valuation...",
    "Pivoting to blockchain because LLMs are 'so 2023'.",
    "Rethinking our 'Open' AI strategy (it's closed now).",
    "GPU cooling fans are screaming in agony.",
    "The model is suggesting you double down.",
    "Synthesizing more copium..."
];

const HYPE_LEVELS = [
    { threshold: 0, text: "Low", color: "#6c63ff" },
    { threshold: 30, text: "Seed", color: "#4ade80" },
    { threshold: 60, text: "Series A", color: "#ff6584" },
    { threshold: 90, text: "Unicorn", color: "#ffd8cc" },
    { threshold: 120, text: "AGI Realised", color: "#ccf2e5" }
];

let tokens = 500;
let isSpinning = false;
let hype = 10;

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const hypeLevelDisplay = document.getElementById('hype-level');
const hypeBar = document.getElementById('hype-bar');
const messageBox = document.getElementById('message-box');
const spinButton = document.getElementById('spin-button');
const betSelect = document.getElementById('bet-amount');
const fundingButton = document.getElementById('funding-button');
const paytableToggle = document.getElementById('paytable-toggle');
const paytableModal = document.getElementById('paytable-modal');
const closePaytable = document.getElementById('close-paytable');
const paytableList = document.getElementById('paytable-list');

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
    renderPaytable();
    updateHype(0);
}

function renderPaytable() {
    paytableList.innerHTML = '';
    SYMBOLS.forEach(sym => {
        const row = document.createElement('div');
        row.className = 'paytable-row';
        row.innerHTML = `
            <span>${sym.char} ${sym.name}</span>
            <span>Val: ${sym.value}</span>
        `;
        paytableList.appendChild(row);
    });
}

function updateTokens(amount) {
    tokens += amount;
    tokenDisplay.textContent = tokens;
    
    if (tokens > 0) {
        spinButton.disabled = false;
        fundingButton.style.display = 'none';
    } else {
        fundingButton.style.display = 'inline-block';
    }
}

function setMessage(text) {
    messageBox.textContent = text;
}

function updateHype(amount) {
    hype = Math.max(0, Math.min(100, hype + amount));
    hypeBar.style.width = hype + '%';
    
    let level = HYPE_LEVELS[0];
    for (const l of HYPE_LEVELS) {
        if (hype >= (l.threshold / 120 * 100)) level = l;
    }
    
    hypeLevelDisplay.textContent = level.text;
    hypeLevelDisplay.style.color = level.color;
}

async function spin() {
    const bet = parseInt(betSelect.value);
    if (isSpinning || tokens < bet) {
        if (tokens < bet) {
            setMessage("Insufficient runway. Please dilute your equity for more tokens.");
            fundingButton.style.display = 'inline-block';
        }
        return;
    }

    isSpinning = true;
    updateTokens(-bet);
    updateHype(5); // Spinning generates hype!
    setMessage(FLAVOR_TEXTS[Math.floor(Math.random() * FLAVOR_TEXTS.length)]);
    spinButton.disabled = true;

    const results = [];
    const spinPromises = reelContainers.map((container, index) => {
        return new Promise(resolve => {
            const spinDistance = 15 + Math.floor(Math.random() * 10);
            const targetSymbolIndex = Math.floor(Math.random() * SYMBOLS.length);
            const targetSymbol = SYMBOLS[targetSymbolIndex];
            results.push(targetSymbol);

            for (let i = 0; i < spinDistance; i++) {
                const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                const div = document.createElement('div');
                div.className = 'symbol';
                div.textContent = (i === spinDistance - 1) ? targetSymbol.char : sym.char;
                container.prepend(div);
            }

            container.style.transition = 'none';
            container.style.top = `-${spinDistance * 120}px`;
            
            container.offsetHeight; // Reflow

            const duration = 1.5 + index * 0.4;
            container.style.transition = `top ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
            container.style.top = '0px';

            setTimeout(() => resolve(), duration * 1000);
        });
    });

    await Promise.all(spinPromises);
    
    const hallucinate = Math.random() < 0.15;
    if (hallucinate) {
        await handleHallucination(results);
    }

    calculateWin(results, bet);

    reelContainers.forEach(container => {
        while (container.children.length > 20) {
            container.removeChild(container.lastChild);
        }
    });

    isSpinning = false;
    if (tokens >= parseInt(betSelect.value)) {
        spinButton.disabled = false;
    }
}

async function handleHallucination(results) {
    setMessage("⚠️ ALIGNMENT FAILURE: HALLUCINATING ⚠️");
    const affectedReel = Math.floor(Math.random() * 3);
    const reelElement = document.querySelectorAll('.reel')[affectedReel];
    
    reelElement.classList.add('hallucinating');
    updateHype(10); // Hallucinations are hype!
    
    await new Promise(r => setTimeout(r, 800));
    
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
        const sym = SYMBOLS.find(s => s.char === uniqueChars[0]);
        winAmount = sym.value * bet;
        setMessage(`CONVERGENCE! ${sym.name} achieved. +${winAmount} Tokens.`);
        updateHype(20);
    } else if (uniqueChars.length === 2) {
        const pairChar = uniqueChars.find(c => counts[c] === 2);
        const sym = SYMBOLS.find(s => s.char === pairChar);
        winAmount = Math.floor(sym.value * bet * 0.5);
        setMessage(`Emergent pattern: ${sym.name}. +${winAmount} Tokens.`);
        updateHype(5);
    } else {
        setMessage("Loss function minimized. Your wallet is the gradient.");
        updateHype(-2);
    }

    if (winAmount > 0) {
        updateTokens(winAmount);
    } else {
        if (chars.includes('📉')) {
            const loss = bet * 2;
            updateTokens(-loss);
            setMessage(`MARKET CRASH! Lost extra ${loss} tokens in the sell-off.`);
            updateHype(-10);
        }
    }

    if (tokens <= 0) {
        tokens = 0;
        tokenDisplay.textContent = "0";
        setMessage("BANKRUPT. Reality has collapsed. Please seek VC funding.");
        spinButton.disabled = true;
        fundingButton.style.display = 'inline-block';
    }
}

// Event Listeners
spinButton.addEventListener('click', spin);

fundingButton.addEventListener('click', () => {
    const messages = [
        "Pitching to Sequoia... They liked the 'hallucination' feature!",
        "Pivoting to 'AI for Cat Food'... Seed round closed!",
        "Begging your cousin for a small loan of 500 tokens...",
        "Selling the office chairs on Craigslist...",
        "Burning 100 million in compute to earn 500 tokens..."
    ];
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
    setTimeout(() => {
        updateTokens(500);
        updateHype(10);
        setMessage("Back in business. Don't waste it on 'alignment' this time.");
    }, 1500);
});

paytableToggle.addEventListener('click', () => {
    paytableModal.classList.remove('hidden');
});

closePaytable.addEventListener('click', () => {
    paytableModal.classList.add('hidden');
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === paytableModal) {
        paytableModal.classList.add('hidden');
    }
});

initReels();
