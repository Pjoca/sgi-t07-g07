import * as THREE from 'three';
import { MyFileReader } from './parser/MyFileReader.js';
import { GlobalsLoader } from "./utils/GlobalsLoader.js";
import { CamerasLoader } from "./utils/CamerasLoader.js";
import { TexturesLoader } from "./utils/TexturesLoader.js";
import { MaterialsLoader } from "./utils/MaterialsLoader.js";
import { GraphLoader } from "./utils/GraphLoader.js";
import {MyGuiInterface} from "./MyGuiInterface.js";
import {ObjectCreator} from "./utils/ObjectCreator.js";
//import { MyAxis } from './MyAxis.js';

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
        //this.axis = null

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/SGI_TP2_T07_G07_v01.json");

        this.globalsLoader = new GlobalsLoader(this.app);
        this.camerasLoader = new CamerasLoader(this.app);
        this.texturesLoader = new TexturesLoader(this.app);
        this.materialsLoader = new MaterialsLoader(this.app);
        this.graphLoader = new GraphLoader(this.app);

        this.objectCreator = new ObjectCreator(this.app, this.graphLoader, this.materialsLoader);
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        /*if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }*/
    }

    /**
     * Called when the scene JSON file load is completed
     * @param {Object} data with the entire scene object
     */
    onSceneLoaded(data) {
        //console.info("YASF loaded.")
        //console.log(data)
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    printYASF(data, indent = '') {
        for (let key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                console.log(`${indent}${key}:`);
                this.printYASF(data[key], indent + '\t');
            } else {
                console.log(`${indent}${key}: ${data[key]}`);
            }
        }
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        if (data.yasf !== undefined) {
            // Globals
            this.globalsLoader.readAndApply(data.yasf);

            // Cameras
            this.camerasLoader.readAndApply(data.yasf.cameras);

            // Textures
            this.texturesLoader.read(data.yasf.textures);

            // Materials
            this.materialsLoader.read(data.yasf.materials, this.texturesLoader.textures);

            // Graph
            this.graphLoader.read(data.yasf.graph);

            // Create Objects
            this.objectCreator.createObjects();

            //console.log(this.app.scene)
        }

        this.createGui();
    }

    update() {
    }

    createGui() {
        let gui = new MyGuiInterface(this.app);
        gui.setContents(this);
        this.app.setGui(gui);
        gui.init();
    }
}

export { MyContents };
