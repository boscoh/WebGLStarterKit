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

        // Create our geometry
        let box = new THREE.BoxGeometry( 1, 1, 1 );
        let sphere = new THREE.SphereGeometry( 1, 12, 12 );
        let torus = new THREE.TorusGeometry( 2, 1, 12, 12 );

        // Give it a shading material. Lambert is a common and fast material
        // that lights up objects with a "matte" finish.
        let boxMaterial = new THREE.MeshLambertMaterial( { color: 0x1234ff } );
        let sphereMaterial = new THREE.MeshLambertMaterial( { color: 0x34ff12 } );
        let torusMaterial = new THREE.MeshLambertMaterial( { color: 0xff3412 } );

        // Create our mesh, which has geometry and material defined.
        // We assign the meshes into `this` class so we can access it in another
        // function.
        let boxMesh = this.boxMesh = new THREE.Mesh( box, boxMaterial );
        let sphereMesh = this.sphereMesh = new THREE.Mesh( sphere, sphereMaterial );
        let torusMesh = this.torusMesh = new THREE.Mesh( torus, torusMaterial );

        // Add the mesh to the scene
        this.scene.add( boxMesh );
        this.scene.add( sphereMesh );
        this.scene.add( torusMesh );

        // Finally, we need to tell the webgl starterkit to set the scene
        this.moveCameraToShowAll();
    }

    // We can move the camera slightly at each time step. WebGL starter kit
    // provides such a function called `animate()`, which we can override
    animate ( elapsedTime, totalElapsedTime ) {

        // Impulse timing function
        // http://iquilezles.org/www/articles/functions/functions.htm
        let impulse = (amplitude, time) => {
            let h = amplitude * time;
            return h * Math.exp(1 - h);
        };

        this.torusMesh.position.set(0, 0, 4 + impulse(4, (totalElapsedTime * 0.001) % 3));
        this.sphereMesh.position.set(0, impulse(2, (totalElapsedTime * 0.001 + 1) % 3), 0);
        this.boxMesh.position.set(0, -impulse(2, (totalElapsedTime * 0.001 + 2) % 3), -2);
    }

}

// Instantiate the widget and inserts it into our page.
var widget = new LoopingAnimation('#widget');

// We also bind a callback function so when the browser window resizes, we
// also resize our widget.
window.addEventListener("resize", () => widget.resize());
