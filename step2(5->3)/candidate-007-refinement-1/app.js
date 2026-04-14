const symbols = ['🧠', '🤖', '💰', '🔥', '📉', '🚀', '🌌'];
const winMessages = [
    "AGI achieved! (Actually, just more compute.)",
    "Model overfitted. Profits secured!",
    "Venture Capital infusion successful!",
    "Your hallucination was actually correct!",
    "You found a valid use case for blockchain in AI!"
];
const loseMessages = [
    "Model hallucinated. Tokens lost.",
    "GPU temperature too high. Retrying...",
    "Server timed out. Buy more credits.",
    "Ethics committee blocked your spin.",
    "Data scraped from a 404 page. Invaluable loss.",
    "The model says: 'As an AI language model, I cannot win for you.'"
];

let tokens = 1000;
let totalLoss = 0;
const spinCost = 50;

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

spinBtn.addEventListener('click', () => {
    if (tokens < spinCost) {
        statusMsg.innerText = "Insufficient tokens. Liquidate your startup?";
        return;
    }

    tokens -= spinCost;
    totalLoss += spinCost;
    updateStats();
    
    spinBtn.disabled = true;
    statusMsg.innerText = "Processing tokens... Training in progress...";

    reels.forEach(reel => reel.classList.add('spinning'));

    setTimeout(() => {
        const results = reels.map(reel => {
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel.innerText = symbol;
            reel.classList.remove('spinning');
            return symbol;
        });

        checkResult(results);
        spinBtn.disabled = false;
    }, 1500);
});

resetBtn.addEventListener('click', () => {
    tokens = 1000;
    totalLoss = 0;
    updateStats();
    statusMsg.innerText = "Model weights reset. Start fresh (but still lose).";
    reels.forEach(reel => reel.innerText = '?');
});

function updateStats() {
    tokenDisplay.innerText = tokens;
    lossDisplay.innerText = totalLoss;
}

function checkResult(results) {
    if (results[0] === results[1] && results[1] === results[2]) {
        // Jack-AI-pot
        const reward = 1000;
        tokens += reward;
        updateStats();
        statusMsg.innerText = winMessages[Math.floor(Math.random() * winMessages.length)];
        statusMsg.style.color = "#00ffcc";
    } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        // Small win (Partial Convergence)
        const reward = 75;
        tokens += reward;
        updateStats();
        statusMsg.innerText = "Partial Convergence. 75 tokens recovered.";
        statusMsg.style.color = "#00ffcc";
    } else {
        // Stochastic Parrot (Loss)
        statusMsg.innerText = loseMessages[Math.floor(Math.random() * loseMessages.length)];
        statusMsg.style.color = "#ff00ff";
    }
}
