import { StringMatcher, FunctionMatcher, ArrayMatcher } from "./matcher.js";

/**
 * Replaces the first occurence of a match in a string, then returns the result
 * @param {string} originalString String to search an replace
 * @param {Array.<string|searchCallback|Array.<string|searchArrayCallback>>} searchValues Array of search patterns, either a string, a callback, or an array containing a value for each character in the pattern
 * @param {Array.<string|replaceCallback>} replaceValues Array of values and/or callbacks(to call) to replace a match, defaults to last in the array if fewer replaceValues than searchValues
 * @returns {string} String with the first match of a searchValue replaced with the respective replaceValue
 */

function replaceOne(string, searchValues, replaceValues) {
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
	let [result, currentMatcher, matchedOnce] = parseChunk(string, matchers);
	while (currentMatcher !== null && !matchedOnce) {
		matchers = matchers.filter( matcher => matcher !== currentMatcher );
		let tempResult;
		[tempResult, currentMatcher, matchedOnce] = parseChunk(string, matchers, currentMatcher.matchStart, string.length);
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
				const [tempResult, tempCurrentMatcher, matchedOnce] = parseChunk(string, matchers.filter( matcher => matcher !== currentMatcher ), currentMatcher.matchStart, i);
				currentMatcher.resetMatch();
				currentMatcher = tempCurrentMatcher;
				result += tempResult;
				if (matchedOnce) {
					result += string.slice(i + 1);
					return [result, null, true];
				}
				if (currentMatcher !== null) {
					continue;
				}
			} else {
				currentMatcher.tallyMatch();
				if (checkedMatch === "complete") {
					result += currentMatcher.replaceFunction(string, currentMatcher.matchStart, currentMatcher.matchLength);
					result += string.slice(i + 1);
					return [result, null, true];
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
					result += string.slice(i + 1);
					return [result, null, true];
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

	return [result, currentMatcher, false];
}

export default replaceOne;