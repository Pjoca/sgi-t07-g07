import * as THREE from 'three';
import {MyRoute} from './MyRoute.js';
import {MyTextRenderer} from "./MyTextRenderer.js";
import {OBJLoader} from "three/addons/loaders/OBJLoader";

class MyTrack {
    // Constructor to initialize the track with the scene, and set up the route, track width, and other variables
    constructor(scene, trackWidth) {
        this.scene = scene;  // Reference to the scene
        this.route = new MyRoute(scene);  // Create a route using the MyRoute class
        this.centerLine = null;  // Placeholder for the center line of the track
        this.trackWidth = trackWidth;  // Set the width of the track
        this.centerLineMesh = null;  // Placeholder for the mesh of the center line
        this.trackMesh = null;  // Placeholder for the track mesh
        this.sun = null;  // Placeholder for the sun object
        this.textRenderer = new MyTextRenderer(this.scene, 'scenes/textures/spritesheet.png', 16, 16, 1, 1);  // Text renderer for creating text in the scene
    }

    // Initializes the track, center line, and other objects in the scene
    init() {
        // Define control points for the center line of the track (path of the track)
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

        // Create a Catmull-Rom curve through the control points for the track path
        this.centerLine = new THREE.CatmullRomCurve3(controlPoints, true);

        // Create the geometry for the track (TubeGeometry along the path defined by the centerLine)
        const tubeGeometry = new THREE.TubeGeometry(this.centerLine, 100, this.trackWidth / 2, 8, true);

        // Create the material for the track (standard material with dark color)
        const trackMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333
        });

        // Create the track mesh from the geometry and material, then scale it and add it to the scene
        this.trackMesh = new THREE.Mesh(tubeGeometry, trackMaterial);
        this.trackMesh.scale.set(1, 0.01, 1);  // Flatten the track in the vertical direction
        this.trackMesh.receiveShadow = true;  // Enable shadow reception
        this.scene.add(this.trackMesh);

        // Create the center line mesh for visualization (using dashed lines)
        const divisions = 100;
        const centerPoints = this.centerLine.getPoints(divisions);
        const centerLineGeometry = new THREE.BufferGeometry().setFromPoints(centerPoints);
        const centerLineMaterial = new THREE.LineDashedMaterial({
            color: 0xffffff,  // White dashed line
            dashSize: 3,
            gapSize: 2
        });
        this.centerLineMesh = new THREE.LineLoop(centerLineGeometry, centerLineMaterial);
        this.centerLineMesh.computeLineDistances();  // Enable dashed line effect
        this.centerLineMesh.position.y += 0.1;  // Slightly lift the center line above the track
        this.scene.add(this.centerLineMesh);

        // Create the floor of the track area (a large plane beneath the track)
        this.floorGeometry = new THREE.PlaneGeometry(224, 182);
        this.floorMaterial = new THREE.MeshStandardMaterial({color: 0x63735E});  // Floor material with a greenish color
        this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
        this.floorMesh.rotation.x = -Math.PI / 2;  // Rotate to make it flat on the ground
        this.floorMesh.position.y += 0.075;  // Slightly raise the floor to avoid clipping with the track
        this.floorMesh.receiveShadow = true;  // Enable shadow reception
        this.scene.add(this.floorMesh);

        // Create goal line objects (goal posts and box)
        this.createGoalLine();

        // Load the sun model using OBJLoader (a 3D model of the sun)
        const loader = new OBJLoader();
        loader.load('scenes/objects/sun.obj',
            (obj) => {
                const material = new THREE.MeshStandardMaterial({color: 0xffff00});  // Sun material (yellow)
                obj.traverse((child) => {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;  // Enable casting shadows for the sun model
                    }
                });
                this.sun = obj;
                this.sun.position.set(0, 90, 0);  // Position the sun in the sky
                this.sun.scale.set(0.75, 0.75, 0.75);  // Scale down the sun
                this.sun.rotation.x = Math.PI / 2;  // Rotate to face the correct direction
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

    // Create the goal posts and goal box, as well as the wrong direction warning text
    createGoalLine() {
        const goalPostHeight = 30;
        const goalPostRadius = 0.5;

        // Create the goal post geometry (cylindrical posts)
        const goalPostGeometry = new THREE.CylinderGeometry(goalPostRadius, goalPostRadius, goalPostHeight);
        const goalPostMaterial = new THREE.MeshStandardMaterial({color: 0x222222});  // Dark color for the posts

        // Create the first goal post
        this.goalPost1 = new THREE.Mesh(goalPostGeometry, goalPostMaterial);
        this.goalPost1.position.set(7.5, 14.5, 23);
        this.goalPost1.rotation.y = Math.PI / 2;  // Rotate to align with the track
        this.goalPost1.castShadow = true;  // Enable casting shadows
        this.scene.add(this.goalPost1);

        // Create the second goal post
        this.goalPost2 = new THREE.Mesh(goalPostGeometry, goalPostMaterial);
        this.goalPost2.position.set(7.5, 14.5, 57);
        this.goalPost2.rotation.y = Math.PI / 2;
        this.goalPost2.castShadow = true;
        this.scene.add(this.goalPost2);

        // Create a box geometry for the goal area, using a repeating texture
        const boxGeometry = new THREE.BoxGeometry(36, 3, 1.2);
        const texture = new THREE.TextureLoader().load('scenes/textures/chess.jpg');
        texture.repeat.set(12, 1);  // Repeat texture 12 times horizontally
        texture.wrapS = THREE.RepeatWrapping;  // Repeat texture horizontally
        texture.wrapT = THREE.RepeatWrapping;  // Repeat texture vertically
        const boxMaterial = new THREE.MeshStandardMaterial({map: texture});

        // Create the goal box
        this.goalBox = new THREE.Mesh(boxGeometry, boxMaterial);
        this.goalBox.position.set(7.5, Math.max(this.goalPost1.position.y, this.goalPost2.position.y) + goalPostHeight / 2 + 1, 40);
        this.goalBox.rotation.y = Math.PI / 2;
        this.goalBox.castShadow = true;
        this.scene.add(this.goalBox);

        // Create the warning message indicating "WRONG DIRECTION"
        const planeGeometry = new THREE.PlaneGeometry(30, 8);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff0000,  // Red color for warning
            transparent: true,
            opacity: 0.5  // Semi-transparent
        });
        this.wrongDirection = new THREE.Mesh(planeGeometry, material);
        this.wrongDirection.position.set(7.5, 12.5, 40);
        this.wrongDirection.rotation.y = -Math.PI / 2;  // Rotate to face the correct direction
        this.scene.add(this.wrongDirection);

        // Create the "WRONG" text
        this.wrongDirectionText = this.textRenderer.createTextMesh('WRONG', {x: 7.49, y: 13.75, z: 34}, 3);
        this.wrongDirectionText.rotation.y = -Math.PI / 2;
        this.scene.add(this.wrongDirectionText);

        // Create the "DIRECTION" text
        this.wrongDirectionText2 = this.textRenderer.createTextMesh('DIRECTION', {x: 7.49, y: 11.25, z: 28}, 3);
        this.wrongDirectionText2.rotation.y = -Math.PI / 2;
        this.scene.add(this.wrongDirectionText2);
    }

    // Regenerate the track with a new track width (resizes the track)
    regenerateTrack() {
        // Remove the old track mesh from the scene
        this.scene.remove(this.trackMesh);

        // Create a new track with the updated width
        const tubeGeometry = new THREE.TubeGeometry(this.centerLine, 100, this.trackWidth / 2, 8, true);

        // Create the new track mesh with the updated geometry and material
        const trackMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333
        });
        this.trackMesh = new THREE.Mesh(tubeGeometry, trackMaterial);
        this.trackMesh.scale.set(1, 0.01, 1);
        this.trackMesh.receiveShadow = true;

        // Add the new track mesh back to the scene
        this.scene.add(this.trackMesh);
    }

    // Clear all track and scene objects from the scene
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
