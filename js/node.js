export const fillColor = "lightblue";
export const highlightFillColor = "blue";

export const textColor = "black"
export const highlightTextColor = "white"

export function Node(value, index, depth, cx, cy, radius) {
  this.value = value;
  this.index = index;
  this.depth = depth;
  this.radius = radius;
  this.cx = cx;
  this.cy = cy;
  this.left = null;
  this.right = null;
  this.fill = fillColor;
  this.highlighted = false;
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

  d3.selectAll("circle").select(indexMatch).attr("fill", highlightFillColor);
  d3.selectAll("rect").select(indexMatch).attr("fill", highlightFillColor);
  d3.selectAll("text.circle").select(indexMatch).attr("fill", highlightTextColor);
  d3.selectAll("text.rect").select(indexMatch).attr("fill", highlightTextColor);
}

export function removeHighlight() {
  d3.selectAll("circle").attr("fill", fillColor)
  d3.selectAll("rect").attr("fill", fillColor)
  d3.selectAll("text.circle").attr("fill", textColor)
  d3.selectAll("text.rect").attr("fill", textColor);
}

