import { mastra } from './mastra';
import 'dotenv/config';
async function testCMO() {
  const agent = mastra.getAgent('cmoAgent');

  if (!agent) {
    throw new Error('CMO agent not found');
  }

  const response = await agent.generate([
    {
      role: 'user',
      content: 'Give me a marketing strategy for a student delivary app',
    },
  ]);

  console.log('\n=== CMO RESPONSE ===\n');
  console.log(response.text);
}

testCMO();