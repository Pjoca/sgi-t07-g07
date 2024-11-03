import * as THREE from 'three';

class MyJar {
    constructor() {
        // Create a group to hold the jar components (jar and dirt layer)
        this.jarGroup = new THREE.Group();
        this.createJar(); // Call method to create the jar structure
        this.addDirtLayer(); // Add the dirt layer after creating the jar
    }

    /**
     * Creates the jar structure with outer and inner surfaces.
     */
    createJar() {
        const jarHeight = 3; // Height of the jar
        const jarThickness = 0.1; // Thickness of the jar walls
        const radialSegments = 32; // Number of segments around the radial direction
        const heightSegments = 32; // Number of segments along the height

        const outerVertices = []; // Array to hold outer surface vertices
        const innerVertices = []; // Array to hold inner surface vertices
        const indices = []; // Array to hold the indices for face definitions

        // Generate vertices for both outer and inner surfaces of the jar
        for (let j = 0; j <= heightSegments; j++) {
            const v = j / heightSegments; // Normalized height from 0 to 1
            const outerRadius = this.getJarRadius(v) + jarThickness; // Outer radius with thickness
            const innerRadius = this.getJarRadius(v); // Inner radius
            const y = v * jarHeight; // Calculate y position based on height segment

            for (let i = 0; i <= radialSegments; i++) {
                const u = i / radialSegments; // Normalized angle
                const angle = 2 * Math.PI * u; // Angle for the current segment

                // Calculate outer vertices
                const outerX = outerRadius * Math.cos(angle);
                const outerZ = outerRadius * Math.sin(angle);
                outerVertices.push(outerX, y, outerZ); // Push outer vertex to array

                // Calculate inner vertices
                const innerX = innerRadius * Math.cos(angle);
                const innerZ = innerRadius * Math.sin(angle);
                innerVertices.push(innerX, y, innerZ); // Push inner vertex to array
            }
        }

        // Create BufferGeometry for the jar using outer and inner vertices
        const jarGeometry = new THREE.BufferGeometry();
        const combinedVertices = new Float32Array(outerVertices.concat(innerVertices)); // Combine vertices
        jarGeometry.setAttribute('position', new THREE.BufferAttribute(combinedVertices, 3)); // Set position attribute

        // Define indices for creating two-sided faces
        for (let j = 0; j < heightSegments; j++) {
            for (let i = 0; i < radialSegments; i++) {
                const a = j * (radialSegments + 1) + i; // Index for vertex a
                const b = j * (radialSegments + 1) + i + 1; // Index for vertex b
                const c = (j + 1) * (radialSegments + 1) + i + 1; // Index for vertex c
                const d = (j + 1) * (radialSegments + 1) + i; // Index for vertex d

                // Two triangles for each quad on the outer surface
                indices.push(a, b, c);
                indices.push(a, c, d);

                // Two triangles for each quad on the inner surface
                indices.push(a + (radialSegments + 1) * (heightSegments + 1), 
                             d + (radialSegments + 1) * (heightSegments + 1), 
                             c + (radialSegments + 1) * (heightSegments + 1));
                indices.push(a + (radialSegments + 1) * (heightSegments + 1), 
                             c + (radialSegments + 1) * (heightSegments + 1), 
                             b + (radialSegments + 1) * (heightSegments + 1));
            }
        }

        jarGeometry.setIndex(indices); // Set indices for the geometry
        jarGeometry.computeVertexNormals(); // Compute normals for shading

        // Define material properties for the jar
        const jarMaterial = new THREE.MeshPhongMaterial({
            color: 0x4B2E2E, // Color of the jar (dark brown)
            side: THREE.DoubleSide // Render both sides of the jar faces
        });

        // Create mesh for the jar and add it to the jar group
        const jarMesh = new THREE.Mesh(jarGeometry, jarMaterial);
        this.jarGroup.add(jarMesh); // Add the jar mesh to the group
    }

    /**
     * Adds a dirt layer inside the jar.
     */
    addDirtLayer() {
        const jarHeight = 3; // Height of the jar
        const smallestInnerRadius = this.getJarRadius(0); // Radius at the base of the jar
        const dirtRadius = smallestInnerRadius + 0.2; // Radius for dirt layer, slightly larger than inner radius
        const dirtHeight = jarHeight * 0.8; // Height of the dirt layer (adjust as needed)

        // Create a cylinder geometry for the dirt layer
        const dirtGeometry = new THREE.CylinderGeometry(
            dirtRadius, // Bottom radius of the cylinder
            dirtRadius, // Top radius of the cylinder
            dirtHeight, // Height of the dirt cylinder
            32 // Number of segments around the cylinder
        );

        // Define material properties for the dirt
        const dirtMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513, // Dark brown color for soil
            flatShading: true // Use flat shading for a more rugged look
        });

        // Create the dirt mesh using the geometry and material
        const dirtMesh = new THREE.Mesh(dirtGeometry, dirtMaterial);

        // Position the dirt layer to sit at the bottom of the jar
        dirtMesh.position.y = (dirtHeight - jarHeight + 4.1) / 2; // Center the dirt layer vertically

        // Add the dirt layer mesh to the jar group
        this.jarGroup.add(dirtMesh);
    }

    /**
     * Jar profile function that defines the radius based on the height.
     * @param {number} v - Normalized height value (0 to 1)
     * @returns {number} - Calculated radius at that height
     */
    getJarRadius(v) {
        if (v < 0.2) return 0.8 + 2 * v; // Increase radius as height approaches 0.2
        if (v < 0.5) return 1.2; // Fixed radius between 0.2 and 0.5
        if (v < 0.8) return 1.4 - 0.4 * (v - 0.5); // Decrease radius as height approaches 0.8
        return 1.1; // Fixed radius above 0.8
    }

    /**
     * Returns the jar group containing all components.
     * @returns {THREE.Group} The jar group
     */
    getMesh() {
        return this.jarGroup; // Return the complete jar group
    }

    /**
     * Method to build and position the jar in the scene.
     * @param {THREE.Vector3} position - Position to place the jar
     * @param {THREE.Vector3} scale - Scale to apply to the jar
     */
    build(position, scale) {
        this.jarGroup.position.copy(position); // Set the position of the jar group
        this.jarGroup.scale.copy(scale); // Set the scale of the jar group
    }
}

export { MyJar }; // Export the MyJar class for use in other modules
