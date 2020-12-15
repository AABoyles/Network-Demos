"use strict";

importScripts("https://d3js.org/d3.v6.min.js");

let offscreen, context, nodes, links, width, height, subject, n, simulation;
let transform = d3.zoomIdentity;
const tao = Math.PI * 2;
const r = 5, r2 = r*r;
let ticks = 0;

self.onmessage = function(e) {
  let ed = e.data;
  switch (ed.type) {
    case 'setup': setup(ed); break;
    case 'zoom': transform = d3.zoomIdentity.translate(ed.transform.x, ed.transform.y).scale(ed.transform.k); draw(); break;
    case 'dragsubject': dragsubject(ed); break;
    case 'dragstarted': dragstarted(ed); break;
    case 'dragged': dragged(ed); break;
    case 'dragended': dragended(ed.active); break;
  }
};

function setup(data){
  offscreen = data.offscreen;
  nodes = data.nodes;
  links = data.links;
  width = data.width;
  height = data.height;
  n = nodes.length;
  context = offscreen.getContext('2d');

  simulation = d3.forceSimulation()
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(width / 2).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("link", d3.forceLink().strength(0.2).id(d => d.id))
    .alphaTarget(0)
    .alphaDecay(0.05);

  simulation.nodes(nodes).on("tick", () => {
    draw();
    ticks++;
  });
  simulation.force("link").links(links);
}

function draw(){
  context.save();

  context.clearRect(0, 0, width, height);
  context.translate(transform.x, transform.y);
  context.scale(transform.k, transform.k);

  context.strokeStyle = "rgba(0, 0, 0, 0.2)";
  for (let i = 0; i < n; i++) {
    let {source, target} = links[i];
    context.beginPath();
    context.moveTo(source.x, source.y);
    context.lineTo(target.x, target.y);
    context.stroke();
  }

  context.fillStyle = "#0000ff";
  for (let i = 0; i < n; i++) {
    let {x, y} = nodes[i];
    context.beginPath();
    context.arc(x, y, 5, 0, tao, true);
    context.fill();
  }

  context.restore();
}

function dragsubject(e){
  subject = simulation.find(transform.invertX(e.x), transform.invertY(e.y), 25);
  console.log(subject);
}

function dragstarted(e){
  if (!e.active) simulation.alphaTarget(0.3).restart();
	subject.fx = transform.invertX(e.x);
  subject.fy = transform.invertY(e.y);
  console.log('started');
}

function dragged(e) {
	subject.fx = transform.invertX(e.x);
  subject.fy = transform.invertY(e.y);
  console.log('dragged');
}

function dragended(active) {
  if (!active) simulation.alphaTarget(0);
	subject.fx = null;
  subject.fy = null;
  console.log('dragged');
}

d3.interval(() => {
  postMessage({ ticks });
  ticks = 0;
}, 1000);