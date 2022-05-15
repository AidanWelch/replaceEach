import { replaceEachAll } from "../index.js";
import { addChartLabels, addChartData, saveChart } from "./chartHandler.js";

const characters = []
for (let i = 32; i < 100; i++) {
	characters.push(String.fromCharCode(i));
}


function testFunction(options) {
	let maxParamIteration = 1000;
	maxParamIteration = options.maxSearchCount || maxParamIteration;
	maxParamIteration = options.maxStringLength || maxParamIteration;
	maxParamIteration = options.maxReplaceLength || maxParamIteration;

	const changeLabels = [];
	const changeRA = [];
	const changeREA = [];
	for (let paramIterator = 0; paramIterator < maxParamIteration; paramIterator += options.step || 10) {
		changeLabels.push(paramIterator);

		const stringLength = options.maxStringLength ? paramIterator : 10000;
		const searchCount = options.maxSearchCount ? paramIterator : 10;
		const replaceLength = options.maxReplaceLength ? paramIterator : 1;

		let string = "";
		for (let i = 0; i < stringLength; i++) {
			string += characters[ i % characters.length];
		}
		
		const searchValues = [];
		for (let i = 0; i < searchCount; i++) {
			const random = Math.random();
			let searchValue = "";
			for (let s = 0; s < Math.ceil(random * 3); s++) {
				searchValue += characters[Math.floor(random * characters.length)];
			}
			searchValues.push(searchValue);
		}
		const replaceValue = "~".repeat(replaceLength);
		
		let treplaceAll = process.hrtime();
		let resReplaceAll = string;
		const l = searchValues.length;
		for (let i = 0; i < l; i++) {
			resReplaceAll = resReplaceAll.replaceAll(searchValues[i], replaceValue)
		}
		treplaceAll = process.hrtime(treplaceAll);
		treplaceAll = treplaceAll[0] * 1000 + treplaceAll[1] / 1000000; 
		
		let treplaceEachAll = process.hrtime();
		const resReplaceEachAll = replaceEachAll(string, searchValues, replaceValue);
		treplaceEachAll = process.hrtime(treplaceEachAll);
		treplaceEachAll = treplaceEachAll[0] * 1000 + treplaceEachAll[1] / 1000000;
		
		if (resReplaceAll !== resReplaceEachAll) {
			console.error("Results don't match!");
			console.error('Original:       "' + string + '"');
			console.error('replaceAll:     "' + resReplaceAll + '"');
			console.error('replaceEachAll: "' + resReplaceEachAll + '"');
			console.error("Search Values:   " + searchValues);
		}
		changeRA.push(treplaceAll);
		changeREA.push(treplaceEachAll);
	}
	return [changeLabels, changeRA, changeREA];
}

function avgTest (options) {
	let lastChangeLabels = [];
	const [avgChangeRA, avgChangeREA] = [[], []];
	const iterations = 10;
	for(let i = 0; i < iterations; i++) {
		console.log(i + "/" + iterations);
		const [changeLabels, changeRA, changeREA] = testFunction(options);
		for(let j = 0; j < changeLabels.length; j++) {
			if (avgChangeRA[j] === undefined) {
				avgChangeRA[j] = [changeRA[j]];
				avgChangeREA[j] = [changeREA[j]];
			} else {
				avgChangeRA[j].push(changeRA[j]);
				avgChangeREA[j].push(changeREA[j]);
			}

		}
		lastChangeLabels = changeLabels;
	}
	const medIndex = Math.floor(iterations / 2);
	for(let j = 0; j < lastChangeLabels.length; j++) {
		avgChangeRA[j] = avgChangeRA[j].sort( (a, b) => a - b)[medIndex];
		avgChangeREA[j] = avgChangeREA[j].sort( (a, b) => a - b)[medIndex];
	}
	return [lastChangeLabels, avgChangeRA, avgChangeREA];
}

const [strChangeLabels, strChangeRA, strChangeREA] = avgTest({maxSearchCount: 1000, step: 100});
addChartLabels(strChangeLabels);
addChartData("String Length replaceAll", strChangeRA);
addChartData("String Length replaceEachAll", strChangeREA);
saveChart("./speedtest/replaceEachAll.png")