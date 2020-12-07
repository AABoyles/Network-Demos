# Network Demos

A collection of Force-directed Graph demonstrations.

I need to render a big network (~10k Nodes, ~10k Links) in Javascript. The simplest case performs pretty poorly (~3fps on my machine). There are a bunch of ways we could improve performance--so this is a collection of those approaches. If you find yourself in a similar situation (needing to render a huge interactive network in the browser), perhaps these can save you some time.

In general, these should all possess node dragging and panning/zooming functionality, though it's buggy in many cases. I'll try to note the implementation issues in the documentation below.

The numbers given in the table below show the median observed FPS for that graph type (higher is better). I don't have a complex benchmarking architecture, just [a count of the number of ticks that resets every second](https://github.com/AABoyles/Network-Demos/blob/main/utils.js#L26), visible on the bottom-right corner of every visualization.

| Index | Strategy              | SVG  | Canvas |
| ----- | --------------------- | ---- | ------ |
| 01    | [Basic](#01---Basic)  | [3](https://aaboyles.github.io/Network-Demos/SVG/01%20-%20Basic/) | [14](https://aaboyles.github.io/Network-Demos/Canvas/01%20-%20Basic/) |
| 02    | [Increased Theta](#02---Increased-Theta) | [4](https://aaboyles.github.io/Network-Demos/SVG/02%20-%20Increased%20Theta/) | [29](https://aaboyles.github.io/Network-Demos/Canvas/02%20-%20Reduced%20Theta/) |
| 03    | Finite Max-Distance   |      |        |
| 04    | Force-Reuse           |      |        |
| 05    | Force-Sample          |      |        |
| 06    | requestAnimationFrame |      |        |
| 07    | WASM                  |      |        |
| 08    | Webworker             |      |        |
| 09    | WebGL (Pixi)          | (NA) |        |
| 10    | GPUjs                 |      |        |

(Note that the indices are essentially arbitrary, and just for managing ordering in Finder/File Explorer.)

There are a lot of variables that go into making a visualization like these smooth. Some notable ones that I'm simply taking as constant on my own machine are: the machine (Apple Macbook Pro 2020 w/ i7, 32GB Ram), Browser (Chrome 86), number of nodes in the network (10,000) number of links in the network (10,000), and [*lots* of configurations in the network](https://github.com/d3/d3-force#forces). I can't possibly test all of them, so what ends up being best for my use case may not be best for yours. Basically, take the above numbers as an approximation of the order of efficiency of the associated approach when this document was last updated (presently December 2020).

### 01 - Basic

[[SVG]](https://aaboyles.github.io/Network-Demos/SVG/01%20-%20Basic/) [[Canvas]](https://aaboyles.github.io/Network-Demos/Canvas/01%20-%20Basic/)

Approximately the simplest D3 Force Directed Graph with Zooming and Dragging. Nothing has been attempted to optimize these, making them optimal boilerplates for the others.

Here we see the first stark contrast between SVG and Canvas Performance. Canvas outperforms SVG by a factor of between 4x and 5x.

### 02 - Increased Theta

[[SVG]](https://aaboyles.github.io/Network-Demos/SVG/02%20-%20Increased%20Theta/) [[Canvas]](https://aaboyles.github.io/Network-Demos/Canvas/02%20-%20Reduced%20Theta/)

d3-force leverages quadtrees and the Barnes-Hut approximation to simplify node trajectory computations. Essentially, when a bunch of nodes are far away from a node, d3 just treats all those far away nodes as one big node located in the middle, meaning it only needs to compute the effect of the forces once, rather than as many times as there are far-away nodes. But the definition of "far away" is related to this theta parameter. Set theta small, and you make "far away" mean farther away. Increase it and we can perform the approximation more aggressively, meaning the browser can pump up the frame rate.

One problem with this approach is that once the Network reaches a reasonably stable equilibrium, this causes a minor-but-noticeable juddering effect on nodes that are otherwise well-placed.

### 03 - Finite Max-Distance

[[SVG]](https://aaboyles.github.io/Network-Demos/SVG/03%20-%20Finite%20Distance/) [[Canvas]](https://aaboyles.github.io/Network-Demos/Canvas/03%20-%20Finite%20Distance/)

This one turn out to be obviously non-useful, as it tends to self-organizes into a pattern of overlapping circles of radius equal to the given maximum value. In short: ***always leave the maxDistance set to Infinity.***

### 04 - Force-Reuse

### 05 - Force-Sample

### 06 - requestAnimationFrame

#### 06 - Known Bugs

* Basically, this one just isn't correctly implemented yet.

### 07 - WASM

Using a version of d3-force implemented in WASM.

### 08 - WebWorker

with the Force simulation running in a WebWorker.

The Canvas version leverages an Offscreen Canvas.

#### 08 - Known Bugs

* Simulation doesn't ever cool down.
* Node Dragging is broken in the canvas version.

### 09 - WebGL (Pixi)

#### 09 - Known Bugs

* The styling is broken.

### 10 - GPUjs

Just a concept for now.

## Conclusion: Whatever you do, do it on a Canvas

## Addendum: External Libraries

### Cytoscape

[Cytoscape]()

### d3-force-3d

[d3-force-3d]()

## Things I want to try but can't find the resources for:

* Use Cytoscape.js Force layouts (CoSE, fCoSE) with D3 as renderer.
