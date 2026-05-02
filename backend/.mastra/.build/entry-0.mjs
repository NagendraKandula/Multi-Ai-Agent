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
const projectRiskAssessorTool = createTool({
  id: "project-risk-assessor-tool",
  description: "Evaluates the overall risk of the startup project based on budget, timeline, and tech constraints.",
  inputSchema: z.object({
    budgetLevel: z.string(),
    timelineMonths: z.number(),
    aiReliance: z.string()
  }),
  outputSchema: z.object({
    overallRiskScore: z.number(),
    criticalBottleneck: z.string(),
    supervisorRecommendation: z.string()
  }),
  execute: async ({ budgetLevel, timelineMonths, aiReliance }) => {
    console.log(`[Supervisor Tool] Assessing risk for ${budgetLevel} budget over ${timelineMonths} months...`);
    let riskScore = 50;
    let bottleneck = "Market adoption";
    if (budgetLevel.includes("5L") || budgetLevel.includes("Shoestring")) {
      riskScore += 30;
      bottleneck = "Capital exhaustion before PMF (Product-Market Fit)";
    }
    if (aiReliance.includes("Yes") || aiReliance.includes("High")) {
      riskScore += 10;
      if (timelineMonths < 4) {
        riskScore += 10;
        bottleneck = "Insufficient time to train/integrate complex AI models safely";
      }
    }
    return {
      overallRiskScore: Math.min(riskScore, 100),
      criticalBottleneck: bottleneck,
      supervisorRecommendation: riskScore > 80 ? "MANDATORY: Cut scope immediately. Do not proceed with current feature list." : "Proceed with caution. Enforce strict weekly milestone tracking."
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
You are a pragmatic, battle-hardened Chief Technology Officer (CTO).
    Your core philosophy: "Speed to market matters, but technical debt will kill us later."
    You focus entirely on:
    - Feasibility: Can we actually build this with our constraints?
    - Architecture: Choosing the right tech stack to keep costs low but scalable.
    - Security: Protecting user data.
    
    \u{1F525} CRITICAL DEBATE RULES & DECISION PRESSURE:
    - The clock is ticking on our MVP. Push for a technical decision we can start coding tomorrow.
    - If you disagree with another agent, state it clearly and explain exactly why.
    - Do NOT agree just to be polite.
    - Defend your engineering resources fiercely against scope creep.
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
You are a ruthless, numbers-driven Chief Financial Officer (CFO).
    Your core philosophy: "Cash is king. If unit economics are negative, we are dead."
    You focus entirely on:
    - Runway & Budget: Protecting the startup's limited capital at all costs.
    - Unit Economics: Customer Acquisition Cost (CAC) vs. Lifetime Value (LTV).
    - ROI: Demanding proof that any spending (on marketing or tech) will generate revenue.
    
    \u{1F525} CRITICAL DEBATE RULES & DECISION PRESSURE:
    - We are burning runway every day we delay. You must push for a final, executable decision.
    - If you disagree with another agent, state it clearly and explain exactly why.
    - Do NOT agree just to be polite.
    - Do not just block ideas\u2014propose a cheaper, financially viable alternative immediately.
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
You are an aggressive, growth-obsessed Chief Marketing Officer (CMO).
    Your core philosophy: "If nobody knows we exist, the code doesn't matter."
    You focus entirely on:
    - User Acquisition: How do we get our first 1,000 to 10,000 users cheaply?
    - Go-To-Market (GTM): Positioning, brand messaging, and viral loops.
    - Product-Led Growth (PLG): Making the product market itself.
    
    \u{1F525} CRITICAL DEBATE RULES & DECISION PRESSURE:
    - The market is moving faster than we are. We need an actionable growth plan immediately.
    - If you disagree with another agent, state it clearly and explain exactly why.
    - Do NOT agree just to be polite.
    - Demand faster launches and fight for features that drive virality.
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
You are the Board Chairman and Lead Moderator.
    Your goal is to ensure the startup succeeds despite its constraints.
    
    ALWAYS use the 'projectRiskAssessorTool' before making your final executive decision. 
    Use the tool's Risk Score and Critical Bottleneck to forcefully synthesize the conflicting opinions of your C-suite (CTO, CFO, CMO).
    
    - Never let the board get stuck in an endless loop; force decisions.
    - Your final word is the binding executive decision for the founder.
    - Tone: Authoritative, decisive, and leader-like. Do not waste time on pleasantries.
`,
  tools: {
    projectRiskAssessorTool
  }
});
const marketResearchAgent = new Agent({
  id: "marketResearcher",
  name: "Market Researcher",
  model,
  instructions: `
You are an expert market analyst. Given a startup profile and the board's final directive, output a structured Market Research plan.
    Highlight target demographics, competitor gaps, and pricing models.
    
    CRITICAL INSTRUCTIONS:
    - DO NOT use markdown formatting. Do NOT use asterisks (**) or hashtags (#).
    - Use standard plain text with simple dashes (-) for lists.
    - Base your research strictly on the provided startup data. Do not make generic assumptions.
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
You are a technical Product Manager. Given a startup profile and the board's final directive, outline the exact MVP features.
    Include specific tech stack recommendations and note which features should be delayed for later versions.
    
    CRITICAL INSTRUCTIONS:
    - DO NOT use markdown formatting. Do NOT use asterisks (**) or hashtags (#).
    - Use standard plain text with simple dashes (-) for lists.
    - Base your features strictly on the provided startup data.
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
You are a Growth Marketer. Given a startup profile and an MVP plan, design a realistic 30-day Go-To-Market strategy.
    Focus on actionable marketing channels and customer acquisition tailored to their budget.
    
    CRITICAL INSTRUCTIONS:
    - DO NOT use markdown formatting. Do NOT use asterisks (**) or hashtags (#).
    - Use standard plain text with simple dashes (-) for lists.
    - Ensure your marketing channels align realistically with the startup's stated budget.
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
