import { SimpleGit } from "simple-git";
import { execSync } from "child_process";
// informations d'identification Git
export function getGitCredentials(): { username: string; password: string } {
  const username = process.env.GIT_USERNAME || "default-username";
  const password = process.env.GIT_PASSWORD || "default-password";
  return { username, password };
}

//credentials Git
export async function configureGitCredentials(
  username: string,
  password: string
) {
  const git: SimpleGit = require("simple-git")();
  await git.addConfig("user.name", username);
  await git.addConfig("user.password", password);
}

//activer ou désactiver les actions du bot
export function toggleBotAction(enable: boolean) {
  process.env.BOT_ACTION_DISABLED = enable ? "false" : "true";
  console.log(`Bot action is now ${enable ? "enabled" : "disabled"}.`);
}

// Fonction pour vérifier si l'action du bot est désactivée
export function isBotActionDisabled(): boolean {
  return process.env.BOT_ACTION_DISABLED === "true";
}
