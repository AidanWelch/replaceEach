import assert from "assert";

import { replaceEachAll } from "../index.js";

describe("replaceEachAll", () => {



	describe("behavior with single string inputs", () => {
		const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
		const repeatingLetters = "aaa";

		it("should replace seperated character matches", () => {
			const searchValue = " ";
			const replaceValue = "_";
			assert.strictEqual(replaceEachAll(lorem, searchValue, replaceValue), lorem.replaceAll(searchValue, replaceValue));
		});

		it("should replace repeating character matches", () => {
			const searchValue = "a";
			const replaceValue = "REPLACED";
			assert.strictEqual(replaceEachAll(repeatingLetters, searchValue, replaceValue), repeatingLetters.replaceAll(searchValue, replaceValue));
		});

		it("should replace seperated string matches", () => {
			const searchValue = "it";
			const replaceValue = "REPLACED";
			assert.strictEqual(replaceEachAll(lorem, searchValue, replaceValue), lorem.replaceAll(searchValue, replaceValue));
		});

		it("should not replace on no match", () => {
			const searchValue = "123456WRONGWRONGWRONG";
			const replaceValue = "WRONG";
			assert.strictEqual(replaceEachAll(lorem, searchValue, replaceValue), lorem);
		});

		it("should not replace on match not closed", () => {
			const searchValue = "aaaaaa";
			const replaceValue = "WRONG";
			assert.strictEqual(replaceEachAll(repeatingLetters, searchValue, replaceValue), repeatingLetters);
		});
	});

	describe("behavior with multiple string inputs", () => {
		const string = "abcd"
		it("should replace matches with their respective replaceValue", () => {
			const searchValues = ["a", "b", "c"];
			const replaceValues = ["x", "y", "z"];
			assert.strictEqual(replaceEachAll(string, searchValues, replaceValues), "xyzd");
		});

		it("should replace matches with their respective replaceValue or last", () => {
			const searchValues = ["a", "b", "c"];
			const replaceValues = ["x", "y"];
			assert.strictEqual(replaceEachAll(string, searchValues, replaceValues), "xyyd");
		});

		it("should prioritize the first of overlapping", () => {
			const searchValues = ["ab", "abc"];
			const replaceValues = ["x", "y"];
			assert.strictEqual(replaceEachAll(string, searchValues, replaceValues), "xcd");
		});

		it("should prioritize the first matched of overlapping", () => {
			const searchValues = ["bcd", "ab"];
			const replaceValues = ["x", "y"];
			assert.strictEqual(replaceEachAll(string, searchValues, replaceValues), "ycd");
		});

		it("should repeat with next search value if failed match", () => {
			const searchValues = ["bcf", "abc"];
			const replaceValues = ["x", "y"];
			assert.strictEqual(replaceEachAll(string, searchValues, replaceValues), "yd");
		});
	});

	describe("behavior with function replaceValues", () => {
		const string = "aaaaaaaabbbbbbb";
		it("should match behaviour of sequential replaceAlls", () => {
			const searchValues = ["ab", "a", "b"];
			function replaceFunction (match, offset, string) {
				return match.length;
			};
			const result = string.replaceAll(searchValues[0], replaceFunction).replaceAll(searchValues[1], replaceFunction).replaceAll(searchValues[2], replaceFunction);
			assert.strictEqual(replaceEachAll(string, searchValues, replaceFunction), result);
		});
	});
});