import * as THREE from 'three';

class CamerasLoader {
    constructor(app) {
        this.app = app;
    }

    readAndApply(cameras) {
        for (let key in cameras) {
            if (key === "initial") continue;

            let cameraData = cameras[key];

            let camera = null;

            if (cameraData.type === "orthogonal") {
                camera = new THREE.OrthographicCamera(
                    cameraData.left,
                    cameraData.right,
                    cameraData.top,
                    cameraData.bottom,
                    cameraData.near,
                    cameraData.far
                );
            } else if (cameraData.type === "perspective") {
                camera = new THREE.PerspectiveCamera(
                    cameraData.angle,
                    window.innerWidth / window.innerHeight,
                    cameraData.near,
                    cameraData.far
                );
            }

            camera.position.set(cameraData.location.x, cameraData.location.y, cameraData.location.z);
            camera.lookAt(new THREE.Vector3(cameraData.target.x, cameraData.target.y, cameraData.target.z));

            this.app.cameras[key] = camera;
        }

        let initialCameraName = cameras.initial;
        this.app.setActiveCamera(initialCameraName);

        delete this.app.cameras["default"];
    }
}

export { CamerasLoader };