import * as THREE from 'three';

export class MyPlate {
    constructor() {
        this.plateRadius = 0.5;    // Radius of the plate
        this.plateHeight = 0.05;   // Thickness of the plate
        this.tableTopHeight = 1.9; // To position the plate on the table

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
    }

    build() {
        this.plate.position.set(0, this.tableTopHeight + this.plateHeight / 2, 0);
    }
}
