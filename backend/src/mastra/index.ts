import { Mastra } from '@mastra/core/mastra';
import { cmoAgent } from './agents/cmo.agent';
import { cfoAgent } from './agents/cfo.agent';
import { cpoAgent } from './agents/cpo.agent';
import { legalAgent } from './agents/legalofficer.agent';
import { ctoAgent } from './agents/cto.agent';
import { cooAgent } from './agents/coo.agent';
import { csoAgent } from './agents/cso.agent';
import { supervisorAgent } from './agents/supervisor.agent';
import { LibSQLStore } from '@mastra/libsql';

export const mastra = new Mastra({
 storage: new LibSQLStore({
    id: 'multi-agent-storage', // Unique ID for your store
    url: 'file:mastra.db',     // Path to your local database file
  }),
  agents: { 
    supervisorAgent,
    cmoAgent, 
    cfoAgent, 
    cpoAgent, 
    legalAgent, 
    ctoAgent, 
    cooAgent, 
    csoAgent, 
  },
});