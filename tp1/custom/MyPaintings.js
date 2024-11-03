import * as THREE from 'three';

export class MyPaintings {
    constructor() {
        // Dimensions for the paintings
        this.width = 1.5; // Width of each painting
        this.height = 2.25; // Height of each painting

        // Initialize a texture loader for loading image textures
        const textureLoader = new THREE.TextureLoader();

        // Load the texture for the first painting
        this.firstTexture = textureLoader.load('textures/pessoa.jpg');

        // Create a material for the first painting with a specific shininess
        this.firstMaterial = new THREE.MeshPhongMaterial({
            map: this.firstTexture, // Use the loaded texture
            shininess: 20 // Set the shininess of the material
        });

        // Create the geometry for the painting
        this.paintingGeometry = new THREE.PlaneGeometry(this.width, this.height);

        // Create the first painting mesh with geometry and material
        this.firstPainting = new THREE.Mesh(this.paintingGeometry, this.firstMaterial);

        // Load the texture for the second painting
        this.secondTexture = textureLoader.load('textures/mendes.jpg');

        // Create a material for the second painting with a specific shininess
        this.secondMaterial = new THREE.MeshPhongMaterial({
            map: this.secondTexture, // Use the loaded texture
            shininess: 20 // Set the shininess of the material
        });

        // Create the second painting mesh with geometry and material
        this.secondPainting = new THREE.Mesh(this.paintingGeometry, this.secondMaterial);

        // Load the texture for the frame
        this.frameTexture = textureLoader.load('textures/frame.jpg');

        // Create a material for the frame with specific properties
        this.frameMaterial = new THREE.MeshPhongMaterial({
            map: this.frameTexture, // Use the loaded texture for the frame
            specular: "#394143", // Set the specular color of the frame
            shininess: 40 // Set the shininess of the frame material
        });

        // Create geometries for the frame parts (top, bottom, left, right)
        this.topFrameGeometry = new THREE.BoxGeometry(this.width, 0.16, 0.1); // Top frame
        this.bottomFrameGeometry = new THREE.BoxGeometry(this.width, 0.16, 0.1); // Bottom frame
        this.leftFrameGeometry = new THREE.BoxGeometry(this.height + 0.31, 0.16, 0.1); // Left frame (height adjusted for overlap)
        this.rightFrameGeometry = new THREE.BoxGeometry(this.height + 0.31, 0.16, 0.1); // Right frame (height adjusted for overlap)

        // Create mesh objects for the frames
        this.topFrame = new THREE.Mesh(this.topFrameGeometry, this.frameMaterial);
        this.bottomFrame = new THREE.Mesh(this.bottomFrameGeometry, this.frameMaterial);
        this.leftFrame = new THREE.Mesh(this.leftFrameGeometry, this.frameMaterial);
        this.rightFrame = new THREE.Mesh(this.rightFrameGeometry, this.frameMaterial);

        // Create a second set of frame meshes for the second painting
        this.topFrame2 = new THREE.Mesh(this.topFrameGeometry, this.frameMaterial);
        this.bottomFrame2 = new THREE.Mesh(this.bottomFrameGeometry, this.frameMaterial);
        this.leftFrame2 = new THREE.Mesh(this.leftFrameGeometry, this.frameMaterial);
        this.rightFrame2 = new THREE.Mesh(this.rightFrameGeometry, this.frameMaterial);
    }

    // Method to build and position paintings and their frames in the scene
    build() {
        // Position the first painting and set its rotation
        this.firstPainting.position.set(2, 3, 4.995); // Set position (x, y, z)
        this.firstPainting.rotation.y = -Math.PI; // Rotate the first painting to face the viewer

        // Position the second painting and set its rotation
        this.secondPainting.position.set(-2, 3, 4.995); // Set position (x, y, z)
        this.secondPainting.rotation.y = -Math.PI; // Rotate the second painting to face the viewer

        // Position and rotate the frame components for the first painting
        this.topFrame.position.set(-2, 4.20, 4.995); // Top frame position
        this.bottomFrame.position.set(-2, 1.80, 4.995); // Bottom frame position
        this.leftFrame.position.set(-2.825, 3, 4.995); // Left frame position
        this.leftFrame.rotation.z = -Math.PI / 2; // Rotate left frame to stand upright
        this.rightFrame.position.set(-1.175, 3, 4.995); // Right frame position
        this.rightFrame.rotation.z = -Math.PI / 2; // Rotate right frame to stand upright

        // Position and rotate the frame components for the second painting
        this.topFrame2.position.set(2, 4.20, 4.995); // Top frame position for second painting
        this.bottomFrame2.position.set(2, 1.80, 4.995); // Bottom frame position for second painting
        this.leftFrame2.position.set(2.825, 3, 4.995); // Left frame position for second painting
        this.leftFrame2.rotation.z = -Math.PI / 2; // Rotate left frame for second painting to stand upright
        this.rightFrame2.position.set(1.175, 3, 4.995); // Right frame position for second painting
        this.rightFrame2.rotation.z = -Math.PI / 2; // Rotate right frame for second painting to stand upright
    }
}
