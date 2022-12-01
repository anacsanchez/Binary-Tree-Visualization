export function calcDimensions(arr, ySpacing) {
	let depth = Math.ceil(Math.log2((arr.length - 1) + 2)) - 1;
	return { width: Math.pow(2, depth), height: ySpacing + ySpacing * depth, depth: depth }
}

export function createContainer(id, arr, ySpacing, width, height) {
	const box = calcDimensions(arr, ySpacing);

	const depth = Math.ceil(Math.log2((arr.length - 1) + 2)) - 1 || 1;

	return d3.select(`div#${id}`)
		.append('svg')
		.attr('width', width || box.width * 600 * (.8 / depth) * .75)
		.attr('height', height || box.height)
}
