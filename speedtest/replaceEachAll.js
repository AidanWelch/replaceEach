import { replaceEachAll } from "../index.js";

let string = "";
for (let i = 0; i < 1000000; i++) {
	string += i % 10;
}

const searchValues = ["0", "1", "2", "3", "4", "5", "6", "7",  "8", "9"];
const replaceValues = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

let treplaceAll = process.hrtime();
const resReplaceAll = string.replaceAll(searchValues[0], replaceValues[0]).replaceAll(searchValues[1], replaceValues[1]).replaceAll(searchValues[2], replaceValues[2]).replaceAll(searchValues[3], replaceValues[3]).replaceAll(searchValues[4], replaceValues[4]).replaceAll(searchValues[5], replaceValues[5]).replaceAll(searchValues[6], replaceValues[6]).replaceAll(searchValues[7], replaceValues[7]).replaceAll(searchValues[8], replaceValues[8]).replaceAll(searchValues[9], replaceValues[9]);
treplaceAll = process.hrtime(treplaceAll);
treplaceAll = treplaceAll[0] * 1000 + treplaceAll[1] / 1000000; 

let treplaceEachAll = process.hrtime();
const resReplaceEachAll = replaceEachAll(string, searchValues, replaceValues);
treplaceEachAll = process.hrtime(treplaceEachAll);
treplaceEachAll = treplaceEachAll[0] * 1000 + treplaceEachAll[1] / 1000000;

if (resReplaceAll !== resReplaceEachAll) {
	console.error("Results don't match!");
}

console.log(`
	replaceAll time: ${treplaceAll}
	replaceEachAll time: ${treplaceEachAll}
`);