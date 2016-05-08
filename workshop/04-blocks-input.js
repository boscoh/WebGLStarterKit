import THREE from "three";
import { PopupText, WebglWidget } from "../webglstarterkit.js";


class MyWebglWidget extends WebglWidget {

    constructor( selector ) {

        super( selector, 'white' );

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

            mesh.initScale = new THREE.Vector3(mesh.scale.x, mesh.scale.y, mesh.scale.z);

            this.scene.add( mesh );

            this.clickableMeshes.push( mesh );

        }

        this.hover = new PopupText( this.selector, "lightblue", "blue" );

        this.moveCameraToShowAll();

        this.showBoxes = true;
        this.pulseBoxes = false;

    }

    draw() {

        super.draw();

        if ( this.clickedMesh ) {
            var screen = this.calcScreenXYOfPos( this.clickedMesh );
            this.hover.move( screen.x, screen.y );
        }

    }

    mouseclick( pointerX, pointerY ) {

        var intersectMeshes = this.getClickedMeshes();

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

        this.isChanged = true;

    }

    handleKeypress (event) {

        if (event.keyCode == 32) {
            this.showBoxes = !this.showBoxes;
        } else if (event.keyCode == 13) {
            this.pulseBoxes = !this.pulseBoxes;
        }

        this.clickableMeshes.forEach((mesh, i) => {
            if (i % 2 == 0) {
                mesh.visible = this.showBoxes;
            }
        });
    }

    animate ( elapsedTime, totalElapsedTime ) {

        if (this.pulseBoxes) {
            this.clickableMeshes.forEach((mesh, i) => {
                if (i % 2 == 1) {
                    let a = 1 + 0.2 * Math.sin(totalElapsedTime * 0.005);
                    let v = new THREE.Vector3().copy(mesh.initScale);
                    mesh.scale.copy(v.multiplyScalar(a));
                }
            });
        }

        if ( this.clickedMesh ) {
            let mesh = this.clickedMesh;
            let a = 1 + 0.3 * Math.sin(2* totalElapsedTime * 0.005);
            let v = new THREE.Vector3().copy(mesh.initScale);
            mesh.scale.copy(v.multiplyScalar(a));
        }

    }

}


var widget = new MyWebglWidget('#widget');

window.addEventListener(
    "resize", () => widget.resize());

document.addEventListener(
    'keydown', (e) => widget.handleKeypress(e));


