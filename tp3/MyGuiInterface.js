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

    }
}

export { MyGuiInterface }; // Export the class for use in other modules
