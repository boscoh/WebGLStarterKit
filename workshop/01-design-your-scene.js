/*
## 1 - Design Your Scene

In this example we will get a basic scene going on our window. First make sure
that you have checked out the WebGL starter kit, and ran `npm install`.

Make a folder called `workshop`, and create a file in there to start. Let's call
it `scene.js`. Edit it with your favourite editor (Sublime Text, Notepad++,
Atom, etc.)

`three.js` provides **primitives** for us to work with. Primitives are basic
geometries that have already been defined by a function. Some of them are:

 * BoxGeometry
 * CylinderGeometry
 * SphereGeometry
 * TorusGeometry

Pick three of them draw onto the paper in front of you. They can be stacked,
arranged in a line, or in any combination.

We drew:

    [ ]  ( )  O

Now let's put that in to our scene.
*/

// First we need to import three.js module and the webgl starter kit
import THREE from "three";
import { WebGlWidget } from "../webglstarterkit.js";

/*
`THREE` is now available for us to use `three.js`. `WebGlWidget` provides
a base foundation which we will get into the details later.

We are using ES2015 / ES6 syntax, which you may not have seen before. If you
haven't, not to worry and just follow along!
*/

// Let's declare a class and extend `WebGlWidget`, and define its constructor.
class DesignScene extends WebGlWidget {

    constructor ( selector ) {

        // Call `super()` to make sure the superclass constructor is run
        super( selector );

        // Create our geometry
        let box = new THREE.BoxGeometry( 1, 1, 1 );
        let sphere = new THREE.SphereGeometry( 1, 12, 12 );
        let torus = new THREE.TorusGeometry( 2, 1, 12, 12 );

        // Give it a shading material. Lambert is a common and fast material
        // that lights up objects with a "matte" finish.
        let material = new THREE.MeshLambertMaterial( { color: 0x1234ff } );

        // Create our mesh, which has geometry and material defined.
        let boxMesh = new THREE.Mesh( box, material );
        let sphereMesh = new THREE.Mesh( sphere, material );
        let torusMesh = new THREE.Mesh( torus, material );

        // We can set the position of the mesh
        boxMesh.position.set(0, 0, -2);
        sphereMesh.position.set(0, 0, 0);
        torusMesh.position.set(0, 0, 2);

        // Add the mesh to the scene
        this.scene.add( boxMesh );
        this.scene.add( sphereMesh );
        this.scene.add( torusMesh );

        // Finally, we need to tell the webgl starterkit to set the scene
        this.moveCameraToShowAll();
        this.rotateAngPerStep = 0.02;
    }

    // We can move the camera slightly at each time step. WebGL starter kit
    // provides such a function called `animate()`, which we can override
    animate ( timeElapsed ) {

        this.rotateCameraAroundScene(0, this.rotateAngPerStep, 0);

    }

}

// Instantiate the widget and inserts it into our page.
var widget = new DesignScene('#widget');

// We also bind a callback function so when the browser window resizes, we
// also resize our widget.
window.addEventListener("resize", () => widget.resize());
