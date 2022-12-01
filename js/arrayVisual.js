import { fillColor, textColor, addHighlight, addTextAttrs } from "./node.js";
import { createContainer } from "./utils.js";

export function ArrayVisual(arr, ySpacing) {
	this.data = arr;
	this.container = null;
	this.create = function (x, y, width, height) {
		this.container = createContainer("array-visual", this.data, ySpacing, this.data.length * 60, 100);
		const arrayData = this.data.map((value, i) => {
			if (i > 0) {
				x += 50
			}
			return {
				x: x,
				y: y,
				width: width,
				height: height,
				color: fillColor,
				value: value,
				index: i
			}
		})

		const elementsArr = this.container.selectAll("rect")
			.data(arrayData)
			.enter()
			.append("rect")
			.on("click", addHighlight);

		d3.select("#array-visual").attr("align","center")

		elementsArr.attr("x", d => d.x)
			.attr("y", d => d.y)
			.attr("width", d => d.width)
			.attr("height", d => d.height)
			.attr("fill", d => d.color)
			.attr("stroke", "black")

		this.container.selectAll("text.rect")
			.data(arrayData)
			.enter()
			.append("text")
			.attr("class", "rect")
			.on("click", addHighlight)
			.attr("x", d => d.x + (d.width / 2) - (d.value.toString().length*4))
			.attr("y", d => d.y + 30)
			.text(d => d.value)
			.call(addTextAttrs, textColor, "sans-serif", "1em")

		this.container.selectAll("text.index")
			.data(arrayData)
			.enter()
			.append("text")
			.attr("class", "index")
			.text((d, i) => `[ ${i} ]`)
			.attr("x", d => d.x + 15)
			.attr("y", d => d.y - 15)
			.call(addTextAttrs, textColor, "sans-serif", "15px")

		return arrayData;
	}
}