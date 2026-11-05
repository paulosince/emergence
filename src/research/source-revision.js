// CLI-only provenance helper. The research kernels remain browser-native ESM.
import { execFileSync } from 'node:child_process';
export function readSourceRevision(projectRootUrl) {
  const revision = process.env.GITHUB_SHA;
  if (revision) return revision;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: projectRootUrl, encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || null;
  } catch {
    // Source archive without .git: report missing provenance, do not invent it.
    return null;
  }
}