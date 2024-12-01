// Class to load and process a graph structure representing a scene's nodes
class GraphLoader {
    constructor(app) {
        this.app = app; // Reference to the application object
        this.nodes = {}; // Object to store all processed nodes by their ID
    }

    // Main method to read the graph and process its nodes
    read(graph) {
        // Begin breadth-first traversal from the root node
        this.bfs(graph, graph.rootid);
    }

    // Breadth-First Search (BFS) traversal of the graph to process all nodes
    bfs(graph, rootNodeId) {
        // Stack to manage nodes to be processed, starting with the root node
        const stack = [{ 
            id: rootNodeId, 
            parentCastShadows: false,  // Default value for parent cast shadows
            parentReceiveShadows: false // Default value for parent receive shadows
        }];

        // Loop until all nodes are processed
        while (stack.length > 0) {
            // Get the current node data from the stack
            const { id: currentId, parentCastShadows, parentReceiveShadows } = stack.shift();
            const currentData = graph[currentId];

            // Skip if the node has already been processed
            if (this.nodes[currentId]) continue;

            // Create a new Node instance for the current graph node
            const node = new Node(currentData.type);

            // Apply transformations if defined in the node data
            if (currentData.transforms) {
                node.transforms = currentData.transforms.map(transform => ({
                    type: transform.type,
                    amount: transform.amount
                }));
            }

            // Set the material reference if defined
            if (currentData.materialref) {
                node.materialRef = currentData.materialref.materialId.toLocaleLowerCase();
            }

            // Determine shadow properties, inheriting from parent if not explicitly defined
            node.castshadows = currentData.castshadows !== undefined
                ? currentData.castshadows
                : parentCastShadows;

            node.receiveshadows = currentData.receiveshadows !== undefined
                ? currentData.receiveshadows
                : parentReceiveShadows;

            // Process the node's children, if any
            if (currentData.children) {
                for (const [childId, childInfo] of Object.entries(currentData.children)) {
                    // Handle a list of child node references
                    if (childId === "nodesList") {
                        for (const nodeRef of childInfo) {
                            node.children[nodeRef] = nodeRef; // Add to the node's children
                            stack.push({
                                id: nodeRef, // Add to stack for further processing
                                parentCastShadows: node.castshadows,
                                parentReceiveShadows: node.receiveshadows
                            });
                        }
                    } 
                    // Handle a point light type
                    else if (childInfo.type === "pointlight") {
                        node.geometry = {
                            type: "pointlight",
                            enabled: childInfo.enabled, // Whether the light is active
                            color: childInfo.color, // Color of the light
                            intensity: childInfo.intensity, // Brightness of the light
                            distance: childInfo.distance, // Maximum range of the light
                            decay: childInfo.decay, // Rate at which the light dims
                            castshadow: childInfo.castshadow, // Whether the light casts shadows
                            position: childInfo.position // Position of the light
                        };
                    }
                    // Handle a directional light type
                    else if (childInfo.type === "directionallight") {
                        node.geometry = {
                            type: "directionallight",
                            enabled: childInfo.enabled, // Whether the light is active
                            color: childInfo.color, // Color of the light
                            intensity: childInfo.intensity, // Brightness of the light
                            position: childInfo.position, // Direction of the light source
                            castshadow: childInfo.castshadow // Whether the light casts shadows
                        };
                    }
                    // Handle a spotlight type
                    else if (childInfo.type === "spotlight") {
                        node.geometry = {
                            type: "spotlight",
                            enabled: childInfo.enabled, // Whether the light is active
                            color: childInfo.color, // Color of the spotlight
                            intensity: childInfo.intensity, // Brightness of the spotlight
                            distance: childInfo.distance, // Maximum range of the light
                            angle: childInfo.angle, // Beam width of the spotlight
                            decay: childInfo.decay, // Rate at which the light dims
                            penumbra: childInfo.penumbra, // Softness of the spotlight edge
                            castshadow: childInfo.castshadow, // Whether the light casts shadows
                            position: childInfo.position, // Position of the spotlight
                            target: childInfo.target // Target position the spotlight aims at
                        };
                    }
                    // Handle a rectangle type
                    else if (childInfo.type === "rectangle") {
                        node.geometry = {
                            type: "rectangle",
                            xy1: childInfo.xy1, // One corner of the rectangle
                            xy2: childInfo.xy2, // Opposite corner of the rectangle
                            parts_x: childInfo.parts_x, // Number of parts along the x-axis
                            parts_y: childInfo.parts_y // Number of parts along the y-axis
                        };
                    }
                    // Handle a triangle type
                    else if (childInfo.type === "triangle") {
                        node.geometry = {
                            type: "triangle",
                            xyz1: childInfo.xyz1, // First vertex of the triangle
                            xyz2: childInfo.xyz2, // Second vertex of the triangle
                            xyz3: childInfo.xyz3 // Third vertex of the triangle
                        };
                    }
                    // Handle a box type
                    else if (childInfo.type === "box") {
                        node.geometry = {
                            type: "box",
                            xyz1: childInfo.xyz1, // First corner of the box
                            xyz2: childInfo.xyz2, // Opposite corner of the box
                            parts_x: childInfo.parts_x, // Number of subdivisions along the x-axis
                            parts_y: childInfo.parts_y, // Number of subdivisions along the y-axis
                            parts_z: childInfo.parts_z // Number of subdivisions along the z-axis
                        };
                    }
                    // Handle a sphere type
                    else if (childInfo.type === "sphere") {
                        node.geometry = {
                            type: "sphere",
                            radius: childInfo.radius, // Radius of the sphere
                            slices: childInfo.slices, // Number of vertical divisions
                            stacks: childInfo.stacks, // Number of horizontal divisions
                            thetastart: childInfo.thetastart, // Start angle for the sphere
                            thetalength: childInfo.thetalength, // Angle range for the sphere
                            phistart: childInfo.phistart, // Start angle for phi
                            philength: childInfo.philength // Angle range for phi
                        };
                    }
                    // Handle a cylinder type
                    else if (childInfo.type === "cylinder") {
                        node.geometry = {
                            type: "cylinder",
                            top: childInfo.top, // Radius of the top circle
                            base: childInfo.base, // Radius of the base circle
                            height: childInfo.height, // Height of the cylinder
                            slices: childInfo.slices, // Number of radial divisions
                            stacks: childInfo.stacks, // Number of height subdivisions
                            capsclose: childInfo.capsclose, // Whether the cylinder has caps
                            thetastart: childInfo.thetastart, // Start angle for theta
                            thetalength: childInfo.thetalength // Angle range for theta
                        };
                    }
                    // Handle a polygon type
                    else if (childInfo.type === "polygon") {
                        node.geometry = {
                            type: "polygon",
                            radius: childInfo.radius, // Radius of the polygon
                            slices: childInfo.slices, // Number of sides of the polygon
                            stacks: childInfo.stacks, // Number of height divisions
                            color_c: childInfo.color_c, // Color for the center
                            color_p: childInfo.color_p // Color for the edges
                        };
                    }
                    // Handle a NURBS surface type
                    else if (childInfo.type === "nurbs") {
                        node.geometry = {
                            type: "nurbs",
                            degree_u: childInfo.degree_u, // Degree of the NURBS curve in u direction
                            degree_v: childInfo.degree_v, // Degree of the NURBS curve in v direction
                            parts_u: childInfo.parts_u, // Number of subdivisions in u direction
                            parts_v: childInfo.parts_v, // Number of subdivisions in v direction
                            controlpoints: childInfo.controlpoints // Control points defining the surface
                        };
                    }
                }
            }

            // Store the processed node in the nodes dictionary
            this.nodes[currentId] = node;
        }
    }
}

// Node class to represent a graph node with various properties and child nodes
class Node {
    constructor() {
        this.children = {}; // Set of child nodes
        this.transforms = []; // List of transformations applied to the node
        this.materialRef = null; // Reference to the node's material
        this.geometry = null; // Geometry or light information
        this.castshadows = null; // Whether the node casts shadows
        this.receiveshadows = null; // Whether the node receives shadows
    }
}

// Export the GraphLoader class for use in other modules
export { GraphLoader };
