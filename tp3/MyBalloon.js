import * as THREE from 'three';

class MyBalloon {
    constructor(app, routePoints, isHuman, gameStateManager, obstacleManager) {
        this.app = app;
        this.scene = this.app.scene;
        this.routePoints = routePoints;
        this.isHuman = isHuman;
        this.gameStateManager = gameStateManager;
        this.obstacleManager = obstacleManager;
        this.balloon = null;
        this.currentPointIndex = 1;
        this.botSpeed = 0.0375;
        this.verticalSpeed = 0.08;
        this.activeKeys = {};
        this.cameraMode = "thirdPerson";
        this.windSpeed = 0.05;
        this.layerHeights = [0, 5, 10, 15, 20];
    }

    initBalloon() {
        const balloonGeometry = new THREE.SphereGeometry(1, 32, 32);
        const balloonMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
        this.balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);

        const startPosition = this.routePoints[0];

        if (this.isHuman) {
            this.balloon.position.set(startPosition.x, startPosition.y, startPosition.z - 7.5);
        } else {
            this.balloon.position.set(startPosition.x, startPosition.y, startPosition.z + 7.5);
        }
        this.scene.add(this.balloon);

        this.addKeyboardListeners();
    }

    addKeyboardListeners() {
        if (this.isHuman) {
            window.addEventListener('keydown', (event) => {
                this.activeKeys[event.key.toLowerCase()] = true;
            });

            window.addEventListener('keyup', (event) => {
                this.activeKeys[event.key.toLowerCase()] = false;
            });
        }
    }

    updateCamera(wind) {
        let x = wind.x;
        let z = wind.z;

        if (x === -this.windSpeed) x = 1;
        if (x === this.windSpeed) x = -1;
        if (z === -this.windSpeed) z = 1;
        if (z === this.windSpeed) z = -1;

        if (this.cameraMode === "thirdPerson") {
            if (x === 0 && z === 0) {
                this.app.cameras[this.app.activeCameraName].position.copy(this.balloon.position).add(new THREE.Vector3(10, 7.5, 0));
                this.app.cameras[this.app.activeCameraName].lookAt(new THREE.Vector3(-100, this.balloon.position.y - 25, this.balloon.position.z));
            } else if (x === 0) {
                this.app.cameras[this.app.activeCameraName].position.copy(this.balloon.position).add(new THREE.Vector3(0, 7.5, z * 10));
                this.app.cameras[this.app.activeCameraName].lookAt(new THREE.Vector3(this.balloon.position.x, this.balloon.position.y - 25, -z * 100));
            } else if (z === 0) {
                this.app.cameras[this.app.activeCameraName].position.copy(this.balloon.position).add(new THREE.Vector3(x * 10, 7.5, 0));
                this.app.cameras[this.app.activeCameraName].lookAt(new THREE.Vector3(-x * 100, this.balloon.position.y - 25, this.balloon.position.z));
            }
        } else {
            if (x === 0 && z === 0) {
                this.app.cameras[this.app.activeCameraName].position.copy(this.balloon.position);
                this.app.cameras[this.app.activeCameraName].lookAt(new THREE.Vector3(-100, this.balloon.position.y - 25, this.balloon.position.z));
            } else if (x === 0) {
                this.app.cameras[this.app.activeCameraName].position.copy(this.balloon.position);
                this.app.cameras[this.app.activeCameraName].lookAt(new THREE.Vector3(this.balloon.position.x, this.balloon.position.y - 25, -z * 100));
            } else if (z === 0) {
                this.app.cameras[this.app.activeCameraName].position.copy(this.balloon.position);
                this.app.cameras[this.app.activeCameraName].lookAt(new THREE.Vector3(-x * 100, this.balloon.position.y - 25, this.balloon.position.z));
            }
        }
    }

    update() {
        if (!this.balloon || this.routePoints.length === 0) return;

        // Save the previous position
        const prevPosition = this.balloon.position.clone();

        // Update position based on wind or human input
        const activeLayer = this.getActiveLayer();
        const wind = this.getWindForLayer(activeLayer);
        this.balloon.position.add(wind);

        if (this.app.activeCameraName === "perspective1") this.updateCamera(wind);

        if (this.isHuman) {
            // Adjust vertical movement based on key presses
            if (this.activeKeys['w']) {
                this.balloon.position.y += this.verticalSpeed;
            } else if (this.activeKeys['s']) {
                this.balloon.position.y -= this.verticalSpeed;
            } else if (this.activeKeys['1']) {
                this.app.setActiveCamera("perspective1");
                this.cameraMode = "firstPerson";
            } else if (this.activeKeys['2']) {
                this.app.setActiveCamera("perspective1");
                this.cameraMode = "thirdPerson";
            }

            // Prevent the balloon from going out of bounds
            if (this.balloon.position.y < 1) {
                this.balloon.position.y = 1;
            }

            if (this.balloon.position.y > 20) {
                this.balloon.position.y = 20;
            }

            this.updateWindIndicator();

            const obstacleBoundingSpheres = this.obstacleManager.getObstacleBoundingSpheres();
            if (this.checkCollisionsWithObstacles(obstacleBoundingSpheres)) {
                console.log("Collision detected!");
            }
        }

        if (!this.isHuman) {
            const targetPoint = this.routePoints[this.currentPointIndex];
            const direction = new THREE.Vector3().subVectors(targetPoint, this.balloon.position);
            const distance = direction.length();
            if (distance < this.botSpeed) {
                this.balloon.position.copy(targetPoint);
                this.currentPointIndex = (this.currentPointIndex + 1) % this.routePoints.length;
            } else {
                direction.normalize().multiplyScalar(this.botSpeed);
                this.balloon.position.add(direction);
            }

            const tangent = new THREE.Vector3().subVectors(this.routePoints[this.currentPointIndex], this.balloon.position);
            this.balloon.rotation.y = Math.atan2(tangent.z, tangent.x);
        }

        // Check for crossing the goal line
        this.checkGoalLineCrossing(prevPosition);
    }

    checkGoalLineCrossing(prevPosition) {
        const goalLineX = 7.5; // X position of the goal line
        const minZ = 23; // Minimum Z position for the goal posts
        const maxZ = 57; // Maximum Z position for the goal posts
        const maxY = 25; // Maximum Y position the balloon can cross below
        const tolerance = 0.5; // Small tolerance for crossing detection

        const isCrossingGoalLine = Math.abs(this.balloon.position.x - goalLineX) < tolerance;
        const isWithinVerticalBounds = this.balloon.position.y < maxY;
        const isWithinHorizontalBounds = this.balloon.position.z >= minZ && this.balloon.position.z <= maxZ;
        const isMovingForward = this.balloon.position.x < prevPosition.x;

        if (isCrossingGoalLine && isWithinVerticalBounds && isWithinHorizontalBounds) {
            if (isMovingForward) {
                this.onGoalLineCrossed(); // Proceed with endgame mechanic
            } else {
                this.balloon.position.x = prevPosition.x; // Block the balloon from crossing in the wrong direction
                console.log("Cannot cross the goal line in the wrong direction!");
            }
        }
    }

    onGoalLineCrossed() {
        console.log(`${this.isHuman ? 'Human' : 'Bot'} balloon crossed the goal line!`);
        this.gameStateManager.setWinner(this.isHuman ? 'Human' : 'Bot');
        this.gameStateManager.setState('end');
    }


    getActiveLayer() {
        const height = this.balloon.position.y;
        for (let i = this.layerHeights.length - 1; i >= 0; i--) {
            if (height >= this.layerHeights[i]) {
                return i;
            }
        }
        return 0; // Default to the lowest layer
    }

    getWindForLayer(layer) {
        switch (layer) {
            case 4:
                return new THREE.Vector3(-this.windSpeed, 0, 0);
            case 3:
                return new THREE.Vector3(this.windSpeed, 0, 0);
            case 2:
                return new THREE.Vector3(0, 0, -this.windSpeed);
            case 1:
                return new THREE.Vector3(0, 0, this.windSpeed);
            case 0:
            default:
                return new THREE.Vector3(0, 0, 0);
        }
    }

    addDynamicWindIndicator() {
        const arrowLength = 6;
        const arrowColor = 0x00ff00;

        this.windIndicator = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 0),
            arrowLength,
            arrowColor
        );

        this.scene.add(this.windIndicator);
    }

    updateWindIndicator() {
        const activeLayer = this.getActiveLayer();
        const windDirection = this.getWindForLayer(activeLayer).normalize();
        const balloonPosition = this.balloon.position.clone();

        if (windDirection.length() === 0) {
            this.windIndicator.visible = false;
        } else {
            this.windIndicator.visible = true;

            const arrowOffset = windDirection.clone().multiplyScalar(5);
            const arrowPosition = balloonPosition.add(arrowOffset);

            this.windIndicator.position.copy(arrowPosition);
            this.windIndicator.setDirection(windDirection);
        }
    }

    getBoundingSphere() {
        const radius = 1; 
        return {
            center: this.balloon.position.clone(),
            radius: radius,
        };
    }

    checkCollisionsWithObstacles(obstacleBoundingSpheres) {
        const balloonSphere = this.getBoundingSphere();

        for (const obstacleSphere of obstacleBoundingSpheres) {
            const distance = balloonSphere.center.distanceTo(obstacleSphere.center);
            if (distance <= balloonSphere.radius + obstacleSphere.radius) {
                console.log("Collision detected with an obstacle!");
                return true;
            }
        }
        return false;
    }

    /*showBoundingSphere() {
        const radius = 1; // Balloon bounding sphere radius
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
            transparent: true,
            opacity: 0.5,
        });

        const sphereGeometry = new THREE.SphereGeometry(radius, 16, 16);
        this.boundingSphereMesh = new THREE.Mesh(sphereGeometry, material);
        this.boundingSphereMesh.position.copy(this.balloon.position);
        this.scene.add(this.boundingSphereMesh);
    }*/

    removeBalloon() {
        this.scene.remove(this.balloon);
        this.scene.remove(this.windIndicator);
    }
}

export {MyBalloon};