import * as THREE from 'three';

export class MyPlate {
    constructor() {
        this.plateRadius = 0.5;    // Radius of the plate
        this.plateHeight = 0.05;   // Thickness of the plate
        this.tableTopHeight = 2.3; // To position the plate on the table

        this.plateMaterial = new THREE.MeshPhongMaterial({
            color: "#FFFFFF",
            specular: "#AAAAAA",
            shininess: 40
        });

        const plateGeometry = new THREE.CylinderGeometry(
            this.plateRadius,   // Top radius
            this.plateRadius,   // Bottom radius (same as top for a flat plate)
            this.plateHeight,   // Height (thickness)
            32                 // Number of radial segments for smoothness
        );

        this.plate = new THREE.Mesh(plateGeometry, this.plateMaterial);
    }

    build() {
        this.plate.position.set(0, this.tableTopHeight + this.plateHeight / 2, 0);
    }
}
