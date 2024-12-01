import * as THREE from 'three';

class MaterialsLoader {
    constructor(app,) {
        this.app = app;
        this.materials = [];
        this.bumpScale = 0.2;
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
            let bumpTexture = textures[materialData.bumpmapref];
            let bumpScale = materialData.bumpscale !== undefined ? materialData.bumpscale : this.bumpScale; 
            let repeatS = materialData.texlength_s;
            let repeatT = materialData.texlength_t;
            let twoSided = materialData.twosided;
            let shading = materialData.shading;

            let material = new THREE.MeshPhongMaterial({
                emissive: emissive,
                color: color,
                specular: specular,
                shininess: shininess,
                transparent: transparent,
                opacity: opacity,
                side: twoSided ? THREE.DoubleSide : THREE.FrontSide
            });

            if (texture !== undefined) {
                material.map = texture;
                material.map.wrapS = THREE.RepeatWrapping;
                material.map.wrapT = THREE.RepeatWrapping;
                material.map.repeat.set(repeatS, repeatT);
            }

            if (bumpTexture !== undefined) {
                material.bumpMap = bumpTexture;
                material.bumpMap.wrapS = THREE.RepeatWrapping;
                material.bumpMap.wrapT = THREE.RepeatWrapping;
                material.bumpMap.repeat.set(repeatS, repeatT);
                material.bumpScale = bumpScale;
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
    updateBumpScale(newScale) {
        this.bumpScale = newScale;
        for (let key in this.materials) {
            let material = this.materials[key];
            if (material.bumpMap) {
                material.bumpScale = newScale;
            }
        }
    }
}

export {MaterialsLoader};