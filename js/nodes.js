import { leftChild, parent } from "./heap.js";

export const regFill = "lightblue";
export const highlightFill = "blue";

export const regFillText = "black"
export const highlightFillText = "white"

const xSpacing = 200;
const ySpacing = 100;
const radius = 35;

export function Node(value, index, depth, cx, cy) {
  this.value = value;
  this.index = index;
  this.depth = depth;
  this.radius = radius;
  this.cx = cx;
  this.cy = cy;
  this.left = null;
  this.right = null;
  this.fill = regFill;
  this.highlighted = false;
}

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
    .call(addTextAttrs, regFillText, "sans-serif", "1em")

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

  this.createBinaryTree = function(arr) {
    this.container = createContainer("binary-tree", arr);
    this.start = this.container.attr("width") / 2;

    let i = 0;
    let node = {};

    while (i < arr.length) {
      let depth = Math.ceil(Math.log2(i + 2)) - 1;

      node = new Node(arr[i], i, depth);

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

  this.createBinarySearchTree = function(inputArr) {
    this.container = createContainer("binary-tree", inputArr);
    this.start = this.container.attr("width") / 2;

    let midPoint = Math.floor(inputArr.length / 2);
    let root = new Node(inputArr[midPoint], null, 1, this.start, radius);

    const insertTreeNode = (arr, depth, cx) => {
      if (!arr.length) { return; }
      let mid = Math.floor(arr.length / 2);
      let node = new Node(arr[mid], null, depth, cx , radius + (depth * ySpacing));
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

export function addCircleAttrs(selection) {
  selection
    .attr("cx", function(c) { return c.cx })
    .attr("cy", 0)
    .attr("r", function(c) { return c.radius })
    .attr("fill", function(c) { return c.fill })
    .transition()
    .duration(100)
    .attr("cy", function(c) { return c.cy })
}

export function addTextAttrs(selection, fill, fontFamily, fontSize) {
  selection
    .attr("fill", fill)
    .attr("font-family", fontFamily)
    .attr("font-size", fontSize);
}

export function addLineAttrs(selection, stroke, x1, y1, x2, y2) {
  selection
  .style("stroke", stroke)
  .attr("x1", x1)
  .attr("y1", 0)
  .attr("x2", x2)
  .attr("y2", 0)
  .transition()
  .duration(100)
  .attr("y1", y1)
  .attr("y2", y2)
}

export function addHighlight(evt, node) {
  removeHighlight();
  function indexMatch(d, i) {return i === node.index ? this : null}

  d3.selectAll("circle").select(indexMatch).attr("fill", highlightFill);
  d3.selectAll("rect").select(indexMatch).attr("fill", highlightFill);
  d3.selectAll("text.circle").select(indexMatch).attr("fill", highlightFillText);
  d3.selectAll("text.rect").select(indexMatch).attr("fill", highlightFillText);
}

export function removeHighlight() {
  d3.selectAll("circle").attr("fill", regFill)
  d3.selectAll("rect").attr("fill", regFill)
  d3.selectAll("text.circle").attr("fill", regFillText)
  d3.selectAll("text.rect").attr("fill", regFillText);
}

export function calcDimensions(arr) {
  let depth = Math.ceil(Math.log2((arr.length - 1) + 2)) - 1;
  return { width: Math.pow(2, depth), height: ySpacing + ySpacing * depth, depth: depth }
}

export function createContainer(id, arr, width, height) {
  let box = calcDimensions(arr);

  let depth = Math.ceil(Math.log2((arr.length - 1) + 2)) - 1 || 1;

  return d3.select(`div#${id}`)
    .append('svg')
    .attr('width', width || box.width * 600 * (.8 / depth) * .75)
    .attr('height', height || box.height)
}
