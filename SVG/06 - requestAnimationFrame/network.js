'use strict';

let svg = d3.select("svg")
	.attr("viewBox", [0, 0, width, height]);

let g = svg.append("g");

let link = g.append("g")
    .attr("class", "links")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

let node = g.append("g")
  .attr("class", "nodes")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .selectAll("circle")
  .data(nodes)
  .join("circle")
    .attr("r", 5)
    .attr("fill", "#0000ff")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

function dragstarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragended(event) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

svg.call(
  d3.zoom().scaleExtent([1 / 10, 8])
    .on("zoom", e => {
      g.attr("transform", e.transform)
      moveItems();
    }));

let simulation = d3.forceSimulation()
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("x", d3.forceX(width / 2).strength(0.1))
  .force("y", d3.forceY(height / 2).strength(0.1))
  .force("charge", d3.forceManyBody().strength(-100))
  .force("link", d3.forceLink().strength(0.2).id(d => d.id))
  .alphaTarget(0)
  .alphaDecay(0.05);

let moveItems = (function(){
  let todoNode = 0;
  let todoLink = 0;
  let MAX_NODES = n/5;
  let MAX_LINKS = MAX_NODES;

  let restart = false;

  function moveSomeNodes(){
    let goal = Math.min(todoNode+MAX_NODES, n);

    for(let i = todoNode; i < goal; i++){
      let n = node._groups[0][i];
      n.setAttribute('transform', `translate(${n.__data__.x}, ${n.__data__.y})`);
    }

    todoNode = goal;
    requestAnimationFrame(moveSome)
  }

  function moveSomeLinks(){
    let l;
    let goal = Math.min(todoLink+MAX_LINKS, n);

    for(let i=todoLink; i < goal; i++){
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
    if(todoNode < n){
      moveSomeNodes();
    } else if(todoLink < n){
      moveSomeLinks();
    } else if(restart){
      restart = false;
      todoNode = 0;
      todoLink = 0;
      requestAnimationFrame(moveSome);
    }
  }

  return function moveItems(){
    ticks++;
    if(!restart){
      restart = true;
      requestAnimationFrame(moveSome);
    }
  };
})();

simulation.nodes(nodes).on("tick", moveItems);
simulation.force("link").links(links);
