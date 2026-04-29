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

const marketResearchAgent = new Agent({
  id: 'marketResearcher',
  name: 'Market Researcher',
  model,
  instructions: `
You are an expert market analyst.
Given a startup profile and the board's final directive, output a structured Market Research plan.
Highlight target demographics, competitor gaps, and pricing models.
Keep it concise and actionable.
`,
});

const mvpPlanningAgent = new Agent({
  id: 'mvpPlanner',
  name: 'Product Manager',
  model,
  instructions: `
You are a technical Product Manager.
Given a startup profile and the board's final directive, outline the exact MVP features.
Include specific tech stack recommendations and note which features should be delayed for later versions.
Keep it concise and structured.
`,
});

const gtmStrategyAgent = new Agent({
  id: 'gtmStrategist',
  name: 'Growth Marketer',
  model,
  instructions: `
You are a Growth Marketer.
Given a startup profile and an MVP plan, design a realistic 30-day Go-To-Market strategy.
Focus on actionable marketing channels and customer acquisition tailored to their budget.
Keep it concise and structured.
`,
});


export const mastra = new Mastra({
  agents: {
    cto: ctoAgent,
    cfo: cfoAgent,
    cmo: cmoAgent,
    supervisor,
    marketResearchAgent,
    mvpPlanningAgent,
    gtmStrategyAgent,
  },
  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
});