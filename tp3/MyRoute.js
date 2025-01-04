import * as THREE from 'three';

class MyRoute {
    constructor(scene) {
        this.scene = scene;

        this.routePoints = [
            new THREE.Vector3(0, 4.9, 40),
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

    createRouteMarkers() {
        const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});

        this.routePoints.forEach((point) => {
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(point.x, point.y, point.z);
            this.scene.add(sphere);
        });
    }

    getRoutePoints() {
        return this.routePoints;
    }
}

export {MyRoute};
