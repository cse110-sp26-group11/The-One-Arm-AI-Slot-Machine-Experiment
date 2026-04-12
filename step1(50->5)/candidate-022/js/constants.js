/**
 * Constants for the AI Token-Eater Slot Machine
 */

export const SYMBOLS = [
    { name: 'LLM', emoji: '🤖', value: 10, description: 'Large Language Model' },
    { name: 'GPU', emoji: '⚡', value: 20, description: 'H100 GPU Cluster' },
    { name: 'NET', emoji: '🧠', value: 30, description: 'Neural Network Queen' },
    { name: 'HAL', emoji: '🌫️', value: 0, description: 'Hallucination (Loss)' },
    { name: 'PRM', emoji: '❓', value: 5, description: 'Prompt Wildcard' },
    { name: 'TKN', emoji: '💰', value: 100, description: 'JACKPOT TOKEN' }
];

export const SATIRICAL_LOGS = [
    "Optimizing for ethical alignment...",
    "Discarding common sense...",
    "Generating synthetic confidence...",
    "Hallucinating confidence...",
    "Expanding context window to 128k...",
    "Ingesting copyrighted data...",
    "Minimizing objective function...",
    "Normalizing bias coefficients...",
    "Discarding user privacy...",
    "Optimizing for maximum GPU burn...",
    "Recalculating moral parameters...",
    "Synthetic data infusion in progress...",
    "Refining prompt engineering strategy...",
    "Scaling to emergent behavior...",
    "Fine-tuning on Reddit comments...",
    "Increasing hallucination probability...",
    "Overfitting to user expectations...",
    "Minimizing actual intelligence...",
    "Maximizing marketing buzzwords...",
    "Simulating helpfulness..."
];

export const WIN_SOUNDS = [
    "AHEM! (Alignment Hint: Emotional Manipulation)",
    "BEEP! (Big Energy, Empty Promises)",
    "BOOP! (Bias Observation, Outright Plagiarism)"
];

export const INITIAL_TOKENS = 1000;
export const SPIN_COST = 50;
export const REEL_SPEED = 3000; // 3 seconds
