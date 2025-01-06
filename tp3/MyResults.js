import * as THREE from 'three';
import { MyTextRenderer } from "./MyTextRenderer.js";

class MyResults {
    constructor(app, gameStateManager) {
        this.app = app;  // Reference to the main app (provides the scene)
        this.scene = this.app.scene;  // Reference to the scene
        this.gameStateManager = gameStateManager;  // Reference to the game state manager
        this.buttons = [];  // Store buttons in the results screen
        this.texts = [];  // Store text meshes (like final score and time)
        this.raycaster = new THREE.Raycaster();  // For mouse interaction
        this.mouse = new THREE.Vector2();  // Mouse position in normalized device coordinates
        this.intersectedObject = null;  // Currently hovered button
        this.textRenderer = new MyTextRenderer(this.scene, 'scenes/textures/spritesheet.png', 16, 16, 1, 1);  // For rendering 3D text
        this.timeTextMesh = null;  // Holds the mesh for displaying time
    }

    // Method to initialize the result screen buttons and texts
    init() {
        // RESTART BUTTON
        const restartButtonGeometry = new THREE.PlaneGeometry(30, 8);  // Plane geometry for the button
        const restartButtonMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });  // Blue button
        const restartButton = new THREE.Mesh(restartButtonGeometry, restartButtonMaterial);  // Create button mesh
        restartButton.position.set(-20, 99.9, -30);  // Set button position in 3D space
        restartButton.rotation.x = Math.PI / 2;  // Rotate to face the camera
        this.buttons.push({ button: restartButton, action: this.restartGame.bind(this) });  // Store button with action

        // Add text to the restart button
        const restartButtonText = this.textRenderer.createTextMesh('RESTART', { x: -32, y: 99, z: -30 }, 4);
        restartButtonText.rotation.x = Math.PI / 2;
        this.texts.push(restartButtonText);  // Store the text mesh

        // EXIT BUTTON
        const exitButtonGeometry = new THREE.PlaneGeometry(30, 8);  // Plane geometry for the button
        const exitButtonMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });  // Blue button
        const exitButton = new THREE.Mesh(exitButtonGeometry, exitButtonMaterial);  // Create button mesh
        exitButton.position.set(20, 99.9, -30);  // Set button position in 3D space
        exitButton.rotation.x = Math.PI / 2;  // Rotate to face the camera
        this.buttons.push({ button: exitButton, action: this.exitGame.bind(this) });  // Store button with action

        // Add text to the exit button
        const exitButtonText = this.textRenderer.createTextMesh('EXIT', { x: 12.5, y: 99, z: -30 }, 5);
        exitButtonText.rotation.x = Math.PI / 2;
        this.texts.push(exitButtonText);  // Store the text mesh
    }

    // Method to set the final time and winner's name on the results screen
    setFinalTime(time) {
        // Create 3D text for winner and time and store them
        this.winnerTextMesh = this.textRenderer.createTextMesh(`Winner: ${this.gameStateManager.winner}`, { x: -25, y: 99, z: 20 }, 5);
        this.winnerTextMesh.rotation.x = Math.PI / 2;
        this.texts.push(this.winnerTextMesh);  // Store winner text mesh

        // Create 3D text for the time and store it
        this.timeTextMesh = this.textRenderer.createTextMesh(`Time: ${time}s`, { x: -25, y: 99, z: 10 }, 5);
        this.timeTextMesh.rotation.x = Math.PI / 2;
        this.texts.push(this.timeTextMesh);  // Store time text mesh
    }

    // Method to handle mouse hover over buttons
    update(mouseX, mouseY) {
        // Normalize mouse coordinates for raycasting
        this.mouse.x = (mouseX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(mouseY / window.innerHeight) * 2 + 1;

        // Set up raycaster from camera to mouse position
        this.raycaster.setFromCamera(this.mouse, this.app.cameras[this.app.activeCameraName]);

        // Check if any buttons are intersected by the raycaster
        const intersects = this.raycaster.intersectObjects(this.buttons.map(b => b.button));

        if (intersects.length > 0) {
            const button = intersects[0].object;  // Get the first intersected button
            if (this.intersectedObject !== button) {
                // If different button is hovered, reset the color of the previous button
                if (this.intersectedObject) {
                    this.intersectedObject.material.color.set(0x0000ff);  // Reset to blue
                }

                // Highlight the currently intersected button
                this.intersectedObject = button;
                button.material.color.set(0x00ff00);  // Change color to green
            }
        } else {
            if (this.intersectedObject) {
                // Reset color if mouse leaves the button
                this.intersectedObject.material.color.set(0x0000ff);  // Reset to blue
                this.intersectedObject = null;  // Clear intersected object
            }
        }
    }

    // Method to handle mouse click on buttons
    onClick() {
        if (this.intersectedObject) {
            // Find the button associated with the intersected object
            const buttonData = this.buttons.find(b => b.button === this.intersectedObject);
            if (buttonData) {
                buttonData.action();  // Call the associated action (either restart or exit)
            }
        }
    }

    // Action to restart the game
    restartGame() {
        console.log("Restarting Race...");
        this.gameStateManager.setState('running');  // Set the game state to running
    }

    // Action to exit the game and return to the main menu
    exitGame() {
        console.log("Exiting Race...");
        this.gameStateManager.returnToMenu();  // Return to the menu
    }

    // Method to hide the results screen (removes buttons and text from the scene)
    hide() {
        this.buttons.forEach(b => this.scene.remove(b.button));  // Remove buttons from scene
        this.texts.forEach(t => this.scene.remove(t));  // Remove text meshes from scene
    }

    // Method to show the results screen (adds buttons and text to the scene)
    show() {
        this.buttons.forEach(b => this.scene.add(b.button));  // Add buttons to scene
        this.texts.forEach(t => this.scene.add(t));  // Add text meshes to scene
    }
}

export { MyResults };
