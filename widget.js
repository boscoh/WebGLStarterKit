

var $ = require("jquery");
var _ = require("underscore");
var THREE = require("three");



class Widget {

    constructor( selector ) {

        this.selector = selector;
        this.div = $( this.selector );
        this.divDom = this.div[0];

        // mouse/touch input parameters
        this.pointerX = null;
        this.pointerY = null;
        this.savePointerX;
        this.savePointerY;
        this.mousePressed = false;
        this.isGesture = false;
        this.gestureRot = 0;
        this.gestureScale = 1.0;

        this.changed = false;
    }


    bindCallbacks( dom ) {

        var bind = ( eventType, callback ) => {
            dom.addEventListener( eventType, callback );
        }

        bind( 'mousedown', e => this.mousedown( e ) );
        bind( 'mousemove', e => this.mousemove( e ) );
        bind( 'mouseup', e => this.mouseup( e ) );
        bind( 'mousewheel', e => this.mousewheel( e ) );
        bind( 'DOMMouseScroll', e => this.mousewheel( e ) );
        bind( 'touchstart', e => this.mousedown( e ) );
        bind( 'touchmove', e => this.mousemove( e ) );
        bind( 'touchend', e => this.mouseup( e ) );
        bind( 'touchcancel', e => this.mouseup( e ) );
        bind( 'gesturestart', e => this.gesturestart( e ) );
        bind( 'gesturechange', e => this.gesturechange( e ) );
        bind( 'gestureend', e => this.gestureend( e ) );

    }


    resize() {

        // override

    }


    width() {

        return this.div.width();

    }


    height() {

        return this.div.height();

    }


    calcPointerXY( event ) {

        // calculation of div position by traversing DOM tree
        var top = 0;
        var left = 0;
        var dom = this.divDom;
        if (dom.offsetParent) {
            left = dom.offsetLeft;
            top = dom.offsetTop;
            while (dom = dom.offsetParent) {
                left += dom.offsetLeft;
                top += dom.offsetTop;
            }
        }
        dom = this.divDom;
        do {
            left -= dom.scrollLeft || 0;
            top -= dom.scrollTop || 0;
        } while (dom = dom.parentNode);

        if ( !_.isUndefined( event.touches ) && ( event.touches.length > 0 ) ) {
            this.eventX = event.touches[ 0 ].clientX;
            this.eventY = event.touches[ 0 ].clientY;
        } else {
            this.eventX = event.clientX;
            this.eventY = event.clientY;
        }

        this.pointerX = this.eventX - left;
        this.pointerY = this.eventY - top;

    }


    savePointerXY() {

        this.savePointerX = this.pointerX;
        this.savePointerY = this.pointerY;

    }


    mousedown( event ) {

        this.calcPointerXY( event );

        event.preventDefault();

        this.mouseclick ( event );

        var now = ( new Date ).getTime();

        var isDoubleClick = ( now - this.timeLastPressed ) < 500;
        if ( isDoubleClick ) {
            this.mousedoubleclick( event ); 
        };

        this.timeLastPressed = now;

        this.savePointerXY();
        this.mousePressed = true;

    }


    mousemove( event ) {

        this.calcPointerXY( event );

        event.preventDefault();

        // skip if touch gesture has started
        if ( this.isGesture ) {
            return;
        }

        var shiftDown = ( event.shiftKey == 1 );

        var rightMouse = ( event.button == 2 ) || ( event.which == 3 );

        if ( this.mousePressed ) {

            if ( rightMouse || shiftDown ) {

                this.rightmousedrag(
                    this.savePointerX, this.savePointerY,
                    this.pointerX, this.pointerY );

            } else {

                this.leftmousedrag( 
                    this.savePointerX, this.savePointerY,
                    this.pointerX, this.pointerY );

            }

        }

        this.savePointerXY();

    }


    mouseup( event ) {

        this.calcPointerXY( event );

        event.preventDefault();

        if ( !_.isUndefined( event.touches ) ) {

            this.pointerX = null;
            this.pointerY = null;

        }

        this.mousePressed = false;

    }


    gesturestart( event ) {

        event.preventDefault();
        this.isGesture = true;
        this.gestureRot = 0;
        this.gestureScale = event.scale * event.scale;

    }


