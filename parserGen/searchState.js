const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

fs.readFile(__dirname + '/states.json',(err, data) => {
	if(err){
		console.error(err.stack);
		return;
	}
	var states = JSON.parse(data);
	console.log("Input state index to search, or negative number to quit");
	rl.on('line', (input) => {
		var inputNum = parseInt(input);
		if(Number.isNaN(inputNum)){
			console.error("Please input valid number");
		}else{
			if(inputNum < 0){
				rl.close();
				return;
			}else{
				if(states[inputNum]){
					states[inputNum].items.forEach((item) => {
						console.log(`  ${item.nonterm} => ${item.elements.join(' ')} \x1b[34m\x1b[1mindex: ${item.index}\x1b[0m${item.index >= item.elements.length ? "\x1b[35m\x1b[1m [REDUCE]\x1b[0m" : ""}`);
					});
					Object.keys(states[inputNum].gotos).forEach((key) => {
						console.log(`  ${key}: ${states[inputNum].gotos[key]}, `);
					});
				}else{
					console.error("No such state");
				}
			}
		}
		console.log("Input state index to search, or negative number to quit");
	});
});
