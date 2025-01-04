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


    addWindIndicators() {
        this.windIndicators = [];
    
        for (let i = 0; i < this.layerHeights.length; i++) {
            const layerHeight = this.layerHeights[i];
            const windDirection = this.getWindForLayer(i).normalize(); 
            const arrowLength = 10; // Length of the arrow
            const arrowColor = 0x00ff00; 
    
    
            if (windDirection.length() > 0) {
                const arrowHelper = new THREE.ArrowHelper(
                    windDirection, 
                    new THREE.Vector3(0, layerHeight, 0), 
                    arrowLength, 
                    arrowColor 
                );
    
                this.scene.add(arrowHelper);
                this.windIndicators.push(arrowHelper);
            }
        }
    }
    
    removeWindIndicators() {
        if (this.windIndicators) {
            this.windIndicators.forEach((indicator) => {
                this.scene.remove(indicator);
            });
            this.windIndicators = []; // Clear the array after removal
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
            // No wind in layer 0, hide the arrow
            this.windIndicator.visible = false;
        } else {
            // Wind is present, make the arrow visible and update its position
            this.windIndicator.visible = true;
    
        
            const arrowOffset = windDirection.clone().multiplyScalar(5); 
            const arrowPosition = balloonPosition.add(arrowOffset);
    
            this.windIndicator.position.copy(arrowPosition);
            this.windIndicator.setDirection(windDirection);
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
            this.updateWindIndicator();
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
