import * as THREE from 'three';
import {NURBSSurface} from 'three/addons/curves/NURBSSurface.js';
import {ParametricGeometry} from 'three/addons/geometries/ParametricGeometry.js';

class ObjectCreator {
    constructor(app, graphLoader, materialsLoader) {
        this.app = app;
        this.graphLoader = graphLoader;
        this.materialsLoader = materialsLoader;

        // For wireframe visualization
        this.polygons = [];
        this.polygonWireframe = false;

        this.lights = [];
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

        let castshadows = false;
        let receiveshadows = false;
        if (node.castshadows !== undefined) {
            castshadows = node.castshadows;
        }
        if (node.receiveshadows !== undefined) {
            receiveshadows = node.receiveshadows;
        }

        if (node.geometry && node.geometry.type === 'pointlight') {
            const light = this.pointLightPrimitive(node.geometry);
            this.lights.push(light);
            group.add(light);
        } else if (node.geometry && node.geometry.type === 'directionallight') {
            const light = this.directionalLightPrimitive(node.geometry);
            this.lights.push(light);
            group.add(light);
        } else if (node.geometry && node.geometry.type === 'spotlight') {
            const light = this.spotLightPrimitive(node.geometry);
            this.lights.push(light);
            group.add(light);
        } else if (node.geometry && node.geometry.type === 'rectangle') {
            const mesh = this.rectanglePrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
            group.add(mesh);
        } else if (node.geometry && node.geometry.type === 'triangle') {
            const mesh = this.trianglePrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
            group.add(mesh);
        } else if (node.geometry && node.geometry.type === 'box') {
            const mesh = this.boxPrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
            group.add(mesh);
        } else if (node.geometry && node.geometry.type === 'sphere') {
            const mesh = this.spherePrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
            group.add(mesh);
        } else if (node.geometry && node.geometry.type === 'cylinder') {
            const mesh = this.cylinderPrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
            group.add(mesh);
        } else if (node.geometry && node.geometry.type === 'polygon') {
            const mesh = this.polygonPrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
            this.polygons.push(mesh);
            group.add(mesh);
        } else if (node.geometry && node.geometry.type === 'nurbs') {
            const mesh = this.nurbsPrimitive(node.geometry, currentMaterial, castshadows, receiveshadows);
            group.add(mesh);
        }

        parent.add(group);

        if (node.children) {
            Object.values(node.children).forEach(childId => {
                this.buildSceneGraph(childId, nodes, group, currentMaterial);
            });
        }
    }

    rectanglePrimitive(primitive, material = null, castshadow = false, receiveShadow = false) {
        const x1 = primitive.xy1.x;
        const y1 = primitive.xy1.y;

        const x2 = primitive.xy2.x;
        const y2 = primitive.xy2.y;

        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);

        const parts_x = primitive.parts_x || 1;
        const parts_y = primitive.parts_y || 1;

        const geometry = new THREE.PlaneGeometry(width, height, parts_x, parts_y);

        const meshMaterial = material || new THREE.MeshBasicMaterial({
            color: 0xffffff,
        });

        const mesh = new THREE.Mesh(geometry, meshMaterial);

        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;

        mesh.position.set(centerX, centerY, 0);
        mesh.castShadow = castshadow;
        mesh.receiveShadow = receiveShadow;

