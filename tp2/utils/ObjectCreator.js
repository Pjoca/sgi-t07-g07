// Import necessary modules from the 'three' library and additional addons for NURBS surface and parametric geometry.
import * as THREE from 'three'; 
import {NURBSSurface} from 'three/addons/curves/NURBSSurface.js';  // Import NURBSSurface class to work with NURBS geometry.
import {ParametricGeometry} from 'three/addons/geometries/ParametricGeometry.js';  // Import ParametricGeometry for custom parametric shapes.

class ObjectCreator {
    // Constructor for initializing the ObjectCreator class with dependencies.
    constructor(app, graphLoader, materialsLoader) {
        this.app = app; // Application reference, likely for accessing the scene or rendering context.
        this.graphLoader = graphLoader; // GraphLoader instance to load scene graph data.
        this.materialsLoader = materialsLoader; // MaterialsLoader instance to load and manage materials.

        // Arrays to manage visualizing objects and polygons in the scene.
        this.polygons = []; // Array to store polygon meshes for later use (e.g., for wireframe visualization).
        this.polygonWireframe = false; // Flag indicating if polygons should be rendered in wireframe mode.

        this.lights = []; // Array to store light objects, which will be used in the scene.
    }

// Method to create objects in the scene based on the graph structure.
createObjects() {
    // Define the root node's ID which is "scene"
    const rootId = "scene";
    const rootNode = this.graphLoader.nodes[rootId]; // Get the root node from the graph

    // If the root node exists, proceed with building the scene graph starting from the root.
    if (rootNode) {
        this.buildSceneGraph(rootId, this.graphLoader.nodes, this.app.scene); // Build the entire scene graph recursively
    }
}

// Method to recursively build the scene graph by processing nodes and their transformations.
buildSceneGraph(nodeId, nodes, parent, inheritedMaterial = null) {
    const node = nodes[nodeId]; // Get the current node from the nodes object
    const group = new THREE.Group(); // Create a new group (container) for the node and its children

    // Apply any transformations (translate, rotate, scale) if defined in the node
    if (node.transforms) {
        node.transforms.forEach(transform => {
            // Handle different types of transformations
            switch (transform.type) {
                case 'translate': // If it's a translation
                    group.position.set(
                        transform.amount.x || 0,
                        transform.amount.y || 0,
                        transform.amount.z || 0
                    );
                    break;
                case 'rotate': // If it's a rotation
                    group.rotation.set(
                        this.degToRad(transform.amount.x || 0), // Convert degrees to radians
                        this.degToRad(transform.amount.y || 0),
                        this.degToRad(transform.amount.z || 0)
                    );
                    break;
                case 'scale': // If it's a scale
                    group.scale.set(
                        transform.amount.x || 1,
                        transform.amount.y || 1,
                        transform.amount.z || 1
                    );
                    break;
            }
        });
    }

    // Determine the material for the node, considering inherited material or material reference from the node
    let currentMaterial = inheritedMaterial;
    if (node.materialRef && this.materialsLoader.materials[node.materialRef]) {
        currentMaterial = this.materialsLoader.materials[node.materialRef]; // Use the material if reference exists
    }

    // Determine if the node casts or receives shadows, using default values if not defined
    let castshadows = node.castshadows !== undefined ? node.castshadows : false;
    let receiveshadows = node.receiveshadows !== undefined ? node.receiveshadows : false;

    // Based on the geometry type, create the appropriate primitive (mesh or light)
    if (node.geometry && node.geometry.type === 'pointlight') {
        // Create a point light if the node geometry is a pointlight
        const light = this.pointLightPrimitive(node.geometry);
        this.lights.push(light); // Add to the lights array
        group.add(light); // Add the light to the current group
    } else if (node.geometry && node.geometry.type === 'directionallight') {
        // Create a directional light if the node geometry is a directionallight
        const light = this.directionalLightPrimitive(node.geometry);
        this.lights.push(light);
        group.add(light);
    } else if (node.geometry && node.geometry.type === 'spotlight') {
        // Create a spotlight if the node geometry is a spotlight
        const light = this.spotLightPrimitive(node.geometry);
        this.lights.push(light);
        group.add(light);
    } else if (node.geometry && node.geometry.type === 'rectangle') {
        // Create a rectangle mesh if the node geometry is a rectangle
        const mesh = this.rectanglePrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
        group.add(mesh);
    } else if (node.geometry && node.geometry.type === 'triangle') {
        // Create a triangle mesh if the node geometry is a triangle
        const mesh = this.trianglePrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
        group.add(mesh);
    } else if (node.geometry && node.geometry.type === 'box') {
        // Create a box mesh if the node geometry is a box
        const mesh = this.boxPrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
        group.add(mesh);
    } else if (node.geometry && node.geometry.type === 'sphere') {
        // Create a sphere mesh if the node geometry is a sphere
        const mesh = this.spherePrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
        group.add(mesh);
    } else if (node.geometry && node.geometry.type === 'cylinder') {
        // Create a cylinder mesh if the node geometry is a cylinder
        const mesh = this.cylinderPrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
        group.add(mesh);
    } else if (node.geometry && node.geometry.type === 'polygon') {
        // Create a polygon mesh if the node geometry is a polygon
        const mesh = this.polygonPrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
        this.polygons.push(mesh); // Add the polygon mesh to the polygons array
        group.add(mesh);
    } else if (node.geometry && node.geometry.type === 'nurbs') {
        // Create a NURBS surface mesh if the node geometry is a NURBS
        const mesh = this.nurbsPrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
        group.add(mesh);
    }

    // Add the group (with all the meshes and lights) to the parent (scene or another node)
    parent.add(group);

    // If the node has children, recursively build their scene graph
    if (node.children) {
        Object.values(node.children).forEach(childId => {
            this.buildSceneGraph(childId, nodes, group, currentMaterial); // Recursively process each child node
        });
    }
}

// Function to create a rectangle mesh in the 3D scene
rectanglePrimitive(primitive, material = null, castshadow = false, receiveShadow = false) {
    // Extract coordinates of two opposite corners from the 'primitive' object
    const x1 = primitive.xy1.x;  // X-coordinate of the first corner
    const y1 = primitive.xy1.y;  // Y-coordinate of the first corner

    const x2 = primitive.xy2.x;  // X-coordinate of the second corner
    const y2 = primitive.xy2.y;  // Y-coordinate of the second corner

    // Calculate the width and height of the rectangle using the absolute difference between the corner coordinates
    const width = Math.abs(x2 - x1);  // Width of the rectangle
    const height = Math.abs(y2 - y1);  // Height of the rectangle

    // Define the number of subdivisions (parts) along the X and Y axes, defaulting to 1 if not provided
    const parts_x = primitive.parts_x || 1;  // Number of segments along the X axis
    const parts_y = primitive.parts_y || 1;  // Number of segments along the Y axis

    // Create a new plane geometry with the specified width, height, and subdivisions
    const geometry = new THREE.PlaneGeometry(width, height, parts_x, parts_y);

    // If no material is passed, create a default white basic material
    const meshMaterial = material || new THREE.MeshBasicMaterial({
        color: 0xffffff,  // Default color is white
    });

    // Create a mesh using the plane geometry and material
    const mesh = new THREE.Mesh(geometry, meshMaterial);

    // Calculate the center of the rectangle by averaging the corner coordinates
    const centerX = (x1 + x2) / 2;  // Center X-coordinate
    const centerY = (y1 + y2) / 2;  // Center Y-coordinate

    // Set the position of the mesh to the center of the rectangle
    mesh.position.set(centerX, centerY, 0);

    // Set the shadow properties for the mesh
    mesh.castShadow = castshadow;  // Whether the mesh casts shadows
    mesh.receiveShadow = receiveShadow;  // Whether the mesh receives shadows

    // Return the created mesh
    return mesh;
}

// Function to create a triangle mesh in the 3D scene
trianglePrimitive(primitive, material = null, castshadow = false, receiveShadow = false) {
    // Create three Vector3 objects from the input primitive's corner coordinates (xyz1, xyz2, xyz3)
    const v1 = new THREE.Vector3(primitive.xyz1.x, primitive.xyz1.y, primitive.xyz1.z);  // First corner (vertex) of the triangle
    const v2 = new THREE.Vector3(primitive.xyz2.x, primitive.xyz2.y, primitive.xyz2.z);  // Second corner (vertex)
    const v3 = new THREE.Vector3(primitive.xyz3.x, primitive.xyz3.y, primitive.xyz3.z);  // Third corner (vertex)

    // Create a new BufferGeometry object to store the triangle's geometry
    const geometry = new THREE.BufferGeometry();

    // Define the vertices of the triangle using a Float32Array
    const vertices = new Float32Array([
        v1.x, v1.y, v1.z,  // Coordinates of the first vertex
        v2.x, v2.y, v2.z,  // Coordinates of the second vertex
        v3.x, v3.y, v3.z   // Coordinates of the third vertex
    ]);

    // Set the 'position' attribute of the geometry, which defines the vertex positions
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    // If no material is provided, use a default white MeshBasicMaterial
    const meshMaterial = material || new THREE.MeshBasicMaterial({color: 0xffffff});

    // Create the mesh using the defined geometry and material
    const triangle = new THREE.Mesh(geometry, meshMaterial);

    // Set the shadow properties for the triangle mesh
    triangle.castShadow = castshadow;  // Whether the mesh casts shadows
    triangle.receiveShadow = receiveShadow;  // Whether the mesh receives shadows

    // Return the created triangle mesh
    return triangle;
}

// Function to create a box mesh in the 3D scene
boxPrimitive(primitive, material = null, castshadow = false, receiveShadow = false) {
    // Extract the coordinates of two opposite corners from the 'primitive' object
    const x1 = primitive.xyz1.x;  // X-coordinate of the first corner
    const y1 = primitive.xyz1.y;  // Y-coordinate of the first corner
    const z1 = primitive.xyz1.z;  // Z-coordinate of the first corner

    const x2 = primitive.xyz2.x;  // X-coordinate of the second corner
    const y2 = primitive.xyz2.y;  // Y-coordinate of the second corner
    const z2 = primitive.xyz2.z;  // Z-coordinate of the second corner

    // Calculate the width, height, and depth of the box using the absolute difference between corner coordinates
    const width = Math.abs(x2 - x1);  // Width of the box
    const height = Math.abs(y2 - y1);  // Height of the box
    const depth = Math.abs(z2 - z1);  // Depth of the box

    // Define the number of subdivisions (parts) along the X, Y, and Z axes, defaulting to 1 if not provided
    const parts_x = primitive.parts_x || 1;  // Number of segments along the X axis
    const parts_y = primitive.parts_y || 1;  // Number of segments along the Y axis
    const parts_z = primitive.parts_z || 1;  // Number of segments along the Z axis

    // Create a new BoxGeometry object with the specified width, height, depth, and subdivisions
    const geometry = new THREE.BoxGeometry(width, height, depth, parts_x, parts_y, parts_z);

    // If no material is passed, use a default pinkish color (0xff00ff) as the material
    const meshMaterial = material || new THREE.MeshBasicMaterial({
        color: 0xff00ff,  // Default color is pink
    });

    // Create the mesh using the geometry and material
    const mesh = new THREE.Mesh(geometry, meshMaterial);

    // Calculate the center of the box by averaging the corner coordinates
    const centerX = (x1 + x2) / 2;  // Center X-coordinate
    const centerY = (y1 + y2) / 2;  // Center Y-coordinate
    const centerZ = (z1 + z2) / 2;  // Center Z-coordinate

    // Set the position of the mesh to the center of the box
    mesh.position.set(centerX, centerY, centerZ);

    // Set shadow properties for the box mesh
    mesh.castShadow = castshadow;  // Whether the box casts shadows
    mesh.receiveShadow = receiveShadow;  // Whether the box receives shadows

    // Return the created box mesh
    return mesh;
}

// Function to create a sphere mesh in the 3D scene
spherePrimitive(primitive, material = null, castshadow = false, receiveShadow = false) {
    // Extract the radius, slices, and stacks from the 'primitive' object
    const radius = primitive.radius;  // Radius of the sphere
    const slices = primitive.slices;  // Number of slices (longitude segments)
    const stacks = primitive.stacks;  // Number of stacks (latitude segments)

    // Create a new SphereGeometry object using the specified radius, slices, and stacks
    const geometry = new THREE.SphereGeometry(radius, slices, stacks);

    // If no material is provided, use a default black color (0x000000) for the sphere's material
    const meshMaterial = material || new THREE.MeshBasicMaterial({color: 0x000000});

    // Create the mesh using the sphere geometry and material
    const mesh = new THREE.Mesh(geometry, meshMaterial);

    // Set the shadow properties for the sphere mesh
    mesh.castShadow = castshadow;  // Whether the sphere casts shadows
    mesh.receiveShadow = receiveShadow;  // Whether the sphere receives shadows

    // Return the created sphere mesh
    return mesh;
}

// Function to create a cylinder mesh in the 3D scene
cylinderPrimitive(primitive, material = null, castshadow = false, receiveShadow = false) {
    // Extract the cylinder parameters from the 'primitive' object
    const radiusTop = primitive.top;  // Radius of the top of the cylinder
    const radiusBottom = primitive.base;  // Radius of the bottom of the cylinder
    const height = primitive.height;  // Height of the cylinder
    const slices = primitive.slices;  // Number of radial segments (divisions around the circumference)
    const stacks = primitive.stacks;  // Number of vertical segments (divisions along the height)

    // Default values for optional properties
    var capsclose = true;  // Whether the top and bottom caps of the cylinder are closed (default is true)
    var thetastart = 0;  // Starting angle for the circular arc (default is 0, which corresponds to a full circle)
    var thetalength = 2 * Math.PI;  // Length of the circular arc (default is 2π, representing a full circle)

    // Override the 'capsclose' value if provided in 'primitive'
    if (primitive.capsclose !== undefined) {
        capsclose = !primitive.capsclose;  // Invert the 'capsclose' flag if specified
    }

    // Override the 'thetastart' value if provided, converting degrees to radians
    if (primitive.thetastart !== undefined) {
        thetastart = this.degToRad(primitive.thetastart);  // Convert start angle from degrees to radians
    }

    // Override the 'thetalength' value if provided, converting degrees to radians
    if (primitive.thetalength !== undefined) {
        thetalength = this.degToRad(primitive.thetalength);  // Convert angle length from degrees to radians
    }

    // Create the CylinderGeometry with the specified parameters
    const geometry = new THREE.CylinderGeometry(
        radiusTop,          // Radius at the top of the cylinder
        radiusBottom,       // Radius at the bottom of the cylinder
        height,             // Height of the cylinder
        slices,             // Number of radial segments (slices)
        stacks,             // Number of vertical segments (stacks)
        capsclose,          // Whether the caps are closed
        thetastart,         // Starting angle of the arc
        thetalength         // Length of the arc
    );

    // If no material is provided, use a default white color (0xffffff)
    const meshMaterial = material || new THREE.MeshBasicMaterial({
        color: 0xffffff  // Default material color is white
    });

    // Create the mesh with the geometry and material
    const mesh = new THREE.Mesh(geometry, meshMaterial);

    // Set shadow properties for the cylinder mesh
    mesh.castShadow = castshadow;  // Whether the cylinder casts shadows
    mesh.receiveShadow = receiveShadow;  // Whether the cylinder receives shadows

    // Return the created cylinder mesh
    return mesh;
}

// Function to create a point light source in the 3D scene
pointLightPrimitive(primitive) {
    // Extract the color from the 'primitive' object and create a THREE.Color object
    const color = new THREE.Color(
        primitive.color.r,  // Red component of the light color
        primitive.color.g,  // Green component of the light color
        primitive.color.b   // Blue component of the light color
    );

    // Extract other light properties from the 'primitive' object
    const intensity = primitive.intensity;  // Intensity (brightness) of the light
    const distance = primitive.distance || 0;  // Maximum distance the light affects (default is 0, meaning no limit)
    const decay = primitive.decay || 1;  // The rate at which the light intensity decreases with distance (default is 1)

    // Create a THREE.PointLight object using the extracted properties
    const light = new THREE.PointLight(color, intensity, distance, decay);

    // Set the position of the point light source
    light.position.set(
        primitive.position.x || 0,  // X position of the light (default is 0)
        primitive.position.y || 0,  // Y position of the light (default is 0)
        primitive.position.z || 0   // Z position of the light (default is 0)
    );

    // If the 'castshadow' property is provided, set the light's 'castShadow' property
    if (primitive.castshadow !== undefined) {
        light.castShadow = primitive.castshadow;  // Whether the light casts shadows (true/false)
    }

    // Return the created point light
    return light;
}

// Function to create a directional light source in the 3D scene
directionalLightPrimitive(primitive) {
    // Extract the color from the 'primitive' object and create a THREE.Color object
    const color = new THREE.Color(
        primitive.color.r,  // Red component of the light color
        primitive.color.g,  // Green component of the light color
        primitive.color.b   // Blue component of the light color
    );
    
    // Extract the intensity of the light from the 'primitive' object
    const intensity = primitive.intensity;  // Intensity (brightness) of the light

    // Create a THREE.DirectionalLight object using the extracted color and intensity
    const light = new THREE.DirectionalLight(color, intensity);

    // Set the position of the directional light source
    light.position.set(
        primitive.position.x || 0,  // X position of the light (default is 0)
        primitive.position.y || 0,  // Y position of the light (default is 0)
        primitive.position.z || 0   // Z position of the light (default is 0)
    );

    // If the 'castshadow' property is provided, set the light's 'castShadow' property
    if (primitive.castshadow !== undefined) {
        light.castShadow = primitive.castshadow;  // Whether the light casts shadows (true/false)
    }

    // Return the created directional light
    return light;
}

// Function to create a spotlight in the 3D scene
spotLightPrimitive(primitive) {
    // Extract the color from the 'primitive' object and create a THREE.Color object
    const color = new THREE.Color(
        primitive.color.r,  // Red component of the light color
        primitive.color.g,  // Green component of the light color
        primitive.color.b   // Blue component of the light color
    );

    // Extract the intensity of the light from the 'primitive' object
    const intensity = primitive.intensity;  // Intensity (brightness) of the light
    
    // Extract other light properties from the 'primitive' object
    const distance = primitive.distance || 1000;  // Maximum distance the light affects (default is 1000)
    const angle = primitive.angle || Math.PI / 4; // The angle of the spotlight cone (default is 45 degrees, i.e., PI/4)
    const decay = primitive.decay || 2;           // The rate at which the light intensity decreases (default is 2)
    const penumbra = primitive.penumbra || 1;     // The soft edge of the spotlight cone (default is 1)

    // Create a THREE.SpotLight object using the extracted properties
    const light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);

