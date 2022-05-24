import { StringMatcher, FunctionMatcher, ArrayMatcher } from "./matcher.js";

/**
 * Replaces each occurence of a match in a string, then returns the result
 * @param {string} originalString String to search an replace
 * @param {Array.<string|searchCallback|Array.<string|searchArrayCallback>>} searchValues Array of search patterns, either a string, a callback, or an array containing a value for each character in the pattern
 * @param {Array.<string|replaceCallback>} replaceValues Array of values and/or callbacks(to call) to replace a match, defaults to last in the array if fewer replaceValues than searchValues
 * @returns {string} String with every match of each searchValue replaced with respective replaceValues
 */

function replaceEachAll(string, searchValues, replaceValues) {
	if(!Array.isArray(searchValues)) {
		searchValues = [searchValues];
	}
	if(!Array.isArray(replaceValues)) {
		replaceValues = [replaceValues];
	}
	const matchers = [];
	for (let i = 0; i < searchValues.length; i++) {
		const searchValue = searchValues[i];
		const replaceValue = (replaceValues[i] === undefined) ? replaceValues.at(-1) : replaceValues[i];
		if (typeof searchValue === "function") {
			matchers.push(new FunctionMatcher(searchValue, replaceValue));
		} else if (typeof searchValue === "string") {
			matchers.push(new StringMatcher(searchValue, replaceValue));
		} else if (Array.isArray(searchValue)) {
			matchers.push(new ArrayMatcher(searchValue, replaceValue));
		} else if (searchValue instanceof RegExp){
			throw "Not currently compatible with RegExp";
		} else {
			matchers.push(new StringMatcher(searchValue.toString(), replaceValue));
		}
	}
	return parseString(string, matchers);
}

function parseString (string, matchers) {
	let [result, currentMatcher] = parseChunk(string, matchers);
	while (currentMatcher !== null) {
		matchers = matchers.filter( matcher => matcher !== currentMatcher );
		let tempResult;
		[tempResult, currentMatcher] = parseChunk(string, matchers, currentMatcher.matchStart, string.length);
		result += tempResult;
	}
	return result;
}

function parseChunk (string, matchers, stringStart = 0, stringEnd = string.length) {

	let currentMatcher = null;

	if (matchers.length === 0) {
		return [string.slice(stringStart, stringEnd), currentMatcher];
	}
	
	let result = "";
	for (let i = stringStart; i < stringEnd; i++) {

		const c = string[i];

		if (currentMatcher !== null) {
			const checkedMatch = currentMatcher.checkMatch(i, c, string);
			if (checkedMatch === false) {
				const [tempResult, tempCurrentMatcher] = parseChunk(string, matchers.filter( matcher => matcher !== currentMatcher ), currentMatcher.matchStart, i);
				currentMatcher.resetMatch();
				currentMatcher = tempCurrentMatcher;
				result += tempResult;
				if (currentMatcher !== null) {
					continue;
				}
			} else {
				currentMatcher.tallyMatch();
				if (checkedMatch === "complete") {
					result += currentMatcher.replaceFunction(string, currentMatcher.matchStart, currentMatcher.matchLength);
					currentMatcher.resetMatch();
					currentMatcher = null;
				}
				continue;
			}
		}

		let matched = false;

		for (let matcher of matchers) {
			const checkedMatch = matcher.checkMatch(i, c, string);
			if (checkedMatch) {
				matcher.startMatch(i);
				if (checkedMatch === "complete") {
					result += matcher.replaceFunction(string, matcher.matchStart, matcher.matchLength);
					matcher.resetMatch();
				} else {
					currentMatcher = matcher;
				}
				matched = true;
				break;
			}
		}

		if (!matched) {
			result += c;
		}
	}

	return [result, currentMatcher];
}

export default replaceEachAll;