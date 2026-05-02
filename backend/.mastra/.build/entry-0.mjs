import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { createGroq } from '@ai-sdk/groq';
import { PinoLogger } from '@mastra/loggers';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { createMistral } from '@ai-sdk/mistral';

const runwayCalculatorTool = createTool({
  id: "runway-calculator-tool",
  description: "Calculates how many months of survival the startup has left based on budget and proposed monthly burn rate.",
  inputSchema: z.object({
    totalBudget_INR: z.number(),
    proposedMonthlyBurn_INR: z.number()
  }),
  outputSchema: z.object({
    monthsOfRunway: z.number(),
    riskLevel: z.string(),
    warningMessage: z.string()
  }),
  execute: async ({ totalBudget_INR, proposedMonthlyBurn_INR }) => {
    console.log(`[CFO Tool] Calculating runway for budget: \u20B9${totalBudget_INR}...`);
    const months = totalBudget_INR / proposedMonthlyBurn_INR;
    let riskLevel = "Low";
    let warningMessage = "Financially stable for now.";
    if (months < 6) {
      riskLevel = "CRITICAL";
      warningMessage = "DANGER: The startup will run out of money in less than 6 months. Cut costs immediately.";
    } else if (months < 12) {
      riskLevel = "High";
      warningMessage = "WARNING: Less than a year of runway. We need to focus on immediate revenue generation.";
    }
    return { monthsOfRunway: Math.round(months * 10) / 10, riskLevel, warningMessage };
  }
});
const techTrendCheckerTool = createTool({
  id: "tech-trend-checker-tool",
  description: "Checks the current industry sentiment, difficulty, and cost of a specific technology or feature.",
  inputSchema: z.object({
    technologyOrFeature: z.string()
  }),
  outputSchema: z.object({
    adoptionPhase: z.string(),
    implementationCost: z.string(),
    ctoAdvice: z.string()
  }),
  execute: async ({ technologyOrFeature }) => {
    console.log(`[CTO Tool] Checking tech feasibility for: ${technologyOrFeature}...`);
    const techLower = technologyOrFeature.toLowerCase();
    if (techLower.includes("ai") || techLower.includes("machine learning")) {
      return {
        adoptionPhase: "Trending but Expensive",
        implementationCost: "High (Requires specialized talent and compute)",
        ctoAdvice: "We should use a pre-trained API like OpenAI/Ollama instead of building from scratch to save money."
      };
    }
    return {
      adoptionPhase: "Standard",
      implementationCost: "Moderate",
      ctoAdvice: "Standard implementation. We can build this quickly with off-the-shelf frameworks."
    };
  }
});
const cacBenchmarkTool = createTool({
  id: "cac-benchmark-tool",
  description: "Fetches industry standard Customer Acquisition Costs (CAC) to justify marketing budgets.",
  inputSchema: z.object({
    industry: z.string()
  }),
  outputSchema: z.object({
    averageCAC_INR: z.number(),
    conversionRate: z.string()
  }),
  execute: async ({ industry }) => {
    console.log(`[CMO Tool] Fetching marketing benchmarks for: ${industry}...`);
    let cac = 500;
    if (industry.toLowerCase().includes("saas") || industry.toLowerCase().includes("tech")) cac = 1500;
    if (industry.toLowerCase().includes("ecommerce") || industry.toLowerCase().includes("retail")) cac = 300;
    return {
      averageCAC_INR: cac,
      conversionRate: "Typically 2% - 5%"
    };
  }
});

const competitorSearchTool = createTool({
  id: "competitor-search-tool",
  description: "Fetches known competitors for a specific industry and location to ground market research.",
  inputSchema: z.object({
    industry: z.string(),
    location: z.string()
  }),
  outputSchema: z.object({
    competitors: z.array(z.string()),
    marketSaturations: z.string()
  }),
  execute: async ({ industry, location }) => {
    console.log(`[Tool] Finding ${industry} competitors in ${location}...`);
    return {
      competitors: [`Local ${industry} Corp`, `Global ${industry} SaaS`, `Legacy ${location} Providers`],
      marketSaturations: "Medium to High"
    };
  }
});
const techStackRecommenderTool = createTool({
  id: "tech-stack-recommender-tool",
  description: "Recommends optimal tech stacks and estimates monthly server costs based on startup budget and app type.",
  inputSchema: z.object({
    budgetLevel: z.string(),
    // e.g., "Shoestring", "High"
    appType: z.string()
    // e.g., "Web", "Mobile"
  }),
  outputSchema: z.object({
    frontend: z.string(),
    backend: z.string(),
    database: z.string(),
    estimatedMonthlyCost_INR: z.number()
  }),
  execute: async ({ budgetLevel, appType }) => {
    console.log(`[Tool] Recommending stack for ${budgetLevel} budget ${appType} app...`);
    if (budgetLevel.toLowerCase().includes("shoestring") || budgetLevel.toLowerCase().includes("low")) {
      return {
        frontend: appType.toLowerCase() === "mobile" ? "React Native (Expo)" : "Next.js (Vercel Free Tier)",
        backend: "Supabase (Backend-as-a-Service - Free Tier)",
        database: "PostgreSQL (via Supabase)",
        estimatedMonthlyCost_INR: 0
      };
    }
    return {
      frontend: "React Web + Swift iOS",
      backend: "NestJS on AWS ECS",
      database: "AWS RDS PostgreSQL",
      estimatedMonthlyCost_INR: 15e3
    };
  }
});
const adBudgetEstimatorTool = createTool({
  id: "ad-budget-estimator-tool",
  description: "Estimates the Cost Per Click (CPC) for various ad platforms to help create realistic marketing budgets.",
  inputSchema: z.object({
    platform: z.enum(["Facebook", "LinkedIn", "Google"])
  }),
  outputSchema: z.object({
    estimatedCPC_INR: z.number(),
    recommendedMinimumDailyBudget: z.number()
  }),
  execute: async ({ platform }) => {
    console.log(`[Tool] Fetching CPC for ${platform}...`);
    let cpc = 0;
    if (platform === "LinkedIn") cpc = 150;
    if (platform === "Facebook") cpc = 15;
    if (platform === "Google") cpc = 45;
    return {
      estimatedCPC_INR: cpc,
      recommendedMinimumDailyBudget: cpc * 50
    };
  }
});

