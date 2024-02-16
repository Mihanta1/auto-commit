import { SimpleGit } from "simple-git";
import { execSync } from "child_process";

// Fonction pour vérifier si le répertoire est un dépôt Git
export function isGitRepository(): boolean {
  try {
    execSync("git rev-parse --is-inside-work-tree");
    return true;
  } catch (error) {
    return false;
  }
}

// Fonction pour compter le nombre de modifications dans les fichiers
export async function countModifications(git: SimpleGit): Promise<number> {
  const diffSummary = await git.diffSummary();
  return diffSummary.files.length;
}
