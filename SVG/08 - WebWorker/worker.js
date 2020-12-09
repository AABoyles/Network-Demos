importScripts('https://unpkg.com/d3@6.2.0/dist/d3.min.js');

let force, nodes, links, width, length, n, l;

const encoder = new TextEncoder();

self.onmessage = event => {
  let start = Date.now();
  if(event.data.nodes){
    nodes = event.data.nodes;
    links = event.data.links;
    width = event.data.width;
    height = event.data.height;
    n = nodes.length;
    l = links.length;
    force = d3.forceSimulation(nodes)
      .force("center", d3.forceCenter(width/2, height/2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("link", d3.forceLink(links).strength(0.2).id(d => d.id))
      .alphaTarget(0)
      .alphaDecay(0.05)
    force.on('tick', respond);
  }
  if(event.data.alphaTarget){
    force.alphaTarget(event.data.alphaTarget).restart();
  }
};

function respond(){
  let outnodes = new Array(n);
  let outlinks = new Array(l);
  for(let i = 0; i < n; i++){
    let d = nodes[i];
    outnodes[i] = {x: d.x, y: d.y};
  }
  for(let j = 0; j < l; j++){
    let k = links[j];
    outlinks[j] = {
      source: {x: k.source.x, y: k.source.y},
      target: {x: k.target.x, y: k.target.y}
    };
  }
  let graph = encoder.encode(JSON.stringify({nodes: outnodes, links: outlinks})).buffer;
  postMessage({ graph }, [graph]);
}