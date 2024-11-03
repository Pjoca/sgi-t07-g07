import * as THREE from 'three';

/**
 * MyFlower class to create a flower shape with petals, a spherical center, and a curved stem.
 */
class MyFlower {
    constructor() {
        // Create a group to hold the entire flower components (stem, center, petals)
        this.flowerGroup = new THREE.Group(); 
        this.createFlower(); // Call method to initiate the flower creation
    }

    /**
     * Method to create the complete flower structure
     * It calls methods to create the stem, center, and petals.
     */
    createFlower() {
        this.createStem();   // Create the stem of the flower
        this.createCenter(); // Create the central spherical part of the flower
        this.createPetals(); // Create the petals surrounding the center
    }

    /**
     * Creates a curved stem using a LineCurve3.
     */
    createStem() {
        // Define the control points for the curved stem using Catmull-Rom curve
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),      // Start point
            new THREE.Vector3(0.25, 0.5, 0), // Control point for curvature
            new THREE.Vector3(-0.25, 1.5, 0), // Another control point
            new THREE.Vector3(0, 3, 0)       // End point
        ]);

        // Generate points along the curve for stem segments
        const points = curve.getPoints(50);

        // Define radius and material for the stem
        const stemRadius = 0.05; // Thickness of the stem
        const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });

        // Iterate through points to create segments of the stem
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i]; // Current point
            const p2 = points[i + 1]; // Next point

            // Calculate direction and distance between points
            const direction = new THREE.Vector3().subVectors(p2, p1).normalize(); // Direction vector
            const distance = p1.distanceTo(p2); // Distance between points

            // Create a cylinder geometry to represent the stem segment
            const cylinderGeometry = new THREE.CylinderGeometry(stemRadius, stemRadius, distance, 8); // 8 segments for smoothness
            const cylinder = new THREE.Mesh(cylinderGeometry, stemMaterial);

            // Position and orient the cylinder
            cylinder.position.copy(p1); // Position the cylinder at the current point
            cylinder.lookAt(p2); // Rotate the cylinder to face the next point
            cylinder.rotateX(Math.PI / 2); // Adjust rotation to make it upright

            // Add the cylinder to the flower group
            this.flowerGroup.add(cylinder);
        }
    }

    /**
     * Creates the spherical center of the flower.
     */
    createCenter() {
        // Create a sphere geometry to represent the center of the flower
        const centerGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Sphere with specified radius and segments
        const centerMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFD700, // Golden color for the center
            shininess: 100 // Material shininess
        });

        const center = new THREE.Mesh(centerGeometry, centerMaterial); // Create mesh for the center
        center.position.set(0, 3, 0); // Position the sphere at the top of the stem
        this.flowerGroup.add(center); // Add the center to the flower group
    }

    /**
     * Creates the flower petals and adds them to a separate group.
     */
    createPetals() {
        const petalGroup = new THREE.Group(); // Group to hold all petals

        // Define the shape of a single petal
        const petalGeometry = new THREE.Shape();
        petalGeometry.moveTo(0, 0); // Start at origin
        petalGeometry.quadraticCurveTo(0.3, 1, 0, 2); // Create a quadratic curve for one side of the petal
        petalGeometry.quadraticCurveTo(-0.3, 1, 0, 0); // Complete the petal shape

        const petalExtrudeSettings = {
            depth: 0.1, // Depth of the petal (thickness)
            bevelEnabled: false // Disable bevel for the edges
        };

        // Define material properties for the petals
        const petalMaterial = new THREE.MeshPhongMaterial({
            color: 0x9400D3, // Color for the petals (purple)
            shininess: 100, // Material shininess
            side: THREE.DoubleSide // Render both sides of the petals
        });

        const petalRadius = 0.7; // Radius from the center to position petals

        // Create multiple petals in a circular arrangement
        for (let i = 0; i < 8; i++) { // Create 8 petals
            const petalMesh = new THREE.Mesh(
                new THREE.ExtrudeGeometry(petalGeometry, petalExtrudeSettings), // Extrude the petal shape to create 3D mesh
                petalMaterial
            );

            // Calculate angle for even distribution of petals
            const angle = (i * Math.PI) / 4; // 45 degrees between each petal

            // Set the position of each petal around the center
            petalMesh.position.set(
                Math.cos(angle) * petalRadius, // x position using cosine for circular distribution
                Math.sin(angle) * petalRadius, // y position using sine for circular distribution
                -0.2 // z position to ensure petals are slightly behind the sphere
            );

            // Rotate petals to face outward
            petalMesh.rotation.z = angle + Math.PI / 2; // Rotate by angle and offset by 90 degrees

            petalGroup.add(petalMesh); // Add each petal to the petal group
        }

        // Tilt the entire petal group upward
        petalGroup.position.set(0, 3, 0); // Position the petal group at the top of the stem
        petalGroup.rotation.x = -Math.PI / 6; // Tilt petals slightly upward

        this.flowerGroup.add(petalGroup); // Add the petal group to the main flower group
    }

    /**
     * Returns the flower group containing all the components
     * @returns {THREE.Group} The flower group
     */
    getMesh() {
        return this.flowerGroup; // Return the complete flower group
    }

    /**
     * Method to build and position the flower
     * @param {THREE.Vector3} position - The position to place the flower
     * @param {THREE.Vector3} scale - The scale to apply to the flower
     */
    build(position, scale) {
        this.flowerGroup.position.copy(position); // Set the position of the flower
        this.flowerGroup.scale.copy(scale); // Set the scale of the flower
    }
}

export { MyFlower }; // Export the MyFlower class for use in other modules
