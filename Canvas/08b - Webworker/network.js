'use strict';

let graphCanvas = d3.select('body').append('canvas')
	.attr('width', width + 'px')
	.attr('height', height + 'px')
	.node();

const canvas = document.querySelector('canvas');
const offscreen = canvas.transferControlToOffscreen();
const worker = new Worker('worker.js');
worker.postMessage({ offscreen, nodes, links, width, height, type: 'setup'}, [offscreen]);

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
	worker.postMessage({ type: 'zoom', transform: e.transform });
}

function dragsubject(e) {
	worker.postMessage({type: 'dragsubject', x: e.x, y: e.y});
}

function dragstarted(e) {
	worker.postMessage({type: 'dragstarted', x: e.x, y: e.y, active: e.active});
}

function dragged(e) {
	worker.postMessage({type: 'dragged', x: e.x, y: e.y});
}

function dragended(e) {
	worker.postMessage({type: 'dragended', active: e.active});
}

worker.onmessage = e => {
	ticks = e.data.ticks;
};