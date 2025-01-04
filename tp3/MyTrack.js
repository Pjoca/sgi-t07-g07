import * as THREE from 'three';
import { MyRoute } from './MyRoute.js';
import { MyObstacle } from './MyObstacle.js';

class MyTrack {
    constructor(scene, trackWidth) {
        this.scene = scene;
        this.route = new MyRoute(scene);
        this.obstacle = new MyObstacle(scene);
        this.centerLine = null;
        this.trackWidth = trackWidth;
        this.centerLineMesh = null;
        this.trackMesh = null;
    }

    init() {
        const controlPoints = [
            new THREE.Vector3(0, 0.1, 40),
            new THREE.Vector3(-50, 0.1, 30),
            new THREE.Vector3(-50, 0.1, -40),
            new THREE.Vector3(-20, 0.1, -40),
            new THREE.Vector3(-15, 0.1, -5),
            new THREE.Vector3(15, 0.1, -5),
            new THREE.Vector3(20, 0.1, -40),
            new THREE.Vector3(50, 0.1, -40),
            new THREE.Vector3(50, 0.1, 30)
        ];

        this.centerLine = new THREE.CatmullRomCurve3(controlPoints, true);

        const tubeGeometry = new THREE.TubeGeometry(this.centerLine, 100, this.trackWidth / 2, 8, true);

        const trackMaterial = new THREE.MeshBasicMaterial({
            color: 0x333333
        });

        this.trackMesh = new THREE.Mesh(tubeGeometry, trackMaterial);
        this.trackMesh.scale.set(1, 0.01, 1);
        this.scene.add(this.trackMesh);

        const divisions = 100;
        const centerPoints = this.centerLine.getPoints(divisions);
        const centerLineGeometry = new THREE.BufferGeometry().setFromPoints(centerPoints);
        const centerLineMaterial = new THREE.LineDashedMaterial({
            color: 0xffffff,
            dashSize: 3,
            gapSize: 2
        });
        this.centerLineMesh = new THREE.LineLoop(centerLineGeometry, centerLineMaterial);
        this.centerLineMesh.computeLineDistances();
        this.centerLineMesh.position.y += 0.1;
        this.scene.add(this.centerLineMesh);

    }

    clear() {
        this.scene.remove(this.trackMesh);
        this.scene.remove(this.centerLineMesh);
    }
}

export { MyTrack };
