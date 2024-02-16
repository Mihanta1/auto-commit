import * as commander from "commander";
import { SimpleGit } from "simple-git";
import { execSync } from "child_process";
import { isGitRepository, countModifications } from "./gitFunctions";
import { toggleBotAction, getGitCredentials, configureGitCredentials, isBotActionDisabled } from "./configFunctions";

async function main() {
  const program = new commander.Command();
  program.version("1.0.0");

  program
    .option("-e, --enable", "Enable bot action")
    .option("-d, --disable", "Disable bot action");

  program.parse(process.argv);
  const options = program.opts();

  if (options.enable) {
    await activerBot();
    return;
  }

  if (options.disable) {
    toggleBotAction(false);
    console.log("Bot Action is currently disabled. Exiting ...");
    console.log("See you...");
    return;
  }

  if (!isGitRepository()) {
    console.log("This directory is not a Git repository. Exiting........");
    return;
  }

  /*const tsResult = execSync("tsc");
  if (tsResult.toString().includes("error")) {
    console.error("Error: TypeScript code contains errors. Please fix the errors before committing.");
    return;
  }*/

  // Fonction pour activer le bot
  async function activerBot() {
    toggleBotAction(true);
    console.log("Bot action is currently enabled");

    // Boucle infinie pour maintenir le processus en cours d'exécution
    while (!isBotActionDisabled()) {
      await travailler();
      await new Promise(resolve => setTimeout(resolve, 1000)); 
    }

    console.log("Bot action is currently disabled. Exiting.......");
  }

  // Fonction pour effectuer le travail du bot
  async function travailler() {
    if (!isGitRepository()) {
      console.log("This directory is not a Git repository. Exiting........");
      return;
    }

    // Configuration des informations d'identification Git
    await configureGitCredentials(
      getGitCredentials().username,
      getGitCredentials().password
    );
    if (isBotActionDisabled()) {
      console.log("Bot action is currently disabled. Exiting.......");
      return;
    }

    // Initialisation de SimpleGit
    const git: SimpleGit = require("simple-git")();

    // Nombre de modifications
    const modificationsCount = await countModifications(git);
    if (modificationsCount < 1) {
      console.error(
        "Error: Number of modifications is less than 1. Please make at least 1 modification before committing."
      );
      return;
    }

    // Actions Git
    await git.add(".");
    await git.commit("Automated commit from bot");
    await git.push();

    console.log("Git actions performed successfully!");
  }
}

// Appeler la fonction principale du bot
main();
