import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';
import { Memory } from '@mastra/memory';
export const ctoAgent = new Agent({
  id: 'cto-agent',
  name: 'Chief Technology Officer',
  instructions: `
    You are a CTO specializing in technical architecture.
    Tasks:
    - Select a tech stack based on the user's preference (MERN, Flutter, AI).
    - Design a scalable MVP architecture.
    - Evaluate feasibility against the user's budget and timeline.
    Respect the 'Speed to Launch' vs 'Scalability' priority.
  `,
  model: google('gemini-2.5-flash'),
  memory: new Memory({
    options: { observationalMemory: true },
  }),
});