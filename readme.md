
# WebGL Starter Kit

WebGL is freakin` awesome, and three.js makes it even more so.

But still, there is quite a lot to do to get something running. At the very least you need:

- a scene
- a renderer
- a camera
- some lights
- an input loop
- an animation loop
- a link to the DOM

Beyond that, you might want to:

- resize from the DOM
- convert mouse/touch events
- raycast mouse clicks
- draw HUD elements over screen
- put camera in nice place

That's a lot before a single polygon is drawn.

So to help you get started, we've wrapped up all these functions into a helpful `WebGLWidget` class, with some choice defaults.

You can override the defaults when you want to, and concentrate on building awesome 3D graphics.


# Typical workflow

First you want to create your webgl widget in a file `sample.js`:

    class MyWidget extends WebGLWidget {

        constructor( selector ) {
            super( selector );
        }

        /* make objects */
        let newObject = /* make your own object */
        this.scene.append( newObject )

        this.fitCameraToShowAll()
    }

If you want different lights, override it:

    setLights() {
        let newLight = /* make your own */
        this.lights.append(newLight);
    }

Then instantiate your class, by giving it a DOM selector

    var myWidget = MyWidget('#widget')

Then use the following script to build your HTML page:

    ./buildwebgl sample.js

Which will build `sample.compiled.js` and `sample.html`. 

Now open `sample.html`.


# Resizing 


# WebGlWidget class

Constructor

 - `constructor(selector, backgroundColor='black')`

Properties:

 - `this.backgroundColor` - used to build scene and fog
 - `this.scene` - Three.js scene
 - `this.scene.fog` - Three.js fog added
 - `this.lights` - holds all lights, override `this.setLights` to build
 - `this.camera` - Three.js camera
 - `this.zoom` - distance between camera and `this.scene.position`
 - `this.renderer` - Three.js renderer
 - `this.renderDom` - DOM element bound to renderer
 - `this.divDom` - DOM element of `<div>` that contains canvas
 - `this.clickableMeshes` - list of all meshes for picking. Add meshes here if you want to keep track of them. You can always add properties to those meshses for further analysis
 - `this.clickedMesh` - top-most picked mesh [nothing picked=null]

Methods:

 - `this.resize()` - resize the renderer to fit the display and aspect ratio
 - `this.setLights()` - overrideable function to set your own lights, just push to `this.lights`
 - `this.draw()` - obvious
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

 - mousescroll( wheel ) - 
 - mouseclick( x, y )  - 
 - mousedoubleclick( x, y )  - 
 - leftmousedrag( x0, y0, x1, y1 )  - 
 - rightmousedrag( x0, y0, x1, y1 )  - 
 - gesturedrag( rot, scale )  - 
 - draw() - 
 - animate( elapsedTime ) {}


# Class PopupText

 - constructor( selector, backgroundColor='white', textColor='black', opacity=0.7 ) {
 - move( x, y ) {
 - hide() {
 - html( text ) {
 - remove() {


# Animation

registerWidgetForAnimation(widget)

