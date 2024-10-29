import * as THREE from 'three';

export class MyRug {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();

        const texture = this.textureLoader.load('images/carpet.jpg');
        const material = new THREE.MeshBasicMaterial({ map: texture});
        const geometry = new THREE.PlaneGeometry(7, 5);
        this.plane = new THREE.Mesh(geometry, material);
    }

    build() {
        this.plane.rotation.x = -Math.PI/2;
        this.plane.position.set(0, 0.05, 0);
    }
}
