import * as THREE from 'three';

class MaterialsLoader {
    constructor(app) {
        this.app = app;
        this.materials = [];
    }

    read(materials, textures) {
        for (let key in materials) {
            let materialData = materials[key];

            let emissive = materialData.emissive ? new THREE.Color(materialData.emissive.r, materialData.emissive.g, materialData.emissive.b) : new THREE.Color(0, 0, 0);
            let color = new THREE.Color(materialData.color.r, materialData.color.g, materialData.color.b);
            let specular = new THREE.Color(materialData.specular.r, materialData.specular.g, materialData.specular.b);

            let shininess = materialData.shininess;
            let transparent = materialData.transparent;
            let opacity = materialData.opacity;

            let texture = textures[materialData.textureref];
            let repeatS = materialData.texlength_s;
            let repeatT = materialData.texlength_t;
            let twoSided = materialData.twosided;
            let shading = materialData.shading;
            let isVideo = false;

            if (texture !== undefined) {
                isVideo = texture.isVideo;
            }

            let material;

            if (isVideo) {
                const video = document.createElement('video');
                video.src = texture.videoPath;
                video.crossOrigin = 'anonymous';
                video.loop = true;
                video.autoplay = true;
                video.muted = true;

                video.play().catch((err) => {
                    console.error('Error starting video playback:', err);
                });

                const videoTexture = new THREE.VideoTexture(video);
                videoTexture.colorSpace = THREE.SRGBColorSpace;
                videoTexture.flipY = true;

                material = new THREE.MeshPhongMaterial({
                    emissive: emissive,
                    color: color,
                    specular: specular,
                    shininess: shininess,
                    transparent: transparent,
                    opacity: opacity,
                    side: twoSided ? THREE.DoubleSide : THREE.FrontSide
                });

                material.map = new THREE.VideoTexture(video);
            } else {
                material = new THREE.MeshPhongMaterial({
                    emissive: emissive,
                    color: color,
                    specular: specular,
                    shininess: shininess,
                    transparent: transparent,
                    opacity: opacity,
                    side: twoSided ? THREE.DoubleSide : THREE.FrontSide
                });
            }

            if (texture !== undefined && !isVideo) {
                material.map = texture;
                material.map.wrapS = THREE.RepeatWrapping;
                material.map.wrapT = THREE.RepeatWrapping;
                material.map.repeat.set(repeatS, repeatT);
            }

            if (shading !== undefined) {
                if (shading === "flat") {
                    material.flatShading = true;
                } else if (shading === "smooth") {
                    material.flatShading = false;
                }
            }

            this.materials[key.toLowerCase()] = material;
            this.materials[key.toLowerCase()].name = key.toLowerCase();
        }
    }
}

export {MaterialsLoader};