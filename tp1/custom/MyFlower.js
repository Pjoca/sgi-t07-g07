import * as THREE from 'three';

/**
 * MyFlower class to create a flower shape with petals, a circular center, and a curved stem.
 */
class MyFlower {
    constructor() {
        this.flowerGroup = new THREE.Group(); // Group to hold the entire flower

        // Create the flower components
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
     * Creates the circular center of the flower
     */
    createCenter() {
        const centerGeometry = new THREE.CircleGeometry(0.2, 32);
        const centerMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFD700, // Gold color
            side: THREE.DoubleSide // Make sure the circle is visible from both sides
        });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
    
        center.position.set(0, 3, 0); // Position the center at the top of the stem
        this.flowerGroup.add(center);
    }
    

    /**
     * Creates the flower petals using polygons
     */
    createPetals() {
        const petalGeometry = new THREE.Shape();
        petalGeometry.moveTo(0, 0);
        petalGeometry.quadraticCurveTo(0.1, 0.5, 0, 1); // Upper curve
        petalGeometry.quadraticCurveTo(-0.1, 0.5, 0, 0); // Lower curve

        const petalExtrudeSettings = {
            depth: 0.05,
            bevelEnabled: false
        };

        const petalMaterial = new THREE.MeshBasicMaterial({ color: 0xFF69B4 }); // Pink color
        for (let i = 0; i < 8; i++) { // Create 8 petals
            const petalMesh = new THREE.Mesh(
                new THREE.ExtrudeGeometry(petalGeometry, petalExtrudeSettings),
                petalMaterial
            );

            petalMesh.rotation.z = (i * Math.PI) / 4; // Rotate petals around the center
            petalMesh.position.set(0, 3, 0); // Position petals at the top of the stem
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
}

export { MyFlower };
