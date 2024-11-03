import * as THREE from 'three';

export class MySpotlight {
    constructor() {
        // Base of the spotlight
        this.baseGeometry = new THREE.CylinderGeometry(0.175, 0.175, 0.08, 20); // Geometry for the base cylinder
        this.baseMaterial = new THREE.MeshStandardMaterial({ color: "#CCCCCC" }); // Material for the base
        this.base = new THREE.Mesh(this.baseGeometry, this.baseMaterial); // Create the base mesh
        this.base.receiveShadow = true; // Enable receiving shadows
        this.base.castShadow = true; // Enable casting shadows

        // Curved pole for the spotlight
        this.curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(1, 1.945, -0.75),   // Starting point at the base
            new THREE.Vector3(1, 2.2, -0.75),     // Control point for the initial straight segment
            new THREE.Vector3(1.2, 2.6, -0.9),    // Control point for the inward curve
            new THREE.Vector3(1, 3, -0.75)        // End point at the top of the pole
        );

        // Create the tube geometry based on the cubic Bézier curve
        const tubeGeometry = new THREE.TubeGeometry(this.curve, 20, 0.03, 8, false); // 20 segments for the tube
        this.poleMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc }); // Material for the pole
        this.pole = new THREE.Mesh(tubeGeometry, this.poleMaterial); // Create the pole mesh
        this.pole.receiveShadow = true; // Enable receiving shadows
        this.pole.castShadow = true; // Enable casting shadows

        // Spotlight cover (the metallic part)
        this.coverGeometry = new THREE.CylinderGeometry(0.125, 0.075, 0.25, 20, 1, false); // Geometry for the cover
        this.coverMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 }); // Material with metallic properties
        this.cover = new THREE.Mesh(this.coverGeometry, this.coverMaterial); // Create the cover mesh
        this.cover.receiveShadow = true; // Enable receiving shadows
        this.cover.castShadow = true; // Enable casting shadows

        // Spotlight bulb (located inside the cover)
        this.bulbGeometry = new THREE.SphereGeometry(0.1, 16, 16); // Geometry for the bulb
        this.bulbMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xdddddd }); // White color with emissive properties
        this.bulb = new THREE.Mesh(this.bulbGeometry, this.bulbMaterial); // Create the bulb mesh

        // Configure the SpotLight
        this.intensity = 8; // Light intensity
        this.angle = Math.PI / 9; // Angle of the spotlight beam

        // Create the spotlight
        this.light = new THREE.SpotLight("#FFFFFF", this.intensity, 5, this.angle, 0.2, 2); // Set up the spotlight
        this.light.castShadow = true; // Enable shadows for the light
        this.light.shadow.mapSize.width = 2048; // Set shadow map size for better quality
        this.light.shadow.mapSize.height = 2048;

        // Target object for the light to focus on
        this.lightTarget = new THREE.Object3D(); // Create a target object
        this.light.target = this.lightTarget; // Set the target for the spotlight
    }

    // Method to position and rotate the components of the spotlight
    build() {
        // Position the base at its designated spot
        this.base.position.set(1, 1.945, -0.75);

        // Position and rotate the cover
        this.cover.position.set(1, 3.05, -0.75);
        this.cover.rotation.x = Math.PI / 2; // Rotate cover to be flat
        this.cover.rotation.z = Math.PI / 2.9; // Slightly tilt the cover
        this.cover.rotation.y = Math.PI / 4; // Rotate the cover

        // Position the bulb inside the cover
        this.bulb.position.set(0.97, 3.02, -0.72);

        // Position the spotlight and its target
        this.light.position.set(0.97, 3.02, -0.72); // Light position matches bulb
        this.lightTarget.position.set(0, 1.9, 0); // Position the light target at the desired spot
    }
}
