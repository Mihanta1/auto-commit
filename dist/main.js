#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const commander_1 = __importDefault(require("commander"));
const simple_git_1 = __importDefault(require("simple-git"));
const configFunctions_1 = require("./configFunctions");
const gitFunctions_1 = require("./gitFunctions");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const program = new commander_1.default.Command();
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
        if (process_1.argv.includes("-e") || process_1.argv.includes("--enable")) {
            yield toggleBot(true);
            return;
        }
        if (process_1.argv.includes("-d") || process_1.argv.includes("--disable")) {
            yield toggleBot(false);
            return;
        }
        if (!(0, gitFunctions_1.isGitRepository)()) {
            console.log("This directory is not a Git repository. Exiting........");
            return;
        }
        function toggleBot(enable) {
            return __awaiter(this, void 0, void 0, function* () {
                (0, configFunctions_1.toggleBotAction)(enable);
                while (!(0, configFunctions_1.isBotActionDisabled)()) {
                    yield work();
                    yield new Promise((resolve) => setTimeout(resolve, 10000));
                }
                console.log("Bot action is currently disabled. Exiting.......");
            });
        }
        function work() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(0, gitFunctions_1.isGitRepository)()) {
                    console.log("This directory is not a Git repository. Exiting........");
                    return;
                }
                const { username, password } = (0, configFunctions_1.getGitCredentials)();
                yield (0, configFunctions_1.configureGitCredentials)(username, password);
                const git = (0, simple_git_1.default)();
                const modificationsCount = yield (0, gitFunctions_1.countModifications)(git);
                if (modificationsCount < 1) {
                    console.error("Number of modifications is less than 1. Please make at least 1 modification before committing.");
                    return;
                }
                //ask user for commit coms
                const readline = require('readline').createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                readline.question("Please enter the commit title: ", (title) => __awaiter(this, void 0, void 0, function* () {
                    yield git.add(".");
                    yield git.commit(title || "Automated commit from bot");
                    yield git.push();
                    console.log("Git actions performed successfully!");
                    readline.close();
                }));
            });
        }
    });
}
main();
