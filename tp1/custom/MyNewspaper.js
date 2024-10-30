import * as THREE from 'three';

class MyNewspaper {
    constructor() {
        const textureLoader = new THREE.TextureLoader();

        // Load the textures for each side of both pages (4 textures total)
        const leftFrontTexture = textureLoader.load('images/newspaper_front.jpg');
        const leftBackTexture = textureLoader.load('images/newspaper_back.jpg');
        const rightFrontTexture = textureLoader.load('images/Ronaldo_wc.jpg');
        const rightBackTexture = textureLoader.load('images/Ronaldo.jpg');

        // Define the geometry, size, and subdivisions for the pages
        const width = 2.5;   // Width of each page
        const height = 3;    // Height of the newspaper
        const subdivisions = 20;  // Subdivisions for smoother bending

        // Create geometry for the left and right pages (front and back)
        const leftFrontGeometry = new THREE.PlaneGeometry(width, height, subdivisions, subdivisions);
        const leftBackGeometry = new THREE.PlaneGeometry(width, height, subdivisions, subdivisions);
        const rightFrontGeometry = new THREE.PlaneGeometry(width, height, subdivisions, subdivisions);
        const rightBackGeometry = new THREE.PlaneGeometry(width, height, subdivisions, subdivisions);

        // Curve amount for the pages (how curved the book looks)
        const curveAmount = 0.3;

        // Apply curvature to the left front page
        this.applyCurve(leftFrontGeometry, width, curveAmount);

        // Apply curvature to the right front page, but mirrored
        this.applyCurve(rightFrontGeometry, width, curveAmount, true);

        // Apply the same curvature to the back pages
        this.applyCurve(leftBackGeometry, width, curveAmount);
        this.applyCurve(rightBackGeometry, width, curveAmount, true);

        // Flip UVs for back pages to prevent mirrored text
        this.flipUVs(leftFrontGeometry);
        this.flipUVs(rightFrontGeometry);

        // Create the materials for both front and back of the left page
        const leftFrontMaterial = new THREE.MeshPhongMaterial({ map: leftFrontTexture, side: THREE.DoubleSide });
        const leftBackMaterial = new THREE.MeshPhongMaterial({ map: leftBackTexture});

        // Create the materials for both front and back of the right page
        const rightFrontMaterial = new THREE.MeshPhongMaterial({ map: rightFrontTexture, side: THREE.DoubleSide });
        const rightBackMaterial = new THREE.MeshPhongMaterial({ map: rightBackTexture});

        // Create the left page meshes (front and back)
        const leftFrontMesh = new THREE.Mesh(leftFrontGeometry, leftFrontMaterial);
        const leftBackMesh = new THREE.Mesh(leftBackGeometry, leftBackMaterial);

        // Create the right page meshes (front and back)
        const rightFrontMesh = new THREE.Mesh(rightFrontGeometry, rightFrontMaterial);
        const rightBackMesh = new THREE.Mesh(rightBackGeometry, rightBackMaterial);

        // ** Adjust rotation for the "V" shape (\/ look) **
        leftFrontMesh.rotation.y = Math.PI / 6;  // Rotate left page slightly outward (positive angle)
        rightFrontMesh.rotation.y = -Math.PI / 6; // Rotate right page slightly outward (negative angle)
        leftBackMesh.rotation.y = Math.PI / 6;    // Rotate back side of left page to match
        rightBackMesh.rotation.y = -Math.PI / 6;  // Rotate back side of right page to match

        // ** Adjust positioning to remove the gap **
        const gapAdjustment = 0.02;  // This value closes the gap

        // Position the front and back meshes for the left page
        leftFrontMesh.position.set(-width / 2 + gapAdjustment, 0, 0); // Adjust x-position closer
        leftBackMesh.position.set(-width / 2 + gapAdjustment, 0, 0);  // Same adjustment

        // Position the front and back meshes for the right page
        rightFrontMesh.position.set(width / 2 - gapAdjustment, 0, 0); // Adjust x-position closer
        rightBackMesh.position.set(width / 2 - gapAdjustment, 0, 0);  // Same adjustment

        // Create groups for left and right pages to hold both front and back sides
        const leftPageGroup = new THREE.Group();
        leftPageGroup.add(leftFrontMesh);
        leftPageGroup.add(leftBackMesh);

        const rightPageGroup = new THREE.Group();
        rightPageGroup.add(rightFrontMesh);
        rightPageGroup.add(rightBackMesh);

        // Now create a main group to represent the whole "open book"
        this.newspaper = new THREE.Group();
        this.newspaper.add(leftPageGroup);
        this.newspaper.add(rightPageGroup);

        // Position and rotation for the newspaper in the scene
        this.newspaper.position.set(-1.5, 2.01, -0.5);  // Adjust based on your scene
        this.newspaper.rotation.x = -Math.PI/2;
        this.newspaper.rotation.z = -Math.PI/2;
        this.newspaper.scale.set(0.3, 0.3, 0.3); // Adjust scale to fit your scene
    }

    // Helper function to apply curvature to a page
    applyCurve(geometry, width, curveAmount, isMirrored = false) {
        const positionAttribute = geometry.attributes.position;
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const z = Math.sin((x / width) * Math.PI) * curveAmount;
            positionAttribute.setZ(i, isMirrored ? -z : z);
        }
        positionAttribute.needsUpdate = true;
    }

    // Helper function to flip UVs (for back faces)
    flipUVs(geometry) {
        const uvAttribute = geometry.attributes.uv;
        for (let i = 0; i < uvAttribute.count; i++) {
            const u = uvAttribute.getX(i);
            uvAttribute.setX(i, 1 - u); // Flip the U coordinate
        }
        uvAttribute.needsUpdate = true;
    }

    getMesh() {
        return this.newspaper;
    }
}

export { MyNewspaper };
