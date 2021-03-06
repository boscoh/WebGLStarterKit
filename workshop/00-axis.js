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
import { WebglWidget } from "../webglstarterkit.js";

/*
 `THREE` is now available for us to use `three.js`. `WebglWidget` provides
 a base foundation which we will get into the details later.

 We are using ES2015 / ES6 syntax, which you may not have seen before. If you
 haven't, not to worry and just follow along!
 */

// Let's declare a class and extend `WebglWidget`, and define its constructor.
class AxisScene extends WebglWidget {

    constructor ( selector ) {

        // Call `super()` to make sure the superclass constructor is run
        super( selector );

        // Create our geometry
        let x = new THREE.CylinderGeometry(1, 1, 10, 10);
        let y = new THREE.CylinderGeometry(1, 1, 10, 10);
        let z = new THREE.CylinderGeometry(1, 1, 10, 10);

        // Give it a shading material. Lambert is a common and fast material
        // that lights up objects with a "matte" finish.
        let red = new THREE.MeshLambertMaterial( { color: 0xff1234 } );
        let green = new THREE.MeshLambertMaterial( { color: 0x12ff34 } );
        let blue = new THREE.MeshLambertMaterial( { color: 0x1234ff } );

        // Create our mesh, which has geometry and material defined.
        let xMesh = new THREE.Mesh( x, red );
        let yMesh = new THREE.Mesh( y, green );
        let zMesh = new THREE.Mesh( z, blue );

        // We can set the position of the mesh
        xMesh.rotation.z = Math.PI / 2;
        zMesh.rotation.x = Math.PI / 2;

        xMesh.position.x += 5;
        yMesh.position.y += 5;
        zMesh.position.z += 5;

        // Add the mesh to the scene
        this.scene.add( xMesh );
        this.scene.add( yMesh );
        this.scene.add( zMesh );

        // Finally, we need to tell the webgl starterkit to set the scene
        this.moveCameraToShowAll();
    }

}

// Instantiate the widget and inserts it into our page.
var widget = new AxisScene('#widget');

// We also bind a callback function so when the browser window resizes, we
// also resize our widget.
window.addEventListener("resize", () => widget.resize());
