let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

let color = d3.scaleOrdinal(d3.schemeCategory10);

let nnodes = 10000;
let nlinks = 10000;
let randomNode = d3.randomInt(nnodes);
let nodes = [...Array(nnodes).keys()].map(i => ({id: i}));
let links = [...Array(nlinks).keys()].map(i => ({id: i, source: i % nnodes, target: randomNode()}));

let link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(links)
  .enter().append("line")
  .attr("stroke-width", d => Math.sqrt(d.value));

let node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("g")
  .data(nodes)
  .enter().append("g")

let circles = node.append("circle")
  .attr("r", 5)
  .attr("fill", d => color(d.group))
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

node.append("title")
  .text(d => d.id);

function dragstarted(d) {
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  d.fx = null;
  d.fy = null;
}


let moveItems = (function(){
  let todoNode = 0;
  let todoLink = 0;
  let MAX_NODES = nnodes;
  let MAX_LINKS = MAX_NODES/2;

  let restart = false;

  function moveSomeNodes(){
    let goal = Math.min(todoNode+MAX_NODES, nnodes);

    for(let i = todoNode; i < goal; i++){
      let n = node._groups[0][i];
      n.setAttribute('x', n.__data__.x);
      n.setAttribute('y', n.__data__.y);
    }

    todoNode = goal;
    requestAnimationFrame(moveSome)
  }

  function moveSomeLinks(){
    let l;
    let goal = Math.min(todoLink+MAX_LINKS, nlinks);

    for(let i=todoLink ; i < goal ; i++){
      l = link._groups[0][i];
      l.setAttribute('x1', l.__data__.source.x);
      l.setAttribute('y1', l.__data__.source.y);
      l.setAttribute('x2', l.__data__.target.x);
      l.setAttribute('y2', l.__data__.target.y);
    }

    todoLink = goal;
    requestAnimationFrame(moveSome)
  }

  function moveSome(){
    if(todoNode < nnodes) // some more nodes to do
    moveSomeNodes()
    else if(todoLink < nlinks) // some more links to do
    moveSomeLinks()
    else if(restart){
      restart = false;
      todoNode = 0;
      todoLink = 0;
      requestAnimationFrame(moveSome);
    }
  }

  return function moveItems(){
    if(!restart){
      restart = true;
      requestAnimationFrame(moveSome);
    }
  };

})();

force = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id))
  .force('charge', d3.forceManyBody().strength(-250))
  .force('center', d3.forceCenter());

force.on('tick', moveItems);
