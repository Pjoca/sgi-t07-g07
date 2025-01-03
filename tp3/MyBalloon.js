import * as THREE from 'three';

class MyBalloon {
    constructor(scene, routePoints) {
        this.scene = scene;
        this.routePoints = routePoints; // Route points the AI balloon will follow
        this.balloon = null;
        this.currentPointIndex = 0;
        this.speed = 0.1;
    }

    initBalloon() {
        const balloonGeometry = new THREE.SphereGeometry(1, 32, 32);
        const balloonMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);

        const startPosition = this.routePoints[0];
        this.balloon.position.set(startPosition.x, startPosition.y, startPosition.z);
        this.scene.add(this.balloon);
    }

    update() {
        if (!this.balloon || this.routePoints.length === 0) return;

        const targetPoint = this.routePoints[this.currentPointIndex];

        const direction = new THREE.Vector3().subVectors(targetPoint, this.balloon.position);

        const distance = direction.length();
        if (distance < this.speed) {
            this.balloon.position.copy(targetPoint);
            this.currentPointIndex = (this.currentPointIndex + 1) % this.routePoints.length;
        } else {
            direction.normalize().multiplyScalar(this.speed);
            this.balloon.position.add(direction);
        }

        const tangent = new THREE.Vector3().subVectors(this.routePoints[this.currentPointIndex], this.balloon.position);
        this.balloon.rotation.y = Math.atan2(tangent.z, tangent.x);
    }
}

export { MyBalloon };
