const symbols = [
    { char: '🤖', name: 'AGI', value: 1000 },
    { char: '🧠', name: 'Neural Net', value: 500 },
    { char: '⚡', name: 'GPU', value: 200 },
    { char: '💸', name: 'VC Funding', value: 100 },
    { char: '📉', name: 'Token Burn', value: 0 },
    { char: '💩', name: 'Hallucination', value: 0 }
];

// Weighted distribution for more realism (and more losses)
const weightedSymbols = [
    '🤖', 
    '🧠', '🧠', 
    '⚡', '⚡', '⚡', 
    '💸', '💸', '💸', '💸',
    '📉', '📉', '📉', '📉', '📉',
    '💩', '💩', '💩', '💩', '💩', '💩'
];

let credits = 1000;
const spinCost = 100;

const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const spinButton = document.getElementById('spin-button');
const creditDisplay = document.getElementById('credits');
const logDisplay = document.getElementById('log');

const satiricalMessages = [
    "Scaling laws in effect...",
    "Injecting venture capital...",
    "Optimizing loss function...",
    "Tokenizing the universe...",
    "Bypassing safety alignment...",
    "Hallucinating a better future...",
    "Burning through H100 clusters...",
    "Synthesizing sentient silicon...",
    "Disrupting the disruption...",
    "Prompt engineering for profit..."
];

function addLog(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    logDisplay.prepend(p);
    
    // Keep only last 10 messages
    if (logDisplay.children.length > 10) {
        logDisplay.removeChild(logDisplay.lastChild);
    }
}

function getRandomSymbol() {
    return weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
}

function calculateWin(results) {
    const counts = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);

    for (const symbolChar in counts) {
        if (counts[symbolChar] === 3) {
            const sym = symbols.find(s => s.char === symbolChar);
            return { win: sym.value, name: sym.name, count: 3 };
        }
        if (counts[symbolChar] === 2) {
            const sym = symbols.find(s => s.char === symbolChar);
            // Small consolation for 2 matches
            return { win: Math.floor(sym.value / 5), name: sym.name, count: 2 };
        }
    }
    return { win: 0 };
}

async function spin() {
    if (credits < spinCost) {
        addLog("ERROR: Insufficient Compute Credits. Seed round required.");
        return;
    }

    // Reset UI
    credits -= spinCost;
    creditDisplay.textContent = credits;
    spinButton.disabled = true;
    addLog(satiricalMessages[Math.floor(Math.random() * satiricalMessages.length)]);

    // Start spinning animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Wait for "inference"
    await new Promise(resolve => setTimeout(resolve, 1500));

    const hypeDisplay = document.getElementById('hype');
    const hypeLevels = ["OVER 9000", "EXPONENTIAL", "PARABOLIC", "BUBBLE?", "AGI SOON", "SINGULARITY", "MOORE'S LAW+", "TOTAL DISRUPTION"];
    hypeDisplay.textContent = hypeLevels[Math.floor(Math.random() * hypeLevels.length)];

    // Determine results
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Stop animation and show results
    reels.forEach((reel, i) => {
        reel.classList.remove('spinning');
        reel.textContent = results[i];
    });

    const result = calculateWin(results);

    if (result.win > 0) {
        credits += result.win;
        creditDisplay.textContent = credits;
        addLog(`SUCCESS: ${result.name} synthesized! +${result.win} credits.`);
        document.querySelector('.slot-machine').classList.add('win-animation');
        setTimeout(() => {
            document.querySelector('.slot-machine').classList.remove('win-animation');
        }, 1500);
    } else {
        addLog("FAILURE: Hallucination detected. Scaling failed.");
    }

    if (credits < spinCost) {
        addLog("CRITICAL: Compute exhausted. Please contact your local VC.");
    }

    spinButton.disabled = false;
}

spinButton.addEventListener('click', spin);
