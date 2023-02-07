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
        } else if (command.match(/^!\d+$/)) {
            const matches = command.match(/^!(\d+)$/);
            command = undefined;
            if (matches && matches.length === 2) {
                try {
                    const commandNumber = parseInt(matches[1]);
                    const historyCommand = history.find(historyItem => historyItem.startsWith(`${commandNumber} >`));
                    if (historyCommand) {
                        command = historyCommand.replace(`${commandNumber} > helm `, '');
                    }
                } catch (error: any) {
                }
            }
        }

        try {
            if (command !== undefined) {
                try {
                    history.push(`${commandNumber} > helm ${command}`);
                    const commandResult = child_process.execSync(`helm ${command}`, { encoding: 'utf8' });
                    if (commandResult) {
                        console.log(commandResult);
                    }
                } catch (error: any) {
                    console.error(error.stderr);
                }
            }
        } finally {
            commandNumber++;
            helmPrompt.setPrompt(`${commandNumber} > helm `);
            helmPrompt.prompt();
        }
    });
})();
