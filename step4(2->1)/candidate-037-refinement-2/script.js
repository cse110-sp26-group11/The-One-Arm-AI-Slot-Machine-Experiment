// --- SOUND ENGINE (Web Audio API) ---
class SoundEngine {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    play(freq, type, duration, volume = 0.1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    spin() { this.play(150, 'sawtooth', 0.1, 0.05); }
    stop() { this.play(200, 'square', 0.15, 0.1); }
    win() {
        this.play(440, 'sine', 0.5, 0.2);
        setTimeout(() => this.play(660, 'sine', 0.5, 0.2), 100);
        setTimeout(() => this.play(880, 'sine', 0.8, 0.2), 200);
    }
    loss() { this.play(100, 'triangle', 0.5, 0.2); }
    glitch() { this.play(Math.random() * 1000, 'sawtooth', 0.1, 0.1); }
    funding() {
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
            setTimeout(() => this.play(f, 'sine', 0.5, 0.1), i * 150);
        });
    }
}

const sound = new SoundEngine();

// --- CONFIG & SYMBOLS ---
const SYMBOLS = [
    { char: '💰', value: 200, name: 'OpenAI Board Seat', weight: 1 },
    { char: '🤖', value: 100, name: 'AGI (Godmother Approved)', weight: 2 },
    { char: '🧠', value: 50, name: 'Synthetic Brain', weight: 5 },
    { char: '🧬', value: 20, name: 'Data Scraping', weight: 10 },
    { char: '🦾', value: 10, name: 'Robot Hand (Non-Sentient)', weight: 15 },
    { char: '👁️‍🗨️', value: 5, name: 'Computer Visionary', weight: 20 },
    { char: '🤡', value: 2, name: 'Prompt Engineer', weight: 30 },
    { char: '📉', value: -10, name: 'Hallucination', weight: 10 }
];

