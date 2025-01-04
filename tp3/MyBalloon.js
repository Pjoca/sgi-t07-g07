import * as THREE from 'three';

class MyBalloon {
    constructor(scene, routePoints, isHuman) {
        this.scene = scene;
        this.routePoints = routePoints;
        this.isHuman = isHuman;
        this.balloon = null;
        this.currentPointIndex = 0;
        this.speed = 0.1;
        this.maxSpeed = 1.0;
        this.minSpeed = 0.05;
        this.acceleration = 0.01;

        this.verticalSpeed = 0; 
        this.maxVerticalSpeed = 0.2; 
        this.verticalAcceleration = 0.01;
        this.activeKeys = {};

        this.windSpeed = 0.15;
        this.layerHeights = [0, 5, 10, 15, 20]; 
        
    }

    initBalloon() {
        const balloonGeometry = new THREE.SphereGeometry(1, 32, 32);
        const balloonMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
        this.balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);

        const startPosition = this.routePoints[0];
        this.balloon.position.set(startPosition.x, startPosition.y, startPosition.z);
        this.scene.add(this.balloon);

        this.addKeyboardListeners();
    }

    removeBalloon() {
        this.scene.remove(this.balloon);
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

    updateSpeed() {
        // Update vertical speed (up and down movement)
        if(this.isHuman) {
            if (this.activeKeys['w']) {
                this.verticalSpeed = Math.min(this.verticalSpeed + this.verticalAcceleration, this.maxVerticalSpeed);
            } else if (this.activeKeys['s']) {
                this.verticalSpeed = Math.max(this.verticalSpeed - this.verticalAcceleration, -this.maxVerticalSpeed);
            } 
        }
        
    }

    getActiveLayer() {
        // Determine the active layer based on the balloon's height
        const height = this.balloon.position.y;
        for (let i = this.layerHeights.length - 1; i >= 0; i--) {
            if (height >= this.layerHeights[i]) {
                return i;
            }
        }
        return 0; // Default to the lowest layer
    }

    getWindForLayer(layer) {
        // Return the wind direction for the given layer
        switch (layer) {
            case 4: // West
                return new THREE.Vector3(-this.windSpeed, 0, 0);
            case 3: // East
                return new THREE.Vector3(this.windSpeed, 0, 0);
            case 2: // South
                return new THREE.Vector3(0, 0, -this.windSpeed);
            case 1: // North
                return new THREE.Vector3(0, 0, this.windSpeed);
            case 0: // No wind
            default:
                return new THREE.Vector3(0, 0, 0);
        }
    }

    update() {
        if (!this.balloon || this.routePoints.length === 0) return;

        this.updateSpeed();

        const activeLayer = this.getActiveLayer();
        const wind = this.getWindForLayer(activeLayer);
        this.balloon.position.add(wind);

        if(this.isHuman) {
            this.balloon.position.y += this.verticalSpeed;

            if (this.balloon.position.y < 1) {
                this.balloon.position.y = 1;
                this.verticalSpeed = 0;
            }

            if (this.balloon.position.y > 20) {
                this.balloon.position.y = 20;
                this.verticalSpeed = 0;
            }
        }

        if(this.isHuman == false) {

            const targetPoint = this.routePoints[this.currentPointIndex];
            const direction = new THREE.Vector3().subVectors(targetPoint, this.balloon.position);
            const distance = direction.length();
            if (distance < this.speed) {
                this.balloon.position.copy(targetPoint);
                this.currentPointIndex = (this.currentPointIndex + 1) % this.routePoints.length;
            } else {
                direction.normalize().multiplyScalar(this.speed);
                this.balloon.position.add(direction);
            }
    
            const tangent = new THREE.Vector3().subVectors(this.routePoints[this.currentPointIndex], this.balloon.position);
            this.balloon.rotation.y = Math.atan2(tangent.z, tangent.x);
        }

    }
}

export {MyBalloon};
