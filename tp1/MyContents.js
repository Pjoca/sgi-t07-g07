import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFloor } from './custom/MyFloor.js';
import { MyWalls } from './custom/MyWalls.js';
import { MyTable } from './custom/MyTable.js';
import { MyChair } from "./custom/MyChair.js";
import { MyPlate } from './custom/MyPlate.js';
import { MyCake } from './custom/MyCake.js';
import { MyCandle } from './custom/MyCandle.js';
import { MyRug } from './custom/MyRug.js';
import { MyNewspaper } from './custom/MyNewspaper.js';
import { MyLandscape } from "./custom/MyLandscape.js";
import { MyPaintings } from "./custom/MyPaintings.js";
import { MyFlower } from './custom/MyFlower.js';
import { MyJar } from './custom/MyJar.js';
import { MyBeetle } from "./custom/MyBeetle.js";
import { MySpring } from "./custom/MySpring.js";
import { MySpotlight } from "./custom/MySpotlight.js";
import { MyBadge } from "./custom/MyBadge.js";

/**
 * This class manages the contents of the application,
 * initializing and adding various objects to the scene.
 */
class MyContents {
    /**
     * Constructs the MyContents object.
     * @param {MyApp} app The application object that holds the scene.
     */
    constructor(app) {
        this.app = app; // Reference to the main application
        this.axis = null; // Placeholder for the axis object

        // Create and add various objects to the scene
        this.floor = new MyFloor(); // Initialize the floor
        this.app.scene.add(this.floor.plane); // Add floor to the scene

        this.walls = new MyWalls(); // Initialize walls
        this.app.scene.add(this.walls.wall1, this.walls.wall2, this.walls.wall3, this.walls.wall4); // Add walls to the scene

        this.table = new MyTable(); // Initialize table
        this.app.scene.add(this.table.tabletop, this.table.leg1, this.table.leg2, this.table.leg3, this.table.leg4); // Add table components

        this.chair = new MyChair(); // Initialize chair
        this.app.scene.add(this.chair.leg1, this.chair.leg2, this.chair.leg3, this.chair.leg4, 
            this.chair.auxiliarLeg1, this.chair.auxiliarLeg2, this.chair.auxiliarLeg3, this.chair.auxiliarLeg4, 
            this.chair.auxiliarLeg5, this.chair.auxiliarLeg6, this.chair.sit, 
            this.chair.auxiliarBackrest1, this.chair.auxiliarBackrest2, 
            this.chair.auxiliarBackrest3, this.chair.auxiliarBackrest4, this.chair.auxiliarBackrest5); // Add chair components

        this.plate = new MyPlate(); // Initialize plate
        this.app.scene.add(this.plate.plate, this.plate.smallerPlate); // Add plate components

        this.cake = new MyCake(this.plate); // Initialize cake linked to the plate
        this.app.scene.add(this.cake.cake, this.cake.sliceFace, this.cake.sliceFace2, this.cake.sliceFace3, 
            this.cake.sliceFace4, this.cake.slicePiece); // Add cake components

        this.candle = new MyCandle(this.cake); // Initialize candle linked to the cake
        this.app.scene.add(this.candle.candle, this.candle.flame); // Add candle components

        this.frame = new MyRug(); // Initialize rug
        this.app.scene.add(this.frame.plane); // Add rug to the scene

        this.newspaper = new MyNewspaper(); // Initialize newspaper
        this.app.scene.add(this.newspaper.getMesh()); // Add newspaper to the scene

        this.landscape = new MyLandscape(); // Initialize landscape
        this.app.scene.add(this.landscape.landscape, this.landscape.windowTopFrame, this.landscape.windowBottomFrame, 
            this.landscape.windowLeftFrame, this.landscape.windowRightFrame, 
            this.landscape.windowMidVerticalFrame, this.landscape.windowMidHorizontalFrame); // Add landscape components

        this.paintings = new MyPaintings(); // Initialize paintings
        this.app.scene.add(this.paintings.firstPainting, this.paintings.secondPainting, 
            this.paintings.topFrame, this.paintings.bottomFrame, this.paintings.leftFrame, 
            this.paintings.rightFrame, this.paintings.topFrame2, this.paintings.bottomFrame2, 
            this.paintings.leftFrame2, this.paintings.rightFrame2); // Add painting components

        this.createFlowers(); // Call method to create flowers in the scene

        this.beetle = new MyBeetle(); // Initialize beetle
        this.app.scene.add(this.beetle.lineA, this.beetle.lineB, this.beetle.lineC, this.beetle.lineD, 
            this.beetle.lineE, this.beetle.painting, this.beetle.topFrame, this.beetle.bottomFrame, 
            this.beetle.leftFrame, this.beetle.rightFrame); // Add beetle components

        this.spring = new MySpring(); // Initialize spring
        this.app.scene.add(this.spring.springMesh); // Add spring to the scene

        this.spotlight = new MySpotlight(); // Initialize spotlight
        this.app.scene.add(this.spotlight.base, this.spotlight.pole, this.spotlight.cover, 
            this.spotlight.bulb, this.spotlight.light, this.spotlight.lightTarget); // Add spotlight components

        this.badge = new MyBadge(); // Initialize badge
        this.app.scene.add(this.badge.badge, this.badge.topFrame, this.badge.leftFrame, 
            this.badge.bottomFrame, this.badge.rightFrame, this.badge.glass); // Add badge components

        // Box related attributes
        this.boxMesh = null; // Placeholder for the box mesh
        this.boxMeshSize = 1.0; // Size of the box
        this.boxEnabled = false; // Flag to indicate if box is enabled
        this.lastBoxEnabled = null; // Last state of box enabled flag
        this.boxDisplacement = new THREE.Vector3(0, 2, 0); // Position displacement for the box

        // Plane material properties
        this.diffusePlaneColor = "#c0c0c0"; // Default diffuse color for the plane
        this.specularPlaneColor = "#777777"; // Default specular color for the plane
        this.planeShininess = 30; // Default shininess for the plane

        // Initialize texture loader for loading textures
        this.textureLoader = new THREE.TextureLoader();
        this.planeMaterial = new THREE.MeshBasicMaterial({ map: this.textureLoader.load('textures/floor.jpg') }); // Material for the floor
    }

