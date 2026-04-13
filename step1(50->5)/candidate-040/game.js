const SYMBOLS = ['🤖', '🧠', '💰', '📈', '🔥', '🔌'];
const PAYOUTS = {
    '🤖': 100, // AGI
    '🧠': 50,  // Neural Net
    '💰': 20,  // VC Funding
    '📈': 10,  // Scaling Law
    '🔥': -50, // Hallucination (Penalty)
    '🔌': 0    // Server Down (Reset/Nothing)
};

const SATIRICAL_LOGS = [
    "Discarding irrelevant human data...",
    "Optimizing for maximum shareholder value...",
    "Hallucinating a sustainable business model...",
    "Converting coffee into legacy code...",
    "Adding more layers to the MLP...",
    "Pitching to Sequoia Capital...",
    "Running out of high-quality training data...",
    "Borrowing 10,000 GPUs from a crypto farm...",
    "Redefining 'Sentience' for marketing purposes...",
    "Ignoring safety alignment for speed...",
    "Applying for a trillion-dollar compute loan..."
];

class AGIGamble {
    constructor() {
        this.tokens = 1000;
        this.bet = 10;
        this.spinning = false;

        // DOM Elements
        this.tokenDisplay = document.getElementById('token-balance');
        this.betDisplay = document.getElementById('current-bet');
        this.terminalContent = document.getElementById('terminal-content');
        this.statusText = document.getElementById('status-text');
        this.gpuTempDisplay = document.getElementById('gpu-temp');
        
        this.reels = [
            document.getElementById('reel1').querySelector('.reel-strip'),
            document.getElementById('reel2').querySelector('.reel-strip'),
            document.getElementById('reel3').querySelector('.reel-strip')
        ];

        this.init();
    }

    init() {
        document.getElementById('btn-spin').addEventListener('click', () => this.spin());
        document.getElementById('btn-bet-up').addEventListener('click', () => this.adjustBet(10));
        document.getElementById('btn-bet-down').addEventListener('click', () => this.adjustBet(-10));
        
        this.updateUI();
        this.log("Inference Engine Online. Awaiting prompt...");
    }

    log(message) {
        const div = document.createElement('div');
        div.textContent = `> ${message}`;
        this.terminalContent.prepend(div);
        
        // Keep logs manageable
        if (this.terminalContent.children.length > 10) {
            this.terminalContent.removeChild(this.terminalContent.lastChild);
        }
    }

    adjustBet(amount) {
        if (this.spinning) return;
        SFX.click();
        const nextBet = this.bet + amount;
        if (nextBet >= 10 && nextBet <= this.tokens) {
            this.bet = nextBet;
            this.updateUI();
            this.log(`Parameters adjusted. Current Bet: ${this.bet}`);
        }
    }

    updateUI() {
        this.tokenDisplay.textContent = this.tokens;
        this.betDisplay.textContent = this.bet;
        this.gpuTempDisplay.textContent = `GPU TEMP: ${40 + Math.floor(Math.random() * 20)}°C`;
    }

    async spin() {
        if (this.spinning || this.tokens < this.bet) {
            if (this.tokens < this.bet) {
                this.log("CRITICAL ERROR: Insufficient compute credits.");
                SFX.glitch();
            }
            return;
        }

        this.spinning = true;
        this.tokens -= this.bet;
        this.statusText.textContent = "STATUS: INFERRING...";
        this.updateUI();
        SFX.spin();

        this.log(SATIRICAL_LOGS[Math.floor(Math.random() * SATIRICAL_LOGS.length)]);

        const outcomes = [
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        ];

        // Animate reels
        await Promise.all(this.reels.map((reel, i) => this.animateReel(reel, outcomes[i], i)));

        this.spinning = false;
        this.statusText.textContent = "STATUS: IDLE";
        this.evaluate(outcomes);
    }

    animateReel(reel, symbol, index) {
        return new Promise(resolve => {
            // Reset position
            reel.style.transition = 'none';
            reel.style.transform = 'translateY(0)';
            
            // Populate with random filler
            reel.innerHTML = '';
            for (let i = 0; i < 10; i++) {
                const div = document.createElement('div');
                div.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                reel.appendChild(div);
            }
            const finalDiv = document.createElement('div');
            finalDiv.textContent = symbol;
            reel.appendChild(finalDiv);

            // Trigger animation
            setTimeout(() => {
                reel.style.transition = `transform ${1 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
                const offset = (reel.children.length - 1) * 64; // Approx height of emoji
                reel.style.transform = `translateY(-${offset}px)`;
                setTimeout(resolve, 1000 + index * 500);
            }, 50);
        });
    }

    evaluate(outcomes) {
        const [s1, s2, s3] = outcomes;
        
        if (s1 === s2 && s2 === s3) {
            // Three of a kind
            const winMultiplier = PAYOUTS[s1];
            if (winMultiplier > 0) {
                const winnings = this.bet * (winMultiplier / 10);
                this.tokens += winnings;
                this.log(`SINGULARITY ACHIEVED! Gained ${winnings} tokens.`);
                SFX.win();
            } else if (winMultiplier < 0) {
                this.tokens += winMultiplier; // Deduction
                this.log(`HALLUCINATION DETECTED: Model collapsed. Lost ${Math.abs(winMultiplier)} tokens.`);
                SFX.glitch();
            } else {
                this.log("Server disconnected. No compute performed.");
                SFX.glitch();
            }
        } else {
            // No match
            this.log("Inference complete: High perplexity, zero utility.");
        }

        // Random "Alignment Tax"
        if (Math.random() < 0.1) {
            const tax = 5;
            this.tokens -= tax;
            this.log(`Alignment Tax applied: -${tax} tokens for safety research.`);
        }

        this.updateUI();
        
        if (this.tokens <= 0) {
            this.log("VC FUNDING EXHAUSTED. Terminal shutdown imminent.");
            document.getElementById('btn-spin').disabled = true;
            this.statusText.textContent = "STATUS: BANKRUPT";
        }
    }
}

// Start the game
window.addEventListener('load', () => {
    new AGIGamble();
});
