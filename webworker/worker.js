importScripts('https://unpkg.com/d3@6.2.0/dist/d3.min.js');

let force, nodes, links, n, l;

const encoder = new TextEncoder();

self.onmessage = event => {
  let start = Date.now();
  if(event.data){
    nodes = event.data.nodes;
    links = event.data.links;
    n = nodes.length;
    l = links.length;
    force = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-250))
      .force('center', d3.forceCenter(700, 700));
    console.log("Setup time: ", (Date.now() - start).toLocaleString(), "ms");
  } else {
    force.tick();
    console.log("Tick time: ", (Date.now() - start).toLocaleString(), "ms");
  }
  start = Date.now();
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
  console.log("Encode time:", (Date.now() - start).toLocaleString(), "ms");
  postMessage({ graph, start: Date.now() }, [graph]);
};
