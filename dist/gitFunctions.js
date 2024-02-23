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
exports.countModifications = exports.isGitRepository = void 0;
const child_process_1 = require("child_process");
// git repo ou pas
function isGitRepository() {
    try {
        (0, child_process_1.execSync)("git rev-parse --is-inside-work-tree");
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.isGitRepository = isGitRepository;
// nbr modif
function countModifications(git) {
    return __awaiter(this, void 0, void 0, function* () {
        const diffSummary = yield git.diffSummary();
        return diffSummary.files.length;
    });
}
exports.countModifications = countModifications;
