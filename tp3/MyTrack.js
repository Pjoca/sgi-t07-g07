import * as THREE from 'three';
import {MyRoute} from './MyRoute.js';
import {MyTextRenderer} from "./MyTextRenderer.js";
import {OBJLoader} from "three/addons/loaders/OBJLoader";

class MyTrack {
    constructor(scene, trackWidth) {
        this.scene = scene;
        this.route = new MyRoute(scene);
        this.centerLine = null;
        this.trackWidth = trackWidth;
        this.centerLineMesh = null;
        this.trackMesh = null;
        this.sun = null;
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

        const trackMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333
        });

        this.trackMesh = new THREE.Mesh(tubeGeometry, trackMaterial);
        this.trackMesh.scale.set(1, 0.01, 1);
        this.trackMesh.receiveShadow = true;
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

        this.floorGeometry = new THREE.PlaneGeometry(224, 182);
        this.floorMaterial = new THREE.MeshStandardMaterial({color: 0x63735E});
        this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y += 0.075;
        this.floorMesh.receiveShadow = true;
        this.scene.add(this.floorMesh);

        this.createGoalLine();

        const loader = new OBJLoader();
        loader.load('scenes/objects/sun.obj',
            (obj) => {
                const material = new THREE.MeshStandardMaterial({color: 0xffff00});
                obj.traverse((child) => {
                    if (child.isMesh) {
                        child.material = material;

                        child.castShadow = true;
                    }
                });
                this.sun = obj;

                this.sun.position.set(0, 90, 0);
                this.sun.scale.set(0.75, 0.75, 0.75);
                this.sun.rotation.x = Math.PI / 2;
                this.scene.add(this.sun);
            },
            (xhr) => {
                console.log(`Balloon loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
            },
            (error) => {
                console.error('Error loading the .obj file:', error);
            }
        );
    }

    createGoalLine() {
        const goalPostHeight = 30;
        const goalPostRadius = 0.5;

        const goalPostGeometry = new THREE.CylinderGeometry(goalPostRadius, goalPostRadius, goalPostHeight);
        const goalPostMaterial = new THREE.MeshStandardMaterial({color: 0x222222});

        this.goalPost1 = new THREE.Mesh(goalPostGeometry, goalPostMaterial);
        this.goalPost1.position.set(7.5, 14.5, 23);
        this.goalPost1.rotation.y = Math.PI / 2;
        this.goalPost1.castShadow = true;
        this.scene.add(this.goalPost1);

        this.goalPost2 = new THREE.Mesh(goalPostGeometry, goalPostMaterial);
        this.goalPost2.position.set(7.5, 14.5, 57);
        this.goalPost2.rotation.y = Math.PI / 2;
        this.goalPost2.castShadow = true;
        this.scene.add(this.goalPost2);

        const boxGeometry = new THREE.BoxGeometry(36, 3, 1.2);
        const texture = new THREE.TextureLoader().load('scenes/textures/chess.jpg');
        texture.repeat.set(12, 1);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const boxMaterial = new THREE.MeshStandardMaterial({map: texture});

        this.goalBox = new THREE.Mesh(boxGeometry, boxMaterial);
        this.goalBox.position.set(7.5, Math.max(this.goalPost1.position.y, this.goalPost2.position.y) + goalPostHeight / 2 + 1, 40);
        this.goalBox.rotation.y = Math.PI / 2;
        this.goalBox.castShadow = true;
        this.scene.add(this.goalBox);

        const planeGeometry = new THREE.PlaneGeometry(30, 8);
        const material = new THREE.MeshStandardMaterial({
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

    regenerateTrack() {
        // Remove the old track mesh from the scene
        this.scene.remove(this.trackMesh);

        // Create a new TubeGeometry with the updated trackWidth
        const tubeGeometry = new THREE.TubeGeometry(this.centerLine, 100, this.trackWidth / 2, 8, true);

        // Create a new mesh with the updated geometry
        const trackMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333
        });
        this.trackMesh = new THREE.Mesh(tubeGeometry, trackMaterial);
        this.trackMesh.scale.set(1, 0.01, 1);
        this.trackMesh.receiveShadow = true;

        // Add the updated mesh back to the scene
        this.scene.add(this.trackMesh);
    }



    clear() {
        this.scene.remove(this.trackMesh);
        this.scene.remove(this.centerLineMesh);
        this.scene.remove(this.goalPost1);
        this.scene.remove(this.goalPost2);
        this.scene.remove(this.goalBox);
        this.scene.remove(this.wrongDirection);
        this.scene.remove(this.wrongDirectionText);
        this.scene.remove(this.wrongDirectionText2);
        this.scene.remove(this.sun);
    }
}

export {MyTrack};
