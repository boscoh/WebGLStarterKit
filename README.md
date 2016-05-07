
# WebGL Starter Kit

Even though `WebGL` is awesome, and `three.js` makes it more so, there is still quite a lot to do to draw polygons on your webpages. At the very least, you need:

- a scene
- a renderer
- a camera
- some lights
- an input loop
- an animation loop
- a link to the DOM

Beyond that, you might also want to:

- resize to the DOM
- convert mouse/touch events
- handle camera movements
- raycast mouse clicks
- draw HUD elements over screen
- put camera in a nice place

That's before a single triangle is drawn.

To help you get started, the `WebglWidget` class wraps all this together with some choice defaults.

So you can concentrate on building awesome `three.js` graphics.

Override the defaults later, when it's convenient for you.

# Install

Download the package:
	<https://github.com/boscoh/WebGLStarterKit/archive/master.zip>

Or clone the repository

    git clone https://github.com/boscoh/WebGLStarterKit.git

Make sure you have installed [NodeJS](https://nodejs.org/en/).

Then in the package:

    > npm install


# Quick example

The `WebGLStarterKit` assumes that you want to use [ES6](https://babeljs.io/docs/learn-es2015/). In particular, the builder `buildwebgl.js` automatically transpiles from ES6 (which is backwards compatible with vanilla javascript).

Let's create a simple WebGL app `octahedron.js`.

First import the modules:

    import THREE from "three.js";
    import { WebglWidget } from "./webglstarterkit.js";

Then sublcass `WebglWidget` and add meshes to `this.scene` in the constructor:

    class MyWidget extends WebglWidget {
            let material = new THREE.MeshLambertMaterial(
                { color: 0xffff00 } );
            let geom = new THREE.OctahedronGeometry();
            this.scene.add( new THREE.Mesh( geom, material ) )
            this.moveCameraToShowAll();
        }
    }

Don't forget to call `this.moveCameraToShowAll` to automatically place the camera.

Then instantiate your class to the DOM:

    var myWidget = MyWidget('#widget')

Finally, use the following script to build your HTML page:

    > ./buildwebgl octahedron.js

Now open `octahedron.html`.


# Animation Loop

To allow for the possiblity of multiple widgets in one page, all `WebglWidget`'s are registered through a single animation loop.

The animation loop works through the `registerWidgetForAnimation(widget)` function, which takes any `widget` with the interface:

- property `widget.isChanged` - indicates if draw should happen
- method `widget.draw()`  - draws at the right time
- method `widget.animate(timeElapsed)` - animates with the given elapsed time since last animate

The `WebglWidget` instances will call this automatically, but you can always add your custom objects onto the animation loop.

The animation loop is tied to the browser's internal drawing loop, and thus will draw all widgets at the same time.


# Lights

If you want different lights, override the method:

    this.setLights() {
        let newLight = /* make your own */
        this.lights.append(newLight);
    }

When you rotate the camera and you want the light to follow the camera, make sure you set the parameter `isRotatingLights` in `this.rotateCameraAroundSceneAroundScene`. Otherwise, the light is static and you rotate around the shadows.

# Resizing

The WebGL canvas needs to be manually resized. As such, if you have a resizable `<div>`, you need to set the resizing function:

    window.addEventListener("resize", () => myWidget.resize());

This will resize the rendering canvas to the size of the surrounding `<div>`.

# Handling Mouse/Pointer Input

Your typical widgets should handle mouse input, and this is quite tricky to do that with the typical DOM event listeners.

Thus the method `this.bindCallbacks()` will bind a number of convenient methods to the mouse input of `this.divDom`:

 - `this.mousescroll( wheel )`
 - `this.mouseclick( x, y )`
 - `this.mousedoubleclick( x, y )`
 - `this.leftmousedrag( x0, y0, x1, y1 )`
 - `this.rightmousedrag( x0, y0, x1, y1 )`
 - `this.gesturedrag( rot, scale ) `

In particular, the `x, y` pairs are scaled to the size of your `this.divDOM`. The width and height are obtained from `this.width()` and `this.height()`.

`calcPointerXY( event )`

If you're familiar with event handlers, the widget actually binds the following methods to their namesake handlers in `this.divDOM`:

- `this.mousedown( event )`
- `this.mousemove( event )`
- `this.mouseup( event )`
- `this.mousewheel( event )`
- `this.DOMMouseScroll( event )`
- `this.touchstart( event )`
- `this.touchmove( event )`
- `this.touchend( event )`
- `this.touchcancel( event )`
- `this.gesturestart( event )`
- `this.gesturechange( event )`
- `this.gestureend( event )`


If you're familiar with event handlers, just override them:

    this.mousedown( e ) = /* your function */

Of course, this will override the convenient handlers from above.

Inside these routines, a very important function to calculate the pointer position `this.calcPointerXY( event )`. this function takes a DOM event that contains pointer positions in a particular webpage state based coordinate system and translates to the coordinate system of the `this.divDom`, from 0 to `this.width()`, and 0 to `this.height()`. This translation is crucial for embedded widgets that can be anywhere on a scrollabel webpage.

You can always call this function to unravel any `event` object.

# Raycasting: Clicking on Meshes

For interactivity, you will want to be able to click on 3D objects in your scenes. The way to do this is, while in the constructor, add any meshes you want to keep track off into the list `this.clickableMeshes`:

    this.clickableMeshes.push( mesh )

Add any identifying information the the mesh, maybe some kind of ID.

Then, during the input methods, call:

    this.getClickedMeshes()

This assumes that `this.calcPointerXY( event )` has been called at some point already and we have obtained `this.pointerX` and `this.pointerY`. The function will set the property `this.clickedMesh` which will refer to the top-most clicked mesh in `this.clickableMeshes`.

# Heads-up Display

In WebGL apps, it's actually faster to draw text labels and such with HTML elements on top of the WebGL `<canvas>` rather than to draw text in the WebGL context itself.

In order to link 3D objects and HTML elements you will need to convert an object's 3D position into screen coordinates of your `<div>`.

Let's say you have three.js mesh, say `this.clickedMesh` from the last section. To calculate it's screen coordinates:

    let screen = this.calcScreenXYOfPos( this.clickedMesh );

You can then instantiate a `<div>`, and a nice little object wrapper around a movable `<div>` is `PopupText`.

- class PopupText

    - `constructor( selector, backgroundColor='white', textColor='black', opacity=0.7 )`
    - `this.move( x, y )`
    - `this.hide()`
    - `this.html( text )`
    - `this.remove()`

So you can then:

    this.hover.move( screen.x, screen.y );


the PopupText( this.selector, "lightblue", "blue" );



# WebglWidget class

_Constructor:_

 - `constructor(selector, backgroundColor='black')` - creates WebGL context to a `<div>` referred to by selector, sets the background color, registers it with the main animation loop, that draws the scene.

_Properties:_

 - `this.divDom` - DOM element pointed to by `selector`, this is where the `<canvas>` is inserted and takes the size from

 - `this.backgroundColor` - stores the color used to build scene, if you need to change.

 - `this.scene` - Three.js scene
 - `this.scene.fog` - Three.js fog added

 - `this.lights` - holds the lights that is inserted into `this.scene`

 - `this.camera` - Three.js camera
 - `this.zoom` - distance between camera and `this.scene`

 - `this.renderer` - Three.js renderer
 - `this.renderDom` - DOM element bound to renderer

 - `this.clickableMeshes` - list of all meshes for picking. Add meshes here if you want to keep track of them. You can always add properties to those meshses for further analysis
 - `this.clickedMesh` - top-most picked mesh [nothing picked=null]

_Methods:_

 - `this.resize()` - resize `this.renderDom` to fit the `this.divDom` and sets aspect ratio

 - `this.setLights()` - overrideable function to set your own lights, just push to `this.lights`

 - `this.draw()` - draws the scene to the screen

 - `this.animate( elapsedTime )` - this is called every time the animation loop is called, `elapsedTime` gives the time since last call

 - `this.getSceneRadius()` - gives the bounding radius from `this.scene.position` of all the meshes in `this.scene`
 - `this.moveCameraToShowAll()` - conveniently moves `this.camera` to twice the distance of `this.getSceneRadius()`

 - `this.rotateCameraAroundScene ( xRotAngle, yRotAngle, zRotAngle, isRotateLights=true )` - rotates `this.camera` around `this.scene.position` with respect to the axes:
     - `z` - direction of `this.camera` to center
     - `y` - direction of `this.camera.up`
     - `x` - the other orthonormal direction
 - `this.setCameraZoomFromScene ( newZoom )` - moves `this.camera` to the distance `newZoom` from `this.scene` in current direction

 - `this.getDepth( pos )` - converts `pos` into a depth value relative to `this.scene.position` in the camera direction. Negative are in front of `this.scene.position`. Positive values are behind.
 - `this.getClickedMeshes()` - find the `this.clickedMesh` given the current scne

Methods inherited from `Widget`:

 - `this.mousescroll( wheel )` -
 - `this.mouseclick( x, y )`  -
 - `this.mousedoubleclick( x, y )`  -
 - `this.leftmousedrag( x0, y0, x1, y1 )`  -
 - `this.rightmousedrag( x0, y0, x1, y1 )`  -
 - `this.gesturedrag( rot, scale ) ` -

 - `this.draw()` - override this and call `super` to add extra drawing to your object, e.g. updating pop up windows and heads-up displays

 - `this.animate( elapsedTime )` - override this to animate your meshes



