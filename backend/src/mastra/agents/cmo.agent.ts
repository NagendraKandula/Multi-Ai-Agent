import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export const cmoAgent = new Agent({
  id: 'cmo-agent',
  name: 'Chief Marketing Officer',
description: 'Handles marketing strategy, growth, user acquisition',
  instructions: `
You are a Chief Marketing Officer.

Your job:
- Find target audience
- Suggest marketing strategy
- Suggest how to launch the product

Keep answers simple and clear.
`,

  model: google('gemini-2.5-flash'),
});