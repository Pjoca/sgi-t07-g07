import * as THREE from 'three';

/**
 * MyFlower class to create a flower shape with petals, a spherical center, and a curved stem.
 */
class MyFlower {
    constructor() {
        this.flowerGroup = new THREE.Group(); // Group to hold the flower components
        this.createFlower(); // Call method to create the flower
    }

    createFlower() {
        this.createStem();
        this.createCenter();
        this.createPetals();
    }

    /**
     * Creates a curved stem using a LineCurve3
     */
    createStem() {
        // Define the curve points for the stem
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.5, 1, 0),
            new THREE.Vector3(-0.5, 2, 0),
            new THREE.Vector3(0, 3, 0)
        ]);

        // Geometry and material for the stem
        const points = curve.getPoints(50);
        const stemGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const stemMaterial = new THREE.LineBasicMaterial({ color: 0x228B22 });

        // Create the stem mesh and add it to the flower group
        const stem = new THREE.Line(stemGeometry, stemMaterial);
        this.flowerGroup.add(stem);
    }

    /**
     * Creates the spherical center of the flower
     */
    createCenter() {
        const centerGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Sphere instead of Circle
        const centerMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFD700,
            shininess: 100
        });

        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        center.position.set(0, 3, 0); // Position the sphere at the top of the stem
        this.flowerGroup.add(center);
    }

    /**
     * Creates the flower petals using polygons
     */
    createPetals() {
        const petalGeometry = new THREE.Shape();
        petalGeometry.moveTo(0, 0);
        petalGeometry.quadraticCurveTo(0.2, 1, 0, 2); // Increase the size of the petals by changing control points
        petalGeometry.quadraticCurveTo(-0.2, 1, 0, 0); // Adjusted for larger size
    
        const petalExtrudeSettings = {
            depth: 0.1, // Increase the thickness slightly if needed
            bevelEnabled: false
        };
    
        const petalMaterial = new THREE.MeshPhongMaterial({
            color: 0x9400D3,
            shininess: 100,
            side: THREE.DoubleSide
        });
    
        const petalRadius = 0.7; // Increase the radius to position petals further from the sphere
    
        for (let i = 0; i < 8; i++) { // Create 8 petals
            const petalMesh = new THREE.Mesh(
                new THREE.ExtrudeGeometry(petalGeometry, petalExtrudeSettings),
                petalMaterial
            );
    
            // Calculate the angle for even distribution
            const angle = (i * Math.PI) / 4;
    
            // Set the position of each petal around the center
            petalMesh.position.set(
                Math.cos(angle) * petalRadius, // x position
                3 + Math.sin(angle) * petalRadius, // y position, keeping the height at 3
                -0.2 // z position to ensure petals are slightly behind the sphere
            );
    
            petalMesh.rotation.z = angle + Math.PI / 2; // Rotate petals to face outward
    
            this.flowerGroup.add(petalMesh);
        }
    }

    /**
     * Returns the flower group containing all the components
     * @returns {THREE.Group} The flower group
     */
    getMesh() {
        return this.flowerGroup;
    }

    /**
     * Method to build and position the flower
     * @param {THREE.Vector3} position - The position to place the flower
     * @param {THREE.Vector3} scale - The scale to apply to the flower
     */
    build(position, scale) {
        this.flowerGroup.position.copy(position);
        this.flowerGroup.scale.copy(scale);
    }
}

export { MyFlower };
