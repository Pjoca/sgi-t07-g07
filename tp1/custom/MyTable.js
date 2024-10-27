import * as THREE from 'three';

export class MyTable {
    constructor() {
        // Updated to make the table top square
        this.tableTopSize = {width: 3, depth: 3, thickness: 0.2};  // Now both width and depth are equal (square)
        this.tableLegSize = {thickness: 0.2, height: 2};
        this.tableHeight = 2.2;

        const textureLoader = new THREE.TextureLoader();
        const textureCobblestone = textureLoader.load('images/cobblestone.jpg');

        this.tableMaterial = new THREE.MeshPhongMaterial({
            map: textureCobblestone,
            specular: "#555555",
            shininess: 50
        });

        this.tableParts = [];

        // Create the tabletop
        const topGeometry = new THREE.BoxGeometry(
            this.tableTopSize.width,
            this.tableTopSize.thickness,
            this.tableTopSize.depth
        );

        this.tabletop = new THREE.Mesh(topGeometry, this.tableMaterial);
        this.tableParts.push(this.tabletop);

        const radiusTop = this.tableLegSize.thickness / 2;
        const radiusBottom = this.tableLegSize.thickness / 2;
        const height = this.tableLegSize.height;
        const radialSegments = 32;

        const legGeometry = new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            height,
            radialSegments
        );

        // Front left leg
        this.leg1 = new THREE.Mesh(legGeometry, this.tableMaterial);
        this.tableParts.push(this.leg1);

        // Front right leg
        this.leg2 = new THREE.Mesh(legGeometry, this.tableMaterial);
        this.tableParts.push(this.leg2);

        // Back left leg
        this.leg3 = new THREE.Mesh(legGeometry, this.tableMaterial);
        this.tableParts.push(this.leg3);

        // Back right leg
        this.leg4 = new THREE.Mesh(legGeometry, this.tableMaterial);
        this.tableParts.push(this.leg4);

        this.scaleTableParts(1, 1, 1);
    }

    scaleTableParts(scaleX, scaleY, scaleZ) {
        this.tableParts.forEach(part => {
            part.scale.set(scaleX, scaleY, scaleZ); // Scale each part individually
        });
    }

    build() {
        const legOffset = 0.10; // Offset to move legs closer to the center

        this.tabletop.position.set(0, this.tableHeight, 0);

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