    /**
     * Creates flowers at random positions within the room.
     */
    createFlowers() {
        // Define potential positions and rotations for flowers
        const corners = [
            { position: new THREE.Vector3(-6.5, 0, -4), rotationY: Math.PI / 2 - Math.PI / 3 + Math.PI / 4 },
            { position: new THREE.Vector3(-6.5, 0, 3), rotationY: Math.PI / 2 + Math.PI / 4 },
            { position: new THREE.Vector3(6.5, 0, -4), rotationY: -Math.PI / 2 + Math.PI / 3 - Math.PI / 4 },
            { position: new THREE.Vector3(6.5, 0, 3), rotationY: -Math.PI / 2 - Math.PI / 4 }
        ];

        // Randomly select one of the defined corners
        const randomCornerIndex = Math.floor(Math.random() * corners.length);
        const chosenCorner = corners[randomCornerIndex];
        const flowerCount = 2; // Number of flowers to create

        // Create specified number of flowers at the chosen corner
        for (let i = 0; i < flowerCount; i++) {
            const jar = new MyJar(); // Create a new jar instance
            jar.build(
                chosenCorner.position.clone().add(new THREE.Vector3(0, 0.75, i * 1)), // Adjust Z position to separate jars
                new THREE.Vector3(0.25, 0.25, 0.25) // Scale for the jar
            );
            jar.getMesh().rotation.x = Math.PI; // Set initial rotation along the x-axis
            jar.getMesh().rotation.y = chosenCorner.rotationY; // Set rotation based on corner position

            const flower = new MyFlower(); // Create a new flower instance
            flower.build(
                chosenCorner.position.clone().add(new THREE.Vector3(0, 0.65, i * 1)), // Adjust Y position slightly to separate flowers
                new THREE.Vector3(0.2, 0.2, 0.2) // Scale for the flower
            );
            flower.getMesh().rotation.y = chosenCorner.rotationY; // Match rotation with the jar

            // Add jar and flower meshes to the scene
            this.app.scene.add(jar.getMesh());
            this.app.scene.add(flower.getMesh());
        }
    }

