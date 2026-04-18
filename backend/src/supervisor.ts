import { cmoAgent } from './mastra/agents/cmo.agent';
import { cfoAgent } from './mastra/agents/cfo.agent';
import { legalAgent } from './mastra/agents/legalofficer.agent';
import { cpoAgent } from './mastra/agents/cpo.agent';

export async function runBusinessPlan(input: string) {
  console.log("Running multi-agent system...\n");

   const [cmo, cfo, legal, cpo] = await Promise.all([
    cmoAgent.generate(input),
    cfoAgent.generate(input),
    legalAgent.generate(input),
    cpoAgent.generate(input),
  ]);

  return {
    marketing: cmo.text,
    finance: cfo.text,
    legal: legal.text,
    product: cpo.text,
  };
}