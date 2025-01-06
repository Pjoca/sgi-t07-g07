import * as THREE from 'three';

class MyTextRenderer {
    // Constructor that initializes the scene and loads the texture for the font
    constructor(scene, texturePath) {
        this.scene = scene;  // Store the reference to the scene

        // Load the texture from the provided path
        const textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load(texturePath);  // Load the texture image for the font

        // Configuration for the character grid (font atlas)
        this.charactersPerRow = 16;  // Number of characters in each row of the texture
        this.charactersPerColumn = 16;  // Number of characters in each column of the texture

        // Size of each character in the texture (assuming square characters)
        this.charWidth = 32;  
        this.charHeight = 32;

        // Create a material using the loaded texture
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,  // Use the loaded texture as the material map
            transparent: true  // Enable transparency for the text characters
        });
    }

    // Method to get the UV coordinates for a given character in the texture atlas
    getUVCoordinates(char) {
        const index = char.charCodeAt(0);  // Get the Unicode value of the character

        // Calculate the column and row of the character in the texture atlas
        const col = index % this.charactersPerRow;
        const row = Math.floor(index / this.charactersPerRow);

        // Calculate the UV coordinates for the character in the texture
        const u = col / this.charactersPerRow;  // Horizontal coordinate
        const v = 1 - (row + 1) / this.charactersPerColumn;  // Vertical coordinate (inverted for correct mapping)

        return { u, v };  // Return the UV coordinates as an object
    }

    // Method to create a mesh for a text string and place it at the given position
    createTextMesh(text, position, scale = 1) {
        const group = new THREE.Group();  // Create a new group to hold the individual character meshes

        // Iterate through each character in the input text
        text.split('').forEach((char, i) => {
            // Skip characters outside the printable ASCII range (32-126)
            if (char.charCodeAt(0) < 32 || char.charCodeAt(0) > 126) {
                return;
            }

            // Get the UV coordinates for the character from the texture
            const { u, v } = this.getUVCoordinates(char);

            // Create geometry for the character (a plane for each character)
            const geometry = new THREE.PlaneGeometry(
                this.charWidth / 32,  // Character width in normalized texture space
                this.charHeight / 32  // Character height in normalized texture space
            );

            // Create a clone of the texture to apply the correct UV coordinates
            const charTexture = this.texture.clone();
            charTexture.needsUpdate = true;  // Mark the texture for update
            charTexture.offset.set(u, v);  // Offset the texture to the correct character's UV coordinates
            charTexture.repeat.set(
                1 / this.charactersPerRow,  // Horizontal repeat factor (1 character per row)
                1 / this.charactersPerColumn  // Vertical repeat factor (1 character per column)
            );

            // Create the material for the character mesh with the updated texture
            const charMaterial = new THREE.MeshBasicMaterial({
                map: charTexture,  // Apply the updated texture to the material
                transparent: true  // Enable transparency for the character
            });

            // Create the mesh for the character and apply the geometry and material
            const charMesh = new THREE.Mesh(geometry, charMaterial);

            // Position the character mesh based on the index in the text (spacing between characters)
            charMesh.position.x = i * (this.charWidth / 32) * scale;
            charMesh.scale.set(scale, scale, scale);  // Apply the scaling factor to the character

            // Add the character mesh to the group
            group.add(charMesh);
        });

        // Set the final position of the text group
        group.position.set(position.x, position.y, position.z);

        // Add the text group to the scene to display it
        this.scene.add(group);

        // Return the group containing all character meshes
        return group;
    }
}

// Export the MyTextRenderer class so it can be used in other parts of the application
export { MyTextRenderer };
