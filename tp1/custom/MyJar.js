import * as THREE from 'three';

class MyJar {
    constructor() {
        this.jarGroup = new THREE.Group(); // Group to hold the jar components
        this.createJar();
    }

    createJar() {
        const jarHeight = 3; // Total height of the jar
        const jarThickness = 0.1; // Thickness of the jar walls

        // Define the jar profile (outline) to create a more complex shape
        const jarProfile = [
            new THREE.Vector2(0.8, 0), // Bottom outer radius and base
            new THREE.Vector2(1.2, 0.5), // Curve outwards near the bottom
            new THREE.Vector2(1.4, 1.5), // Gradual widening
            new THREE.Vector2(1.3, 2.5), // Taper inwards at the neck
            new THREE.Vector2(1.1, 3), // Top of the jar
        ];

        // Outer curved surface of the jar using LatheGeometry
        const jarOuterGeometry = new THREE.LatheGeometry(jarProfile, 32);
        const jarOuterMaterial = new THREE.MeshPhongMaterial({
            color: 0x4B2E2E, // Dark brown color
            side: THREE.DoubleSide,
        });
        const jarOuterMesh = new THREE.Mesh(jarOuterGeometry, jarOuterMaterial);
        jarOuterMesh.position.y = jarHeight / 2; // Adjust position to center the jar

        // Inner curved surface of the jar
        const jarInnerProfile = jarProfile.map(point => {
            return new THREE.Vector2(point.x - jarThickness, point.y);
        });
        const jarInnerGeometry = new THREE.LatheGeometry(jarInnerProfile, 32);
        const jarInnerMaterial = new THREE.MeshPhongMaterial({
            color: 0x4B2E2E, // Same dark brown color or a different color if desired
            side: THREE.DoubleSide,
        });
        const jarInnerMesh = new THREE.Mesh(jarInnerGeometry, jarInnerMaterial);
        jarInnerMesh.position.y = jarHeight / 2; // Center the inner surface vertically

        // Solid dirt filling the inside of the jar
        const smallestInnerRadius = Math.min(...jarInnerProfile.map(point => point.x)); // Find the smallest inner radius
        const jarDirtRadius = smallestInnerRadius ; // Slightly smaller to fit inside
        const jarDirtHeight = jarHeight * 0.9; // Reduce the dirt height further to 60% of the jar height

        const jarDirtGeometry = new THREE.CylinderGeometry(
            jarDirtRadius, // Bottom radius of the dirt
            jarDirtRadius, // Top radius of the dirt
            jarDirtHeight, // Reduced height of the dirt
            32 // Number of segments for smoothness
        );

        const jarDirtMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B5A2B, // Lighter brown color for soil
        });
        const jarDirtMesh = new THREE.Mesh(jarDirtGeometry, jarDirtMaterial);

        // Adjust the vertical position of the dirt to be inside the jar, sitting at the bottom
        jarDirtMesh.position.y = (jarHeight - jarDirtHeight) / 2 - (0.1*jarHeight-3.2); // Lower the dirt so it sits well inside the jar

        // Add all components to the jar group
        this.jarGroup.add(jarDirtMesh); // Add dirt first, so it appears inside the jar
        this.jarGroup.add(jarOuterMesh); // Add outer surface on top
        this.jarGroup.add(jarInnerMesh); // Add inner surface to create the double wall effect
    }

    /**
     * Returns the jar group containing all the components
     * @returns {THREE.Group} The jar group
     */
    getMesh() {
        return this.jarGroup;
    }

    /**
     * Method to build and position the jar
     * @param {THREE.Vector3} position - The position to place the jar
     * @param {THREE.Vector3} scale - The scale to apply to the jar
     */
    build(position, scale) {
        this.jarGroup.position.copy(position);
        this.jarGroup.scale.copy(scale);
    }
}

export { MyJar };
