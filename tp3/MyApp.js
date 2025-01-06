import * as THREE from 'three'; // Import the THREE.js library for 3D rendering
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // Import OrbitControls for camera manipulation
import { MyContents } from './MyContents.js'; // Import custom contents class for scene content management
import { MyGuiInterface } from './MyGuiInterface.js'; // Import GUI interface for user controls
import Stats from 'three/addons/libs/stats.module.js' // Import Stats.js for performance tracking (FPS, memory usage, etc.)

/**
 * This class represents the application and manages the rendering process
 */
class MyApp  {
    /**
     * The constructor initializes important properties of the application
     */
    constructor() {
        this.scene = null // The 3D scene where objects will be added
        this.stats = null // The performance stats object (FPS, memory usage)

        // Camera-related attributes
        this.activeCamera = null // The currently active camera
        this.activeCameraName = null // Name of the active camera (used for switching cameras)
        this.lastCameraName = null // The last active camera name (used for detecting changes)
        this.cameras = [] // Stores multiple camera instances
        this.frustumSize = 20 // The size of the camera frustum (view volume)

        // Other application attributes
        this.renderer = null // The renderer for displaying the scene
        this.controls = null // The camera control system (OrbitControls)
        this.contents == null // Placeholder for contents object, which manages scene updates
    }

    /**
     * Initializes the application: scene, renderer, cameras, and event listeners
     */
    init() {
                
        // Create a new, empty scene
        this.scene = new THREE.Scene();

        // Initialize performance tracking with Stats.js
        this.stats = new Stats()
        this.stats.showPanel(1) // 0: FPS, 1: milliseconds per frame, 2: memory usage
        document.body.appendChild(this.stats.dom) // Append the stats panel to the DOM

        this.initCameras(); // Initialize cameras
        this.setActiveCamera("default") // Set the active camera to 'default'

        // Create a WebGL renderer with anti-aliasing for smoother visuals
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio ); // Set pixel ratio based on device resolution
        this.renderer.setClearColor("#000000"); // Set the clear color of the canvas (black)

        // Configure shadow maps for rendering realistic shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Configure renderer size based on window dimensions
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // Append the renderer's DOM element (the canvas) to the page
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        // Set up a resize event listener to handle window resizing
        window.addEventListener('resize', this.onResize.bind(this), false );
    }

    /**
     * Initializes cameras for the scene
     */
    initCameras() {
        // Create a perspective camera and store it in the cameras object under the 'default' key
        const perspective1 = new THREE.PerspectiveCamera();
        this.cameras['default'] = perspective1;
    }

    /**
     * Sets the active camera by its name
     * @param {String} cameraName The name of the camera to be set as active
     */
    setActiveCamera(cameraName) {   
        this.activeCameraName = cameraName // Set the camera name
        this.activeCamera = this.cameras[this.activeCameraName] // Retrieve and set the active camera object
    }

    /**
     * Updates the active camera if required (for switching between cameras)
     * This method is called during the render loop to ensure the active camera and controls are updated
     */
    updateCameraIfRequired() {
        // Check if the active camera has changed
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName; // Update the last camera name
            this.activeCamera = this.cameras[this.activeCameraName] // Set the new active camera
            document.getElementById("camera").innerHTML = this.activeCameraName // Update UI with camera name
           
            // Call the resize handler to update the camera's aspect ratio and other properties
            this.onResize()

            // Check if camera controls (OrbitControls) are not initialized
            if (this.controls === null) {
                // Initialize OrbitControls to allow the camera to orbit around a target
                this.controls = new OrbitControls( this.activeCamera, this.renderer.domElement );
                this.controls.enableZoom = true; // Enable zoom functionality
                this.controls.update(); // Update the controls for the first time
            }
            else {
                // If controls already exist, just update them with the new camera
                this.controls.object = this.activeCamera
            }
        }
    }

    /**
     * Handles window resizing by updating the camera's aspect ratio and the renderer's size
     */
    onResize() {
        // Check if the active camera is defined before applying the resize
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight; // Update the camera aspect ratio
            this.activeCamera.updateProjectionMatrix(); // Apply the updated projection matrix to the camera
            this.renderer.setSize( window.innerWidth, window.innerHeight ); // Adjust the renderer size to match the window
        }
    }

    /**
     * Sets the contents object to manage scene content updates
     * @param {MyContents} contents The contents object
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * Sets the GUI interface object to handle user controls
     * @param {MyGuiInterface} gui The GUI interface object
     */
    setGui(gui) {   
        this.gui = gui
    }

    /**
     * The main render function, called in a requestAnimationFrame loop
     * It updates the camera and contents, then renders the scene
     */
    render () {
        this.stats.begin() // Start the performance tracking

        this.updateCameraIfRequired() // Update the active camera if needed

        // If contents are defined, update them (animation or other logic)
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update() // Update contents (e.g., animate objects in the scene)
        }

        // If damping or auto-rotation is enabled in controls, update them
        this.controls.update();

        // Render the scene using the active camera
        this.renderer.render(this.scene, this.activeCamera);

        // Request the next frame for continuous rendering
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName // Store the current camera name
        this.stats.end() // End the performance tracking
    }
}

export { MyApp }; // Export the MyApp class to be used elsewhere
