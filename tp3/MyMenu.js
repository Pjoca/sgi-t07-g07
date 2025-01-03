import * as THREE from 'three';

class MyMenu {
    constructor(app, gameStateManager) {
        this.app = app;
        this.scene = this.app.scene;
        this.gameStateManager = gameStateManager;
        this.buttons = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.intersectedObject = null;
    }

    init() {
        // Create Start Button
        const startButtonGeometry = new THREE.PlaneGeometry(20, 10);
        const startButtonMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const startButton = new THREE.Mesh(startButtonGeometry, startButtonMaterial);
        startButton.position.set(0, 99.9, 0); // Same position as before
        startButton.rotation.x = Math.PI / 2;
        this.scene.add(startButton);
        this.buttons.push({ button: startButton, action: this.startGame.bind(this) });
    }

    update(mouseX, mouseY) {
        // Convert mouse position to normalized device coordinates (-1 to +1)
        this.mouse.x = (mouseX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(mouseY / window.innerHeight) * 2 + 1;

        // Set raycaster to pick objects based on mouse position
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
            // Find the clicked button and perform the corresponding action
            const buttonData = this.buttons.find(b => b.button === this.intersectedObject);
            if (buttonData) {
                buttonData.action();
            }
        }
    }

    startGame() {
        console.log("Game Started");
        this.gameStateManager.setState('running');  // Change game state to 'running'
    }

    exitGame() {
        console.log("Game Exited");
        window.location.reload();  // Exit or reload the game
    }

    hide() {
        // Hide the menu (remove buttons from the scene or set visibility to false)
        this.buttons.forEach(b => this.scene.remove(b.button));
    }
}

export { MyMenu };
