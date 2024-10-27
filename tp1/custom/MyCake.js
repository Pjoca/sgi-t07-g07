import * as THREE from 'three';

export class MyCake {
    constructor(plate) {
        this.cakeRadius = 0.36;    // Radius of the cake (smaller than the plate)
        this.cakeHeight = 0.2;    // Height (thickness) of the cake
        this.plateHeight = plate.plateHeight;  // To position the cake on top of the plate
        this.tableTopHeight = plate.tableTopHeight; // To ensure proper positioning

        this.cakeMaterial = new THREE.MeshPhongMaterial({
            color: "#FFC0CB",    // Pink color for the cake
            specular: "#FFB6C1", // Light pink for specular highlights
            shininess: 20
        });

        // Create the cake geometry (with a missing slice using thetaStart and thetaLength)
        const cakeGeometry = new THREE.CylinderGeometry(
            this.cakeRadius,   // Top radius
            this.cakeRadius,   // Bottom radius
            this.cakeHeight,   // Height (thickness)
            32,                // Radial segments for smoothness
            1,                 // Height segments
            false,             // Not open-ended
            0,                 // thetaStart (starting angle, no slice removed at 0)
            Math.PI * 1.75     // thetaLength (portion of the cake; 1.75 * Math.PI removes a slice)
        );

        this.cake = new THREE.Mesh(cakeGeometry, this.cakeMaterial);

        // Create the geometry for the missing slice interior using BufferGeometry
        const sliceMaterial = new THREE.MeshPhongMaterial({
            color: "#FFC0CB",    // Same color as the cake
            specular: "#FFB6C1",
            shininess: 20,
            side: THREE.DoubleSide  // Render both sides of the triangle
        });

        const sliceGeometry = new THREE.PlaneGeometry(this.cakeRadius, this.cakeHeight);

        this.sliceFace = new THREE.Mesh(sliceGeometry, sliceMaterial);
        this.sliceFace.rotation.y = -Math.PI * 1.75;

        this.sliceFace2 = new THREE.Mesh(sliceGeometry, sliceMaterial);
        this.sliceFace2.rotation.y = Math.PI * 0.5;
    }

    build() {
        const cakePositionY = this.tableTopHeight + this.plateHeight + this.cakeHeight / 2;

        this.cake.position.set(0, cakePositionY, 0);
        this.sliceFace.position.set(
            -this.cakeRadius/2.825,
            this.tableTopHeight + this.plateHeight + this.cakeHeight / 2,
            this.cakeRadius/2.825
        );

        this.sliceFace2.position.set(
            0,
            this.tableTopHeight + this.plateHeight + this.cakeHeight / 2,
            this.cakeRadius/2
        );
    }
}
