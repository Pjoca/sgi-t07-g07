import * as THREE from 'three';

export class MyPlate {
    constructor() {
        this.plateHeight = 0.05;
        this.tableTopHeight = 1.9;

        this.plateMaterial = new THREE.MeshPhongMaterial({
            color: "#FFFFFF",
            specular: "#AAAAAA",
            shininess: 40
        });

        const plateGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.05, 32);

        this.plate = new THREE.Mesh(plateGeometry, this.plateMaterial);
        this.plate.castShadow = true;
        this.plate.receiveShadow = true;

        const smallerPlateGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.03, 32);

        this.smallerPlate = new THREE.Mesh(smallerPlateGeometry, this.plateMaterial);
        this.smallerPlate.castShadow = true;
        this.smallerPlate.receiveShadow = true;
    }

    build() {
        this.plate.position.set(0, 1.9 + 0.05 / 2, 0);
        this.smallerPlate.position.set(0, 1.9 + 0.03 / 2, 1.08);
    }
}
