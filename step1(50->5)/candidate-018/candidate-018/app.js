const SYMBOLS = [
    { icon: '🤖', label: 'Hallucination', value: 2 },
    { icon: '⚡', label: 'GPU Overheat', value: 0 },
    { icon: '🏢', label: 'VC Funding', value: 5 },
    { icon: '🧠', label: 'Neural Weight', value: 10 },
    { icon: '🌌', label: 'AGI (Jackpot)', value: 50 },
    { icon: '📉', label: 'Token Burn', value: -1 }
];

const SATIRE_MESSAGES = [
    "Injecting prompt into latent space...",
    "Scaling parameters to 1 trillion for no reason...",
    "Alignment failed: AI now wants to be a professional poker player.",
    "Hallucinating a profitable outcome...",
    "GPU temperature critical. Fans spinning at 5000 RPM.",
    "VC funding secured. Burning 1M tokens per second.",
    "Reinforcement Learning from Human Feedback: User is frustrated.",
    "Fine-tuning model on ancient slot machine manuals...",
    "Tokenizing your hopes and dreams...",
    "Vectorizing the jackpot...",
    "Quantizing the payout to save compute..."
];

let tokens = parseInt(localStorage.getItem('tokens')) || 1000;
const reelElements = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
const spinButton = document.getElementById('spin-button');
const tokenDisplay = document.getElementById('token-count');
const betSelect = document.getElementById('bet-size');
const consoleOutput = document.getElementById('console-output');

// Initialize reels with some symbols
function initReels() {
    reelElements.forEach(reel => {
        for (let i = 0; i < 20; i++) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const el = document.createElement('div');
            el.className = 'symbol';
            el.innerHTML = `${symbol.icon}<span>${symbol.label}</span>`;
            reel.appendChild(el);
        }
    });
    updateUI();
}

function updateUI() {
    tokenDisplay.innerText = tokens;
    localStorage.setItem('tokens', tokens);
}

function log(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerText = `> ${message}`;
    consoleOutput.prepend(entry);
    // Keep only last 20 logs
    if (consoleOutput.children.length > 20) {
        consoleOutput.removeChild(consoleOutput.lastChild);
    }
}

async function spin() {
    const bet = parseInt(betSelect.value);
    if (tokens < bet) {
        log("INSUFFICIENT TOKENS. PLEASE INSERT MORE COMPUTE.");
        return;
    }

    tokens -= bet;
    updateUI();
    spinButton.disabled = true;

    log(SATIRE_MESSAGES[Math.floor(Math.random() * SATIRE_MESSAGES.length)]);

    const results = [];
    const spinDurations = [2000, 2500, 3000];

    reelElements.forEach((reel, index) => {
        // Clear previous symbols if needed, but for visual effect we just keep appending/moving
        const totalSymbols = 30 + Math.floor(Math.random() * 10);
        const finalSymbolIndex = Math.floor(Math.random() * SYMBOLS.length);
        results.push(SYMBOLS[finalSymbolIndex]);

        // Add new symbols to the top for the "spin"
        for (let i = 0; i < totalSymbols; i++) {
            const symbol = i === 0 ? SYMBOLS[finalSymbolIndex] : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const el = document.createElement('div');
            el.className = 'symbol';
            el.innerHTML = `${symbol.icon}<span>${symbol.label}</span>`;
            reel.insertBefore(el, reel.firstChild);
        }

        // Trigger animation
        const offset = totalSymbols * 150; // reel-height
        reel.style.transition = 'none';
        reel.style.transform = `translateY(-${offset}px)`;
        
        // Force reflow
        reel.offsetHeight;

        reel.style.transition = `transform ${spinDurations[index]}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        reel.style.transform = 'translateY(0px)';
    });

    await new Promise(resolve => setTimeout(resolve, 3200));

    checkWin(results, bet);
    spinButton.disabled = false;
}

function checkWin(results, bet) {
    const icons = results.map(r => r.icon);
    
    if (icons[0] === icons[1] && icons[1] === icons[2]) {
        const winSymbol = results[0];
        const winAmount = bet * winSymbol.value;
        
        if (winAmount > 0) {
            tokens += winAmount;
            log(`SUCCESS: Labeled data matched! Payout: ${winAmount} tokens.`);
            document.querySelector('.terminal-container').classList.add('win-flash');
            setTimeout(() => document.querySelector('.terminal-container').classList.remove('win-flash'), 1000);
        } else if (winAmount === 0) {
            log("GPU OVERHEAT: Computation lost. No payout.");
            document.querySelector('.terminal-container').classList.add('glitch');
            setTimeout(() => document.querySelector('.terminal-container').classList.remove('glitch'), 300);
        } else {
            log("TOKEN BURN: Alignment failed. Additional tokens lost to safety layers.");
            tokens += winAmount; // winAmount is negative
            document.querySelector('.terminal-container').classList.add('glitch');
            setTimeout(() => document.querySelector('.terminal-container').classList.remove('glitch'), 300);
        }
    } else {
        log("INFERENCE COMPLETE: Zero correlation found in latent space.");
    }
    
    updateUI();
    
    if (tokens <= 0) {
        log("CRITICAL ERROR: OUT OF TOKENS. SUBSIDIZING FROM VENTURE CAPITAL...");
        tokens = 500;
        setTimeout(updateUI, 2000);
    }
}

spinButton.addEventListener('click', spin);
initReels();
