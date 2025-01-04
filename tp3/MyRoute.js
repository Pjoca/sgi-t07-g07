import * as THREE from 'three';

class MyRoute {
    constructor(scene) {
        this.scene = scene;

        this.routePoints = [
            new THREE.Vector3(0, 3.1, 40),
            new THREE.Vector3(-30, 3.1, 38),
            new THREE.Vector3(-47, 3.1, 30),
            new THREE.Vector3(-50, 3.1, 25),
            new THREE.Vector3(-55, 3.1, 0),
            new THREE.Vector3(-53, 3.1, -25),
            new THREE.Vector3(-45, 3.1, -38),
            new THREE.Vector3(-35, 3.1, -40),
            new THREE.Vector3(-25, 3.1, -38),
            new THREE.Vector3(-22, 3.1, -32),
            new THREE.Vector3(-15, 3.1, -12),
            new THREE.Vector3(-10, 3.1, -6),
            new THREE.Vector3(-0, 3.1, -4),
            new THREE.Vector3(13, 3.1, -9),
            new THREE.Vector3(18, 3.1, -30),
            new THREE.Vector3(23, 3.1, -38),
            new THREE.Vector3(36, 3.1, -42),
            new THREE.Vector3(47, 3.1, -36),
            new THREE.Vector3(54, 3.1, -20),
            new THREE.Vector3(55, 3.1, 0),
            new THREE.Vector3(52, 3.1, 15),
            new THREE.Vector3(43, 3.1, 30),
            new THREE.Vector3(20, 3.1, 38)
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
