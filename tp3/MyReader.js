import * as THREE from 'three'; 
import { MyMenu } from './MyMenu.js'; 
import { MyTrack } from './MyTrack.js'; 
import { MyObstacle } from './MyObstacle.js'; 
import { MyPowerUp } from './MyPowerUp.js'; 
import { MyBalloon } from './MyBalloon.js'; 
import { MyResults } from './MyResults.js'; 

class MyReader {
    constructor(app) {
        this.app = app; // Reference to the main application.

        // Initialize game components and state variables.
        this.track = null; 
        this.obstacle = null; 
        this.powerUps = null; 
        this.aiBalloon = null; 
        this.humanBalloon = null; 
        this.humanColor = null; 
        this.aiColor = null; 
        this.initialMenu = null; 
        this.finalMenu = null; 
        this.gameState = 'menu'; // Initial game state is the menu.

        // Variables to track mouse position.
        this.mouseX = 0; 
        this.mouseY = 0;

        // Variables for time tracking during the game.
        this.startTime = null; 
        this.endTime = null;

        // Variable to store the winner of the game.
        this.winner = null;
    }

    // Initialize the game, menus, and event listeners.
    init() {
        const voucherCounter = document.getElementById("voucherCounter");
        voucherCounter.style.display = "none"; // Hide voucher counter initially.

        // Initialize the main and final menus.
        this.initialMenu = new MyMenu(this.app, this);
        this.initialMenu.init();

        this.finalMenu = new MyResults(this.app, this);
        this.finalMenu.init();
        this.finalMenu.hide(); // Hide the final menu until needed.

        // Add event listeners for user interactions.
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onMouseClick.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));

        // Start the animation loop.
        this.animate();
    }

    // Update mouse coordinates when the mouse moves.
    onMouseMove(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    // Handle mouse clicks based on the current game state.
    onMouseClick(event) {
        if (this.gameState === 'menu') {
            this.initialMenu.onClick(); // Handle clicks in the menu.
        }
        if (this.gameState === 'end') {
            this.finalMenu.onClick(); // Handle clicks in the results screen.
        }
    }

    // Handle keyboard input for game controls.
    onKeyDown(event) {
        switch (event.key) {
            case ' ': // Toggle pause with the spacebar.
                this.togglePause();
                break;
            case 'Escape': // Return to the menu with the Escape key.
                this.returnToMenu();
                break;
            case '3': // Switch to a specific camera view.
                this.app.setActiveCamera("perspective2");
                break;
            default:
                break;
        }
    }

    // Set the current game state and handle state transitions.
    setState(state) {
        this.gameState = state;
        if (state === 'running') {
            this.startGame(); // Start the game when the state is 'running'.
            this.app.setActiveCamera("perspective2");
        }
        if (state === 'end') {
            this.endGame(); // End the game when the state is 'end'.
            this.app.setActiveCamera("orthogonal1");
        }
    }

    // Start the game and initialize all game elements.
    startGame() {
        console.log("Starting the game...");
        this.initialMenu.hide(); // Hide the main menu.
        this.finalMenu.hide(); // Hide the final menu.

        this.startTime = Date.now(); // Record the start time.

        const voucherCounter = document.getElementById("voucherCounter");
        voucherCounter.style.display = "block"; // Show the voucher counter.

        // Initialize the game components: track, obstacles, power-ups, and balloons.
        this.track = new MyTrack(this.app.scene, 30);
        this.track.init();
        this.obstacles = new MyObstacle(this.app.scene);
        this.obstacles.createObstacleMarkers();

        this.powerUps = new MyPowerUp(this.app.scene);
        this.powerUps.createPowerUps();

        const routePoints = this.track.route.getRoutePoints(); // Get track route points.
        this.aiBalloon = new MyBalloon(this.app, routePoints, false, this, this.track, this.obstacles, this.powerUps, this.aiColor);
        this.aiBalloon.initBalloon();
        this.humanBalloon = new MyBalloon(this.app, routePoints, true, this, this.track, this.obstacles, this.powerUps, this.humanColor);
        this.humanBalloon.initBalloon();
        this.humanBalloon.addDynamicWindIndicator();

        this.app.contents.createGui(); // Create the game GUI.

        // Disable movement during the countdown.
        this.aiBalloon.setCanMove(false);
        this.humanBalloon.setCanMove(false);

        this.startCountdown(); // Start the countdown before the game begins.
    }

    // Display a countdown timer before starting the game.
    startCountdown() {
        const countdownElement = document.getElementById('countdownMessage');
        let countdownValue = 3;

        countdownElement.style.display = "block"; // Show the countdown message.

        // Update the countdown every second.
        this.countdownTimer = setInterval(() => {
            countdownElement.textContent = countdownValue;
            countdownValue -= 1;

            if (countdownValue < 0) {
                clearInterval(this.countdownTimer); // Stop the countdown.
                countdownElement.textContent = "GO!"; // Display "GO!" message.
                setTimeout(() => {
                    countdownElement.style.display = "none"; // Hide the countdown.
                    this.app.setActiveCamera("perspective1"); // Switch to the active game camera.
                    this.aiBalloon.setCanMove(true); // Enable movement for the AI balloon.
                    this.humanBalloon.setCanMove(true); // Enable movement for the human balloon.
                }, 1000); // Start the game after a 1-second delay.
            }
        }, 1000); // Countdown interval of 1 second.
    }

    // Set the winner of the game.
    setWinner(winner) {
        this.winner = winner;
    }

    // Set the human balloon's color.
    setHumanColor(color) {
        this.humanColor = color;
    }

    // Set the AI balloon's color.
    setBotColor(color) {
        this.aiColor = color;
    }

    // Handle game end logic, cleanup, and display results.
    endGame() {
        console.log("Final results...");
        console.log(this.winner);

        this.endTime = Date.now(); // Record the end time.

        // Clear all game elements.
        if (this.track) this.track.clear();
        if (this.obstacles) this.obstacles.removeObstacleMarkers();
        if (this.aiBalloon) this.aiBalloon.removeBalloon();
        if (this.humanBalloon) this.humanBalloon.removeBalloon();
        if (this.powerUps) this.powerUps.removePowerUps();

        const voucherCounter = document.getElementById("voucherCounter");
        voucherCounter.style.display = "none"; // Hide the voucher counter.

        // Calculate elapsed time and display results.
        const elapsedTime = ((this.endTime - this.startTime) / 1000).toFixed(2);
        this.finalMenu.setFinalTime(elapsedTime);
        this.finalMenu.show();
    }

    // Toggle the pause state of the game.
    togglePause() {
        if (this.gameState === 'running') {
            console.log("Game Paused");
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            console.log("Game Resumed");
            this.gameState = 'running';
        }
    }

    // Return to the main menu and reset the game.
    returnToMenu() {
        if (this.gameState !== 'menu') {
            this.finalMenu.hide();
            console.log("Returning to menu...");

            // Clear all game elements.
            if (this.track) this.track.clear();
            if (this.aiBalloon) this.aiBalloon.removeBalloon();
            if (this.humanBalloon) this.humanBalloon.removeBalloon();
            if (this.obstacles) this.obstacles.removeObstacleMarkers();
            if (this.powerUps) this.powerUps.removePowerUps();

            const voucherCounter = document.getElementById("voucherCounter");
            voucherCounter.style.display = "none"; 
            voucherCounter.textContent = `Vouchers: ${0}`; // Reset voucher count.

            // Switch to the menu state.
            this.app.setActiveCamera("orthogonal1");
            this.gameState = 'menu';
            this.initialMenu.init();
            this.initialMenu.show();
            this.initialMenu.humanBalloonSelected = false;
            this.initialMenu.aiBalloonSelected = false;
        }
    }

    // Animation loop to update the game state and render the scene.
    animate() {
        requestAnimationFrame(() => this.animate()); // Request the next frame.

        // Update based on the current game state.
        if (this.gameState === 'menu') {
            this.initialMenu.update(this.mouseX, this.mouseY);
        }
        if (this.gameState === 'running') {
            this.aiBalloon.update();
            this.humanBalloon.update();
        }
        if (this.gameState === 'end') {
            this.finalMenu.update(this.mouseX, this.mouseY);
        }

        // Render the scene using the active camera.
        this.app.renderer.render(this.app.scene, this.app.cameras[this.app.activeCameraName]);
    }
}

export { MyReader }; // Export the MyReader class for use in other modules.
