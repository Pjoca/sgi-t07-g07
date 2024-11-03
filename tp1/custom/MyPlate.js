import * as THREE from 'three';

export class MyPlate {
    constructor() {
        // Define the height of the plate and the height of the table top
        this.plateHeight = 0.05; // Height of the main plate
        this.tableTopHeight = 1.9; // Height of the table top

        // Create the material for the plate with specified properties
        this.plateMaterial = new THREE.MeshPhongMaterial({
            color: "#FFFFFF", // White color for the plate
            specular: "#AAAAAA", // Specular highlight color
            shininess: 40 // Shininess level of the material
        });

        // Create geometry for the main plate (cylinder shape)
        const plateGeometry = new THREE.CylinderGeometry(0.45, 0.45, this.plateHeight, 32);
        // Create the main plate mesh using the geometry and material
        this.plate = new THREE.Mesh(plateGeometry, this.plateMaterial);
        // Enable shadows for the plate
        this.plate.castShadow = true; // Plate can cast shadows
        this.plate.receiveShadow = true; // Plate can receive shadows

        // Create geometry for a smaller plate (cylinder shape)
        const smallerPlateGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.03, 32);
        // Create the smaller plate mesh using the smaller geometry and the same material
        this.smallerPlate = new THREE.Mesh(smallerPlateGeometry, this.plateMaterial);
        // Enable shadows for the smaller plate
        this.smallerPlate.castShadow = true; // Smaller plate can cast shadows
        this.smallerPlate.receiveShadow = true; // Smaller plate can receive shadows
    }

    // Method to position the plates in the scene
    build() {
        // Position the main plate slightly above the table top
        this.plate.position.set(0, this.tableTopHeight + this.plateHeight / 2, 0);
        // Position the smaller plate above the main plate, slightly offset in the z direction
        this.smallerPlate.position.set(0, this.tableTopHeight + 0.03 / 2, 1.08);
    }
}
