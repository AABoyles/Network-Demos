# Network Demos

A collection of Force-directed Graph demonstrations.

I need to render a big network (~10k Nodes, ~10k Links) in Javascript. The simplest case performs pretty poorly (~3fps on my machine). There are a bunch of ways we could improve performance--so this is a collection of those approaches. If you find yourself in a similar situation (needing to render a huge interactive network in the browser), perhaps these can save you some time.

In general, these should all possess node dragging and panning/zooming functionality, though it's buggy in many cases. I'll try to note the implementation issues in the documentation below.

I don't have a complex benchmarking architecture, just [a count of the number of ticks that resets every second](https://github.com/AABoyles/Network-Demos/blob/main/utils.js#L26), visible on the bottom-right corner of every visualization. The numbers given in the table below show the median observed FPS for that graph type **(higher is better)**.

| Index | Strategy              | SVG  | Canvas |
| ----- | --------------------- | ---- | ------ |
| 01    | [Basic](#01---basic)  | [3](https://aaboyles.github.io/Network-Demos/SVG/01%20-%20Basic/) | [14](https://aaboyles.github.io/Network-Demos/Canvas/01%20-%20Basic/) |
| 02    | [Increased Theta](#02---increased-theta) | [4](https://aaboyles.github.io/Network-Demos/SVG/02%20-%20Increased%20Theta/) | [29](https://aaboyles.github.io/Network-Demos/Canvas/02%20-%20Increased%20Theta/) |
| 03    | [Finite Max-Distance](#03---finite-max-distance) | [3](https://aaboyles.github.io/Network-Demos/SVG/03%20-%20Finite%20Distance/) | [10](https://aaboyles.github.io/Network-Demos/SVG/03%20-%20Finite%20Distance/) |
| 04    | [Force-Reuse](#04---force-reuse) | [4](https://aaboyles.github.io/Network-Demos/SVG/04%20-%20Force-Reuse/) | [15](https://aaboyles.github.io/Network-Demos/Canvas/04%20-%20Force-Reuse/) |
| 05    | [Force-Sampled](#05---force-sampled) | [4](https://aaboyles.github.io/Network-Demos/SVG/05%20-%20Force-Sampled/) | [24](https://aaboyles.github.io/Network-Demos/SVG/05%20-%20Force-Sampled/) |
| 06    | [requestAnimationFrame](#06---requestanimationframe) |      |        |
| 07    | [WASM](#07---wasm) |      |        |
| 08    | [Webworker](#08---webworker) |      |        |
| 09    | [WebGL (Pixi)](#09---webgl-(pixi)) | (NA) | [13](https://aaboyles.github.io/Network-Demos/Canvas/09%20-%20WebGL%20with%20pixi/) |
| 10    | [GPUjs](#10---gpujs) |      |        |

(Note that the indices are essentially arbitrary, and just for managing ordering in Finder/File Explorer.)

There are a lot of variables that go into making a visualization like these smooth. Some notable ones that I'm simply taking as constant on my own machine are: the machine (Apple Macbook Pro 2020 w/ i7, 32GB Ram), Browser (Chrome 86), number of nodes in the network (10,000) number of links in the network (10,000), and [*lots* of configurations in the network](https://github.com/d3/d3-force#forces). I can't possibly test all of them, so what ends up being best for my use case may not be best for yours. Basically, take the above numbers as an approximation of the order of efficiency of the associated approach when this document was last updated (presently December 2020).

### 01 - Basic

[SVG](https://aaboyles.github.io/Network-Demos/SVG/01%20-%20Basic/) | [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/01%20-%20Basic/)

Approximately the simplest D3 Force Directed Graph with Zooming and Dragging. Nothing has been attempted to optimize these, making them optimal boilerplates for the others.

Here we see the first stark contrast between SVG and Canvas Performance. Canvas outperforms SVG by a factor of between 4x and 5x, though the canvas version is still unacceptably choppy.

### 02 - Increased Theta

[SVG](https://aaboyles.github.io/Network-Demos/SVG/02%20-%20Increased%20Theta/) | [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/02%20-%20Increased%20Theta/)

[d3-force](https://github.com/d3/d3-force) leverages [quadtrees](https://en.wikipedia.org/wiki/Quadtree) and the [Barnes-Hut approximation](https://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation) to simplify node trajectory computations. Essentially, when a bunch of nodes are far away from a node, d3 just treats all those far away nodes as one big heavy node located in the middle, meaning it only needs to compute the effect of the forces once, rather than as many times as there are far-away nodes. But the definition of "far away" is related to this theta parameter. Set theta small, and you make "far away" mean farther away. Increase it and we can perform the approximation more aggressively, meaning the browser can pump up the frame rate.

One huge upside to this approach it that it appears to more quickly collect the network into a meaningful agglomeration of distinct clusters (i.e. it spends a lot less time looking like a hairball). However, it comes with one problem as well: once the Network reaches a reasonably stable equilibrium, this approach exhibit a minor-but-noticeable juddering effect on nodes that are otherwise well-placed. For most applications, this is probably an acceptable tradeoff.

### 03 - Finite Max-Distance

[SVG](https://aaboyles.github.io/Network-Demos/SVG/03%20-%20Finite%20Distance/) | [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/03%20-%20Finite%20Distance/)

In the description of [02 - Increased Theta](#02---Increased-Theta), I provide a brief non-technical description of the Barnes-Hut approximation algorithm leveraged by D3-Force to make real-time force-directed layouts possible. In addition to setting a threshold for consolidating nodes (theta), you can set a threshold for evaluating if a charge or gravitational tug should affect a node at all. This is the maxDistance threshold. By default, it's Infinite--that is, there's no distance at which one node will no longer affect the trajectory of another. By setting this value lower, we can reduce the computational burden of evaluating these relationships.

Unfortunately, this one turn out to be obviously non-useful in multiple respects. First and foremost, it doesn't provide a meaningful improvement in performance for our class of graphs. Second, it tends to self-organizes into a pattern of overlapping circles of radius equal to the given maximum value. While beautiful and rather interesting, these patterns hide the analytical utility of the network structure. Accordingly I recommend you should ***always leave the maxDistance set to Infinity.***

### 04 - Force-Reuse

[SVG](https://aaboyles.github.io/Network-Demos/SVG/04%20-%20Force-Reuse/) | [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/04%20-%20Force-Reuse/)

Robert Gove of TwoSix Labs produced [an alternative version of d3-forceManyBody called d3-force-reuse](https://github.com/twosixlabs/d3-force-reuse) which purports to [improve the performance of the base d3 implementation by recomputing the quadtree only every 13 ticks](https://www.twosixlabs.com/faster-force-directed-graph-layouts-by-reusing-force-approximations/), instead of on every tick. (Read [the paper](https://osf.io/wgzn5/) for technical details.)

Unfortunately, for the class of graphs I'm evaluating here, performance gains from this strategy were minimal. I believe this may be an effective approach for other graph types, but I can't definitively make this claim based on these data.

### 05 - Force-Sampled

[SVG](https://aaboyles.github.io/Network-Demos/SVG/05%20-%20Force-Sampled/) | [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/05%20-%20Force-Sampled/)

In addition to [Force-Reuse (see above)](#04---Force-Reuse), Robert Gove of TwoSix Labs produced [a second d3 forceManyBody alternative which achieves better performance by sampling nodes](https://github.com/twosixlabs/d3-force-sampled#d3-force-sampled) instead of leveraging quadtrees. This [reduces the theoretical computational cost from O(n log n) to O(n)](https://www.twosixlabs.com/graph-layout-by-random-vertex-sampling/). (See the associated [Research Paper](https://osf.io/2vpe4/).)

These performance gains were definitively observable for our graphs, but at a significant readability cost. Furthermore, Force-Sampled exhibited the odd property that it would periodically "fling" nodes far outside the body of the graph. For smaller graphs, I can definitely see applications, but don't recommend it for our graphs in our class of use cases.

### 06 - requestAnimationFrame

[SVG](https://aaboyles.github.io/Network-Demos/SVG/06%20-%20RequestAnimationFrame/) | [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/06%20-%20requestAnimationFrame/)

*Please note that this one isn't correctly implemented yet.*

Performance-tuning D3 isn't an especially untrodden path. [One suggestion for improving visual performance](https://stackoverflow.com/questions/26188266/how-to-speed-up-the-force-layout-animation-in-d3-js) is to leverage [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to [break updates into multiple steps](https://gist.github.com/DavidBruant/6489486).

### 07 - WASM

[SVG](https://aaboyles.github.io/Network-Demos/SVG/07%20-%20WASM/) | [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/07%20-%20WASM/)

*Please note that this one isn't correctly implemented yet.*

If Javascript is too slow for your application, one perrennial option is to recode your algorithm in [C](https://en.wikipedia.org/wiki/C_(programming_language)) or [Rust](https://www.rust-lang.org/) and then use [emscripten](https://emscripten.org/) to compile to [Web ASseMbly (WASM)](https://webassembly.org/). Fortunately for us, Colin Eberhardt of [Scott Logic](https://blog.scottlogic.com/2017/10/30/migrating-d3-force-layout-to-webassembly.html) already did this using [AssemblyScript](https://www.assemblyscript.org/) (a subset of [Typescript](https://www.typescriptlang.org/)).

### 08 - WebWorker

[SVG](https://aaboyles.github.io/Network-Demos/SVG/08%20-%20WebWorker/) | [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/08%20-%20WebWorker/)

OK, this is one of the odder suggestions. Instead of computing the effects of the force-directed layout on the main thread, we move that computation into a WebWorker thread. That shouldn't improve the performance meaningfully--after all, the WebWorker certainly doesn't get resources the main thread doesn't. What it does offer is the ability to perform those computation without blocking the main thread, so you could use this architecture in an environment where you needed the browser to remain snappy no matter how slowly your network was running.

[Mike Bostock](https://bost.ocks.org/mike/) himself wrote [a demo doing this](https://bl.ocks.org/mbostock/01ab2e85e8727d6529d20391c0fd9a16) ...for a static layout. Whether it can be leveraged effectively for an interactive, animated layout remains to be seen.

It's worth remarking that the Canvas version has access to support that the SVG version does not. Specifically, the canvas offers the [OffscreenCanvas API](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas), for which this sort of thing is *precisely* the use case. Essentially, the canvas gets to listen to a special memory channel while the SVG has to rely on a data transfer that's little better than an AJAX request. (OK, It's a lot better than that, but still way worse than the Offscreen Canvas API.)

However, this comes with some important tradeoffs in code complexity. Current issues in our implementation include:

* Simulation doesn't ever cool down. This is because the data transfer between the worker and the main thread doesn't exchange information about the state of the force simulation, and the Worker is just infinite looping through iterations with no cooldown.
* Node Dragging is broken in the canvas version. This is because we need to pass the dragged node to the worker to know what to do with it, but the click event just moves it (for some reason).

### 09 - WebGL (Pixi)

* The styling is broken.

### 10 - GPUjs

Just a concept for now.

## Conclusion: Whatever you do, do it on a Canvas

None of these strategies offers a slam-dunk performance improvement that will enable a seamless network of 20,000+ elements. However, the difference between rendering a network on SVG and on Canvas is consistent and tremendous. If possible, you should definitely use a canvas-based approach.

## Addendum: External Libraries

D3 and its plugins are hardly the only available option for rendering networks in the browser.

### Cytoscape

[Cytoscape]()

### d3-force-3d

[d3-force-3d]()

## Things I want to try but can't find the resources for:

* Use Cytoscape.js Force layouts (CoSE, fCoSE) with D3 as renderer.
* Pre-fit the network using one of the Cytoscape.js hybrid layouts for initial node positions and then pass those to D3 to apply a more conventional algorithm for animated interaction.