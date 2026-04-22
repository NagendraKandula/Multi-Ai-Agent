import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { PinoLogger } from '@mastra/loggers';

// Initialize Model Providers
const googleProvider = (key: string) => createGoogleGenerativeAI({ apiKey: key })('gemini-2.5-flash'); // Use stable 2.0 or 1.5 if 2.5 is busy
const groqProvider = (key: string) => createGroq({ apiKey: key })('llama-3.3-70b-versatile');

// Define Specialized Agents
const ctoAgent = new Agent({ id: 'cto', name: 'CTO', model: googleProvider(process.env.CTO_KEY!), instructions: 'Tech strategy expert.' });
const cmoAgent = new Agent({ id: 'cmo', name: 'CMO', model: googleProvider(process.env.CMO_KEY!), instructions: 'Marketing and growth expert.' });
const cfoAgent = new Agent({ id: 'cfo', name: 'CFO', model: googleProvider(process.env.CFO_KEY!), instructions: 'Financial planning expert.' });
const cpoAgent = new Agent({ id: 'cpo', name: 'CPO', model: googleProvider(process.env.CPO_KEY!), instructions: 'Product development expert.' });

const legalAgent = new Agent({ id: 'legal', name: 'Legal', model: groqProvider(process.env.LEGAL_KEY!), instructions: 'Compliance and legal expert.' });
const csoAgent = new Agent({ id: 'cso', name: 'CSO', model: groqProvider(process.env.CSO_KEY!), instructions: 'Corporate strategy expert.' });
const cooAgent = new Agent({ id: 'coo', name: 'COO', model: groqProvider(process.env.COO_KEY!), instructions: 'Operations and logistics expert.' });

// Define the Supervisor Agent
const supervisor = new Agent({
  id: 'supervisor',
  name: 'Startup Supervisor',
  model: googleProvider(process.env.SUPERVISOR_KEY!),
  instructions: `
    You are the Lead Orchestrator. 
    You have a team of experts: CTO, CMO, CFO, CPO, Legal, CSO, and COO.
    Moderate their discussion and synthesize a final startup roadmap or response.
  `,
  agents: { ctoAgent, cmoAgent, cfoAgent, cpoAgent, legalAgent, csoAgent, cooAgent },
});

export const mastra = new Mastra({
  agents: { supervisor, ctoAgent, cmoAgent, cfoAgent, cpoAgent, legalAgent, csoAgent, cooAgent },
  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
});