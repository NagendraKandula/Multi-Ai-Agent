import { Mastra } from "@mastra/core";

import { ctoAgent } from "./agents/cto";
import { cmoAgent } from "./agents/cmo";
import { cfoAgent } from "./agents/cfo";
import { supervisorAgent } from "./agents/supervisor";

export const mastra = new Mastra({
  agents: {
    ctoAgent,
    cmoAgent,
    cfoAgent,
    supervisorAgent
  }
});