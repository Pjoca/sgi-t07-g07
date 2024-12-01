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
        this.app = app;
        this.contents = null;
        this.datgui = null;
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
        this.datgui = new GUI();

        const lightsFolder = this.datgui.addFolder('Lights');

        const pointLightsFolder = lightsFolder.addFolder('PointLights');
        const spotLightsFolder = lightsFolder.addFolder('SpotLights');
        const directionalLightsFolder = lightsFolder.addFolder('DirectionalLights');

        for (const [lightId, light] of Object.entries(this.app.contents.objectCreator.lights)) {
            if (light.type === "PointLight") {
                const folder = pointLightsFolder.addFolder(`PointLight ${lightId}`)
                folder.add(this.app.contents.objectCreator.lights[lightId], 'intensity', 0, this.app.contents.objectCreator.lights[lightId].intensity*20, this.app.contents.objectCreator.lights[lightId].intensity/10).name(`Intensity`);
            } else if (light.type === "SpotLight") {
                const folder = spotLightsFolder.addFolder(`SpotLight ${lightId}`)
                folder.add(this.app.contents.objectCreator.lights[lightId], 'intensity', 0, this.app.contents.objectCreator.lights[lightId].intensity*200, this.app.contents.objectCreator.lights[lightId].intensity/10).name(`Intensity`);
                folder.addColor(this.app.contents.objectCreator.lights[lightId], 'color').name(`Color`);
                folder.add(this.app.contents.objectCreator.lights[lightId], 'distance', 0, 1000, 1).name(`Distance`);
                folder.add(this.app.contents.objectCreator.lights[lightId], 'decay', 1, 5, 0.1).name(`Decay`);
                folder.add(this.app.contents.objectCreator.lights[lightId], 'angle', 0, Math.PI / 2, 0.01).name(`Angle`);
                folder.add(this.app.contents.objectCreator.lights[lightId], 'penumbra', 0, 1, 0.01).name(`Penumbra`);
            } else {
                const folder = directionalLightsFolder.addFolder(`DirectionalLight ${lightId}`)
                folder.add(this.app.contents.objectCreator.lights[lightId], 'intensity', 0, this.app.contents.objectCreator.lights[lightId].intensity*20, this.app.contents.objectCreator.lights[lightId].intensity/10).name(`Intensity`);
            }
        }

        lightsFolder.close()

        const polygonFolder = this.datgui.addFolder('Polygons');
        polygonFolder.add(this.app.contents.objectCreator, 'polygonWireframe').name('Wireframe Mode').onChange((value) => {
            this.contents.updatePolygonWireframe(value);
        });

        polygonFolder.add(this.contents.objectCreator.materialsLoader, 'bumpScale', 0.0001, 0.9).name('Bump Scale').onChange((value) => {
            this.contents.updateBumpScale(value);
        });
        polygonFolder.close();

        const cameraFolder = this.datgui.addFolder('Camera');
        cameraFolder.add(this.app, 'activeCameraName', Object.keys(this.app.cameras)).name("Active Camera").onChange(() => {
            this.app.activeCamera = this.app.cameras[this.app.activeCameraName];
            cameraFolder.close();
            this.init();
        });

        if (this.app.activeCamera.type === "PerspectiveCamera") {
            cameraFolder.add(this.app.activeCamera, 'fov', 30, 120, 1).name("FOV").onChange(() => {
                this.app.activeCamera.updateProjectionMatrix();
            });
        }

        cameraFolder.add(this.app.activeCamera, 'near', 0.1, 10, 0.1).name("Near").onChange(() => {
            this.app.activeCamera.updateProjectionMatrix();
        });
        cameraFolder.add(this.app.activeCamera, 'far', 100, 2000, 10).name("Far").onChange(() => {
            this.app.activeCamera.updateProjectionMatrix();
        });

        if (this.app.activeCamera.type === "OrthographicCamera" && this.app.activeCameraName === "orthogonal1") {
            const subCameraFolder = cameraFolder.addFolder('Position');
            subCameraFolder.add(this.app.activeCamera.position, 'x', -10, 10, 1).name("X").onChange(() => {
                this.app.activeCamera.updateProjectionMatrix();
            });
            subCameraFolder.add(this.app.activeCamera.position, 'y', 0, 10, 1).name("Y").onChange(() => {
                this.app.activeCamera.updateProjectionMatrix();
            });
            subCameraFolder.add(this.app.activeCamera.position, 'z', -10, 10, 1).name("Z").onChange(() => {
                this.app.activeCamera.updateProjectionMatrix();
            });
        }

        cameraFolder.close();
    }
}

export {MyGuiInterface};