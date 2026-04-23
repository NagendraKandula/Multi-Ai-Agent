import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { createGroq } from '@ai-sdk/groq';
import { PinoLogger } from '@mastra/loggers';

// ✅ Load single API key
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const model = groq('meta-llama/llama-4-scout-17b-16e-instruct');

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
const supervisor = new Agent({
  id: 'supervisor',
  name: 'Supervisor',
  model,
  instructions: `
    You are the board supervisor.
    You coordinate multiple agents and produce structured responses.
  `,
  agents: {
    ctoAgent,
    cmoAgent,
    cfoAgent,
    cpoAgent,
    legalAgent,
    csoAgent,
    cooAgent,
  },
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