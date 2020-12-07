(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3wasm = {})));
}(this, (function (exports) { 'use strict';

var encoded = "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IAZBD2ogDEEQaigCACIKQQh0IAdBGHZyNgIAIANBEGohAyAIQXBqIQgMAAsACyABIAlBbyAJQW9LGyAPakFwcSIFaiAEakEDaiEDQX0gBWsgAmogBGshDQwBCyAFIAEgBGoiDygCACIJOgAAIAVBAWogD0EBai0AADoAACACIARrQX5qIQggACAKQW4gCkFuSxsgDmpBcHFqIARqQQJqIQtBACEDAkADQCAIQRJJDQEgBSADaiIGQQJqIA8gA2oiDEEEaigCACIHQRB0IAlBEHZyNgIAIAZBBmogDEEIaigCACIJQRB0IAdBEHZyNgIAIAZBCmogDEEMaigCACIHQRB0IAlBEHZyNgIAIAZBDmogDEEQaigCACIJQRB0IAdBEHZyNgIAIANBEGohAyAIQXBqIQgMAAsACyABIApBbiAKQW5LGyAOakFwcSIFaiAEakECaiEDQX4gBWsgAmogBGshDQsgDUEQcQRAIAsgAykAADcAACALIAMpAAg3AAggC0EQaiELIANBEGohAwsgDUEIcQRAIAsgAykAADcAACALQQhqIQsgA0EIaiEDCyANQQRxBEAgCyADKAAANgAAIAtBBGohCyADQQRqIQMLIA1BAnEEQCALIAMvAAA7AAAgC0ECaiELIANBAmohAwsgDUEBcUUNACALIAMtAAA6AAAgAA8LIAALCwuCAwICfwF+An8CfwJAIAJFDQAgACACaiIDQX9qIAE6AAAgACABOgAAIAJBA0kNACADQX5qIAE6AAAgACABOgABIANBfWogAToAACAAIAE6AAIgAkEHSQ0AIANBfGogAToAACAAIAE6AAMgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhAgAyABNgIMIAMgATYCFCADIAE2AhggAkFoaiABNgIAIAJBZGogATYCACACQWxqIAE2AgAgAkFwaiABNgIAIAGtIgVCIIYgBYQhBSAEIANBBHFBGHIiAWshAiADIAFqIQEDQCACQSBJDQEgASAFNwMAIAFBCGogBTcDACABQRBqIAU3AwAgAUEYaiAFNwMAIAFBIGohASACQWBqIQIM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CCABQRhqQQA2AgAgASAFNgIMIAEgAjYCCAsLC0MBA38CQCABQQBIBEAACyABQQhsIQJBCCACahAHIQMgAyEEIAQgATYCACAEIAE2AgQgA0EIakEAIAIQAhogAw8ACwALQwEDfwJAIAFBAEgEQAALIAFBCGwhAkEIIAJqEAchAyADIQQgBCABNgIAIAQgATYCBCADQQhqQQAgAhACGiADDwALAAtfAAJAIAAgASACIwBsQQhsaisDCDkDACAAIAEgAiMAbEEBakEIbGorAwg5AwggACABIAIjAGxBAmpBCGxqKwMIOQMQIAAgASACIwBsQQNqQQhsaisDCDkDGCAADwALAAtfAAJAIAEgAiMAbEEIbGogACsDADkDCCABIAIjAGxBAWpBCGxqIAArAwg5AwggASACIwBsQQJqQQhsaiAAKwMQOQMIIAEgAiMAbEEDakEIbGogACsDGDkDCCAADwALAAszAAJAIAAgASACIwFsQQRsaigCCDYCACAAIAEgAiMBbEEBakEEbGooAgg2AgQgAA8ACwALMwACQCABIAIjAWxBBGxqIAAoAgA2AgggASACIwFsQQFqQQRsaiAAKAIENgIIIAAPAAsACw0AAkAjAigCCA8ACwALQwEDfwJAIAFBAEgEQAALIAFBCGwhAkEIIAJqEAchAyADIQQgBCABNgIAIAQgATYCBCADQQhqQQAgAhACGiADDwALAAsiAAJAIABBCBAHQQBBCBACIAEjAGwQFTYCACAAIAE2AgQLCwsAAkAQFCAAEBYLCw0AAkAjAygCBA8ACwALDQACQBAUKAIADwALAAsNAAJAIwQoAggPAAsAC0MBA38CQCABQQBIBEAACyABQQRsIQJBCCACahAHIQMgAyEEIAQgATYCACAEIAE2AgQgA0EIakEAIAIQAhogAw8ACwALIgACQCAAQQgQB0EAQQgQAiABIwFsEBs2AgAgACABNgIECwsLAAJAEBogABAcCwsNAAJAEBooAgQPAAsACw0AAkAQGigCAA8ACwALQwEDfwJAIAFBAEgEQAALIAFBKGwhAkEIIAJqEAchAyADIQQgBCABNgIAIAQgATYCBCADQQhqQQAgAhACGiADDwALAAtbAQJ/AkBBCBAHQQBBCBACIAAoAgQQICEBAkBBACECA0AgAiAAKAIESARAIAEgAkEEbGpBKBAHQQBB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JAQjAkEIEAdBAEEIEAI2AggjBEEIEAdBAEEIEAI2AggLCwsOAQBBCAsIIAAAAAAAAAAAmgYEbmFtZQGSBi8ABy5tZW1jbXABBy5tZW1jcHkCBy5tZW1zZXQDDS5pbml0X21wYXJhbXMEDi5tc3BhY2VfbWFsbG9jBQwubXNwYWNlX2ZyZWUGBS5pbml0BwcubWFsbG9jCAgucmVhbGxvYwkFLmZyZWUKCS5pbml0X3RvcAsQLnNlZ21lbnRfaG9sZGluZwwJLm1vcmVjb3JlDQ4uZGlzcG9zZV9jaHVuaw4lc3RkOkFycmF5PE5vZGVBcnJheVNlcmlhbGlzZXIgfCBudWxsPg8pc3RkOkFycmF5PE5vZGVMaW5rQXJyYXlTZXJpYWxpc2VyIHwgbnVsbD4QCU5vZGUucmVhZBEKTm9kZS53cml0ZRINTm9kZUxpbmsucmVhZBMOTm9kZUxpbmsud3JpdGUUE25vZGVBcnJheVNlcmlhbGlzZXIVDnN0ZDpBcnJheTxmNjQ+Fh5Ob2RlQXJyYXlTZXJpYWxpc2VyI2luaXRpYWxpc2UXEnNldE5vZGVBcnJheUxlbmd0aBgSZ2V0Tm9kZUFycmF5TGVuZ3RoGQxnZXROb2RlQXJyYXkaF25vZGVBcnJheUxpbmtTZXJpYWxpc2VyGw5zdGQ6QXJyYXk8dTMyPhwiTm9kZUxpbmtBcnJheVNlcmlhbGlzZXIjaW5pdGlhbGlzZR0Sc2V0TGlua0FycmF5TGVuZ3RoHhJnZXRMaW5rQXJyYXlMZW5ndGgfDGdldExpbmtBcnJheSAWc3RkOkFycmF5PE5vZGUgfCBudWxsPiEYTm9kZUFycmF5U2VyaWFsaXNlciNyZWFkIhpzdGQ6QXJyYXk8Tm9kZUxpbmsgfCBudWxsPiMcTm9kZUxpbmtBcnJheVNlcmlhbGlzZXIjcmVhZCQOcmVhZEZyb21NZW1vcnklGU5vZGVBcnJheVNlcmlhbGlzZXIjd3JpdGUmDXdyaXRlVG9NZW1vcnknB2NvbnZlcnQoA3NpbikDY29zKg9pbml0aWFsaXplTm9kZXMrBmNlbnRlciwIbWFueUJvZHktBGxpbmsuBi5zdGFydA==";

        function asciiToBinary(str) {
          if (typeof atob === 'function') {
            return atob(str)
          } else {
            return new Buffer(str, 'base64').toString('binary');
          }
        }

        function decode(encoded) {
          var binaryString =  asciiToBinary(encoded);
          var bytes = new Uint8Array(binaryString.length);
          for (var i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes.buffer;
        }

        var wasmCode = (importObject) =>  WebAssembly.instantiate(decode(encoded), importObject)
          .then(r => r.instance);

// -------------------------------- classes shared between ASC and JS
var Node = (function () {
    function Node() {
        this.links = 0;
    }
    Node.read = function (node, buffer, index) {
        node.x = buffer[index * Node.size];
        node.y = buffer[index * Node.size + 1];
        node.vx = buffer[index * Node.size + 2];
        node.vy = buffer[index * Node.size + 3];
        return node;
    };
    Node.write = function (node, buffer, index) {
        buffer[index * Node.size] = node.x;
        buffer[index * Node.size + 1] = node.y;
        buffer[index * Node.size + 2] = node.vx;
        buffer[index * Node.size + 3] = node.vy;
        return node;
    };
    Node.size = 4;
    return Node;
}());
var NodeLink = (function () {
    function NodeLink() {
    }
    NodeLink.read = function (nodeLink, buffer, index) {
        nodeLink.sourceIndex = buffer[index * NodeLink.size];
        nodeLink.targetIndex = buffer[index * NodeLink.size + 1];
        return nodeLink;
    };
    NodeLink.write = function (nodeLink, buffer, index) {
        buffer[index * NodeLink.size] = nodeLink.sourceIndex;
        buffer[index * NodeLink.size + 1] = nodeLink.targetIndex;
        return nodeLink;
    };
    NodeLink.size = 2;
    return NodeLink;
}());
// -------------------------------- classes that serialize / deserialize the above
var NodeArraySerialiser = (function () {
    function NodeArraySerialiser() {
    }
    NodeArraySerialiser.prototype.read = function () {
        var typedArray = new Array(this.count);
        for (var i = 0; i < this.count; i++) {
            typedArray[i] = Node.read(new Node(), this.array, i);
        }
        return typedArray;
    };
    NodeArraySerialiser.prototype.write = function (typedArray) {
        for (var i = 0; i < this.count; i++) {
            Node.write(typedArray[i], this.array, i);
        }
    };
    NodeArraySerialiser.prototype.initialise = function (count) {
        this.array = new Float64Array(count * Node.size);
        this.count = count;
    };
    return NodeArraySerialiser;
}());
// bug: cannot just create a new NodeArraySerialiser()!!!
var node = new Array(1);
node[0] = new NodeArraySerialiser();
function nodeArraySerialiser() {
    return node[0];
}
var nodeArray;
function setNodeArrayLength(count) {
    nodeArraySerialiser().initialise(count);
}
function getNodeArrayLength() {
    return nodeArray.length;
}
function getNodeArray() {
    return nodeArraySerialiser().array;
}
var NodeLinkArraySerialiser = (function () {
    function NodeLinkArraySerialiser() {
        this.count = 0;
    }
    NodeLinkArraySerialiser.prototype.read = function () {
        var typedArray = new Array(this.count);
        for (var i = 0; i < this.count; i++) {
            typedArray[i] = NodeLink.read(new NodeLink(), this.array, i);
            
        }
        return typedArray;
    };
    NodeLinkArraySerialiser.prototype.initialise = function (count) {
        this.array = new Uint32Array(count * NodeLink.size);
        this.count = count;
    };
    return NodeLinkArraySerialiser;
}());
// bug: cannot just create a new NodeArraySerialiser()!!!
var node2 = new Array(1);
node2[0] = new NodeLinkArraySerialiser();
function nodeArrayLinkSerialiser() {
    return node2[0];
}
var linkArray;
function setLinkArrayLength(count) {
    nodeArrayLinkSerialiser().initialise(count);
}
function getLinkArrayLength() {
    return nodeArrayLinkSerialiser().count;
}
function getLinkArray() {
    return nodeArrayLinkSerialiser().array;
}
// -------------------------------- maths functions
var PI = 3.141592653589793;
function sin(x) {
    while (x < -PI) {
        x += PI * 2;
    }
    while (x > PI) {
        x -= PI * 2;
    }
    var sin;
    if (x < 0) {
        sin = 1.27323954 * x + .405284735 * x * x;
        if (sin < 0) {
            sin = .225 * (sin * -sin - sin) + sin;
        }
        else {
            sin = .225 * (sin * sin - sin) + sin;
        }
    }
    else {
        sin = 1.27323954 * x - 0.405284735 * x * x;
        if (sin < 0) {
            sin = .225 * (sin * -sin - sin) + sin;
        }
        else {
            sin = .225 * (sin * sin - sin) + sin;
        }
    }
    return sin;
}
function cos(x) {
    return sin(x - PI / 2);
}
// -------------------------------- read / write data form linear memory
function readFromMemory() {
    nodeArray = nodeArraySerialiser().read();
    linkArray = nodeArrayLinkSerialiser().read();
    for (var i = 0; i < linkArray.length; i++) {
        var typedLink = linkArray[i];
        // resolve the source / target indices to their respective nodes
        typedLink.source = nodeArray[typedLink.sourceIndex];
        typedLink.target = nodeArray[typedLink.targetIndex];
        // update the node link count
        typedLink.source.links = typedLink.source.links + 1.0;
        typedLink.target.links = typedLink.target.links + 1.0;
    }
    // compute the bias for each link
    for (var i = 0; i < linkArray.length; i++) {
        var typedLink = linkArray[i];
        typedLink.bias = typedLink.source.links / (typedLink.source.links + typedLink.target.links);
    }
}
// TODO: cannot cast integers to floats, the required conversion functions are not exposed
// https://github.com/WebAssembly/design/blob/master/Semantics.md#datatype-conversions-truncations-reinterpretations-promotions-and-demotions
// https://github.com/AssemblyScript/assemblyscript/issues/117#issuecomment-334927010
function convert(v) {
    var conversionBuffer = new Float64Array(1);
    conversionBuffer[0] = v;
    return conversionBuffer[0];
}
function writeToMemory() {
    nodeArraySerialiser().write(nodeArray);
}
// -------------------------------- d3 force layout functions
function initializeNodes() {
    var initialRadius = 10.0;
    var initialAngle = PI * (3.0 - sqrt(5.0));
    for (var i = 0; i < nodeArray.length; i++) {
        var node_1 = nodeArray[i];
        var radius = initialRadius * sqrt(i);
        var angle = convert(i) * initialAngle;
        node_1.x = radius * sin(angle);
        node_1.y = radius * cos(angle);
        node_1.vx = 0;
        node_1.vy = 0;
    }
}
function center(x, y) {
    var sx = 0, sy = 0;
    for (var i = 0; i < nodeArray.length; i++) {
        sx = sx + nodeArray[i].x;
        sy = sy + nodeArray[i].y;
    }
    sx = sx / convert(nodeArray.length) - x;
    sy = sy / convert(nodeArray.length) - y;
    for (var i = 0; i < nodeArray.length; i++) {
        nodeArray[i].x = nodeArray[i].x - sx;
        nodeArray[i].y = nodeArray[i].y - sy;
    }
}
function manyBody(alpha, strength) {
    for (var i = 0; i < nodeArray.length; i++) {
        for (var j = 0; j < nodeArray.length; j++) {
            if (i != j) {
                var nodeOne = nodeArray[i];
                var nodeTwo = nodeArray[j];
                var dx = nodeTwo.x - nodeOne.x;
                var dy = nodeTwo.y - nodeOne.y;
                var l = dx * dx + dy * dy;
                var w = strength * alpha / l;
                // TODO: += doesn't work here!
                nodeOne.vx = nodeOne.vx + dx * w;
                nodeOne.vy = nodeOne.vy + dy * w;
            }
        }
    }
}
function link(alpha) {
    var distance = 30;
    for (var i = 0; i < linkArray.length; i++) {
        var link_1 = linkArray[i];
        var dx = link_1.target.x + link_1.target.vx - link_1.source.x - link_1.source.vx;
        var dy = link_1.target.y + link_1.target.vy - link_1.source.y - link_1.source.vy;
        var length = sqrt(dx * dx + dy * dy);
        var strength = 1 / min(link_1.target.links, link_1.source.links);
        var deltaLength = (length - distance) / length * strength * alpha;
        dx = dx * deltaLength;
        dy = dy * deltaLength;
        link_1.target.vx = link_1.target.vx - dx * link_1.bias;
        link_1.target.vy = link_1.target.vy - dy * link_1.bias;
        link_1.source.vx = link_1.source.vx + dx * (1 - link_1.bias);
        link_1.source.vy = link_1.source.vy + dy * (1 - link_1.bias);
    }
}


var force = Object.freeze({
	setNodeArrayLength: setNodeArrayLength,
	getNodeArrayLength: getNodeArrayLength,
	getNodeArray: getNodeArray,
	setLinkArrayLength: setLinkArrayLength,
	getLinkArrayLength: getLinkArrayLength,
	getLinkArray: getLinkArray,
	readFromMemory: readFromMemory,
	writeToMemory: writeToMemory,
	initializeNodes: initializeNodes,
	center: center,
	manyBody: manyBody,
	link: link,
	Node: Node,
	NodeLink: NodeLink
});

var wasm;
var loaded = wasmCode()
    .then(function (instance) {
    wasm = instance.exports;
    return true;
});
var getAdaptedWasmCode = function () {
    // TODO: wasm is frozen so we cannot proxy! this is a big hack to allow proxying!!!!!!
    var wasm2 = {
        sin: wasm.sin,
        cos: wasm.cos,
        readFromMemory: wasm.readFromMemory,
        writeToMemory: wasm.writeToMemory,
        initializeNodes: wasm.initializeNodes,
        manyBody: wasm.manyBody,
        link: wasm.link,
        center: wasm.center,
        setNodeArrayLength: wasm.setNodeArrayLength,
        getNodeArrayLength: wasm.getNodeArrayLength,
        getNodeArray: wasm.getNodeArray,
        setLinkArrayLength: wasm.setLinkArrayLength,
        getLinkArrayLength: wasm.getLinkArrayLength,
        getLinkArray: wasm.getLinkArray
    };
    return new Proxy(wasm2, {
        get: function (target, name) {
            if (name === 'getNodeArray') {
                return function () {
                    var offset = wasm.getNodeArray();
                    return new Float64Array(wasm.memory.buffer, offset + 8, wasm.getNodeArrayLength() * Node.size);
                };
            }
            else if (name === 'getLinkArray') {
                return function () {
                    var offset = wasm.getLinkArray();
                    return new Uint32Array(wasm.memory.buffer, offset + 8, wasm.getLinkArrayLength() * NodeLink.size);
                };
            }
            else {
                return target[name];
            }
        }
    });
};

var simulation = function (nodes, useWasm) {
    var velocityDecay = 0.6;
    var alpha = 1.0;
    var alphaMin = 0.001;
    var alphaDecay = 1 - Math.pow(alphaMin, 1 / 300);
    var alphaTarget = 0;
    var forces = [];
    var computer = useWasm ? getAdaptedWasmCode() : force;
    // execute some WASM code, reading from / writing tolinear memory 
    var executeWasm = function (wasmCode) {
        // write the nodes to the WASM linear memory
        var nodeBuffer = computer.getNodeArray();
        nodes.forEach(function (node, index) { return Node.write(node, nodeBuffer, index); });
        // read the values form linear memory
        computer.readFromMemory();
        wasmCode();
        // write back any updates
        computer.writeToMemory();
        // read back into the JS node array
        nodeBuffer = computer.getNodeArray();
        nodes.forEach(function (node, index) { return Node.read(node, nodeBuffer, index); });
    };
    computer.setNodeArrayLength(nodes.length);
    executeWasm(function () {
        computer.initializeNodes();
    });
    var simulation = {};
    simulation.tick = function () {
        alpha += (alphaTarget - alpha) * alphaDecay;
        executeWasm(function () {
            forces.forEach(function (force) {
                force(alpha);
            });
        });
        nodes.forEach(function (node) {
            if (node.fx == null) {
                node.x += node.vx;
                node.vx *= velocityDecay;
            }
            else {
                node.x = node.fx;
                node.vx = 0;
            }
            if (node.fy == null) {
                node.y += node.vy;
                node.vy *= velocityDecay;
            }
            else {
                node.y = node.fy;
                node.vy = 0;
            }
        });
        return simulation;
    };
    simulation.force = function (name, force) {
        forces.push(force);
        force.initialize(computer, nodes);
        return simulation;
    };
    simulation.alphaTarget = function (a) {
        alphaTarget = a;
        return simulation;
    };
    simulation.restart = function () {
        alpha = 0.0;
        return simulation;
    };
    // this simulation implementation does't support internal timers.
    simulation.stop = function () { return simulation; };
    return simulation;
};

var manyBody$1 = function () {
    var strength = -30;
    var computer;
    var manyBody = (function (alpha) {
        return computer.manyBody(alpha, strength);
    });
    manyBody.strength = function (s) { return strength = s; };
    manyBody.initialize = function (c, n) { computer = c; };
    return manyBody;
};

var link$1 = function () {
    var nodes;
    var links;
    var id = function (n) { return n.index; };
    var computer;
    var initialize = function () {
        if (!nodes)
            return;
        computer.setLinkArrayLength(links.length);
        var linkBuffer = computer.getLinkArray();
        links.forEach(function (link$$1, index) {
            var sourceIndex = nodes.findIndex(function (n) { return id(n) == link$$1.source; });
            var targetIndex = nodes.findIndex(function (n) { return id(n) == link$$1.target; });
            link$$1.sourceIndex = sourceIndex;
            link$$1.targetIndex = targetIndex;
            NodeLink.write(link$$1, linkBuffer, index);
            link$$1.source = nodes[sourceIndex];
            link$$1.target = nodes[targetIndex];
        });
    };
    var link$$1 = (function (alpha) {
        computer.link(alpha);
    });
    link$$1.initialize = function (c, n) {
        nodes = n;
        computer = c;
        initialize();
        return link$$1;
    };
    link$$1.id = function (f) {
        id = f;
        return link$$1;
    };
    link$$1.links = function (l) {
        links = l;
        initialize();
        return link$$1;
    };
    return link$$1;
};

var center$1 = function (cx, cy) {
    if (cx === void 0) { cx = 0.0; }
    if (cy === void 0) { cy = 0.0; }
    var computer;
    var center = (function (alpha) {
        return computer.center(cx, cy);
    });
    center.initialize = function (c, n) { computer = c; };
    return center;
};

exports.forceSimulation = simulation;
exports.forceManyBody = manyBody$1;
exports.forceLink = link$1;
exports.forceCenter = center$1;
exports.loaded = loaded;

Object.defineProperty(exports, '__esModule', { value: true });

})));