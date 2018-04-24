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
console.log("=== [Unit Test] Preprocessor ===");

describe("Preprocessor", () => {
	it("can replace digraphs to source character", () => {
		const pp = require('../pp');
		expect(pp.digraph("<::><%%>%:%:%:")).toBe("[]{}###");
	});
	it("can drop comments", () => {
		const pp = require('../pp');
		expect(pp.singleLineComment("abc//def\n")).toBe("abc\n");
		expect(pp.multiLineComment("abc/*def\nghi*/\njkl\n")).toBe("abc\n\njkl\n");
	});
	it("can define and evaluate macro", () => {pending();});
	it("can perform #if, #else, #elif, #endif directive", () => {pending();});
	it("has # and ## operator",() => {pending();});
	it("can include other file",() => {pending();});
	it("can perform #ifdef, #ifndef directive",() => {pending();});
	it("can remove macro definition",() => {pending();});
	it("can modify line number setting", () => {pending();});
	it("can be aborted by #error", () => {pending();});
	it("already prepared mandatory macros", () => {pending();});
	it("has pragma. Though we don't use it now.", () => {pending();});
});