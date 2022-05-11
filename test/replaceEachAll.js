import assert from "assert";

import { replaceEachAll } from "../index.js";

describe("replaceEachAll", () => {

	const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
	const repeatingLetters = "aaa";

	describe("match replaceAll behavior with single string inputs", () => {

		it("should replace seperated character matches", () => {
			const searchValue = " ";
			const replaceValue = "_";
			assert.strictEqual( replaceEachAll(lorem, searchValue, replaceValue), lorem.replaceAll(searchValue, replaceValue));
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
});