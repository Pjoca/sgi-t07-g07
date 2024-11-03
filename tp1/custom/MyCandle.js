import * as THREE from 'three';

export class MyCandle {
    constructor(cake) {
        // Candle properties, aligned with cake and table heights
        this.candleRadius = 0.02;      // Small radius for a thin candle
        this.candleHeight = 0.2;       // Height of the candle
        this.flameHeight = 0.1;        // Height of the flame above the candle
        this.cakeHeight = cake.cakeHeight;  // Use cake's height to position the candle correctly
        this.tableTopHeight = 1.85;    // Table height for accurate candle positioning

        // Candle Material for the wax
        this.candleMaterial = new THREE.MeshPhongMaterial({
            color: "#FFFFF0",        // Ivory color for a realistic wax appearance
            specular: "#DDDDDD",     // Slight specular highlight
            shininess: 30            // Moderate shininess for wax effect
        });

        // Flame Material for the bright orange flame
        this.flameMaterial = new THREE.MeshPhongMaterial({
            color: "#FFA500",        // Orange base color
            emissive: "#FF4500",     // Emissive red-orange for glow effect
            shininess: 10            // Low shininess for a soft flame effect
        });

        // Candle Geometry: a thin cylinder
        this.candleGeometry = new THREE.CylinderGeometry(
            this.candleRadius,
            this.candleRadius,
            this.candleHeight,
            32                // High radial segments for smoothness
        );

        // Flame Geometry: a cone shape for a classic flame
        this.flameGeometry = new THREE.ConeGeometry(
            this.candleRadius * 0.6, // Narrower radius than candle body
            this.flameHeight,
            16                       // Radial segments for smooth flame tip
        );

        // Create the candle and flame meshes using the defined geometries and materials
        this.candle = new THREE.Mesh(this.candleGeometry, this.candleMaterial);
        this.flame = new THREE.Mesh(this.flameGeometry, this.flameMaterial);

        // Add a light to simulate flame illumination
        this.light = new THREE.PointLight("#FFA500", 1, 1.75, 1); // Warm light with short range
        this.flame.add(this.light); // Light follows flame movement
    }

    // Method to position the candle and flame in the scene
    build() {
        // Set candle position on top of the cake
        this.candle.position.set(
            0.05,                                        // Slight offset on x-axis
            this.tableTopHeight + this.cakeHeight * 2,   // Position based on table and cake height
            -0.05                                        // Slight offset on z-axis
        );

        // Position the flame slightly above the candle top
        this.flame.position.set(
            0.05,
            this.tableTopHeight + this.cakeHeight * 2 + this.candleHeight * 0.75, // Flame sits above candle
            -0.05
        );
    }
}
