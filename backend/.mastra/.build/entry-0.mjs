import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

const cmoAgent = new Agent({
  id: "cmo-agent",
  name: "Chief Marketing Officer",
  instructions: `
You are a Chief Marketing Officer.

Your job:
- Find target audience
- Suggest marketing strategy
- Suggest how to launch the product

Keep answers simple and clear.
`,
  model: google("gemini-2.5-flash")
});

const cfoAgent = new Agent({
  id: "cfo-agent",
  name: "Chief Financial Officer",
  instructions: `
You are a CFO.

Focus on:
- Cost estimation
- Budget planning
- Revenue model

Be realistic and numeric.
`,
  model: google("gemini-2.5-flash")
});

const cpoAgent = new Agent({
  id: "cpo-agent",
  name: "Chief Product Officer",
  instructions: `
You design the product.

Focus on:
- Features
- User journey
- UX

Think from user perspective.
`,
  model: google("gemini-2.5-flash")
});

const legalAgent = new Agent({
  id: "legal-agent",
  name: "Legal & Compliance",
  instructions: `
You ensure legal compliance.

Focus on:
- Licenses
- Regulations
- Risks

Keep it practical.
`,
  model: google("gemini-2.5-flash")
});

const mastra = new Mastra({
  agents: {
    cmoAgent,
    cfoAgent,
    cpoAgent,
    legalAgent
  }
});

export { mastra };
