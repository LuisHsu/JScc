const child_process = require("child_process");
const helper = require("./helper");

describe("Test file IO", () => {
	afterAll(helper.cleanTmp);
	it("to echo the file", () => {
		var res = child_process.execFileSync("node", ["pp.js","test/test.c", "tmp.E"]);
		expect(res instanceof Buffer).toBeTruthy();
		var diffres = helper.diffFile("test/test.expect");
		expect(diffres).toBe("\n");
	});
});