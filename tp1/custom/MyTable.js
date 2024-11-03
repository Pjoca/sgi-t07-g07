import * as THREE from 'three';

export class MyTable {
    constructor() {
        this.tableTopSize = {width: 4.25, depth: 3, thickness: 0.2};
        this.tableLegSize = {thickness: 0.2, height: 2};
        this.tableHeight = 1.8;

        const textureLoader = new THREE.TextureLoader();
        this.tableTopTexture = textureLoader.load('textures/table.jpg');

        this.tableMaterial = new THREE.MeshPhongMaterial({
            map: this.tableTopTexture,
            shininess: 20
        });

        this.legMaterial = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa,
            specular: "#ffffff",
            shininess: 20
        });

        this.tableParts = [];

        // Tabletop geometry and mesh
        const topGeometry = new THREE.BoxGeometry(
            this.tableTopSize.width,
            this.tableTopSize.thickness,
            this.tableTopSize.depth
        );
        this.tabletop = new THREE.Mesh(topGeometry, this.tableMaterial);
        this.tabletop.receiveShadow = true;
        this.tabletop.castShadow = true;

        this.tableParts.push(this.tabletop);

        // Table leg geometry
        const radiusTop = this.tableLegSize.thickness / 2;
        const radiusBottom = this.tableLegSize.thickness / 2;
        const height = this.tableLegSize.height;
        const radialSegments = 32;

        this.legGeometry = new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            height,
            radialSegments
        );

        // Creating legs with the new leg material
        this.leg1 = new THREE.Mesh(this.legGeometry, this.legMaterial);  // Front left leg
        this.leg1.castShadow = true;
        this.tableParts.push(this.leg1);

        this.leg2 = new THREE.Mesh(this.legGeometry, this.legMaterial);  // Front right leg
        this.leg2.castShadow = true;
        this.tableParts.push(this.leg2);

        this.leg3 = new THREE.Mesh(this.legGeometry, this.legMaterial);  // Back left leg
        this.leg3.castShadow = true;
        this.tableParts.push(this.leg3);

        this.leg4 = new THREE.Mesh(this.legGeometry, this.legMaterial);  // Back right leg
        this.leg4.castShadow = true;
        this.tableParts.push(this.leg4);

        this.scaleTableParts(1, 1, 1);
    }

    scaleTableParts(scaleX, scaleY, scaleZ) {
        this.tableParts.forEach(part => {
            part.scale.set(scaleX, scaleY, scaleZ);
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
