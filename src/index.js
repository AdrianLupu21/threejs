import * as THREE from 'three';
import { Loader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Interaction } from 'three.interaction/src/index.js';
import { Object3D } from './model/Object3D.js';

const addShadowedLight = function(x, y, z , color, intensity){
    const directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );

    directionalLight.castShadow = true;

    const d = 1;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.bias = - 0.002;
}

const scene = new THREE.Scene();
const loader = new OBJLoader();
scene.background = new THREE.Color( 0x72645b );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,2.5,2.5); 
camera.lookAt(new THREE.Vector3(0,0,0));


scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
addShadowedLight( 0.5, 1, - 1, 0xffaa00, 1 );


const renderer = new THREE.WebGLRenderer({ antialias: true } );
renderer.setSize(window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, renderer.domElement);
const interaction = new Interaction(renderer, scene, camera);

document.body.appendChild( renderer.domElement )
// const box = new THREE.BoxGeometry();
// const material = new THREE.MeshNormalMaterial({color: 0x00ff00 });
// const cube = new THREE.Mesh( box, material);

const generatePlane = function(){
    const geometry = new THREE.PlaneGeometry(40, 40);
    const material = new THREE.MeshPhongMaterial( {color: 0x999999, specular: 0x101010} );
    const plane = new THREE.Mesh( geometry, material );
    plane.position.y = -0.5;
    plane.rotation.x = - Math.PI/2; 
    plane.receiveShadow = true;
    //plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), 90);
    return plane;
}

const textureLoader = new THREE.TextureLoader();
let myTexture = textureLoader.load("texture/beach.jpg");

let materialTextured;
const addTexture = function(texturePath){
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
        // resource URL
        texturePath,
    
        // onLoad callback
        (texture) => {
            console.log("loading texture "+texturePath)
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.magFilter = THREE.NearestFilter;
            materialTextured = new THREE.MeshBasicMaterial({map: texture});
        },
    
        // onProgress callback currently not supported
        undefined,
    
        // onError callback
        function ( err ) {
            console.error( 'An error happened.' );
        }
    );
}


const loadStl = function (stlPath, position, rotation, scale=[20, 20, 20], highlight=true){
    loader.load(stlPath, function (objModel){
        let meshMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xb2ffc8,
                metalness: 0.25,
                roughness: 0.1,
                opacity: 1.0,
                transparent: true,
                transmission: 0.99,
                clearcoat: 1.0,
                clearcoatRoughness: 0.25
            })
        if(!highlight){
            meshMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x383735,
                roughness: 0.1,
                opacity: 1.0,
                transparent: true,
                transmission: 0.99,
                clearcoat: 1.0,
                clearcoatRoughness: 0.25
            })
        }
        
        console.log(materialTextured);
        objModel.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {
               // console.log("adding texture to" + child);
                child.material.map = myTexture;

            }

        } );
        // objModel.material = materialTextured;
        // let mesh;
        // if(stlPath == "stl/plan.obj"){
        //     mesh = new THREE.Mesh(geometry, materialTextured);
        // }else{
        //     mesh = new THREE.Mesh(geometry, meshMaterial);
        // }
        
        objModel.castShadow = true;
        objModel.receiveShadow = true;

        objModel.position.x = position.hasOwnProperty("x") ? position['x'] : 0;
        objModel.position.y = position.hasOwnProperty("y")  ? position['y']: -0.45;
        objModel.position.z = position.hasOwnProperty("z") ? position['z'] : 0;

        objModel.rotation.x = rotation.hasOwnProperty("rX") ? rotation['rX'] : - Math.PI/2;
        objModel.rotation.y = rotation.hasOwnProperty("rY") ? rotation['rY'] : 0;
        objModel.rotation.z = rotation.hasOwnProperty("rZ") ? rotation['rZ'] : 0;

        objModel.scale.set(scale[0], scale[1], scale[2]);
        mesh.uuid = "filter";
        // mesh.on("click", function(event){
        //     mesh.material = meshMaterial;
        //     if(highlight){
        //         $( "#frame" ).slideToggle("fast");
        //     }
        // });
        // mesh.on("mousemove", function(event){
        //     if(highlight)
        //     mesh.material = material;
        // })
        // mesh.on("mouseout", function(event){
        //     if(highlight)
        //     mesh.material = meshMaterial;
        // })
       scene.add(objModel);
    });
}



let object3D = new Object3D('stl/plan.obj', 'texture/beach.jpg')
let cladire1 = new Object3D('stl/cladire1.obj', 'texture/beach.jpg')
let cladire2 = new Object3D('stl/cladire2.obj', 'texture/beach.jpg')
let librarie = new Object3D('stl/librarie.obj', 'texture/beach.jpg')
let turn = new Object3D('stl/turn.obj', 'texture/beach.jpg')

librarie.scale = [0.01, 0.01, 0.01];
turn.scale = [0.01, 0.01, 0.01];
object3D.loadObj({}, {}, scene, "plan");
cladire1.loadObj({"z": 2.94, "y":0.1, "x":0.8} , {}, scene, "filter");
cladire2.loadObj({"z": 1.2, "y":0.1, "x":1.19}, {"rZ":  - Math.PI/2}, scene, "filter");
librarie.loadObj({"y":0, "z": -1}, {}, scene, "librarie");
turn.loadObj({"y":0, "x":-2.76, "z":0.3}, {}, scene, "turn");
//loadStl('stl/vehicul.stl');
// loadStl('stl/cladire.stl', {"z": 2.94, "y":0.1, "x":0.8} , {}, [20, 20, 20]);
// loadStl('stl/cladire2.stl', {"z": 1.2, "y":0.1, "x":1.19}, {"rZ":  - Math.PI/2});
//loadStl('stl/plan.obj', {}, {}, [20, 20, 20], false);
// loadStl('stl/depozit.stl', {"x":-3.51, "y":0, "z": 3.2}, {});
// loadStl('stl/librarie.stl', {"y":0, "z": -1}, {}, [0.01,0.01,0.01])
// loadStl('stl/turn.stl', {"y":0, "x":-2.76, "z":0.3}, {}, [0.01, 0.01, 0.01]);
// loadStl('stl/turn2.stl', {"y":0, "x":-2.76, "z":-2}, {}, [0.007, 0.007, 0.007]);

//scene.add(cube);
//scene.add(generatePlane());
camera.position.z = 5;


const animate = function () {
requestAnimationFrame( animate );

//cube.rotation.x += 0.01;
// cube.rotation.y += 0.01;

renderer.render( scene, camera );
};
animate();

document.getElementById("filter").onclick = function() {
    scene.traverse( function( object ) {

        if ( object.isMesh && object.parent.uuid == "filter") object.visible = false;
    
    } );
};

document.getElementById("reset").onclick = function() {
    scene.traverse( function( object ) {

        if ( object.isMesh ) object.visible = true;
    
    } );
};