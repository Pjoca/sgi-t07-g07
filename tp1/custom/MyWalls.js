import * as THREE from 'three';

export class MyWalls {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();

        this.wallTexture = this.textureLoader.load('images/wall.jpg');
        this.wallTexture.wrapS = THREE.RepeatWrapping;
        this.wallTexture.wrapT = THREE.RepeatWrapping;
        this.wallTexture.repeat.set(4, 2);

        this.wallBumpMap = this.wallTexture;
        this.wallBumpMap.repeat.set(4, 2);

        this.wallMaterial = new THREE.MeshStandardMaterial({
            map: this.wallTexture,
            bumpMap: this.wallBumpMap,
            bumpScale: 0.1
        });

        this.wallHeight = 6;
        this.wallLength1 = 10;
        this.wallLength2 = 15;

        this.walls = [];

        // Wall 1
        const wall1Geometry = new THREE.PlaneGeometry(this.wallLength2, this.wallHeight, 1, 1);
        this.wall1 = new THREE.Mesh(wall1Geometry, this.wallMaterial);
        this.walls.push(this.wall1);

        // Wall 2
        const wall2Geometry = new THREE.PlaneGeometry(this.wallLength2, this.wallHeight, 1, 1);
        this.wall2 = new THREE.Mesh(wall2Geometry, this.wallMaterial);
        this.walls.push(this.wall2);

        // Wall 3
        const wall3Geometry = new THREE.PlaneGeometry(this.wallLength1, this.wallHeight, 1, 1);
        this.wall3 = new THREE.Mesh(wall3Geometry, this.wallMaterial);
        this.walls.push(this.wall3);

        // Wall 4
        const wall4Geometry = new THREE.PlaneGeometry(this.wallLength1, this.wallHeight, 1, 1);
        this.wall4 = new THREE.Mesh(wall4Geometry, this.wallMaterial);
        this.walls.push(this.wall4);

        this.scaleWallsParts(1, 1, 1);
    }

    scaleWallsParts(scaleX, scaleY, scaleZ) {
        this.walls.forEach(part => {
            part.scale.set(scaleX, scaleY, scaleZ);
        });
    }

    build() {
        this.wall1.position.set(0, this.wallHeight / 2, this.wallLength1 / 2);
        this.wall1.rotation.y = Math.PI;
        this.wall2.position.set(0, this.wallHeight / 2, -this.wallLength1 / 2);
        this.wall3.position.set(-this.wallLength2 / 2, this.wallHeight / 2, 0);
        this.wall3.rotation.y = Math.PI/2;
        this.wall4.position.set(this.wallLength2 / 2, this.wallHeight / 2, 0);
        this.wall4.rotation.y = -Math.PI/2;
    }
}
