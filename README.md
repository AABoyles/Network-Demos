# Network Demos

A collection of Force-directed Graph demonstrations.

I need to render a big network (~10k Nodes, ~10k Links) in Javascript. The simplest case performs pretty poorly (~3fps on my machine). There are a bunch of ways we could improve performance--so this is a collection of those approaches.

In general, these should all possess node dragging and panning/zooming functionality, unless otherwise noted.

Complete Examples:

* [01 - Basic (SVG)](): Approximately the simplest D3 Force Directed Graph with Zooming and Dragging (on SVG).
* [01 - Basic (canvas)](): Approximately the simplest D3 Force Directed Graph with Zooming and Dragging (on Canvas).
* [04 - WebWorker (Offscreen Canvas)](): Using an Offscreen Canvas (on the main thread).
* [05 - WASM (SVG)](): d3-force implemented in WASM.

Incomplete Examples:

* [04 - WebWorker](): 01, but with the Force simulation running in a WebWorker. (Simulation doesn't ever cool down.)
* [05 - Offscreen Canvas in WebWorker](): Node Dragging is broken.
* [06 - WebGL with pixi](): Styling is broken.
* [07 - Partial Updates with requestAnimationFrame](): Not correctly implemented.

Concepts to try:

* [08 - Accelerated with GPUjs](): Just a concept, don't really know how to implement this.
* [10 - Reduced Theta]()
* [11 - Finite Max-distance]()

External Libraries: 

* [Cytoscape]()
* [d3-force-3d]()

Things I want to try but can't find the resources for:

* Use Cytoscape.js Force layouts (CoSE, fCoSE) with D3 as renderer.
* 

To Do:

Refactor tests to adhere to the following schema:

| Index | Strategy              | SVG  | Canvas |
| ----- | --------------------- | ---- | ------ |
| 01    | Basic                 |      |        |
| 02    | Force-Reuse           |      |        |
| 03    | Force-Sample          |      |        |
| 04    | Webworker             |      |        |
| 05    | WASM                  |      |        |
| 06    | WebGL (Pixi)          | (NA) |        |
| 07    | requestAnimationFrame |      |        |
| 08    | GPUjs                 |      |        |
| 09    | Reduced               |      |        |
| 10    | Finite Max-Distance   |      |        |
