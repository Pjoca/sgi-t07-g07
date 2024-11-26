import * as THREE from 'three';

export class MyFloor {
    constructor() {
        // Initialize texture loader to load floor texture image
        this.textureLoader = new THREE.TextureLoader();

        // Load the floor texture and set repeat properties for a tiled effect
        this.floorTexture = this.textureLoader.load('textures/table.jpg');
        this.floorTexture.wrapS = THREE.RepeatWrapping; // Repeat horizontally
        this.floorTexture.wrapT = THREE.RepeatWrapping; // Repeat vertically
        this.floorTexture.repeat.set(3, 3); // Set the number of tiles in each direction

        // Create a material for the floor using the texture
        this.floorMaterial = new THREE.MeshStandardMaterial({
            map: this.floorTexture // Apply texture map to material
        });

        // Define the geometry for the floor as a plane
        this.floorGeometry = new THREE.PlaneGeometry(15, 10); // Plane with width 15 and length 10

        // Create the floor mesh by combining the geometry and material
        this.plane = new THREE.Mesh(this.floorGeometry, this.floorMaterial);

        // Enable shadow reception on the floor for realistic lighting
        this.plane.receiveShadow = true;
    }

    // Position and rotate the floor correctly within the scene
    build() {
        this.plane.position.y = 0; // Set floor at y=0 (ground level)
        this.plane.rotation.x = -Math.PI / 2; // Rotate the floor to lie horizontally (facing up)
    }
}
