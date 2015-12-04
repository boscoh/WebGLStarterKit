

var $ = require("jquery");
var _ = require("underscore");
var THREE = require("three");


////////////////////////////////////////////////////////////////////
// A Base Widget Class to wrap <div>'s in the DOM
// bind callbacks and handle mouse/touch input
// Also contains a resize, animate and draw functionality
// for tying together animation loops
////////////////////////////////////////////////////////////////////

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

        this.isChanged = false;
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

        this.mouseclick ( this.pointerX, this.pointerY );

        var now = ( new Date ).getTime();

        var isDoubleClick = ( now - this.timeLastPressed ) < 500;
        if ( isDoubleClick ) {
            this.mousedoubleclick( this.pointerX, this.pointerY ); 
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

    mouseclick( x, y ) { }

    mousedoubleclick( x, y ) { }

    leftmousedrag( x0, y0, x1, y1 ) { }

    rightmousedrag( x0, y0, x1, y1 ) { }

    gesturedrag( rot, scale ) { }

    draw() {}

    animate( elapsedTime ) {}

}


////////////////////////////////////////////////////////////////////
// A global animation loop manager, requires objects with the
// interface:
// - .animate( timeElapsed )
// - .isChanged
// - .draw()
////////////////////////////////////////////////////////////////////

function registerWidgetForAnimation(widget) {

    var loop = function() {
  
        requestAnimationFrame( loop );
    
        if (window.animationWidgets.length == 0 ) {
            return;
        }
    
        var currTime = (new Date).getTime();
        var elapsedTime = currTime - window.lastAnimationTime;
        for (let widget of window.animationWidgets) {
            widget.animate( elapsedTime );
        }
        window.lastAnimationTime = currTime;
    
        for (let widget of window.animationWidgets) {
            if (widget.isChanged) {
                widget.draw();
            }
        }
  
    }
  
    if (typeof window.animationWidgets == 'undefined') {
        window.animationWidgets = []
        window.lastAnimationTime = (new Date).getTime();
        loop();
    }
  
    window.animationWidgets.push(widget);
}



////////////////////////////////////////////////////////////////////
// A Starter WebGLWidget to embed in a <div> determined by selector
// Subclass this! Add models and controllers, override 
// input functions, and WebGL construction 
////////////////////////////////////////////////////////////////////

class WebGlWidget extends Widget {

    constructor( selector, backgroundColor=0x000000 ) {

        super(selector);

        // determines how far away the camera is from the scene
        this.zoom = 1000.0;

        // the cutoff in front of the zoom, must be negative
        // and smaller than this.zoom
        this.zFront = -1000 + 1;
        this.zBack = 5000;


        this.backgroundColor = backgroundColor


        // now create scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( this.backgroundColor, 1, 100 );
        this.scene.fog.near = this.zoom + 1;
        this.scene.fog.far = this.zoom + this.zBack;



        // stores light objects to rotate with camera motion
        this.lights = [];
        this.setLights();
        for ( let light of this.lights ) {
            this.scene.add( light );
        }


        // initial camera position at (0, 0, this.zoom)
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.width() / this.height(),
            this.zFront + this.zoom,
            this.zBack + this.zoom );

        this.camera.position
            .set( 0, 0, this.zoom )
            .add( this.scene.position );

        this.camera.lookAt( this.scene.position );


        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor( this.backgroundColor );
        this.renderer.setSize( this.width(), this.height() );

        this.renderDom = this.renderer.domElement;
        this.divDom.appendChild( this.renderDom );

        // stores any meshes that can be clicked
        this.clickableMeshes = [];
        this.clickedMesh = null;
        this.raycaster = new THREE.Raycaster();

        this.bindCallbacks( this.renderDom );

