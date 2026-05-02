import { Injectable } from '@nestjs/common';
import { mastra } from './mastra';
 
type AgentId =
  | 'supervisor'
  | 'cto'
  | 'cfo'
  | 'cmo'
  | 'cpo'
  | 'coo'
  | 'cso'
  | 'legal';
type Message = {
  agent: string;
  content: string;
};

type Round = {
  round: number;
  messages: Message[];
};

@Injectable()
export class AppService {
  async runStartupSimulation(formData: any) {
    const supervisor = mastra.getAgentById('supervisor');

    const agentsList = Array.isArray(formData?.selectedAgents)
      ? formData.selectedAgents.join(', ')
      : 'CTO, CFO, CMO';

    const prompt = `
Startup: ${formData?.businessName || "Unknown"}
Problem: ${formData?.problemSolving || "Not specified"}
Constraint: ${formData?.constraint || "None"}
Agents: ${agentsList}

Provide a clear startup roadmap.
`;

    const result = await supervisor.generate(prompt);

    return { plan: result.text };
  }

  async handleLiveDebate(message: string, onboardingData: any) {
   const agentNames: string[] = Array.isArray(onboardingData?.selectedAgents)
      ? onboardingData.selectedAgents
      : ['CTO', 'CFO', 'CMO'];
       const supervisor = mastra.getAgentById('supervisor');
       const roleHints: Record<string, string> = {
      CTO: "Focus on tech feasibility and speed.",
      CFO: "Focus on cost, ROI, and financial risk.",
      CMO: "Focus on growth, users, and market impact.",
      COO: "Focus on execution and operational efficiency.",
      CPO: "Focus on product value and user experience.",
      Legal: "Focus on compliance and risk exposure.",
    };

    let context = `
Startup: ${onboardingData?.businessName || 'Unknown'}
Problem: ${onboardingData?.problemSolving || 'Not specified'}
Constraint: ${onboardingData?.constraint || 'None'}
Agenda: ${message}

Meeting transcript:
`;
  const rounds: Round[] = [];
    let roundCounter = 1;

    try {
      const MAX_TURNS = 6;

      for (let i = 0; i < MAX_TURNS; i++) {

        // 🧠 Supervisor decides next speaker
        const decision = await supervisor.generate(`
${context}

You are the meeting chairman.

Decide:
- Who should speak next
- OR end the meeting if enough discussion happened

Choose ONLY from: ${agentNames.join(', ')}

End ONLY if:
- Tradeoffs are discussed
- A direction is clear

Respond ONLY in one of these formats:
NEXT: CTO
NEXT: CFO
NEXT: CMO
END
`);
const mapToAgentId = (name: string): AgentId | null => {
  const id = name.toLowerCase();

  const validIds: AgentId[] = [
    'cto', 'cfo', 'cmo', 'cpo', 'coo', 'cso', 'legal'
  ];

  return validIds.includes(id as AgentId) ? (id as AgentId) : null;
};

        const text = decision.text.trim();

        if (text.includes("END")) {
          break;
        }

        const match = text.match(/NEXT:\s*(\w+)/i);
        const nextAgentName = match?.[1];

        if (!nextAgentName || !agentNames.includes(nextAgentName)) {
          continue;
        }

        const agentId = mapToAgentId(nextAgentName);

if (!agentId) continue;

const agent = mastra.getAgentById(agentId);

        // 🧠 Get last speaker line (important for realism)
        const lastLine = context.trim().split('\n').slice(-1)[0];

        // 🎤 Agent responds
        const response = await agent.generate(`
${context}

Latest statement:
${lastLine}

You are the ${nextAgentName}.
${roleHints[nextAgentName] || ""}

Instructions:
- Respond directly to the latest speaker
- Agree, disagree, or challenge
- Add a NEW point (do not repeat yourself)
- Be natural and conversational
- It's okay to disagree
- Keep it to 4-5 sentences max
`);

        const msg: Message = {
          agent: nextAgentName,
          content: response.text.trim(),
        };

        context += `\n${nextAgentName}: ${msg.content}`;

        rounds.push({
          round: roundCounter++,
          messages: [msg],
        });
      }
      return { rounds, transcript: context };

    } catch (err) {
      console.error(err);

      return {
        rounds: [
          {
            round: 1,
            messages: [
              {
                agent: 'Supervisor',
                content: 'Something went wrong. Please try again.',
              },
            ],
          },
        ],
      };
    }
  }
   // Update the function signature and prompt injection
  // Update the function signature to accept the agenda!
  async generateDecisionSummary(body: { transcript: string | string[], onboardingData: any, agenda?: string }) {
    const supervisor = mastra.getAgentById('supervisor');
    
    const transcriptText = Array.isArray(body.transcript) 
      ? body.transcript.join('\n') 
      : body.transcript;

    const prompt = `
Startup: ${body.onboardingData?.businessName || 'Unknown'}
Problem: ${body.onboardingData?.problemSolving || 'Not specified'}
Agenda: ${body.agenda || 'Not specified'}

Meeting Transcript:
${transcriptText}

Based on the debate above, act as the CEO/Supervisor and provide a final decision summary.
You MUST format your response EXACTLY as a JSON object with the following keys:
{
  "score": "A number out of 10 evaluating viability (e.g., '8/10')",
  "finalSummary": "A comprehensive paragraph summarizing the final decision and strategic direction.",
  "strengths": ["List of key strengths identified in the debate"],
  "concerns": ["List of key risks or concerns identified in the debate"],
  "actionPlan": ["List of concrete, actionable steps required to solve the stated problem and execute the decision. Generate as many steps as needed based on the debate."]
}
Do NOT wrap the JSON in markdown blocks (no \`\`\`json). Return ONLY valid JSON.
`;

    try {
       const response = await supervisor.generate(prompt);
       const cleanedText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
       return JSON.parse(cleanedText);
    } catch (e) {
       console.error("Summary generation failed", e);
       return {
         score: "N/A",
         finalSummary: "Debate concluded, but failed to generate a formatted summary.",
         strengths: ["Data unavailable"],
         concerns: ["Formatting error"],
         actionPlan: ["Analyze failure and retry"]
       };
    }
  }
  // Add this inside AppService, below generateDecisionSummary
  async executeTask(body: { task: string, startupContext: any }) {
    const supervisor = mastra.getAgentById('supervisor');
    
    // 1. Route the task to the right agent
    const routingPrompt = `
      Task: "${body.task}"
      Which executive role is best suited to execute this? 
      Choose ONLY ONE: CTO, CMO, CFO, COO, Legal, CSO.
      Respond with exactly the acronym.
    `;
    const routingRes = await supervisor.generate(routingPrompt);
    const assignedRole = routingRes.text.trim().replace(/[^a-zA-Z]/g, '').toUpperCase();
    
    // Fallback to COO if confused
    const agentId = assignedRole.toLowerCase();
    let agent = mastra.getAgentById(agentId as any) || mastra.getAgentById('coo');
    const actualRole = agent ? assignedRole : 'COO';

    // 2. The Agent Executes the Task
    const executionPrompt = `
      Startup Context: ${JSON.stringify(body.startupContext)}
      Your Role: ${actualRole}
      Your Task: "${body.task}"

      You are EXECUTING this task for the startup. Provide the actual deliverable.
      
      Respond EXACTLY in this JSON format (no markdown formatting, just raw JSON):
      {
        "agent": "${actualRole}",
        "status": "Completed",
        "thoughtProcess": "Briefly explain the reasoning of how you approached this task.",
        "deliverableTitle": "Title of what you created",
        "deliverableContent": "The actual detailed work/output you generated to complete the task."
      }
    `;

    try {
      const result = await agent.generate(executionPrompt);
      const cleanedJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedJson);
    } catch (e) {
      console.error("Execution failed", e);
      return {
        agent: actualRole,
        status: "Failed",
        thoughtProcess: "System encountered an error during task decomposition.",
        deliverableTitle: "Error",
        deliverableContent: "Failed to execute task due to API timeout."
      };
    }
  }
  }
