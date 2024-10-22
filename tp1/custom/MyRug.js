import * as THREE from 'three';

export class MyFrame {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();

        const texture = this.textureLoader.load('images/Galatasaray.png');
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const geometry = new THREE.PlaneGeometry(7, 5);
        this.plane = new THREE.Mesh(geometry, material);
    }

    build() {
        this.plane.rotation.x = 2*Math.PI; 
        this.plane.position.set(0,2.8,-4.89);
    }
}
