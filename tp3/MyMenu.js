import * as THREE from 'three';
import {MyTextRenderer} from "./MyTextRenderer.js";

class MyMenu {
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

        this.humanBalloonSelected = false;
        this.aiBalloonSelected = false;
    }

    init() {
        // START BUTTON
        const startButtonGeometry = new THREE.PlaneGeometry(24, 8);
        const startButtonMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
        const startButton = new THREE.Mesh(startButtonGeometry, startButtonMaterial);
        startButton.position.set(0, 99.9, -30);
        startButton.rotation.x = Math.PI / 2;
        this.scene.add(startButton);
        this.buttons.push({button: startButton, action: this.startGame.bind(this)});

        const startButtonText = this.textRenderer.createTextMesh('PLAY', {x: -7.5, y: 99, z: -30}, 5);
        startButtonText.rotation.x = Math.PI / 2;
        this.texts.push(startButtonText);

        // PROJECT INFO
        const feupSGIText = this.textRenderer.createTextMesh('FEUP SGI 24/25', {x: -32, y: 99, z: 36}, 5);
        feupSGIText.rotation.x = Math.PI / 2;
        this.texts.push(feupSGIText);

        const authorsText = this.textRenderer.createTextMesh('Diogo Santos & Pedro Paixao', {x: -65, y: 99, z: 28}, 5);
        authorsText.rotation.x = Math.PI / 2;
        this.texts.push(authorsText);

        // SELECT HUMAN BALLOON
        const selectHumanGeometry = new THREE.PlaneGeometry(29, 8);
        const selectHumanMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
        this.selectHumanButton = new THREE.Mesh(selectHumanGeometry, selectHumanMaterial);
        this.selectHumanButton.position.set(-30, 99.9, -10);
        this.selectHumanButton.rotation.x = Math.PI / 2;
        this.scene.add(this.selectHumanButton);
        this.buttons.push({button: this.selectHumanButton, action: this.selectHuman.bind(this)});

        const humanSelectionText = this.textRenderer.createTextMesh('HUMAN', {x: -40, y: 99, z: -10}, 5);
        humanSelectionText.rotation.x = Math.PI / 2;
        this.texts.push(humanSelectionText);

        // SELECT AI BALLOON
        const selectAIGeometry = new THREE.PlaneGeometry(29, 8);
        const selectAIMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
        this.selectAIButton = new THREE.Mesh(selectAIGeometry, selectAIMaterial);
        this.selectAIButton.position.set(30, 99.9, -10);
        this.selectAIButton.rotation.x = Math.PI / 2;
        this.scene.add(this.selectAIButton);
        this.buttons.push({button: this.selectAIButton, action: this.selectBot.bind(this)});

        const botSelectionText = this.textRenderer.createTextMesh('BOT', {x: 25, y: 99, z: -10}, 5);
        botSelectionText.rotation.x = Math.PI / 2;
        this.texts.push(botSelectionText);
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
                    this.intersectedObject.material.color.set(0xff0000); // Reset to original color
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

    startGame() {
        if (this.humanBalloonSelected && this.aiBalloonSelected) {
            console.log("Game Started");
            this.gameStateManager.setState('running');
        }
    }

    selectHuman() {
        this.humanBalloonSelected = !this.humanBalloonSelected;
        console.log("Human selected balloon: " + this.humanBalloonSelected);

        this.selectHumanButton.material.color.set(this.humanBalloonSelected ? 0xffff00 : 0xff0000);
    }

    selectBot() {
        this.aiBalloonSelected = !this.aiBalloonSelected;
        console.log("Bot selected balloon: " + this.aiBalloonSelected);

        this.selectAIButton.material.color.set(this.aiBalloonSelected ? 0xffff00 : 0xff0000);
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

export {MyMenu};
