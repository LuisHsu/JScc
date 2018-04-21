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


const child_process = require("child_process");
const helper = require("./helper");
const Path = require('path');
const fs = require("fs");

describe("Preprocessor", () => {
	afterAll(helper.cleanTmp);
	it("can replace digraphs to source character", () => {
		var res = child_process.execFileSync("node", ["pp.js","test/digraphs.c", "tmp.E"]);
		expect(res instanceof Buffer).toBeTruthy();
		expect(fs.readFileSync("tmp.E").toString()).toBe(fs.readFileSync("test/digraphs.expect").toString());
	});
	it("can drop comments", () => {
		var res = child_process.execFileSync("node", ["pp.js","test/comment.c", "tmp.E"]);
		expect(res instanceof Buffer).toBeTruthy();
		expect(fs.readFileSync("tmp.E").toString()).toBe(fs.readFileSync("test/comment.expect").toString());
	});
	it("can define and evaluate macro", () => {
		var res = child_process.execFileSync("node", ["pp.js","test/define.c", "tmp.E"]);
		expect(res instanceof Buffer).toBeTruthy();
		expect(fs.readFileSync("tmp.E").toString()).toBe(fs.readFileSync("test/define.expect").toString());
	});
	it("can perform #if, #else, #elif, #endif directive", () => {
		var res = child_process.execFileSync("node", ["pp.js","test/ppIf.c", "tmp.E"]);
		expect(res instanceof Buffer).toBeTruthy();
		expect(fs.readFileSync("tmp.E").toString()).toBe(fs.readFileSync("test/ppIf.expect").toString());
	});
	it("has # and ## operator",() => {
		var res = child_process.execFileSync("node", ["pp.js","test/hashOp.c", "tmp.E"]);
		expect(res instanceof Buffer).toBeTruthy();
		expect(fs.readFileSync("tmp.E").toString()).toBe(fs.readFileSync("test/hashOp.expect").toString());
	});
	it("can include other file",() => {
		var oldcwd = process.cwd();
		process.chdir(Path.join(process.cwd(), 'test'));
		var res = child_process.execFileSync("node", [Path.join('..', "pp.js"),"include.c", "tmp.E"]);
		expect(res instanceof Buffer).toBeTruthy();
		expect(fs.readFileSync("tmp.E").toString()).toBe(fs.readFileSync("include.expect").toString());
		helper.cleanTmp();
		process.chdir(oldcwd);
	});
	it("can perform #ifdef, #ifndef directive",() => {
		var res = child_process.execFileSync("node", ["pp.js","test/ifdef_ifndef.c", "tmp.E"]);
		expect(res instanceof Buffer).toBeTruthy();
		expect(fs.readFileSync("tmp.E").toString()).toBe(fs.readFileSync("test/ifdef_ifndef.expect").toString());
	});
	it("can remove macro definition");
	it("can modify line number setting");
	it("can be aborted by #error");
	it("already prepared mandatory macros");
	it("has pragma. Though we don't use it now.");
});