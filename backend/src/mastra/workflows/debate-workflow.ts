import { ctoAgent } from "../agents/cto";
import { cmoAgent } from "../agents/cmo";
import { cfoAgent } from "../agents/cfo";
import { supervisorAgent } from "../agents/supervisor";

export async function runDebateWorkflow(input: string) {
  // Step 1: CTO speaks first
  const cto = await ctoAgent.generate(input);

  // Step 2: CMO reacts to CTO
  const cmo = await cmoAgent.generate(`
CTO said:
${cto.text}
`);

  // Step 3: CFO reacts to both
  const cfo = await cfoAgent.generate(`
CTO said:
${cto.text}

CMO said:
${cmo.text}
`);

  // Step 4: CEO/Supervisor final decision
  const supervisor = await supervisorAgent.generate(`
CTO: ${cto.text}
CMO: ${cmo.text}
CFO: ${cfo.text}

Now give final decision.
`);

  return {
    cto: cto.text,
    cmo: cmo.text,
    cfo: cfo.text,
    supervisor: supervisor.text,
  };
}