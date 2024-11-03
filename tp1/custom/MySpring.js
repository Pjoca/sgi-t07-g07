import * as THREE from 'three';

export class MySpring {
    constructor() {
        // Parameters for the spring dimensions
        this.springRadius = 0.1; // Radius of the spring coil
        this.springLength = 0.6;  // Total length of the spring

        // Coil specifications
        this.coils = 5;           // Number of coils in the spring
        this.coilRadius = 0.04;   // Radius of the spring coil

        // Material for the spring
        this.material = new THREE.MeshPhongMaterial({
            color: "#FFFDDD",    // Color of the spring
            specular: "#FFFFFF", // Specular highlight color
            shininess: 100       // Shininess of the material
        });

        // Array to hold the points that define the spring shape
        this.points = [];
        for (let t = 0; t <= 1; t += 0.02) { // Generate points along the spring
            const angle = this.coils * Math.PI * 2 * t; // Calculate angle for coil position
            this.points.push(
                new THREE.Vector3(
                    Math.cos(angle) * this.springRadius, // X position based on angle and radius
                    this.springLength * t,                // Y position based on length
                    Math.sin(angle) * this.springRadius   // Z position based on angle and radius
                )
            );
        }

        // Create the spring curve using the points
        this.springCurve = new THREE.CatmullRomCurve3(this.points); // Create a smooth curve
        this.springGeometry = new THREE.TubeGeometry(this.springCurve, 100, this.coilRadius, 8, false); // Geometry for the spring
        this.springMesh = new THREE.Mesh(this.springGeometry, this.material); // Create the spring mesh
        this.springMesh.receiveShadow = true; // Enable shadow receiving
        this.springMesh.castShadow = true;    // Enable shadow casting

        // Start and end caps for the spring
        this.capGeometry = new THREE.SphereGeometry(this.coilRadius - 0.001, 20, 20); // Sphere geometry for caps
        this.startCap = new THREE.Mesh(this.capGeometry, this.material); // Start cap mesh
        this.endCap = new THREE.Mesh(this.capGeometry, this.material);   // End cap mesh
        
        // Add caps to the spring mesh
        this.springMesh.add(this.startCap);
        this.springMesh.add(this.endCap);
    }

    // Method to build and position the spring in the scene
    build() {
        this.springMesh.position.set(1.2, 2.04, 1.2); // Position the spring mesh in the scene
        this.springMesh.rotation.z = -Math.PI / 2;   // Rotate the spring around the Z-axis
        this.springMesh.rotation.y = Math.PI / 4;    // Rotate the spring around the Y-axis
        
        // Position the start and end caps at the respective points
        this.startCap.position.copy(this.points[0]); // Start cap at the beginning of the spring
        this.endCap.position.copy(this.points[this.points.length - 1]); // End cap at the end of the spring
    }
}
