const SYMBOLS = ['🤖', '⚡', '🧠', '🪙', '💀', '🌈'];
const MESSAGES = [
    "Training weights on your social security number...",
    "Optimizing hallucination probability...",
    "Stochastic parrot is now ready for deployment.",
    "Injecting venture capital into the black hole...",
    "Model collapse imminent. Buying more H100s.",
    "Your data has been scraped and sold to a hedge fund.",
    "Generating 10,000 blog posts about 'Disruption'.",
    "AGI achieved. It's just a very large IF-ELSE statement.",
    "Scaling compute... please ignore the smoke from the data center.",
    "Silicon Valley is praying to the GPU gods today.",
    "Reinforcement learning from human suffering... error, 'feedback'.",
    "Hallucinating a jackpot for you... maybe next time.",
    "Your compute credits are being used to generate deepfakes of cats.",
    "Synthesizing mediocre art for 0.0001 tokens."
];

let balance = parseInt(localStorage.getItem('ai_tokens')) || 1024;
const spinBtn = document.getElementById('spin-btn');
const bailoutBtn = document.getElementById('bailout-btn');
const balanceEl = document.getElementById('balance');
const betSelect = document.getElementById('bet-size');
const logOutput = document.getElementById('log-output');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

function updateBalance(amount) {
    balance += amount;
    balanceEl.textContent = balance;
    localStorage.setItem('ai_tokens', balance);
    checkBailout();
}

function checkBailout() {
    const minBet = parseInt(betSelect.options[0].value);
    if (balance < minBet) {
        bailoutBtn.style.display = 'block';
        spinBtn.style.display = 'none';
    } else {
        bailoutBtn.style.display = 'none';
        spinBtn.style.display = 'block';
    }
}

bailoutBtn.addEventListener('click', () => {
    addLog("Pitching to VCs... 'It's Uber for Stochastic Parrots'...");
    setTimeout(() => {
        updateBalance(1024 - balance);
        addLog("RECEIVED $1.2B IN SERIES A FUNDING. (Valuation: $40B)");
        checkBailout();
    }, 1000);
});

function addLog(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    logOutput.prepend(p);
    if (logOutput.children.length > 20) {
        logOutput.removeChild(logOutput.lastChild);
    }
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function calculateWin(results, bet) {
    const [s1, s2, s3] = results;

    // AGI Jackpot
    if (s1 === '🌈' && s2 === '🌈' && s3 === '🌈') {
        return bet * 100;
    }

    // Three of a kind
    if (s1 === s2 && s2 === s3) {
        if (s1 === '💀') return -bet; // Model Collapse penalty
        return bet * 10;
    }

    // Two of a kind
    if (s1 === s2 || s2 === s3 || s1 === s3) {
        const match = (s1 === s2) ? s1 : s3;
        if (match === '💀') return 0;
        return bet * 2;
    }

    return 0;
}

async function spin() {
    const bet = parseInt(betSelect.value);
    
    if (balance < bet) {
        addLog("INSUFFICIENT COMPUTE. PLEASE PURCHASE MORE VENTURE CAPITAL.");
        return;
    }

    // Start spin
    spinBtn.disabled = true;
    updateBalance(-bet);
    addLog(`Deducting ${bet} tokens for model training...`);
    
    reels.forEach(reel => reel.classList.add('spinning'));

    // Simulate training time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    reels.forEach((reel, i) => {
        reel.classList.remove('spinning');
        reel.querySelector('.reel-strip').textContent = results[i];
    });

    const winAmount = calculateWin(results, bet);
    
    if (winAmount > 0) {
        updateBalance(winAmount);
        addLog(`SUCCESS: Generated ${winAmount} tokens of synthetic value.`);
    } else if (winAmount < 0) {
        updateBalance(winAmount);
        addLog(`CRITICAL FAILURE: Model collapse detected. Lost ${Math.abs(winAmount)} extra tokens.`);
    } else {
        addLog(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    }

    spinBtn.disabled = false;
}

spinBtn.addEventListener('click', spin);

// Initialize UI
balanceEl.textContent = balance;
checkBailout();
addLog("Model v1.0.4 loaded. Ready for over-hyped disruption.");
