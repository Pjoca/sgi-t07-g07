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
            let skybox = globals.skybox;

            let geometry = new THREE.BoxGeometry(skybox.size.x, skybox.size.y, skybox.size.z);

            let textureLoader = new THREE.TextureLoader();

            let materials = [];

            let loadTexture = (path, i) => {
                textureLoader.load(path, (texture) => {
                    let material = new THREE.MeshStandardMaterial({
                        map: texture,
                        fog: false,
                        side: THREE.BackSide
                    });
                    materials[i] = material;
                });
            };

            loadTexture(skybox.front, 0);
            loadTexture(skybox.back, 1);
            loadTexture(skybox.up, 2);
            loadTexture(skybox.down, 3);
            loadTexture(skybox.left, 4);
            loadTexture(skybox.right, 5);

            let skyboxMesh = new THREE.Mesh(geometry, materials);
            skyboxMesh.position.set(skybox.center.x, skybox.center.y, skybox.center.z);

            this.app.scene.add(skyboxMesh);
        }
    }
}

export {GlobalsLoader};