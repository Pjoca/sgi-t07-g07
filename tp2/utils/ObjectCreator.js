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

        if (node.geometry && node.geometry.type === 'pointlight') {
            const light = this.pointLightPrimitive(node.geometry);
            group.add(light);
        } else if (node.geometry && node.geometry.type === 'rectangle') {
            const mesh = this.rectanglePrimitive(node.geometry, currentMaterial);
            group.add(mesh);
        } else if (node.geometry && node.geometry.type === 'triangle') {
            const mesh = this.trianglePrimitive(node.geometry, currentMaterial);
            group.add(mesh);
        } else if (node.geometry && node.geometry.type === 'box') {
            const mesh = this.boxPrimitive(node.geometry, currentMaterial);
            group.add(mesh);
        } else if (node.geometry && node.geometry.type === 'sphere') {
            const mesh = this.spherePrimitive(node.geometry, currentMaterial);
            group.add(mesh);
        } else if (node.geometry && node.geometry.type === 'cylinder') {
            const mesh = this.cylinderPrimitive(node.geometry, currentMaterial);
            group.add(mesh);
        } else if (node.geometry && node.geometry.type === 'polygon') {
            const mesh = this.polygonPrimitive(node.geometry, currentMaterial);
            this.polygons.push(mesh);
            group.add(mesh);
        } else if (node.geometry && node.geometry.type === 'nurbs') {
            const mesh = this.nurbsPrimitive(node.geometry, currentMaterial);
            group.add(mesh);
        } else if (node.geometry && node.geometry.type === 'video') {
            const mesh = this.videoPrimitive(node.geometry);
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

        return mesh;
    }

    trianglePrimitive(primitive, material = null) {
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

        return triangle;
    }

    boxPrimitive(primitive, material = null) {
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

        return mesh;
    }


    spherePrimitive(primitive, material = null) {
        const radius = primitive.radius;
        const slices = primitive.slices;
        const stacks = primitive.stacks;

        const geometry = new THREE.SphereGeometry(radius, slices, stacks);
        const meshMaterial = material || new THREE.MeshBasicMaterial({color: 0x00000});
        return new THREE.Mesh(geometry, meshMaterial);
    }

    cylinderPrimitive(primitive, material = null) {
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

        return new THREE.Mesh(geometry, meshMaterial);
    }

    pointLightPrimitive(primitive) {
        const color = new THREE.Color(
            primitive.color.r,
            primitive.color.g,
            primitive.color.b
        );
        const intensity = primitive.intensity || 1;
        const distance = primitive.distance || 0;
        const decay = primitive.decay || 1;

        const light = new THREE.PointLight(color, intensity, distance, decay);
        light.position.set(
            primitive.position.x || 0,
            primitive.position.y || 0,
            primitive.position.z || 0
        );


        return light;
    }

    polygonPrimitive(primitive, wireframe = false) {
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
        const indices = [];

        positions.push(0, 0, 0);
        colors.push(color_c.r, color_c.g, color_c.b);

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
            }
        }

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


        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setIndex(indices);

        const meshMaterial = new THREE.MeshBasicMaterial({vertexColors: true, wireframe: wireframe});

        return new THREE.Mesh(geometry, meshMaterial);
    }

    nurbsPrimitive(primitive, material = null) {
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

        const meshMaterial = material || new THREE.MeshBasicMaterial({color: 0x111111, side: THREE.DoubleSide});

        const mesh = new THREE.Mesh(geometry, meshMaterial);

        return mesh;
    }

    videoPrimitive(primitive) {
        const video = document.createElement('video');
        video.src = primitive.url;
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.autoplay = true;
        video.muted = true;
    
        video.play().catch((err) => {
            console.error('Error starting video playback:', err);
        });
    
        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = true; 

        const openCone = true;
    
        const radius = primitive.radius; 
        const height = primitive.height;
        const radialSegments = primitive.radialSegments;
        
        const geometry = new THREE.ConeGeometry(radius, height, radialSegments, 1, openCone);
    
        // Rotate the cone 
        geometry.rotateX(Math.PI);

        // Adjust UV mapping to flip the video vertically
        geometry.attributes.uv.array.forEach((_, index) => {
            if (index % 2 === 1) { 
                geometry.attributes.uv.array[index] = 1 - geometry.attributes.uv.array[index];
            }
        });
    
        // Better hologram look
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: texture },
                uOpacity: { value: 1.25 },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform float uOpacity;
                varying vec2 vUv;
                void main() {
                    vec4 texColor = texture2D(uTexture, vUv);
                    float gradient = 1.0 - vUv.y; // Add gradient transparency
                    gl_FragColor = vec4(texColor.rgb, texColor.a * gradient * uOpacity);
                }
            `,
            transparent: true,
        });
    
        const mesh = new THREE.Mesh(geometry, material);
    
        return mesh;
    }     

    degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }
}

export {ObjectCreator};
