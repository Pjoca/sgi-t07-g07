import * as THREE from 'three';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {MyApp} from './MyApp.js';
import {MyContents} from './MyContents.js';

/**
 This class customizes the gui interface for the app
 */
class MyGuiInterface {
    /**
     *
     * @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app
        this.datgui = new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera');
        cameraFolder.add(this.app, 'activeCameraName', ['Default', 'Left', 'Right', 'Top', 'Front', 'Back']).name("Active Camera");
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("X")
        cameraFolder.add(this.app.activeCamera.position, 'y', 0, 10).name("Y")
        cameraFolder.add(this.app.activeCamera.position, 'z', 0, 10).name("Z")
        cameraFolder.open()

        // Spotlight folder with a toggle
        const spotlightFolder = this.datgui.addFolder('Spotlight');
        spotlightFolder.addColor(this.app.contents.spotlight.light, 'color').name("Color").onChange((value) => {
            this.app.contents.spotlight.light.color.set(value);
        });
        spotlightFolder.add(this.app.contents.spotlight.light, 'intensity', 0, 50).name("Intensity");
        spotlightFolder.add(this.app.contents.spotlight.light, 'angle', 0, Math.PI / 2).name("Angle");
        spotlightFolder.add(this.app.contents.spotlight.light, 'distance', 0, 20).name("Distance");
        spotlightFolder.add(this.app.contents.spotlight.light, 'penumbra', 0, 1).name("Penumbra");
        spotlightFolder.add(this.app.contents.spotlight.light, 'decay', 0, 2).name("Decay");
        spotlightFolder.open();

        const textureFolder = this.datgui.addFolder('Floor Texture Controls');
        textureFolder.add(this.app.contents.floor.floorTexture.repeat, 'x', 0, 8, 1).name("Repeat U").onChange((value) => {
            this.app.contents.floor.floorTexture.repeat.x = value;
        });
        textureFolder.add(this.app.contents.floor.floorTexture.repeat, 'y', 0, 8, 1).name("Repeat V").onChange((value) => {
            this.app.contents.floor.floorTexture.repeat.y = value;
        });
        textureFolder.open();
    }
}

export {MyGuiInterface};