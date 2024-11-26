import * as THREE from 'three';

class GlobalsLoader {
    constructor(app) {
        this.app = app;
    }

    readAndApply(globals) {
        if (globals.background !== undefined) {
            let backgroundColor = new THREE.Color(globals.background.r, globals.background.g, globals.background.b);
            this.app.scene.background = backgroundColor;
        }

        if (globals.ambient !== undefined) {
            let ambientLightColor = new THREE.Color(globals.ambient.r, globals.ambient.g, globals.ambient.b);
            let intensity = 1;

            if (globals.ambient.intensity !== undefined) {
                intensity = globals.ambient.intensity;
            }

            let ambientLight = new THREE.AmbientLight(ambientLightColor, intensity);
            this.app.scene.add(ambientLight);
        }

        if (globals.fog !== undefined) {
            let fogColor = new THREE.Color(fog.color.r, fog.color.g, fog.color.b);
            let fogNear = fog.near;
            let fogFar = fog.far;

            let fog = new THREE.Fog(fogColor, fogNear, fogFar);
            this.app.scene.fog = fog;
        }

        if (globals.skybox !== undefined) {
            // TODO
        }
    }
}

export { GlobalsLoader };