    gesturechange( event ) {

        event.preventDefault();
        gesturedrag( 
            event.rotation - this.gestureRot,
            this.gestureScale / event.scale )

        this.gestureRot = event.rotation;
        this.gestureScale = event.scale;

    }


    gestureend( event ) {

        event.preventDefault();
        this.isGesture = false;
        this.mousePressed = false;

    }


    mousewheel( event ) {

        event.preventDefault();

        if ( !_.isUndefined(event.wheelDelta) ) {
            var wheel = event.wheelDelta/120;
        } else {
            // for Firefox
            var wheel = -event.detail/12;
        }

        this.mousescroll( wheel );
    }


    // override these functions

    mousescroll( wheel ) { }

    mouseclick( event ) { }

    mousedoubleclick( event ) { }

    leftmousedrag( x0, y0, x1, y1 ) { }

    rightmousedrag( x0, y0, x1, y1 ) { }

    gesturedrag( rot, scale ) { }

    draw() {}

    isChanged() { return this.changed }

    animate() {}

}



// This is a separate file to allow multiple jolecule
// widgets to be animated in the same global event loop.

function registerWidgetForAnimation(widget) {

  var msPerStep = 25;

  var loop = function() {

    requestAnimationFrame( loop );

    if (window.animationWidgets == []) {
      return;
    }
    var currTime = (new Date).getTime();
    var elapsedTime = currTime - window.lastAnimationTime;
    var nStep = (elapsedTime)/msPerStep;
    if (nStep < 1) {
      nStep = 1;
    }
    nStep = Math.floor(nStep);
    for (var i=0; i<nStep; i++) {
      for (var j=0; j<window.animationWidgets.length; j++) {
        window.animationWidgets[j].animate();
      }
    }
    for (var j=0; j<window.animationWidgets.length; j++) {
      var display = window.animationWidgets[j];
      if (display.isChanged()) {
        display.draw();
      }
    }
    window.lastAnimationTime = currTime;
  }

  if (typeof window.animationWidgets == 'undefined') {
    window.animationWidgets = []
    window.lastAnimationTime = (new Date).getTime();
    loop();
  }

  window.animationWidgets.push(widget);
}




class WebGlWidget extends Widget {

    constructor( selector ) {

        super(selector);

        // determines how far away the camera is from the scene
        this.zoom = 1000.0;

        // the cutoff in front of the zoom, must be negative
        // and smaller than this.zoom
        this.zFront = -1000 + 1;
        this.zBack = 5000;


        this.backgroundColor = 0x000000


        // now create scene
        this.threeScene = new THREE.Scene();
        this.threeScene.fog = new THREE.Fog( this.backgroundColor, 1, 100 );
        this.threeScene.fog.near = this.zoom + 1;
        this.threeScene.fog.far = this.zoom + this.zBack;



        // stores light objects to rotate with camera motion
        this.lights = [];
        this.setLights();
        for ( let light of this.lights ) {
            this.threeScene.add( light );
        }


        // initial camera position at (0, 0, this.zoom)
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.width() / this.height(),
            this.zFront + this.zoom,
            this.zBack + this.zoom );

        this.camera.position
            .set( 0, 0, this.zoom )
            .add( this.threeScene.position );

        this.camera.lookAt( this.threeScene.position );


        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor( this.backgroundColor );
        this.renderer.setSize( this.width(), this.height() );

        this.threeDom = this.renderer.domElement;
        this.divDom.appendChild( this.threeDom );

        // stores any meshes that can be clicked
        this.clickableMeshes = [];
        this.clickedMesh = null;
        this.raycaster = new THREE.Raycaster();