        return mesh;
    }

    trianglePrimitive(primitive, material = null, castshadow = false, receiveShadow = false) {
        const v1 = new THREE.Vector3(primitive.xyz1.x, primitive.xyz1.y, primitive.xyz1.z);
        const v2 = new THREE.Vector3(primitive.xyz2.x, primitive.xyz2.y, primitive.xyz2.z);
        const v3 = new THREE.Vector3(primitive.xyz3.x, primitive.xyz3.y, primitive.xyz3.z);

        const geometry = new THREE.BufferGeometry();

        const vertices = new Float32Array([
            v1.x, v1.y, v1.z,
            v2.x, v2.y, v2.z,
            v3.x, v3.y, v3.z
        ]);

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const meshMaterial = material || new THREE.MeshBasicMaterial({color: 0xffffff});

        const triangle = new THREE.Mesh(geometry, meshMaterial);
        mesh.castShadow = castshadow;
        mesh.receiveShadow = receiveShadow;

        return triangle;
    }

    boxPrimitive(primitive, material = null, castshadow = false, receiveShadow = false) {
        const x1 = primitive.xyz1.x;
        const y1 = primitive.xyz1.y;
        const z1 = primitive.xyz1.z;

        const x2 = primitive.xyz2.x;
        const y2 = primitive.xyz2.y;
        const z2 = primitive.xyz2.z;

        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        const depth = Math.abs(z2 - z1);

        const parts_x = primitive.parts_x || 1;
        const parts_y = primitive.parts_y || 1;
        const parts_z = primitive.parts_z || 1;

        const geometry = new THREE.BoxGeometry(width, height, depth, parts_x, parts_y, parts_z);

        const meshMaterial = material || new THREE.MeshBasicMaterial({
            color: 0xff00ff
        });

        const mesh = new THREE.Mesh(geometry, meshMaterial);

        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        const centerZ = (z1 + z2) / 2;

        mesh.position.set(centerX, centerY, centerZ);
        mesh.castShadow = castshadow;
        mesh.receiveShadow = receiveShadow;

        return mesh;
    }


    spherePrimitive(primitive, material = null, castshadow = false, receiveShadow = false) {
        const radius = primitive.radius;
        const slices = primitive.slices;
        const stacks = primitive.stacks;

        const geometry = new THREE.SphereGeometry(radius, slices, stacks);
        const meshMaterial = material || new THREE.MeshBasicMaterial({color: 0x00000});

        const mesh = new THREE.Mesh(geometry, meshMaterial);
        mesh.castShadow = castshadow;
        mesh.receiveShadow = receiveShadow;

        return mesh;
    }

    cylinderPrimitive(primitive, material = null, castshadow = false, receiveShadow = false) {
        const radiusTop = primitive.top;
        const radiusBottom = primitive.base;
        const height = primitive.height;
        const slices = primitive.slices;
        const stacks = primitive.stacks;
        var capsclose = true;
        var thetastart = 0;
        var thetalength = 2 * Math.PI;

        if (primitive.capsclose !== undefined) {
            capsclose = !primitive.capsclose;
        }

        if (primitive.thetastart !== undefined) {
            thetastart = this.degToRad(primitive.thetastart);
        }

        if (primitive.thetalength !== undefined) {
            thetalength = this.degToRad(primitive.thetalength);
        }

        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, slices, stacks, capsclose, thetastart, thetalength);

        const meshMaterial = material || new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

        const mesh = new THREE.Mesh(geometry, meshMaterial);
        mesh.castShadow = castshadow;
        mesh.receiveShadow = receiveShadow;

        return mesh;
    }

    pointLightPrimitive(primitive) {
        const color = new THREE.Color(
            primitive.color.r,
            primitive.color.g,
            primitive.color.b
        );
        const intensity = primitive.intensity;
        const distance = primitive.distance || 0;
        const decay = primitive.decay || 1;

        const light = new THREE.PointLight(color, intensity, distance, decay);
        light.position.set(
            primitive.position.x || 0,
            primitive.position.y || 0,
            primitive.position.z || 0
        );

        if (primitive.castshadow !== undefined) {
            light.castShadow = primitive.castshadow;
        }

        return light;
    }

    directionalLightPrimitive(primitive) {
        const color = new THREE.Color(
            primitive.color.r,
            primitive.color.g,
            primitive.color.b
        );
        const intensity = primitive.intensity;

        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(
            primitive.position.x || 0,
            primitive.position.y || 0,
            primitive.position.z || 0
        );

        if (primitive.castshadow !== undefined) {
            light.castShadow = primitive.castshadow;
        }

        return light;
    }

    spotLightPrimitive(primitive) {
        const color = new THREE.Color(
            primitive.color.r,
            primitive.color.g,
            primitive.color.b
        );
        const intensity = primitive.intensity;
        const distance = primitive.distance || 1000;
        const angle = primitive.angle || Math.PI / 4;
        const decay = primitive.decay || 2;
        const penumbra = primitive.penumbra || 1;

        const light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
        light.position.set(
            primitive.position.x || 0,
            primitive.position.y || 0,
            primitive.position.z || 0
        );

        if (primitive.target) {
            const target = new THREE.Object3D();
            target.position.set(
                primitive.target.x || 0,
                primitive.target.y || 0,
                primitive.target.z || 0
            );
            light.target = target;
        }

        if (primitive.castshadow !== undefined) {
            light.castShadow = primitive.castshadow;
        }

        return light;
    }


    polygonPrimitive(primitive, wireframe = false, castshadow = false, receiveShadow = false) {
        const radius = primitive.radius;
        const stacks = primitive.stacks;
        const slices = primitive.slices;
        const color_c = new THREE.Color(
            primitive.color_c.r,
            primitive.color_c.g,
            primitive.color_c.b
        );
        const color_p = new THREE.Color(
            primitive.color_p.r,
            primitive.color_p.g,
            primitive.color_p.b
        );

        const positions = [];
        const colors = [];
        const normals = [];
        const indices = [];

        // Add center vertex
        positions.push(0, 0, 0);
        colors.push(color_c.r, color_c.g, color_c.b);
        normals.push(0, 0, 1);

        // Create vertices for each stack and slice
        for (let stack = 1; stack <= stacks; stack++) {
            const stackRadius = (stack / stacks) * radius;
            for (let slice = 0; slice < slices; slice++) {
                const theta = (slice / slices) * Math.PI * 2;
                const x = Math.cos(theta) * stackRadius;
                const y = Math.sin(theta) * stackRadius;
                positions.push(x, y, 0);

                const t = stack / stacks;
                const interpolatedColor = new THREE.Color(
                    color_c.r + t * (color_p.r - color_c.r),
                    color_c.g + t * (color_p.g - color_c.g),
                    color_c.b + t * (color_p.b - color_c.b)
                );
                colors.push(interpolatedColor.r, interpolatedColor.g, interpolatedColor.b);

                // Normal for each vertex (flat on the xy-plane, pointing upwards)
                normals.push(0, 0, 1);
            }
        }

        // Create indices for faces
        for (let stack = 0; stack < stacks; stack++) {
            for (let slice = 0; slice < slices; slice++) {
                const current = stack * slices + slice + 1;
                const next = stack * slices + ((slice + 1) % slices) + 1;
                const nextStack = (stack + 1) * slices + slice + 1;
                const nextStackNext = (stack + 1) * slices + ((slice + 1) % slices) + 1;

                if (stack === 0 || stack === stacks - 1) {
                    indices.push(0, current, next);
                } else {
                    indices.push(current, nextStack, nextStackNext);
                    indices.push(current, nextStackNext, next);
                }
            }
        }

        // Create BufferGeometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3)); // Manually set normals
        geometry.setIndex(indices);

        // Create Material
        const meshMaterial = new THREE.MeshStandardMaterial({
            vertexColors: true,
            wireframe: wireframe
        });

        // Create Mesh
        const mesh = new THREE.Mesh(geometry, meshMaterial);
        mesh.castShadow = castshadow;
        mesh.receiveShadow = receiveShadow;

        return mesh;
    }

    nurbsPrimitive(primitive, material = null, castshadow = false, receiveShadow = false) {
        const degreeU = primitive.degree_u;
        const degreeV = primitive.degree_v;
        const partsU = primitive.parts_u;
        const partsV = primitive.parts_v;
        const controlPoints = primitive.controlpoints;
        const controlPointsArray = [];

        for (let i = 0; i <= degreeU; i++) {
            const row = [];
            for (let j = 0; j <= degreeV; j++) {
                const index = i * (degreeV + 1) + j;
                const controlPointData = controlPoints[index];
                row.push([controlPointData.x, controlPointData.y, controlPointData.z, 1]);
            }
            controlPointsArray.push(row);
        }

        const knotsU = [];
        const knotsV = [];

        for (let i = 0; i <= degreeU; i++) {
            knotsU.push(0);
        }

        for (let i = 0; i <= degreeU; i++) {
            knotsU.push(1);
        }

        for (let i = 0; i <= degreeV; i++) {
            knotsV.push(0);
        }

        for (let i = 0; i <= degreeV; i++) {
            knotsV.push(1);
        }

        let stackedPoints = [];

        for (let i = 0; i < controlPointsArray.length; i++) {
            let row = controlPointsArray[i];
            let newRow = [];

            for (let j = 0; j < row.length; j++) {
                let item = row[j];
                newRow.push(new THREE.Vector4(item[0], item[1], item[2], item[3]));
            }

            stackedPoints[i] = newRow;
        }

        const nurbsSurface = new NURBSSurface(degreeU, degreeV, knotsU, knotsV, stackedPoints);

        const geometry = new ParametricGeometry((u, v, target) => {
            return nurbsSurface.getPoint(u, v, target)
        }, partsU, partsV);

        const meshMaterial = material || new THREE.MeshBasicMaterial({color: 0x111111});

        const mesh = new THREE.Mesh(geometry, meshMaterial);
        mesh.castShadow = castshadow;
        mesh.receiveShadow = receiveShadow;

        return mesh;
    }
    
    degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }
}

export {ObjectCreator};