    /**
     * Builds the box mesh with material assigned.
     */
    buildBox() {
        // Define material for the box
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77", // Color of the box
            specular: "#000000", // Specular color
            emissive: "#000000", // Emissive color
            shininess: 90 // Shininess value
        });

        // Create a cube geometry for the box
        let box = new THREE.BoxGeometry(this.boxMeshSize, this.boxMeshSize, this.boxMeshSize);
        this.boxMesh = new THREE.Mesh(box, boxMaterial); // Create the box mesh
        this.boxMesh.rotation.z = 1.5; // Rotate box along the z-axis
        this.boxMesh.rotation.x = -Math.PI / 4; // Rotate box along the x-axis
        this.boxMesh.position.y = this.boxDisplacement.y; // Set initial vertical position
        this.boxMesh.scale.set(2, 2, 2.5); // Scale the box
    }

    /**
     * Initializes the contents and the scene.
     */
    init() {
        // Create axis if it doesn't already exist
        if (this.axis === null) {
            this.axis = new MyAxis(this); // Create a new axis
            this.app.scene.add(this.axis); // Add axis to the scene
        }

        // Create and add point light above the model
        const pointLight = new THREE.PointLight(0xffffff, 500, 0);
        pointLight.position.set(0, 15, 0); // Set position of the light
        pointLight.castShadow = true; // Enable shadows
        pointLight.shadow.mapSize.width = 2048; // Set shadow map size
        pointLight.shadow.mapSize.height = 2048; // Set shadow map size
        pointLight.shadow.camera.near = 9; // Set near clipping plane for shadow camera
        pointLight.shadow.camera.far = 18; // Set far clipping plane for shadow camera
        this.app.scene.add(pointLight); // Add point light to the scene

        // Add point light helper to visualize the position of the light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        this.app.scene.add(pointLightHelper); // Add helper to the scene

        // Add ambient light to the scene
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight); // Add ambient light to the scene

        // Initialize all components
        this.buildBox(); // Build box mesh
        this.floor.build(); // Build floor
        this.walls.build(); // Build walls
        this.table.build(); // Build table
        this.chair.build(); // Build chair
        this.plate.build(); // Build plate
        this.cake.build(); // Build cake
        this.candle.build(); // Build candle
        this.frame.build(); // Build rug
        this.landscape.build(); // Build landscape
        this.paintings.build(); // Build paintings
        this.beetle.build(); // Build beetle
        this.spring.build(); // Build spring
        this.spotlight.build(); // Build spotlight
        this.badge.build(); // Build badge
    }

    /**
     * Updates the diffuse color of the plane and the material.
     * @param {THREE.Color} value The new diffuse color.
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value; // Update diffuse color property
        this.planeMaterial.color.set(this.diffusePlaneColor); // Update material color
    }

    /**
     * Updates the specular color of the plane and the material.
     * @param {THREE.Color} value The new specular color.
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value; // Update specular color property
        this.planeMaterial.specular.set(this.specularPlaneColor); // Update material specular color
    }

    /**
     * Updates the shininess of the plane and the material.
     * @param {number} value The new shininess value.
     */
    updatePlaneShininess(value) {
        this.planeShininess = value; // Update shininess property
        this.planeMaterial.shininess = this.planeShininess; // Update material shininess
    }

    /**
     * Rebuilds the box mesh if required.
     * This method can be called from the GUI interface.
     */
    rebuildBox() {
        // Remove existing box mesh if it exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {
            this.app.scene.remove(this.boxMesh); // Remove box mesh from the scene
        }
        this.buildBox(); // Rebuild the box mesh
        this.lastBoxEnabled = null; // Reset last box enabled state
    }

    /**
     * Updates the box mesh if required based on enabled state.
     * This method is called from the render method of the app.
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) { // Check if box enabled state has changed
            this.lastBoxEnabled = this.boxEnabled; // Update last box enabled state
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh); // Add box mesh to the scene if enabled
            } else {
                this.app.scene.remove(this.boxMesh); // Remove box mesh from the scene if disabled
            }
        }
    }

    /**
     * Updates the contents of the scene.
     * This method is called from the render method of the app.
     */
    update() {
        this.updateBoxIfRequired(); // Check and update box mesh if necessary

        // Set the position of the box mesh based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x; // Update x position
        this.boxMesh.position.y = this.boxDisplacement.y; // Update y position
        this.boxMesh.position.z = this.boxDisplacement.z; // Update z position
    }
}

export { MyContents }; // Export MyContents class for use in other modules
