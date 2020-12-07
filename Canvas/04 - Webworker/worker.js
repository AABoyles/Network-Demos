importScripts("https://d3js.org/d3.v6.min.js");

let offscreen, nodes, links, width, height, subject, n, simulation;
let transform = d3.zoomIdentity;
const tao = Math.PI * 2;
let ticks = 0;

self.onmessage = function(e) {
  switch (e.data.type) {
    case 'setup': setup(e.data); break;
    case 'zoom': transform = e.data.transform; simulation.alphaTarget(0.3).restart(); break;
    case 'dragsubject': dragsubject(e.data); break;
    case 'dragstarted': dragstarted(e.data); break;
    case 'dragged': dragged(e.data); break;
    case 'dragended': dragended(e.data.active); break;
  }
};

function setup(data){
  offscreen = data.offscreen;
  nodes = data.nodes;
  links = data.links;
  width = data.width;
  height = data.height;
  n = nodes.length;
  let context = offscreen.getContext('2d');

  simulation = d3.forceSimulation()
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(width / 2).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("link", d3.forceLink().strength(0.2).id(d => d.id))
    .alphaTarget(0)
    .alphaDecay(0.05);

  simulation.nodes(nodes).on("tick", () => {
    context.save();

    context.clearRect(0, 0, width, height);
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);

    context.strokeStyle = "rgba(0, 0, 0, 0.2)";
    for (let i = 0; i < n; i++) {
      let d = links[i];
      context.beginPath();
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
      context.stroke();
    }

    context.fillStyle = "rgba(128, 128, 255, 1)";
    for (let i = 0; i < n; i++) {
      let d = nodes[i];
      context.beginPath();
      context.arc(d.x, d.y, 5, 0, tao, true);
      context.fill();
    }

    context.restore();

    ticks++;
  });
  simulation.force("link").links(links);
}

function invertX(x){
  return (transform.x - x)/transform.k;
}

function invertY(y){
  return (transform.y - y)/transform.k;
}

function dragsubject(e){
  let x = invertX(e.x),
      y = invertY(e.y);
  let r2 = 25;
  for (let i = 0; i < n; i++) {
    let node = nodes[i];
    let nx = node.x, ny = node.y;
    let dx = x - nx;
    let dy = y - ny;
    if (dx * dx + dy * dy < r2) {
      subject = node;
      break;
    }
  }
}

function dragstarted(e){
  console.log(e);
  if (!e.active) simulation.alphaTarget(0.3).restart();
	subject.fx = invertX(e.x);
	subject.fy = invertY(e.y);
}

function dragged(e) {
	subject.fx = invertX(e.x);
	subject.fy = invertY(e.y);
}

function dragended(active) {
  if (!active) simulation.alphaTarget(0);
	subject.fx = null;
  subject.fy = null;
}

d3.interval(() => {
  postMessage({ ticks });
  ticks = 0;
}, 1000);