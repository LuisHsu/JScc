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
const pp = require('./pp');
const lexer = require('./lex');

const fin = fs.createReadStream(process.argv[2]);
const fout = fs.createWriteStream(process.argv[3]);

fin.pipe(pp,{end:false})
.on('error',(err) => {
	fs.unlink(process.argv[3], (err) => {});
	process.exit(-1);
})
.pipe(lexer,{end:false})
.on('error',(err) => {
	fs.unlink(process.argv[3], (err) => {});
	process.exit(-1);
})
.pipe(fout);