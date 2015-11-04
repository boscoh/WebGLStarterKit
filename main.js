

var $ = require("jquery");
var THREE = require("three");
var _ = require("underscore");
var { WebGlWidget, Widget } = require("./widget.js");



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

            }

        } else {

            if ( this.clickedMesh ) 
                this.clickedMesh.material.emissive.setHex( 
                    this.clickedMesh.currentHex );

            this.clickedMesh = null;

        }

        this.draw();

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

widget.draw();