        registerWidgetForAnimation( this );

    }


    resize() {

        this.camera.aspect = this.width() / this.height();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( this.width(), this.height() );
        this.isChanged = true;
    }


    setLights() {

        var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
        directionalLight.position.set( 0.2, 0.2, 100 ).normalize();
        directionalLight.intensity = 1.2;
        this.lights.push( directionalLight );

        this.lights.push( new THREE.AmbientLight( 0x202020 ) );

    }


    draw() {

        this.renderer.render( this.scene, this.camera );

    }


    animate( elapsedTime ) {

        var msPerStep = 25;

        var nStep = (elapsedTime)/msPerStep;
        if (nStep < 1) {
          nStep = 1;
        }
        nStep = Math.floor(nStep);
        for (var i=0; i<nStep; i++) {
        }

    }


    getSceneRadius() {

        var sceneRadius = 0.0;

        this.scene.traverse ((object) =>
        {
            if (object instanceof THREE.Mesh)
            {
                var objectCenter = object.position.clone();
                objectCenter.applyMatrix4( object.matrixWorld );

                var dCenter = this.scene.position.distanceTo(
                    objectCenter);

                object.geometry.computeBoundingSphere();
                var objectRadius = 
                    dCenter + object.geometry.boundingSphere.radius;

                sceneRadius = Math.max(objectRadius, sceneRadius);
            }
        });       

        return sceneRadius;

    }


    fitCameraToShowAll() {

        var sceneRadius = this.getSceneRadius();
        this.changeZoom(2*sceneRadius);
        this.near = 0;
        this.far = sceneRadius;

    }


    rotateCamera ( xRotAngle, yRotAngle, zRotAngle, isRotateLights=true ) {

        var y = this.camera.up;

        var cameraDiff = this.camera.position.clone()
            .sub( this.scene.position );

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

        this.camera.position
            .sub( this.scene.position )
            .applyQuaternion( rotation )
            .normalize()
            .multiplyScalar( this.zoom )
            .add( this.scene.position );

        this.camera.lookAt( this.scene.position );

        this.camera.up.applyQuaternion( rotation );

        if ( isRotateLights ) {
            for ( let light of this.lights ) {
                light.position.applyQuaternion( rotation );
            }
        }


        this.isChanged = true;

    }


    changeZoom ( newZoom ) {

        this.camera.position
            .sub( this.scene.position )
            .normalize()
            .multiplyScalar( newZoom )
            .add( this.scene.position );

        this.zoom = newZoom;

        this.camera.lookAt( this.scene.position );

        this.isChanged = true;

    }


    getDepth( pos ) {

        var origin = this.scene.position;

        var cameraDir = origin.clone()
            .sub( this.camera.position )
            .normalize();

        var posRelativeToOrigin = pos.clone()
            .sub( origin );

        return posRelativeToOrigin.dot( cameraDir );

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


    getClickedMeshes() {

        var screenXY = new THREE.Vector2()
            .set(
                - 1 + this.pointerX / this.width()  * 2, 
                + 1 - this.pointerY / this.height() * 2 
            );

        this.raycaster.setFromCamera( screenXY, this.camera );

        return this.raycaster.intersectObjects( this.clickableMeshes );

    }


    leftmousedrag( x0, y0, x1, y1 ) {

        this.rotateCamera(
            this.degToRad( y1 - y0 ), 
            this.degToRad( x1 - x0 ),
            0)

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

        this.changeZoom( this.zoom * ratio );
   
    }


    degToRad( deg ) {

        return deg * Math.PI / 180.;

    }


    mousescroll( wheel ) {

        var ratio = Math.pow(1 + Math.abs(wheel)/2 , wheel > 0 ? 1 : -1);
        this.changeZoom( this.zoom * ratio );

    }


    gesturedrag( rotDiff, ratio ){

        this.rotateCamera( 0, 0, this.degToRad( rotDiff*2 ) );
        this.changeZoom( this.zoom * ratio*ratio );

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


////////////////////////////////////////////////////////////////////
// PopupText
////////////////////////////////////////////////////////////////////

class PopupText {

    constructor( selector, backgroundColor='white', textColor='black', opacity=0.7 ) {

        this.textDiv = $( "<div>" )
            .css( {
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'z-index': 100,
                'background': backgroundColor,
                'color': textColor,
                'padding': '5',
                'opacity': opacity,
                'display': 'none',
                'pointer-events': 'none',
            } );

        this.arrowDiv = $( "<div>" )
            .css( {
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'z-index': 100,
                'width': 0,
                'height': 0,
                'border-left': '5px solid transparent',
                'border-right': '5px solid transparent',
                'border-top': '50px solid ' + backgroundColor,
                'opacity': opacity,
                'display': 'none',
                'pointer-events': 'none',
            } );

        this.mainDiv = $( selector );
        this.mainDiv.append( this.textDiv );
        this.mainDiv.append( this.arrowDiv );

    }


    move( x, y ) {

        var mainDivPos = this.mainDiv.position();
        var width = this.textDiv.innerWidth();
        var height = this.textDiv.innerHeight();

        if ( ( x < 0 ) || ( x > this.mainDiv.width() ) || ( y < 0 ) ||
            ( y > this.mainDiv.height() ) ) {
            this.hide();
            return;
        }

        this.textDiv.css( {
            'top': y - height - 50 + mainDivPos.top,
            'left': x - width / 2 + mainDivPos.left,
            'display': 'block',
            'font-family': 'sans-serif',
            'cursor': 'pointer'
        } );

        this.arrowDiv.css( {
            'top': y - 50 + mainDivPos.top,
            'left': x - 5 + mainDivPos.left,
            'display': 'block',
        } );

    }


    hide() {

        this.textDiv.css( 'display', 'none' );
        this.arrowDiv.css( 'display', 'none' );

    }


    html( text ) {

        this.textDiv.html( text );

    }


    remove() {

        this.textDiv.remove();
        this.arrowDiv.remove();

    }


}



module.exports = { 
    Widget, 
    WebGlWidget, 
    PopupText,
    registerWidgetForAnimation 
}


