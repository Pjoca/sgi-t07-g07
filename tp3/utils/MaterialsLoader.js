// Import the THREE.js library for 3D rendering functionality
import * as THREE from 'three';

// Define the MaterialsLoader class
class MaterialsLoader {
    // Constructor initializes the loader with an application context (app)
    constructor(app) {
        this.app = app; // Store the app context (used for further interactions)
        this.materials = []; // Initialize an empty array to store material data
        this.bumpScale = 0.2; // Set a default value for bump scaling (used for surface detail)
    }

    // Function to read and process material and texture data
    read(materials, textures) {
        // Loop through each material in the materials object
        for (let key in materials) {
            // Retrieve the data for the current material
            let materialData = materials[key];

            // Handle the emissive color, which is the material's own light emission (default black if not specified)
            let emissive = materialData.emissive ? 
                new THREE.Color(materialData.emissive.r, materialData.emissive.g, materialData.emissive.b) :
                new THREE.Color(0, 0, 0); // Default to black if emissive color is not specified

            // Define the main color of the material
            let color = new THREE.Color(materialData.color.r, materialData.color.g, materialData.color.b);

            // Define the specular color (affects the shininess reflection)
            let specular = new THREE.Color(materialData.specular.r, materialData.specular.g, materialData.specular.b);

            // Retrieve the shininess property (controls the sharpness of reflections)
            let shininess = materialData.shininess;

            // Store whether the material is transparent
            let transparent = materialData.transparent;

            // Store the opacity value of the material (0.0 is fully transparent, 1.0 is fully opaque)
            let opacity = materialData.opacity;

            // Retrieve the texture reference from the provided textures object
            let texture = textures[materialData.textureref];

            // Retrieve the bump map reference (used for adding surface detail)
            let bumpTexture = textures[materialData.bumpmapref];

            // If the material specifies a custom bump scale, use it; otherwise, use the default bump scale
            let bumpScale = materialData.bumpscale !== undefined ? materialData.bumpscale : this.bumpScale; 

            // Retrieve the texture repeat values along the S (horizontal) and T (vertical) axes
            let repeatS = materialData.texlength_s;
            let repeatT = materialData.texlength_t;

            // Check if the material is two-sided (render on both sides of faces)
            let twoSided = materialData.twosided;

            // Retrieve the shading model (whether it's flat or smooth shading)
            let shading = materialData.shading;

            // Flag to determine if the texture is a video texture (default is false)
            let isVideo = false;

            // If the texture is defined and has the 'isVideo' property, set isVideo flag to true
            if (texture !== undefined) {
                isVideo = texture.isVideo;
            }
            // Initialize a variable to store the material
            let material;

            if (isVideo) {
                // Create a video element for the texture
                const video = document.createElement('video');
                video.src = texture.videoPath;  // Set the video source path from the texture object
                video.crossOrigin = 'anonymous';  // Enable cross-origin for video loading
                video.loop = true;  // Set video to loop
                video.autoplay = true;  // Automatically play the video once it's ready
                video.muted = true;  // Mute the video (optional, depends on the use case)
            
                // Attempt to play the video, and log any errors if they occur
                video.play().catch((err) => {
                    console.error('Error starting video playback:', err);  // Handle playback errors
                });

                // Create a VideoTexture from the video element 
                const videoTexture = new THREE.VideoTexture(video);
                videoTexture.colorSpace = THREE.SRGBColorSpace; // Set color space to SRGB for proper color rendering
                videoTexture.flipY = true; // Flip the texture vertically to match typical video coordinate systems

                // Create a MeshPhongMaterial 
                material = new THREE.MeshPhongMaterial({
                    emissive: emissive,  // Set emissive color
                    color: color,  // Set main color
                    specular: specular,  // Set specular reflection color
                    shininess: shininess,  // Set shininess (reflectivity detail)
                    transparent: transparent,  // Handle transparency
                    opacity: opacity,  // Set opacity value (0-1 range)
                    side: twoSided ? THREE.DoubleSide : THREE.FrontSide  // Handle double-sided rendering if needed
                });

                // Set the video texture as the material's map
                material.map = new THREE.VideoTexture(video);
            } else {
                material = new THREE.MeshPhongMaterial({
                    // If the texture is not a video, use a regular MeshPhongMaterial
                    emissive: emissive,
                    color: color,
                    specular: specular,
                    shininess: shininess,
                    transparent: transparent,
                    opacity: opacity,
                    side: twoSided ? THREE.DoubleSide : THREE.FrontSide
                });
            }

            // If a non-video texture is available, apply it to the material
            if (texture !== undefined && !isVideo) {
                material.map = texture;  // Set the texture as the material map
                material.map.wrapS = THREE.RepeatWrapping;  // Enable texture wrapping in the horizontal direction
                material.map.wrapT = THREE.RepeatWrapping;  // Enable texture wrapping in the vertical direction
                material.map.repeat.set(repeatS, repeatT);  // Set the texture repeat scale based on input data
            }

            // If a bump map is specified, apply it to the material for additional surface detail
            if (bumpTexture !== undefined) {
                material.bumpMap = bumpTexture;  // Set the bump map (provides surface detail)
                material.bumpMap.wrapS = THREE.RepeatWrapping;  // Enable texture wrapping for bump map in the horizontal direction
                material.bumpMap.wrapT = THREE.RepeatWrapping;  // Enable texture wrapping for bump map in the vertical direction
                material.bumpMap.repeat.set(repeatS, repeatT);  // Set bump map repeat scale
                material.bumpScale = bumpScale;  // Set bump scale to control the bump depth
            }

            // If shading type is specified, adjust the flat shading setting accordingly
            if (shading !== undefined) {
                if (shading === "flat") {
                    material.flatShading = true;  // Use flat shading for angular surfaces
                } else if (shading === "smooth") {
                    material.flatShading = false;  // Use smooth shading for curved surfaces
                }
            }
            // Store the processed material in the materials collection, keyed by the material name (converted to lowercase)
            this.materials[key.toLowerCase()] = material;
            // Set the material's name to its key, ensuring the name is unique and standardized
            this.materials[key.toLowerCase()].name = key.toLowerCase();
        }
    }
    // Method to update the bump scale for all materials that use bump mapping
    updateBumpScale(newScale) {
        this.bumpScale = newScale;  // Update the default bump scale
        // Iterate over all stored materials and adjust the bump scale if the material has a bump map
        for (let key in this.materials) {
            let material = this.materials[key];
            if (material.bumpMap) {
                material.bumpScale = newScale;  // Update bump scale for materials with bump maps
            }
        }
    }
}

// Export the MaterialsLoader class for use in other parts of the application
export {MaterialsLoader};