import * as THREE from 'three';

// Define the MyObstacle class to manage obstacles in a THREE.js scene.
class MyObstacle {
    constructor(scene) {
        this.scene = scene; // Store the THREE.js scene reference.

        // Define fixed positions for the obstacles in the scene.
        this.obstaclePoints = [
            new THREE.Vector3(-43, 3.1, 30), // Obstacle 1 position.
            new THREE.Vector3(12, 3.1, -4),  // Obstacle 2 position.
            new THREE.Vector3(62, 3.1, -20), // Obstacle 3 position.
            new THREE.Vector3(53, 3.1, 2)    // Obstacle 4 position.
        ];

        // Arrays to store obstacle meshes and their bounding spheres.
        this.obstacles = [];
        this.boundingSpheres = [];
    }

    // Creates and adds visual markers (cylinders) for each obstacle in the scene.
    createObstacleMarkers() {
        const obstacleGeometry = new THREE.CylinderGeometry(5, 5, 14, 32); // Geometry for a cylinder obstacle.
        const texture = new THREE.TextureLoader().load('scenes/textures/warning.jpg'); // Load texture for the obstacles.
        const obstacleMaterial = new THREE.MeshBasicMaterial({ map: texture }); // Create material with the texture.

        // Iterate over the predefined obstacle positions.
        this.obstaclePoints.forEach((pos) => {
            const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial); // Create a cylinder mesh.
            obstacle.position.set(pos.x, pos.y + 4, pos.z); // Position the obstacle slightly above the given point.
            obstacle.castShadow = true; // Allow the obstacle to cast shadows.
            obstacle.receiveShadow = true; // Allow the obstacle to receive shadows.
            this.scene.add(obstacle); // Add the obstacle to the scene.

            // Store the obstacle mesh in the array.
            this.obstacles.push(obstacle);
        });
    }

    // Calculates the radius of a bounding sphere that encloses the obstacle.
    calculateBoundingSphereRadius() {
        const cylinderRadius = 4; // Radius of the cylinder base.
        const cylinderHeight = 8; // Half-height of the cylinder.

        // Compute the radius of the bounding sphere using Pythagoras' theorem.
        return Math.sqrt(Math.pow(cylinderRadius, 2) + Math.pow(cylinderHeight / 2, 2));
    }

    // Retrieves the bounding spheres for all obstacles.
    getObstacleBoundingSpheres() {
        const radius = this.calculateBoundingSphereRadius(); // Calculate the bounding sphere radius.
        return this.obstacles.map(obstacle => ({
            center: obstacle.position.clone(), // Use the obstacle's position as the sphere's center.
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

        // Create and add bounding spheres for each obstacle.
        this.obstacles.forEach(obstacle => {
            const sphereGeometry = new THREE.SphereGeometry(radius, 16, 16); // Sphere geometry.
            const boundingSphere = new THREE.Mesh(sphereGeometry, material); // Create a sphere mesh.
            boundingSphere.position.copy(obstacle.position); // Position the sphere at the obstacle's location.

            this.boundingSpheres.push(boundingSphere); // Store the bounding sphere mesh.
            this.scene.add(boundingSphere); // Add the sphere to the scene.

            // Attach the sphere to the obstacle for easier debugging.
            obstacle.boundingSphereMesh = boundingSphere;
        });
    }

    // Removes all obstacle markers and their associated bounding spheres from the scene.
    removeObstacleMarkers() {
        // Remove obstacle meshes from the scene and clear the array.
        this.obstacles.forEach((obstacle) => {
            this.scene.remove(obstacle);
        });

        // Remove bounding sphere meshes from the scene and clear the array.
        this.boundingSpheres.forEach((obstacle) => {
            this.scene.remove(obstacle);
        });

        // Clear the arrays for obstacles and bounding spheres.
        this.obstacles = [];
        this.boundingSpheres = [];
    }
}

export { MyObstacle }; // Export the MyObstacle class for use in other modules.
