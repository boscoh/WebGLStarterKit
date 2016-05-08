/*
## 3 - Juicy Animations

In this section we will code a few functions to juice up the animations.
*/

// First we need to import three.js module and the webgl starter kit
import THREE from "three";
import { WebGlWidget } from "../webglstarterkit.js";

// Let's declare a class and extend `WebGlWidget`, and define its constructor.
class Snowman extends WebGlWidget {

    constructor ( selector, backgroundColor=0xdddddd ) {

        // Call `super()` to make sure the superclass constructor is run
        super( selector, backgroundColor );

        // Create our snowman
        let head = new THREE.SphereGeometry( 1, 12, 12 );
        let body = new THREE.SphereGeometry( 1.65, 12, 12 );
        let arm = new THREE.BoxGeometry( 0.2, 1, 0.2 );
        let nose = new THREE.CylinderGeometry ( 0.05, 0.3, 1, 12);
        let eye = new THREE.CylinderGeometry ( 0.1, 0.1, 0.05, 12);

        // Offset the arm geometry so the pivot point is at the bottom
        arm.translate(0, -0.5, 0);

        // Give it a shading material. Lambert is a common and fast material
        // that lights up objects with a "matte" finish.
        let woodMaterial = new THREE.MeshLambertMaterial( { color: 0x662211 } );
        let snowMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
        let carrotMaterial = new THREE.MeshLambertMaterial( { color: 0xff5500 } );
        let eyeMaterial = new THREE.MeshLambertMaterial( { color: 0x111111 } );

        // Create our mesh, which has geometry and material defined.
        // We assign the meshes into `this` class so we can access it in another
        // function.
        let headMesh = this.headMesh = new THREE.Mesh( head, snowMaterial );
        let bodyMesh = this.bodyMesh = new THREE.Mesh( body, snowMaterial );
        let leftArmMesh = this.leftArmMesh = new THREE.Mesh( arm, woodMaterial );
        let rightArmMesh = this.rightArmMesh = new THREE.Mesh( arm, woodMaterial );
        let noseMesh = this.noseMesh = new THREE.Mesh( nose, carrotMaterial );
        let leftEyeMesh = this.leftEyeMesh = new THREE.Mesh( eye, eyeMaterial );
        let rightEyeMesh = this.rightEyeMesh = new THREE.Mesh( eye, eyeMaterial );

        // Move the head and nose up on the body
        headMesh.position.set(0, 2, 0);
        noseMesh.position.set(0, 1.8, 1);
        noseMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI * 0.5);

        // Add the head into one object
        let headObject = this.headObject = new THREE.Object3D();
        headObject.add( headMesh );
        headObject.add( noseMesh );
        headObject.add( leftEyeMesh );
        headObject.add( rightEyeMesh );

        // Swing the arms around the sides
        leftArmMesh.position.set(1, 1, 0);
        leftArmMesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI * 0.6);
        rightArmMesh.position.set(-1, 1, 0);
        rightArmMesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI * 0.65);

        // Add eyes to the snowman
        leftEyeMesh.position.set(0.25, 2.2, 1);
        leftEyeMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI * 0.5);
        rightEyeMesh.position.set(-0.25, 2.2, 1);
        rightEyeMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI * 0.5);

        // Add the mesh to the scene
        // this.scene.add( headMesh );
        this.scene.add( headObject );
        this.scene.add( bodyMesh );
        this.scene.add( leftArmMesh );
        this.scene.add( rightArmMesh );
        // this.scene.add( noseMesh );
        // this.scene.add( leftEyeMesh );
        // this.scene.add( rightEyeMesh );

        // Finally, we need to tell the webgl starterkit to set the scene
        this.moveCameraToShowAll();
    }

    // We can move the camera slightly at each time step. WebGL starter kit
    // provides such a function called `animate()`, which we can override
    animate ( elapsedTime, totalElapsedTime ) {

        this.headObject.position.set(0, 0.1 * Math.sin(totalElapsedTime * 0.001), 0);

        this.leftArmMesh.rotation.set(0, 0, Math.PI * 0.6 +
                         Math.PI * 0.1 * -Math.sin(totalElapsedTime * 0.001));
        this.rightArmMesh.rotation.set(0, 0, -Math.PI * 0.65 +
                         Math.PI * 0.1 * -Math.sin(totalElapsedTime * 0.001 + 1));
    }

}

// Instantiate the widget and inserts it into our page.
var widget = new Snowman('#widget');

// We also bind a callback function so when the browser window resizes, we
// also resize our widget.
window.addEventListener("resize", () => widget.resize());
