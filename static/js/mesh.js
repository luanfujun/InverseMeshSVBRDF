
// import * as THREE from "https://threejs.org/build/three.module.js";
// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
// import { OBJLoader } from "https://threejs.org/examples/jsm/loaders/OBJLoader.js";

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";



function render(id, objpath, texpath) {
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8FBCD4);

    var renderer = new THREE.WebGLRenderer();
    var ratio = 1.34635417;
    var width = document.querySelector('#teaser_img').offsetWidth * 0.499;
    var height = width / ratio; 
    var camera = new THREE.PerspectiveCamera(75, 1.34635417, 0.1, 1000);
    renderer.setSize(width, height);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    document.querySelector(id).appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    const texture = new THREE.TextureLoader().load(texpath);
    
    var material = texpath != '' ? 
        new THREE.MeshBasicMaterial({ map:texture }) : 
        new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true});

    var lightHolder = new THREE.Group();

    var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);

    var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);    
    fillLight.position.set(100, 0, 100);

    var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    lightHolder.add(keyLight);
    lightHolder.add(fillLight);
    lightHolder.add(backLight);
    scene.add(lightHolder);
    
   
    function callbackOnLoad(object3d) {
        object3d.receiveShadow = true;
        object3d.castShadow = true;
        object3d.traverse( function ( child ) {

        if ( child instanceof THREE.Mesh ) {
            child.material = material;
        }

    } );

        scene.add(object3d);
    }

    var loader = new OBJLoader();
    loader.load(objpath, callbackOnLoad, null, null, null);

    camera.position.z = 1;

    console.log(scene.children);

    var animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        lightHolder.quaternion.copy(camera.quaternion);
        renderer.render(scene, camera);
    };

    animate();
}

$(document).ready(function(){
    render('#ipad', 'static/scan/rabbit.obj', 'static/scan/rabbit.jpg');
    render('#azure', 'static/scan/turtle.obj', '');
});