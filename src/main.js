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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander = require("commander");
var gitFunctions_1 = require("./gitFunctions");
var configFunctions_1 = require("./configFunctions");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        /*const tsResult = execSync("tsc");
        if (tsResult.toString().includes("error")) {
          console.error("Error: TypeScript code contains errors. Please fix the errors before committing.");
          return;
        }*/
        function activateBot() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            (0, configFunctions_1.toggleBotAction)(true);
                            console.log("Bot action is currently enabled");
                            _a.label = 1;
                        case 1:
                            if (!!(0, configFunctions_1.isBotActionDisabled)()) return [3 /*break*/, 4];
                            return [4 /*yield*/, travailler()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10000); })];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 1];
                        case 4:
                            console.log("Bot action is currently disabled. Exiting.......");
                            return [2 /*return*/];
                    }
                });
            });
        }
        function travailler() {
            return __awaiter(this, void 0, void 0, function () {
                var git, modificationsCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(0, gitFunctions_1.isGitRepository)()) {
                                console.log("This directory is not a Git repository. Exiting........");
                                return [2 /*return*/];
                            }
                            //identification Git
                            return [4 /*yield*/, (0, configFunctions_1.configureGitCredentials)((0, configFunctions_1.getGitCredentials)().username, (0, configFunctions_1.getGitCredentials)().password)];
                        case 1:
                            //identification Git
                            _a.sent();
                            if ((0, configFunctions_1.isBotActionDisabled)()) {
                                console.log("Bot action is currently disabled. Exiting.......");
                                return [2 /*return*/];
                            }
                            git = require("simple-git")();
                            return [4 /*yield*/, (0, gitFunctions_1.countModifications)(git)];
                        case 2:
                            modificationsCount = _a.sent();
                            if (modificationsCount < 1) {
                                console.error("Number of modifications is less than 1. Please make at least 1 modification before committing.");
                                return [2 /*return*/];
                            }
                            // Actions Git
                            return [4 /*yield*/, git.add(".")];
                        case 3:
                            // Actions Git
                            _a.sent();
                            return [4 /*yield*/, git.commit("Automated commit from bot")];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, git.push()];
                        case 5:
                            _a.sent();
                            console.log("Git actions performed successfully!");
                            return [2 /*return*/];
                    }
                });
            });
        }
        var program, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = new commander.Command();
                    program.version("1.0.0");
                    program
                        /*.option("-e, --enable", "Enable bot action")
                        .option("-d, --disable", "Disable bot action");*/
                        .command('-e')
                        .description('enable  bot action');
                    program.parse(process.argv);
                    options = program.opts();
                    if (!options.enable) return [3 /*break*/, 2];
                    return [4 /*yield*/, activateBot()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2:
                    if (options.disable) {
                        (0, configFunctions_1.toggleBotAction)(false);
                        console.log("Bot Action is currently disabled. Exiting ...");
                        console.log("See you...");
                        return [2 /*return*/];
                    }
                    if (!(0, gitFunctions_1.isGitRepository)()) {
                        console.log("This directory is not a Git repository. Exiting........");
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main();
