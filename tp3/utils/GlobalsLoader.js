import * as THREE from 'three'; // Import the THREE.js library for 3D graphics rendering

// Class to load global settings (like background, lighting, fog, and skybox) into a THREE.js scene
class GlobalsLoader {
    constructor(app) {
        // Constructor accepts an application object that contains the scene
        this.app = app;
    }

    // Reads global settings and applies them to the scene
    readAndApply(globals) {
        // Set the background color of the scene if defined
        if (globals.background !== undefined) {
            // Create a THREE.Color object from the RGB values
            let backgroundColor = new THREE.Color(globals.background.r, globals.background.g, globals.background.b);
            // Apply the background color to the scene
            this.app.scene.background = backgroundColor;
        }

        // Add ambient light to the scene if defined
        if (globals.ambient !== undefined) {
            // Create a THREE.Color object for the ambient light
            let ambientLightColor = new THREE.Color(globals.ambient.r, globals.ambient.g, globals.ambient.b);
            // Default intensity for the ambient light
            let intensity = 1;

            // Override intensity if specified in the globals object
            if (globals.ambient.intensity !== undefined) {
                intensity = globals.ambient.intensity;
            }

            // Create the ambient light with the specified color and intensity
            let ambientLight = new THREE.AmbientLight(ambientLightColor, intensity);
            // Add the ambient light to the scene
            this.app.scene.add(ambientLight);
        }

        // Add fog to the scene if defined
        if (globals.fog !== undefined) {
            // Create a THREE.Color object for the fog color
            let fogColor = new THREE.Color(globals.fog.color.r, globals.fog.color.g, globals.fog.color.b);
            // Extract near and far fog distances
            let fogNear = globals.fog.near;
            let fogFar = globals.fog.far;

            // Create the fog object
            let fog = new THREE.Fog(fogColor, fogNear, fogFar);
            // Apply the fog to the scene
            this.app.scene.fog = fog;
        }

        // Add a skybox to the scene if defined
        if (globals.skybox !== undefined) {
            let skybox = globals.skybox;

            // Create a box geometry with the specified dimensions
            let geometry = new THREE.BoxGeometry(skybox.size.x, skybox.size.y, skybox.size.z);

            // Create a texture loader to load skybox textures
            let textureLoader = new THREE.TextureLoader();

            // Array to hold the materials for the six faces of the skybox
            let materials = [];

            // Function to load a texture and assign it to the correct material index
            let loadTexture = (path, i) => {
                textureLoader.load(path, (texture) => {
                    // Create a material for the texture
                    let material = new THREE.MeshStandardMaterial({
                        map: texture,    // Set the texture map
                        fog: false,      // Disable fog for the skybox
                        side: THREE.BackSide // Render the inside faces of the box
                    });
                    // Assign the material to the materials array
                    materials[i] = material;
                });
            };

            // Load textures for each face of the skybox
            loadTexture(skybox.front, 0);
            loadTexture(skybox.back, 1);
            loadTexture(skybox.up, 2);
            loadTexture(skybox.down, 3);
            loadTexture(skybox.left, 4);
            loadTexture(skybox.right, 5);

            // Create a mesh from the geometry and materials
            let skyboxMesh = new THREE.Mesh(geometry, materials);
            // Position the skybox at the specified center coordinates
            skyboxMesh.position.set(skybox.center.x, skybox.center.y, skybox.center.z);

            // Add the skybox mesh to the scene
            this.app.scene.add(skyboxMesh);
        }
    }
}

// Export the GlobalsLoader class for use in other modules
export { GlobalsLoader };
