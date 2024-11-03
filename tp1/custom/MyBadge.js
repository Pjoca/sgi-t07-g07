import * as THREE from 'three';

export class MyBadge {
    constructor() {
        this.width = 2;
        this.height = 1.5;

        const textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load('textures/galatasaray.jpg');

        this.material = new THREE.MeshPhongMaterial({
            map: this.texture,
            shininess: 20
        });
        this.badgeGeometry = new THREE.PlaneGeometry(this.width, this.height);

        this.badge = new THREE.Mesh(this.badgeGeometry, this.material);

        this.frameTexture = textureLoader.load('textures/frame.jpg');

        this.frameMaterial = new THREE.MeshPhongMaterial({
            map: this.frameTexture,
            specular: "#394143",
            shininess: 40
        });

        this.topFrameGeometry = new THREE.BoxGeometry(this.width, 0.16, 0.1);
        this.bottomFrameGeometry = new THREE.BoxGeometry(this.width, 0.16, 0.1);
        this.leftFrameGeometry = new THREE.BoxGeometry(this.height + 0.16, 0.16, 0.1);
        this.rightFrameGeometry = new THREE.BoxGeometry(this.height + 0.16, 0.16, 0.1);

        this.topFrame = new THREE.Mesh(this.topFrameGeometry, this.frameMaterial);
        this.bottomFrame = new THREE.Mesh(this.bottomFrameGeometry, this.frameMaterial);
        this.leftFrame = new THREE.Mesh(this.leftFrameGeometry, this.frameMaterial);
        this.rightFrame = new THREE.Mesh(this.rightFrameGeometry, this.frameMaterial);
    }

    build() {
        this.badge.rotation.y = Math.PI/2;
        this.badge.position.set(-7.499, 3, 0);

        this.topFrame.rotation.y = Math.PI/2;
        this.topFrame.position.set(-7.499, 3.75, 0);
        this.bottomFrame.rotation.y = Math.PI/2;
        this.bottomFrame.position.set(-7.499, 2.25, 0);
        this.leftFrame.rotation.y = Math.PI/2;
        this.leftFrame.rotation.x = Math.PI/2;
        this.leftFrame.position.set(-7.499, 3, 1);
        this.rightFrame.rotation.y = Math.PI/2;
        this.rightFrame.rotation.x = Math.PI/2;
        this.rightFrame.position.set(-7.499, 3, -1);
    }
}
