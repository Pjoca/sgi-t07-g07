import { MyMenu } from './MyMenu.js';
import { MyTrack } from './MyTrack.js';
import { MyBalloon } from './MyBalloon.js';

class MyReader {
    constructor(app) {
        this.app = app;
        this.track = null;
        this.aiBalloon = null;
        this.humanBalloon = null;
        this.menu = null; // Reference to the menu
        this.gameState = 'menu';  // Start with the menu state

        // Mouse coordinates to track the cursor position
        this.mouseX = 0;
        this.mouseY = 0;
    }

    init() {
        // Initialize the menu
        this.menu = new MyMenu(this.app, this);
        this.menu.init();

        // Setup event listeners
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onMouseClick.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this)); // New keydown listener

        // Render loop starts
        this.animate();
    }

    onMouseMove(event) {
        // Update the mouse position whenever the mouse moves
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    onMouseClick(event) {
        if (this.gameState === 'menu') {
            this.menu.onClick(); // Handle the click event if in the menu state
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
            default:
                break;
        }
    }

    setState(state) {
        this.gameState = state;
        if (state === 'running') {
            this.startGame();
            this.app.setActiveCamera("perspective1");
        }
    }

    startGame() {
        console.log("Starting the game...");
        this.menu.hide();
        this.track = new MyTrack(this.app.scene, 20);
        this.track.init();
        const routePoints = this.track.route.getRoutePoints();
        this.aiBalloon = new MyBalloon(this.app.scene, routePoints, false);
        this.aiBalloon.initBalloon();
        this.humanBalloon = new MyBalloon(this.app.scene, routePoints, true);
        this.humanBalloon.initBalloon();
        this.humanBalloon.addDynamicWindIndicator();
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
            this.gameState = 'menu';
            this.menu.show();
            this.menu.humanBalloonSelected = false;
            this.menu.aiBalloonSelected = false;
            this.app.setActiveCamera("orthogonal1");
        }
    }

    animate() {
        // Request the next animation frame
        requestAnimationFrame(() => this.animate());

        // Update menu if the game is in the 'menu' state
        if (this.gameState === 'menu') {
            this.menu.update(this.mouseX, this.mouseY); // Pass mouse position to menu update
        }

        // Update balloon if the game is in the 'running' state
        if (this.gameState === 'running') {
            this.aiBalloon.update(); // Update balloon position
            this.humanBalloon.update(); // Update balloon position
        }

        // Render the scene
        this.app.renderer.render(this.app.scene, this.app.cameras[this.app.activeCameraName]);
    }
}

export { MyReader };
