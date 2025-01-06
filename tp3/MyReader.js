import * as THREE from 'three';
import {MyMenu} from './MyMenu.js';
import {MyTrack} from './MyTrack.js';
import { MyObstacle } from './MyObstacle.js';
import { MyPowerUp } from './MyPowerUp.js';
import {MyBalloon} from './MyBalloon.js';
import {MyResults} from "./MyResults.js";

class MyReader {
    constructor(app) {
        this.app = app;
        this.track = null;
        this.obstacle = null;
        this.powerUps = null;
        this.aiBalloon = null;
        this.humanBalloon = null;
        this.humanColor = null;
        this.aiColor = null;
        this.initialMenu = null;
        this.finalMenu = null;
        this.gameState = 'menu'; // Start with the menu state

        this.mouseX = 0; // Mouse coordinates
        this.mouseY = 0;

        this.startTime = null; // Time tracking
        this.endTime = null;

        this.winner = null;
    }

    init() {
        // Initialize menus
        this.initialMenu = new MyMenu(this.app, this);
        this.initialMenu.init();

        this.finalMenu = new MyResults(this.app, this);
        this.finalMenu.init();
        this.finalMenu.hide();

        // Event listeners
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onMouseClick.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));

        // Start the animation loop
        this.animate();
    }

    onMouseMove(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    onMouseClick(event) {
        if (this.gameState === 'menu') {
            this.initialMenu.onClick();
        }
        if (this.gameState === 'end') {
            this.finalMenu.onClick();
        }
    }

    onKeyDown(event) {
        switch (event.key) {
            case ' ': // Spacebar
                this.togglePause();
                break;
            case 'Escape': // Esc key
                this.returnToMenu();
                break;
            case '3':
                this.app.setActiveCamera("perspective2");
                break;
            default:
                break;
        }
    }

    setState(state) {
        this.gameState = state;
        if (state === 'running') {
            this.startGame();
            this.app.setActiveCamera("perspective2");
        }
        if (state === 'end') {
            this.endGame();
            this.app.setActiveCamera("orthogonal1");
        }
    }

    startGame() {
        console.log("Starting the game...");
        this.initialMenu.hide();
        this.finalMenu.hide();

        this.startTime = Date.now();

        // Initialize the track and balloons
        this.track = new MyTrack(this.app.scene, 30);
        this.track.init();
        this.obstacles = new MyObstacle(this.app.scene);
        this.obstacles.createObstacleMarkers();
        // this.obstacles.showBoundingSpheres(); // debbuging only
        this.powerUps = new MyPowerUp(this.app.scene);
        this.powerUps.createPowerUps();
        // this.powerUps.showBoundingSpheres(); // debbuging only
        const routePoints = this.track.route.getRoutePoints();
        this.aiBalloon = new MyBalloon(this.app, routePoints, false, this, this.track, this.obstacles, this.powerUps, this.aiColor);
        this.aiBalloon.initBalloon();
        this.humanBalloon = new MyBalloon(this.app, routePoints, true, this, this.track, this.obstacles,this.powerUps, this.humanColor);
        this.humanBalloon.initBalloon();
        this.humanBalloon.addDynamicWindIndicator();
        // this.humanBalloon.showBoundingSphere(); // debbuging only

        // Disable movement during countdown
        this.aiBalloon.setCanMove(false);
        this.humanBalloon.setCanMove(false);

        // Display countdown
        this.startCountdown();
    }

    startCountdown() {
        const countdownElement = document.getElementById('countdownMessage');
        let countdownValue = 3;

        countdownElement.style.display = "block"; // Show the countdown message

        // Update countdown every second
        this.countdownTimer = setInterval(() => {
            countdownElement.textContent = countdownValue;
            countdownValue -= 1;

            if (countdownValue < 0) {
                clearInterval(this.countdownTimer); // Stop countdown
                countdownElement.textContent = "GO!"; // Display "GO!"
                setTimeout(() => {
                    countdownElement.style.display = "none"; // Hide countdown after a short delay
                    // Allow movement now that countdown is over
                    this.app.setActiveCamera("perspective1");
                    this.aiBalloon.setCanMove(true);
                    this.humanBalloon.setCanMove(true);
                }, 1000); // Wait 1 second before starting the game
            }
        }, 1000); // Update every 1 second
    }


    setWinner(winner) {
        this.winner = winner;
    }

    setHumanColor(color) {
        this.humanColor = color;
    }

    setBotColor(color) {
        this.aiColor = color;
    }

    endGame() {
        console.log("Final results...");
        console.log(this.winner);

        this.endTime = Date.now();

        if (this.track) {
            this.track.clear();
        }
        if (this.obstacles) {
            this.obstacles.removeObstacleMarkers();
        }
        if (this.aiBalloon) {
            this.aiBalloon.removeBalloon();
        }
        if (this.humanBalloon) {
            this.humanBalloon.removeBalloon();
        }
        if (this.powerUps) {
            this.powerUps.removePowerUps();
        }

        // Calculate and pass the elapsed time to the results menu
        const elapsedTime = ((this.endTime - this.startTime) / 1000).toFixed(2);
        this.finalMenu.setFinalTime(elapsedTime);

        this.finalMenu.show();
    }

    togglePause() {
        if (this.gameState === 'running') {
            console.log("Game Paused");
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            console.log("Game Resumed");
            this.gameState = 'running';
        }
    }

    returnToMenu() {
        if (this.gameState !== 'menu') {
            this.finalMenu.hide();
            console.log("Returning to menu...");
            if (this.track) {
                this.track.clear();
            }
            if (this.aiBalloon) {
                this.aiBalloon.removeBalloon();
            }
            if (this.humanBalloon) {
                this.humanBalloon.removeBalloon();
            }
            if (this.obstacles) {
                this.obstacles.removeObstacleMarkers();
            }

            if (this.powerUps) {
                this.powerUps.removePowerUps();
            }

            this.app.setActiveCamera("orthogonal1");
            this.gameState = 'menu';
            this.initialMenu.init();
            this.initialMenu.show();
            this.initialMenu.humanBalloonSelected = false;
            this.initialMenu.aiBalloonSelected = false;
        }
    }

    animate() {
        // Request the next animation frame
        requestAnimationFrame(() => this.animate());

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

        this.app.renderer.render(this.app.scene, this.app.cameras[this.app.activeCameraName]);
    }
}

export {MyReader};
