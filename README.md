# Network Demos

A collection of Force-directed Graph demonstrations.

I need to render a big network (~10k Nodes, ~10k Links) in Javascript. The simplest case performs pretty poorly (~3fps on my machine). There are a bunch of ways we could improve performance--so this is a collection of those approaches. If you find yourself in a similar situation (needing to render a huge interactive network in the browser), perhaps these can save you some time.

In general, these should all possess node dragging and panning/zooming functionality, though it's buggy in many cases. I'll try to note the implementation issues in the documentation below.

I don't have a complex benchmarking architecture, just [a count of the number of ticks that resets every second](https://github.com/AABoyles/Network-Demos/blob/main/utils.js#L26), visible on the bottom-right corner of every visualization. The numbers given in the table below show the median observed FPS for that graph type **(higher is better)**.

| Index | Strategy              | SVG  | Canvas |
| ----- | --------------------- | ---- | ------ |
| 01    | [Basic](#basic)  | [3](https://aaboyles.github.io/Network-Demos/SVG/01%20-%20Basic/) | [14](https://aaboyles.github.io/Network-Demos/Canvas/01%20-%20Basic/) |
| 02    | [Increased Theta](#increased-theta) | [4](https://aaboyles.github.io/Network-Demos/SVG/02%20-%20Increased%20Theta/) | [29](https://aaboyles.github.io/Network-Demos/Canvas/02%20-%20Increased%20Theta/) |
| 03    | [Finite Max-Distance](#finite-max-distance) | [3](https://aaboyles.github.io/Network-Demos/SVG/03%20-%20Finite%20Distance/) | [10](https://aaboyles.github.io/Network-Demos/SVG/03%20-%20Finite%20Distance/) |
| 04    | [Force-Reuse](#force-reuse) | [4](https://aaboyles.github.io/Network-Demos/SVG/04%20-%20Force-Reuse/) | [15](https://aaboyles.github.io/Network-Demos/Canvas/04%20-%20Force-Reuse/) |
| 05    | [Force-Sampled](#force-sampled) | [4](https://aaboyles.github.io/Network-Demos/SVG/05%20-%20Force-Sampled/) | [24](https://aaboyles.github.io/Network-Demos/Canvas/05%20-%20Force-Sampled/) |
| 06    | [requestAnimationFrame](#requestanimationframe) |      |        |
| 07    | [WASM](#wasm) | [3](https://aaboyles.github.io/Network-Demos/SVG/07%20-%20WASM/) | [2](https://aaboyles.github.io/Network-Demos/Canvas/07%20-%20WASM/) |
| 08    | [Webworker](#webworker) |      |        |
| 09    | [WebGL (Pixi)](#webgl-(pixi)) | (NA) | [13](https://aaboyles.github.io/Network-Demos/Canvas/09%20-%20WebGL%20with%20pixi/) |
| 10    | [GPUjs](#gpujs) |       |        |
| 11    | [Pre-warmed](#pre-warmed) |       |        |

(Note that the indices are essentially arbitrary, and just for managing ordering in Finder/File Explorer.)

There are a lot of variables that go into making a visualization like these smooth. Some notable ones that I'm simply taking as constant on my own machine are: the machine (Apple Macbook Pro 2020 w/ i7, 32GB Ram), Browser (Chrome 86), number of nodes in the network (10,000) number of links in the network (10,000), and [*lots* of configurations in the network](https://github.com/d3/d3-force#forces). I can't possibly test all of them, so what ends up being best for my use case may not be best for yours. Basically, take the above numbers as an approximation of the order of efficiency of the associated approach when this document was last updated (presently December 2020).

### Basic <small>[[SVG](https://aaboyles.github.io/Network-Demos/SVG/01%20-%20Basic/), [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/01%20-%20Basic/)]</small>

Approximately the simplest D3 Force Directed Graph with Zooming and Dragging. Nothing has been attempted to optimize these, making them optimal boilerplates for the others.

Here we see the first stark contrast between SVG and Canvas Performance. Canvas outperforms SVG by a factor of between 4x and 5x, though the canvas version is still unacceptably choppy.

### Pre-warmed <small>[[SVG](https://aaboyles.github.io/Network-Demos/SVG/02%20-%20Pre-warmed/), [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/02%20-%20Pre-warmed/)]</small>

A lot of the annoyance from watching these networks comes from waiting for the network to cool down. Perhaps we can improve the experience of using these networks by computing the state of the network in the distant future before the first time we draw it. This is achieved by simply calling `simulation.tick(n);` where n is the number of ticks you wish to advance, before you first update the visual.

Once the network is rendered, the FPS is the same as [01 - Basic Version](#01---basic-version). The salient benchmark here is the time between starting computation and first rendering the network. Because this computation does not include rendering, the results are essentailly the same for both SVG and Canvas--around 19. This, in conjunction with [02 - Increased Theta](#02---increased-theta) gives us an important hint: The simulation is at least as big a bottleneck as rendering on a canvas.

### Increased Theta <small>[[SVG](https://aaboyles.github.io/Network-Demos/SVG/02%20-%20Increased%20Theta/), [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/02%20-%20Increased%20Theta/)]</small>

[d3-force](https://github.com/d3/d3-force) leverages [quadtrees](https://en.wikipedia.org/wiki/Quadtree) and the [Barnes-Hut approximation](https://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation) to simplify node trajectory computations. Essentially, when a bunch of nodes are far away from a node, d3 just treats all those far away nodes as one big heavy node located in the middle, meaning it only needs to compute the effect of the forces once, rather than as many times as there are far-away nodes. But the definition of "far away" is related to this theta parameter. Set theta small, and you make "far away" mean farther away. Increase it and we can perform the approximation more aggressively, meaning the browser can pump up the frame rate.

However, it comes with some problems as well: once the Network reaches a reasonably stable equilibrium, this approach exhibit a minor-but-noticeable juddering effect on nodes that are otherwise well-placed. For most applications, this is probably an acceptable tradeoff.

### Finite Max-Distance <small>[[SVG](https://aaboyles.github.io/Network-Demos/SVG/03%20-%20Finite%20Distance/), [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/03%20-%20Finite%20Distance/)]</small>

In the description of [02 - Increased Theta](#02---increased-theta), I provide a brief non-technical description of the Barnes-Hut approximation algorithm leveraged by D3-Force to make real-time force-directed layouts possible. In addition to setting a threshold for consolidating nodes (theta), you can set a threshold for evaluating if a charge or gravitational tug should affect a node at all. This is the maxDistance threshold. By default, it's Infinite--that is, there's no distance at which one node will no longer affect the trajectory of another. By setting this value lower, we can reduce the computational burden of evaluating these relationships.

Unfortunately, this one turn out to be obviously non-useful in multiple respects. First and foremost, it doesn't provide a meaningful improvement in performance for our class of graphs. Second, it tends to self-organizes into a pattern of overlapping circles of radius equal to the given maximum value. While beautiful and rather interesting, these patterns hide the analytical utility of the network structure. Accordingly I recommend you should ***always leave the maxDistance set to Infinity.***

### Force-Reuse <small>[[SVG](https://aaboyles.github.io/Network-Demos/SVG/04%20-%20Force-Reuse/), [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/04%20-%20Force-Reuse/)]</small>

Robert Gove of TwoSix Labs produced [an alternative version of d3-forceManyBody called d3-force-reuse](https://github.com/twosixlabs/d3-force-reuse) which purports to [improve the performance of the base d3 implementation by recomputing the quadtree only every 13 ticks](https://www.twosixlabs.com/faster-force-directed-graph-layouts-by-reusing-force-approximations/), instead of on every tick. (Read [the paper](https://osf.io/wgzn5/) for technical details.)

While this does improve performance slightly, it does so while adding a distracting propensity for the graph to expand and contract periodically. Moreover, for the class of graphs I'm evaluating here, performance gains from this strategy were minimal. I believe this may be an effective approach for other graph types, but I can't definitively make this claim based on these data.

### Force-Sampled <small>[[SVG](https://aaboyles.github.io/Network-Demos/SVG/05%20-%20Force-Sampled/) , [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/05%20-%20Force-Sampled/)]</small>

In addition to [Force-Reuse (see above)](#04---force-reuse), Robert Gove of TwoSix Labs produced [a second d3 forceManyBody alternative which achieves better performance by sampling nodes](https://github.com/twosixlabs/d3-force-sampled#d3-force-sampled) instead of leveraging quadtrees. This [reduces the theoretical computational cost from O(n log n) to O(n)](https://www.twosixlabs.com/graph-layout-by-random-vertex-sampling/). (See the associated [Research Paper](https://osf.io/2vpe4/).)

These performance gains were definitively observable for our graphs, but at a significant readability cost. Furthermore, Force-Sampled exhibited the odd property that it would periodically "fling" nodes far outside the body of the graph. For smaller graphs, I can definitely see applications, but don't recommend it for graphs in our class of use cases.

### requestAnimationFrame <small>[[SVG](https://aaboyles.github.io/Network-Demos/SVG/06%20-%20RequestAnimationFrame/), [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/06%20-%20requestAnimationFrame/)]</small>

*Please note that this one isn't correctly implemented yet.*

Performance-tuning D3 isn't an especially untrodden path. [One suggestion for improving visual performance](https://stackoverflow.com/questions/26188266/how-to-speed-up-the-force-layout-animation-in-d3-js) is to leverage [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to [break updates into multiple steps](https://gist.github.com/DavidBruant/6489486).

### WASM <small>[[SVG](https://aaboyles.github.io/Network-Demos/SVG/07%20-%20WASM/), [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/07%20-%20WASM/)]</small>

If Javascript is too slow for your application, one perrennial option is to recode your algorithm in [C](https://en.wikipedia.org/wiki/C_(programming_language)) or [Rust](https://www.rust-lang.org/) and then use [emscripten](https://emscripten.org/) to compile to [Web ASseMbly (WASM)](https://webassembly.org/). Fortunately for us, Colin Eberhardt of [Scott Logic](https://blog.scottlogic.com/2017/10/30/migrating-d3-force-layout-to-webassembly.html) already did this using [AssemblyScript](https://www.assemblyscript.org/) (a subset of [Typescript](https://www.typescriptlang.org/)).

Personally, I found this one most disappointing. There are two reasons for this: first, it's the only case in which the Canvas implementation actually underperformed the equivalent SVG implementation. Second, it appears not to improve performance even in the better SVG case.

There are a few sources of possible explanations for this curiously poor performance. First and foremost, I may have implemented the use of the library inefficiently or otherwise incorrectly. If not this, it's worth noting that this is a two-year-old project that never got much beyond the level of a proof-of-concept. It could be the case that the core d3-force implementation has been improved in the intemediate timespan. Alternately, it may be that the d3-wasm implementation was incomplete, or encumbered in some other way. Whatever the case, I do not presently recommend this approach for any applications.

### WebWorker <small>[[SVG](https://aaboyles.github.io/Network-Demos/SVG/08%20-%20WebWorker/), [Canvas](https://aaboyles.github.io/Network-Demos/Canvas/08%20-%20WebWorker/)]</small>

OK, this is one of the odder suggestions. Instead of computing the effects of the force-directed layout on the main thread, we move that computation into a WebWorker thread. That shouldn't improve the performance meaningfully--after all, the WebWorker certainly doesn't get resources the main thread doesn't. What it does offer is the ability to perform those computation without blocking the main thread, so you could use this architecture in an environment where you needed the browser to remain snappy no matter how slowly your network was running.

[Mike Bostock](https://bost.ocks.org/mike/) himself wrote [a demo doing this](https://bl.ocks.org/mbostock/01ab2e85e8727d6529d20391c0fd9a16) ...for a static layout. Whether it can be leveraged effectively for an interactive, animated layout remains to be seen.

It's worth remarking that the Canvas version has access to support that the SVG version does not. Specifically, the canvas offers the [OffscreenCanvas API](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas), for which this sort of thing is *precisely* the use case. Essentially, the canvas gets to listen to a special memory channel while the SVG has to rely on a data transfer that's little better than an AJAX request. (OK, It's a lot better than that, but still way worse than the Offscreen Canvas API.)

However, this comes with some important tradeoffs in code complexity. Current issues in our implementation include:

* Simulation doesn't ever cool down. This is because the data transfer between the worker and the main thread doesn't exchange information about the state of the force simulation, and the Worker is just infinite looping through iterations with no cooldown.
* Node Dragging is broken in the canvas version. This is because we need to pass the dragged node to the worker to know what to do with it, but the click event just moves it (for some reason).

### WebGL (Pixi) <small>[[Canvas](http://localhost:5500/Canvas/09%20-%20WebGL%20with%20pixi/)]</small>

Note that there's no SVG version of this one, since there isn't really a logical mapping from the output of WebGL (which is essentially a canvas) to SVG.

### GPUjs <small>[]</small>

Just a concept for now. One additional way we might be able to speed up computation

## Conclusion: Whatever you do, do it on a Canvas

None of these strategies offers a slam-dunk performance improvement that will enable a seamless network of 20,000+ elements. However, the difference between rendering a network on SVG and on Canvas is consistent and tremendous. If possible, you should definitely use a canvas-based approach. It is also likely that for large networks, you'll benefit from increasing the default theta value somewhat.

## Addendum: External Libraries

D3 and its plugins are hardly the only available option for rendering networks in the browser.

### Cytoscape

We can use this the pre-set the layout, sort of like [pre-warmed](#pre-warmed).

### ngraph-hde

[ngraph-hde](https://github.com/anvaka/ngraph.hde). [Cool Demo Here]()

We can also use this to pre-set the layout, and then switch to the d3-force simulation. While this doesn't directly improve performance, it does give us 

### ngraph-forcelayout

[ngraph-forcelayout](https://github.com/anvaka/ngraph.forcelayout)

### VivaGraphJS

[VivaGraphJS](https://github.com/anvaka/VivaGraphJS)

### force-graph

[force-graph](https://github.com/vasturiano/force-graph) is a little library to package up an easy-to-use d3-force graph widget. It comes to my attention now because of [this demo](https://vasturiano.github.io/force-graph/example/large-graph/), which purports to render 75,000 elements (and looks pretty crisp).

## Things I want to try but can't find the resources for:

* Use Cytoscape.js Force layouts (CoSE, fCoSE) with D3 as renderer.
* Pre-fit the network using one of the Cytoscape.js hybrid layouts for initial node positions and then pass those to D3 to apply a more conventional algorithm for animated interaction.