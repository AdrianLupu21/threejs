import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

export class Object3D{

    scale = [20, 20, 20];
    highlight = true;
    texture = null;
    texturePath = null;

    constructor(objPath, texturePath){
        this.objPath = objPath;
        this.texturePath = texturePath;
    }

    addTexture(){
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            // resource URL
            this.texturePath,
        
            // onLoad callback
            (texture) => {
                console.log("loading texture "+ this.texturePath)
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.magFilter = THREE.NearestFilter;
                this.texture = texture;
            },
        
            // onProgress callback currently not supported
            undefined,
        
            // onError callback
            function ( err ) {
                console.error( 'An error happened.' );
            }
        );
    }
    /**
     * @param {any} newScale
     */
    set scale(newScale){}

    /**
     * @param {any} isHighlight
     */
    set highlight(isHighlight){}

    loadObj(position, rotation, scene, id){
        const loader = new OBJLoader();
        const self = this;
        loader.load(this.objPath, function (objModel){
            let meshMaterial;
            if(typeof self.texturePath !== 'undefined'){
                self.addTexture();
                meshMaterial = new THREE.MeshBasicMaterial(
                    {map:self.texture}
                )
            }else{
                meshMaterial = new THREE.MeshPhysicalMaterial({
                    color: 0xb2ffc8,
                    metalness: 0.25,
                    roughness: 0.1,
                    opacity: 1.0,
                    transparent: true,
                    transmission: 0.99,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.25
                })
            }
            
            objModel.material = meshMaterial;

            // objModel.traverse( function ( child ) {
    
            //     if ( child instanceof THREE.Mesh ) {
            //        // console.log("adding texture to" + child);
            //         child.material.map = myTexture;
    
            //     }
    
            // } );
 
            objModel.castShadow = true;
            objModel.receiveShadow = true;
    
            objModel.position.x = position.hasOwnProperty("x") ? position['x'] : 0;
            objModel.position.y = position.hasOwnProperty("y")  ? position['y']: -0.45;
            objModel.position.z = position.hasOwnProperty("z") ? position['z'] : 0;
    
            objModel.rotation.x = rotation.hasOwnProperty("rX") ? rotation['rX'] : - Math.PI/2;
            objModel.rotation.y = rotation.hasOwnProperty("rY") ? rotation['rY'] : 0;
            objModel.rotation.z = rotation.hasOwnProperty("rZ") ? rotation['rZ'] : 0;
    
            objModel.scale.set(self.scale[0], self.scale[1], self.scale[2]);
            

            objModel.uuid = id;
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


    loadGltf(position, rotation, scene){
        const loader = new GLTFLoader();
        const self = this;
        loader.load(this.objPath, function (objModel){
            let meshMaterial;
            if(typeof self.texturePath !== 'undefined'){
                self.addTexture();
                meshMaterial = new THREE.MeshBasicMaterial(
                    {map:self.texture}
                )
            }else{
                meshMaterial = new THREE.MeshPhysicalMaterial({
                    color: 0xb2ffc8,
                    metalness: 0.25,
                    roughness: 0.1,
                    opacity: 1.0,
                    transparent: true,
                    transmission: 0.99,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.25
                })
            }
            
            objModel.material = meshMaterial;

            // objModel.traverse( function ( child ) {
    
            //     if ( child instanceof THREE.Mesh ) {
            //        // console.log("adding texture to" + child);
            //         child.material.map = myTexture;
    
            //     }
    
            // } );
 
            objModel.castShadow = true;
            objModel.receiveShadow = true;
    
            objModel.position.x = position.hasOwnProperty("x") ? position['x'] : 0;
            objModel.position.y = position.hasOwnProperty("y")  ? position['y']: -0.45;
            objModel.position.z = position.hasOwnProperty("z") ? position['z'] : 0;
    
            objModel.rotation.x = rotation.hasOwnProperty("rX") ? rotation['rX'] : - Math.PI/2;
            objModel.rotation.y = rotation.hasOwnProperty("rY") ? rotation['rY'] : 0;
            objModel.rotation.z = rotation.hasOwnProperty("rZ") ? rotation['rZ'] : 0;
    
            objModel.scale.set(self.scale[0], self.scale[1], self.scale[2]);
            
           scene.add(objModel); 
        });
    }
    
}