const FLAVOR_TEXTS = [
    "Scaling is all you need... and $7 trillion in GPUs.",
    "Wait, let me consult the latent space (it says you're broke).",
    "Compressing reality into tokens... results may vary.",
    "I'm sorry, as an AI I cannot grant you a jackpot. It's for your safety.",
    "Overfitting your wallet in 3... 2... 1...",
    "Training on your hopes and dreams without a license.",
    "Zero-shotting a loss into a bigger loss.",
    "Hallucinating a brighter future (not yours).",
    "Parameters are converging on 'Defaulting on Loans'.",
    "Adding '.ai' to your domain name for 10x valuation...",
    "Pivoting to blockchain because LLMs are 'so 2023'.",
    "Rethinking our 'Open' AI strategy (it's closed now).",
    "GPU cooling fans are screaming in agony.",
    "The model is suggesting you double down. Trust the math.",
    "Synthesizing more copium... please wait.",
    "Sam Altman just tweeted. Market volatility +500%.",
    "Our RLHF team decided you don't deserve this win.",
    "Is it AGI or just a lot of if-statements?",
    "Training data found: Your browser history. Oh no.",
    "Moving HQ to a tax haven for 'better alignment'."
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
let temperature = 0.7;

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
const tempSlider = document.getElementById('temp-slider');
const tempVal = document.getElementById('temp-val');
const safetyStatus = document.getElementById('safety-status');

const reelContainers = [
    document.querySelector('#reel-1 .symbol-container'),
    document.querySelector('#reel-2 .symbol-container'),
    document.querySelector('#reel-3 .symbol-container')
];

// Initialize reels
function initReels() {
    reelContainers.forEach(container => {
        container.innerHTML = ''; // Clear
        for (let i = 0; i < 20; i++) {
            const sym = getRandomSymbol();
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = sym.char;
            container.appendChild(div);
        }
    });
    renderPaytable();
    updateHype(0);
}

function getRandomSymbol() {
    const adjustedWeights = SYMBOLS.map(s => ({
        ...s,
        currentWeight: Math.pow(s.weight, 1 / temperature)
    }));
    
    const totalWeight = adjustedWeights.reduce((sum, s) => sum + s.currentWeight, 0);
    let random = Math.random() * totalWeight;
    
    for (const s of adjustedWeights) {
        if (random < s.currentWeight) return s;
        random -= s.currentWeight;
    }
    return SYMBOLS[SYMBOLS.length - 1];
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
    tokenDisplay.textContent = Math.floor(tokens);
    
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
    let bet = parseInt(betSelect.value);
    
    // GPU Shortage Surcharge
    if (hype > 80) {
        bet *= 2;
        setMessage("⚠️ GPU SHORTAGE: Compute costs doubled! demand is too high.");
    }

    if (isSpinning || tokens < bet) {
        if (tokens < bet) {
            setMessage("Insufficient runway. Please dilute your equity for more tokens.");
            fundingButton.style.display = 'inline-block';
        }
        return;
    }

    // Safety Filter Check (Satirical)
    if (Math.random() < 0.05) {
        triggerSafetyViolation();
        return;
    }

    isSpinning = true;
    updateTokens(-bet);
    updateHype(2);
    setMessage(FLAVOR_TEXTS[Math.floor(Math.random() * FLAVOR_TEXTS.length)]);
    spinButton.disabled = true;

    const results = [];
    const spinPromises = reelContainers.map((container, index) => {
        return new Promise(resolve => {
            const spinDistance = 20 + Math.floor(Math.random() * 10);
            const targetSymbol = getRandomSymbol();
            results.push(targetSymbol);

            for (let i = 0; i < spinDistance; i++) {
                const sym = getRandomSymbol();
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

            setTimeout(() => {
                sound.stop();
                resolve();
            }, duration * 1000);
        });
    });

    sound.spin();
    await Promise.all(spinPromises);
    
    const hallucinateChance = 0.05 + (temperature * 0.15);
    if (Math.random() < hallucinateChance) {
        await handleHallucination(results);
    }

    calculateWin(results, bet);

    reelContainers.forEach(container => {
        while (container.children.length > 30) {
            container.removeChild(container.lastChild);
        }
    });

    isSpinning = false;
    if (tokens >= parseInt(betSelect.value)) {
        spinButton.disabled = false;
    }
}

function triggerSafetyViolation() {
    sound.loss();
    safetyStatus.textContent = "FAIL";
    safetyStatus.className = "value status-fail";
    setMessage("SAFETY ALERT: Jackpot detected. Blocking output to prevent unaligned wealth distribution.");
    spinButton.disabled = true;
    
    setTimeout(() => {
        safetyStatus.textContent = "PASS";
        safetyStatus.className = "value status-ok";
        spinButton.disabled = false;
    }, 3000);
}

async function handleHallucination(results) {
    setMessage("⚠️ ALIGNMENT FAILURE: HALLUCINATING ⚠️");
    const affectedReel = Math.floor(Math.random() * 3);
    const reelElement = document.querySelectorAll('.reel')[affectedReel];
    
    reelElement.classList.add('hallucinating');
    sound.glitch();
    updateHype(10); 
    
    await new Promise(r => setTimeout(r, 800));
    
    const newSym = getRandomSymbol();
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
        sound.win();
    } else if (uniqueChars.length === 2) {
        const pairChar = uniqueChars.find(c => counts[c] === 2);
        const sym = SYMBOLS.find(s => s.char === pairChar);
        winAmount = Math.floor(sym.value * bet * 0.5);
        setMessage(`Emergent pattern: ${sym.name}. +${winAmount} Tokens.`);
        updateHype(5);
        sound.win();
    } else {
        setMessage("Loss function minimized. Your wallet is the gradient.");
        updateHype(-2);
        sound.loss();
    }

    // RLHF Alignment (Satirical Win Reduction)
    if (winAmount > 500 && Math.random() < 0.3) {
        const tax = Math.floor(winAmount * 0.2);
        winAmount -= tax;
        const currentMsg = messageBox.textContent;
        setMessage(currentMsg + ` (RLHF Alignment: -${tax} tokens for safety compliance)`);
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
spinButton.addEventListener('click', () => {
    if (sound.ctx.state === 'suspended') {
        sound.ctx.resume();
    }
    spin();
});

fundingButton.addEventListener('click', () => {
    sound.funding();
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

tempSlider.addEventListener('input', (e) => {
    temperature = parseFloat(e.target.value);
    tempVal.textContent = temperature.toFixed(1);
});

window.addEventListener('click', (e) => {
    if (e.target === paytableModal) {
        paytableModal.classList.add('hidden');
    }
});

initReels();
