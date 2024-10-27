import * as THREE from 'three';

export class MyWalls {
    constructor() {
        this.wallMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#333333",
            shininess: 30
        });
        this.wallThickness = 0.2;
        this.wallHeight = 5.5;
        this.wallLength1 = 10;
        this.wallLength2 = 15;

        // Store wall meshes for easier management
        this.walls = [];

        // Wall 1
        const wall1Geometry = new THREE.BoxGeometry(this.wallLength2 + this.wallThickness, this.wallHeight, this.wallThickness);
        this.wall1 = new THREE.Mesh(wall1Geometry, this.wallMaterial);
        this.walls.push(this.wall1);

        // Wall 2
        const wall2Geometry = new THREE.BoxGeometry(this.wallLength2 + this.wallThickness, this.wallHeight, this.wallThickness);
        this.wall2 = new THREE.Mesh(wall2Geometry, this.wallMaterial);
        this.walls.push(this.wall2);

        // Wall 3
        const wall3Geometry = new THREE.BoxGeometry(this.wallThickness, this.wallHeight, this.wallLength1);
        this.wall3 = new THREE.Mesh(wall3Geometry, this.wallMaterial);
        this.walls.push(this.wall3);

        // Wall 4
        const wall4Geometry = new THREE.BoxGeometry(this.wallThickness, this.wallHeight, this.wallLength1 + this.wallThickness);
        this.wall4 = new THREE.Mesh(wall4Geometry, this.wallMaterial);
        this.walls.push(this.wall4);

        this.scaleWallsParts(1, 1, 1);
        
    }

    scaleWallsParts(scaleX, scaleY, scaleZ) {
        this.walls.forEach(part => {
            part.scale.set(scaleX, scaleY, scaleZ); // Scale each part individually
        });
    }

    build() {
        this.wall1.position.set(0, this.wallHeight / 2, this.wallLength1 / 2);
        this.wall2.position.set(0, this.wallHeight / 2, -this.wallLength1 / 2);
        this.wall3.position.set(-this.wallLength2 / 2, this.wallHeight / 2, 0);
        this.wall4.position.set(this.wallLength2 / 2, this.wallHeight / 2, 0);
    }
}
