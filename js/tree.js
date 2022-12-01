import {getParentIndex, getLeftChildIndex} from "./heap.js";
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
			.attr("x", d => d.cx - (d.value.toString().length * 4))
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

		arr.forEach((num, i) => {
			const depth = Math.ceil(Math.log2(i + 2)) - 1;
			const node = new Node(arr[i], i, depth, null, null, radius);
			const parentNode = i === 0 ? null : this.data[getParentIndex(i)];
			if (i > 0) { //if node is not root
				if (i === getLeftChildIndex(getParentIndex(i))) {
					node.cx = parentNode.cx - (xSpacing / depth);
				}
				else {
					node.cx = parentNode.cx + (xSpacing / depth);
				}
				node.cy = parentNode.cy + ySpacing;
				this.container.append("line").call(addLineAttrs, "black", parentNode.cx, parentNode.cy, node.cx, node.cy);
			} else { //node is root
				node.cx = this.start;
				node.cy = radius;
			}
			this.addNode(node);
			++i;
		})
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

		const midPoint = Math.floor(inputArr.length / 2);
		const root = new Node(inputArr[midPoint], null, 1, this.start, radius, radius);

		const insertTreeNode = (arr, depth, cx) => {
			if (!arr.length) { return; }
			const midIndex = Math.floor(arr.length / 2);
			const node = new Node(arr[midIndex], null, depth, cx, radius + (depth * ySpacing), radius);

			node.left = insertTreeNode(arr.slice(0, midIndex), depth + 1, node.cx - xSpacing / (depth + 1));
			node.right = insertTreeNode(arr.slice(midIndex + 1), depth + 1, node.cx + xSpacing / (depth + 1));

			if (node.left) {
				this.container.append("line").call(addLineAttrs, "black", node.cx, node.cy, node.left.cx, node.left.cy);
			}
			if (node.right) {
				this.container.append("line").call(addLineAttrs, "black", node.cx, node.cy, node.right.cx, node.right.cy);
			}
			this.addNode(node);
			return node;
		}

		root.left = insertTreeNode(inputArr.slice(0, midPoint), 1, this.start - xSpacing);
		root.right = insertTreeNode(inputArr.slice(midPoint + 1), 1, this.start + xSpacing);

		if (root.left) {
			this.container.append("line").call(addLineAttrs, "black", root.cx, root.cy, root.left.cx, root.left.cy);
		}
		if (root.right) {
			this.container.append("line").call(addLineAttrs, "black", root.cx, root.cy, root.right.cx, root.right.cy);
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