    // Set the position of the spotlight source
    light.position.set(
        primitive.position.x || 0,  // X position of the light (default is 0)
        primitive.position.y || 0,  // Y position of the light (default is 0)
        primitive.position.z || 0   // Z position of the light (default is 0)
    );

    // If the 'target' property is provided, create a target object for the spotlight to point at
    if (primitive.target) {
        // Create a new object to act as the target of the spotlight
        const target = new THREE.Object3D();
        target.position.set(
            primitive.target.x || 0,  // X position of the target (default is 0)
            primitive.target.y || 0,  // Y position of the target (default is 0)
            primitive.target.z || 0   // Z position of the target (default is 0)
        );
        // Set the spotlight's target to this object
        light.target = target;
    }

    // If the 'castshadow' property is provided, set whether the spotlight casts shadows
    if (primitive.castshadow !== undefined) {
        light.castShadow = primitive.castshadow;  // Whether the light casts shadows (true/false)
    }

    // Return the created spotlight
    return light;
}

// Function to create a polygon mesh (like a cone or pyramid) in 3D space
polygonPrimitive(primitive, wireframe = false, castshadow = false, receiveShadow = false) {
    // Extract properties from the 'primitive' object
    const radius = primitive.radius;           // The radius of the base of the polygon
    const stacks = primitive.stacks;           // The number of stacks (horizontal layers of vertices)
    const slices = primitive.slices;           // The number of slices (segments around the circle)
    
    // Define the colors for the bottom (color_c) and top (color_p) of the polygon
    const color_c = new THREE.Color(
        primitive.color_c.r,  // Red component of the bottom color
        primitive.color_c.g,  // Green component of the bottom color
        primitive.color_c.b   // Blue component of the bottom color
    );
    const color_p = new THREE.Color(
        primitive.color_p.r,  // Red component of the top color
        primitive.color_p.g,  // Green component of the top color
        primitive.color_p.b   // Blue component of the top color
    );

    // Arrays to hold the vertex data for the polygon
    const positions = [];  // Store vertex positions (x, y, z)
    const colors = [];     // Store vertex colors (r, g, b)
    const normals = [];    // Store vertex normals for lighting calculations
    const indices = [];    // Store indices to define faces

    // Add center vertex for the polygon (this will be the center point of the base)
    positions.push(0, 0, 0); 
    colors.push(color_c.r, color_c.g, color_c.b);  // Color at the center (bottom color)
    normals.push(0, 0, 1); // Normal pointing upwards (flat on the xy-plane)

    // Generate the vertices for each stack and slice of the polygon
    for (let stack = 1; stack <= stacks; stack++) {
        const stackRadius = (stack / stacks) * radius;  // Reduce radius for each stack (higher stacks have smaller radius)
        for (let slice = 0; slice < slices; slice++) {
            const theta = (slice / slices) * Math.PI * 2;  // Angle for this slice, distributed around a circle
            const x = Math.cos(theta) * stackRadius;      // Calculate x position
            const y = Math.sin(theta) * stackRadius;      // Calculate y position
            positions.push(x, y, 0);                      // Push the vertex position

            // Interpolate color between the bottom and top colors based on stack height
            const t = stack / stacks;  // Interpolation factor (0 at the bottom, 1 at the top)
            const interpolatedColor = new THREE.Color(
                color_c.r + t * (color_p.r - color_c.r),  // Interpolate red component
                color_c.g + t * (color_p.g - color_c.g),  // Interpolate green component
                color_c.b + t * (color_p.b - color_c.b)   // Interpolate blue component
            );
            colors.push(interpolatedColor.r, interpolatedColor.g, interpolatedColor.b);  // Push the color for this vertex

            // Normals for each vertex (flat on the xy-plane, pointing upwards)
            normals.push(0, 0, 1);
        }
    }

    // Generate the indices that define the faces of the polygon
    for (let stack = 0; stack < stacks; stack++) {
        for (let slice = 0; slice < slices; slice++) {
            // Indices for vertices to form triangles for the polygon faces
            const current = stack * slices + slice + 1;                      // Current vertex in the stack
            const next = stack * slices + ((slice + 1) % slices) + 1;        // Next vertex in the stack (wrap around at the end)
            const nextStack = (stack + 1) * slices + slice + 1;               // Vertex in the next stack
            const nextStackNext = (stack + 1) * slices + ((slice + 1) % slices) + 1;  // Next vertex in the next stack

            // Handle faces for the first and last stack (cone or pyramid-like shape)
            if (stack === 0 || stack === stacks - 1) {
                indices.push(0, current, next);  // Base faces (from center to each slice)
            } else {
                // Middle stacks: create two triangles for each face
                indices.push(current, nextStack, nextStackNext);
                indices.push(current, nextStackNext, next);
            }
        }
    }

    // Create a BufferGeometry to hold the vertex data and indices
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));  // Set vertex positions
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));        // Set vertex colors
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));      // Set normals
    geometry.setIndex(indices);  // Set the indices to define the polygon's faces

    // Create a Material for the mesh, using MeshStandardMaterial for better lighting/shading
    const meshMaterial = new THREE.MeshStandardMaterial({
        vertexColors: true,  // Use vertex colors for the mesh
        wireframe: wireframe  // Enable or disable wireframe mode
    });

    // Create a Mesh from the geometry and material
    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.castShadow = castshadow;  // Set whether the mesh casts shadows
    mesh.receiveShadow = receiveShadow;  // Set whether the mesh receives shadows

    // Return the created mesh
    return mesh;
}

