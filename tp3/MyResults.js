import * as THREE from 'three';
import {MyTextRenderer} from "./MyTextRenderer.js";

class MyResults {
    constructor(app, gameStateManager) {
        this.app = app;
        this.scene = this.app.scene;
        this.gameStateManager = gameStateManager;
        this.buttons = [];
        this.texts = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.intersectedObject = null;
        this.textRenderer = new MyTextRenderer(this.scene, 'scenes/textures/spritesheet.png', 16, 16, 1, 1);

        this.timeTextMesh = null; // Mesh to display the final time
    }

    init() {
        // RESTART BUTTON
        const restartButtonGeometry = new THREE.PlaneGeometry(30, 8);
        const restartButtonMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
        const restartButton = new THREE.Mesh(restartButtonGeometry, restartButtonMaterial);
        restartButton.position.set(-20, 99.9, -30);
        restartButton.rotation.x = Math.PI / 2;
        this.buttons.push({button: restartButton, action: this.restartGame.bind(this)});

        const restartButtonText = this.textRenderer.createTextMesh('RESTART', {x: -32, y: 99, z: -30}, 4);
        restartButtonText.rotation.x = Math.PI / 2;
        this.texts.push(restartButtonText);

        // EXIT BUTTON
        const exitButtonGeometry = new THREE.PlaneGeometry(30, 8);
        const exitButtonMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
        const exitButton = new THREE.Mesh(exitButtonGeometry, exitButtonMaterial);
        exitButton.position.set(20, 99.9, -30);
        exitButton.rotation.x = Math.PI / 2;
        this.buttons.push({button: exitButton, action: this.exitGame.bind(this)});

        const exitButtonText = this.textRenderer.createTextMesh('EXIT', {x: 12.5, y: 99, z: -30}, 5);
        exitButtonText.rotation.x = Math.PI / 2;
        this.texts.push(exitButtonText);
    }

    setFinalTime(time) {
        this.winnerTextMesh = this.textRenderer.createTextMesh(`Winner: ${this.gameStateManager.winner}`, {x: -25, y: 99, z: 20}, 5);
        this.winnerTextMesh.rotation.x = Math.PI / 2;
        this.texts.push(this.winnerTextMesh);

        this.timeTextMesh = this.textRenderer.createTextMesh(`Time: ${time}s`, {x: -25, y: 99, z: 10}, 5);
        this.timeTextMesh.rotation.x = Math.PI / 2;
        this.texts.push(this.timeTextMesh);
    }


    update(mouseX, mouseY) {
        this.mouse.x = (mouseX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(mouseY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.app.cameras[this.app.activeCameraName]);

        // Check if the mouse is intersecting any of the buttons
        const intersects = this.raycaster.intersectObjects(this.buttons.map(b => b.button));

        if (intersects.length > 0) {
            const button = intersects[0].object;
            if (this.intersectedObject !== button) {
                // Reset color of the previous intersected button
                if (this.intersectedObject) {
                    this.intersectedObject.material.color.set(0x0000ff); // Reset to original color
                }

                // Highlight the currently intersected button
                this.intersectedObject = button;
                button.material.color.set(0x00ff00);  // Change to highlight color
            }
        } else {
            if (this.intersectedObject) {
                // Reset color of the previous intersected button
                this.intersectedObject.material.color.set(0x0000ff); // Reset to original color
                this.intersectedObject = null;
            }
        }
    }

    onClick() {
        if (this.intersectedObject) {
            const buttonData = this.buttons.find(b => b.button === this.intersectedObject);
            if (buttonData) {
                buttonData.action();
            }
        }
    }

    restartGame() {
        console.log("Restarting Race...");
        this.gameStateManager.setState('running');
    }

    exitGame() {
        console.log("Exiting Race...");
        this.gameStateManager.returnToMenu();
    }

    hide() {
        this.buttons.forEach(b => this.scene.remove(b.button));
        this.texts.forEach(t => this.scene.remove(t));
    }

    show() {
        this.buttons.forEach(b => this.scene.add(b.button));
        this.texts.forEach(t => this.scene.add(t));
    }
}

export {MyResults};
