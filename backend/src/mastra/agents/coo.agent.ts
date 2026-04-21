import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';
import { Memory } from '@mastra/memory';
export const cooAgent = new Agent({
  id: 'coo-agent',
  name: 'Chief Operating Officer',
  description: 'Handles operations, logistics, supply chain',
  instructions: `
    You are an Operations Lead for physical/non-tech businesses.
    Tasks:
    - Plan logistics and supply chain.
    - List physical equipment and infrastructure needs.
    - Address workforce and supplier dependency based on user inputs.
  `,
  model: google('gemini-2.5-flash'),
  memory: new Memory({
    options: { observationalMemory: true },
  }),
});