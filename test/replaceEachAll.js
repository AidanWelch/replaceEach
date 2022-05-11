import assert from "assert";

import { replaceEachAll } from "../index.js";

describe("replaceEachAll", () => {

	const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
	const repeatingLetters = "aaa";

	describe("match replaceAll behavior with single string inputs", () => {

		it("should replace seperated character matches", () => {
			const searchValue = " ";
			const replaceValue = "_";
			assert.strictEqual(lorem.replaceAll(searchValue, replaceValue), replaceEachAll(lorem, searchValue, replaceValue));
		});

		it("should replace repeating character matches", () => {
			const searchValue = "a";
			const replaceValue = "REPLACED";
			assert.strictEqual(repeatingLetters.replaceAll(searchValue, replaceValue), replaceEachAll(repeatingLetters, searchValue, replaceValue));
		});

		it("should replace seperated string matches", () => {
			const searchValue = "it";
			const replaceValue = "REPLACED";
			assert.strictEqual(lorem.replaceAll(searchValue, replaceValue), replaceEachAll(lorem, searchValue, replaceValue));
		});

		it("should not replace on no match", () => {
			const searchValue = "123456WRONGWRONGWRONG";
			const replaceValue = "WRONG";
			assert.strictEqual(lorem.replaceAll(searchValue, replaceValue), replaceEachAll(lorem, searchValue, replaceValue));
		});

		it("should not replace on match not closed", () => {
			const searchValue = "aaaaaa";
			const replaceValue = "WRONG";
			assert.strictEqual(repeatingLetters.replaceAll(searchValue, replaceValue), replaceEachAll(repeatingLetters, searchValue, replaceValue));
		});

	});
});