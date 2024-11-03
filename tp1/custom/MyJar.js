import * as THREE from 'three';

class MyJar {
    constructor() {
        this.jarGroup = new THREE.Group();
        this.createJar();
        this.addDirtLayer(); // Add the dirt layer after creating the jar
    }

    createJar() {
        const jarHeight = 3;
        const jarThickness = 0.1;
        const radialSegments = 32;
        const heightSegments = 32;

        const outerVertices = [];
        const innerVertices = [];
        const indices = [];

        // Generate vertices for both outer and inner surfaces
        for (let j = 0; j <= heightSegments; j++) {
            const v = j / heightSegments;
            const outerRadius = this.getJarRadius(v) + jarThickness;
            const innerRadius = this.getJarRadius(v);
            const y = v * jarHeight;

            for (let i = 0; i <= radialSegments; i++) {
                const u = i / radialSegments;
                const angle = 2 * Math.PI * u;

                // Outer vertices
                const outerX = outerRadius * Math.cos(angle);
                const outerZ = outerRadius * Math.sin(angle);
                outerVertices.push(outerX, y, outerZ);

                // Inner vertices
                const innerX = innerRadius * Math.cos(angle);
                const innerZ = innerRadius * Math.sin(angle);
                innerVertices.push(innerX, y, innerZ);
            }
        }

        // Create BufferGeometry for the outer surface
        const jarGeometry = new THREE.BufferGeometry();
        const combinedVertices = new Float32Array(outerVertices.concat(innerVertices));
        jarGeometry.setAttribute('position', new THREE.BufferAttribute(combinedVertices, 3));

        // Define indices for two-sided faces
        for (let j = 0; j < heightSegments; j++) {
            for (let i = 0; i < radialSegments; i++) {
                const a = j * (radialSegments + 1) + i;
                const b = j * (radialSegments + 1) + i + 1;
                const c = (j + 1) * (radialSegments + 1) + i + 1;
                const d = (j + 1) * (radialSegments + 1) + i;

                // Two triangles for each quad (outer)
                indices.push(a, b, c);
                indices.push(a, c, d);

                // Two triangles for each quad (inner)
                indices.push(a + (radialSegments + 1) * (heightSegments + 1), 
                             d + (radialSegments + 1) * (heightSegments + 1), 
                             c + (radialSegments + 1) * (heightSegments + 1));
                indices.push(a + (radialSegments + 1) * (heightSegments + 1), 
                             c + (radialSegments + 1) * (heightSegments + 1), 
                             b + (radialSegments + 1) * (heightSegments + 1));
            }
        }

        jarGeometry.setIndex(indices);
        jarGeometry.computeVertexNormals();

        const jarMaterial = new THREE.MeshPhongMaterial({
            color: 0x4B2E2E,
            side: THREE.DoubleSide
        });

        const jarMesh = new THREE.Mesh(jarGeometry, jarMaterial);
        this.jarGroup.add(jarMesh);
    }

    addDirtLayer() {
        const jarHeight = 3;
        const smallestInnerRadius = this.getJarRadius(0); // Radius at the base of the jar
        const dirtRadius = smallestInnerRadius+0.2; // Slightly smaller to fit inside
        const dirtHeight = jarHeight * 0.8; // Adjust height as desired for the dirt layer

        // Create a cylinder geometry for the dirt layer
        const dirtGeometry = new THREE.CylinderGeometry(
            dirtRadius, // Bottom radius
            dirtRadius, // Top radius
            dirtHeight, // Height of the dirt
            32 // Number of segments
        );

        // Dirt material with a brown color
        const dirtMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513, // Dark brown color for soil
            flatShading: true
        });

        // Create the dirt mesh
        const dirtMesh = new THREE.Mesh(dirtGeometry, dirtMaterial);

        // Position the dirt layer to sit at the bottom of the jar
        dirtMesh.position.y = (dirtHeight - jarHeight+4.1) / 2;

        // Add the dirt layer to the jar group
        this.jarGroup.add(dirtMesh);
    }

    getJarRadius(v) {
        // Jar profile function
        if (v < 0.2) return 0.8 + 2 * v;
        if (v < 0.5) return 1.2;
        if (v < 0.8) return 1.4 - 0.4 * (v - 0.5);
        return 1.1;
    }

    getMesh() {
        return this.jarGroup;
    }

    build(position, scale) {
        this.jarGroup.position.copy(position);
        this.jarGroup.scale.copy(scale);
    }
}

export { MyJar };
