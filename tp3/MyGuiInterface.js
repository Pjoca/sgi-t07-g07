import {GUI} from 'three/addons/libs/lil-gui.module.min.js'; // Import the GUI library for creating a user interface
import {MyApp} from './MyApp.js'; // Import the main application object
import {MyContents} from './MyContents.js'; // Import the contents of the scene (3D objects, materials, etc.)

/**
 * This class customizes the GUI interface for the application, allowing the user to control various aspects of the 3D scene.
 */
class MyGuiInterface {

    /**
     * Constructor to initialize the GUI interface
     * @param {MyApp} app The application object that holds the scene and camera details
     */
    constructor(app) {
        this.app = app; // Store the reference to the application object
        this.contents = null; // Store the contents of the scene (objects, materials, etc.)
        this.datgui = null; // GUI instance to be created later
    }

    /**
     * Set the contents object that holds the scene data and objects
     * @param {MyContents} contents The contents of the scene
     */
    setContents(contents) {
        this.contents = contents; // Store the contents object
    }

    /**
     * Initialize the GUI interface, creating and adding the necessary GUI elements
     */
    init() {
        this.datgui = new GUI(); // Create a new GUI instance using the imported library

        // Create a folder for camera settings
        const cameraFolder = this.datgui.addFolder('Camera');
        
        // Add control for selecting the active camera
        cameraFolder.add(this.app, 'activeCameraName', Object.keys(this.app.cameras)).name("Active Camera").onChange(() => {
            this.app.activeCamera = this.app.cameras[this.app.activeCameraName]; // Switch to the selected camera
            cameraFolder.close(); // Close the camera folder after change
            this.init(); // Reinitialize the GUI (especially camera settings)
        });

        // If the active camera is a PerspectiveCamera, add controls for its field of view (FOV)
        if (this.app.activeCamera.type === "PerspectiveCamera") {
            cameraFolder.add(this.app.activeCamera, 'fov', 30, 120, 1).name("FOV").onChange(() => {
                this.app.activeCamera.updateProjectionMatrix(); // Update the projection matrix when FOV changes
            });
        }

        // Add controls for the near and far clipping planes of the camera
        cameraFolder.add(this.app.activeCamera, 'near', 0.1, 10, 0.1).name("Near").onChange(() => {
            this.app.activeCamera.updateProjectionMatrix(); // Update the projection matrix when near plane changes
        });
        cameraFolder.add(this.app.activeCamera, 'far', 100, 2000, 10).name("Far").onChange(() => {
            this.app.activeCamera.updateProjectionMatrix(); // Update the projection matrix when far plane changes
        });

        // If the active camera is an OrthographicCamera (specifically "orthogonal1"), add controls for its position
        if (this.app.activeCamera.type === "OrthographicCamera" && this.app.activeCameraName === "orthogonal1") {
            const subCameraFolder = cameraFolder.addFolder('Position');
            subCameraFolder.add(this.app.activeCamera.position, 'x', -10, 10, 1).name("X").onChange(() => {
                this.app.activeCamera.updateProjectionMatrix(); // Update the projection matrix when position changes
            });
            subCameraFolder.add(this.app.activeCamera.position, 'y', 0, 10, 1).name("Y").onChange(() => {
                this.app.activeCamera.updateProjectionMatrix(); // Update the projection matrix when position changes
            });
            subCameraFolder.add(this.app.activeCamera.position, 'z', -10, 10, 1).name("Z").onChange(() => {
                this.app.activeCamera.updateProjectionMatrix(); // Update the projection matrix when position changes
            });
        }

        // Close the camera folder
        cameraFolder.close();
    }
}

export { MyGuiInterface }; // Export the class for use in other modules
