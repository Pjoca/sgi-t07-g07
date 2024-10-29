import * as THREE from 'three';

export class MyCake {
    constructor(plate) {
        this.cakeRadius = 0.36;    // Radius of the cake (smaller than the plate)
        this.cakeHeight = 0.2;     // Height (thickness) of the cake
        this.plateHeight = plate.plateHeight;  // To position the cake on top of the plate
        this.tableTopHeight = plate.tableTopHeight; // To ensure proper positioning

        const textureLoader = new THREE.TextureLoader();

        // Load texture for the sides of the cake
        this.cakeTexture = textureLoader.load('images/cake.jpg');
        this.cakeTexture.wrapS = THREE.RepeatWrapping;
        this.cakeTexture.wrapT = THREE.RepeatWrapping;
        this.cakeTexture.repeat.set(12, 1);  // Only repeat on the sides

        // Load texture for the top of the cake
        this.topTexture = textureLoader.load('images/cake.jpg');
        this.topTexture.wrapS = THREE.RepeatWrapping;
        this.topTexture.wrapT = THREE.RepeatWrapping;
        this.topTexture.repeat.set(12, 12);  // Repeat more on the top

        // Side material with texture
        const sideMaterial = new THREE.MeshPhongMaterial({
            map: this.cakeTexture,
            shininess: 20
        });

        // Top material with different texture repeat
        const topMaterial = new THREE.MeshPhongMaterial({
            map: this.topTexture,
            shininess: 20
        });

        // Bottom material (same as the side or you can define a different one)
        const bottomMaterial = sideMaterial;

        // Cake geometry with separate top, side, and bottom materials
        const cakeGeometry = new THREE.CylinderGeometry(
            this.cakeRadius,
            this.cakeRadius,
            this.cakeHeight,
            32,
            1,
            false,
            0,
            Math.PI * 1.75 // thetaLength for slice
        );

        // Multi-material mesh
        this.cake = new THREE.Mesh(cakeGeometry, [sideMaterial, topMaterial, bottomMaterial]);

        // Load texture for the slice interior
        this.sliceTexture = textureLoader.load('images/cake-interior.jpg');
        this.sliceTexture.wrapS = THREE.RepeatWrapping;
        this.sliceTexture.wrapT = THREE.RepeatWrapping;
        this.sliceTexture.repeat.set(2, 1);

        // Slice material with inner texture
        this.sliceMaterial = new THREE.MeshPhongMaterial({
            map: this.sliceTexture,
            shininess: 20,
            side: THREE.DoubleSide
        });

        // Create the geometry for the missing slice interior using PlaneGeometry
        const sliceGeometry = new THREE.PlaneGeometry(this.cakeRadius, this.cakeHeight);

        this.sliceFace = new THREE.Mesh(sliceGeometry, this.sliceMaterial);
        this.sliceFace.rotation.y = -Math.PI * 1.75;

        this.sliceFace2 = new THREE.Mesh(sliceGeometry, this.sliceMaterial);
        this.sliceFace2.rotation.y = Math.PI * 0.5;
    }

    build() {
        const cakePositionY = this.tableTopHeight + this.plateHeight + this.cakeHeight / 2;

        this.cake.position.set(0, cakePositionY, 0);

        this.sliceFace.position.set(
            -this.cakeRadius / 2.825,
            cakePositionY,
            this.cakeRadius / 2.825
        );

        this.sliceFace2.position.set(
            0,
            cakePositionY,
            this.cakeRadius / 2
        );
    }
}
