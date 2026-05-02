import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

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

export { adBudgetEstimatorTool, competitorSearchTool, techStackRecommenderTool };
