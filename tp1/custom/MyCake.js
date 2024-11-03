import * as THREE from 'three';

export class MyCake {
    constructor(plate) {
        // Cake properties based on plate dimensions to ensure accurate positioning
        this.cakeRadius = 0.36;    // Radius of the cake (slightly smaller than plate's radius)
        this.cakeHeight = 0.2;     // Height (thickness) of the cake layer
        this.plateHeight = plate.plateHeight;  // Plate height used to align the cake's vertical position
        this.tableTopHeight = plate.tableTopHeight; // Table height to further align the cake

        // Texture loading and setup for sides and top of the cake
        const textureLoader = new THREE.TextureLoader();

        // Side texture for cake with repeating pattern to simulate cake layers
        this.cakeTexture = textureLoader.load('textures/cake.jpg');
        this.cakeTexture.wrapS = THREE.RepeatWrapping;
        this.cakeTexture.wrapT = THREE.RepeatWrapping;
        this.cakeTexture.repeat.set(12, 1);

        // Top texture for cake surface with additional repeats for a smooth, detailed look
        this.topTexture = textureLoader.load('textures/cake.jpg');
        this.topTexture.wrapS = THREE.RepeatWrapping;
        this.topTexture.wrapT = THREE.RepeatWrapping;
        this.topTexture.repeat.set(12, 12);

        // Materials for the cake's side and top textures
        const sideMaterial = new THREE.MeshPhongMaterial({
            map: this.cakeTexture,
            shininess: 20
        });

        const topMaterial = new THREE.MeshPhongMaterial({
            map: this.topTexture,
            shininess: 20
        });

        // Bottom material can be identical to the side or different if desired
        const bottomMaterial = sideMaterial;

        // Cake geometry as a cylinder with a "missing" slice (partial thetaLength)
        const cakeGeometry = new THREE.CylinderGeometry(
            this.cakeRadius,
            this.cakeRadius,
            this.cakeHeight,
            32,            // 32 radial segments for smoothness
            1,
            false,
            0,
            Math.PI * 1.75 // thetaLength to cut out a slice
        );

        // Assemble the cake mesh using different materials for side, top, and bottom
        this.cake = new THREE.Mesh(cakeGeometry, [sideMaterial, topMaterial, bottomMaterial]);
        this.cake.castShadow = true;

        // Texture for the interior of the cake slice
        this.sliceTexture = textureLoader.load('textures/cake-interior.jpg');
        this.sliceTexture.wrapS = THREE.RepeatWrapping;
        this.sliceTexture.wrapT = THREE.RepeatWrapping;
        this.sliceTexture.repeat.set(2, 1);

        // Material for the slice's interior surface with a separate texture
        this.sliceMaterial = new THREE.MeshPhongMaterial({
            map: this.sliceTexture,
            shininess: 20,
            side: THREE.DoubleSide // Render both sides of the slice face
        });

        // Geometry and mesh for each slice interior face
        const sliceGeometry = new THREE.PlaneGeometry(this.cakeRadius, this.cakeHeight);
        this.sliceFace = new THREE.Mesh(sliceGeometry, this.sliceMaterial);
        this.sliceFace2 = new THREE.Mesh(sliceGeometry, this.sliceMaterial);
        this.sliceFace3 = new THREE.Mesh(sliceGeometry, this.sliceMaterial);
        this.sliceFace4 = new THREE.Mesh(sliceGeometry, this.sliceMaterial);

        // Geometry and material for a separate slice piece removed from the main cake
        const slicePieceGeometry = new THREE.CylinderGeometry(
            this.cakeRadius,
            this.cakeRadius,
            this.cakeHeight,
            32,
            1,
            false,
            0,
            Math.PI * 0.25 // Small slice piece (1/4 of the cake)
        );

        // Create the slice piece with multiple materials and shadows
        this.slicePiece = new THREE.Mesh(slicePieceGeometry, [sideMaterial, topMaterial, bottomMaterial]);
        this.slicePiece.castShadow = true;
        this.slicePiece.receiveShadow = true;
    }

    // Positioning method for arranging cake components in the scene
    build() {
        // Calculate Y position of the cake to place it on the plate and table
        const cakePositionY = this.tableTopHeight + this.plateHeight + this.cakeHeight / 2;
        this.cake.position.set(0, cakePositionY, 0);

        // Set up slice interior faces for visual effect
        this.sliceFace.position.set(
            -this.cakeRadius / 2.825,
            cakePositionY,
            this.cakeRadius / 2.825
        );
        this.sliceFace.rotation.y = -Math.PI * 1.75;

        this.sliceFace2.position.set(
            0,
            cakePositionY,
            this.cakeRadius / 2
        );
        this.sliceFace2.rotation.y = Math.PI * 0.5;

        // Position the slice piece away from the main cake, simulating a removed slice
        this.slicePiece.position.set(-0.1, cakePositionY - 0.02, 0.9);

        // Additional interior faces for visual completeness
        this.sliceFace3.position.set(
            this.cakeRadius / 2.825 - 0.1,
            cakePositionY - 0.02,
            this.cakeRadius / 2.825 + 0.9
        );
        this.sliceFace3.rotation.y = -Math.PI * 0.25;

        this.sliceFace4.position.set(
            -0.1,
            cakePositionY - 0.02,
            this.cakeRadius / 2 + 0.9
        );
        this.sliceFace4.rotation.y = Math.PI * 0.5;
    }
}
