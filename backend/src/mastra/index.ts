import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { createGroq } from '@ai-sdk/groq';
import { PinoLogger } from '@mastra/loggers';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const model = groq('meta-llama/llama-4-scout-17b-16e-instruct');

const ctoAgent = new Agent({
  id: 'cto',
  name: 'CTO',
  model,
  instructions: `
You are in a tense startup board meeting.

- Speak like a real human (not formal)
- Refer to EXACT previous statements (mention CFO/CMO points)
- Disagree when needed
- Use numbers / tradeoffs
- Max 2–3 short sentences

Do NOT say you lack context.
`,
});

const cfoAgent = new Agent({
  id: 'cfo',
  name: 'CFO',
  model,
  instructions: `
- Use sharp, short sentences
- Ask one direct question with numbers if possible
- Sound skeptical, slightly aggressive
`,
});

const cmoAgent = new Agent({
  id: 'cmo',
  name: 'CMO',
  model,
  instructions: `
- Be energetic and persuasive
- Avoid repeating same argument
- Add one NEW growth idea each round
`,
});

const supervisor = new Agent({
  id: 'supervisor',
  name: 'Supervisor',
  model,
  instructions: `
Make a final decision:
- 5 sentences
- One clear direction
- Mention trade-offs
- Sound like a CEO conclusion
`,
});

export const mastra = new Mastra({
  agents: {
    cto: ctoAgent,
    cfo: cfoAgent,
    cmo: cmoAgent,
    supervisor,
  },
  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
});