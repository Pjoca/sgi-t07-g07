import * as THREE from 'three';

export class MyTable {
    constructor() {
        // Define sizes for the table top and legs
        this.tableTopSize = {width: 4.25, depth: 3, thickness: 0.2}; // Dimensions of the table top
        this.tableLegSize = {thickness: 0.2, height: 2}; // Dimensions of the table legs
        this.tableHeight = 1.8; // Height of the table from the ground

        // Load texture for the table top
        const textureLoader = new THREE.TextureLoader();
        this.tableTopTexture = textureLoader.load('textures/table.jpg');

        // Material for the table top
        this.tableMaterial = new THREE.MeshPhongMaterial({
            map: this.tableTopTexture, // Use the loaded texture
            shininess: 20 // Set shininess for a polished look
        });

        // Material for the table legs
        this.legMaterial = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa, // Color of the table legs
            specular: "#ffffff", // Specular highlight color
            shininess: 20 // Set shininess for a polished look
        });

        // Array to hold all parts of the table for scaling
        this.tableParts = [];

        // Create the tabletop geometry and mesh
        const topGeometry = new THREE.BoxGeometry(
            this.tableTopSize.width,
            this.tableTopSize.thickness,
            this.tableTopSize.depth
        );
        this.tabletop = new THREE.Mesh(topGeometry, this.tableMaterial); // Create the tabletop mesh
        this.tabletop.receiveShadow = true; // Enable receiving shadows
        this.tabletop.castShadow = true;    // Enable casting shadows

        // Add the tabletop to the array of table parts
        this.tableParts.push(this.tabletop);

        // Define the geometry for the table legs
        const radiusTop = this.tableLegSize.thickness / 2;
        const radiusBottom = this.tableLegSize.thickness / 2;
        const height = this.tableLegSize.height;
        const radialSegments = 32; // Segments for the cylindrical leg geometry

        this.legGeometry = new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            height,
            radialSegments
        );

        // Create and position each leg of the table
        this.leg1 = new THREE.Mesh(this.legGeometry, this.legMaterial);  // Front left leg
        this.leg1.castShadow = true; // Enable shadow for the leg
        this.tableParts.push(this.leg1); // Add leg to parts array

        this.leg2 = new THREE.Mesh(this.legGeometry, this.legMaterial);  // Front right leg
        this.leg2.castShadow = true; // Enable shadow for the leg
        this.tableParts.push(this.leg2); // Add leg to parts array

        this.leg3 = new THREE.Mesh(this.legGeometry, this.legMaterial);  // Back left leg
        this.leg3.castShadow = true; // Enable shadow for the leg
        this.tableParts.push(this.leg3); // Add leg to parts array

        this.leg4 = new THREE.Mesh(this.legGeometry, this.legMaterial);  // Back right leg
        this.leg4.castShadow = true; // Enable shadow for the leg
        this.tableParts.push(this.leg4); // Add leg to parts array

        // Scale the table parts to their desired size (default to 1:1)
        this.scaleTableParts(1, 1, 1);
    }

    // Method to scale all parts of the table
    scaleTableParts(scaleX, scaleY, scaleZ) {
        this.tableParts.forEach(part => {
            part.scale.set(scaleX, scaleY, scaleZ); // Scale each part
        });
    }

    // Method to build and position the table in the scene
    build() {
        const legOffset = 0.10; // Offset to move legs closer to the center for stability

        // Position the tabletop at the specified height
        this.tabletop.position.set(0, this.tableHeight, 0);

        // Set positions for the legs based on the tabletop dimensions and offset
        // Front left leg
        this.leg1.position.set(
            -this.tableTopSize.width / 2 + this.tableLegSize.thickness / 2 + legOffset,
            this.tableHeight - this.tableLegSize.height / 2,
            -this.tableTopSize.depth / 2 + this.tableLegSize.thickness / 2 + legOffset
        );

        // Front right leg
        this.leg2.position.set(
            this.tableTopSize.width / 2 - this.tableLegSize.thickness / 2 - legOffset,
            this.tableHeight - this.tableLegSize.height / 2,
            -this.tableTopSize.depth / 2 + this.tableLegSize.thickness / 2 + legOffset
        );

        // Back left leg
        this.leg3.position.set(
            -this.tableTopSize.width / 2 + this.tableLegSize.thickness / 2 + legOffset,
            this.tableHeight - this.tableLegSize.height / 2,
            this.tableTopSize.depth / 2 - this.tableLegSize.thickness / 2 - legOffset
        );

        // Back right leg
        this.leg4.position.set(
            this.tableTopSize.width / 2 - this.tableLegSize.thickness / 2 - legOffset,
            this.tableHeight - this.tableLegSize.height / 2,
            this.tableTopSize.depth / 2 - this.tableLegSize.thickness / 2 - legOffset
        );
    }
}
