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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBotActionDisabled = exports.toggleBotAction = exports.configureGitCredentials = exports.getGitCredentials = void 0;
// Fonction pour récupérer les informations d'identification Git
function getGitCredentials() {
    const username = process.env.GIT_USERNAME || "default-username";
    const password = process.env.GIT_PASSWORD || "default-password";
    return { username, password };
}
exports.getGitCredentials = getGitCredentials;
// Fonction pour configurer les credentials Git
function configureGitCredentials(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const git = require("simple-git")();
        yield git.addConfig("user.name", username);
        yield git.addConfig("user.password", password);
    });
}
exports.configureGitCredentials = configureGitCredentials;
// Fonction pour activer ou désactiver les actions du bot
function toggleBotAction(enable) {
    process.env.BOT_ACTION_DISABLED = enable ? "false" : "true";
    console.log(`Bot action is now ${enable ? "enabled" : "disabled"}.`);
}
exports.toggleBotAction = toggleBotAction;
// Fonction pour vérifier si l'action du bot est désactivée
function isBotActionDisabled() {
    return process.env.BOT_ACTION_DISABLED === "true";
}
exports.isBotActionDisabled = isBotActionDisabled;
