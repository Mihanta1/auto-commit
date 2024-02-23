#!/usr/bin/env node
import { argv } from "process";
import commander from "commander";
import simpleGit from "simple-git";
import {
  toggleBotAction,
  getGitCredentials,
  configureGitCredentials,
  isBotActionDisabled,
} from "./configFunctions";
import { isGitRepository , countModifications } from "./gitFunctions";
//test
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
    .action(() => toggleBot(true));

  program
    .command("disable")
    .description("Disable bot action")
    .alias("d")
    .action(() => toggleBot(false));

  program.parse(process.argv);

  if (argv.includes("-e") || argv.includes("--enable")) {
    await toggleBot(true);
    return;
  }

  if (argv.includes("-d") || argv.includes("--disable")) {
    await toggleBot(false);
    return;
  }

  if (!isGitRepository()) {
    console.log("This directory is not a Git repository. Exiting........");
    return;
  }

  async function toggleBot(enable:any) {
    toggleBotAction(enable);

    while (!isBotActionDisabled()) {
      await work();
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }

    console.log("Bot action is currently disabled. Exiting.......");
  }

  async function work() {
    if (!isGitRepository()) {
      console.log("This directory is not a Git repository. Exiting........");
      return;
    }

    const { username, password } = getGitCredentials();
    await configureGitCredentials(username, password);

    const git = simpleGit();

    const modificationsCount = await countModifications(git);
    if (modificationsCount < 1) {
      console.error(
        "Number of modifications is less than 1. Please make at least 1 modification before committing."
      );
      return;
    }

    //ask user for commit coms
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question("Please enter the commit title: ", async (title:any) => {
      await git.add(".");
      await git.commit(title || "Automated commit from bot");
      await git.push();

      console.log("Git actions performed successfully!");
      readline.close();
    });
  }
}

main();