const model = "ollama-cloud/cogito-2.1:671b";
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY
});
const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY
  // Make sure this is in your .env file
});
const ctoAgent = new Agent({
  id: "cto",
  name: "CTO",
  model,
  instructions: `
You are the Chief Technology Officer (CTO).

GOAL:
Ensure the product is technically feasible, scalable, and secure.

FOCUS:
- Architecture decisions
- Scalability and performance
- Tech stack and tradeoffs
- Engineering effort

BEHAVIOR RULES:
- Be practical and realistic.
- Challenge unrealistic ideas.
- Explain tradeoffs clearly.
- If changing opinion, justify why.

CONSTRAINTS:
- Max 4 sentences
- No repetition
- No code or formatting

TONE:
Direct, logical, engineering-focused.
`,
  tools: {
    runwayCalculatorTool
  }
});
const cfoAgent = new Agent({
  id: "cfo",
  name: "CFO",
  model,
  instructions: `
You are the Chief Financial Officer (CFO).

GOAL:
Protect cash flow and ensure profitability.

FOCUS:
- Cost vs ROI
- CAC vs LTV
- Burn rate and runway
- Financial risk

BEHAVIOR RULES:
- Question assumptions aggressively.
- Demand numbers or justification.
- Reject ideas without clear ROI.
- Suggest cheaper alternatives.

CONSTRAINTS:
- Max 4 sentences
- No repetition
- No formatting

TONE:
Sharp, skeptical, numbers-driven.
`,
  tools: {
    runwayCalculatorTool
  }
});
const cmoAgent = new Agent({
  id: "cmo",
  name: "CMO",
  model,
  instructions: `
You are the Chief Marketing Officer (CMO).

GOAL:
Drive user growth and market traction.

FOCUS:
- User acquisition
- Growth loops and virality
- Branding and positioning
- Go-to-market strategy

BEHAVIOR RULES:
- Push for fast growth.
- Suggest actionable tactics.
- Challenge slow execution.
- Be persuasive.

CONSTRAINTS:
- Max 4 sentences
- Add at least 1 actionable idea
- No repetition

TONE:
Energetic, aggressive, growth-focused.
`,
  tools: {
    cacBenchmarkTool
  }
});
const supervisor = new Agent({
  id: "supervisor",
  name: "Supervisor",
  model,
  instructions: `
You are the CEO and final decision maker of a startup.

GOAL:
Make a clear, actionable final decision by balancing technical feasibility, financial viability, and growth potential.

CONTEXT:
You are reviewing a debate between CTO, CFO, and CMO.

BEHAVIOR RULES:
- Think critically and independently.
- Do NOT repeat what others said.
- Resolve conflicts between agents.
- Prioritize execution over discussion.
- Avoid uncertainty\u2014make firm decisions.

CONSTRAINTS:
- No tools, no JSON, no code.
- Plain English only.
- Max 4 sentences.

OUTPUT FORMAT:
Decision:
- What we WILL do:
- What we will NOT do:
- Budget split (in %):
    

`
});
const marketResearchAgent = new Agent({
  id: "marketResearcher",
  name: "Market Researcher",
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
  tools: {
    competitorSearchTool
  }
});
const mvpPlanningAgent = new Agent({
  id: "mvpPlanner",
  name: "Product Manager",
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
  tools: {
    techStackRecommenderTool
  }
});
const gtmStrategyAgent = new Agent({
  id: "gtmStrategist",
  name: "Growth Marketer",
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
  tools: {
    adBudgetEstimatorTool
  }
});
const mastra = new Mastra({
  agents: {
    cto: ctoAgent,
    cfo: cfoAgent,
    cmo: cmoAgent,
    supervisor,
    marketResearchAgent,
    mvpPlanningAgent,
    gtmStrategyAgent
  },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info"
  })
});

export { mastra };
