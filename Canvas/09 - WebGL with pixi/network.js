let stage = new PIXI.Container();
let renderer = PIXI.autoDetectRenderer(width, height,
  {antialias: !0, transparent: !0, resolution: 1});

document.body.appendChild(renderer.view);

let simulation = d3.forceSimulation()
	.force("center", d3.forceCenter(width / 2, height / 2))
	.force("x", d3.forceX(width / 2).strength(0.1))
	.force("y", d3.forceY(height / 2).strength(0.1))
	.force("charge", d3.forceManyBody().strength(-100))
	.force("link", d3.forceLink().strength(0.2).id(d => d.id))
	.alphaTarget(0)
	.alphaDecay(0.05)

let linkStage = new PIXI.Graphics();
stage.addChild(linkStage);

nodes.forEach(node => {
  node.gfx = new PIXI.Graphics();
  node.gfx.lineStyle(1, 0xFFFFFF);
  node.gfx.beginFill(0x0000FF);
  node.gfx.drawCircle(0, 0, 5);
  stage.addChild(node.gfx);
});

d3.select(renderer.view)
  .call(d3.drag()
    .container(renderer.view)
    .subject(e => simulation.find(e.x, e.y))
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended));

simulation
  .nodes(nodes)
  .on('tick', ticked);

simulation.force('link')
  .links(links);

function ticked() {

  for(let i = 0; i < n; i++){
    let { x, y, gfx } = nodes[i];
    gfx.position = new PIXI.Point(x, y);
  }

  linkStage.clear();
  linkStage.alpha = 1;

  for(let i = 0; i < n; i++){
    let { source, target } = links[i];
    linkStage.moveTo(source.x, source.y);
    linkStage.lineTo(target.x, target.y);
  }

  linkStage.endFill();

  renderer.render(stage);

  ticks++;

}

function dragstarted(e) {
  if (!e.active) simulation.alphaTarget(0.3).restart();
  let s = e.subject;
  s.fx = s.x;
  s.fy = s.y;
}

function dragged(e) {
  let s = e.subject;
  s.fx = e.x;
  s.fy = e.y;
}

function dragended(e) {
  if (!e.active) simulation.alphaTarget(0);
  let s = e.subject;
  s.fx = null;
  s.fy = null;
}
