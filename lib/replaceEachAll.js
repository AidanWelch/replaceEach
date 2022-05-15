import { StringMatcher, FunctionMatcher, ArrayMatcher } from "./matcher.js";

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

function parseString(string, matchers, absoluteOffset = 0, originalString = string) {
	if (matchers.length === 0) {
		return string;
	}
	let currentMatcher = null;
	let result = "";
	for (let i = 0; i < string.length; i++) {
		const c = string[i];
		if (currentMatcher !== null) {
			const checkedMatch = currentMatcher.checkMatch(i, c);
			if (checkedMatch === false) {
				result += parseString(string.slice(currentMatcher.matchStart, i), matchers.filter( matcher => matcher !== currentMatcher ),  absoluteOffset + currentMatcher.matchStart, originalString);
				currentMatcher.resetMatch();
				currentMatcher = null;
			} else {
				currentMatcher.tallyMatch();
				if (checkedMatch === "complete") {
					result += currentMatcher.replaceFunction(string, currentMatcher.matchStart, currentMatcher.matchLength, absoluteOffset, originalString);
					currentMatcher.resetMatch();
					currentMatcher = null;
				}
				continue;
			}
		}

		let matched = false;
		for (let matcher of matchers) {
			const checkedMatch = matcher.checkMatch(i, c);
			if (checkedMatch) {
				matcher.startMatch(i);
				if (checkedMatch === "complete") {
					result += matcher.replaceFunction(string, matcher.matchStart, matcher.matchLength, absoluteOffset, originalString);
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
	if (currentMatcher !== null) {
		result += parseString(string.slice(currentMatcher.matchStart), matchers.filter( matcher => matcher !== currentMatcher ), absoluteOffset + currentMatcher.matchStart, originalString);
	}
	return result;
}

export default replaceEachAll;