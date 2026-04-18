
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { DuckDBStore } from "@mastra/duckdb";
import { MastraCompositeStore } from '@mastra/core/storage';
import { Observability, DefaultExporter, CloudExporter, SensitiveDataFilter } from '@mastra/observability';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { cmoAgent } from './agents/cmo.agent';
import { cfoAgent } from './agents/cfo.agent';
import { cpoAgent } from './agents/cpo.agent';
import { legalAgent } from './agents/legalofficer.agent';
export const mastra = new Mastra({
  agents: { cmoAgent,
    cfoAgent ,
  cpoAgent,
legalAgent,},
});


