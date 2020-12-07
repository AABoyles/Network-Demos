'use strict';

let svg = d3.select("svg")
	.attr("viewBox", [0, 0, width, height]);

let g = svg.append("g");

let link = g.append("g")
    .attr("class", "links")
    .attr("stroke", "#999")
		.attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

let node = g.append("g")
  .attr("class", "nodes")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .selectAll("circle")
  .data(nodes)
  .join("circle")
    .attr("r", 5)
    .attr("fill", '#0000ff')
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

function dragstarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragended(event) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

svg.call(
	d3.zoom().scaleExtent([1 / 10, 8])
		.on("zoom", e => {
			g.attr("transform", e.transform)
			simulationUpdate();
		}));

let simulation = new Worker("worker.js");
simulation.onmessage = event => {
  let graph = JSON.parse(decoder.decode(event.data.graph));
  
  link.data(graph.links)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

  node.data(graph.nodes)
      .attr("transform", d => `translate(${d.x},${d.y})`);
  
  ticks++;
};

simulation.postMessage({
  nodes: nodes,
  links: links
});