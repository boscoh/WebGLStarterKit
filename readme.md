
# WebGL Starter Kit

WebGL is freakin` awesome. And three.js makes it even easier to be awesome.

But still, there is quite a lot to do to get something running. At the very least you need:

- a scene
- a renderer
- a camera
- some lights
- an input loop
- an animation loop


Beyond that, you might want to:

- resize from the DOM
- convert mouse/touch events
- raycast mouse clicks
- draw HUD elements over screen
- put camera in nice place

That's a lot of things to take care of before a single polygon is drawn.

So to help you get started, we've wrapped up all these functions in a helpful `WebGLWidget` class, where you can override some sensible defaults, only when you need to.

Get started straight away!


# Typical workflow

First you want to sub-class `WebGlWidget`:

    class MyWidget extends WebGLWidget {

    }

Then you build your `Three.js` objects in the constructor, and add to `this.scene`

Mess around with the lights if you want, or use the defaults.

Then instantiate your class, and attach it to the DOM:

    var myWidget = MyWidget('#widget')

Make sure your page has a `<div>` with that id. If not, build with `jquery`:

    import $ from "jquery"

    $('body').append('<div id="widget"></div>')

Attach the resize function to the window.

    $(window).resize( myWidget.resize )

Then do first draw:

    myWidget.draw()

And now attach to the animation loop:

    registerWidgetForAnimation( myWidget )

Now we're done. Messages will be sent to the `this.animate` and all the input functions.



# WebGlWidget class

Constructor

Properties:

 - this.backgroundColor - used to build scene and fog
 - this.scene - Three.js scene
 - this.scene.fog - Three.js fog added
 - this.lights - holds all lights, override `this.setLights` to build
 - this.camera - Three.js camera
 - this.zoom - distance between camera and `this.scene.position`
 - this.renderer - Three.js renderer
 - this.renderDom - DOM element bound to renderer
 - this.divDom - DOM element of `<div>` that contains canvas
 - this.clickableMeshes - list of all meshes for picking. Add meshes here if you want to keep track of them. You can always add properties to those meshses for further analysis
 - this.clickedMesh - top-most picked mesh [nothing picked=null]

Methods:

 - resize() - resize the renderer to fit the display and aspect ratio
 - setLights() - overrideable function to set your own lights, just push to `this.lights`
 - draw() - obvious
 - animate( elapsedTime ) - this is called every time the animation loop is called, `elapsedTime` gives the time since last call
 - getSceneRadius() - gives the bounding radius from `this.scene.position` of all the meshes in `this.scene`
 - fitCameraToShowAll() - conveniently moves `this.camera` to twice the distance of `this.getSceneRadius()`
 - rotateCamera ( xRotAngle, yRotAngle, zRotAngle, isRotateLights=true ) - rotates `this.camera` around `this.scene.position` with respect to the axes:
     - `z` - direction of `this.camera` to center
     - `y` - direction of `this.camera.up`
     - `x` - the other orthonormal direction
 - changeZoom ( newZoom ) - moves `this.camera` to the distance `newZoom` from `this.scene` in current direction 
 - getDepth( pos ) - converts `pos` into a depth value relative to `this.scene.position` in the camera direction. Negative are in front of `this.scene.position`. Positive values are behind.
 - getClickedMeshes() - find the `this.clickedMesh` given the current scne

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

