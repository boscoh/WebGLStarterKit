
# WebGL Starter Kit

WebGL is awesome, and three.js makes it more so. But still, there is quite a lot to do to draw accelerated 3D graphics on your webpages.

At the very least you need:

- a scene
- a renderer
- a camera
- some lights
- an input loop
- an animation loop
- a link to the DOM

Beyond that, you might want to:

- resize to the DOM
- convert mouse/touch events
- handle camera movements
- raycast mouse clicks
- draw HUD elements over screen
- put camera in a nice place

That's a lot before a single polygon is drawn.

So to help you get started, we've wrapped up all these functions into a helpful `WebGLWidget` class, with some choice defaults.

You can override the defaults when you want to, and concentrate on building awesome 3D graphics.


# Install

Download the package:
	<https://github.com/boscoh/WebGLStarterKit/archive/master.zip>

Make sure you have installed `node.js`.

Then in the package:

    > npm install


# Typical workflow

Let's create a simple WebGL app `sample.js`:

    class MyWidget extends WebGLWidget {

        constructor( selector ) {
            super( selector );
        }

        /* make objects */
        let newObject = /* make your own object */
        this.scene.append( newObject )

        this.fitCameraToShowAll()
    }

Then instantiate your class, by giving it a DOM selector

    var myWidget = MyWidget('#widget')

Then use the following script to build your HTML page:

    > ./buildwebgl sample.js

Which will build `sample.compiled.js` and `sample.html`. 

Now open `sample.html`.


# Animation Loop

To allow for the possiblity of multiple WebGLWidgets in one page, all WebGLWidgets will be registered through a single animation loop. 

The animation loop works through the `registerWidgetForAnimation(widget)` function. It takes any object that has the interface:

- property `widget.isChanged` - indicates if draw should happen
- method `widget.draw()`  - draws at the right time
- method `widget.animate(timeElapsed)` - animates with the given elapsed time since last animate

The WebGLWidget instances will call this automatically, but you can always add yours onto the animation loop.

In this way, there is one single animation loop that animates all your widgets simultaneously between drawing calls. The animation loop is tied to the browser's drawing loop.


# Lights

If you want different lights, override the method:

    this.setLights() {
        let newLight = /* make your own */
        this.lights.append(newLight);
    }

When you rotate the camera and you want the light to follow the camera, make sure you set the parameter `isRotatingLights` in `this.rotateCameraAroundScene`. Otherwise, the light is static and you rotate around the shadows.

# Resizing 

The WebGL canvas needs to be manually resized. As such, if you have a resizable `<div>`, you need to set the resizing function:

    window.onresize = () => widget.resize();

This will resize the rendering canvas to the size of the surrounding `<div>`.

# Input

# Raycasting

# Heads-up Display

# WebGlWidget class


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
 - `this.fitCameraToShowAll()` - conveniently moves `this.camera` to twice the distance of `this.getSceneRadius()`

 - `this.rotateCamera ( xRotAngle, yRotAngle, zRotAngle, isRotateLights=true )` - rotates `this.camera` around `this.scene.position` with respect to the axes:
     - `z` - direction of `this.camera` to center
     - `y` - direction of `this.camera.up`
     - `x` - the other orthonormal direction
 - `this.changeZoom ( newZoom )` - moves `this.camera` to the distance `newZoom` from `this.scene` in current direction 

 - `this.getDepth( pos )` - converts `pos` into a depth value relative to `this.scene.position` in the camera direction. Negative are in front of `this.scene.position`. Positive values are behind.
 - `this.getClickedMeshes()` - find the `this.clickedMesh` given the current scne

Methods inherited from `Widget`:

 - `this.mousescroll( wheel )` - 
 - `this.mouseclick( x, y )`  - 
 - `this.mousedoubleclick( x, y )`  - 
 - `this.leftmousedrag( x0, y0, x1, y1 )`  - 
 - `this.rightmousedrag( x0, y0, x1, y1 )`  - 
 - `this.gesturedrag( rot, scale ) ` - 
 - `this.draw()` - 
 - `this.animate( elapsedTime )` {}


# Class PopupText

 - `constructor( selector, backgroundColor='white', textColor='black', opacity=0.7 )`
 - `this.move( x, y )`
 - `this.hide()`
 - `this.html( text )`
 - `this.remove()`



