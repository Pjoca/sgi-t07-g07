import * as THREE from 'three';

export class MyBeetle {
    constructor() {
        // Define control points for various curves that form the beetle's shape
        this.points = [
            [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0.625, 0),
                new THREE.Vector3(0.75, 0.625, 0),
                new THREE.Vector3(0.75, 0, 0),
            ],
            [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(1, 1, 0),
            ],
            [
                new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(1.5, 1, 0),
                new THREE.Vector3(1.5, 0.625, 0),
            ],
            [
                new THREE.Vector3(1.5, 0.625, 0),
                new THREE.Vector3(2, 0.625, 0),
                new THREE.Vector3(2, 0, 0),
            ]
        ];

        // Set material color for the beetle's lines (using an off-white tone)
        this.curveMaterial = new THREE.LineBasicMaterial({
            color: "#FFFDD0" // Pale cream color for aesthetic contrast
        });

        // Create a cubic Bezier curve and corresponding geometry for lineA and lineB
        this.cubicCurve = new THREE.CubicBezierCurve3(this.points[0][0], this.points[0][1], this.points[0][2], this.points[0][3]);
        this.cubicCurveGeometry = new THREE.BufferGeometry().setFromPoints(this.cubicCurve.getPoints(20));
        this.lineA = new THREE.Line(this.cubicCurveGeometry, this.curveMaterial);
        this.lineB = new THREE.Line(this.cubicCurveGeometry, this.curveMaterial); // Duplicate line for symmetry

        // Define quadratic Bezier curves for other sections of the beetle
        this.quadraticCurveC = new THREE.QuadraticBezierCurve3(this.points[1][0], this.points[1][1], this.points[1][2]);
        this.quadraticCurveGeometryC = new THREE.BufferGeometry().setFromPoints(this.quadraticCurveC.getPoints(20));
        this.lineC = new THREE.Line(this.quadraticCurveGeometryC, this.curveMaterial);

        this.quadraticCurveD = new THREE.QuadraticBezierCurve3(this.points[2][0], this.points[2][1], this.points[2][2]);
        this.quadraticCurveGeometryD = new THREE.BufferGeometry().setFromPoints(this.quadraticCurveD.getPoints(20));
        this.lineD = new THREE.Line(this.quadraticCurveGeometryD, this.curveMaterial);

        this.quadraticCurveE = new THREE.QuadraticBezierCurve3(this.points[3][0], this.points[3][1], this.points[3][2]);
        this.quadraticCurveGeometryE = new THREE.BufferGeometry().setFromPoints(this.quadraticCurveE.getPoints(20));
        this.lineE = new THREE.Line(this.quadraticCurveGeometryE, this.curveMaterial);

        // Load the main texture for the beetle's image
        this.textureLoader = new THREE.TextureLoader();
        this.texture = this.textureLoader.load('textures/beetle.jpg');
        this.paintingMaterial = new THREE.MeshPhongMaterial({
            map: this.texture,
            shininess: 20 // Moderate shininess for the painting surface
        });
        // Define the geometry and mesh for the painting
        this.width = 2.8;
        this.height = 1.575;
        this.paintingGeometry = new THREE.PlaneGeometry(this.width, this.height);
        this.painting = new THREE.Mesh(this.paintingGeometry, this.paintingMaterial);

        // Load texture and create material for the frame surrounding the painting
        this.frameTexture = this.textureLoader.load('textures/frame.jpg');
        this.frameMaterial = new THREE.MeshPhongMaterial({
            map: this.frameTexture,
            specular: "#394143", // Specular color for a reflective effect
            shininess: 40 // Higher shininess for a polished wood look
        });

        // Define geometry for each part of the frame
        this.topFrameGeometry = new THREE.BoxGeometry(this.width, 0.16, 0.1);
        this.bottomFrameGeometry = new THREE.BoxGeometry(this.width, 0.16, 0.1);
        this.leftFrameGeometry = new THREE.BoxGeometry(this.height + 0.31, 0.16, 0.1);
        this.rightFrameGeometry = new THREE.BoxGeometry(this.height + 0.31, 0.16, 0.1);

        // Create mesh objects for each part of the frame
        this.topFrame = new THREE.Mesh(this.topFrameGeometry, this.frameMaterial);
        this.bottomFrame = new THREE.Mesh(this.bottomFrameGeometry, this.frameMaterial);
        this.leftFrame = new THREE.Mesh(this.leftFrameGeometry, this.frameMaterial);
        this.rightFrame = new THREE.Mesh(this.rightFrameGeometry, this.frameMaterial);
    }

    // Method to position and arrange the beetle's lines, painting, and frame in the scene
    build() {
        // Position beetle curves around the painting to form a decorative shape
        this.lineA.position.set(-1, 2.5, -4.99);
        this.lineB.position.set(0.25, 2.5, -4.99);
        this.lineC.position.set(-1, 2.5, -4.99);
        this.lineD.position.set(-1, 2.5, -4.99);
        this.lineE.position.set(-1, 2.5, -4.99);

        // Position the painting itself at a slight offset from the frame for visual depth
        this.painting.position.set(0, 3, -4.995);

        // Arrange each frame component around the painting
        this.topFrame.position.set(0, 3.8625, -4.995);
        this.bottomFrame.position.set(0, 2.1375, -4.995);
        this.leftFrame.position.set(this.width / 2, 3, -4.995);
        this.leftFrame.rotation.z = -Math.PI / 2; // Rotate for vertical alignment
        this.rightFrame.position.set(-this.width / 2, 3, -4.995);
        this.rightFrame.rotation.z = -Math.PI / 2; // Rotate for vertical alignment
    }
}
