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
        const obstacleGeometry = new THREE.ConeGeometry(5, 21, 22);
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

    removeObstacleMarkers() {
        this.obstacles.forEach((obstacle) => {
            this.scene.remove(obstacle); // Remove obstacle from scene
        });

        this.obstacles = []; // Clear the array after removal
    }
}


export {MyObstacle};
