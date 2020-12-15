'use strict';

let graphCanvas = d3.select('body').append('canvas')
	.attr('width', width + 'px')
	.attr('height', height + 'px')
	.node();

const canvas = document.querySelector('canvas');
const offscreen = canvas.transferControlToOffscreen();
const simulation = new Worker('worker.js');
simulation.postMessage({ offscreen, nodes, links, width, height, type: 'setup'}, [offscreen]);

d3.select(canvas)
	.call(
		d3.drag().subject(dragsubject)
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended))
		.call(
			d3.zoom().scaleExtent([1 / 10, 8])
				.on("zoom", zoomed));

function zoomed(e) {
	simulation.postMessage({ type: 'zoom', transform: e.transform });
}

function dragsubject(e) {
	simulation.postMessage({type: 'dragsubject', x: e.x, y: e.y});
}

function dragstarted(e) {
	console.log('drag started');
	simulation.postMessage({type: 'dragstarted', x: e.x, y: e.y, active: e.active});
}

function dragged(e) {
	console.log('dragged');
	simulation.postMessage({type: 'dragged', x: e.x, y: e.y});
}

function dragended(e) {
	console.log('drag ended');
	simulation.postMessage({type: 'dragended', active: e.active});
}

simulation.onmessage = e => {
	ticks = e.data.ticks;
};