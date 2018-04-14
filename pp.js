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

var tmpbuf = Buffer.alloc(0);

const fin = fs.createReadStream(process.argv[2]);
const fout = fs.createWriteStream(process.argv[3]);

var macroMap = {};

fin.on('data', (data) => {
	var dataBuf = Buffer.concat([tmpbuf, data], tmpbuf.length + data.length);
	runPP(dataBuf);
	tmpbuf = dataBuf;
});

fin.on('end', ()=>{
	if(tmpbuf.length > 0){
		runPP(tmpbuf);
	}
	fin.close();
	fout.close();
});

function runPP(dataBuf){
	var data = dataBuf.toString();
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
		var regex = /\s*#(\\\n|[^\n])*/;
		var line = "";
		if(data.search(regex) == 0){
			line = data.match(regex)[0].replace("\\\n", "");
			if(!runDefine(line)){

			}else{

			}
		}else{
			line = data.substr(0, data.indexOf("\n") + 1);
		}
		data = data.substr(line.length);
	}
}

function runDefine(line){
	line = line.trim();
	var regex = /#\s*define\s*/;
	if(line.search(regex) != 0){
		return false;
	}
	line = line.substr(line.match(regex)[0].length);
	regex = /[_A-Za-z0-9]*/;
	return true;
}