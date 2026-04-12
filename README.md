# Tech Warm-Up: The One Arm AI Slot Machine Experiment
## CSE110 Spring 2026 — Team Potatoes

---

## Experiment Overview

This is a controlled experiment measuring the consistency and variation in outputs from **OpenAI's GPT-5.4** when given identical prompts under clean session conditions.

**Primary Research Question:**  
How much variation, drift, and quality spread do we see when the same prompt is run 50 times in clean sessions, and what does a tightly constrained refinement process buy us?

---

## Setup & Parameters

### Chosen AI Coding Assistant
- **Tool:** Gemini CLI
- **Model:** `gemini-3-flash-preview`
- **This must be the same across all 50 baseline runs and all refinement rounds**

### Harness / Execution Method
- **How we run gemini-3-flash-preview:** Fresh session via Gemini interface
- **Session management:** Fresh session for each run (no context carryover, no memory)
- **Input prompt file:** `prompts/original-prompt.txt`
- **Metrics captured:** See "Data Collection" section below

### Team Information
- **Team Name:** Potatoes
- **Team Members:** Yuting Duan, Arav Vyawahare, Kelly Dempster, Diana Kostina, Siddharth Sivalanka, Bekzhan Yessengeldy, Arjun Singh, Ethan Pham, Ray Wang, Ryan Lee, Zihan Zhang, Tangjian Shi
- **Work Division:** 12 people total; pairs of 2-3 people, 5 runs per person (10 runs per pair)

---

## Ground Rules (From Assignment)

✓ **One Prompt Rule:** Use `original-prompt.txt` verbatim for all 50 runs. No variations.

✓ **Consistent Model:** Same model (gemini-3-flash-preview) for all runs.

✓ **Clean Sessions:** Fresh session for each run. No context carryover or memory.

✓ **No Hand-Editing:** Capture code as-is. Bugs are data.

✓ **Full Repository:** Each run in `step1/candidate-001/`, `step1/candidate-002/`, etc.

---

## Team Calibration Step

Before Phase 2, the team will run one shared test execution of the prompt to:
- Ensure consistent use of clean sessions
- Align scoring using the rubric
- Confirm repository structure and workflow

This run is not included in the 50 baseline runs.

---

## Data Collection

For every run, capture:

| Field                  | Type                                            |
| ---------------------- | ----------------------------------------------- |
| Run ID                 | e.g., `candidate-001`                           |
| Timestamp              | ISO 8601 format                                 |
| Model Version          | `gemini-3-flash-preview`                                       |
| Input Tokens           | From Gemini response                               |
| Output Tokens          | From Gemini response                               |
| Total Tokens           | Input + Output                                  |
| Wall-Clock Time (s)    | Stopwatch                                       |
| Tool-Reported Time (s) | If available from interface                     |
| Files Produced         | List (e.g., "index.html, style.css, script.js") |
| Lines of Code          | Total lines across all files                    |
| Runs in Browser?       | Yes / No / Partial                              |
| App Quality Notes      | 1-2 sentences                                   |
| Code Quality Notes     | 1-2 sentences                                   |

**Definitions:**
- Yes = Runs with no errors and interactive  
- Partial = Loads but has broken functionality  
- No = Does not load or crashes   

**Format:** Use `data-capture-template.csv` in the root directory.

---

## Repository Structure

```
repo-root/
├── README.md
├── RUBRIC.md
├── data-capture-template.csv
├── prompts/
│   ├── original-prompt.txt
├── step1/ (50 baseline candidates)
│   ├── candidate-001/
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   └── metrics.csv
│   ├── candidate-002/
│   └── ...
├── step1-results.md
├── step2/ (refined candidates)
├── step3/, step4/, step5/ (further refinements)
├── final-report.md
└── presentation/ (slides + video)
```

---

## Phases at a Glance

| Phase        | Task                        | Output                                                       |
| ------------ | --------------------------- | ------------------------------------------------------------ |
| **Phase 2**  | Run prompt 50 times         | `step1/candidate-001/` through `candidate-050/` with metrics |
| **Phase 3A** | Pick top 5, refine once     | `step2/` (5 refined candidates), STEP1-RESULTS.md            |
| **Phase 3B** | Pick top 3, refine once     | `step3/` (3 refined candidates), STEP2-RESULTS.md            |
| **Phase 4**  | Pick top 2, refine once     | `step4/` (2 refined candidates)                              |
| **Phase 5**  | Pick top 1, final refine    | `step5/` (1 final candidate)                                 |
| **Phase 6**  | Final report & presentation | FINAL-REPORT.md, slides, 4-min video                         |

---

## Execution Checklist

- [ ] Model version is documented as `gemini-3-flash-preview`
- [ ] RUBRIC.md is finalized
- [ ] Repository structure is set up
- [ ] Team divided into pairs, each doing 5 runs
- [ ] First test run completed and captured
- [ ] Ready to begin Phase 2

---

## Key Constraints

1. **Prompt is frozen:** No variations across all 50 runs
2. **Same model:** `gemini-3-flash-preview` for all runs
3. **Clean sessions:** No context carryover between runs
4. **No editing:** Save code as-is
5. **Refinement is one-shot:** No iterative loops, max 200 words per refinement prompt

---

## Questions?

Document issues in this README or in your team chat. Good luck!