        this.bindCallbacks( this.threeDom );

    }


    bind( eventType, callback ) {

        this.threeDom.addEventListener( eventType, callback );

    }

    resize() {

        this.camera.aspect = this.width() / this.height();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( this.width(), this.height() );

    }


    setLights() {

        var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
        directionalLight.position.set( 0.2, 0.2, 100 ).normalize();
        directionalLight.intensity = 1.2;
        this.lights.push( directionalLight );

        this.lights.push( new THREE.AmbientLight( 0x202020 ) );

    }


    draw() {

        this.renderer.render( this.threeScene, this.camera );

    }


    animate() {

    }


    adjustCamera ( xRotAngle, yRotAngle, zRotAngle, zoomRatio ) {

        var y = this.camera.up;

        var cameraDiff = this.camera.position.clone()
            .sub( this.threeScene.position );

        this.zoom = cameraDiff.length();

        var z = cameraDiff.clone().normalize();

        var x = new THREE.Vector3()
            .crossVectors( y, z )
            .normalize();

        var rotZ = new THREE.Quaternion()
            .setFromAxisAngle( z, zRotAngle );

        var rotY = new THREE.Quaternion()
            .setFromAxisAngle( y, -yRotAngle );

        var rotX = new THREE.Quaternion()
            .setFromAxisAngle( x, -xRotAngle );

        var rotation = new THREE.Quaternion()
            .multiply( rotZ )
            .multiply( rotY )
            .multiply( rotX );

        var newZoom = zoomRatio * this.zoom;

        if ( newZoom < 2 ) {
            newZoom = 2;
        }

        this.camera.position
            .sub( this.threeScene.position )
            .applyQuaternion( rotation )
            .normalize()
            .multiplyScalar( newZoom )
            .add( this.threeScene.position );

        this.camera.lookAt( this.threeScene.position );

        this.camera.up.applyQuaternion( rotation );


        for ( let light of this.lights ) {
            light.position.applyQuaternion( rotation );
        }


        this.changed = true;

    }


    calcScreenXYOfPos( obj ) {

        var widthHalf = 0.5 * this.width();
        var heightHalf = 0.5 * this.height();

        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition( obj.matrixWorld );
        vector.project( this.camera );

        return new THREE.Vector2()
            .set(
                 ( vector.x * widthHalf )  + widthHalf,
                -( vector.y * heightHalf ) + heightHalf
            );

    }


    getClickedMeshes( event ) {

        this.calcPointerXY( event );

        var screenXY = new THREE.Vector2()
            .set(
                - 1 + this.pointerX / this.width()  * 2, 
                + 1 - this.pointerY / this.height() * 2 
            );

        this.raycaster.setFromCamera( screenXY, this.camera );

        return this.raycaster.intersectObjects( this.clickableMeshes );

    }


    leftmousedrag( x0, y0, x1, y1 ) {

        this.adjustCamera(
            this.degToRad( y1 - y0 ), 
            this.degToRad( x1 - x0 ),
            0, 
            1 );

    }


    rightmousedrag( x0, y0, x1, y1 ) {

        var calcRadial = (x, y) => {

            x -= this.width() / 2;
            y -= this.height() / 2;

            var r = Math.sqrt( x * x + y * y );
            var t = Math.atan( y / x );
            if ( x < 0 ) {
                if ( y > 0 ) {
                    t += Math.PI;
                } else {
                    t -= Math.PI;
                }
            }

            return [ r, t ]
        }

        var [ r0, t0 ] = calcRadial( x0, y0 );
        var [ r1, t1 ] = calcRadial( x1, y1 );

        var ratio = 1.0
        if ( r1 > 0.0 ) {
            ratio = r0/r1;
        }

        this.adjustCamera(
            0,
            0, 
            t1 - t0,
            ratio );
   
    }


    degToRad( deg ) {

        return deg * Math.PI / 180.;

    }


    mousescroll( wheel ) {

        var ratio = Math.pow(1 + Math.abs(wheel)/2 , wheel > 0 ? 1 : -1);
        this.adjustCamera( 0, 0, 0, ratio );

    }


    gesturedrag( rotDiff, ratio ){

        this.adjustCamera(
            0,
            0,
            this.degToRad( rotDiff*2 ),
            ratio*ratio );

    }


    gesturestart( event ) {

        event.preventDefault();
        this.isGesture = true;
        this.gestureRot = 0;
        this.gestureScale = event.scale * event.scale;

    }


    gestureend( event ) {

        event.preventDefault();
        this.isGesture = false;
        this.mousePressed = false;

    }


}



module.exports = { Widget, WebGlWidget, registerWidgetForAnimation }


