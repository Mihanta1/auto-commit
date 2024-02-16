"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander = __importStar(require("commander"));
const child_process_1 = require("child_process");
const gitFunctions_1 = require("./gitFunctions");
const configFunctions_1 = require("./configFunctions");
// Fonction principale du bot
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const program = new commander.Command();
        program.version("1.0.0");
        program
            .option("-e, --enable", "Enable bot action")
            .option("-d, --disable", "Disable bot action");
        program.parse(process.argv);
        const options = program.opts();
        if (options.enable) {
            (0, configFunctions_1.toggleBotAction)(true);
            console.log("Bot action is currently enabled");
            return;
        }
        if (options.disable) {
            (0, configFunctions_1.toggleBotAction)(false);
            console.log("Bot Action is currently disabled. Exiting ...");
            return;
        }
        if ((0, configFunctions_1.isBotActionDisabled)()) {
            console.log("Bot action is currently disabled. Exiting...");
            return;
        }
        if (!(0, gitFunctions_1.isGitRepository)()) {
            console.log("This directory is not a Git repository. Exiting...");
            return;
        }
        const tsResult = (0, child_process_1.execSync)("tsc");
        if (tsResult.toString().includes("error")) {
            console.error("Error: TypeScript code contains errors. Please fix the errors before committing.");
            return;
        }
        // Configuration des informations d'identification Git
        yield (0, configFunctions_1.configureGitCredentials)((0, configFunctions_1.getGitCredentials)().username, (0, configFunctions_1.getGitCredentials)().password);
        if ((0, configFunctions_1.isBotActionDisabled)()) {
            console.log("Bot action is currently disabled. Exiting...");
            return;
        }
        // Initialisation de SimpleGit
        const git = require("simple-git")();
        // Compter le nombre de modifications dans les fichiers
        const modificationsCount = yield (0, gitFunctions_1.countModifications)(git);
        if (modificationsCount < 1) {
            console.error("Error: Number of modifications is less than 1. Please make at least 1 modification before committing.");
            return;
        }
        // Effectuer les actions Git
        yield git.add(".");
        yield git.commit("Automated commit from bot");
        yield git.push();
        console.log("Git actions performed successfully!");
    });
}
// Appeler la fonction principale du bot
main();
