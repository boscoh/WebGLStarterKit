

import THREE from "three";
import { WebGlWidget } from "../webglstarterkit.js";


class MyWebGlWidget extends WebGlWidget {

    constructor( selector ) {
        super( selector, 'white' );
        let material = new THREE.MeshPhongMaterial({
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading
        });
        let geom = new THREE.OctahedronGeometry(1, 2);
        this.scene.add( new THREE.Mesh( geom, material ) )
        this.moveCameraToShowAll();
    }

    animate( timeElapsed ) {
        this.rotateCameraAroundScene(0, 0.002, 0);
    }

}


var widget = new MyWebGlWidget('#widget');

window.addEventListener(
    "resize", () => widget.resize());



