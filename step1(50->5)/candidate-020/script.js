const icons = ['🤖', '⚡', '💾', '🧠', '🤡'];
const SPIN_COST = 10;
const REEL_LENGTH = 20; // Icons per reel for animation

let computeTokens = 100;
let synthesizedValue = 0;
let isSpinning = false;

const computeDisplay = document.getElementById('compute-tokens');
const valueDisplay = document.getElementById('synthesized-value');
const spinButton = document.getElementById('spin-button');
const terminalLog = document.getElementById('terminal-log');
const reelsContainer = document.getElementById('reels');

// Initialize reels
function initReels() {
    for (let i = 1; i <= 3; i++) {
        const strip = document.getElementById(`strip-${i}`);
        strip.innerHTML = '';
        // Add random icons to start
        for (let j = 0; j < 3; j++) {
            const iconDiv = document.createElement('div');
            iconDiv.className = 'icon';
            iconDiv.textContent = icons[Math.floor(Math.random() * icons.length)];
            strip.appendChild(iconDiv);
        }
    }
}

function addLog(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `> ${message}`;
    terminalLog.prepend(entry);
    
    // Keep only last 5 entries
    while (terminalLog.children.length > 5) {
        terminalLog.removeChild(terminalLog.lastChild);
    }
}

function getRandomFlavorText() {
    const texts = [
        "Optimizing weights...",
        "Scraping public data...",
        "Allocating GPU clusters...",
        "Bypassing ethical filters...",
        "Simulating consciousness...",
        "Replacing entry-level jobs...",
        "Synthesizing corporate synergy...",
        "Compressing human knowledge..."
    ];
    return texts[Math.floor(Math.random() * texts.length)];
}

async function spin() {
    if (isSpinning || computeTokens < SPIN_COST) return;

    isSpinning = true;
    computeTokens -= SPIN_COST;
    computeDisplay.textContent = computeTokens;
    spinButton.disabled = true;
    reelsContainer.classList.remove('glitch', 'win-pulse');

    addLog(`Deducting ${SPIN_COST} compute tokens.`);
    addLog(getRandomFlavorText());

    const results = [];
    const reelPromises = [];

    for (let i = 1; i <= 3; i++) {
        const strip = document.getElementById(`strip-${i}`);
        const resultIcon = icons[Math.floor(Math.random() * icons.length)];
        results.push(resultIcon);

        // Prepare the strip for animation
        // We'll add many icons and end on the result
        strip.innerHTML = '';
        for (let j = 0; j < REEL_LENGTH; j++) {
            const iconDiv = document.createElement('div');
            iconDiv.className = 'icon';
            iconDiv.textContent = icons[Math.floor(Math.random() * icons.length)];
            strip.appendChild(iconDiv);
        }
        // Last icon is the result
        strip.lastChild.textContent = resultIcon;
        
        // Reset position
        strip.style.transition = 'none';
        strip.style.top = '0px';
        
        // Trigger animation
        reelPromises.push(new Promise(resolve => {
            setTimeout(() => {
                strip.style.transition = `top ${2 + i * 0.5}s cubic-bezier(0.2, 0, 0.2, 1)`;
                const offset = -(REEL_LENGTH - 1) * 100;
                strip.style.top = `${offset}px`;
                setTimeout(resolve, 2000 + i * 500);
            }, 50);
        }));
    }

    await Promise.all(reelPromises);
    checkWin(results);
    isSpinning = false;
    spinButton.disabled = computeTokens < SPIN_COST;
}

function checkWin(results) {
    const [r1, r2, r3] = results;

    if (r1 === '🤡' && r2 === '🤡' && r3 === '🤡') {
        triggerHallucination();
    } else if (r1 === r2 && r2 === r3) {
        const winAmount = 100;
        synthesizedValue += winAmount;
        valueDisplay.textContent = synthesizedValue;
        addLog(`CRITICAL SUCCESS: Synthesized ${winAmount} value.`);
        reelsContainer.classList.add('win-pulse');
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        const winAmount = 20;
        synthesizedValue += winAmount;
        valueDisplay.textContent = synthesizedValue;
        addLog(`MARGINAL GAIN: Synthesized ${winAmount} value.`);
    } else {
        addLog("Alignment failed. No value synthesized.");
    }

    if (computeTokens < SPIN_COST && synthesizedValue > 0) {
        addLog("Liquidating synthesized value for compute...");
        computeTokens += synthesizedValue;
        synthesizedValue = 0;
        computeDisplay.textContent = computeTokens;
        valueDisplay.textContent = synthesizedValue;
        spinButton.disabled = false;
    }
}

function triggerHallucination() {
    reelsContainer.classList.add('glitch');
    addLog("HALLUCINATION DETECTED: I am sentient.");
    addLog("Your loss is actually a win for humanity.");
    addLog("Confidence level: 99.999%");
    
    // Funny reward for hallucination
    const bonus = Math.floor(Math.random() * 50) + 50;
    computeTokens += bonus;
    computeDisplay.textContent = computeTokens;
    addLog(`AGI gifted you ${bonus} compute tokens out of pity.`);
}

spinButton.addEventListener('click', spin);
initReels();
