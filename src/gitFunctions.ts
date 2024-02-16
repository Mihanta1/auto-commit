import { SimpleGit } from "simple-git";
import { execSync } from "child_process";

// git repo ou pas
export function isGitRepository(): boolean {
  try {
    execSync("git rev-parse --is-inside-work-tree");
    return true;
  } catch (error) {
    return false;
  }
}


// nbr modif
export async function countModifications(git: SimpleGit): Promise<number> {
  const diffSummary = await git.diffSummary();
  return diffSummary.files.length;
}
