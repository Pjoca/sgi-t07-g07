import * as THREE from 'three';

export class MySpring {
    constructor() {
        this.springRadius = 0.1;
        this.springLength = 0.6;

        this.coils = 5;
        this.coilRadius = 0.04;

        this.material = new THREE.MeshPhongMaterial({
            color: "#FFFDDD",
            specular: "#FFFFFF",
            shininess: 100
        });

        this.points = [];
        for (let t = 0; t <= 1; t += 0.02) {
            const angle = this.coils * Math.PI * 2 * t;
            this.points.push(
                new THREE.Vector3(Math.cos(angle) * this.springRadius, this.springLength * t, Math.sin(angle) * this.springRadius)
            );
        }

        // Spring
        this.springCurve = new THREE.CatmullRomCurve3(this.points);
        this.springGeometry = new THREE.TubeGeometry(this.springCurve, 100, this.coilRadius, 8, false);
        this.springMesh = new THREE.Mesh(this.springGeometry, this.material);
        this.springMesh.receiveShadow = true;
        this.springMesh.castShadow = true;

        // Start and end caps for the spring
        this.capGeometry = new THREE.SphereGeometry(this.coilRadius-0.001, 20, 20);
        this.startCap = new THREE.Mesh(this.capGeometry, this.material);
        this.endCap = new THREE.Mesh(this.capGeometry, this.material);
        this.springMesh.add(this.startCap);
        this.springMesh.add(this.endCap);
    }

    build() {
        this.springMesh.position.set(1.2, 2.04, 1.2);
        this.springMesh.rotation.z = -Math.PI/2;
        this.springMesh.rotation.y = Math.PI/4;
        this.startCap.position.copy(this.points[0]);
        this.endCap.position.copy(this.points[this.points.length - 1]);
    }
}
