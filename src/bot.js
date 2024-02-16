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
const simpleGit = require("simple-git");
const { execSync } = require("child_process");
// Fonction pour vérifier si le répertoire est un dépôt Git
function isGitRepository() {
    try {
        execSync("git rev-parse --is-inside-work-tree");
        return true;
    }
    catch (error) {
        return false;
    }
}
// Fonction pour récupérer les informations d'identification Git
function getGitCredentials() {
    const username = process.env.GIT_USERNAME || "default-username";
    const password = process.env.GIT_PASSWORD || "default-password";
    return { username, password };
}
// Fonction pour configurer les credentials Git
function configureGitCredentials(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const git = simpleGit();
        yield git.addConfig("user.name", username);
        yield git.addConfig("user.password", password);
    });
}
// Fonction pour activer ou désactiver les actions du bot
function toggleBotAction(enable) {
    process.env.BOT_ACTION_DISABLED = enable ? "false" : "true";
    console.log(`Bot action is now ${enable ? "enabled" : "disabled"}.`);
}
// Fonction pour détecter les erreurs dans les fichiers de code
/*async function detectErrors() {
    const eslint = new ESLint();
   const results = await eslint.lintFiles([""]);
    return results.some(
      (result) => result.errorCount > 0 // Vérifie s'il y a des erreurs
    );
  }
*/
// Fonction pour compter le nombre de modifications dans les fichiers
function countModifications() {
    return __awaiter(this, void 0, void 0, function* () {
        const git = simpleGit();
        const diffSummary = yield git.diffSummary();
        return diffSummary.files.length;
    });
}
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
            toggleBotAction(true);
            console.log("Bot action is currently enable");
            return;
        }
        if (options.disable) {
            toggleBotAction(false);
            console.log("Bot Action is currently disabled. Exiting ...");
            return;
        }
        if (isBotActionDisabled()) {
            console.log("Bot action is currently disabled. Exiting...");
            return;
        }
        if (!isGitRepository()) {
            console.log("This directory is not a Git repository. Exiting...");
            return;
        }
        const tsResult = execSync("tsc");
        if (tsResult.toString().includes("error")) {
            console.error("Error: TypeScript code contains errors. Please fix the errors before committing.");
            return;
        }
        function configureGitCredentials(username, password) {
            return __awaiter(this, void 0, void 0, function* () {
                const git = simpleGit();
                yield git.addConfig("user.name", username);
                yield git.addConfig("user.password", password);
            });
        }
        // Dans la fonction main() :
        yield configureGitCredentials(getGitCredentials().username, getGitCredentials().password);
        if (isBotActionDisabled()) {
            console.log("Bot action is currently disabled. Exiting...");
            return;
        }
        // Vérifier s'il y a des erreurs dans les fichiers de code
        /*if (await detectErrors()) {
          console.error(
            "Error: Code contains errors. Please fix the errors before committing."
          );
          return;
        }
      */
        // Compter le nombre de modifications dans les fichiers
        const modificationsCount = yield countModifications();
        if (modificationsCount < 1) {
            console.error("Error: Number of modifications is less than 10. Please make at least 1 modifications before committing.");
            return;
        }
        // Effectuer les actions Git
        const git = simpleGit();
        yield git.add(".");
        yield git.commit("Automated commit from bot");
        yield git.push();
        console.log("Git actions performed successfully!");
    });
}
// Vérifier si l'action du bot est désactivée
function isBotActionDisabled() {
    return process.env.BOT_ACTION_DISABLED === "true";
}
// Appeler la fonction principale du bot
main();
