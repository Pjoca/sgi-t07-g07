import * as THREE from 'three';

export class MyChair {
    constructor() {
        // Load wood texture for the chair
        this.textureLoader = new THREE.TextureLoader();
        this.chairTexture = this.textureLoader.load('textures/table.jpg');

        // Define the material for the chair using the wood texture, with moderate shininess
        this.material = new THREE.MeshPhongMaterial({
            map: this.chairTexture,
            shininess: 20
        });

        // Define geometry for the chair legs (each a rectangular prism)
        const legGeometry = new THREE.BoxGeometry(0.12, 1.4, 0.12);

        // Create each leg of the chair and enable shadows for more realism
        this.leg1 = new THREE.Mesh(legGeometry, this.material);
        this.leg1.receiveShadow = true;
        this.leg1.castShadow = true;

        this.leg2 = new THREE.Mesh(legGeometry, this.material);
        this.leg2.receiveShadow = true;
        this.leg2.castShadow = true;

        this.leg3 = new THREE.Mesh(legGeometry, this.material);
        this.leg3.receiveShadow = true;
        this.leg3.castShadow = true;

        this.leg4 = new THREE.Mesh(legGeometry, this.material);
        this.leg4.receiveShadow = true;
        this.leg4.castShadow = true;

        // Define geometry for auxiliary leg supports (slightly smaller and narrower)
        const auxiliarLegGeometry = new THREE.BoxGeometry(0.09, 1.2, 0.12);

        // Create auxiliary supports for leg stability and enable shadows
        this.auxiliarLeg1 = new THREE.Mesh(auxiliarLegGeometry, this.material);
        this.auxiliarLeg1.receiveShadow = true;
        this.auxiliarLeg1.castShadow = true;

        this.auxiliarLeg2 = new THREE.Mesh(auxiliarLegGeometry, this.material);
        this.auxiliarLeg2.receiveShadow = true;
        this.auxiliarLeg2.castShadow = true;

        this.auxiliarLeg3 = new THREE.Mesh(auxiliarLegGeometry, this.material);
        this.auxiliarLeg3.receiveShadow = true;
        this.auxiliarLeg3.castShadow = true;

        this.auxiliarLeg4 = new THREE.Mesh(auxiliarLegGeometry, this.material);
        this.auxiliarLeg4.receiveShadow = true;
        this.auxiliarLeg4.castShadow = true;

        this.auxiliarLeg5 = new THREE.Mesh(auxiliarLegGeometry, this.material);
        this.auxiliarLeg5.receiveShadow = true;
        this.auxiliarLeg5.castShadow = true;

        this.auxiliarLeg6 = new THREE.Mesh(auxiliarLegGeometry, this.material);
        this.auxiliarLeg6.receiveShadow = true;
        this.auxiliarLeg6.castShadow = true;

        // Define the geometry for the chair seat
        const sitGeometry = new THREE.BoxGeometry(1.32, 0.12, 1.32);

        // Create the seat mesh and enable shadows
        this.sit = new THREE.Mesh(sitGeometry, this.material);
        this.sit.receiveShadow = true;
        this.sit.castShadow = true;

        // Define geometry for vertical supports of the backrest
        const auxiliarBackrestGeometry1 = new THREE.BoxGeometry(0.12, 2, 0.12);

        // Create vertical backrest supports and enable shadows
        this.auxiliarBackrest1 = new THREE.Mesh(auxiliarBackrestGeometry1, this.material);
        this.auxiliarBackrest1.receiveShadow = true;
        this.auxiliarBackrest1.castShadow = true;

        this.auxiliarBackrest2 = new THREE.Mesh(auxiliarBackrestGeometry1, this.material);
        this.auxiliarBackrest2.receiveShadow = true;
        this.auxiliarBackrest2.castShadow = true;

        // Define geometry for horizontal crossbars in the backrest
        const auxiliarBackrestGeometry2 = new THREE.BoxGeometry(0.15, 1.2, 0.09);

        // Create the crossbars for the backrest and enable shadows
        this.auxiliarBackrest3 = new THREE.Mesh(auxiliarBackrestGeometry2, this.material);
        this.auxiliarBackrest3.receiveShadow = true;
        this.auxiliarBackrest3.castShadow = true;

        this.auxiliarBackrest4 = new THREE.Mesh(auxiliarBackrestGeometry2, this.material);
        this.auxiliarBackrest4.receiveShadow = true;
        this.auxiliarBackrest4.castShadow = true;

        this.auxiliarBackrest5 = new THREE.Mesh(auxiliarBackrestGeometry2, this.material);
        this.auxiliarBackrest5.receiveShadow = true;
        this.auxiliarBackrest5.castShadow = true;
    }

    build() {
        // Position the main chair legs at each corner of the seat
        this.leg1.position.set(0.6, 0.6, 1.6);
        this.leg2.position.set(-0.6, 0.6, 1.6);
        this.leg3.position.set(0.6, 0.6, 2.8);
        this.leg4.position.set(-0.6, 0.6, 2.8);

        // Rotate auxiliary legs to form horizontal bars between legs
        this.auxiliarLeg1.rotation.x = Math.PI / 2;
        this.auxiliarLeg2.rotation.x = Math.PI / 2;
        this.auxiliarLeg3.rotation.x = Math.PI / 2;
        this.auxiliarLeg4.rotation.x = Math.PI / 2;

        // Position auxiliary horizontal supports across the width and depth of the chair legs
        this.auxiliarLeg1.position.set(-0.6, 0.4, 2.2);
        this.auxiliarLeg2.position.set(0.6, 0.4, 2.2);
        this.auxiliarLeg3.position.set(-0.6, 1.16, 2.2);
        this.auxiliarLeg4.position.set(0.6, 1.16, 2.2);

        // Rotate and position auxiliary leg crossbars connecting front and back legs
        this.auxiliarLeg5.rotation.x = Math.PI / 2;
        this.auxiliarLeg6.rotation.x = Math.PI / 2;
        this.auxiliarLeg5.rotation.z = Math.PI / 2;
        this.auxiliarLeg6.rotation.z = Math.PI / 2;
        this.auxiliarLeg5.position.set(0, 1.16, 1.6);
        this.auxiliarLeg6.position.set(0, 1.16, 2.8);

        // Position the seat at the top of the legs
        this.sit.position.set(0, 1.24, 2.2);

        // Position vertical supports for the backrest
        this.auxiliarBackrest1.position.set(-0.6, 2, 2.8);
        this.auxiliarBackrest2.position.set(0.6, 2, 2.8);

        // Rotate and position horizontal crossbars for the backrest
        this.auxiliarBackrest3.rotation.z = Math.PI / 2;
        this.auxiliarBackrest4.rotation.z = Math.PI / 2;
        this.auxiliarBackrest5.rotation.z = Math.PI / 2;

        // Position each backrest crossbar above the previous one
        this.auxiliarBackrest3.position.set(0, 2, 2.8);
        this.auxiliarBackrest4.position.set(0, 2.4, 2.8);
        this.auxiliarBackrest5.position.set(0, 2.8, 2.8);
    }
}
