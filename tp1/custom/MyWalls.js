import * as THREE from 'three';

export class MyWalls {
    constructor() {
        // Create a texture loader for loading wall textures
        this.textureLoader = new THREE.TextureLoader();

        // Load the wall texture and set up its wrapping properties
        this.wallTexture = this.textureLoader.load('textures/wall.jpg');
        this.wallTexture.wrapS = THREE.RepeatWrapping; // Repeat the texture horizontally
        this.wallTexture.wrapT = THREE.RepeatWrapping; // Repeat the texture vertically
        this.wallTexture.repeat.set(4, 2); // Set the repeat count for the texture

        // Create a bump map using the same texture for added depth
        this.wallBumpMap = this.wallTexture.clone(); // Clone the wall texture for bump mapping
        this.wallBumpMap.repeat.set(4, 2); // Set the same repeat count for the bump map

        // Define the material for the walls, including the texture and bump map
        this.wallMaterial = new THREE.MeshStandardMaterial({
            map: this.wallTexture, // Texture applied to the walls
            bumpMap: this.wallBumpMap, // Bump map for added depth
            bumpScale: 0.1 // Scale for bump effect
        });

        // Define dimensions for the walls
        this.wallHeight = 6; // Height of the walls
        this.wallLength1 = 10; // Length of the first two walls
        this.wallLength2 = 15; // Length of the last two walls

        // Array to hold all the wall meshes
        this.walls = [];

        // Create Wall 1
        const wall1Geometry = new THREE.PlaneGeometry(this.wallLength2, this.wallHeight, 1, 1);
        this.wall1 = new THREE.Mesh(wall1Geometry, this.wallMaterial); // Create a mesh for Wall 1
        this.walls.push(this.wall1); // Add Wall 1 to the walls array

        // Create Wall 2
        const wall2Geometry = new THREE.PlaneGeometry(this.wallLength2, this.wallHeight, 1, 1);
        this.wall2 = new THREE.Mesh(wall2Geometry, this.wallMaterial); // Create a mesh for Wall 2
        this.walls.push(this.wall2); // Add Wall 2 to the walls array

        // Create Wall 3
        const wall3Geometry = new THREE.PlaneGeometry(this.wallLength1, this.wallHeight, 1, 1);
        this.wall3 = new THREE.Mesh(wall3Geometry, this.wallMaterial); // Create a mesh for Wall 3
        this.walls.push(this.wall3); // Add Wall 3 to the walls array

        // Create Wall 4
        const wall4Geometry = new THREE.PlaneGeometry(this.wallLength1, this.wallHeight, 1, 1);
        this.wall4 = new THREE.Mesh(wall4Geometry, this.wallMaterial); // Create a mesh for Wall 4
        this.walls.push(this.wall4); // Add Wall 4 to the walls array

        // Scale all wall parts to their desired size (default scale of 1:1)
        this.scaleWallsParts(1, 1, 1);
    }

    // Method to scale all wall parts
    scaleWallsParts(scaleX, scaleY, scaleZ) {
        this.walls.forEach(part => {
            part.scale.set(scaleX, scaleY, scaleZ); // Apply scaling to each wall
        });
    }

    // Method to build and position the walls in the scene
    build() {
        // Position and rotate Wall 1
        this.wall1.position.set(0, this.wallHeight / 2, this.wallLength1 / 2); // Position at the back
        this.wall1.rotation.y = Math.PI; // Rotate to face the inside

        // Position Wall 2
        this.wall2.position.set(0, this.wallHeight / 2, -this.wallLength1 / 2); // Position at the front

        // Position and rotate Wall 3 (left side)
        this.wall3.position.set(-this.wallLength2 / 2, this.wallHeight / 2, 0); // Position on the left
        this.wall3.rotation.y = Math.PI / 2; // Rotate to face the inside

        // Position and rotate Wall 4 (right side)
        this.wall4.position.set(this.wallLength2 / 2, this.wallHeight / 2, 0); // Position on the right
        this.wall4.rotation.y = -Math.PI / 2; // Rotate to face the inside
    }
}
