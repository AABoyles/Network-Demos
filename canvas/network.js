//(function(){
'use strict';
const tao = 2 * Math.PI;

let radius = 5;

let nnodes = 10000;
let nedges = 10000;
let randomNode = d3.randomInt(nnodes);
let nodes = [...Array(nnodes).keys()].map(i => ({id: i}));
let edges = [...Array(nedges).keys()].map(i => ({id: i, source: i % nnodes, target: randomNode()}));

let height = window.innerHeight;
let width =  window.innerWidth;

let graphCanvas = d3.select('body').append('canvas')
	.attr('width', width + 'px')
	.attr('height', height + 'px')
	.node();
let onscreenContext = graphCanvas.getContext('bitmaprenderer');

let offscreen = new OffscreenCanvas(width, height);
let context = offscreen.getContext('2d');

let simulation = d3.forceSimulation()
	.force("center", d3.forceCenter(width / 2, height / 2))
	.force("x", d3.forceX(width / 2).strength(0.1))
	.force("y", d3.forceY(height / 2).strength(0.1))
	.force("charge", d3.forceManyBodyReuse().strength(-100))
	.force("link", d3.forceLink().strength(0.2).id(d => d.id))
	.alphaTarget(0)
	.alphaDecay(0.05)
	
let transform = d3.zoomIdentity;

function zoomed(e) {
	transform = e.transform;
	simulationUpdate();
}

d3.select(graphCanvas)
	.call(
		d3.drag().subject(dragsubject)
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end",dragended))
	.call(
		d3.zoom().scaleExtent([1 / 10, 8])
			.on("zoom", zoomed))

function dragsubject(e) {
	let x = transform.invertX(e.x),
			y = transform.invertY(e.y);
	let r2 = radius * radius;
	for (let i = 0; i < nnodes; i++) {
		let node = nodes[i];
		let nx = node.x, ny = node.y;
		let dx = x - nx;
		let dy = y - ny;
		if (dx * dx + dy * dy < r2) {
			node.x =  transform.applyX(nx);
			node.y = transform.applyY(ny);
			return node;
		}
	}
}

function dragstarted(e) {
	if (!e.active) simulation.alphaTarget(0.3).restart();
	e.subject.fx = transform.invertX(e.x);
	e.subject.fy = transform.invertY(e.y);
}

function dragged(e) {
	e.subject.fx = transform.invertX(e.x);
	e.subject.fy = transform.invertY(e.y);
}

function dragended(e) {
	if (!e.active) simulation.alphaTarget(0);
	e.subject.fx = null;
	e.subject.fy = null;
}

simulation.nodes(nodes).on("tick", simulationUpdate);
simulation.force("link").links(edges);

let f = 0;

function simulationUpdate(){
	if(!context) return;
	context.save();

	context.clearRect(0, 0, width, height);
	context.translate(transform.x, transform.y);
	context.scale(transform.k, transform.k);

	context.strokeStyle = "rgba(0, 0, 0, 0.2)";
	for (let i = 0; i < nedges; i++) {
		let d = edges[i];
		context.beginPath();
		context.moveTo(d.source.x, d.source.y);
		context.lineTo(d.target.x, d.target.y);
		context.stroke();
	}

	context.fillStyle = "rgba(128, 128, 255, 1)";
	for (let i = 0; i < nnodes; i++) {
		let d = nodes[i];
		context.beginPath();
		context.arc(d.x, d.y, radius, 0, tao, true);
		context.fill();
	}

	context.restore();

	onscreenContext.transferFromImageBitmap(offscreen.transferToImageBitmap());

	f++;
}

setInterval(() => { d3.select('#monitor').text(`${f} fps`); f = 0; }, 1000)

//})();