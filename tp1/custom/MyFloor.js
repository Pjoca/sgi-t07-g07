import * as THREE from 'three';

export class MyFloor {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();

        this.floorTexture = this.textureLoader.load('images/floor.jpg');
        this.floorTexture.wrapS = THREE.RepeatWrapping;
        this.floorTexture.wrapT = THREE.RepeatWrapping;
        this.floorTexture.repeat.set(3, 3);

        this.floorMaterial = new THREE.MeshStandardMaterial({
            map: this.floorTexture
        });

        this.floorGeometry = new THREE.PlaneGeometry(15, 10);
        this.plane = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
        this.plane.receiveShadow = true;
    }

    build() {
        this.plane.position.y = -0;
        this.plane.rotation.x = -Math.PI / 2;
    }
}
