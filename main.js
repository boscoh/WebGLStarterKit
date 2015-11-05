

var $ = require("jquery");
var THREE = require("three");
var _ = require("underscore");
var { WebGlWidget, Widget, registerWidgetForAnimation } = 
    require("./widget.js");



////////////////////////////////////////////////////////////////////
// PopupText
////////////////////////////////////////////////////////////////////

class PopupText {

    constructor( selector ) {

        this.div = $( "<div>" )
            .css( {
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'z-index': 100,
                'background': 'white',
                'padding': '5',
                'opacity': 0.7,
                'display': 'none',
                'pointer-events': 'none',
            } );

        this.arrow = $( "<div>" )
            .css( {
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'z-index': 100,
                'width': 0,
                'height': 0,
                'border-left': '5px solid transparent',
                'border-right': '5px solid transparent',
                'border-top': '50px solid white',
                'opacity': 0.7,
                'display': 'none',
                'pointer-events': 'none',
            } );

        this.parentDiv = $( selector );
        this.parentDiv.append( this.div );
        this.parentDiv.append( this.arrow );

    }


    move( x, y ) {

        var parentDivPos = this.parentDiv.position();
        var width = this.div.innerWidth();
        var height = this.div.innerHeight();

        if ( ( x < 0 ) || ( x > this.parentDiv.width() ) || ( y < 0 ) ||
            ( y > this.parentDiv.height() ) ) {
            this.hide();
            return;
        }

        this.div.css( {
            'top': y - height - 50 + parentDivPos.top,
            'left': x - width / 2 + parentDivPos.left,
            'display': 'block',
            'font-family': 'sans-serif',
            'cursor': 'pointer'
        } );

        this.arrow.css( {
            'top': y - 50 + parentDivPos.top,
            'left': x - 5 + parentDivPos.left,
            'display': 'block',
        } );

    }


    hide() {

        this.div.css( 'display', 'none' );
        this.arrow.css( 'display', 'none' );

    }


    html( text ) {

        this.div.html( text );

    }


    remove() {

        this.div.remove();
        this.arrow.remove();

    }


}



////////////////////////////////////////////////////////////////////
// MyWebGlWidget
////////////////////////////////////////////////////////////////////

class MyWebGlWidget extends WebGlWidget {

    constructor( selector ) {

        super( selector );

        let geometry = new THREE.BoxGeometry( 40, 40, 40 );

        for ( let i = 0; i < 200; i ++ ) {

            let mesh = new THREE.Mesh( 
                geometry, 
                new THREE.MeshLambertMaterial( 
                    { color: Math.random() * 0xffffff } ) );

            mesh.position.x = Math.random() * 1000 - 500;
            mesh.position.y = Math.random() * 600 - 300;
            mesh.position.z = Math.random() * 800 - 400;

            mesh.rotation.x = Math.random() * 2 * Math.PI;
            mesh.rotation.y = Math.random() * 2 * Math.PI;
            mesh.rotation.z = Math.random() * 2 * Math.PI;

            mesh.scale.x = Math.random() * 2 + 1;
            mesh.scale.y = Math.random() * 2 + 1;
            mesh.scale.z = Math.random() * 2 + 1;

            this.threeScene.add( mesh );

            this.clickableMeshes.push( mesh );

        }

        this.hover = new PopupText( this.selector, "lightblue" );


    }

    draw() {

        super.draw();
        if ( this.clickedMesh ) {
            var screen = this.calcScreenXYOfPos( this.clickedMesh );
            this.hover.move( screen.x, screen.y );
        }

    }

    mouseclick( event ) {

        var intersectMeshes = this.getClickedMeshes( event );

        if ( intersectMeshes.length > 0 ) {

            var topMesh = intersectMeshes[ 0 ].object;

            if ( this.clickedMesh != topMesh ) {

                if ( this.clickedMesh ) 
                    this.clickedMesh.material.emissive.setHex( 
                        this.clickedMesh.currentHex );

                this.clickedMesh = topMesh;
                this.clickedMesh.currentHex = this.clickedMesh.material.emissive.getHex();
                this.clickedMesh.material.emissive.setHex( 0xff0000 );

                this.hover.html( this.clickedMesh.id );

            } else {

                if ( this.clickedMesh ) 
                    this.clickedMesh.material.emissive.setHex( 
                        this.clickedMesh.currentHex );

                    this.clickedMesh = null;
                    this.hover.hide();

            }
        }

        this.changed = true;

    }

}



var body = $(document.body)
    .append(
        $("<div>")
            .attr("id", "widget")
            .css({ 
                "width": "500px", 
                "height": "500px" 
            } ) );

console.log( 'Build WebGlWidget' );

var widget = new MyWebGlWidget('#widget');

registerWidgetForAnimation( widget );




