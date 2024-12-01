import * as THREE from 'three';

class TexturesLoader {
    constructor(app) {
        this.app = app;
        this.textures = [];
    }

    read(textures) {
        const textureLoader = new THREE.TextureLoader();

        for (let key in textures) {
            let textureData = textures[key];

            this.textures[key.toLowerCase()] = textureLoader.load(textureData.filepath);
            this.textures[key.toLowerCase()].name = key.toLowerCase();
            this.textures[key.toLowerCase()].isVideo = false;

            if (textureData.isVideo !== undefined) {
                this.textures[key.toLowerCase()].isVideo = textureData.isVideo;
                this.textures[key.toLowerCase()].videoPath = textureData.filepath;
            }

        }
    }
}

export { TexturesLoader };