const SYMBOLS = ['🤖', '💰', '🧩', '📈', '📉', '🧠', '⚡'];
const SYMBOL_HEIGHT = 110;
const INITIAL_BALANCE = 1000;

let balance = INITIAL_BALANCE;
let currentBet = 10;
let isSpinning = false;

const balanceDisplay = document.getElementById('token-balance');
const betAmountDisplay = document.getElementById('bet-amount');
const betSlider = document.getElementById('bet-slider');
const spinButton = document.getElementById('spin-button');
const chatLog = document.getElementById('chat-log');
const strips = [
    document.getElementById('strip-1'),
    document.getElementById('strip-2'),
    document.getElementById('strip-3')
];

// Initialize reels
function initReels() {
    strips.forEach(strip => {
        // Create a long strip of symbols for each reel
        for (let i = 0; i < 20; i++) {
            const symbolDiv = document.createElement('div');
            symbolDiv.className = 'symbol';
            symbolDiv.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            strip.appendChild(symbolDiv);
        }
    });
}

function addLog(message, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    chatLog.appendChild(entry);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function updateStats() {
    balanceDisplay.textContent = Math.floor(balance);
    betAmountDisplay.textContent = currentBet;
    spinButton.disabled = balance < currentBet || isSpinning;
}

betSlider.addEventListener('input', (e) => {
    currentBet = parseInt(e.target.value);
    updateStats();
});

let reelOffsets = [0, 0, 0];

async function spin() {
    if (isSpinning || balance < currentBet) return;

    isSpinning = true;
    balance -= currentBet;
    updateStats();
    addLog(`Deducting ${currentBet} tokens for inference...`);

    const results = [];
    const spinPromises = strips.map((strip, index) => {
        return new Promise(resolve => {
            const targetIndex = Math.floor(Math.random() * SYMBOLS.length);
            results.push(SYMBOLS[targetIndex]);

            // Ensure we always spin forward by adding to current offset
            // We want at least 3-7 full rotations + the target index
            const rotations = 5 + index * 2;
            const extraSymbols = rotations * SYMBOLS.length + targetIndex;
            reelOffsets[index] += extraSymbols;
            
            const finalPosition = reelOffsets[index] * SYMBOL_HEIGHT;

            // Hallucination chance (10%)
            const isHallucinating = Math.random() < 0.1;
            
            strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.15, 0, 0.15, 1)`;
            strip.style.transform = `translateY(-${finalPosition}px)`;

            setTimeout(() => {
                if (isHallucinating) {
                    const hallucinatedSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                    // Find which actual child is visible at the current offset
                    const visibleChildIndex = reelOffsets[index] % strip.children.length;
                    strip.children[visibleChildIndex].textContent = hallucinatedSymbol;
                    results[index] = hallucinatedSymbol;
                    addLog(`ERROR: Bit-flip detected in Reel ${index + 1}. Hallucinating result...`, 'hallucination');
                }
                resolve();
            }, (2 + index * 0.5) * 1000);
        });
    });

    await Promise.all(spinPromises);
    checkWin(results);
    isSpinning = false;
    updateStats();

    // Silent reset if we're getting deep into the strip
    strips.forEach((strip, index) => {
        if (reelOffsets[index] > 300) {
            const modOffset = reelOffsets[index] % SYMBOLS.length;
            reelOffsets[index] = modOffset;
            strip.style.transition = 'none';
            strip.style.transform = `translateY(-${modOffset * SYMBOL_HEIGHT}px)`;
            // Force reflow
            strip.offsetHeight; 
        }
    });
}

function checkWin(results) {
    const counts = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);

    const uniqueSymbols = Object.keys(counts);
    let winAmount = 0;

    if (uniqueSymbols.length === 1) {
        // 3 of a kind
        winAmount = currentBet * 10;
        addLog(`JACKPOT! High confidence response generated. +${winAmount} tokens.`, 'win');
    } else if (uniqueSymbols.length === 2) {
        // 2 of a kind
        winAmount = currentBet * 2;
        addLog(`Partial match. Low temperature response. +${winAmount} tokens.`, 'win');
    } else {
        // No match
        const lossMessages = [
            "Rate limited. Context window overflow.",
            "Safety filter triggered. Payout redacted.",
            "Hallucination detected. Reality does not match expectations.",
            "Request timed out. VCs are withdrawing funding.",
            "Tokens spent, but result was 'As an AI, I cannot...'"
        ];
        addLog(lossMessages[Math.floor(Math.random() * lossMessages.length)], 'error');
    }

    balance += winAmount;
    
    // Reset positions silently if needed (not strictly required for this simplified version)
}

spinButton.addEventListener('click', spin);

// Populate reel strips with more symbols for continuous-looking spin
function repopulateStrips() {
    strips.forEach(strip => {
        strip.innerHTML = '';
        for (let i = 0; i < 400; i++) {
            const symbolDiv = document.createElement('div');
            symbolDiv.className = 'symbol';
            symbolDiv.textContent = SYMBOLS[i % SYMBOLS.length];
            strip.appendChild(symbolDiv);
        }
    });
}

repopulateStrips();
updateStats();
addLog("System initialized. Awaiting user input...");
