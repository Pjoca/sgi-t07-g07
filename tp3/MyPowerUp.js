import * as THREE from 'three'; // Import the THREE.js library for 3D graphics.

// Define the MyPowerUp class to manage power-ups in a THREE.js scene.
class MyPowerUp {
    constructor(scene) {
        this.scene = scene; // Store the THREE.js scene reference.

        // Predefined positions for placing power-ups in the scene.
        this.powerUpPoints = [
            new THREE.Vector3(-25, 3.1, 45),  // Power-up 1 position.
            new THREE.Vector3(-20, 3.1, -35), // Power-up 2 position.
            new THREE.Vector3(40, 3.1, -50)   // Power-up 3 position.
        ];

        // Arrays to store power-up meshes and their bounding spheres.
        this.powerUps = [];
        this.boundingSpheres = [];
    }

    // Creates and adds power-up objects to the scene.
    createPowerUps() {
        // Define a cone geometry with a square base (radialSegments = 4).
        const powerUp = new THREE.ConeGeometry(1.25, 2.5, 4); // (radius, height, radialSegments)
        const texture = new THREE.TextureLoader().load('scenes/textures/powerup.jpg'); // Load texture for power-ups.
        const powerupMaterial = new THREE.MeshBasicMaterial({ map: texture }); // Create material with the texture.
    
        // Iterate over the predefined power-up positions.
        this.powerUpPoints.forEach((pos) => {
            const power = new THREE.Mesh(powerUp, powerupMaterial); // Create a cone mesh for the power-up.
            power.position.set(pos.x, pos.y, pos.z); // Set the position of the power-up.
            power.rotation.y = Math.PI / 4; // Rotate the cone to align its base diagonally.
            this.scene.add(power); // Add the power-up to the scene.
    
            // Store the power-up mesh in the powerUps array.
            this.powerUps.push(power);
        });
    }

    // Calculates the radius of a bounding sphere that encloses the power-up.
    calculateBoundingSphereRadius() {
        const radius = 1.25; // Base radius of the cone.
        const height = 2.5;  // Height of the cone.

        // Compute the radius of the bounding sphere using Pythagoras' theorem.
        return Math.sqrt(Math.pow(radius, 2) + Math.pow(height / 2, 2));
    }

    // Retrieves the bounding spheres for all power-ups.
    getPowerUpBoundingSpheres() {
        const radius = this.calculateBoundingSphereRadius(); // Calculate the bounding sphere radius.
        return this.powerUps.map(powerUp => ({
            center: powerUp.position.clone(), // Use the power-up's position as the sphere's center.
            radius: radius, // Use the calculated radius.
        }));
    }

    // Visualizes the bounding spheres for debugging purposes.
    showBoundingSpheres() {
        const radius = this.calculateBoundingSphereRadius(); // Calculate the bounding sphere radius.
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00, // Green color for the bounding spheres.
            wireframe: true, // Display the spheres as wireframes.
            transparent: true, // Make the spheres partially transparent.
            opacity: 0.5, // Set the transparency level.
        });

        // Create and add bounding spheres for each power-up.
        this.powerUps.forEach(powerup => {
            const sphereGeometry = new THREE.SphereGeometry(radius, 16, 16); // Sphere geometry.
            const boundingSphere = new THREE.Mesh(sphereGeometry, material); // Create a sphere mesh.
            boundingSphere.position.copy(powerup.position); // Position the sphere at the power-up's location.

            this.boundingSpheres.push(boundingSphere); // Store the bounding sphere mesh.
            this.scene.add(boundingSphere); // Add the sphere to the scene.

            // Attach the sphere to the power-up for easier debugging.
            powerup.boundingSphereMesh = boundingSphere;
        });
    }

    // Removes all power-up objects from the scene.
    removePowerUps() {
        // Remove power-up meshes from the scene and clear the array.
        this.powerUps.forEach((powerUp) => {
            this.scene.remove(powerUp);
        });

        // Clear the array of power-up meshes.
        this.powerUps = [];
    }
}

export { MyPowerUp }; // Export the MyPowerUp class for use in other modules.
