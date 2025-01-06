import * as THREE from 'three';
import { OBJLoader } from './node_modules/three/examples/jsm/loaders/OBJLoader.js';

class MyBalloon {
    constructor(app, routePoints, isHuman, gameStateManager, track, obstacleManager, powerManager, color = 0xeeeeee) {
        this.app = app;
        this.scene = this.app.scene;
        this.routePoints = routePoints;
        this.isHuman = isHuman;
        this.gameStateManager = gameStateManager;
        this.obstacleManager = obstacleManager;
        this.powerManager = powerManager;
        this.color = color;
        this.centerLine = track.centerLine;
        this.trackWidth = track.trackWidth;
        this.balloon = null;
        this.groundCone = null; // Green cone for the human balloon
        this.currentPointIndex = 1;
        this.botSpeed = 0.0375;
        this.verticalSpeed = 0.08;
        this.activeKeys = {};
        this.cameraMode = "thirdPerson";
        this.windSpeed = 0.05;
        this.layerHeights = [0, 5, 10, 15, 20];
        this.isPenaltyActive = false; // Track if penalty is active
        this.canMove = true;
        this.vouchers = 0;
        this.collectedPowerUps = new Set();
    }

    initBalloon() {
        const loader = new OBJLoader();
        loader.load('scenes/objects/airballoon4.obj',
            (obj) => {
                const material = new THREE.MeshStandardMaterial({ color: this.color });
                obj.traverse((child) => {
                    if (child.isMesh) {
                        child.material = material;
                    }
                });
                this.balloon = obj;

                this.balloon.scale.set(5, 5, 5);

                // Set initial position
                const startPosition = this.routePoints[0];
                if (this.isHuman) {
                    this.balloon.position.set(startPosition.x, startPosition.y, startPosition.z - 7.5);
                } else {
                    this.balloon.position.set(startPosition.x, startPosition.y, startPosition.z + 7.5);
                }

                this.scene.add(this.balloon);

                if (this.isHuman) {
                    this.addGroundCone();
                    this.addKeyboardListeners();
                }
            },
            (xhr) => {
                console.log(`Balloon loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
            },
            (error) => {
                console.error('Error loading the .obj file:', error);
            }
        );
    }

    addGroundCone() {
        const coneGeometry = new THREE.ConeGeometry(0.75, 2, 32);
        const coneMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
        this.groundCone = new THREE.Mesh(coneGeometry, coneMaterial);

        // Initial position of the cone below the balloon
        this.groundCone.position.set(this.balloon.position.x, 1, this.balloon.position.z);
        this.groundCone.rotation.y = -Math.PI / 2; // Point the cone upwards
        this.scene.add(this.groundCone);
    }


    removeBalloon() {
        this.scene.remove(this.balloon);
        if (this.groundCone) {
            this.scene.remove(this.groundCone);
        }
        this.scene.remove(this.windIndicator);
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
                this.app.cameras[this.app.activeCameraName].position.copy(this.balloon.position).add(new THREE.Vector3(15, 15, 0));
                this.app.cameras[this.app.activeCameraName].lookAt(new THREE.Vector3(-100, this.balloon.position.y - 50, this.balloon.position.z));
            } else if (x === 0) {
                this.app.cameras[this.app.activeCameraName].position.copy(this.balloon.position).add(new THREE.Vector3(0, 15, z * 15));
                this.app.cameras[this.app.activeCameraName].lookAt(new THREE.Vector3(this.balloon.position.x, this.balloon.position.y - 50, -z * 100));
            } else if (z === 0) {
                this.app.cameras[this.app.activeCameraName].position.copy(this.balloon.position).add(new THREE.Vector3(x * 15, 15, 0));
                this.app.cameras[this.app.activeCameraName].lookAt(new THREE.Vector3(-x * 100, this.balloon.position.y - 50, this.balloon.position.z));
            }
        } else {
            if (x === 0 && z === 0) {
                this.app.cameras[this.app.activeCameraName].position.copy(this.balloon.position).add(new THREE.Vector3(0, 1.5, 0));
                this.app.cameras[this.app.activeCameraName].lookAt(new THREE.Vector3(-100, this.balloon.position.y - 25, this.balloon.position.z));
            } else if (x === 0) {
                this.app.cameras[this.app.activeCameraName].position.copy(this.balloon.position).add(new THREE.Vector3(0, 1.5, 0));
                this.app.cameras[this.app.activeCameraName].lookAt(new THREE.Vector3(this.balloon.position.x, this.balloon.position.y - 25, -z * 100));
            } else if (z === 0) {
                this.app.cameras[this.app.activeCameraName].position.copy(this.balloon.position).add(new THREE.Vector3(0, 1.5, 0));
                this.app.cameras[this.app.activeCameraName].lookAt(new THREE.Vector3(-x * 100, this.balloon.position.y - 25, this.balloon.position.z));
            }
        }
    }

    update() {
        if (!this.balloon || this.routePoints.length === 0) return;
        if (!this.canMove) return;

        // Save the previous position
        const prevPosition = this.balloon.position.clone();
        const activeLayer = this.getActiveLayer();
        const wind = this.getWindForLayer(activeLayer);

        // Only update the balloon's position if it's not stunned (penalty period)
        if (!this.isPenaltyActive) {
            this.balloon.position.add(wind);
        }

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

            this.updateGroundCone();
            this.updateWindIndicator();

            const obstacleBoundingSpheres = this.obstacleManager.getObstacleBoundingSpheres();
            if (this.checkCollisionsWithObstacles(obstacleBoundingSpheres)) {
                console.log("Collision detected!");
            }

            const powerUpBoundingSpheres = this.powerManager.getPowerUpBoundingSpheres();
            if (this.checkCollisionsWithPowerups(powerUpBoundingSpheres)) {
                console.log("Power-up collected!");
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

    setCanMove(canMove) {
        this.canMove = canMove;
    }

    updateGroundCone() {
        if (this.groundCone) {
            this.groundCone.position.set(this.balloon.position.x, 1, this.balloon.position.z);
            this.checkIfOffTrack();
        }
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
                this.onGoalLineCrossed();
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
            this.windIndicator.position.y += 6;
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

        const divisions = 100;  // The more divisions, the more accurate the result
        const centerPoints = this.centerLine.getPoints(divisions);

        // Find the closest point on the track center line to the ground cone's position
        let closestPoint = null;
        let minDistance = Infinity;

        centerPoints.forEach((point) => {
            const distance = this.groundCone.position.distanceTo(point);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = point;
            }
        });

        for (const obstacleSphere of obstacleBoundingSpheres) {
            const distance = balloonSphere.center.distanceTo(obstacleSphere.center);

            if (distance <= balloonSphere.radius + obstacleSphere.radius) {
                console.log("Collision detected with an obstacle!");
                this.isPenaltyActive = true;

                const collisionMessage = document.getElementById("collisionMessage");
                collisionMessage.style.display = "block"; // Show the message

                setTimeout(() => {
                    this.moveBalloonToClosestPoint(closestPoint);
                    collisionMessage.style.display = "none"; // Hide the message
                    this.isPenaltyActive = false;
                }, 2000); // The penalty lasts for 2 seconds

                return true;
            }
        }
        return false;
    }

    checkCollisionsWithPowerups(powerUpBoundingSpheres) {
        const balloonSphere = this.getBoundingSphere();

        for (let i = 0; i < powerUpBoundingSpheres.length; i++) {
            const powerUpSphere = powerUpBoundingSpheres[i];

            // Skip already collected power-ups
            if (this.collectedPowerUps.has(i)) {
                continue;
            }

            const distance = balloonSphere.center.distanceTo(powerUpSphere.center);

            if (distance <= balloonSphere.radius + powerUpSphere.radius) {
                console.log("Collision detected with a power-up!");

                // Mark the power-up as collected
                this.collectedPowerUps.add(i);

                // Increment vouchers
                this.vouchers++;
                console.log("Vouchers:", this.vouchers);

                return true;
            }
        }
        return false;
    }

    // debbuging only
    showBoundingSphere() {
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
    }

    checkIfOffTrack() {
        const trackBoundaryDistance = this.trackWidth / 2 + 0.5; // Threshold to determine if the cone is off the track

        // Sample points along the track (center line)
        const divisions = 100;  // The more divisions, the more accurate the result
        const centerPoints = this.centerLine.getPoints(divisions);

        // Find the closest point on the track center line to the ground cone's position
        let closestPoint = null;
        let minDistance = Infinity;

        centerPoints.forEach((point) => {
            const distance = this.groundCone.position.distanceTo(point);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = point;
            }
        });

        // If the distance exceeds the track width, the balloon is off the track
        if (minDistance > trackBoundaryDistance) {
            console.log('Balloon has gone off track!');
            this.applyPenalty(closestPoint); // Apply penalty for going off track
        }
    }

    applyPenalty(closestPoint) {
        this.isPenaltyActive = true; // Activate the penalty state

        // Show the "STUNNED!" message
        const stunnedMessage = document.getElementById("stunnedMessage");
        stunnedMessage.style.display = "block"; // Show the message

        setTimeout(() => {
            this.moveBalloonToClosestPoint(closestPoint);
            this.isPenaltyActive = false;

            // Hide the "STUNNED!" message after penalty ends
            stunnedMessage.style.display = "none"; // Hide the message
        }, 2000); // The penalty lasts for 2 seconds
    }


    moveBalloonToClosestPoint(closestPoint) {
        if (closestPoint) {
            console.log("Teleporting balloon to the closest point on the track.");
            this.balloon.position.set(closestPoint.x, 20, closestPoint.z);
        }
    }

    useVoucher() {
        if (this.vouchers > 0) {
            this.vouchers--;
            console.log('Voucher used! Remaining vouchers:', this.vouchers);
            return true; // Successfully used
        }
        console.log('No vouchers available!');
        return false;
    }
}

export {MyBalloon};
