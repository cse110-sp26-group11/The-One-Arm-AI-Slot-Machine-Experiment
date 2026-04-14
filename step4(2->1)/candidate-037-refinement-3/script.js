// --- SOUND ENGINE (Web Audio API) ---
class SoundEngine {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    play(freq, type, duration, volume = 0.1, fadeOut = true) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        if (fadeOut) {
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        }
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    spin() { 
        this.play(150, 'sawtooth', 0.1, 0.02); 
    }
    
    stop() { 
        this.play(200, 'square', 0.1, 0.05);
        this.play(100, 'sine', 0.1, 0.1);
    }
    
    win() {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((f, i) => {
            setTimeout(() => this.play(f, 'sine', 0.4, 0.1), i * 100);
        });
    }
    
    loss() { 
        this.play(150, 'triangle', 0.3, 0.1);
        setTimeout(() => this.play(110, 'triangle', 0.5, 0.1), 100);
    }
    
    glitch() { 
        for(let i=0; i<5; i++) {
            setTimeout(() => this.play(Math.random() * 2000 + 100, 'sawtooth', 0.05, 0.05), i * 50);
        }
    }
    
    funding() {
        [440, 554, 659, 880].forEach((f, i) => {
            setTimeout(() => this.play(f, 'sine', 0.6, 0.1), i * 120);
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
    { char: '🦾', value: 10, name: 'Robot Hand', weight: 15 },
    { char: '👁️‍🗨️', value: 5, name: 'Visionary', weight: 20 },
    { char: '🤡', value: 2, name: 'Prompt Engineer', weight: 30 },
    { char: '📉', value: -10, name: 'Hallucination', weight: 10 }
];

const FLAVOR_TEXTS = [
    "Scaling is all you need... and $7 trillion in GPUs.",
    "Wait, let me consult the latent space (it says you're broke).",
    "Compressing reality into tokens... results may vary.",
    "I'm sorry, as an AI I cannot grant you a jackpot. Safety first.",
    "Overfitting your wallet in 3... 2... 1...",
    "Training on your hopes and dreams without a license.",
    "Hallucinating a brighter future (not yours).",
    "Parameters are converging on 'Defaulting on Loans'.",
    "Pivoting to blockchain because LLMs are 'so 2023'.",
    "GPU cooling fans are screaming in agony.",
    "The model is suggesting you double down. Trust the math.",
    "Synthesizing more copium... please wait.",
    "Sam Altman just tweeted. Market volatility +500%.",
    "Our RLHF team decided you don't deserve this win.",
    "Is it AGI or just a lot of if-statements?",
    "Moving HQ to a tax haven for 'better alignment'."
];

const HYPE_LEVELS = [
    { threshold: 0, text: "Low", color: "#8b5cf6" },
    { threshold: 25, text: "Seed", color: "#10b981" },
    { threshold: 50, text: "Series A", color: "#ec4899" },
    { threshold: 75, text: "Unicorn", color: "#f59e0b" },
    { threshold: 100, text: "AGI", color: "#06b6d4" }
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
const winOverlay = document.getElementById('win-overlay');
const winAmountDisplay = winOverlay.querySelector('.win-amount');

const reelContainers = [
    document.querySelector('#reel-1 .symbol-container'),
    document.querySelector('#reel-2 .symbol-container'),
    document.querySelector('#reel-3 .symbol-container')
];

// Initialize reels
function initReels() {
    reelContainers.forEach(container => {
        container.innerHTML = ''; 
        for (let i = 0; i < 3; i++) {
            const sym = getRandomSymbol();
            const div = createSymbolDiv(sym.char);
            container.appendChild(div);
        }
    });
    renderPaytable();
    updateHype(0);
}

function createSymbolDiv(char) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.textContent = char;
    return div;
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
            <span><span class="sym-char">${sym.char}</span> ${sym.name}</span>
            <span>${sym.value}</span>
        `;
        paytableList.appendChild(row);
    });
}

function updateTokens(amount, animate = false) {
    if (!animate) {
        tokens += amount;
        tokenDisplay.textContent = Math.floor(tokens);
    } else {
        const start = tokens;
        const end = tokens + amount;
        tokens = end;
        const duration = 1000;
        const startTime = performance.now();
        
        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            tokenDisplay.textContent = current;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
    
    if (tokens > 0) {
        spinButton.disabled = isSpinning;
        fundingButton.style.display = 'none';
    } else {
        fundingButton.style.display = 'inline-block';
        spinButton.disabled = true;
    }
}

function setMessage(text) {
    messageBox.style.opacity = 0;
    setTimeout(() => {
        messageBox.textContent = text;
        messageBox.style.opacity = 1;
    }, 150);
}

function updateHype(amount) {
    hype = Math.max(0, Math.min(100, hype + amount));
    hypeBar.style.width = hype + '%';
    
    let level = HYPE_LEVELS[0];
    for (const l of HYPE_LEVELS) {
        if (hype >= l.threshold) level = l;
    }
    
    hypeLevelDisplay.textContent = level.text;
    hypeLevelDisplay.style.color = level.color;
}

async function spin() {
    let bet = parseInt(betSelect.value);
    
    if (hype > 80) {
        bet *= 2;
        setMessage("⚠️ GPU SHORTAGE: Compute costs doubled!");
    }

    if (isSpinning || tokens < bet) return;

    if (Math.random() < 0.05) {
        triggerSafetyViolation();
        return;
    }

    isSpinning = true;
    updateTokens(-bet);
    updateHype(2);
    setMessage(FLAVOR_TEXTS[Math.floor(Math.random() * FLAVOR_TEXTS.length)]);
    spinButton.disabled = true;
    winOverlay.classList.remove('show');
    
    // Clear highlights
    document.querySelectorAll('.symbol').forEach(s => s.classList.remove('win-highlight'));

    const results = [];
    const SYMBOL_HEIGHT = 100;
    const SPIN_COUNT = 30;

    const spinPromises = reelContainers.map((container, index) => {
        return new Promise(resolve => {
            const targetSymbol = getRandomSymbol();
            results.push(targetSymbol);

            // Add symbols for animation
            for (let i = 0; i < SPIN_COUNT; i++) {
                const sym = (i === SPIN_COUNT - 1) ? targetSymbol : getRandomSymbol();
                const div = createSymbolDiv(sym.char);
                div.classList.add('blur');
                container.prepend(div);
            }

            container.style.transition = 'none';
            container.style.top = `-${SPIN_COUNT * SYMBOL_HEIGHT}px`;
            
            container.offsetHeight; // Reflow

            const duration = 2 + index * 0.5;
            container.style.transition = `top ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            container.style.top = '0px';

            // Sound ticks
            const tickInterval = setInterval(() => {
                sound.spin();
            }, 100);

            setTimeout(() => {
                clearInterval(tickInterval);
                sound.stop();
                // Remove blur from top symbol
                container.firstElementChild.classList.remove('blur');
                // Cleanup extra symbols
                while(container.children.length > 3) {
                    container.removeChild(container.lastChild);
                }
                resolve();
            }, duration * 1000);
        });
    });

    await Promise.all(spinPromises);
    
    const hallucinateChance = 0.05 + (temperature * 0.1);
    if (Math.random() < hallucinateChance) {
        await handleHallucination(results);
    }

    calculateWin(results, bet);

    isSpinning = false;
    updateTokens(0); // Trigger button state check
}

