import * as THREE from 'three';

export class MyPaintings {
    constructor() {
        this.width = 1.5;
        this.height = 2.25;

        const textureLoader = new THREE.TextureLoader();
        this.firstTexture = textureLoader.load('images/pessoa.jpg');

        this.firstMaterial = new THREE.MeshPhongMaterial({
            map: this.firstTexture,
            shininess: 20
        });
        this.paintingGeometry = new THREE.PlaneGeometry(this.width, this.height);

        this.firstPainting = new THREE.Mesh(this.paintingGeometry, this.firstMaterial);

        this.secondTexture = textureLoader.load('images/mendes.jpg');

        this.secondMaterial = new THREE.MeshPhongMaterial({
            map: this.secondTexture,
            shininess: 20
        });

        this.secondPainting = new THREE.Mesh(this.paintingGeometry, this.secondMaterial);

        this.frameTexture = textureLoader.load('images/frame.jpg');

        this.frameMaterial = new THREE.MeshPhongMaterial({
            map: this.frameTexture,
            specular: "#394143",
            shininess: 40
        });

        this.topFrameGeometry = new THREE.BoxGeometry(this.width, 0.16, 0.1);
        this.bottomFrameGeometry = new THREE.BoxGeometry(this.width, 0.16, 0.1);
        this.leftFrameGeometry = new THREE.BoxGeometry(this.height + 0.31, 0.16, 0.1);
        this.rightFrameGeometry = new THREE.BoxGeometry(this.height + 0.31, 0.16, 0.1);

        this.windowTopFrame = new THREE.Mesh(this.topFrameGeometry, this.frameMaterial);
        this.windowBottomFrame = new THREE.Mesh(this.bottomFrameGeometry, this.frameMaterial);
        this.windowLeftFrame = new THREE.Mesh(this.leftFrameGeometry, this.frameMaterial);
        this.windowRightFrame = new THREE.Mesh(this.rightFrameGeometry, this.frameMaterial);
        this.windowTopFrame2 = new THREE.Mesh(this.topFrameGeometry, this.frameMaterial);
        this.windowBottomFrame2 = new THREE.Mesh(this.bottomFrameGeometry, this.frameMaterial);
        this.windowLeftFrame2 = new THREE.Mesh(this.leftFrameGeometry, this.frameMaterial);
        this.windowRightFrame2 = new THREE.Mesh(this.rightFrameGeometry, this.frameMaterial);
    }

    build() {
        this.firstPainting.position.set(2, 3, -4.99);
        this.secondPainting.position.set(-2, 3, -4.99);

        this.windowTopFrame.position.set(-2, 4.20, -4.99);
        this.windowBottomFrame.position.set(-2, 1.80, -4.99);
        this.windowLeftFrame.position.set(-2.825, 3, -4.99);
        this.windowLeftFrame.rotation.z = -Math.PI / 2;
        this.windowRightFrame.position.set(-1.175, 3, -4.99);
        this.windowRightFrame.rotation.z = -Math.PI / 2;

        this.windowTopFrame2.position.set(2, 4.20, -4.99);
        this.windowBottomFrame2.position.set(2, 1.80, -4.99);
        this.windowLeftFrame2.position.set(2.825, 3, -4.99);
        this.windowLeftFrame2.rotation.z = -Math.PI / 2;
        this.windowRightFrame2.position.set(1.175, 3, -4.99);
        this.windowRightFrame2.rotation.z = -Math.PI / 2;
    }
}
