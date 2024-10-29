import * as THREE from 'three';

export class MyLandscape {
    constructor() {
        this.width = 4.5;
        this.height = 3;

        const landscapeTextureLoader = new THREE.TextureLoader();
        this.landscapeTexture = landscapeTextureLoader.load('images/landscape.png');

        this.landscapeMaterial = new THREE.MeshPhongMaterial({
            map: this.landscapeTexture,
            shininess: 20
        });
        this.landscapeGeometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
        this.landscape = new THREE.Mesh(this.landscapeGeometry, this.landscapeMaterial);

        const windowFrameTextureLoader = new THREE.TextureLoader();
        this.windowFrameTexture = windowFrameTextureLoader.load('images/frame.jpg');

        this.windowFrameMaterial = new THREE.MeshPhongMaterial({
           map: this.windowFrameTexture,
           specular: "#394143",
           shininess: 40
        });

        this.windowTopFrameGeometry = new THREE.BoxGeometry(this.width, 0.2, 0.1);
        this.windowTopFrame = new THREE.Mesh(this.windowTopFrameGeometry, this.windowFrameMaterial);

        this.windowBottomFrameGeometry = new THREE.BoxGeometry(this.width, 0.2, 0.1);
        this.windowBottomFrame = new THREE.Mesh(this.windowBottomFrameGeometry, this.windowFrameMaterial);

        this.windowLeftFrameGeometry = new THREE.BoxGeometry(this.height + 0.2, 0.2, 0.1);
        this.windowLeftFrame = new THREE.Mesh(this.windowLeftFrameGeometry, this.windowFrameMaterial);

        this.windowRightFrameGeometry = new THREE.BoxGeometry(this.height + 0.2, 0.2, 0.1);
        this.windowRightFrame = new THREE.Mesh(this.windowRightFrameGeometry, this.windowFrameMaterial);

        this.windowMidVerticalFrameGeometry = new THREE.BoxGeometry(this.height, 0.12, 0.1);
        this.windowMidVerticalFrame = new THREE.Mesh(this.windowMidVerticalFrameGeometry, this.windowFrameMaterial);

        this.windowMidHorizontalFrameGeometry = new THREE.BoxGeometry(this.width, 0.12, 0.1);
        this.windowMidHorizontalFrame = new THREE.Mesh(this.windowMidHorizontalFrameGeometry, this.windowFrameMaterial);
    }

    build() {
        this.landscape.position.set(7.49, 3, 0);
        this.landscape.rotation.y = -Math.PI / 2;

        this.windowTopFrame.position.set(7.49, 4.5, 0);
        this.windowTopFrame.rotation.y = -Math.PI / 2;

        this.windowBottomFrame.position.set(7.49, 1.5, 0);
        this.windowBottomFrame.rotation.y = -Math.PI / 2;

        this.windowLeftFrame.position.set(7.49, 3, -2.35);
        this.windowLeftFrame.rotation.y = -Math.PI / 2;
        this.windowLeftFrame.rotation.z = Math.PI / 2;

        this.windowRightFrame.position.set(7.49, 3, 2.35);
        this.windowRightFrame.rotation.y = -Math.PI / 2;
        this.windowRightFrame.rotation.z = Math.PI / 2;

        this.windowMidVerticalFrame.position.set(7.49, 3, 0);
        this.windowMidVerticalFrame.rotation.y = -Math.PI / 2;
        this.windowMidVerticalFrame.rotation.z = Math.PI / 2;

        this.windowMidHorizontalFrame.position.set(7.49, 3, 0);
        this.windowMidHorizontalFrame.rotation.y = -Math.PI / 2;
    }
}
