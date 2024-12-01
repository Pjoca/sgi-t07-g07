import * as THREE from 'three'; // Import the THREE.js library for 3D graphics rendering

// Class to load and configure cameras into a THREE.js application
class CamerasLoader {
    constructor(app) {
        // Constructor accepts an application object that manages the scene, renderer, and cameras
        this.app = app;
    }

    // Reads camera definitions and applies them to the application
    readAndApply(cameras) {
        // Iterate through the camera definitions in the `cameras` object
        for (let key in cameras) {
            // Skip the "initial" property; it defines the default active camera
            if (key === "initial") continue;

            // Get the camera data for the current key
            let cameraData = cameras[key];

            // Placeholder for the created camera
            let camera = null;

            // Check the type of camera to create
            if (cameraData.type === "orthogonal") {
                // Create an OrthographicCamera with the specified properties
                camera = new THREE.OrthographicCamera(
                    cameraData.left,   // Left clipping plane
                    cameraData.right,  // Right clipping plane
                    cameraData.top,    // Top clipping plane
                    cameraData.bottom, // Bottom clipping plane
                    cameraData.near,   // Near clipping plane
                    cameraData.far     // Far clipping plane
                );
            } else if (cameraData.type === "perspective") {
                // Create a PerspectiveCamera with the specified properties
                camera = new THREE.PerspectiveCamera(
                    cameraData.angle, // Field of view (vertical)
                    window.innerWidth / window.innerHeight, // Aspect ratio
                    cameraData.near,  // Near clipping plane
                    cameraData.far    // Far clipping plane
                );
            }

            // Set the camera's position using the provided location coordinates
            camera.position.set(
                cameraData.location.x,
                cameraData.location.y,
                cameraData.location.z
            );

            // Set the camera's orientation to look at the specified target
            camera.lookAt(
                cameraData.target.x,
                cameraData.target.y,
                cameraData.target.z
            );

            // Render the scene from this camera to ensure it's properly set up
            this.app.renderer.render(this.app.scene, camera);

            // Store the configured camera in the application's `cameras` object
            this.app.cameras[key] = camera;
        }

        // Set the application's active camera to the one specified by the "initial" property
        let initialCameraName = cameras.initial;
        this.app.setActiveCamera(initialCameraName);

        // Remove any default placeholder camera from the application's camera list
        delete this.app.cameras["default"];
    }
}

// Export the CamerasLoader class for use in other modules
export { CamerasLoader };
