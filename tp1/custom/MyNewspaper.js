import * as THREE from 'three';

class MyNewspaper {
    constructor() {
        // Load the newspaper texture
        const textureLoader = new THREE.TextureLoader();
        const newspaperTexture = textureLoader.load('images/newspaper.jpg');

        // Define the geometry, size, and subdivisions
        const width = 5;   // Width of the newspaper
        const height = 3;  // Height of the newspaper
        const geometry = new THREE.PlaneGeometry(width, height, 20, 20); // Plane with subdivisions for bending

        // Access vertex positions via the BufferGeometry attributes
        const positionAttribute = geometry.attributes.position;
        const curveAmount = 0.2; 

        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const z = Math.sin(x * Math.PI / width) * curveAmount; 
            positionAttribute.setZ(i, z);
        }

        positionAttribute.needsUpdate = true;

        const material = new THREE.MeshPhongMaterial({ map: newspaperTexture });

        this.newspaperMesh = new THREE.Mesh(geometry, material);

        // Position and rotation 
        this.newspaperMesh.rotation.x = -Math.PI / 2; 
        this.newspaperMesh.position.set(-1.4, 2.35, 0);     
        this.newspaperMesh.scale.set(0.35, 0.35, 0.35);
    }

    getMesh() {
        return this.newspaperMesh;
    }
}

export { MyNewspaper };
