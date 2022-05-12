class Matcher {
	constructor (replaceValue) {
		this.matchLength = 0;
		this.matchStart = null;
		this.replaceValue = replaceValue;
	}

	replaceFunction (string, matchStart, matchLength, absoluteOffset, originalString) {
		if (typeof this.replaceValue === "function") {
			const match = string.slice(matchStart, matchStart + matchLength);
			const offset = matchStart + absoluteOffset;
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

class FunctionMatcher extends Matcher {
	constructor (searchFunction, replaceValue) {
		super(replaceValue);
		this.searchFunction = searchFunction;
	}

	checkMatch (i, c) {
		return this.searchFunction(i, c, this);
	}
}

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