import * as THREE from 'three';

export class MyPlate {
    constructor() {
        this.plateRadius = 0.45;
        this.plateHeight = 0.05;
        this.tableTopHeight = 1.9;

        this.plateMaterial = new THREE.MeshPhongMaterial({
            color: "#FFFFFF",
            specular: "#AAAAAA",
            shininess: 40
        });

        const plateGeometry = new THREE.CylinderGeometry(
            this.plateRadius,
            this.plateRadius,
            this.plateHeight,
            32
        );

        this.plate = new THREE.Mesh(plateGeometry, this.plateMaterial);
        this.plate.castShadow = true;
        this.plate.receiveShadow = true;
    }

    build() {
        this.plate.position.set(0, this.tableTopHeight + this.plateHeight / 2, 0);
    }
}
