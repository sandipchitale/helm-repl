import * as readline from 'readline'
import * as child_process from 'child_process';
(async ()=> {
    const helmPrompt = readline.createInterface({
        prompt: '> helm ',
        historySize: 1000,
        input: process.stdin,
        output: process.stdout,
    });
    let history = [];
    let commandNumber = 1;
    helmPrompt.setPrompt(`${commandNumber} > helm `);
    helmPrompt.prompt();
    helmPrompt.on('line', command => {
        command = command.trim();
        if (command === 'exit') {
            helmPrompt.close();
            return;
        }

        if (command === 'history') {
            history.forEach((command: string) => {
                console.log(command);
            });
            helmPrompt.prompt();
            return;
        }

        try {
            try {
                history.push(`${commandNumber} > helm ${command}`);
                const commandResult = child_process.execSync(`helm ${command}`, { encoding: 'utf8' });
                if (commandResult) {
                    console.log(commandResult);
                }
            } catch (error: any) {
                console.error(error.stderr);
            }
        } finally {
            commandNumber++;
            helmPrompt.setPrompt(`${commandNumber} > helm `);
            helmPrompt.prompt();
        }
    });
})();
