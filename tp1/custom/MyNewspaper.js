import * as THREE from 'three';

class MyNewspaper {
    constructor() {
        // Initialize a texture loader for loading images
        const textureLoader = new THREE.TextureLoader();

        // Load the textures for each side of both pages (4 textures total)
        const leftFrontTexture = textureLoader.load('textures/newspaper_front.jpg');
        const leftBackTexture = textureLoader.load('textures/newspaper_back.jpg');
        const rightFrontTexture = textureLoader.load('textures/Ronaldo_wc.jpg');
        const rightBackTexture = textureLoader.load('textures/Ronaldo.jpg');

        // Define the geometry, size, and subdivisions for the pages
        const width = 2.5; // Width of each page
        const height = 3; // Height of each page
        const subdivisions = 20; // Number of subdivisions in both width and height for more detailed geometry

        // Create geometry for the left and right pages (front and back)
        const leftFrontGeometry = new THREE.PlaneGeometry(width, height, subdivisions, subdivisions);
        const leftBackGeometry = new THREE.PlaneGeometry(width, height, subdivisions, subdivisions);
        const rightFrontGeometry = new THREE.PlaneGeometry(width, height, subdivisions, subdivisions);
        const rightBackGeometry = new THREE.PlaneGeometry(width, height, subdivisions, subdivisions);

        // Define how curved the pages appear
        const curveAmount = 0.3; // Curvature amount for the pages

        // Apply curvature to the left front page
        this.applyCurve(leftFrontGeometry, width, curveAmount);

        // Apply curvature to the right front page, mirroring the effect
        this.applyCurve(rightFrontGeometry, width, curveAmount, true);

        // Apply the same curvature to the back pages
        this.applyCurve(leftBackGeometry, width, curveAmount);
        this.applyCurve(rightBackGeometry, width, curveAmount, true);

        // Flip UVs for back pages to prevent mirrored text
        this.flipUVs(leftFrontGeometry);
        this.flipUVs(rightFrontGeometry);

        // Create the materials for both front and back of the left page
        const leftFrontMaterial = new THREE.MeshPhongMaterial({ map: leftFrontTexture, side: THREE.DoubleSide });
        const leftBackMaterial = new THREE.MeshPhongMaterial({ map: leftBackTexture });

        // Create the materials for both front and back of the right page
        const rightFrontMaterial = new THREE.MeshPhongMaterial({ map: rightFrontTexture, side: THREE.DoubleSide });
        const rightBackMaterial = new THREE.MeshPhongMaterial({ map: rightBackTexture });

        // Create the left page meshes (front and back)
        const leftFrontMesh = new THREE.Mesh(leftFrontGeometry, leftFrontMaterial);
        leftFrontMesh.receiveShadow = true; // Enable shadows on this mesh
        leftFrontMesh.castShadow = true; // Allow this mesh to cast shadows
        const leftBackMesh = new THREE.Mesh(leftBackGeometry, leftBackMaterial);

        // Create the right page meshes (front and back)
        const rightFrontMesh = new THREE.Mesh(rightFrontGeometry, rightFrontMaterial);
        rightFrontMesh.receiveShadow = true; // Enable shadows on this mesh
        rightFrontMesh.castShadow = true; // Allow this mesh to cast shadows
        const rightBackMesh = new THREE.Mesh(rightBackGeometry, rightBackMaterial);

        // ** Adjust rotation for the "V" shape (\/ look) **
        leftFrontMesh.rotation.y = Math.PI / 6;  // Rotate left page slightly outward (positive angle)
        rightFrontMesh.rotation.y = -Math.PI / 6; // Rotate right page slightly outward (negative angle)
        leftBackMesh.rotation.y = Math.PI / 6;    // Rotate back side of left page to match
        rightBackMesh.rotation.y = -Math.PI / 6;  // Rotate back side of right page to match

        // ** Adjust positioning to remove the gap **
        const gapAdjustment = 0.02;  // This value closes the gap between pages

        // Position the front and back meshes for the left page
        leftFrontMesh.position.set(-width / 2 + gapAdjustment, 0, 0); // Adjust x-position closer to center
        leftBackMesh.position.set(-width / 2 + gapAdjustment, 0, 0);  // Same adjustment for back page

        // Position the front and back meshes for the right page
        rightFrontMesh.position.set(width / 2 - gapAdjustment, 0, 0); // Adjust x-position closer to center
        rightBackMesh.position.set(width / 2 - gapAdjustment, 0, 0);  // Same adjustment for back page

        // Create groups for left and right pages to hold both front and back sides
        const leftPageGroup = new THREE.Group();
        leftPageGroup.add(leftFrontMesh); // Add front page mesh to left page group
        leftPageGroup.add(leftBackMesh);  // Add back page mesh to left page group

        const rightPageGroup = new THREE.Group();
        rightPageGroup.add(rightFrontMesh); // Add front page mesh to right page group
        rightPageGroup.add(rightBackMesh);   // Add back page mesh to right page group

        // Now create a main group to represent the whole "open book"
        this.newspaper = new THREE.Group();
        this.newspaper.add(leftPageGroup); // Add left page group to newspaper
        this.newspaper.add(rightPageGroup); // Add right page group to newspaper

        // Position and rotation for the newspaper in the scene
        this.newspaper.position.set(-1.5, 2.01, -0.5);  // Adjust based on your scene setup
        this.newspaper.rotation.x = -Math.PI / 2; // Rotate to lay flat on the XZ plane
        this.newspaper.rotation.z = -Math.PI / 2; // Rotate around Z to orient correctly
        this.newspaper.scale.set(0.3, 0.3, 0.3); // Scale the newspaper to fit in the scene
    }

    /**
     * Helper function to apply curvature to a page's geometry.
     * @param {THREE.PlaneGeometry} geometry - The geometry to be curved.
     * @param {number} width - The width of the page for calculations.
     * @param {number} curveAmount - The amount of curvature to apply.
     * @param {boolean} [isMirrored=false] - Indicates if the curvature should be applied in the opposite direction.
     */
    applyCurve(geometry, width, curveAmount, isMirrored = false) {
        const positionAttribute = geometry.attributes.position; // Access the position attribute of the geometry
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i); // Get the x-coordinate of the vertex
            const z = Math.sin((x / width) * Math.PI) * curveAmount; // Calculate the z-coordinate based on sine function for curvature
            positionAttribute.setZ(i, isMirrored ? -z : z); // Apply curvature, inverting z if mirrored
        }
        positionAttribute.needsUpdate = true; // Mark the attribute for update to reflect changes
    }

    /**
     * Helper function to flip UVs for the geometry (for back faces).
     * @param {THREE.PlaneGeometry} geometry - The geometry whose UVs will be flipped.
     */
    flipUVs(geometry) {
        const uvAttribute = geometry.attributes.uv; // Access the UV attribute of the geometry
        for (let i = 0; i < uvAttribute.count; i++) {
            const u = uvAttribute.getX(i); // Get the current U coordinate
            uvAttribute.setX(i, 1 - u); // Flip the U coordinate to mirror the texture
        }
        uvAttribute.needsUpdate = true; // Mark the UV attribute for update
    }

    /**
     * Returns the main newspaper group containing both pages.
     * @returns {THREE.Group} The newspaper group
     */
    getMesh() {
        return this.newspaper; // Return the complete newspaper group
    }
}

export { MyNewspaper }; // Export the MyNewspaper class for use in other modules
