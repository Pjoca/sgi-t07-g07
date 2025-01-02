import * as THREE from 'three'; // Import the THREE.js library for 3D rendering
import {MyFileReader} from './parser/MyFileReader.js'; // Import custom file reader for loading scene data
import {GlobalsLoader} from "./utils/GlobalsLoader.js"; // Import loader for global settings in the scene
import {CamerasLoader} from "./utils/CamerasLoader.js"; // Import loader for camera settings
import {TexturesLoader} from "./utils/TexturesLoader.js"; // Import loader for textures in the scene
import {MaterialsLoader} from "./utils/MaterialsLoader.js"; // Import loader for materials in the scene
import {GraphLoader} from "./utils/GraphLoader.js"; // Import loader for the scene graph (objects and structure)
import {MyGuiInterface} from "./MyGuiInterface.js"; // Import custom GUI interface for user controls
import {ObjectCreator} from "./utils/ObjectCreator.js"; // Import object creator to create scene objects
import {MyAxis} from './MyAxis.js'; // Import axis helper for scene visualization

/**
 * This class contains and manages the contents of the application, including loading and creating scene elements.
 */
class MyContents {

    /**
     * Constructs the MyContents object
     * @param {MyApp} app The application object to interact with the rest of the app
     */
    constructor(app) {
        this.app = app // Store reference to the application object
        this.axis = null // Axis object for visualization

        // Initialize file reader and load the scene JSON file
        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/SGI_TP3_T07_G07.json"); // Open the specific scene file

        // Initialize loaders for various scene elements
        this.globalsLoader = new GlobalsLoader(this.app); // Loader for global settings
        this.camerasLoader = new CamerasLoader(this.app); // Loader for camera configurations
        this.texturesLoader = new TexturesLoader(this.app); // Loader for textures
        this.materialsLoader = new MaterialsLoader(this.app); // Loader for materials
        this.graphLoader = new GraphLoader(this.app); // Loader for the scene graph (structure of the objects)

        // Object creator to generate objects from the graph and materials
        this.objectCreator = new ObjectCreator(this.app, this.graphLoader, this.materialsLoader);
    }

    /**
     * Initializes the contents of the application (e.g., creating the axis if needed).
     */
    init() {
        // Check if the axis has already been created; if not, create it
        if (this.axis === null) {
            this.axis = new MyAxis(this); // Create the axis object
            this.app.scene.add(this.axis); // Optionally add the axis to the scene
        }
    }

    /**
     * Callback method invoked when the scene JSON file has been loaded
     * @param {Object} data The parsed scene data
     */
    onSceneLoaded(data) {
        // Call the method to process and load the scene data
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    /**
     * Recursively prints the structure of the YASF (scene) data for debugging purposes
     * @param {Object} data The scene data to print
     * @param {string} indent The indentation level for nested objects (for better readability)
     */
    printYASF(data, indent = '') {
        // Iterate over the keys in the data object
        for (let key in data) {
            // If the value is an object, recursively print its contents
            if (typeof data[key] === 'object' && data[key] !== null) {
                console.log(`${indent}${key}:`);
                this.printYASF(data[key], indent + '\t'); // Call recursively with increased indentation
            } else {
                // Otherwise, print the key and its value
                console.log(`${indent}${key}: ${data[key]}`);
            }
        }
    }

    /**
     * Method to process and apply the scene data after loading the YASF scene file
     * @param {Object} data The loaded scene data (includes global settings, cameras, textures, etc.)
     */
    onAfterSceneLoadedAndBeforeRender(data) {
        // Check if the YASF (scene) data exists
        if (data.yasf !== undefined) {
            // Load global settings
            this.globalsLoader.readAndApply(data.yasf.globals);

            // Load camera settings
            this.camerasLoader.readAndApply(data.yasf.cameras);

            // Load textures
            this.texturesLoader.read(data.yasf.textures);

            // Load materials (using the loaded textures)
            this.materialsLoader.read(data.yasf.materials, this.texturesLoader.textures);

            // Load the scene graph (structure of objects in the scene)
            this.graphLoader.read(data.yasf.graph);

            // Create scene objects based on the loaded graph and materials
            this.objectCreator.createObjects();
        }

        // Create and initialize the GUI for the application
        this.createGui();
    }

    /**
     * Update method for handling any dynamic updates in the contents (currently empty).
     */
    update() {
        // This method could be used for updates, animations, or other real-time changes.
    }

    /**
     * Creates the GUI interface and sets it in the application
     */
    createGui() {
        // Create a new GUI interface
        let gui = new MyGuiInterface(this.app);
        gui.setContents(this); // Set the contents for the GUI
        this.app.setGui(gui); // Set the created GUI in the app
        gui.init(); // Initialize the GUI (e.g., setting up controls, event listeners)
    }

    /**
     * Updates the wireframe mode for all polygons in the scene (useful for debugging)
     * @param {boolean} wireframe Whether to enable or disable wireframe mode
     */
    updatePolygonWireframe(wireframe) {
        // Iterate over all polygons created in the scene and update their wireframe mode
        this.objectCreator.polygons.forEach(polygon => {
            polygon.material.wireframe = wireframe; // Set wireframe mode for each polygon's material
        });
    }

    /**
     * Updates the bump scale of all materials that have a bump map
     * @param {number} bumpScale The new bump scale factor
     */
    updateBumpScale(bumpScale) {
        // Iterate over all materials and update the bump scale for materials with a bump map
        for (let materialKey in this.materialsLoader.materials) {
            const material = this.materialsLoader.materials[materialKey];
            if (material.bumpMap) {
                material.bumpScale = bumpScale * 1.5; // Adjust the bump scale (with a factor of 1.5)
            }
        }
    }
}

export {MyContents}; // Export the MyContents class to be used elsewhere
