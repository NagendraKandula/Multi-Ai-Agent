import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

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

export { cacBenchmarkTool, projectRiskAssessorTool, runwayCalculatorTool, techTrendCheckerTool };
