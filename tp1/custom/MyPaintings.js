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

        this.topFrame = new THREE.Mesh(this.topFrameGeometry, this.frameMaterial);
        this.bottomFrame = new THREE.Mesh(this.bottomFrameGeometry, this.frameMaterial);
        this.leftFrame = new THREE.Mesh(this.leftFrameGeometry, this.frameMaterial);
        this.rightFrame = new THREE.Mesh(this.rightFrameGeometry, this.frameMaterial);
        this.topFrame2 = new THREE.Mesh(this.topFrameGeometry, this.frameMaterial);
        this.bottomFrame2 = new THREE.Mesh(this.bottomFrameGeometry, this.frameMaterial);
        this.leftFrame2 = new THREE.Mesh(this.leftFrameGeometry, this.frameMaterial);
        this.rightFrame2 = new THREE.Mesh(this.rightFrameGeometry, this.frameMaterial);
    }

    build() {
        this.firstPainting.position.set(2, 3, 4.995);
        this.firstPainting.rotation.y = -Math.PI;
        this.secondPainting.position.set(-2, 3, 4.995);
        this.secondPainting.rotation.y = -Math.PI;

        this.topFrame.position.set(-2, 4.20, 4.995);
        this.bottomFrame.position.set(-2, 1.80, 4.995);
        this.leftFrame.position.set(-2.825, 3, 4.995);
        this.leftFrame.rotation.z = -Math.PI / 2;
        this.rightFrame.position.set(-1.175, 3, 4.995);
        this.rightFrame.rotation.z = -Math.PI / 2;

        this.topFrame2.position.set(2, 4.20, 4.995);
        this.bottomFrame2.position.set(2, 1.80, 4.995);
        this.leftFrame2.position.set(2.825, 3, 4.995);
        this.leftFrame2.rotation.z = -Math.PI / 2;
        this.rightFrame2.position.set(1.175, 3, 4.995);
        this.rightFrame2.rotation.z = -Math.PI / 2;
    }
}
