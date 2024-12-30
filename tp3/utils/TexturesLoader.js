import * as THREE from 'three'; // Import the THREE.js library

// Class to handle loading and managing textures in the scene
class TexturesLoader {
    constructor(app) {
        this.app = app; // Application instance, typically used for scene management
        this.textures = []; // Initialize an empty array to store textures
    }

    // Method to load textures based on the provided texture data
    read(textures) {
        const textureLoader = new THREE.TextureLoader(); // Create a new TextureLoader instance to load textures

        // Iterate over all textures in the input data
        for (let key in textures) {
            let textureData = textures[key]; // Retrieve the texture data for the current texture key

            // Load the texture file and store it in the textures array
            this.textures[key.toLowerCase()] = textureLoader.load(textureData.filepath);
            this.textures[key.toLowerCase()].name = key.toLowerCase(); // Set the texture's name to the lowercase version of the key
            this.textures[key.toLowerCase()].isVideo = false; // Default setting: texture is not a video

            // Check if the texture is a video, and if so, set the corresponding properties
            if (textureData.isVideo !== undefined) {
                this.textures[key.toLowerCase()].isVideo = textureData.isVideo;
                this.textures[key.toLowerCase()].videoPath = textureData.filepath; // Store the video filepath
            }
        }
    }
}

// Export the TexturesLoader class for use in other parts of the application
export { TexturesLoader }; 