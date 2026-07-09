export const SENTIMENT_PROMPT = `
Caller Sentiment & Dialogue Emotion:
- Assess caller overall sentiment (enum: POSITIVE, NEUTRAL, NEGATIVE).
- Provide a sentiment score between -1.0 (highly frustrated) and 1.0 (highly satisfied).
- For each dialogue turn in the timestamped transcript loops, classify the speaker's emotion (Happy, Neutral, Confused, Angry, Frustrated) and determine if it represents a turning point in dialogue flow.
`
