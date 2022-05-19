import fs from "fs";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

const colors = ["rgb(75, 192, 192)", "rgb(192, 75, 75)", "rgb(192, 75, 192)", "rgb(75, 75, 192)"];

class ChartHandler {

	constructor (labels) {
		this.colori = 0;
		this.chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600, backgroundColour: "white" });
		this.configuration = {
			type: "line",
			data: {
				labels: labels,
				datasets: []
			},
			options: {
				scales: {
					y: {
						ticks: {
							callback: function (value, index, ticks) {
								return value + " ms";
							}
						}
					}
				}
			}
		}
	}

	addChartData (label, data) {
		this.configuration.data.datasets.push({
			label: label,
			data: data,
			fill: false,
			borderColor: colors[this.colori],
			tension: 0.1
		});
		this.colori++;
	}

	async saveChart (filename) {
		const buffer = await this.chartJSNodeCanvas.renderToBuffer(this.configuration);
		fs.writeFileSync(filename, buffer, "base64");
	}

}

export default ChartHandler;