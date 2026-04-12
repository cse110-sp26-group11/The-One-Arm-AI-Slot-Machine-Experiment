const symbols = ['🤖', '📉', '🍕', '🚀', '☁️'];
const phrases = [
    "GPU Fans Screaming...",
    "Buying more NVIDIA stock...",
    "Replacing your job with a regex...",
    "Overfitting on your losses...",
    "Scraping Reddit for personality...",
    "Hallucinating a better future...",
    "Requesting 50,000 more H100s...",
    "Optimizing for maximum engagement...",
    "Injecting venture capital...",
    "Simulating a bubble...",
    "Training on synthetic data (oops)...",
    "Pivoting to crypto? No, wait...",
    "Scaling to infinite compute..."
];

let computeCredits = parseInt(localStorage.getItem('computeCredits')) || 100;
let hallucinationScore = parseInt(localStorage.getItem('hallucinationScore')) || 0;

const computeDisplay = document.getElementById('compute-credits');
const scoreDisplay = document.getElementById('hallucination-score');
const ticker = document.getElementById('log-ticker');
const trainButton = document.getElementById('train-button');
const betInput = document.getElementById('hype-injection');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const seedFundingContainer = document.getElementById('seed-funding-container');
const seedFundingButton = document.getElementById('seed-funding-button');

function updateDisplay() {
    computeDisplay.textContent = computeCredits;
    scoreDisplay.textContent = hallucinationScore;
    localStorage.setItem('computeCredits', computeCredits);
    localStorage.setItem('hallucinationScore', hallucinationScore);

    if (computeCredits <= 0) {
        trainButton.disabled = true;
        seedFundingContainer.classList.remove('hidden');
    } else {
        trainButton.disabled = false;
        seedFundingContainer.classList.add('hidden');
    }
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function getRandomPhrase() {
    return phrases[Math.floor(Math.random() * phrases.length)];
}

function updateTicker() {
    ticker.textContent = `> ${getRandomPhrase()} > ${getRandomPhrase()} > ${getRandomPhrase()}`;
}

function calculateWin(results, bet) {
    const counts = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);

    // 3 of a kind
    if (results[0] === results[1] && results[1] === results[2]) {
        const symbol = results[0];
        if (symbol === '🤖') return bet * 50; // Jackpot
        if (symbol === '📉') return -bet * 5; // Model Collapse
        if (symbol === '🚀') return bet * 20; // Hype Train
        if (symbol === '☁️') return bet * 10; // Cloud Scale
        if (symbol === '🍕') return bet * 15; // Tasty Hallucination
    }

    // 2 of a kind
    for (const s in counts) {
        if (counts[s] === 2) {
            if (s === '📉') return -bet;
            return Math.floor(bet * 1.5);
        }
    }

    // Wildcard 🍕
    if (counts['🍕']) return bet;

    return 0;
}

async function spin() {
    const bet = parseInt(betInput.value);
    if (bet > computeCredits) {
        alert("Insufficient Compute! Inject less hype or request seed funding.");
        return;
    }

    computeCredits -= bet;
    updateDisplay();
    updateTicker();

    trainButton.disabled = true;
    
    // Animation
    reels.forEach(r => r.classList.add('spinning'));

    const spinResults = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Staggered stop
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + (i * 300)));
        reels[i].classList.remove('spinning');
        reels[i].textContent = spinResults[i];
    }

    const winAmount = calculateWin(spinResults, bet);
    hallucinationScore += winAmount;
    
    if (winAmount > bet) {
        ticker.textContent = `> SUCCESS: Model generalized! Gained ${winAmount} IQ.`;
    } else if (winAmount < 0) {
        ticker.textContent = `> ERROR: Model collapsed! Lost ${Math.abs(winAmount)} compute.`;
        computeCredits += winAmount; // winAmount is negative
    } else if (winAmount === 0) {
        ticker.textContent = `> LOG: Low confidence prediction. 0 returns.`;
    } else {
        ticker.textContent = `> LOG: Minimal hallucination detected. Gained ${winAmount} IQ.`;
    }

    updateDisplay();
    trainButton.disabled = false;
}

trainButton.addEventListener('click', spin);

seedFundingButton.addEventListener('click', () => {
    computeCredits = 100;
    hallucinationScore = 0;
    updateDisplay();
    ticker.textContent = "> RECEIVED SEED FUNDING: Burning through capital again...";
});

// Init
updateDisplay();
setInterval(updateTicker, 10000);
updateTicker();
