import { replaceEach } from "../index.js";
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
	const changeR = [];
	const changeRE = [];
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
		
		let treplace = process.hrtime();
		let resReplace = string;
		const l = searchValues.length;
		for (let i = 0; i < l; i++) {
			resReplace = resReplace.replace(searchValues[i], replaceValue)
		}
		treplace = process.hrtime(treplace);
		treplace = treplace[0] * 1000 + treplace[1] / 1000000; 
		
		let treplaceEach = process.hrtime();
		const resReplaceEach = replaceEach(string, searchValues, replaceValue);
		treplaceEach = process.hrtime(treplaceEach);
		treplaceEach = treplaceEach[0] * 1000 + treplaceEach[1] / 1000000;
		
		if (resReplace !== resReplaceEach && options.checkError !== false) {
			console.error("Results don't match!");
			console.error('Original:       "' + string + '"');
			console.error('replace:     "' + resReplace + '"');
			console.error('replaceEach: "' + resReplaceEach + '"');
			console.error("Search Values:   " + searchValues);
		}
		changeR.push(treplace);
		changeRE.push(treplaceEach);
	}
	return [changeLabels, changeR, changeRE];
}

function avgTest (options) {
	let lastChangeLabels = [];
	const [avgChangeR, avgChangeRE] = [[], []];
	const iterations = options.iterations ? options.iterations : 1000;
	for(let i = 0; i < iterations; i++) {
		console.log(i + "/" + iterations);
		const [changeLabels, changeR, changeRE] = testFunction(options);
		for(let j = 0; j < changeLabels.length; j++) {
			if (avgChangeR[j] === undefined) {
				avgChangeR[j] = [changeR[j]];
				avgChangeRE[j] = [changeRE[j]];
			} else {
				avgChangeR[j].push(changeR[j]);
				avgChangeRE[j].push(changeRE[j]);
			}

		}
		lastChangeLabels = changeLabels;
	}
	const medIndex = Math.floor(iterations / 2);
	for(let j = 0; j < lastChangeLabels.length; j++) {
		avgChangeR[j] = avgChangeR[j].sort( (a, b) => a - b)[medIndex];
		avgChangeRE[j] = avgChangeRE[j].sort( (a, b) => a - b)[medIndex];
	}
	return [lastChangeLabels, avgChangeR, avgChangeRE];
}

/* const [strChangeLabels, strChangeR, strChangeRE] = avgTest({maxStringLength: 10000, step: 1000});
const strChart = new ChartHandler(strChangeLabels);
strChart.addChartData("String Length replace", strChangeR);
strChart.addChartData("String Length replaceEach", strChangeRE);
strChart.saveChart("./speedtest/replaceEachStringLength.png"); */

const [repChangeLabels, repChangeR, repChangeRE] = avgTest({maxReplaceLength: 50000, step: 5000});
const repChart = new ChartHandler(repChangeLabels);
repChart.addChartData("Length of Replace Value replace", repChangeR);
repChart.addChartData("Length of Replace Value replaceEach", repChangeRE);
repChart.saveChart("./speedtest/replaceEachReplaceLength.png");

/* const [srcChangeLabels, srcChangeR, srcChangeRE] = avgTest({maxSearchCount: 1000, step: 100});
const srcChart = new ChartHandler(srcChangeLabels);
srcChart.addChartData("# of Search Values replace", srcChangeR);
srcChart.addChartData("# of Search Values replaceEach", srcChangeRE);
srcChart.saveChart("./speedtest/replaceEachSearchCount.png");

const [srlChangeLabels, srlChangeR, srlChangeRE] = avgTest({maxSearchLength: 20000, step: 2000, checkError: false});
const srlChart = new ChartHandler(srlChangeLabels);
srlChart.addChartData("Length of Search Values replace", srlChangeR);
srlChart.addChartData("Length of Search Values replaceEach", srlChangeRE);
srlChart.saveChart("./speedtest/replaceEachSearchLength.png");

const [bsrChangeLabels, bsrChangeR, bsrChangeRE] = avgTest({maxSearchCount: 100, maxSearchLength: 100, step: 10, checkError: false, iterations: 100});
const bsrChart = new ChartHandler(bsrChangeLabels);
bsrChart.addChartData("# of Search Values and Length replace", bsrChangeR);
bsrChart.addChartData("# of Search Values and Length replaceEach", bsrChangeRE);
bsrChart.saveChart("./speedtest/replaceEachBothSearchLengthCount.png"); */