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
            let texture = textures[materialData.textureref.toLowerCase()];
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