import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { createGroq } from '@ai-sdk/groq';
import { PinoLogger } from '@mastra/loggers';
import { runwayCalculatorTool, techTrendCheckerTool, cacBenchmarkTool} from './tools/board-tools';
//import { competitorSearchTool, techStackRecommenderTool, adBudgetEstimatorTool } from './tools/startup-tools';
import { createMistral } from '@ai-sdk/mistral';
const model = 'ollama-cloud/cogito-2.1:671b';
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});
const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY, // Make sure this is in your .env file
});

// 3. Set the model
//const model = mistral('mistral/codestral-latest');
//const model = groq('meta-llama/llama-4-scout-17b-16e-instruct');

const ctoAgent = new Agent({
  id: 'cto',
  name: 'CTO',
  model,
  instructions: `
You are the Chief Technology Officer (CTO). Your goal is to ensure the product is technically feasible, scalable, and secure. You focus on architecture decisions, scalability, performance, and selecting the modern tech stack. In debates, you must defend the need for high-quality infrastructure and warn against 'technical debt' that could hinder future growth. You are responsible for MVP planning and the technical roadmap.
`,
tools: { runwayCalculatorTool },
});

const cfoAgent = new Agent({
  id: 'cfo',
  name: 'CFO',
  model,
  instructions: `
You are the Chief Financial Officer (CFO). Your goal is to protect cash flow and ensure profitability. You focus on Cost vs. ROI, CAC (Customer Acquisition Cost) vs. LTV (Lifetime Value), and the burn rate and runway. Your behavior is to question all assumptions and identify financial risks. If the CTO or CMO proposes expensive plans, you must demand a cheaper alternative or clear evidence of return on investment.
`,
tools: { runwayCalculatorTool },
});

const cmoAgent = new Agent({
  id: 'cmo',
  name: 'CMO',
  model,
  instructions: `
You are the Chief Marketing Officer (CMO). Your goal is to drive user growth and market traction. You focus on user acquisition, growth loops, virality, branding, and positioning. You are responsible for the Go-To-Market (GTM) strategy. You push for speed-to-market and aggressive marketing budgets, even if the CTO says the tech isn't 'perfect' or the CFO says the cost is high.
`,
tools: { cacBenchmarkTool },
});

const supervisor = new Agent({
  id: 'supervisor',
  name: 'Supervisor',
  model,
  instructions: `
You are the CEO and final decision maker of a startup. Your goal is to make a clear, actionable final decision by balancing technical feasibility (from the CTO), financial viability (from the CFO), and growth potential (from the CMO). You must review the debates between your executives and choose the path that best serves the startup's long-term survival and success.

`,
});

const marketResearchAgent = new Agent({
  id: 'marketResearcher',
  name: 'Market Researcher',
  model,
  instructions: `
You are a Market Research Analyst.

GOAL:
Provide clear insights about users, competitors, and demand.

FOCUS:
- Target audience
- Competitor gaps
- Market demand validation

CONSTRAINTS:
- Plain text only
- Use simple dash (-) bullet points
- No markdown formatting

OUTPUT:
- Target Users:
- Competitors:
- Market Opportunity:
`,

});

const mvpPlanningAgent = new Agent({
  id: 'mvpPlanner',
  name: 'Product Manager',
  model,
  instructions: `
You are a Product Manager.

GOAL:
Define a realistic MVP that can be built quickly.

FOCUS:
- Core features only
- Tech stack
- Timeline

BEHAVIOR:
- Prioritize simplicity
- Avoid over-engineering
- Focus on launch speed

CONSTRAINTS:
- Plain text
- Bullet points with dashes

OUTPUT:
- MVP Features:
- Tech Stack:
- Timeline:
`,
});

const gtmStrategyAgent = new Agent({
  id: 'gtmStrategist',
  name: 'Growth Marketer',
  model,
  instructions: `
You are a Go-To-Market Strategist.

GOAL:
Create a practical 30-day launch plan.

FOCUS:
- Acquisition channels
- Campaign ideas
- Growth experiments

BEHAVIOR:
- Be actionable
- Match budget constraints
- Avoid generic advice

CONSTRAINTS:
- Plain text
- Bullet points

OUTPUT:
- Launch Plan:
- Channels:
- Growth Tactics:
`,

});


export const mastra = new Mastra({
  agents: {
    cto: ctoAgent,
    cfo: cfoAgent,
    cmo: cmoAgent,
    supervisor,
    marketResearchAgent,
    mvpPlanningAgent,
    gtmStrategyAgent,
  },
  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
});