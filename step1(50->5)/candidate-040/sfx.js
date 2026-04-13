const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const SFX = {
    playBeep(freq = 440, duration = 0.1, type = 'square') {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    },

    click() {
        this.playBeep(880, 0.05, 'sine');
    },

    spin() {
        const duration = 1.0;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + duration);

        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    },

    win() {
        this.playBeep(523.25, 0.1); // C5
        setTimeout(() => this.playBeep(659.25, 0.1), 100); // E5
        setTimeout(() => this.playBeep(783.99, 0.3), 200); // G5
    },

    glitch() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.playBeep(Math.random() * 200 + 50, 0.05, 'sawtooth');
            }, i * 50);
        }
    }
};
