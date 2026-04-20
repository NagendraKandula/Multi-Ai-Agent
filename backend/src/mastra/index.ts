import { Mastra } from '@mastra/core/mastra';
import { cmoAgent } from './agents/cmo.agent';
import { cfoAgent } from './agents/cfo.agent';
import { cpoAgent } from './agents/cpo.agent';
import { legalAgent } from './agents/legalofficer.agent';
import { ctoAgent } from './agents/cto.agent';
import { cooAgent } from './agents/coo.agent';
import { csoAgent } from './agents/cso.agent';
import { supervisorAgent } from './agents/supervisor.agent';

export const mastra = new Mastra({
  agents: { 
    cmoAgent, 
    cfoAgent, 
    cpoAgent, 
    legalAgent, 
    ctoAgent, 
    cooAgent, 
    csoAgent, 
    supervisorAgent 
  },
});