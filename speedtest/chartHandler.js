import fs from "fs";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

const width = 800;
const height = 600;
const backgroundColour = "white";
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });
const configuration = {
	type: "line",
	data: {
		datasets: []
	}
}

function addChartLabels (...labels) {
	labels.sort( (a, b) => b.length - a.length );
	configuration.data.labels = labels[0];
}

const colors = ["rgb(75, 192, 192)", "rgb(192, 75, 75)", "rgb(192, 75, 192)", "rgb(75, 75, 192)"];
let colori = 0;

function addChartData (label, data) {
	configuration.data.datasets.push({
		label: label,
		data: data,
		fill: false,
		borderColor: colors[colori],
		tension: 0.1
	});
	colori++;
}

async function saveChart (filename) {
	const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
	fs.writeFileSync(filename, buffer, "base64");
	configuration.data.datasets = [];
}

export { addChartLabels, addChartData, saveChart };