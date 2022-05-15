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

function parseString(string, matchers) {
	if (matchers.length === 0) {
		return string;
	}

	let result = "";
	const currentMatchers = [];
	for (let i = 0; i < string.length; i++) {
		const c = string[i];

		result += c;

		for (let matcher of matchers) {
			const checkedMatch = matcher.checkMatch(i, c);
			if (checkedMatch) {
				if (matcher.matchLength === 0) {
					matcher.startMatch(i, result.length);
					currentMatchers.push(matcher);
				}
				matcher.tallyMatch();
				if (checkedMatch === "complete") {
					const matcherIndex = currentMatchers.indexOf(matcher);
					if (matcherIndex !== -1) {
						result = matcher.replaceFunction(result, string, matcher.matchStart, matcher.matchLength);
						for (let n = matcherIndex; n < currentMatchers.length; n++) {
							currentMatchers.pop();
						}
					}
					matcher.resetMatch();
				}
			} else {
				matcher.resetMatch();
			}
		}
	}

	return result;
}

export default replaceEachAll;