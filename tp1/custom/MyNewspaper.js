import * as THREE from 'three';

class MyNewspaper {
    constructor() {
        const textureLoader = new THREE.TextureLoader();

        // Load the newspaper textures for front and back
        const frontTexture = textureLoader.load('images/newspaper_front.jpg');
        const backTexture = textureLoader.load('images/newspaper_back.jpg');

        // Define the geometry, size, and subdivisions for both planes
        const width = 3;   // Width of the newspaper
        const height = 2;  // Height of the newspaper
        const subdivisions = 20;  // Subdivisions for smoother bending

        // Create geometry for both the front and back sides
        const frontGeometry = new THREE.PlaneGeometry(width, height, subdivisions, subdivisions);
        const backGeometry = new THREE.PlaneGeometry(width, height, subdivisions, subdivisions);

        // Apply curvature to both planes (they should curve the same way)
        const curveAmount = 1.0;  // Adjust this to control the amount of curvature

        // Front plane curvature
        const positionAttributeFront = frontGeometry.attributes.position;
        for (let i = 0; i < positionAttributeFront.count; i++) {
            const x = positionAttributeFront.getX(i);
            const z = Math.sin((x / width) * Math.PI) * curveAmount;
            positionAttributeFront.setZ(i, z);
        }
        positionAttributeFront.needsUpdate = true;

        // Back plane curvature (same as front)
        const positionAttributeBack = backGeometry.attributes.position;
        for (let i = 0; i < positionAttributeBack.count; i++) {
            const x = positionAttributeBack.getX(i);
            const z = Math.sin((x / width) * Math.PI) * curveAmount;
            positionAttributeBack.setZ(i, z);  // Same curvature as front
        }
        positionAttributeBack.needsUpdate = true;

        // Create the front material
        const frontMaterial = new THREE.MeshPhongMaterial({ 
            map: frontTexture,
            side: THREE.DoubleSide
        });

        // Create the back material
        const backMaterial = new THREE.MeshPhongMaterial({ 
            map: backTexture,
            side: THREE.DoubleSide
        });

        // Create meshes for front and back planes
        const frontMesh = new THREE.Mesh(frontGeometry, frontMaterial);
        const backMesh = new THREE.Mesh(backGeometry, backMaterial);

        backMesh.rotation.y = Math.PI;  // 180-degree rotation

        // Position the front and back meshes
        frontMesh.position.set(-3.01, 6.4, -2);  // Adjust position to fit the scene
        backMesh.position.set(-3, 6.4, -2);   // Same position for both planes

        // Create a group to hold both meshes (front and back)
        this.newspaper = new THREE.Group();
        this.newspaper.add(frontMesh);
        this.newspaper.add(backMesh);
        //this.newspaper.rotation.z = Math.PI / 4;

        // Apply scale to the entire group
        this.newspaper.scale.set(0.35, 0.35, 0.35);
    }

    getMesh() {
        return this.newspaper;
    }
}

export { MyNewspaper };
