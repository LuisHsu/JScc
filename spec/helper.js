const fs = require("fs");
const child_process = require("child_process");
const diff = require("diff");
require('colors');

module.exports.cleanTmp = () => {
	fs.unlink("tmp.E");
};

module.exports.diffFile = (expfile) => {
	var ret = "\n";
	var oldline = 0;
	var newline = 0;
	var errorLines = [];
	var diffres = diff.structuredPatch(
		expfile, "tmp.E",
		fs.readFileSync(expfile).toString(),
		fs.readFileSync("tmp.E").toString()
	);
	if(diffres.hunks[0]){
		diffres.hunks[0].lines.forEach((line) => {
			switch(line.charAt(0)){
				case ' ':
					++oldline;
					++newline;
				break;
				case '-':
					++oldline;
					ret += `\t-${oldline}: ${line.substr(1)}\n`;
				break;
				case '+':
					++newline;
					ret += `\t+${newline}: ${line.substr(1)}\n`;
				break;
				default:
				break;
			}
		});
	}
	return ret;
};