import * as THREE from 'three';

export class MyRug {
    constructor() {
        // Create a texture loader to load the rug texture
        this.textureLoader = new THREE.TextureLoader();

        // Load the carpet texture and create a material with it
        const texture = this.textureLoader.load('textures/carpet.jpg'); // Path to the texture image
        const material = new THREE.MeshStandardMaterial({ map: texture }); // Use standard material with the loaded texture

        // Create geometry for the rug as a plane
        const geometry = new THREE.PlaneGeometry(7, 5); // Width: 7 units, Height: 5 units
        // Create a mesh combining the geometry and material
        this.plane = new THREE.Mesh(geometry, material);
        // Enable the rug to receive shadows in the scene
        this.plane.receiveShadow = true;
    }

    // Method to position and rotate the rug in the scene
    build() {
        // Rotate the rug to lie flat on the ground (align with the xz-plane)
        this.plane.rotation.x = -Math.PI / 2; // Rotate 90 degrees around the x-axis
        // Position the rug slightly above the ground to avoid z-fighting
        this.plane.position.set(0, 0.01, 0); // Set position at the origin with a slight offset on the y-axis
    }
}
