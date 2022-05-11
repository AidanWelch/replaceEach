class Matcher {
	constructor (replaceValue) {
		this.matchLength = 0;
		this.matchStart = null;
		this.replaceValue = replaceValue;
	}

	match (i, c) {
		if (this.checkMatch(i, c)) {
			if (this.matchStart === null) {
				this.matchStart = i;
			}
			this.matchLength++;
		} else if (this.matchLength) {
			const matchLength = this.matchLength;
			this.matchLength = 0;
			const matchStart = this.matchStart;
			this.matchStart = null;
			return [matchStart, matchLength]; 
		}
		return [this.matchStart, null];
	}
}

class StringMatcher extends Matcher {
	constructor (searchString, replaceValue) {
		super(replaceValue);
		this.searchString = searchString;
	}

	checkMatch (i, c) {
		return (c === this.searchString[this.matchLength]);
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
		return this.searchArray[this.matchLength].checkMatch(i, c);
	}
}

export {StringMatcher, FunctionMatcher, ArrayMatcher};