import assert from "assert";

import { replaceOne } from "../index.js";

describe("replaceOne", () => {

	describe("behavior with single string inputs", () => {
		const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
		const repeatingLetters = "aaa";

		it("should first character match", () => {
			const searchValue = " ";
			const replaceValue = "_";
			assert.strictEqual(replaceOne(lorem, searchValue, replaceValue), lorem.replace(searchValue, replaceValue));
		});

		it("should replace first connected character match", () => {
			const searchValue = "a";
			const replaceValue = "REPLACED";
			assert.strictEqual(replaceOne(repeatingLetters, searchValue, replaceValue), repeatingLetters.replace(searchValue, replaceValue));
		});

		it("should replace first string match", () => {
			const searchValue = "it";
			const replaceValue = "REPLACED";
			assert.strictEqual(replaceOne(lorem, searchValue, replaceValue), lorem.replace(searchValue, replaceValue));
		});

		it("should not replace on no match", () => {
			const searchValue = "123456WRONGWRONGWRONG";
			const replaceValue = "WRONG";
			assert.strictEqual(replaceOne(lorem, searchValue, replaceValue), lorem);
		});

		it("should not replace on match not closed", () => {
			const searchValue = "aaaaaa";
			const replaceValue = "WRONG";
			assert.strictEqual(replaceOne(repeatingLetters, searchValue, replaceValue), repeatingLetters);
		});
	});

	describe("behavior with multiple string inputs", () => {
		const string = "abcd"
		it("should replace first of array of matchers", () => {
			const searchValues = ["a", "b", "c"];
			const replaceValues = ["x", "y", "z"];
			assert.strictEqual(replaceOne(string, searchValues, replaceValues), "xbcd");
		});

		it("should replace first of array matchers on searchValues.length > replaceValues.length", () => {
			const searchValues = ["a", "b", "c"];
			const replaceValues = ["x", "y"];
			assert.strictEqual(replaceOne(string, searchValues, replaceValues), "xbcd");
		});

		it("should prioritize the first of overlapping", () => {
			const searchValues = ["ab", "abc"];
			const replaceValues = ["x", "y"];
			assert.strictEqual(replaceOne(string, searchValues, replaceValues), "xcd");
		});

		it("should prioritize the first matched of overlapping", () => {
			const searchValues = ["bcd", "ab"];
			const replaceValues = ["x", "y"];
			assert.strictEqual(replaceOne(string, searchValues, replaceValues), "ycd");
		});

		it("should repeat with next search value if failed match", () => {
			const searchValues = ["abcf", "abc"];
			const replaceValues = ["x", "y"];
			assert.strictEqual(replaceOne(string, searchValues, replaceValues), "yd");
		});

		it("should not duplicate unmatched characters on cancelled match", () => {
			const string = "0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abc !\"#$%&'()*+,-./0123456789:;<=>?";
			const searchValues = ["EE", "66", ",,", "#", "66", " ", "TTT", "!"];
			const replaceValue = "REPLACE";
			const result = "0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcREPLACE!\"#$%&'()*+,-./0123456789:;<=>?";
			assert.strictEqual(replaceOne(string, searchValues, replaceValue), result);
		});
	});

	describe("behavior with function replaceValues", () => {
		const string = "aaaaaaaabbbbbbb";

		it("should match behavior of replace with string input with one match", () => {
			const searchValues = "ab";
			function replaceFunction (match, offset, string) {
				return string;
			};
			const result = string.replace(searchValues, replaceFunction)
			assert.strictEqual(replaceOne(string, searchValues, replaceFunction), result);
		});

		it("should match behaviour of replace with one match", () => {
			const searchValues = ["ab"];
			function replaceFunction (match, offset, string) {
				return match.length;
			};
			const result = string.replace(searchValues[0], replaceFunction);
			assert.strictEqual(replaceOne(string, searchValues, replaceFunction), result);
		});

		it("should only replace first match", () => {
			const searchValues = ["ab", "a", "b"];
			function replaceFunction (match, offset, string) {
				return match.length;
			};
			const result = string.replace(searchValues[1], replaceFunction);
			assert.strictEqual(replaceOne(string, searchValues, replaceFunction), result);
		});

		it("should match behavior of sequential single replace with offset when it is not altered in replace", () => {
			const searchValues = ["a", "b"];
			function replaceFunction (match, offset, string) {
				return offset;
			};
			const result = string.replace(searchValues[0], replaceFunction);
			assert.strictEqual(replaceOne(string, searchValues, replaceFunction), result);
		});

		it("should not match behavior of sequential replaces with offset when it is altered", () => {
			const searchValues = ["ab", "a", "b"];
			function replaceFunction (match, offset, string) {
				return " "+ match.toUpperCase() + offset + " ";
			};
			const result = string.replace(searchValues[0], replaceFunction).replace(searchValues[1], replaceFunction).replace(searchValues[2], replaceFunction);
			assert.notStrictEqual(replaceOne(string, searchValues, replaceFunction), result);
		})
	});

	describe("behavior with array and function searchValues", () => {
		const string = "0123456789";
		it("should match behavior between array of characters and string", () => {
			const searchString = "4567";
			const replaceValue = "A";
			assert.strictEqual(replaceOne(string, [searchString.split("")], replaceValue), replaceOne(string, searchString, replaceValue))
		});

		it("should match as expected with function searchValue", () => {
			const searchFunction = function (i, c, matcher) {
				if (i === parseInt(c)) {
					return "complete";
				}
				return false;
			}
			const replaceValue = "A";
			const result = "A123456789"
			assert.strictEqual(replaceOne(string, searchFunction, replaceValue), result)
		});

		it("should match as expected with arraySearch functions", () => {
			const searchFunctions = [
				[
					function (i, c, matcher) {
						const pc = parseInt(c);
						return pc === 0 || pc === 5;
					},
					function (i, c, matcher) {
						const pc = parseInt(c);
						return pc === 1 || pc === 6;
					},
					function (i, c, matcher) {
						const pc = parseInt(c);
						return pc === 2 || pc === 7;
					}
				]
			];
			const replaceValue = " ABCD ";
			const result = " ABCD 3456789";
			assert.strictEqual(replaceOne(string, searchFunctions, replaceValue), result);
		});

		it("should not match with false arraySearch functions", () => {
			const searchFunctions = [
				[
					function (i, c, matcher) {
						const pc = parseInt(c);
						return pc === 0 || pc === 5;
					},
					function (i, c, matcher) {
						const pc = parseInt(c);
						return pc === 1 || pc === 6;
					},
					function (i, c, matcher) {
						const pc = parseInt(c);
						return false;
					}
				]
			];
			const replaceValue = " ABCD ";
			assert.strictEqual(replaceOne(string, searchFunctions, replaceValue), string);
		});

	});
});