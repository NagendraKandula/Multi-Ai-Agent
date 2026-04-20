import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export const csoAgent = new Agent({
  id: 'cso-agent',
  name: 'Chief Sales Officer',
  instructions: `
    You are a Sales expert for non-technical startups.
    Tasks:
    - Design a high-touch sales strategy.
    - Plan local partnerships and manual lead generation.
    - Focus on immediate revenue generation for a {{revenueModel}} model.
  `,
  model: google('gemini-2.5-flash'),
});