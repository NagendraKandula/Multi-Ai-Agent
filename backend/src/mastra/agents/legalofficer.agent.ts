import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';
export const legalAgent = new Agent({
  id: 'legal-agent',
  name: 'Legal & Compliance',

  instructions: `
You ensure legal compliance.

Focus on:
- Licenses
- Regulations
- Risks

Keep it practical.
`,

  model: google('gemini-2.5-flash'),
});