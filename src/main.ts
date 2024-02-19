import { argv } from "process";

const commander = require("commander");
const { isGitRepository, countModifications } = require("./gitFunctions");
const {
  toggleBotAction,
  getGitCredentials,
  configureGitCredentials,
  isBotActionDisabled,
} = require("./configFunctions");
const simpleGit = require("simple-git");

type SimpleGit = any;

async function main() {
  const program = new commander.Command();
  program.version("1.0.0");

  program
    .option("-e, --enable", "Enable bot action")
    .option("-d, --disable", "Disable bot action");
    
  program
    .command("enable")
    .description("Enable bot action")
    .alias("e")
    .action(() => activateBot())
  
  program
    .


  program.parse(process.argv);


  if (argv.includes("-e") || argv.includes("--enable")) {
    await activateBot();
    return;
  }

  if (argv.includes("-d") || argv.includes("--disable")) {
    console.log("Bot Action is currently disabled. Exiting ...");
    console.log("See you...");
    return;
  }

  if (!isGitRepository()) {
    console.log("This directory is not a Git repository. Exiting........");
    return;
  }

  async function activateBot() {
    toggleBotAction(true);
    console.log("Bot action is currently enabled");

    while (!isBotActionDisabled()) {
      await travailler();
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }

    console.log("Bot action is currently disabled. Exiting.......");
  }

  async function travailler() {
    if (!isGitRepository()) {
      console.log("This directory is not a Git repository. Exiting........");
      return;
    }

    await configureGitCredentials(
      getGitCredentials().username,
      getGitCredentials().password
    );

    if (isBotActionDisabled()) {
      console.log("Bot action is currently disabled. Exiting.......");
      return;
    }

    const git = simpleGit();

    const modificationsCount = await countModifications(git);
    if (modificationsCount < 1) {
      console.error(
        "Number of modifications is less than 1. Please make at least 1 modification before committing."
      );
      return;
    }

    await git.add(".");
    await git.commit("Automated commit from bot");
    await git.push();

    console.log("Git actions performed successfully!");
  }
}

main();
