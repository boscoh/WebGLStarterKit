import THREE from "three";
import { WebglWidget } from "../webglstarterkit.js";


class MyWebglWidget extends WebglWidget {

    constructor( selector ) {

        super( selector );

        let material = new THREE.MeshLambertMaterial(
            { color: 0xffff00 } );

        const TILE_SIZE = 90
        let cylinder = new THREE.CylinderGeometry(
            1, TILE_SIZE*3, TILE_SIZE*3, 4 );
        this.scene.add( new THREE.Mesh( cylinder, material ) );

        let sphere = new THREE.SphereGeometry( 90, 10, 10 );
        let mesh = new THREE.Mesh( sphere, material )
        mesh.position.set( 0, 90, 0 )
        this.scene.add( mesh );

        this.moveCameraToShowAll();

        this.rotateAngPerStep = 0.02
    }

    animate( timeElapsed ) {

        this.rotateCameraAroundScene(0, this.rotateAngPerStep, 0);

    }

}


var widget = new MyWebglWidget('#widget');

window.addEventListener(
    "resize", () => widget.resize());



