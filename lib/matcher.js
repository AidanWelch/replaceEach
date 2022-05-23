class Matcher {
	constructor (replaceValue) {
		this.matchLength = 0;
		this.matchStart = null;
		this.replaceValue = replaceValue;
	}

	/**
	 * Callback called to generate the replaceValue
	 * @callback replaceCallback
	 * @param {string} match 
	 * @param {number} matchStart Index in the original string of the match
	 * @param {number} matchLength Length of the match
	 * @returns {string} String to use as replaceValue
	 */

	replaceFunction (originalString, matchStart, matchLength) {
		if (typeof this.replaceValue === "function") {
			const match = originalString.slice(matchStart, matchStart + matchLength);
			const offset = matchStart;
			return this.replaceValue(match, offset, originalString);
		}
		return this.replaceValue;
	}

	tallyMatch () {
		this.matchLength++;
	}

	startMatch (i) {
		this.matchLength = 1;
		this.matchStart = i;
	}

	resetMatch () {
		this.matchStart = null;
		this.matchLength = 0;
	}
}

class StringMatcher extends Matcher {
	constructor (searchString, replaceValue) {
		super(replaceValue);
		this.searchString = searchString;
	}

	checkMatch (i, c) {
		if (c === this.searchString[this.matchLength]) {
			if (this.matchLength === this.searchString.length - 1) {
				return "complete";
			}
			return true;
		}
		return false;
	}
}

/**
 * Callback called on a character to see if it matches
 * @callback searchCallback
 * @param {number} i Index of the character being checked
 * @param {string} c Character being checked
 * @param {MatcherObject} matcher The matcher of this search
 * @returns {boolean|"complete"} Returns false if there is no match, "complete" if it is final match in the pattern closing it, or true otherwise
 */

/**
 * Object used for keeping track of a specific searchValue
 * @typedef {Object} MatcherObject
 * @property {number} matchLength Length of the current match
 * @property {number|null} matchStart Index of the current match or null if there is none
 * @property {string|replaceCallback} replaceValue Used to replace match
 */

class FunctionMatcher extends Matcher {
	constructor (searchFunction, replaceValue) {
		super(replaceValue);
		this.searchFunction = searchFunction;
	}

	checkMatch (i, c) {
		return this.searchFunction(i, c, this);
	}
}

/**
 * @callback searchArrayCallback
 * @param {number} i Index of the character being checked
 * @param {string} c Character being checked
 * @param {MatcherObject} matcher The matcher of this search
 * @returns {boolean} Returns true on match, false otherwise
 */

class ArrayMatcher extends Matcher {
	constructor (searchArray, replaceValue) {
		super(replaceValue);
		this.searchArray = [];
		for (let searchValue of searchArray) {
			if (typeof searchValue === "function") {
				this.searchArray.push(new FunctionMatcher(searchValue));
			} else if (typeof searchValue === "string") {
				this.searchArray.push(new StringMatcher(searchValue));
			} else if (Array.isArray(searchValue)) {
				this.searchArray.push(new ArrayMatcher(searchValue));
			} else if (searchValue instanceof RegExp){
				throw "Not currently compatible with RegExp";
			} else {
				this.searchArray.push(new StringMatcher(searchValue.toString(), replaceValue));
			}
		}
	}

	checkMatch (i, c) {
		if (this.searchArray[this.matchLength].checkMatch(i, c)) {
			if (this.matchLength === this.searchArray.length - 1) {
				return "complete";
			}
			return true;
		}
		return false;
	}
}

export {StringMatcher, FunctionMatcher, ArrayMatcher};