import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = false
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess })

        this.wallMaterial = new THREE.MeshPhongMaterial({ 
            color: "#ffffff", 
            specular: "#333333", 
            shininess: 30 
        });
        this.wallThickness = 0.3;
        this.wallHeight = 5.5;  // Adjust the height as needed
        this.wallLength = 10;   // Adjust the length as needed
        
        // Store wall meshes for easier management
        this.walls = [];    

        this.tableMaterial = new THREE.MeshPhongMaterial({ 
            color: "#8B4513", // Brown color for wood
            specular: "#555555", 
            shininess: 50 
        });
        this.tableTopSize = { width: 4, depth: 2, thickness: 0.1 };
        this.tableLegSize = { thickness: 0.1, height: 1.5 };
        this.tableHeight = 1.6;
    
        // Store table parts for easier management
        this.tableParts = [];
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.z = 1.5;
        this.boxMesh.rotation.x = -Math.PI / 4;
        this.boxMesh.position.y = this.boxDisplacement.y;
        this.boxMesh.scale.set(2, 2, 2.5);
    }

    buildWalls() {
        // Wall 1 (Front wall)
        const wall1Geometry = new THREE.BoxGeometry(this.wallLength+0.3, this.wallHeight, this.wallThickness);
        const wall1 = new THREE.Mesh(wall1Geometry, this.wallMaterial);
        wall1.position.set(0, this.wallHeight / 2, this.wallLength / 2);  // Adjust y for half the wall height
        this.walls.push(wall1);
    
        // Wall 2 (Back wall)
        const wall2Geometry = new THREE.BoxGeometry(this.wallLength+0.3, this.wallHeight, this.wallThickness);
        const wall2 = new THREE.Mesh(wall2Geometry, this.wallMaterial);
        wall2.position.set(0, this.wallHeight / 2, -this.wallLength / 2);
        this.walls.push(wall2);
    
        // Wall 3 (Left wall)
        const wall3Geometry = new THREE.BoxGeometry(this.wallThickness, this.wallHeight, this.wallLength);
        const wall3 = new THREE.Mesh(wall3Geometry, this.wallMaterial);
        wall3.position.set(-this.wallLength / 2, this.wallHeight / 2, 0);
        this.walls.push(wall3);
    
        // Wall 4 (Right wall)
        const wall4Geometry = new THREE.BoxGeometry(this.wallThickness, this.wallHeight, this.wallLength+0.3);
        const wall4 = new THREE.Mesh(wall4Geometry, this.wallMaterial);
        wall4.position.set(this.wallLength / 2, this.wallHeight / 2, 0);
        this.walls.push(wall4);
    
        // Add each wall to the scene
        this.walls.forEach(wall => this.app.scene.add(wall));
    }
    

    buildTable() {
        // Create the tabletop
        const topGeometry = new THREE.BoxGeometry(
            this.tableTopSize.width, 
            this.tableTopSize.thickness, 
            this.tableTopSize.depth
        );
        const tabletop = new THREE.Mesh(topGeometry, this.tableMaterial);
        tabletop.position.set(0, this.tableHeight, 0);  // Position it at the height of the table
        this.tableParts.push(tabletop);
        this.app.scene.add(tabletop);
    
        // Create table legs
        const legGeometry = new THREE.BoxGeometry(
            this.tableLegSize.thickness, 
            this.tableLegSize.height, 
            this.tableLegSize.thickness
        );
    
        // Front left leg
        const leg1 = new THREE.Mesh(legGeometry, this.tableMaterial);
        leg1.position.set(
            -this.tableTopSize.width / 2 + this.tableLegSize.thickness / 2,
            this.tableHeight - this.tableLegSize.height / 2,
            -this.tableTopSize.depth / 2 + this.tableLegSize.thickness / 2
        );
        this.tableParts.push(leg1);
        this.app.scene.add(leg1);
    
        // Front right leg
        const leg2 = new THREE.Mesh(legGeometry, this.tableMaterial);
        leg2.position.set(
            this.tableTopSize.width / 2 - this.tableLegSize.thickness / 2,
            this.tableHeight - this.tableLegSize.height / 2,
            -this.tableTopSize.depth / 2 + this.tableLegSize.thickness / 2
        );
        this.tableParts.push(leg2);
        this.app.scene.add(leg2);
    
        // Back left leg
        const leg3 = new THREE.Mesh(legGeometry, this.tableMaterial);
        leg3.position.set(
            -this.tableTopSize.width / 2 + this.tableLegSize.thickness / 2,
            this.tableHeight - this.tableLegSize.height / 2,
            this.tableTopSize.depth / 2 - this.tableLegSize.thickness / 2
        );
        this.tableParts.push(leg3);
        this.app.scene.add(leg3);
    
        // Back right leg
        const leg4 = new THREE.Mesh(legGeometry, this.tableMaterial);
        leg4.position.set(
            this.tableTopSize.width / 2 - this.tableLegSize.thickness / 2,
            this.tableHeight - this.tableLegSize.height / 2,
            this.tableTopSize.depth / 2 - this.tableLegSize.thickness / 2
        );
        this.tableParts.push(leg4);
        this.app.scene.add(leg4);
    }
    


    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

       // this.boxDisplacement.set(2, 3, 2); 

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        this.buildBox()
        this.buildWalls();
        this.buildTable();
        
        // Create a Plane Mesh with basic material
        
        let plane = new THREE.PlaneGeometry( 10, 10 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.position.y = -0;
        this.planeMesh.rotation.x = -Math.PI / 2;
    

        this.app.scene.add( this.planeMesh );
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };