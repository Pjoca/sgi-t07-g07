import * as THREE from 'three';

class MyRoute {
    // Constructor that takes the scene object where the route will be added
    constructor(scene) {
        this.scene = scene;  // Store the reference to the scene

        // Define a set of route points using THREE.Vector3 to store the 3D coordinates
        this.routePoints = [
            new THREE.Vector3(0, 4.9, 40),  // Each point represents a position in the 3D space
            new THREE.Vector3(-30, 4.9, 38),
            new THREE.Vector3(-47, 4.9, 30),
            new THREE.Vector3(-50, 4.9, 25),
            new THREE.Vector3(-55, 4.9, 0),
            new THREE.Vector3(-53, 4.9, -25),
            new THREE.Vector3(-45, 4.9, -38),
            new THREE.Vector3(-35, 4.9, -40),
            new THREE.Vector3(-25, 4.9, -38),
            new THREE.Vector3(-22, 4.9, -32),
            new THREE.Vector3(-15, 4.9, -12),
            new THREE.Vector3(-10, 4.9, -6),
            new THREE.Vector3(-0, 4.9, -4),
            new THREE.Vector3(13, 4.9, -9),
            new THREE.Vector3(18, 4.9, -30),
            new THREE.Vector3(23, 4.9, -38),
            new THREE.Vector3(36, 4.9, -42),
            new THREE.Vector3(47, 4.9, -36),
            new THREE.Vector3(54, 4.9, -20),
            new THREE.Vector3(55, 4.9, 0),
            new THREE.Vector3(52, 4.9, 15),
            new THREE.Vector3(43, 4.9, 30),
            new THREE.Vector3(20, 4.9, 38)
        ];

        // this.createRouteMarkers();  
    }

    // Method to create visual markers (spheres) at each route point
    createRouteMarkers() {
        const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);  // Sphere geometry for the markers
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });  // Red material for the markers

        // Iterate through all route points and place a sphere at each location
        this.routePoints.forEach((point) => {
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);  // Create a sphere mesh for each route point
            sphere.position.set(point.x, point.y, point.z);  // Set the sphere's position to the route point
            this.scene.add(sphere);  // Add the sphere to the scene, making it visible in the 3D world
        });
    }

    // Method to return the list of route points, which can be used elsewhere in the application
    getRoutePoints() {
        return this.routePoints;  // Return the array of route points
    }
}

// Export the MyRoute class so it can be used elsewhere in the application
export { MyRoute };
