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

const fout = fs.createWriteStream(process.argv[3]);

fs.readFile(process.argv[2], (err, data) => {
	if(err){
		console.error(err);
		return;
	}
	var dataBuf = Buffer.concat([tmpbuf, data], tmpbuf.length + data.length);
	runPP(dataBuf.toString());
	tmpbuf = dataBuf;
});

function runPP(data){
	fout.write(data);
}