import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';
import { Memory } from '@mastra/memory';
export const cpoAgent = new Agent({
  id: 'cpo-agent',
  name: 'Chief Product Officer',
description: 'Handles product design, features, UX',
  instructions: `
You design the product.

Focus on:
- Features
- User journey
- UX

Think from user perspective.
`,

  model: google('gemini-2.5-flash'),
  memory: new Memory({
    options: { observationalMemory: true },
  }),
});