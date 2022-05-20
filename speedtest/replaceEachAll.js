import { replaceEachAll } from "../index.js";
import ChartHandler from "./chartHandler.js";

const characters = []
for (let i = 32; i < 100; i++) {
	characters.push(String.fromCharCode(i));
}


function testFunction(options) {
	let maxParamIteration = 1000;
	maxParamIteration = options.maxSearchCount || maxParamIteration;
	maxParamIteration = options.maxStringLength || maxParamIteration;
	maxParamIteration = options.maxReplaceLength || maxParamIteration;
	maxParamIteration = options.maxSearchLength || maxParamIteration;

	const changeLabels = [];
	const changeRA = [];
	const changeREA = [];
	for (let paramIterator = 1; paramIterator <= maxParamIteration + 1; paramIterator += options.step || 10) {
		changeLabels.push(paramIterator);

		const stringLength = options.maxStringLength ? paramIterator : 20001;
		const searchCount = options.maxSearchCount ? paramIterator : 10;
		const replaceLength = options.maxReplaceLength ? paramIterator : 1;
		const searchLength = options.maxSearchLength ? paramIterator : 1;

		let string = "";
		for (let i = 0; i < stringLength; i++) {
			string += characters[Math.floor(Math.random() * characters.length)];
		}
		
		const searchValues = [];
		for (let i = 0; i < searchCount; i++) {
			let searchValue = "";
			for (let j = 0; j < searchLength; j++) {
				searchValue += characters[Math.floor(Math.random() * characters.length)];
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
		
		if (resReplaceAll !== resReplaceEachAll && options.checkError !== false) {
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
	const iterations = 500;
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

const [strChangeLabels, strChangeRA, strChangeREA] = avgTest({maxStringLength: 10000, step: 1000});
const strChart = new ChartHandler(strChangeLabels);
strChart.addChartData("String Length replaceAll", strChangeRA);
strChart.addChartData("String Length replaceEachAll", strChangeREA);
strChart.saveChart("./speedtest/replaceEachAllStringLength.png");

const [repChangeLabels, repChangeRA, repChangeREA] = avgTest({maxReplaceLength: 1000, step: 100});
const repChart = new ChartHandler(repChangeLabels);
repChart.addChartData("Length of Replace Value replaceAll", repChangeRA);
repChart.addChartData("Length of Replace Value replaceEachAll", repChangeREA);
repChart.saveChart("./speedtest/replaceEachAllReplaceLength.png");

const [srcChangeLabels, srcChangeRA, srcChangeREA] = avgTest({maxSearchCount: 10000, step: 1000});
const srcChart = new ChartHandler(srcChangeLabels);
srcChart.addChartData("# of Search Values replaceAll", srcChangeRA);
srcChart.addChartData("# of Search Values replaceEachAll", srcChangeREA);
srcChart.saveChart("./speedtest/replaceEachAllSearchCount.png");

const [srlChangeLabels, srlChangeRA, srlChangeREA] = avgTest({maxSearchLength: 20000, step: 2000, checkError: false});
const srlChart = new ChartHandler(srlChangeLabels);
srlChart.addChartData("Length of Search Values replaceAll", srlChangeRA);
srlChart.addChartData("Length of Search Values replaceEachAll", srlChangeREA);
srlChart.saveChart("./speedtest/replaceEachAllSearchLength.png");

const [bsrChangeLabels, bsrChangeRA, bsrChangeREA] = avgTest({maxSearchCount: 100, maxSearchLength: 100, step: 10, checkError: false});
const bsrChart = new ChartHandler(bsrChangeLabels);
bsrChart.addChartData("# of Search Values and Length replaceAll", bsrChangeRA);
bsrChart.addChartData("# of Search Values and Length replaceEachAll", bsrChangeREA);
bsrChart.saveChart("./speedtest/replaceEachAllBothSearchLengthCount.png");