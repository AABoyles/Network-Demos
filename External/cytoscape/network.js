'use strict';

var cy = window.cy = cytoscape({
	container: document.getElementById('cy'),

	ready: function(){
		this.nodes().forEach(node => {
			node.css("width", 5);
			node.css("height", 5);
		});
		this.layout({name: 'fcose'}).run();
	},

	style: [
		{
			selector: 'node',
			style: {
				'background-color': '#0000ff'
			}
		},

		{
			selector: 'edge',
			style: {
				'width': 3,
				'line-color': '#ad1a66'
			}
		}
	],

	elements: [
		...nodes.map(d => ({
			data: {
				id: d.id,
				position: {
					x: Math.random() * width,
					y: Math.random() * height
				},
				group: "node"
			}
		})),
		...links.map(l => ({
			data: {
				id: l.id+10000+'',
				source: l.source+'',
				target: l.target+'',
				group: "edge"
			}
		}))
	]
});