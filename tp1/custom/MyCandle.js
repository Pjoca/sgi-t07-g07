import * as THREE from 'three';

export class MyCandle {
    constructor(cake) {
        this.candleRadius = 0.02;   // Thin candle
        this.candleHeight = 0.2;    // Candle height
        this.flameHeight = 0.1;     // Flame height (small)
        this.cakeHeight = cake.cakeHeight; // To position the candle on top of the cake
        this.tableTopHeight = 2.2; // To ensure proper positioning on the table

        // Candle Material
        this.candleMaterial = new THREE.MeshPhongMaterial({
            color: "#FFFFF0",   // Ivory/White color for the candle
            specular: "#DDDDDD",
            shininess: 30
        });

        // Flame Material
        this.flameMaterial = new THREE.MeshPhongMaterial({
            color: "#FFA500",   // Orange color for the flame
            emissive: "#FF4500", // Glowing effect for the flame
            shininess: 10
        });

        // Candle Geometry (Cylinder)
        const candleGeometry = new THREE.CylinderGeometry(
            this.candleRadius,   // Top radius
            this.candleRadius,   // Bottom radius
            this.candleHeight,   // Height of the candle
            32                  // Radial segments for smoothness
        );

        // Flame Geometry (Cone)
        const flameGeometry = new THREE.ConeGeometry(
            this.candleRadius * 0.6,  // Radius of the flame (smaller than candle)
            this.flameHeight,         // Height of the flame
            16                        // Radial segments for smoothness
        );

        // Create the candle and flame meshes
        this.candle = new THREE.Mesh(candleGeometry, this.candleMaterial);
        this.flame = new THREE.Mesh(flameGeometry, this.flameMaterial);
    }

    build() {
        this.candle.position.set(0.05, this.tableTopHeight + this.cakeHeight*2, -0.05);
        this.flame.position.set(0.05, this.tableTopHeight + this.cakeHeight*2 + this.candleHeight*0.75, -0.05);
    }
}
