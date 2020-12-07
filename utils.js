
let n = 10000;

let height = window.innerHeight;
let width =  window.innerWidth;

function makeGraph(n){
	let randomNode = () => Math.floor(Math.random()*n)
	return {
		nodes: [...Array(n).keys()].map(i => ({id: i})),
		links: [...Array(n).keys()].map(i => ({id: i, source: i % n, target: randomNode()}))
	}	
}

let {nodes, links} = makeGraph(n);

// Tao: A constant we need.

const tao = Math.PI * 2;

// TextEncoder and TextDecoder: To encoding Transferrables

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Monitor: Gives FPS.

let ticks = 0;
let monitor = d3.select('#monitor');
setInterval(() => { monitor.text(`${ticks} fps`); ticks = 0; }, 1000);


// Scratchpad: Ideas with no implemented usages are below.

function toGraph(nodes, links){
  links = JSON.parse(JSON.stringify(links));
  let n = nodes.length;
  for(let i = links.length; i >= 0; --i){
    let l = links[i];
    for(let j = 0; j < n; j++){
      let d = nodes[j];
      if(l.source == d.id) l.source = d;
      if(l.target == d.id) l.target = d;
    }
  }
  return(links)
}

function toLinkList(graph){
  
}
