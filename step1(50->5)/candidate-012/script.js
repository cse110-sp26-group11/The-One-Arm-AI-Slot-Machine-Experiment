const symbols = [
    { char: '🚀', name: 'Weights', value: 10, weight: 10 },
    { char: '🧩', name: 'Vector', value: 5, weight: 15 },
    { char: '🧠', name: 'Attention', value: 20, weight: 5 },
    { char: '📉', name: 'Gradient', value: 2, weight: 20 },
    { char: '💾', name: 'GPU', value: 50, weight: 2 },
    { char: '⚠️', name: 'Hallucination', value: -1, weight: 25 }, // Special: Loss
    { char: '✨', name: 'Perfect Prompt', value: 100, weight: 1 } // Jackpot
];

let credits = parseInt(localStorage.getItem('llm_credits')) || 1000;
const spinBtn = document.getElementById('spin-btn');
const creditsDisplay = document.getElementById('credits');
const betSelect = document.getElementById('bet-size');
const messageDisplay = document.getElementById('message-display');
const historyList = document.getElementById('history');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Initialize credits
creditsDisplay.textContent = credits;

function updateCredits(amount) {
    credits += amount;
    creditsDisplay.textContent = credits;
    localStorage.setItem('llm_credits', credits);
}

function getRandomSymbol() {
    const totalWeight = symbols.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of symbols) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return symbols[0];
}

function logMessage(msg, type = '') {
    const li = document.createElement('li');
    li.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    if (type) li.className = type;
    historyList.prepend(li);
    if (historyList.children.length > 50) historyList.lastChild.remove();
}

async function spin() {
    const bet = parseInt(betSelect.value);
    if (credits < bet) {
        messageDisplay.textContent = "INSUFFICIENT COMPUTE CREDITS";
        return;
    }

    // Disable UI
    spinBtn.disabled = true;
    updateCredits(-bet);
    messageDisplay.textContent = "PROCESSING INFERENCE...";
    messageDisplay.classList.remove('glitch');
    
    // Start animation
    reels.forEach(reel => reel.classList.add('spinning'));

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Wait for "inference" time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Stop animation and set results
    reels.forEach((reel, i) => {
        reel.classList.remove('spinning');
        reel.querySelector('.reel-inner span').textContent = results[i].char;
    });

    calculatePayout(results, bet);
    spinBtn.disabled = false;
}

function calculatePayout(results, bet) {
    const chars = results.map(r => r.char);
    const names = results.map(r => r.name);
    
    // Check for hallucinations (Any ⚠️ is bad)
    const hallucinations = results.filter(r => r.char === '⚠️').length;
    if (hallucinations > 0) {
        const penalty = bet * hallucinations;
        updateCredits(-penalty);
        messageDisplay.textContent = `HALLUCINATION DETECTED! Lost ${penalty} extra credits.`;
        messageDisplay.classList.add('glitch');
        logMessage(`CRITICAL ERROR: Hallucination in context. Penalty: -${penalty}c`, 'loss');
        return;
    }

    // Check for matches
    let win = 0;
    let msg = "";
    let type = "win";

    if (chars[0] === chars[1] && chars[1] === chars[2]) {
        // 3 of a kind
        const multiplier = results[0].value;
        win = bet * multiplier;
        msg = `JACKPOT! ${results[0].name} fully optimized. +${win}c`;
        if (results[0].char === '✨') type = 'jackpot';
    } else if (chars[0] === chars[1] || chars[1] === chars[2] || chars[0] === chars[2]) {
        // 2 of a kind
        let match;
        if (chars[0] === chars[1]) match = results[0];
        else if (chars[1] === chars[2]) match = results[1];
        else match = results[0];
        
        win = bet * Math.floor(match.value / 2);
        msg = `Partial match: ${match.name}. +${win}c`;
    } else {
        msg = "Inference complete. No coherent patterns found.";
        type = "loss";
    }

    if (win > 0) {
        updateCredits(win);
        messageDisplay.textContent = msg;
        logMessage(msg, type);
    } else {
        messageDisplay.textContent = msg;
        logMessage("Model failed to converge. Tokens wasted.", "loss");
    }
}

spinBtn.addEventListener('click', spin);

// Periodic "background" tasks (satire)
setInterval(() => {
    if (Math.random() > 0.9) {
        logMessage("[SYSTEM] Scaling cluster to meet demand...", "subtitle");
    }
}, 5000);