// Function to create a NURBS (Non-Uniform Rational B-Splines) surface
nurbsPrimitive(primitive, material = null, castshadow = false, receiveShadow = false) {
    // Extract properties from the 'primitive' object
    const degreeU = primitive.degree_u;     // Degree of the surface in the U direction (horizontal)
    const degreeV = primitive.degree_v;     // Degree of the surface in the V direction (vertical)
    const partsU = primitive.parts_u;       // Number of parts (divisions) in the U direction for the parametric surface
    const partsV = primitive.parts_v;       // Number of parts (divisions) in the V direction for the parametric surface
    const controlPoints = primitive.controlpoints;  // Array of control points defining the NURBS surface
    
    // Initialize an empty array to hold the control points in a 2D grid
    const controlPointsArray = [];

    // Populate the controlPointsArray with the control points
    // Each control point is represented by [x, y, z, w] where w is the weight (set to 1 by default)
    for (let i = 0; i <= degreeU; i++) {
        const row = [];
        for (let j = 0; j <= degreeV; j++) {
            const index = i * (degreeV + 1) + j;  // Calculate the 1D index from the 2D grid
            const controlPointData = controlPoints[index];  // Fetch the control point
            row.push([controlPointData.x, controlPointData.y, controlPointData.z, 1]);  // Store with default weight 1
        }
        controlPointsArray.push(row);  // Add the row of control points to the controlPointsArray
    }

    // Initialize knot vectors for the U and V directions (used for NURBS calculation)
    const knotsU = [];
    const knotsV = [];

    // Create the U-direction knot vector: the first half is 0's, the second half is 1's
    for (let i = 0; i <= degreeU; i++) {
        knotsU.push(0);  // First half of U knots (0's)
    }
    for (let i = 0; i <= degreeU; i++) {
        knotsU.push(1);  // Second half of U knots (1's)
    }

    // Create the V-direction knot vector: the first half is 0's, the second half is 1's
    for (let i = 0; i <= degreeV; i++) {
        knotsV.push(0);  // First half of V knots (0's)
    }
    for (let i = 0; i <= degreeV; i++) {
        knotsV.push(1);  // Second half of V knots (1's)
    }

    // Convert the control points into THREE.Vector4 objects, to work with the NURBS surface
    let stackedPoints = [];

    for (let i = 0; i < controlPointsArray.length; i++) {
        let row = controlPointsArray[i];
        let newRow = [];

        // Convert each control point (x, y, z, w) to a THREE.Vector4 object
        for (let j = 0; j < row.length; j++) {
            let item = row[j];
            newRow.push(new THREE.Vector4(item[0], item[1], item[2], item[3]));  // Convert to Vector4
        }

        stackedPoints[i] = newRow;  // Add the new row of Vector4 control points to the stackedPoints array
    }

    // Create a NURBS surface object using the degree, knot vectors, and control points
    const nurbsSurface = new NURBSSurface(degreeU, degreeV, knotsU, knotsV, stackedPoints);

    // Create geometry from the NURBS surface using ParametricGeometry
    // The geometry is generated by evaluating the NURBS surface at each (u, v) parameter pair
    const geometry = new ParametricGeometry((u, v, target) => {
        return nurbsSurface.getPoint(u, v, target);  // Get the point on the NURBS surface for the given u and v
    }, partsU, partsV);  // Divide the surface into 'partsU' and 'partsV' segments

    // Set the material for the mesh, using a default color if none is provided
    const meshMaterial = material || new THREE.MeshBasicMaterial({ color: 0x111111 });

    // Create the mesh using the geometry and material
    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.castShadow = castshadow;  // Set whether the mesh should cast shadows
    mesh.receiveShadow = receiveShadow;  // Set whether the mesh should receive shadows

    // Return the created mesh
    return mesh;
}

    // Helper function to convert degrees to radians
    degToRad(degrees) {
    return degrees * (Math.PI / 180);  // Convert degrees to radians
    }
}

export {ObjectCreator};
