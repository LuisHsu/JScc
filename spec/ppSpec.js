const child_process = require("child_process");
const helper = require("./helper");

describe("Preprocessor", () => {
	afterAll(helper.cleanTmp);
	it("should replace digraphs to source character", () => {
		var res = child_process.execFileSync("node", ["pp.js","test/digraphs.c", "tmp.E"]);
		expect(res instanceof Buffer).toBeTruthy();
		var diffres = helper.diffFile("test/digraphs.expect");
		expect(diffres).toBe("\n");
	});
});