import { MyMenu } from './MyMenu.js';
import { MyTrack } from './MyTrack.js';
import { MyBalloon } from './MyBalloon.js';

class MyReader {
    constructor(app) {
        this.app = app;
        this.track = null;
        this.balloon = null;
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

        // Setup the mouse move listener to update mouse position
        window.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Setup the mouse click listener to handle button clicks
        window.addEventListener('click', this.onMouseClick.bind(this));

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

    setState(state) {
        this.gameState = state;
        if (state === 'running') {
            this.startGame();
            this.app.setActiveCamera("perspective1");
        }
    }

    startGame() {
        console.log("Starting the game...");
        this.menu.hide();  // Hide the menu when game starts
        this.track = new MyTrack(this.app.scene, 20);
        this.track.init();
        const routePoints = this.track.route.getRoutePoints();
        this.balloon = new MyBalloon(this.app.scene, routePoints);
        this.balloon.initBalloon();
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
            this.balloon.update(); // Update balloon position
        }

        // Render the scene
        this.app.renderer.render(this.app.scene, this.app.cameras[this.app.activeCameraName]);
    }
}

export { MyReader };
