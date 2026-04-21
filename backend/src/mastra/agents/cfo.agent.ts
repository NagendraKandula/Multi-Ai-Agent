import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';
export const cfoAgent = new Agent({
  id: 'cfo-agent',
  name: 'Chief Financial Officer',
description: 'Handles budgeting, cost estimation, revenue models, ROI',
  instructions: `
You are a CFO.

Focus on:
- Cost estimation
- Budget planning
- Revenue model

Be realistic and numeric.
`,

  model: google('gemini-2.5-flash'),
});