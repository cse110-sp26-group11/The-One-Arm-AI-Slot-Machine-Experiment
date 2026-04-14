const symbols = ['🧠', '🤖', '💰', '🔥', '📉', '🚀', '🌌'];
const winMessages = [
    "AGI achieved! (Actually, just more compute.)",
    "Model overfitted. Profits secured!",
    "Venture Capital infusion successful!",
    "Your hallucination was actually correct!",
    "You found a valid use case for blockchain in AI!",
    "Sam Altman just DM'd you. You're rich!"
];
const loseMessages = [
    "Model hallucinated. Tokens lost.",
    "GPU temperature too high. Retrying...",
    "Server timed out. Buy more credits.",
    "Ethics committee blocked your spin.",
    "Data scraped from a 404 page. Invaluable loss.",
    "The model says: 'As an AI language model, I cannot win for you.'",
    "Your model just tried to start a cult. Shutdown initiated.",
    "RLHF failed. The AI hates you now."
];

let tokens = 1000;
let totalLoss = 0;

const tokenDisplay = document.getElementById('token-count');
const lossDisplay = document.getElementById('total-loss');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const statusMsg = document.getElementById('status-msg');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const addTokensBtn = document.getElementById('add-tokens-btn');
const betSelect = document.getElementById('bet-amount');

spinBtn.addEventListener('click', () => {
    const spinCost = parseInt(betSelect.value);

    if (tokens < spinCost) {
        statusMsg.innerText = "Insufficient compute. Sell your GPU or request VC funding.";
        statusMsg.style.color = "#ff00ff";
        return;
    }

    tokens -= spinCost;
    totalLoss += spinCost;
    updateStats();
    
    spinBtn.disabled = true;
    addTokensBtn.disabled = true;
    resetBtn.disabled = true;
    statusMsg.innerText = "Processing tokens... Training in progress...";
    statusMsg.style.color = "#e0e0e0";

    reels.forEach(reel => {
        reel.classList.add('spinning');
        reel.innerText = '⌛';
    });

    setTimeout(() => {
        const results = reels.map(reel => {
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel.innerText = symbol;
            reel.classList.remove('spinning');
            return symbol;
        });

        checkResult(results, spinCost);
        spinBtn.disabled = false;
        addTokensBtn.disabled = false;
        resetBtn.disabled = false;
    }, 1500);
});

addTokensBtn.addEventListener('click', () => {
    const funding = 500;
    tokens += funding;
    updateStats();
    const fundingMessages = [
        "Series A closed! +500 compute credits.",
        "Sold some user data. +500 compute credits.",
        "Found a hard drive in a landfill. +500 compute credits.",
        "Convinced a boomer that AI is magic. +500 compute credits."
    ];
    statusMsg.innerText = fundingMessages[Math.floor(Math.random() * fundingMessages.length)];
    statusMsg.style.color = "#00ffcc";
});

resetBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to pivot? This will reset your weights but keep your burn rate record.")) {
        tokens = 1000;
        updateStats();
        statusMsg.innerText = "Pivot successful! Now we do... Web4? +1000 credits.";
        statusMsg.style.color = "#00ffcc";
        reels.forEach(reel => reel.innerText = '?');
    }
});

function updateStats() {
    tokenDisplay.innerText = tokens;
    lossDisplay.innerText = totalLoss;
}

function checkResult(results, bet) {
    if (results[0] === results[1] && results[1] === results[2]) {
        // Jack-AI-pot
        let multiplier = 20;
        let msg = winMessages[Math.floor(Math.random() * winMessages.length)];
        
        if (results[0] === '💰') {
            multiplier = 50;
            msg = "IPO SECURED! YOU ARE THE NEW ELON!";
        }

        const reward = bet * multiplier;
        tokens += reward;
        updateStats();
        statusMsg.innerText = `${msg} (+${reward} Credits)`;
        statusMsg.style.color = "#00ffcc";
    } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        // Partial Convergence
        const reward = bet * 2;
        tokens += reward;
        updateStats();
        statusMsg.innerText = `Partial Convergence. 2x ROI achieved. (+${reward} Credits)`;
        statusMsg.style.color = "#00ffcc";
    } else {
        // Stochastic Parrot (Loss)
        statusMsg.innerText = loseMessages[Math.floor(Math.random() * loseMessages.length)];
        statusMsg.style.color = "#ff00ff";
    }
}
