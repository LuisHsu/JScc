//    Copyright 2018 Luis Hsu
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

fs.readFile(__dirname + '/states.json', (err, data) => {
	if (err) {
		console.error(err.stack);
		return;
	}
	var states = JSON.parse(data);
	console.log("Input state index to search, or negative number to quit");
	rl.on('line', (input) => {
		var inputNum = parseInt(input);
		if (Number.isNaN(inputNum)) {
			states.forEach((state, index) => {
				var found = false;
				state.items.forEach((item) => {
					if(item.nonterm == input){
						found = true;
					}
				});
				if(found){
					console.log(`\x1b[33m\x1b[1m${index}\x1b[0m:`);
					state.items.forEach((item) => {
						if(item.nonterm == input){
							console.log(`  ${item.nonterm} => ${item.elements.join(' ')} \x1b[34m\x1b[1mindex: ${item.index}\x1b[0m${item.index >= item.elements.length ? "\x1b[35m\x1b[1m [REDUCE]\x1b[0m" : ""}`);
						}
					});
				}
			});
		} else {
			if (inputNum < 0) {
				rl.close();
				return;
			} else {
				if (states[inputNum]) {
					states[inputNum].items.forEach((item) => {
						console.log(`  ${item.nonterm} => ${item.elements.join(' ')} \x1b[34m\x1b[1mindex: ${item.index}\x1b[0m${item.index >= item.elements.length ? "\x1b[35m\x1b[1m [REDUCE]\x1b[0m" : ""}`);
					});
					Object.keys(states[inputNum].gotos).forEach((key) => {
						console.log(`  ${key}: ${states[inputNum].gotos[key]}, `);
					});
				} else {
					console.error("No such state");
				}
			}
		}
		console.log("Input state index to search, or negative number to quit");
	});
});
