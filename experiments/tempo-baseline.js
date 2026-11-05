import { runTempoReference } from '../src/tempo/reference-runner.js';

const seed = Number(process.argv[2] ?? 0);
const result = runTempoReference({ seed });
console.log(JSON.stringify(result, null, 2));
