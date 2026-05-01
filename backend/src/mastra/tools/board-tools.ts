import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// 1. CFO Tool: Runway Calculator
export const runwayCalculatorTool = createTool({
  id: 'runway-calculator-tool',
  description: 'Calculates how many months of survival the startup has left based on budget and proposed monthly burn rate.',
  inputSchema: z.object({
    totalBudget_INR: z.number(),
    proposedMonthlyBurn_INR: z.number(),
  }),
  outputSchema: z.object({
    monthsOfRunway: z.number(),
    riskLevel: z.string(),
    warningMessage: z.string(),
  }),
  execute: async ({ totalBudget_INR, proposedMonthlyBurn_INR }) => {
    console.log(`[CFO Tool] Calculating runway for budget: ₹${totalBudget_INR}...`);
    
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
  },
});

// 2. CTO Tool: Tech Trend Checker
export const techTrendCheckerTool = createTool({
  id: 'tech-trend-checker-tool',
  description: 'Checks the current industry sentiment, difficulty, and cost of a specific technology or feature.',
  inputSchema: z.object({
    technologyOrFeature: z.string(),
  }),
  outputSchema: z.object({
    adoptionPhase: z.string(),
    implementationCost: z.string(),
    ctoAdvice: z.string(),
  }),
  execute: async ({ technologyOrFeature }) => {
    console.log(`[CTO Tool] Checking tech feasibility for: ${technologyOrFeature}...`);
    
    // Simulating checking industry standards
    const techLower = technologyOrFeature.toLowerCase();
    if (techLower.includes('ai') || techLower.includes('machine learning')) {
      return {
        adoptionPhase: "Trending but Expensive",
        implementationCost: "High (Requires specialized talent and compute)",
        ctoAdvice: "We should use a pre-trained API like OpenAI/Ollama instead of building from scratch to save money.",
      };
    }

    return {
      adoptionPhase: "Standard",
      implementationCost: "Moderate",
      ctoAdvice: "Standard implementation. We can build this quickly with off-the-shelf frameworks.",
    };
  },
});

// 3. CMO Tool: CAC Benchmarker
export const cacBenchmarkTool = createTool({
  id: 'cac-benchmark-tool',
  description: 'Fetches industry standard Customer Acquisition Costs (CAC) to justify marketing budgets.',
  inputSchema: z.object({
    industry: z.string(),
  }),
  outputSchema: z.object({
    averageCAC_INR: z.number(),
    conversionRate: z.string(),
  }),
  execute: async ({ industry }) => {
    console.log(`[CMO Tool] Fetching marketing benchmarks for: ${industry}...`);
    
    // Simulate fetching industry marketing data
    let cac = 500; // default ₹500
    if (industry.toLowerCase().includes('saas') || industry.toLowerCase().includes('tech')) cac = 1500;
    if (industry.toLowerCase().includes('ecommerce') || industry.toLowerCase().includes('retail')) cac = 300;

    return {
      averageCAC_INR: cac,
      conversionRate: "Typically 2% - 5%",
    };
  },
});