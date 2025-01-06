import * as THREE from 'three';

class MyObstacle {
    constructor(scene) {
        this.scene = scene;

        this.obstaclePoints = [
            new THREE.Vector3(-43, 3.1, 30),
            new THREE.Vector3(12, 3.1, -4),
            new THREE.Vector3(62, 3.1, -20),
            new THREE.Vector3(53, 3.1, 2)
        ];

        this.obstacles = []; // Array to store created obstacles
    }

    createObstacleMarkers() {
        const obstacleGeometry = new THREE.CylinderGeometry(6, 6, 16, 32);
        const texture = new THREE.TextureLoader().load('scenes/textures/warning.jpg');
        const obstacleMaterial = new THREE.MeshBasicMaterial({map: texture});

        this.obstaclePoints.forEach((pos) => {
            const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
            obstacle.position.set(pos.x, pos.y + 7.7, pos.z);
            this.scene.add(obstacle);

            // Store the obstacle in the obstacles array
            this.obstacles.push(obstacle);
        });
    }

    calculateBoundingSphereRadius() {
        const cylinderRadius = 5.25; 
        const cylinderHeight = 15; 
    
        return Math.sqrt(Math.pow(cylinderRadius, 2) + Math.pow(cylinderHeight / 2, 2));
    }
    
    getObstacleBoundingSpheres() {
        const radius = this.calculateBoundingSphereRadius();
        return this.obstacles.map(obstacle => ({
            center: obstacle.position.clone(),
            radius: radius,
        }));
    }

        showBoundingSpheres() {
        const radius = this.calculateBoundingSphereRadius();
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: 0.5,
        });

        this.obstacles.forEach(obstacle => {
            const sphereGeometry = new THREE.SphereGeometry(radius, 16, 16);
            const boundingSphere = new THREE.Mesh(sphereGeometry, material);
            boundingSphere.position.copy(obstacle.position);
            this.scene.add(boundingSphere);

            // Optionally, store the sphere for later removal
            obstacle.boundingSphereMesh = boundingSphere;
        });
    }

    removeObstacleMarkers() {
        this.obstacles.forEach((obstacle) => {
            this.scene.remove(obstacle); // Remove obstacle from scene
        });

        this.obstacles = []; // Clear the array after removal
    }
}


export {MyObstacle};
