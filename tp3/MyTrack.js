import * as THREE from 'three';
import { MyRoute } from './MyRoute.js';
import { MyObstacle } from './MyObstacle.js';
import {MyTextRenderer} from "./MyTextRenderer.js";

class MyTrack {
    constructor(scene, trackWidth) {
        this.scene = scene;
        this.route = new MyRoute(scene);
        this.obstacles = null;
        this.centerLine = null;
        this.trackWidth = trackWidth;
        this.centerLineMesh = null;
        this.trackMesh = null;
        this.textRenderer = new MyTextRenderer(this.scene, 'scenes/textures/spritesheet.png', 16, 16, 1, 1);
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

        this.obstacles = new MyObstacle(this.scene);
        this.obstacles.createObstacleMarkers();

        this.createGoalLine()
    }

    createGoalLine() {
        const goalPostHeight = 25;
        const goalPostRadius = 0.5;

        const goalPostGeometry = new THREE.CylinderGeometry(goalPostRadius, goalPostRadius, goalPostHeight);
        const goalPostMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });

        this.goalPost1 = new THREE.Mesh(goalPostGeometry, goalPostMaterial);
        this.goalPost1.position.set(7.5, 12.5, 23);
        this.goalPost1.rotation.y = Math.PI / 2;
        this.scene.add(this.goalPost1);

        this.goalPost2 = new THREE.Mesh(goalPostGeometry, goalPostMaterial);
        this.goalPost2.position.set(7.5, 12.5, 57);
        this.goalPost2.rotation.y = Math.PI / 2;
        this.scene.add(this.goalPost2);

        const boxGeometry = new THREE.BoxGeometry(36, 3, 1.2);
        const texture = new THREE.TextureLoader().load('scenes/textures/chess.jpg');
        texture.repeat.set(12, 1);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const boxMaterial = new THREE.MeshBasicMaterial({ map: texture });

        this.goalBox = new THREE.Mesh(boxGeometry, boxMaterial);
        this.goalBox.position.set(7.5, Math.max(this.goalPost1.position.y, this.goalPost2.position.y) + goalPostHeight / 2 + 1.5, 40);
        this.goalBox.rotation.y = Math.PI / 2;
        this.scene.add(this.goalBox);

        const planeGeometry = new THREE.PlaneGeometry(30, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.5
        });
        this.wrongDirection = new THREE.Mesh(planeGeometry, material);
        this.wrongDirection.position.set(7.5, 12.5, 40);
        this.wrongDirection.rotation.y = -Math.PI / 2;
        this.scene.add(this.wrongDirection);

        this.wrongDirectionText = this.textRenderer.createTextMesh('WRONG', {x: 7.49, y: 13.75, z: 34}, 3);
        this.wrongDirectionText.rotation.y = -Math.PI / 2;
        this.scene.add(this.wrongDirectionText);

        this.wrongDirectionText2 = this.textRenderer.createTextMesh('DIRECTION', {x: 7.49, y: 11.25, z: 28}, 3);
        this.wrongDirectionText2.rotation.y = -Math.PI / 2;
        this.scene.add(this.wrongDirectionText2);
    }


    clear() {
        this.scene.remove(this.trackMesh);
        this.scene.remove(this.centerLineMesh);
        this.obstacles.removeObstacleMarkers();
        this.scene.remove(this.goalPost1);
        this.scene.remove(this.goalPost2);
        this.scene.remove(this.goalBox);
        this.scene.remove(this.wrongDirection);
        this.scene.remove(this.wrongDirectionText);
        this.scene.remove(this.wrongDirectionText2);
    }
}

export { MyTrack };
