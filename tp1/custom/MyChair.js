import * as THREE from 'three';

export class MyChair {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.chairTexture = this.textureLoader.load('textures/table.jpg');

        this.material = new THREE.MeshPhongMaterial({
            map: this.chairTexture,
            shininess: 20
        });

        const legGeometry = new THREE.BoxGeometry(
            0.12, 1.4, 0.12
        );

        this.leg1 = new THREE.Mesh(legGeometry, this.material); this.leg1.receiveShadow = true; this.leg1.castShadow = true;
        this.leg2 = new THREE.Mesh(legGeometry, this.material); this.leg2.receiveShadow = true; this.leg2.castShadow = true;
        this.leg3 = new THREE.Mesh(legGeometry, this.material); this.leg3.receiveShadow = true; this.leg3.castShadow = true;
        this.leg4 = new THREE.Mesh(legGeometry, this.material); this.leg4.receiveShadow = true; this.leg4.castShadow = true;

        const auxiliarLegGeometry = new THREE.BoxGeometry(
            0.09, 1.2, 0.12
        );

        this.auxiliarLeg1 = new THREE.Mesh(auxiliarLegGeometry, this.material); this.auxiliarLeg1.receiveShadow = true; this.auxiliarLeg1.castShadow = true;
        this.auxiliarLeg2 = new THREE.Mesh(auxiliarLegGeometry, this.material); this.auxiliarLeg2.receiveShadow = true; this.auxiliarLeg2.castShadow = true;
        this.auxiliarLeg3 = new THREE.Mesh(auxiliarLegGeometry, this.material); this.auxiliarLeg3.receiveShadow = true; this.auxiliarLeg3.castShadow = true;
        this.auxiliarLeg4 = new THREE.Mesh(auxiliarLegGeometry, this.material); this.auxiliarLeg4.receiveShadow = true; this.auxiliarLeg4.castShadow = true;
        this.auxiliarLeg5 = new THREE.Mesh(auxiliarLegGeometry, this.material); this.auxiliarLeg5.receiveShadow = true; this.auxiliarLeg5.castShadow = true;
        this.auxiliarLeg6 = new THREE.Mesh(auxiliarLegGeometry, this.material); this.auxiliarLeg6.receiveShadow = true; this.auxiliarLeg6.castShadow = true;

        const sitGeometry = new THREE.BoxGeometry(
            1.32, 0.12, 1.32
        );

        this.sit = new THREE.Mesh(sitGeometry, this.material); this.sit.receiveShadow = true; this.sit.castShadow = true;

        const auxiliarBackrestGeometry1 = new THREE.BoxGeometry(
            0.12, 2, 0.12
        );

        this.auxiliarBackrest1 = new THREE.Mesh(auxiliarBackrestGeometry1, this.material); this.auxiliarBackrest1.receiveShadow = true; this.auxiliarBackrest1.castShadow = true;
        this.auxiliarBackrest2 = new THREE.Mesh(auxiliarBackrestGeometry1, this.material); this.auxiliarBackrest2.receiveShadow = true; this.auxiliarBackrest2.castShadow = true;

        const auxiliarBackrestGeometry2 = new THREE.BoxGeometry(
            0.15, 1.2, 0.09
        );

        this.auxiliarBackrest3 = new THREE.Mesh(auxiliarBackrestGeometry2, this.material); this.auxiliarBackrest3.receiveShadow = true; this.auxiliarBackrest3.castShadow = true;
        this.auxiliarBackrest4 = new THREE.Mesh(auxiliarBackrestGeometry2, this.material); this.auxiliarBackrest4.receiveShadow = true; this.auxiliarBackrest4.castShadow = true;
        this.auxiliarBackrest5 = new THREE.Mesh(auxiliarBackrestGeometry2, this.material); this.auxiliarBackrest5.receiveShadow = true; this.auxiliarBackrest5.castShadow = true;
    }

    build() {
        this.leg1.position.set(0.6, 0.6, 1.6);
        this.leg2.position.set(-0.6, 0.6, 1.6);
        this.leg3.position.set(0.6, 0.6, 2.8);
        this.leg4.position.set(-0.6, 0.6, 2.8);

        this.auxiliarLeg1.rotation.x = Math.PI/2;
        this.auxiliarLeg2.rotation.x = Math.PI/2;
        this.auxiliarLeg3.rotation.x = Math.PI/2;
        this.auxiliarLeg4.rotation.x = Math.PI/2;
        this.auxiliarLeg5.rotation.x = Math.PI/2;
        this.auxiliarLeg6.rotation.x = Math.PI/2;
        this.auxiliarLeg5.rotation.z = Math.PI/2;
        this.auxiliarLeg6.rotation.z = Math.PI/2;

        this.auxiliarLeg1.position.set(-0.6, 0.4, 2.2);
        this.auxiliarLeg2.position.set(0.6, 0.4, 2.2);
        this.auxiliarLeg3.position.set(-0.6, 1.16, 2.2);
        this.auxiliarLeg4.position.set(0.6, 1.16, 2.2);
        this.auxiliarLeg5.position.set(0, 1.16, 1.6);
        this.auxiliarLeg6.position.set(0, 1.16, 2.8);

        this.sit.position.set(0, 1.24, 2.2);

        this.auxiliarBackrest1.position.set(-0.6, 2, 2.8);
        this.auxiliarBackrest2.position.set(0.6, 2, 2.8);

        this.auxiliarBackrest3.rotation.z = Math.PI/2;
        this.auxiliarBackrest4.rotation.z = Math.PI/2;
        this.auxiliarBackrest5.rotation.z = Math.PI/2;

        this.auxiliarBackrest3.position.set(0, 2, 2.8);
        this.auxiliarBackrest4.position.set(0, 2.4, 2.8);
        this.auxiliarBackrest5.position.set(0, 2.8, 2.8);
    }
}
