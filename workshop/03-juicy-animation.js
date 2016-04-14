/*
## 3 - Juicy Animations

In this section we will code a few functions to juice up the animations.
*/

// First we need to import three.js module and the webgl starter kit
import THREE from "three";
import { WebGlWidget } from "../webglstarterkit.js";

// Let's declare a class and extend `WebGlWidget`, and define its constructor.
class LoopingAnimation extends WebGlWidget {

    constructor ( selector, backgroundColor=0x112244 ) {

        // Call `super()` to make sure the superclass constructor is run
        super( selector, backgroundColor );

        // Create our snowman
        let head = new THREE.SphereGeometry( 1, 12, 12 );
        let body = new THREE.SphereGeometry( 1.65, 12, 12 );
        // let torus = new THREE.TorusGeometry( 2, 1, 12, 12 );

        // Give it a shading material. Lambert is a common and fast material
        // that lights up objects with a "matte" finish.
        // let boxMaterial = new THREE.MeshLambertMaterial( { color: 0x1234ff } );
        let snowMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
        // let torusMaterial = new THREE.MeshLambertMaterial( { color: 0xff3412 } );

        // Create our mesh, which has geometry and material defined.
        // We assign the meshes into `this` class so we can access it in another
        // function.
        let headMesh = this.headMesh = new THREE.Mesh( head, sphereMaterial );
        let bodyMesh = this.bodyMesh = new THREE.Mesh( body, sphereMaterial );
        // let torusMesh = this.torusMesh = new THREE.Mesh( torus, torusMaterial );

        // Add the mesh to the scene
        this.scene.add( headMesh );
        this.scene.add( bodyMesh );
        // this.scene.add( torusMesh );

        // Finally, we need to tell the webgl starterkit to set the scene
        this.moveCameraToShowAll();
    }

    // We can move the camera slightly at each time step. WebGL starter kit
    // provides such a function called `animate()`, which we can override
    animate ( elapsedTime, totalElapsedTime ) {

    }

}

// Instantiate the widget and inserts it into our page.
var widget = new LoopingAnimation('#widget');

// We also bind a callback function so when the browser window resizes, we
// also resize our widget.
window.addEventListener("resize", () => widget.resize());
