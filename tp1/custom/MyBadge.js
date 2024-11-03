import * as THREE from 'three';

export class MyBadge {
    constructor() {
        // Set badge dimensions
        this.width = 2;
        this.height = 1.5;

        // Load texture for the badge
        const textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load('textures/galatasaray.jpg');

        // Material for the badge with a slight shininess
        this.material = new THREE.MeshPhongMaterial({
            map: this.texture,       // Texture map for the badge
            shininess: 20            // Controls specular highlight
        });
        // Create geometry for the badge as a simple 2D plane
        this.badgeGeometry = new THREE.PlaneGeometry(this.width, this.height);

        // Badge mesh with texture and geometry
        this.badge = new THREE.Mesh(this.badgeGeometry, this.material);

        // Load texture for the frame surrounding the badge
        this.frameTexture = textureLoader.load('textures/frame.jpg');

        // Material for the frame with a darker color and higher shininess
        this.frameMaterial = new THREE.MeshPhongMaterial({
            map: this.frameTexture,   // Texture for frame appearance
            specular: "#394143",      // Specular color for subtle reflection
            shininess: 40             // Higher shininess for more reflective look
        });

        // Geometry for frame components (top, bottom, left, right)
        // Each frame section is created using BoxGeometry with adjusted dimensions
        this.topFrameGeometry = new THREE.BoxGeometry(this.width, 0.16, 0.1);
        this.bottomFrameGeometry = new THREE.BoxGeometry(this.width, 0.16, 0.1);
        this.leftFrameGeometry = new THREE.BoxGeometry(this.height + 0.16, 0.16, 0.1);
        this.rightFrameGeometry = new THREE.BoxGeometry(this.height + 0.16, 0.16, 0.1);

        // Creating frame mesh objects with the loaded frame texture and material
        this.topFrame = new THREE.Mesh(this.topFrameGeometry, this.frameMaterial);
        this.bottomFrame = new THREE.Mesh(this.bottomFrameGeometry, this.frameMaterial);
        this.leftFrame = new THREE.Mesh(this.leftFrameGeometry, this.frameMaterial);
        this.rightFrame = new THREE.Mesh(this.rightFrameGeometry, this.frameMaterial);
    }

    // Method to position and orient the badge and its frame in the scene
    build() {
        // Rotate badge to face the correct direction in the scene
        this.badge.rotation.y = Math.PI / 2;
        // Position the badge on the wall or chosen location
        this.badge.position.set(-7.499, 3, 0);

        // Top frame positioned above the badge
        this.topFrame.rotation.y = Math.PI / 2;
        this.topFrame.position.set(-7.499, 3.75, 0);

        // Bottom frame positioned below the badge
        this.bottomFrame.rotation.y = Math.PI / 2;
        this.bottomFrame.position.set(-7.499, 2.25, 0);

        // Left frame positioned to the left of the badge
        this.leftFrame.rotation.y = Math.PI / 2;
        this.leftFrame.rotation.x = Math.PI / 2;
        this.leftFrame.position.set(-7.499, 3, 1);

        // Right frame positioned to the right of the badge
        this.rightFrame.rotation.y = Math.PI / 2;
        this.rightFrame.rotation.x = Math.PI / 2;
        this.rightFrame.position.set(-7.499, 3, -1);
    }
}
