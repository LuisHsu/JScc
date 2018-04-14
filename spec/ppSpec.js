const child_process = require("child_process");
const helper = require("./helper");
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
	it("can define and evaluate macro");
	it("can perform #if, #else, #endif directive");
	it("can include other file");
	it("can remove macro definition");
	it("can modify line number setting");
	it("can abort with #error");
	it("already prepared mandatory macros");
});