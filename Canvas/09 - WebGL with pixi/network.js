'use strict';

let stage = new PIXI.Container();
let renderer = PIXI.autoDetectRenderer(width, height);
renderer.backgroundColor = 0xFFFFFF;
document.body.appendChild(renderer.view);

let graphCanvas = d3.select('canvas')
	.attr('width', width + 'px')
	.attr('height', height + 'px')
	.node();

let simulation = d3.forceSimulation()
	.force("center", d3.forceCenter(width / 2, height / 2))
	.force("x", d3.forceX(width / 2).strength(0.1))
	.force("y", d3.forceY(height / 2).strength(0.1))
	.force("charge", d3.forceManyBody().strength(-100))
	.force("link", d3.forceLink().strength(0.2).id(d => d.id))
	.alphaTarget(0)
  .alphaDecay(0.05)
  
let transform = d3.zoomIdentity;

let linkStage = new PIXI.Graphics();
stage.addChild(linkStage);

const circleGraphics = new PIXI.Graphics();
circleGraphics.lineStyle(1, 0xFFFFFF);
circleGraphics.beginFill(0x0000FF);
circleGraphics.drawCircle(0, 0, 5);
const circleTexture = renderer.generateTexture(circleGraphics, PIXI.settings.SCALE_MODE, window.devicePixelRatio);

nodes.forEach(node => {
  node.gfx = new PIXI.Sprite(circleTexture)
  stage.addChild(node.gfx);
});


d3.select(graphCanvas)
  .call(d3.drag()
    //.container(renderer.view)
    .subject(e => simulation.find(e.x, e.y))
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended))
  .call(
    d3.zoom().scaleExtent([1 / 10, 8])
      .on("zoom", e => {
        transform = e.transform;
        simulationUpdate();
      }));

simulation
  .nodes(nodes)
  .on('tick', simulationUpdate);

simulation.force('link')
  .links(links);

function simulationUpdate() {

  for(let i = 0; i < n; i++){
    let { x, y, gfx } = nodes[i];
    gfx.position = new PIXI.Point(x, y);
  }

  linkStage.clear();
  linkStage.alpha = 1;
  linkStage.lineStyle(2, 0x999999);

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
