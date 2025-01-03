import * as THREE from 'three';
import { MyRoute } from './MyRoute.js';

class MyTrack {
    constructor(scene, trackWidth) {
        this.scene = scene;
        this.route = new MyRoute(scene);
        this.centerLine = null;
        this.trackWidth = trackWidth;
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

        const trackMesh = new THREE.Mesh(tubeGeometry, trackMaterial);
        trackMesh.scale.set(1, 0.01, 1);
        this.scene.add(trackMesh);

        const divisions = 100;
        const centerPoints = this.centerLine.getPoints(divisions);
        const centerLineGeometry = new THREE.BufferGeometry().setFromPoints(centerPoints);
        const centerLineMaterial = new THREE.LineDashedMaterial({
            color: 0xffffff,
            dashSize: 3,
            gapSize: 2
        });
        const centerLineMesh = new THREE.LineLoop(centerLineGeometry, centerLineMaterial);
        centerLineMesh.computeLineDistances();
        centerLineMesh.position.y += 0.1;
        this.scene.add(centerLineMesh);
    }
}

export { MyTrack };
