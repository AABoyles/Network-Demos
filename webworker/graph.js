let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

let color = d3.scaleOrdinal(d3.schemeCategory10);

let nnodes = 50000;
let nlinks = 50000;
let randomNode = d3.randomInt(nnodes);
let nodes = [...Array(nnodes).keys()].map(i => ({id: i}));
let links = [...Array(nlinks).keys()].map(i => ({id: i, source: i % nnodes, target: randomNode()}));

let link = svg.append("g")
    .attr("class", "links")
  .selectAll("line")
  .data(links)
  .enter().append("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

let node = svg.append("g")
    .attr("class", "nodes")
  .selectAll("g")
  .data(nodes)
  .enter().append("g")

let circles = node.append("circle")
    .attr("r", 5)
    .attr("fill", d => color(d.group))
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

node.append("title")
    .text(d => d.id);

var worker = new Worker("worker.js");

const decoder = new TextDecoder()

worker.onmessage = event => {
  let graph = JSON.parse(decoder.decode(event.data.graph));
  link.data(graph.links)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

  node.data(graph.nodes)
      .attr("transform", d => `translate(${d.x},${d.y})`);

  console.log(`Network updated in: ${Date.now() - event.data.start}ms`);

  worker.postMessage(null)
};

worker.postMessage({
  nodes: nodes,
  links: links
});

function dragstarted(d) {
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  d.fx = null;
  d.fy = null;
}
