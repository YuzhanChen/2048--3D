import {GLTFLoader} from './vendor/GLTFLoader.js';
import * as dat from 'dat.gui'

var GuiControls = function(){
    this.params = {};
    this.gui = new dat.GUI();
    this.add = function(targetLabel,initVal,valRangeFrom,valRangeTo){
        this.params[targetLabel] = initVal;
        if(valRangeFrom === undefined){
            return this.gui.add(this.params,targetLabel)
        }else{
            return this.gui.add(this.params,targetLabel,valRangeFrom,valRangeTo)
        }
    }
}
/**
 * load bufferGeometry from a gltf or glb file
 * @param {string} url - the url of a gltf or glb file
 */
var loadGeometryFromGLTF = function(url){
    var loader = new GLTFLoader();
    return new Promise(resolve=>{
        loader.load(
            url,
            function(gltf){
                resolve(gltf.scene.children[0].geometry.clone());
            }
        )
    })
}

export {GuiControls,loadGeometryFromGLTF};