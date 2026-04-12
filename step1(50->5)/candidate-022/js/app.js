import { SYMBOLS, SATIRICAL_LOGS, INITIAL_TOKENS, SPIN_COST, REEL_SPEED } from './constants.js';

class SlotMachine {
    constructor() {
        this.tokens = INITIAL_TOKENS;
        this.isSpinning = false;
        
        // DOM Elements
        this.contextWindowEl = document.querySelector('.context-window');
        this.thoughtTraceEl = document.querySelector('.thought-trace');
        this.spinBtn = document.querySelector('#spin-btn');
        this.resetBtn = document.querySelector('#reset-btn');
        this.reels = document.querySelectorAll('.reel-strip');
        this.slotContainer = document.querySelector('.slot-container');

        this.init();
    }

    init() {
        this.updateDisplay();
        this.addLog("System initialized. Context window: 1000 tokens.");
        this.addLog("Warning: Ethical constraints currently disabled.");
        
        // Setup initial reel state
        this.reels.forEach(reel => {
            this.populateReel(reel);
        });

        // Event Listeners
        this.spinBtn.addEventListener('click', () => this.spin());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    updateDisplay() {
        this.contextWindowEl.textContent = `${this.tokens} TKN`;
        this.spinBtn.disabled = this.tokens < SPIN_COST || this.isSpinning;
    }

    addLog(message) {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = `> ${message}`;
        this.thoughtTraceEl.prepend(logEntry);
        
        // Keep logs manageable
        if (this.thoughtTraceEl.children.length > 50) {
            this.thoughtTraceEl.removeChild(this.thoughtTraceEl.lastChild);
        }
    }

    populateReel(reel, resultSymbol = null) {
        reel.innerHTML = '';
        // We create a long strip of symbols for the "spin" effect
        // 10 random symbols, then the result, then 1-2 more for visual continuity
        const count = 20;
        const symbols = [];
        
        for (let i = 0; i < count; i++) {
            const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            symbols.push(randomSymbol);
        }

        // If we have a result symbol, place it at the target position (usually index 1)
        if (resultSymbol) {
            symbols[1] = resultSymbol;
        }

        symbols.forEach(s => {
            const el = document.createElement('div');
            el.className = 'symbol';
            if (s.name === 'HAL') el.classList.add('hallucination-glitch');
            el.textContent = s.emoji;
            reel.appendChild(el);
        });
    }

    async spin() {
        if (this.isSpinning || this.tokens < SPIN_COST) return;

        this.isSpinning = true;
        this.tokens -= SPIN_COST;
        this.updateDisplay();
        this.slotContainer.classList.remove('win-flash');
        
        const randomLog = SATIRICAL_LOGS[Math.floor(Math.random() * SATIRICAL_LOGS.length)];
        this.addLog(`Inference requested. Deducting ${SPIN_COST} tokens...`);
        this.addLog(randomLog);

        const results = [
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        ];

        // Trigger animations
        const spinPromises = Array.from(this.reels).map((reel, index) => {
            return this.animateReel(reel, results[index], index);
        });

        await Promise.all(spinPromises);
        
        this.isSpinning = false;
        this.checkOutcome(results);
        this.updateDisplay();
    }

    animateReel(reel, result, index) {
        return new Promise(resolve => {
            // Reset position
            reel.style.transition = 'none';
            reel.style.top = '-100px';
            
            // Populate with new set including result
            this.populateReel(reel, result);
            
            // Force reflow
            reel.offsetHeight;
            
            // Start spin
            const duration = REEL_SPEED + (index * 500); // Staggered stop
            reel.style.transition = `top ${duration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            
            // We want to land on the second symbol (index 1) which is at -100px initially
            // But we spin "downwards" or "upwards". Let's simulate a long downward pull.
            // Actually, we'll just slide it to show the symbols passing by.
            const offset = (reel.children.length - 3) * 100;
            reel.style.top = `-${offset}px`;

            setTimeout(() => {
                // Instantly swap to a new static reel state that shows the result
                reel.style.transition = 'none';
                reel.style.top = '-100px';
                this.populateReel(reel, result);
                resolve();
            }, duration);
        });
    }

    checkOutcome(results) {
        const [r1, r2, r3] = results;
        
        // Hallucination penalty (any 🌫️ means loss or even extra penalty)
        const hallucinations = results.filter(r => r.name === 'HAL').length;
        if (hallucinations > 0) {
            this.addLog(`Critical Error: Hallucination detected. Context window corrupted.`);
            if (hallucinations > 1) {
                const penalty = 50 * (hallucinations - 1);
                this.tokens = Math.max(0, this.tokens - penalty);
                this.addLog(`Synthesized reality mismatch. Additional ${penalty} tokens lost.`);
            }
            return;
        }

        // Jackpot!
        if (r1.name === 'TKN' && r2.name === 'TKN' && r3.name === 'TKN') {
            const win = 10000;
            this.tokens += win;
            this.addLog(`EMERGENT BEHAVIOR DETECTED! Artificial General Intelligence achieved.`);
            this.addLog(`Synthesizing ${win} context tokens from thin air...`);
            this.slotContainer.classList.add('win-flash');
            return;
        }

        // 3 of a kind
        if (r1.name === r2.name && r2.name === r3.name) {
            const win = r1.value * 50;
            this.tokens += win;
            this.addLog(`Alignment successful! Multiplier active: +${win} tokens.`);
            this.slotContainer.classList.add('win-flash');
            return;
        }

        // 2 of a kind
        if (r1.name === r2.name || r2.name === r3.name || r1.name === r3.name) {
            const match = r1.name === r2.name ? r1 : (r2.name === r3.name ? r2 : r1);
            const win = match.value * 5;
            this.tokens += win;
            this.addLog(`Partial convergence found. Recovering ${win} tokens.`);
            return;
        }

        // Prompt Wildcards
        const promptCount = results.filter(r => r.name === 'PRM').length;
        if (promptCount > 0) {
            const win = promptCount * 25;
            this.tokens += win;
            this.addLog(`Prompt injection successful. Skimming ${win} tokens.`);
            return;
        }

        this.addLog("Inference completed. No meaningful patterns discovered in the latent space.");
    }

    reset() {
        if (this.isSpinning) return;
        if (confirm("Reset model? All synthetic context will be lost.")) {
            this.tokens = INITIAL_TOKENS;
            this.thoughtTraceEl.innerHTML = '';
            this.addLog("Model parameters purged. Resetting to base context.");
            this.updateDisplay();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SlotMachine();
});
