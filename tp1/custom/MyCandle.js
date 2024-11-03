import * as THREE from 'three';

export class MyCandle {
    constructor(cake) {
        this.candleRadius = 0.02;
        this.candleHeight = 0.2;
        this.flameHeight = 0.1;
        this.cakeHeight = cake.cakeHeight;
        this.tableTopHeight = 1.85;

        // Candle Material
        this.candleMaterial = new THREE.MeshPhongMaterial({
            color: "#FFFFF0",
            specular: "#DDDDDD",
            shininess: 30
        });

        // Flame Material
        this.flameMaterial = new THREE.MeshPhongMaterial({
            color: "#FFA500",
            emissive: "#FF4500",
            shininess: 10
        });

        // Candle Geometry (Cylinder)
        this.candleGeometry = new THREE.CylinderGeometry(
            this.candleRadius,
            this.candleRadius,
            this.candleHeight,
            32
        );

        // Flame Geometry (Cone)
        this.flameGeometry = new THREE.ConeGeometry(
            this.candleRadius * 0.6,
            this.flameHeight,
            16
        );

        // Create the candle and flame meshes
        this.candle = new THREE.Mesh(this.candleGeometry, this.candleMaterial);
        this.flame = new THREE.Mesh(this.flameGeometry, this.flameMaterial);

        this.light = new THREE.PointLight("#FFA500", 1, 1.75, 1);
        this.flame.add(this.light);
    }

    build() {
        this.candle.position.set(0.05, this.tableTopHeight + this.cakeHeight*2, -0.05);
        this.flame.position.set(0.05, this.tableTopHeight + this.cakeHeight*2 + this.candleHeight*0.75, -0.05);
    }
}
