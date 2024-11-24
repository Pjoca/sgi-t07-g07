import * as THREE from 'three';

class ObjectCreator {
    constructor(app, graphLoader, materialsLoader) {
        this.app = app;
        this.graphLoader = graphLoader;
        this.materialsLoader = materialsLoader;
    }

    createObjects() {
        const rootId = "scene";
        const rootNode = this.graphLoader.nodes[rootId];

        if (rootNode) {
            this.buildSceneGraph(rootId, this.graphLoader.nodes, this.app.scene);
        }
    }

    buildSceneGraph(nodeId, nodes, parent, inheritedMaterial = null) {
        const node = nodes[nodeId];
        const group = new THREE.Group();

        if (node.transforms) {
            node.transforms.forEach(transform => {
                switch (transform.type) {
                    case 'translate':
                        group.position.set(
                            transform.amount.x || 0,
                            transform.amount.y || 0,
                            transform.amount.z || 0
                        );
                        break;
                    case 'rotate':
                        group.rotation.set(
                            this.degToRad(transform.amount.x || 0),
                            this.degToRad(transform.amount.y || 0),
                            this.degToRad(transform.amount.z || 0)
                        );
                        break;
                    case 'scale':
                        group.scale.set(
                            transform.amount.x || 1,
                            transform.amount.y || 1,
                            transform.amount.z || 1
                        );
                        break;
                }
            });
        }

        let currentMaterial = inheritedMaterial;
        if (node.materialRef && this.materialsLoader.materials[node.materialRef]) {
            currentMaterial = this.materialsLoader.materials[node.materialRef];
        }

        if (node.lightProperties) {
            const light = this.pointLightPrimitive(node);
            group.add(light);
        } 
        else if (node.geometry && node.geometry.type === 'rectangle') {
            const mesh = this.rectanglePrimitive(node.geometry, currentMaterial);
            group.add(mesh);
        }

        else if (node.geometry && node.geometry.type === 'cube') {
            const mesh = this.cubePrimitive(node.geometry, currentMaterial);
            group.add(mesh);
        }

        else if (node.geometry && node.geometry.type === 'sphere') {
            const mesh = this.spherePrimitive(node.geometry, currentMaterial);
            group.add(mesh);
        }

        else if (node.geometry && node.geometry.type === 'cylinder') {
            const mesh = this.cylinderPrimitive(node.geometry, currentMaterial);
            group.add(mesh);
        }

        parent.add(group);

        if (node.children) {
            Object.values(node.children).forEach(childId => {
                this.buildSceneGraph(childId, nodes, group, currentMaterial);
            });
        }
    }

    rectanglePrimitive(primitive, material = null) {
        const width = Math.abs(primitive.xy1.x - primitive.xy2.x);
        const height = Math.abs(primitive.xy1.y - primitive.xy2.y);

        const geometry = new THREE.PlaneGeometry(width, height);

        const meshMaterial = material || new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

        return new THREE.Mesh(geometry, meshMaterial);
    }

    cubePrimitive(primitive, material = null) {
        const width = primitive.width;
        const height = primitive.height;
        const depth = primitive.depth;
    
        // Use BoxGeometry for the parallelepiped
        const geometry = new THREE.BoxGeometry(width, height, depth);
    
        const meshMaterial = material || new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
    
        return new THREE.Mesh(geometry, meshMaterial);
    }
    

    spherePrimitive(primitive, material = null) {
        const radius = primitive.radius;
        const widthSegments = primitive.width;
        const heightSegments = primitive.height;
    
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const meshMaterial = material || new THREE.MeshBasicMaterial({ color: 0x00000 });
        return new THREE.Mesh(geometry, meshMaterial);
    }

    cylinderPrimitive(primitive, material = null) {
        const radiusTop = primitive.radiusTop;
        const radiusBottom = primitive.radiusBottom;
        const height = primitive.height;
        const radialSegments = primitive.radialSegments; 
    
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    
        const meshMaterial = material || new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
    
        return new THREE.Mesh(geometry, meshMaterial);
    }    
    
    pointLightPrimitive(node) {
        const color = new THREE.Color(
            node.lightProperties.color.r,
            node.lightProperties.color.g,
            node.lightProperties.color.b
        );
        const intensity = node.lightProperties.intensity || 1;
        const distance = node.lightProperties.distance || 0;
        const decay = node.lightProperties.decay || 1;

        const light = new THREE.PointLight(color, intensity, distance, decay);
        light.position.set(
            node.lightProperties.position.x || 0,
            node.lightProperties.position.y || 0,
            node.lightProperties.position.z || 0
        );

        return light;
    }

    degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }
}

export { ObjectCreator };
