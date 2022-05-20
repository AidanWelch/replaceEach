import { StringMatcher, FunctionMatcher, ArrayMatcher } from "./matcher.js";

function replaceEach(string, searchValues, replaceValues) {
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
	let unusedMatchers = { count: matchers.length };
	let [result, currentMatcher] = parseChunk(string, matchers, unusedMatchers);
	while (currentMatcher !== null) {
		matchers = matchers.filter( matcher => matcher !== currentMatcher );
		let tempResult;
		[tempResult, currentMatcher] = parseChunk(string, matchers, unusedMatchers, currentMatcher.matchStart, string.length);
		result += tempResult;
	}
	return result;
}

function parseChunk (string, matchers, unusedMatchers, stringStart = 0, stringEnd = string.length) {

	let currentMatcher = null;

	if (matchers.length === 0) {
		return [string.slice(stringStart, stringEnd), currentMatcher];
	}
	
	let result = "";
	for (let i = stringStart; i < stringEnd; i++) {

		if (unusedMatchers.count === 0) {
			result += string.slice(i, stringEnd);
			break;
		}

		const c = string[i];

		if (currentMatcher !== null) {
			const checkedMatch = currentMatcher.checkMatch(i, c, string);
			if (checkedMatch === false) {
				const [tempResult, tempCurrentMatcher] = parseChunk(string, matchers.filter( matcher => matcher !== currentMatcher ), unusedMatchers, currentMatcher.matchStart, i);
				currentMatcher.resetMatch();
				currentMatcher = tempCurrentMatcher;
				result += tempResult;
				if (currentMatcher !== null) {
					continue;
				}
			} else {
				currentMatcher.tallyMatch();
				if (checkedMatch === "complete" && !currentMatcher.used) {
					result += currentMatcher.replaceFunction(string, currentMatcher.matchStart, currentMatcher.matchLength);
					currentMatcher.resetMatch();
					currentMatcher.used = true;
					unusedMatchers.count--;
					currentMatcher = null;
				}
				continue;
			}
		}

		let matched = false;

		for (let matcher of matchers) {
			const checkedMatch = (!matcher.used) ? matcher.checkMatch(i, c, string) : false;
			if (checkedMatch) {
				matcher.startMatch(i);
				if (checkedMatch === "complete" && !matcher.used) {
					result += matcher.replaceFunction(string, matcher.matchStart, matcher.matchLength);
					matcher.resetMatch();
					matcher.used = true;
					unusedMatchers.count--;
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

export default replaceEach;