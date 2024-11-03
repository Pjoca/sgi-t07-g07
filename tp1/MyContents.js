import * as THREE from 'three';
import {MyAxis} from './MyAxis.js';
import {MyFloor} from './custom/MyFloor.js';
import {MyWalls} from './custom/MyWalls.js';
import {MyTable} from './custom/MyTable.js';
import {MyChair} from "./custom/MyChair.js";
import {MyPlate} from './custom/MyPlate.js';
import {MyCake} from './custom/MyCake.js';
import {MyCandle} from './custom/MyCandle.js';
import {MyRug} from './custom/MyRug.js';
import {MyNewspaper} from './custom/MyNewspaper.js';
import {MyLandscape} from "./custom/MyLandscape.js";
import {MyPaintings} from "./custom/MyPaintings.js";
import { MyFlower } from './custom/MyFlower.js';
import { MyJar } from './custom/Myjar.js';
import {MyBeetle} from "./custom/MyBeetle.js";
import {MySpring} from "./custom/MySpring.js";
import {MySpotlight} from "./custom/MySpotlight.js";
import {MyBadge} from "./custom/MyBadge.js";

/**
 *  This class contains the contents of out application
 */
class MyContents {
    /**
     constructs the object
     @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app
        this.axis = null

        // objects
        this.floor = new MyFloor();
        this.app.scene.add(this.floor.plane);

        this.walls = new MyWalls();
        this.app.scene.add(this.walls.wall1, this.walls.wall2, this.walls.wall3, this.walls.wall4);

        this.table = new MyTable();
        this.app.scene.add(this.table.tabletop, this.table.leg1, this.table.leg2, this.table.leg3, this.table.leg4);

        this.chair = new MyChair();
        this.app.scene.add(this.chair.leg1, this.chair.leg2, this.chair.leg3, this.chair.leg4, this.chair.auxiliarLeg1, this.chair.auxiliarLeg2, this.chair.auxiliarLeg3, this.chair.auxiliarLeg4,  this.chair.auxiliarLeg5, this.chair.auxiliarLeg6, this.chair.sit, this.chair.auxiliarBackrest1, this.chair.auxiliarBackrest2, this.chair.auxiliarBackrest3, this.chair.auxiliarBackrest4, this.chair.auxiliarBackrest5);

        this.plate = new MyPlate();
        this.app.scene.add(this.plate.plate, this.plate.smallerPlate);

        this.cake = new MyCake(this.plate);
        this.app.scene.add(this.cake.cake, this.cake.sliceFace, this.cake.sliceFace2, this.cake.sliceFace3, this.cake.sliceFace4, this.cake.slicePiece);

        this.candle = new MyCandle(this.cake);
        this.app.scene.add(this.candle.candle, this.candle.flame);

        this.frame = new MyRug();
        this.app.scene.add(this.frame.plane);

        this.newspaper = new MyNewspaper();
        this.app.scene.add(this.newspaper.getMesh());

        this.landscape = new MyLandscape();
        this.app.scene.add(this.landscape.landscape, this.landscape.windowTopFrame, this.landscape.windowBottomFrame, this.landscape.windowLeftFrame, this.landscape.windowRightFrame, this.landscape.windowMidVerticalFrame, this.landscape.windowMidHorizontalFrame);

        this.paintings = new MyPaintings();
        this.app.scene.add(this.paintings.firstPainting, this.paintings.secondPainting, this.paintings.topFrame, this.paintings.bottomFrame, this.paintings.leftFrame, this.paintings.rightFrame, this.paintings.topFrame2, this.paintings.bottomFrame2, this.paintings.leftFrame2, this.paintings.rightFrame2);

        this.createFlowers();

        this.beetle = new MyBeetle();
        this.app.scene.add(this.beetle.lineA, this.beetle.lineB, this.beetle.lineC, this.beetle.lineD, this.beetle.lineE, this.beetle.painting, this.beetle.topFrame, this.beetle.bottomFrame, this.beetle.leftFrame, this.beetle.rightFrame);

        this.spring = new MySpring();
        this.app.scene.add(this.spring.springMesh);

        this.spotlight = new MySpotlight();
        this.app.scene.add(this.spotlight.base, this.spotlight.pole, this.spotlight.cover, this.spotlight.bulb, this.spotlight.light, this.spotlight.lightTarget);

        this.badge = new MyBadge();
        this.app.scene.add(this.badge.badge, this.badge.topFrame, this.badge.leftFrame, this.badge.bottomFrame, this.badge.rightFrame, this.badge.glass);

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = false
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0, 2, 0)

        this.diffusePlaneColor = "#c0c0c0"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30

        this.textureLoader = new THREE.TextureLoader();
        this.planeMaterial = new THREE.MeshBasicMaterial({map: this.textureLoader.load('textures/floor.jpg')});
    }

    /**
     * Creates flowers at random positions within the room.
     */
    createFlowers() {
        const corners = [
            { position: new THREE.Vector3(-6.5, 0, -4), rotationY: Math.PI / 2 - Math.PI / 3 + Math.PI / 4 },       
            { position: new THREE.Vector3(-6.5, 0, 3), rotationY: Math.PI / 2 + Math.PI / 4 },  
            { position: new THREE.Vector3(6.5, 0, -4), rotationY: -Math.PI / 2 + Math.PI / 3 - Math.PI / 4 },  
            { position: new THREE.Vector3(6.5, 0, 3), rotationY: -Math.PI / 2 - Math.PI / 4 }      
        ];
    
        // Randomly select a corner
        const randomCornerIndex = Math.floor(Math.random() * corners.length);
        const chosenCorner = corners[randomCornerIndex];
        const flowerCount = 2; // Number of flowers to create
    
        // Create two flowers at the chosen corner
        for (let i = 0; i < flowerCount; i++) {
    
            const jar = new MyJar();
            jar.build(
                chosenCorner.position.clone().add(new THREE.Vector3(0, 0.75, i * 1)), // Adjust Z position to separate jars
                new THREE.Vector3(0.25, 0.25, 0.25) // Scale for the jar
            );
            jar.getMesh().rotation.x = Math.PI; // Initial rotation along x-axis
            jar.getMesh().rotation.y = chosenCorner.rotationY; // Rotation based on corner position
    
            const flower = new MyFlower(); // Create a new flower instance
            flower.build(
                chosenCorner.position.clone().add(new THREE.Vector3(0, 0.65, i * 1)), // Adjust Y position slightly to separate flowers
                new THREE.Vector3(0.2, 0.2, 0.2) // Scale
            );
            flower.getMesh().rotation.y = chosenCorner.rotationY; // Match rotation with the jar
    
            this.app.scene.add(jar.getMesh()); // Add the jar mesh to the scene
            this.app.scene.add(flower.getMesh()); // Add the flower mesh to the scene
        }
    }    
    

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77", specular: "#000000", emissive: "#000000", shininess: 90
        })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(this.boxMeshSize, this.boxMeshSize, this.boxMeshSize);
        this.boxMesh = new THREE.Mesh(box, boxMaterial);
        this.boxMesh.rotation.z = 1.5;
        this.boxMesh.rotation.x = -Math.PI / 4;
        this.boxMesh.position.y = this.boxDisplacement.y;
        this.boxMesh.scale.set(2, 2, 2.5);
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight(0xffffff, 500, 0);
        pointLight.position.set(0, 15, 0);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 2048;
        pointLight.shadow.mapSize.height = 2048;
        pointLight.shadow.camera.near = 9;
        pointLight.shadow.camera.far = 18;
        this.app.scene.add(pointLight);

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        this.app.scene.add(pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

        this.buildBox()
        this.floor.build();
        this.walls.build();
        this.table.build();
        this.chair.build();
        this.plate.build();
        this.cake.build();
        this.candle.build();
        this.frame.build();
        this.landscape.build();
        this.paintings.build();
        this.beetle.build();
        this.spring.build();
        this.spotlight.build();
        this.badge.build();
    }

    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }

    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }

    /**
     * updates the plane shininess and the material
     * @param {number} value
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }

    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }

    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            } else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
    }
}

export {MyContents};