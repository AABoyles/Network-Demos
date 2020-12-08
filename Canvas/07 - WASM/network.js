'use strict';

let graphCanvas = d3.select('body').append('canvas')
	.attr('width', width + 'px')
	.attr('height', height + 'px')
	.node();
let context = graphCanvas.getContext('2d');

let simulation, simulationUpdate, transform = d3.zoomIdentity;

d3.select(graphCanvas)
	.call(
		d3.drag().subject(dragsubject)
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended))
	.call(
		d3.zoom().scaleExtent([1 / 10, 8])
			.on("zoom", e => {
				transform = e.transform;
				simulationUpdate();
			}));

function dragsubject(e) {
	let x = transform.invertX(e.x),
			y = transform.invertY(e.y);
	let r2 = 25;
	for (let i = 0; i < n; i++) {
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

d3wasm.loaded.then(() => {
	simulation = d3wasm.forceSimulation(nodes, true)
		.force('charge', d3wasm.forceManyBody())
		.force('center', d3wasm.forceCenter(width / 2, height / 2))
		.force('link', d3wasm.forceLink().links(links).id(d => d.id));	

	simulationUpdate = function(){
		if(!context) return;

		simulation.tick();

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

		context.fillStyle = "#0000ff";
		for (let i = 0; i < n; i++) {
			let d = nodes[i];
			context.beginPath();
			context.arc(d.x, d.y, 5, 0, tao, true);
			context.fill();
		}

		context.restore();

		ticks++;
	}

	d3.interval(simulationUpdate, 1);
});
