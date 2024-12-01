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
                    if (childId === "nodesList") {
                        for (const nodeRef of childInfo) {
                            node.children[nodeRef] = nodeRef;
                            stack.push(nodeRef);
                        }
                    } else if (childInfo.type === "pointlight") {

                        node.geometry = {
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
                            xy2: childInfo.xy2,
                            parts_x: childInfo.parts_x,
                            parts_y: childInfo.parts_y
                        };
                    } else if (childInfo.type === "triangle") {
                        node.geometry = {
                            type: "triangle",
                            xyz1: childInfo.xyz1,
                            xyz2: childInfo.xyz2,
                            xyz3: childInfo.xyz3
                        }
                    } else if (childInfo.type === "box") {
                        node.geometry = {
                            type: "box",
                            xyz1: childInfo.xyz1,
                            xyz2: childInfo.xyz2,
                            parts_x: childInfo.parts_x,
                            parts_y: childInfo.parts_y,
                            parts_z: childInfo.parts_z
                        };
                    } else if (childInfo.type === "sphere") {
                        node.geometry = {
                            type: "sphere",
                            radius: childInfo.radius,
                            slices: childInfo.slices,
                            stacks: childInfo.stacks,
                            thetastart: childInfo.thetastart,
                            thetalength: childInfo.thetalength,
                            phistart: childInfo.phistart,
                            philength: childInfo.philength
                        };
                    } else if (childInfo.type === "cylinder") {
                        node.geometry = {
                            type: "cylinder",
                            top: childInfo.top,
                            base: childInfo.base,
                            height: childInfo.height,
                            slices: childInfo.slices,
                            stacks: childInfo.stacks,
                            capsclose: childInfo.capsclose,
                            thetastart: childInfo.thetastart,
                            thetalength: childInfo.thetalength
                        };
                    } else if (childInfo.type === "polygon") {
                        node.geometry = {
                            type: "polygon",
                            radius: childInfo.radius,
                            slices: childInfo.slices,
                            stacks: childInfo.stacks,
                            color_c: childInfo.color_c,
                            color_p: childInfo.color_p
                        };
                    } 
                    else if (childInfo.type === "nurbs") {
                        node.geometry = {
                            type: "nurbs",
                            degree_u: childInfo.degree_u,
                            degree_v: childInfo.degree_v,
                            parts_u: childInfo.parts_u,
                            parts_v: childInfo.parts_v,
                            controlpoints: childInfo.controlpoints
                        };
                    }  else if (childInfo.type === "video") {
                        node.geometry = {
                            type: "video",
                            url: childInfo.url,
                            radius: childInfo.radius,
                            height: childInfo.height,
                            radialSegments: childInfo.radialSegments
                        };
                    } else if (childInfo.type === "bumpmap") {
                        node.geometry = {
                            type: "bumpmap",
                            xy1: childInfo.xy1,
                            xy2: childInfo.xy2,
                            parts_x: childInfo.parts_x,
                            parts_y: childInfo.parts_y
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
        this.geometry = null;
    }
}

export {GraphLoader};