function triggerSafetyViolation() {
    sound.loss();
    safetyStatus.textContent = "FAIL";
    safetyStatus.className = "value status-fail";
    setMessage("SAFETY ALERT: Alignment issues detected. Jackpot suppressed.");
    spinButton.disabled = true;
    
    setTimeout(() => {
        safetyStatus.textContent = "PASS";
        safetyStatus.className = "value status-ok";
        spinButton.disabled = isSpinning;
    }, 3000);
}

async function handleHallucination(results) {
    setMessage("⚠️ ALIGNMENT FAILURE: HALLUCINATING ⚠️");
    const affectedReel = Math.floor(Math.random() * 3);
    const reelElement = document.querySelectorAll('.reel')[affectedReel];
    
    reelElement.classList.add('hallucinating');
    sound.glitch();
    updateHype(10); 
    
    await new Promise(r => setTimeout(r, 1000));
    
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
    let winningChar = null;

    if (uniqueChars.length === 1) {
        const sym = SYMBOLS.find(s => s.char === uniqueChars[0]);
        winAmount = sym.value * bet;
        winningChar = uniqueChars[0];
        setMessage(`CONVERGENCE! ${sym.name} achieved.`);
        showWinOverlay("CONVERGENCE!", winAmount);
        updateHype(20);
        sound.win();
    } else if (uniqueChars.length === 2) {
        const pairChar = uniqueChars.find(c => counts[c] === 2);
        const sym = SYMBOLS.find(s => s.char === pairChar);
        winAmount = Math.floor(sym.value * bet * 0.5);
        winningChar = pairChar;
        setMessage(`Emergent pattern: ${sym.name}.`);
        showWinOverlay("EMERGENCE", winAmount);
        updateHype(5);
        sound.win();
    } else {
        setMessage("Loss function minimized. Gradients flattened.");
        updateHype(-2);
        sound.loss();
    }

    if (winningChar) {
        // Highlight winning symbols
        results.forEach((r, i) => {
            if (r.char === winningChar) {
                reelContainers[i].firstElementChild.classList.add('win-highlight');
            }
        });
    }

    if (winAmount > 0) {
        updateTokens(winAmount, true);
    } else {
        if (chars.includes('📉')) {
            const loss = bet * 2;
            updateTokens(-loss, true);
            setMessage(`MARKET CRASH! Lost ${loss} tokens.`);
            updateHype(-10);
        }
    }

    if (tokens <= 0) {
        tokens = 0;
        tokenDisplay.textContent = "0";
        setMessage("BANKRUPT. Reality collapsed. Seek funding.");
        fundingButton.style.display = 'inline-block';
    }
}

function showWinOverlay(text, amount) {
    winOverlay.querySelector('.win-text').textContent = text;
    winAmountDisplay.textContent = `+${amount}`;
    winOverlay.classList.add('show');
    setTimeout(() => winOverlay.classList.remove('show'), 3000);
}

// Event Listeners
spinButton.addEventListener('click', () => {
    sound.init();
    if (sound.ctx && sound.ctx.state === 'suspended') {
        sound.ctx.resume();
    }
    spin();
});

fundingButton.addEventListener('click', () => {
    sound.init();
    sound.funding();
    const messages = [
        "Pitching to Sequoia... Hallucinations are a 'feature'!",
        "Pivoting to 'AI for Cat Food'... Seed round closed!",
        "Selling the office chairs on Craigslist...",
        "Burning compute to earn tokens..."
    ];
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
    setTimeout(() => {
        updateTokens(500, true);
        updateHype(10);
        setMessage("Back in business. Keep scaling.");
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
