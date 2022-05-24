# replaceEach

Replace an array of search patterns with an array of replacers.

⚠️ **Not Compatible with RegExp search!** ⚠️

[Documentation](docs.md)

## Usage

replaceEach/replaceEachAll is not a one to one replacement for looping [String.prototype.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) or [String.prototype.replaceAll()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll).  Instead it loops through the input string usually only once, and does not search the modified string.  This means it will not replace a match in already replaced text.  Furthermore, a match in replaceEach has a first-match priority, meaning the first match chronilogically and the first match in the array is prioritized.  

For example:

```js
import { replaceEach } from "replaceEach";

const originalString = "ABCDEFG";
const replaceValues = ["~", "_"];

console.log(replaceEach(originalString, ["ABCDE", "AB"], replaceValues));
// Logs "~FG"

console.log(replaceEach(originalString, ["BCDE", "AB"], replaceValues));
// Logs "_CDEFG"
```

Using a search array can be one way to substitute the behavior of RegExp, for example instead of `/[^~].[^~]/`:

```js
import { replaceEachAll } from "replaceEach";

const originalString = "~a~b~cdf~";

const searchValues = [
  [
    (i, c) => {return c !== "~"},
    (i, c) => {return true},
    (i, c) => {return c !== "~"},
  ]
];

const replaceValues = ["match"];

console.log(replaceEachAll(originalString, searchValues, replaceValues));
// Logs "~match~match~" to the console
```

And a search function can allow for even more complex behavior, for example: 

```js
import { replaceEach } from "replaceEach";

const originalString = "002356";

const searchValues = [
  function (i, c, matcher) {
    const parsed = parseInt(c);

    if (matcher.data_sum === undefined) {
      matcher.data_sum = 0;
    }
    // Using the passed matcher object is a good way to store data across calls of the search function,
    // but variables should be made as unique as possible

    if (parsed !== NaN) {
      if (parsed === matcher.data_sum && parsed !== 0) {
        matcher.data_sum = 0;
        return "complete";
      }
      matcher.data_sum += parsed;
      return true;
    }
    return false;
  }
];

const replaceValues = [
  function (match, offset, matchLength) {
    return [...match].reverse().join("");
  }
];

console.log(replaceEach(originalString, searchValues, replaceValues));
// Logs "532006" to the console
```

### Performance

replaceEach is written in JS and utilizes objects for finding each match, this overhead adds cost over the natural replace and replaceAll functions, however in some situations replaceEach is still more performant than looping replace/replaceAll.

Increasing replaceValue Length:

This is more performant because String.prototype.replaceAll() would have to loop over increasingly large strings.

![replaceAll RL](https://raw.githubusercontent.com/AidanWelch/replaceEach/main/speedtest/replaceEachAllReplaceLength.png)

Increasing numbers searchValues has a similar effect:

![replaceAll SC](https://raw.githubusercontent.com/AidanWelch/replaceEach/main/speedtest/replaceEachAllSearchCount.png)

And, increasing the length of searchValues eventually benefits:

![replaceAll SL](https://raw.githubusercontent.com/AidanWelch/replaceEach/main/speedtest/replaceEachAllSearchLength.png)

However, there is no benefit with increasing string lengths:

![replaceAll STRL](https://raw.githubusercontent.com/AidanWelch/replaceEach/main/speedtest/replaceEachAllStringLength.png)

And, it gets exponentially worse when both the number of search values and their length increase

![replaceAll both](https://raw.githubusercontent.com/AidanWelch/replaceEach/main/speedtest/replaceEachAllBothSearchLengthCount.png)

However, this is only for replaceEachAll.  replaceEach and String.prototype.replace() are both more anomalous in their performance, their graphs can also be found in [the speedtest directory.](https://github.com/AidanWelch/replaceEach/tree/main/speedtest)  And, the performance of each is always situational, so test performance yourself before implimenting hoping to improve performance.
