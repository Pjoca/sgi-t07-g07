import * as THREE from 'three';

class MyRoute {
    constructor(scene) {
        this.scene = scene;

        this.routePoints = [
            new THREE.Vector3(0, 0.1, 40),
            new THREE.Vector3(-30, 0.1, 38),
            new THREE.Vector3(-47, 0.1, 30),
            new THREE.Vector3(-50, 0.1, 25),
            new THREE.Vector3(-55, 0.1, 0),
            new THREE.Vector3(-53, 0.1, -25),
            new THREE.Vector3(-45, 0.1, -38),
            new THREE.Vector3(-35, 0.1, -40),
            new THREE.Vector3(-25, 0.1, -38),
            new THREE.Vector3(-22, 0.1, -32),
            new THREE.Vector3(-15, 0.1, -12),
            new THREE.Vector3(-10, 0.1, -6),
            new THREE.Vector3(-0, 0.1, -4),
            new THREE.Vector3(13, 0.1, -9),
            new THREE.Vector3(18, 0.1, -30),
            new THREE.Vector3(23, 0.1, -38),
            new THREE.Vector3(36, 0.1, -42),
            new THREE.Vector3(47, 0.1, -36),
            new THREE.Vector3(54, 0.1, -20),
            new THREE.Vector3(55, 0.1, 0),
            new THREE.Vector3(52, 0.1, 15),
            new THREE.Vector3(43, 0.1, 30),
            new THREE.Vector3(20, 0.1, 38)
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
