import * as THREE from 'three';

class MyTextRenderer {
    constructor(scene, texturePath) {
        this.scene = scene;

        const textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load(texturePath);

        this.charactersPerRow = 16;
        this.charactersPerColumn = 16;

        this.charWidth = 32;
        this.charHeight = 32;

        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true
        });
    }

    getUVCoordinates(char) {
        const index = char.charCodeAt(0);

        const col = index % this.charactersPerRow;
        const row = Math.floor(index / this.charactersPerRow);

        const u = col / this.charactersPerRow;
        const v = 1 - (row + 1) / this.charactersPerColumn;

        return {u, v};
    }

    createTextMesh(text, position, scale = 1) {
        const group = new THREE.Group();

        text.split('').forEach((char, i) => {
            if (char.charCodeAt(0) < 32 || char.charCodeAt(0) > 126) {
                return;
            }

            const {u, v} = this.getUVCoordinates(char);

            const geometry = new THREE.PlaneGeometry(
                this.charWidth / 32,
                this.charHeight / 32
            );

            const charTexture = this.texture.clone();
            charTexture.needsUpdate = true;
            charTexture.offset.set(u, v);
            charTexture.repeat.set(
                1 / this.charactersPerRow,
                1 / this.charactersPerColumn
            );

            const charMaterial = new THREE.MeshBasicMaterial({
                map: charTexture,
                transparent: true
            });

            const charMesh = new THREE.Mesh(geometry, charMaterial);

            charMesh.position.x = i * (this.charWidth / 32) * scale;
            charMesh.scale.set(scale, scale, scale);

            group.add(charMesh);
        });

        group.position.set(position.x, position.y, position.z);

        this.scene.add(group);

        return group;
    }
}

export {MyTextRenderer};
