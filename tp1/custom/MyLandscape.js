import * as THREE from 'three';

export class MyLandscape {
    constructor() {
        // Define the width and height of the landscape
        this.width = 4.5;
        this.height = 3;

        // Create a texture loader to load landscape texture
        const landscapeTextureLoader = new THREE.TextureLoader();
        this.landscapeTexture = landscapeTextureLoader.load('textures/landscape.png');

        // Create a material for the landscape using the loaded texture
        this.landscapeMaterial = new THREE.MeshPhongMaterial({
            map: this.landscapeTexture, // Assign the texture map
            shininess: 20 // Set shininess for a shiny effect
        });

        // Create the geometry for the landscape as a plane
        this.landscapeGeometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
        // Create the landscape mesh with the geometry and material
        this.landscape = new THREE.Mesh(this.landscapeGeometry, this.landscapeMaterial);

        // Load window frame texture
        const windowFrameTextureLoader = new THREE.TextureLoader();
        this.windowFrameTexture = windowFrameTextureLoader.load('textures/frame.jpg');

        // Create a material for the window frame with specular highlights
        this.windowFrameMaterial = new THREE.MeshPhongMaterial({
            map: this.windowFrameTexture, // Assign the window frame texture
            specular: "#394143", // Set specular color for highlights
            shininess: 40 // Set shininess for a polished look
        });

        // Create geometries for different parts of the window frame
        this.windowTopFrameGeometry = new THREE.BoxGeometry(this.width, 0.2, 0.1);
        this.windowTopFrame = new THREE.Mesh(this.windowTopFrameGeometry, this.windowFrameMaterial);

        this.windowBottomFrameGeometry = new THREE.BoxGeometry(this.width, 0.2, 0.1);
        this.windowBottomFrame = new THREE.Mesh(this.windowBottomFrameGeometry, this.windowFrameMaterial);

        this.windowLeftFrameGeometry = new THREE.BoxGeometry(this.height + 0.2, 0.2, 0.1);
        this.windowLeftFrame = new THREE.Mesh(this.windowLeftFrameGeometry, this.windowFrameMaterial);

        this.windowRightFrameGeometry = new THREE.BoxGeometry(this.height + 0.2, 0.2, 0.1);
        this.windowRightFrame = new THREE.Mesh(this.windowRightFrameGeometry, this.windowFrameMaterial);

        this.windowMidVerticalFrameGeometry = new THREE.BoxGeometry(this.height, 0.12, 0.1);
        this.windowMidVerticalFrame = new THREE.Mesh(this.windowMidVerticalFrameGeometry, this.windowFrameMaterial);

        this.windowMidHorizontalFrameGeometry = new THREE.BoxGeometry(this.width, 0.12, 0.1);
        this.windowMidHorizontalFrame = new THREE.Mesh(this.windowMidHorizontalFrameGeometry, this.windowFrameMaterial);
    }

    // Build method to position and orient all components in the scene
    build() {
        // Position the landscape and rotate it to face the correct direction
        this.landscape.position.set(7.495, 3, 0);
        this.landscape.rotation.y = -Math.PI / 2; // Rotate 90 degrees on the Y-axis

        // Position the top frame of the window
        this.windowTopFrame.position.set(7.495, 4.5, 0);
        this.windowTopFrame.rotation.y = -Math.PI / 2;

        // Position the bottom frame of the window
        this.windowBottomFrame.position.set(7.495, 1.5, 0);
        this.windowBottomFrame.rotation.y = -Math.PI / 2;

        // Position the left frame of the window
        this.windowLeftFrame.position.set(7.495, 3, -2.35);
        this.windowLeftFrame.rotation.y = -Math.PI / 2;
        this.windowLeftFrame.rotation.z = Math.PI / 2; // Rotate to orient correctly

        // Position the right frame of the window
        this.windowRightFrame.position.set(7.495, 3, 2.35);
        this.windowRightFrame.rotation.y = -Math.PI / 2;
        this.windowRightFrame.rotation.z = Math.PI / 2; // Rotate to orient correctly

        // Position the vertical middle frame
        this.windowMidVerticalFrame.position.set(7.495, 3, 0);
        this.windowMidVerticalFrame.rotation.y = -Math.PI / 2;
        this.windowMidVerticalFrame.rotation.z = Math.PI / 2; // Rotate to orient correctly

        // Position the horizontal middle frame
        this.windowMidHorizontalFrame.position.set(7.495, 3, 0);
        this.windowMidHorizontalFrame.rotation.y = -Math.PI / 2; // Rotate to orient correctly
    }
}
