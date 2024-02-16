
import * as commander from 'commander';
import { ESLint } from 'eslint';
import { SimpleGit } from 'simple-git';

const simpleGit = require('simple-git');
const { execSync } = require('child_process');


// Fonction pour vérifier si le répertoire est un dépôt Git
function isGitRepository(): boolean {
    try {
        execSync('git rev-parse --is-inside-work-tree');
        return true;
    } catch (error) {
        return false;
    }
}

// Fonction pour récupérer les informations d'identification Git
function getGitCredentials(): { username: string; password: string } {
    const username = process.env.GIT_USERNAME || '';
    const password = process.env.GIT_PASSWORD || '';
    return { username, password };
}

// Fonction pour configurer les credentials Git
async function configureGitCredentials(username: string, password: string) {
    const git: SimpleGit = simpleGit();
    await git.addConfig('user.name', username);
    await git.addConfig('user.password', password);
}

// Fonction pour activer ou désactiver les actions du bot
function toggleBotAction(enable: boolean) {
    process.env.BOT_ACTION_DISABLED = enable ? 'false' : 'true';
    console.log(`Bot action is now ${enable ? 'enabled' : 'disabled'}.`);
}

// Fonction pour détecter les erreurs dans les fichiers de code
async function detectErrors(): Promise<boolean> {
    const eslint = new ESLint();
    const results = await eslint.lintFiles(['**/*.js']); 
    return results.some(result => result.errorCount > 0);
}


// Fonction pour compter le nombre de modifications dans les fichiers
async function countModifications(): Promise<number> {
    const git: SimpleGit = simpleGit();
    const diffSummary = await git.diffSummary();
    return diffSummary.files.length;
}


// Fonction principale du bot
async function main() {
    const program = new commander.Command();
    program.version('1.0.0');

    program
        .option('-e, --enable', 'Enable bot action')
        .option('-d, --disable', 'Disable bot action');

    program.parse(process.argv);
    const options = program.opts();

    if (options.enable) {
        toggleBotAction(true);
        console.log('Bot action is currently enable')
        return;
    }

    if (options.disable) {
        toggleBotAction(false);
        console.log('Bot Action is currently disabled. Exiting ...')
        return;
    }

    if (isBotActionDisabled()) {
        console.log('Bot action is currently disabled. Exiting...');
        return;
    }

    if (!isGitRepository()) {
        console.log('This directory is not a Git repository. Exiting...');
        return;
    }

    const { username, password } = getGitCredentials();
    if (!username || !password) {
        console.log('Please provide your Git username and password:');
        console.log('(Note: Your credentials will be securely stored)');
        const prompt = require('prompt-sync')();
        const inputUsername = prompt('Username: ');
        const inputPassword = prompt('Password: ');
        await configureGitCredentials(inputUsername, inputPassword);
    }

    if (isBotActionDisabled()) {
        console.log('Bot action is currently disabled. Exiting...');
        return;
    }

    // Vérifier s'il y a des erreurs dans les fichiers de code
    if (await detectErrors()) {
        console.error('Error: Code contains errors. Please fix the errors before committing.');
        return;
    }

    // Compter le nombre de modifications dans les fichiers
    const modificationsCount = await countModifications();
    if (modificationsCount < 10) {
        console.error('Error: Number of modifications is less than 10. Please make at least 10 modifications before committing.');
        return;
    }

    // Effectuer les actions Git
    const git: SimpleGit = simpleGit();
    await git.add('.');
    await git.commit('Automated commit from bot');
    await git.push();
    
    console.log('Git actions performed successfully!');
}

// Vérifier si l'action du bot est désactivée
function isBotActionDisabled(): boolean {
    return process.env.BOT_ACTION_DISABLED === 'true';
}

// Appeler la fonction principale du bot
main();
