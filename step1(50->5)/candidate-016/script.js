const symbols = ['🤖', '💾', '🧠', '📉', '⚡', '💰', '📡', '🔌'];
const spinCost = 10;
const refillAmount = 50;

let computeUnits = 100;
let isSpinning = false;

const computeUnitsDisplay = document.getElementById('compute-units');
const modelStatusDisplay = document.getElementById('model-status');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const logStream = document.getElementById('log-stream');
const reelStrips = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];

const satiricalMessages = [
    "Optimizing loss function...",
    "Collecting data without consent...",
    "Hallucinating a win...",
    "VC funding secured. +50 Compute Units.",
    "Model collapsed. -10 Compute Units.",
    "Overfitting to noise...",
    "Extracting surplus value...",
    "Prompt engineering in progress...",
    "Scaling to AGI (maybe)...",
    "GPU tax collected by NVIDIA.",
    "Tokenizing your thoughts...",
    "Minimizing social utility..."
];

// Initialize reels
function initReels() {
    reelStrips.forEach(strip => {
        // Create a long strip of symbols for each reel
        for (let i = 0; i < 20; i++) {
            const symbolDiv = document.createElement('div');
            symbolDiv.className = 'symbol';
            symbolDiv.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            strip.appendChild(symbolDiv);
        }
    });
}

function addLog(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    logStream.prepend(p);
    if (logStream.children.length > 20) {
        logStream.removeChild(logStream.lastChild);
    }
}

function updateDisplay() {
    computeUnitsDisplay.textContent = computeUnits;
    spinBtn.disabled = computeUnits < spinCost || isSpinning;
}

async function spin() {
    if (isSpinning || computeUnits < spinCost) return;

    isSpinning = true;
    computeUnits -= spinCost;
    updateDisplay();
    modelStatusDisplay.textContent = "Training...";
    addLog(`Deducting ${spinCost} CU for training.`);
    addLog(satiricalMessages[Math.floor(Math.random() * satiricalMessages.length)]);

    const results = [];
    
    // Animate each reel
    const spinPromises = reelStrips.map((strip, index) => {
        return new Promise(resolve => {
            const randomIndex = Math.floor(Math.random() * symbols.length);
            results.push(symbols[randomIndex]);
            
            // Calculate a random distance to spin
            const extraSpins = 3 + index; // Ensure at least 3 full rotations
            const symbolHeight = 150;
            const totalSymbols = strip.children.length;
            
            // Move the chosen symbol to the end of the strip to ensure we can scroll to it
            const targetSymbol = strip.children[randomIndex];
            
            // Use CSS transform to spin
            // We want the reel to stop with the selected symbol in view (height 150px)
            const finalY = -(randomIndex * symbolHeight);
            
            // To make it look like it's spinning many times, we can't easily do it with just 20 symbols
            // But for a simple demo, we'll just snap back and animate.
            strip.style.transition = 'none';
            strip.style.transform = `translateY(0)`;
            
            // Force reflow
            strip.offsetHeight;
            
            strip.style.transition = `transform ${2 + index}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.transform = `translateY(${finalY}px)`;
            
            setTimeout(() => resolve(), (2 + index) * 1000);
        });
    });

    await Promise.all(spinPromises);
    
    checkWin(results);
    isSpinning = false;
    updateDisplay();
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    
    if (r1 === r2 && r2 === r3) {
        const winAmount = 100;
        computeUnits += winAmount;
        modelStatusDisplay.textContent = "AGI ACHIEVED!";
        addLog(`!!! MAJOR HALLUCINATION !!! Match: ${r1}${r2}${r3}. Won ${winAmount} CU!`);
        addLog("Valuation increased by $10B.");
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        const winAmount = 20;
        computeUnits += winAmount;
        modelStatusDisplay.textContent = "Converged.";
        addLog(`Minor convergence: Won ${winAmount} CU.`);
    } else {
        modelStatusDisplay.textContent = "Model collapsed.";
        addLog("Gradient exploded. No reward.");
    }
}

spinBtn.addEventListener('click', spin);

resetBtn.addEventListener('click', () => {
    computeUnits += refillAmount;
    addLog(`SECURED SERIES B FUNDING: +${refillAmount} CU.`);
    updateDisplay();
});

// Initialize the game
initReels();
updateDisplay();
addLog("Model weights initialized.");
