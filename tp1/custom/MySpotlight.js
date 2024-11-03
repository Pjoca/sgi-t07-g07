import * as THREE from 'three';

export class MySpotlight {
    constructor() {
        // Base
        this.baseGeometry = new THREE.CylinderGeometry(0.175, 0.175, 0.08, 20);
        this.baseMaterial = new THREE.MeshStandardMaterial({color: "#CCCCCC"});
        this.base = new THREE.Mesh(this.baseGeometry, this.baseMaterial);

        // Curved pole
        this.curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(1, 1.945, -0.75),   // Starting point at base
            new THREE.Vector3(1, 2.2, -0.75),     // Control point for initial straight segment
            new THREE.Vector3(1.2, 2.6, -0.9),    // Control point for inward curve
            new THREE.Vector3(1, 3, -0.75)        // End point at the top of the pole
        );

        const tubeGeometry = new THREE.TubeGeometry(this.curve, 20, 0.03, 8, false);
        this.poleMaterial = new THREE.MeshStandardMaterial({color: 0xcccccc});
        this.pole = new THREE.Mesh(tubeGeometry, this.poleMaterial);

        // Spotlight cover (metallic part)
        this.coverGeometry = new THREE.CylinderGeometry(0.125, 0.075, 0.25, 20, 1, false);
        this.coverMaterial = new THREE.MeshStandardMaterial({color: 0x888888, metalness: 0.8, roughness: 0.3});
        this.cover = new THREE.Mesh(this.coverGeometry, this.coverMaterial);


        // Spotlight bulb (inside the cover)
        this.bulbGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        this.bulbMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xdddddd});
        this.bulb = new THREE.Mesh(this.bulbGeometry, this.bulbMaterial);

        // SpotLight directed at the cake
        this.intensity = 8;
        this.angle = Math.PI / 9;

        this.light = new THREE.SpotLight("#FFFFFF", this.intensity, 5, this.angle, 0.2, 2);
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;

        this.lightTarget = new THREE.Object3D();
        this.light.target = this.lightTarget;
    }

    build() {
        this.base.position.set(1, 1.945, -0.75);

        this.cover.position.set(1, 3.05, -0.75);
        this.cover.rotation.x = Math.PI / 2;
        this.cover.rotation.z = Math.PI / 2.9;
        this.cover.rotation.y = Math.PI / 4;

        this.bulb.position.set(0.97, 3.02, -0.72);

        this.light.position.set(0.97, 3.02, -0.72);
        this.lightTarget.position.set(0, 1.9, 0);
    }
}
