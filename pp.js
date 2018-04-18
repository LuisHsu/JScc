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

const fs = require("fs");
const log = require("./errors")(process.argv[2]);

var remainBuf = Buffer.alloc(0);

const fin = fs.createReadStream(process.argv[2]);
const fout = fs.createWriteStream(process.argv[3]);

var macroMap = {};

fin.on('data', (data) => {
	var dataBuf = Buffer.concat([remainBuf, data], remainBuf.length + data.length);
	var remain = runPP(dataBuf.toString());
	remainBuf = dataBuf.slice(dataBuf.length - remain.length);
});

fin.on('end', () => {
	if(remainBuf.length > 0){
		runPP(remainBuf.toString() + "\n");
	}
});

function runPP(data){
	// Replace digraph
	data = data.replace("<:", "[").replace(":>", "]").replace("<%", "{").replace("%>", "}").replace("%:", "#");
	// Replace single line comment
	data = data.replace(/\/\/.*\n/, "\n");
	// Replace multi line comment
	var matches = data.match(/\/\*[^\*]*\*\//g);
	if(matches){
		matches.forEach((line) => {
			data = data.replace(line, line.replace(/[^\n]*/g, ""));
		});
	}
	// Process line by line
	while(data.indexOf("\n") != -1){
		log.addLine();
		var regex = /\s*#(\\\n|[^\n])*/;
		var line = "";
		if(data.search(regex) == 0){
			line = data.match(regex)[0];
			data = data.substr(line.length);
			line = line.replace("\\\n", "");
			if(runDefine(line)){

			}else{

			}
			fout.write("\n");
		}else{
			line = data.substr(0, data.indexOf("\n") + 1);
			fout.write(line);
			data = data.substr(line.length);
		}
	}
	return data;
}

function runDefine(line){
	line = line.trim();
	var regex = /#\s*define\s*/;
	if(line.search(regex) != 0){
		return false;
	}
	line = line.substr(line.match(regex)[0].length);
	var macroName = line.match(/[_A-Za-z0-9]*/)[0];
	if(!macroName){
		log.error(`[PP]: Expected macro name in #define directive`);
		return false;
	}
	line = line.substr(macroName.length);
	var macro = {
		str: "",
		args: [],
		va: false
	};
	if(line.charAt(0) == '('){
		var paramLine = line.match(/\([^\)]*\)/);
		if(!paramLine){
			log.error(`[PP]: Unmatched ')' in #define directive`);
			return false;
		}
		line = line.substr(paramLine[0].length);
		var params = paramLine[0].substr(1, paramLine[0].length - 2).split(',');
		params.forEach((param) => {
			if(param.trim() == "..."){
				macro.va = true;
			}else{
				macro.args.push(param.trim());
			}
		});
	}
	macro.str = line.substr(1);
	macroMap[macroName] = macro;
	return true;
}