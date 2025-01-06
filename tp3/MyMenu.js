import * as THREE from 'three';
import { MyTextRenderer } from './MyTextRenderer.js';

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

        this.humanBalloonColor = null;
        this.aiBalloonColor = null;
    }

    init() {
        // START BUTTON
        const startButtonGeometry = new THREE.PlaneGeometry(24, 8);
        const startButtonMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const startButton = new THREE.Mesh(startButtonGeometry, startButtonMaterial);
        startButton.position.set(0, 99.9, -30);
        startButton.rotation.x = Math.PI / 2;
        this.scene.add(startButton);
        this.buttons.push({ button: startButton, action: this.startGame.bind(this) });

        const startButtonText = this.textRenderer.createTextMesh('PLAY', { x: -7.5, y: 99, z: -30 }, 5);
        startButtonText.rotation.x = Math.PI / 2;
        this.texts.push(startButtonText);

        // PROJECT INFO
        const feupSGIText = this.textRenderer.createTextMesh('FEUP SGI 24/25', { x: -32, y: 99, z: 36 }, 5);
        feupSGIText.rotation.x = Math.PI / 2;
        this.texts.push(feupSGIText);

        const authorsText = this.textRenderer.createTextMesh('Diogo Santos & Pedro Paixao', { x: -65, y: 99, z: 28 }, 5);
        authorsText.rotation.x = Math.PI / 2;
        this.texts.push(authorsText);

        // SELECT HUMAN BALLOON
        const selectHumanBlueGeometry = new THREE.PlaneGeometry(8, 8);
        const selectHumanBlueMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        this.selectHumanBlueButton = new THREE.Mesh(selectHumanBlueGeometry, selectHumanBlueMaterial);
        this.selectHumanBlueButton.position.set(-40, 99.9, -10);
        this.selectHumanBlueButton.rotation.x = Math.PI / 2;
        this.scene.add(this.selectHumanBlueButton);
        this.buttons.push({ button: this.selectHumanBlueButton, action: this.selectHumanBlue.bind(this) });

        const selectHumanRedGeometry = new THREE.PlaneGeometry(8, 8);
        const selectHumanRedMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.selectHumanRedButton = new THREE.Mesh(selectHumanRedGeometry, selectHumanRedMaterial);
        this.selectHumanRedButton.position.set(-30, 99.9, -10);
        this.selectHumanRedButton.rotation.x = Math.PI / 2;
        this.scene.add(this.selectHumanRedButton);
        this.buttons.push({ button: this.selectHumanRedButton, action: this.selectHumanRed.bind(this) });

        const selectHumanGreenGeometry = new THREE.PlaneGeometry(8, 8);
        const selectHumanGreenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.selectHumanGreenButton = new THREE.Mesh(selectHumanGreenGeometry, selectHumanGreenMaterial);
        this.selectHumanGreenButton.position.set(-20, 99.9, -10);
        this.selectHumanGreenButton.rotation.x = Math.PI / 2;
        this.scene.add(this.selectHumanGreenButton);
        this.buttons.push({ button: this.selectHumanGreenButton, action: this.selectHumanGreen.bind(this) });

        const humanSelectionText = this.textRenderer.createTextMesh('HUMAN', { x: -40, y: 99, z: 0 }, 5);
        humanSelectionText.rotation.x = Math.PI / 2;
        this.texts.push(humanSelectionText);

        // SELECT AI BALLOON
        const selectBotCyanGeometry = new THREE.PlaneGeometry(8, 8);
        const selectBotCyanMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        this.selectBotCyanButton = new THREE.Mesh(selectBotCyanGeometry, selectBotCyanMaterial);
        this.selectBotCyanButton.position.set(20, 99.9, -10);
        this.selectBotCyanButton.rotation.x = Math.PI / 2;
        this.scene.add(this.selectBotCyanButton);
        this.buttons.push({ button: this.selectBotCyanButton, action: this.selectBotCyan.bind(this) });

        const selectBotMagentaGeometry = new THREE.PlaneGeometry(8, 8);
        const selectBotMagentaMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        this.selectBotMagentaButton = new THREE.Mesh(selectBotMagentaGeometry, selectBotMagentaMaterial);
        this.selectBotMagentaButton.position.set(30, 99.9, -10);
        this.selectBotMagentaButton.rotation.x = Math.PI / 2;
        this.scene.add(this.selectBotMagentaButton);
        this.buttons.push({ button: this.selectBotMagentaButton, action: this.selectBotMagenta.bind(this) });

        const selectBotYellowGeometry = new THREE.PlaneGeometry(8, 8);
        const selectBotYellowMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.selectBotYellowButton = new THREE.Mesh(selectBotYellowGeometry, selectBotYellowMaterial);
        this.selectBotYellowButton.position.set(40, 99.9, -10);
        this.selectBotYellowButton.rotation.x = Math.PI / 2;
        this.scene.add(this.selectBotYellowButton);
        this.buttons.push({ button: this.selectBotYellowButton, action: this.selectBotYellow.bind(this) });

        const botSelectionText = this.textRenderer.createTextMesh('BOT', { x: 25, y: 99, z: 0 }, 5);
        botSelectionText.rotation.x = Math.PI / 2;
        this.texts.push(botSelectionText);
    }

    update(mouseX, mouseY) {
        this.mouse.x = (mouseX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(mouseY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.app.cameras[this.app.activeCameraName]);

        const intersects = this.raycaster.intersectObjects(this.buttons.map(b => b.button));

        if (intersects.length > 0) {
            const button = intersects[0].object;
            if (this.intersectedObject !== button) {
                this.intersectedObject = button;
            }
        } else {
            this.intersectedObject = null;
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
            console.log('Game Started');
            this.gameStateManager.setHumanColor(this.humanBalloonColor);
            this.gameStateManager.setBotColor(this.aiBalloonColor);
            this.gameStateManager.setState('running');
        } else {
            console.error('Please select colors for both human and bot balloons before starting.');
        }
    }

    selectHumanBlue() {
        this.selectHumanColor(0x0000ff, 'blue');
    }

    selectHumanRed() {
        this.selectHumanColor(0xff0000, 'red');
    }

    selectHumanGreen() {
        this.selectHumanColor(0x00ff00, 'green');
    }

    selectHumanColor(color, colorName) {
        this.humanBalloonColor = color;
        this.humanBalloonSelected = true;

        console.log(`Human selected color: ${colorName}`);

        this.selectHumanBlueButton.material.color.set(0x0000ff);
        this.selectHumanRedButton.material.color.set(0xff0000);
        this.selectHumanGreenButton.material.color.set(0x00ff00);

        if (color === 0x0000ff) this.selectHumanBlueButton.material.color.set(0xffffff);
        if (color === 0xff0000) this.selectHumanRedButton.material.color.set(0xffffff);
        if (color === 0x00ff00) this.selectHumanGreenButton.material.color.set(0xffffff);
    }

    selectBotCyan() {
        this.selectBotColor(0x00ffff, 'cyan');
    }

    selectBotMagenta() {
        this.selectBotColor(0xff00ff, 'magenta');
    }

    selectBotYellow() {
        this.selectBotColor(0xffff00, 'yellow');
    }

    selectBotColor(color, colorName) {
        this.aiBalloonColor = color;
        this.aiBalloonSelected = true;

        console.log(`Bot selected color: ${colorName}`);

        this.selectBotCyanButton.material.color.set(0x00ffff);
        this.selectBotMagentaButton.material.color.set(0xff00ff);
        this.selectBotYellowButton.material.color.set(0xffff00);

        if (color === 0x00ffff) this.selectBotCyanButton.material.color.set(0xffffff);
        if (color === 0xff00ff) this.selectBotMagentaButton.material.color.set(0xffffff);
        if (color === 0xffff00) this.selectBotYellowButton.material.color.set(0xffffff);
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

export { MyMenu };
