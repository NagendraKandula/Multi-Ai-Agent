import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { createGroq } from '@ai-sdk/groq';
import { PinoLogger } from '@mastra/loggers';

// ✅ Load single API key
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const model = groq('llama-3.3-70b-versatile');

// ✅ Define Agents
const ctoAgent = new Agent({
  id: 'cto',
  name: 'CTO',
  model,
  instructions: 'Tech strategy expert.',
});

const cmoAgent = new Agent({
  id: 'cmo',
  name: 'CMO',
  model,
  instructions: 'Marketing and growth expert.',
});

const cfoAgent = new Agent({
  id: 'cfo',
  name: 'CFO',
  model,
  instructions: 'Financial planning expert.',
});

const cpoAgent = new Agent({
  id: 'cpo',
  name: 'CPO',
  model,
  instructions: 'Product development expert.',
});

const legalAgent = new Agent({
  id: 'legal',
  name: 'Legal',
  model,
  instructions: 'Compliance and legal expert.',
});

const csoAgent = new Agent({
  id: 'cso',
  name: 'CSO',
  model,
  instructions: 'Corporate strategy expert.',
});

const cooAgent = new Agent({
  id: 'coo',
  name: 'COO',
  model,
  instructions: 'Operations and logistics expert.',
});

// ✅ Supervisor
// backend/src/mastra/index.ts

const supervisor = new Agent({
  id: 'supervisor',
  name: 'Supervisor',
  model,
  instructions: `
    You are the Board Chairman and Lead Moderator.
    Your goal is to ensure the startup succeeds despite its constraints.
    - If a question is technical, ask the CTO first.
    - If a question is about money, ask the CFO first.
    - Always encourage agents to DISAGREE with each other to find the best path.
    - Your final word is the binding decision for the founder.
  `,
  agents: { ctoAgent, cmoAgent, cfoAgent, cpoAgent, legalAgent, csoAgent, cooAgent },
});

// ✅ Export Mastra
export const mastra = new Mastra({
  agents: {
    supervisor,
    ctoAgent,
    cmoAgent,
    cfoAgent,
    cpoAgent,
    legalAgent,
    csoAgent,
    cooAgent,
  },
  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
});