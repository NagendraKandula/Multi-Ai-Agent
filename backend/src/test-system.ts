import { runBusinessPlan } from './supervisor';
import 'dotenv/config';
async function main() {
  const result = await runBusinessPlan(
    "Build a fitness app startup"
  );

  console.log("\n=== FINAL OUTPUT ===\n");
  console.log(result);
}

main();