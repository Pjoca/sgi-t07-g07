class GraphLoader {
    constructor(app) {
        this.app = app;
        this.nodes = {};
    }

    read(graph) {
        this.bfs(graph, graph.rootid);
    }

    bfs(graph, rootNodeId) {
        const stack = [rootNodeId];

        while (stack.length > 0) {
            const currentId = stack.shift();
            const currentData = graph[currentId];

            if (this.nodes[currentId]) continue;

            const node = new Node(currentData.type);

            if (currentData.transforms) {
                node.transforms = currentData.transforms.map(transform => ({
                    type: transform.type,
                    amount: transform.amount
                }));
            }

            if (currentData.materialref) {
                node.materialRef = currentData.materialref.materialId.toLocaleLowerCase();
            }

            if (currentData.children) {
                for (const [childId, childInfo] of Object.entries(currentData.children)) {
                    if (childInfo.type === "noderef") {
                        node.children[childId] = childInfo.nodeId;
                        stack.push(childInfo.nodeId);
                    } else if (childInfo.type === "pointlight") {
                        node.lightProperties = {
                            type: "pointlight",
                            enabled: childInfo.enabled,
                            color: childInfo.color,
                            intensity: childInfo.intensity,
                            distance: childInfo.distance,
                            decay: childInfo.decay,
                            castShadow: childInfo.castshadow,
                            position: childInfo.position
                        };
                    } else if (childInfo.type === "rectangle") {
                        node.geometry = {
                            type: "rectangle",
                            xy1: childInfo.xy1,
                            xy2: childInfo.xy2
                        };
                    }
                }
            }

            this.nodes[currentId] = node;
        }
    }
}

class Node {
    constructor() {
        this.children = {};
        this.transforms = [];
        this.materialRef = null;
        this.lightProperties = null;
        this.geometry = null;
    }
}

export { GraphLoader };
