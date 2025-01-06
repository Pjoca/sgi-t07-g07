import * as THREE from 'three';

class MyPowerUp {
    constructor(scene) {
        this.scene = scene;

        // Predefined positions for power-ups
        this.powerUpPoints = [
            new THREE.Vector3(-25, 3.1, 45),
            new THREE.Vector3(-20, 3.1, -35),
            new THREE.Vector3(40, 3.1, -50)
        ];

        this.powerUps = [];
        this.boundingSpheres = [];
    }

    createPowerUps() {
        // power shape: ConeGeometry with radialSegments set to 4 for a square base
        const powerUp = new THREE.ConeGeometry(1.25, 2.5, 4); // (radius, height, radialSegments)
        const texture = new THREE.TextureLoader().load('scenes/textures/powerup.jpg');
        const powerupMaterial = new THREE.MeshBasicMaterial({ map: texture });
    
        this.powerUpPoints.forEach((pos) => {
            const power = new THREE.Mesh(powerUp, powerupMaterial);
            power.position.set(pos.x, pos.y, pos.z); // Adjust height as needed
            power.rotation.y = Math.PI / 4; // Rotate to align power's base diagonally
            this.scene.add(power);
    
            // Store the power-up in the powerUps array
            this.powerUps.push(power);
        });
    }    

    calculateBoundingSphereRadius() {
        const radius = 1.25;
        const height = 2.5;
    
        return Math.sqrt(Math.pow(radius, 2) + Math.pow(height / 2, 2));
    }
    
    getPowerUpBoundingSpheres() {
        const radius = this.calculateBoundingSphereRadius();
        return this.powerUps.map(powerUp => ({
            center: powerUp.position.clone(),
            radius: radius,
        }));
    }

    
    showBoundingSpheres() {
        const radius = this.calculateBoundingSphereRadius();
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: 0.5,
        });

        this.powerUps.forEach(powerup => {
            const sphereGeometry = new THREE.SphereGeometry(radius, 16, 16);
            const boundingSphere = new THREE.Mesh(sphereGeometry, material);
            boundingSphere.position.copy(powerup.position);

            this.boundingSpheres.push(boundingSphere);

            this.scene.add(boundingSphere);

            powerup.boundingSphereMesh = boundingSphere;
        });
    }
    

    removePowerUps() {
        this.powerUps.forEach((powerUp) => {
            this.scene.remove(powerUp);
        });
        this.powerUps = [];
    }
}

export { MyPowerUp };
