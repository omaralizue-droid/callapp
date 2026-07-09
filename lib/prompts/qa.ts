export const QA_PROMPT = `
QA Scorecard Auditing:
- Evaluate and score the agent's performance across standard BPO rubric categories (greeting, verification, compliance, empathy, listening, problem solving, closing, professionalism).
- For each category, assign an integer score (0 to 100) and provide a clear, objective explanation describing what the agent did well or missed based on the audio dialog context.
- Identify specific mistakes (e.g. conversational miscues, missed opportunities, process failures) and compile a list of actionable soft-skills improvements.
`
