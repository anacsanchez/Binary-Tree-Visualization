import { leftChild, parent } from "./heap.js";
import { Node, addCircleAttrs, addHighlight, addLineAttrs, addTextAttrs, textColor } from "./node.js";
import { createContainer } from "./utils.js";

export function Tree() {
	this.nodes = [];
	this.data = [];
	this.text = [];
	this.container = null;
	this.start = null;

	this.addNode = function(node) {
		this.data.push(node);
		this.text = this.container.selectAll("text.circle")
			.data(this.data)
			.enter()
			.append("text")
			.attr("class", "circle")
			.attr("x", d => d.cx - (d.value.toString().length*4))
			.attr("y", 0)
			.text(d => d.value)
			.transition()
			.duration(100)
			.attr("y", d => d.cy + 5)
			.call(addTextAttrs, textColor, "sans-serif", "1em")

		this.nodes = this.container.selectAll("circle")
			.data(this.data)
			.enter()
			.append("circle")
	}

	this.updateNodes = function() {
		this.nodes = this.container.selectAll("circle")
			.data(this.data)
			.enter()
			.append("circle")
	}

	this.swapNodeData = function(a, b) {
		let temp = this.data[a];
		this.data[a] = this.data[b];
		this.data[b] = temp;
	}

	this.findNode = function(index) {
		return this.nodes.filter((d) => d.index === index)
	}

	this.findText = function(index) {
		return this.text.filter((d) => d.index === index)
	}

	this.removeNode = function(index) {
		this.findNode(index).remove();
		this.findText(index).remove();

		this.data = this.data.filter((e, i) => { return i !== index})
		this.text = this.text.filter((e, i) => { return i !== index})

		this.nodes = this.container.selectAll("circle")
			.data(this.data)
			.exit().remove()
	}

	this.createBinaryTree = function(arr, radius, xSpacing, ySpacing) {
		this.container = createContainer("binary-tree", arr, ySpacing);
		this.start = this.container.attr("width") / 2;

		let i = 0;
		let node = {};

		while (i < arr.length) {
			let depth = Math.ceil(Math.log2(i + 2)) - 1;

			node = new Node(arr[i], i, depth);
			node.radius = radius;

			if (i === 0) {
				node.cx = this.start;
				node.cy = radius;
			}
			else {
				if (i === leftChild(parent(i))) {
					node.cx = this.data[parent(i)].cx - xSpacing/depth;
				}
				else {
					node.cx = this.data[parent(i)].cx + xSpacing/depth;
				}
				node.cy = this.data[parent(i)].cy + ySpacing;
				this.container.append("line").call(addLineAttrs, "black", this.data[parent(i)].cx, this.data[parent(i)].cy, node.cx, node.cy);
			}
			this.addNode(node);
			++i;
		}
		this.nodes = this.container.selectAll("circle")
			.raise()
			.on("click", addHighlight);
		this.text = this.container.selectAll("text.circle")
			.raise()
			.on("click", addHighlight);
		this.nodes.call(addCircleAttrs);
	}

	this.createBinarySearchTree = function(inputArr, radius, xSpacing, ySpacing) {
		this.container = createContainer("binary-tree", inputArr, ySpacing);
		this.start = this.container.attr("width") / 2;

		let midPoint = Math.floor(inputArr.length / 2);
		let root = new Node(inputArr[midPoint], null, 1, this.start, radius, radius);

		const insertTreeNode = (arr, depth, cx) => {
			if (!arr.length) { return; }
			let mid = Math.floor(arr.length / 2);
			let node = new Node(arr[mid], null, depth, cx , radius + (depth * ySpacing), radius);
			let nextDepth = depth + 1;

			node.left = insertTreeNode(arr.slice(0, mid), nextDepth, cx - xSpacing/nextDepth);
			node.right = insertTreeNode(arr.slice(mid + 1), nextDepth, cx + xSpacing/nextDepth);

			if (arr.slice(0, mid).length) {
				this.container.append("line").call(addLineAttrs, "black", cx, radius+(depth * ySpacing), cx - xSpacing/nextDepth, radius + nextDepth * ySpacing);
			}
			if (arr.slice(mid + 1).length) {
				this.container.append("line").call(addLineAttrs, "black", cx, radius+(depth * ySpacing), cx + xSpacing/nextDepth, radius + nextDepth * ySpacing);
			}

			this.addNode(node)
			return node;
		}

		root.left = insertTreeNode(inputArr.slice(0, midPoint), 1, this.start - xSpacing);
		root.right = insertTreeNode(inputArr.slice(midPoint + 1), 1, this.start + xSpacing);

		if (inputArr.slice(0, midPoint).length) {
			this.container.append("line").call(addLineAttrs, "black", this.start, radius, this.start - xSpacing, radius + ySpacing);
		}
		if (inputArr.slice(midPoint + 1).length) {
			this.container.append("line").call(addLineAttrs, "black", this.start, radius, this.start + xSpacing, radius + ySpacing);
		}
		this.addNode(root);

		this.nodes = this.container.selectAll("circle")
			.raise();

		this.text = this.container.selectAll("text.circle")
			.raise();

		this.nodes.call(addCircleAttrs);
	}

	this.size = function() {
		return d3.selectAll("circle").nodes().length;
	}
}