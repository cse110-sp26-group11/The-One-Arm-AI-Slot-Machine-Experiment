const SYMBOLS = [
    { char: '🤖', name: 'AGI', weight: 5, payout: 50 },
    { char: '⚡', name: 'H100', weight: 10, payout: 20 },
    { char: '🧠', name: 'NeuralNet', weight: 15, payout: 10 },
    { char: '🤡', name: 'PromptEng', weight: 25, payout: 5 },
    { char: '👻', name: 'Hallucination', weight: 10, payout: 0 }, // Special: Can double or wipe
    { char: '📉', name: 'Collapse', weight: 15, payout: -2 } // Penalty
];

let state = {
    tokens: 1000,
    bet: 10,
    temperature: 0.7,
    isSpinning: false
};

// DOM Elements
const tokenDisplay = document.getElementById('token-balance');
const betInput = document.getElementById('bet-input');
const tempSlider = document.getElementById('temp-slider');
const tempDisplay = document.getElementById('temp-display');
const spinBtn = document.getElementById('spin-btn');
const logOutput = document.getElementById('log-output');
const reels = [
    document.getElementById('reel1').querySelector('.reel-strip'),
    document.getElementById('reel2').querySelector('.reel-strip'),
    document.getElementById('reel3').querySelector('.reel-strip')
];

// Initialize
function init() {
    betInput.addEventListener('change', (e) => {
        state.bet = Math.max(1, parseInt(e.target.value) || 1);
        betInput.value = state.bet;
    });

    tempSlider.addEventListener('input', (e) => {
        state.temperature = parseFloat(e.target.value);
        tempDisplay.textContent = state.temperature;
        addLog(`Temperature set to ${state.temperature}. Volatility recalibrated.`);
    });

    spinBtn.addEventListener('click', runInference);
}

function addLog(msg) {
    const div = document.createElement('div');
    div.textContent = msg;
    logOutput.prepend(div);
    if (logOutput.childNodes.length > 20) logOutput.lastChild.remove();
}

function getRandomSymbol() {
    // Weight logic adjusted by temperature
    // High temp increases weight of Ghosts and Collapse
    let currentWeights = SYMBOLS.map(s => {
        let weight = s.weight;
        if (state.temperature > 1.0) {
            if (s.name === 'Hallucination' || s.name === 'Collapse') weight *= state.temperature;
            if (s.name === 'AGI') weight /= state.temperature;
        }
        return weight;
    });

    const totalWeight = currentWeights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    
    for (let i = 0; i < SYMBOLS.length; i++) {
        if (rand < currentWeights[i]) return SYMBOLS[i];
        rand -= currentWeights[i];
    }
    return SYMBOLS[0];
}

async function runInference() {
    if (state.isSpinning || state.tokens < state.bet) {
        if (state.tokens < state.bet) addLog("ERROR: Insufficient Compute Credits. Purchase more H100s.");
        return;
    }

    state.isSpinning = true;
    spinBtn.disabled = true;
    state.tokens -= state.bet;
    updateUI();

    addLog(`Deducting ${state.bet} tokens... Initializing weights...`);

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    // Animation Logic
    const reelPromises = reels.map((reel, i) => {
        return new Promise(resolve => {
            // Generate some random symbols for the "spin" effect
            reel.innerHTML = '';
            for (let j = 0; j < 20; j++) {
                const s = getRandomSymbol();
                const div = document.createElement('div');
                div.textContent = s.char;
                reel.appendChild(div);
            }
            
            // Final result
            const finalDiv = document.createElement('div');
            finalDiv.textContent = results[i].char;
            reel.appendChild(finalDiv);

            // Trigger animation
            const height = reel.scrollHeight;
            reel.style.transition = 'none';
            reel.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                reel.style.transition = `transform ${1.5 + i * 0.5}s cubic-bezier(0.12, 0.84, 0.5, 1)`;
                reel.style.transform = `translateY(-${height - 150}px)`;
            }, 50);

            setTimeout(resolve, 1500 + i * 500);
        });
    });

    await Promise.all(reelPromises);
    
    calculateOutcome(results);
    state.isSpinning = false;
    spinBtn.disabled = false;
}

function calculateOutcome(results) {
    const chars = results.map(r => r.char);
    const names = results.map(r => r.name);
    
    addLog(`Inference Complete: [${chars.join(' | ')}]`);

    let win = 0;
    let multiplier = 1;

    // Check for "Hallucination" (Ghost)
    if (names.includes('Hallucination')) {
        const roll = Math.random();
        if (roll > 0.5) {
            multiplier = 2;
            addLog("CRITICAL: Hallucination positive! Win doubled.");
        } else {
            multiplier = 0;
            addLog("CRITICAL: Hallucination negative! Result discarded.");
        }
    }

    // Check for "Collapse"
    if (names.includes('Collapse')) {
        const penalty = state.bet * 2;
        state.tokens -= penalty;
        addLog(`ALERT: Model Collapse detected. Extra ${penalty} credits consumed.`);
    }

    // Payout logic
    if (names[0] === names[1] && names[1] === names[2]) {
        // 3 of a kind
        win = results[0].payout * state.bet;
        addLog(`JACKPOT: ${results[0].name} alignment achieved! +${win} credits.`);
    } else if (names[0] === names[1] || names[1] === names[2] || names[0] === names[2]) {
        // 2 of a kind
        const pairName = (names[0] === names[1]) ? names[0] : names[2];
        const pairSymbol = SYMBOLS.find(s => s.name === pairName);
        win = Math.floor(pairSymbol.payout * (state.bet / 2));
        addLog(`MATCH: Partial alignment of ${pairName}. +${win} credits.`);
    } else {
        addLog("FAILURE: Optimization failed to converge. Zero tokens returned.");
    }

    state.tokens += win * multiplier;
    updateUI();
}

function updateUI() {
    tokenDisplay.textContent = Math.floor(state.tokens);
    if (state.tokens <= 0) {
        addLog("SYSTEM_HALT: Total compute bankruptcy. Reload to reset lab.");
        spinBtn.disabled = true;
    }
}

init();
updateUI();
