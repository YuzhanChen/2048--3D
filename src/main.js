import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Color,
    Fog,
    HemisphereLight,
    DirectionalLight,
    Mesh,
    MeshLambertMaterial,
    MeshPhongMaterial,
} from 'three';
// import Stats from './jsm/vendor/stats.module.js';
import { GLTFLoader } from './jsm/vendor/GLTFLoader.js';
import { OrbitControls } from './jsm/vendor/OrbitControls.js';
import { ground } from './jsm/ground.js';
import { GuiControls, loadGeometryFromGLTF } from './jsm/utils.js';
import { GameActions } from './jsm/GameActions.js';
import { TouchGuesture } from './jsm/TouchGuesture.js';

// use the webpack file-loader to manage model files. 
// you can replace them with url strings.
// import containerModelUrl from './assets/models/untitled3-container.glb';
// import cubesModelUrl from './assets/models/items_1.glb';
var containerModelUrl = "models/untitled3-container.glb";
var cubesModelUrl = "models/items_1.glb";

// GLOBAL VARS

// instances of THREE.PerspectiveCamera, THREE.Scene, THREE.WebGLRenderer
var camera, scene, renderer;
// array of instances of THREE.Mesh, which is cubes from number 2 to 2048
var cubes;
// game actions
var actions;
// orbit camera control
var orbitCtrls;
// touch control
var touchGuestureInstance;
// stats for FPS display
var stats
// gui control panel
var guiControls = new GuiControls();
//guiControls.gui.hide();
// ultra easy mode
var babyMode = false;

guiControls.add('easyMode', false).onChange((val) => {
    babyMode = val;
})

// 4 X 4 grid for the 2048 game
var grid = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
]



initEnv();
initMesh();
animate();
connectControls();


// INIT SCENE, CAMERA, LIGHTS, RENDERER, STATS, CAMERA CONTROL

function initEnv() {

    var container = document.body;

    camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 45, 30);
    guiControls.add("cameraDistance", 30, 15, 100).onChange(val => {
        camera.position.y = val * 1.5;
        camera.position.z = val;
        camera.lookAt(0, 0, 0);
    })

    scene = new Scene();
    scene.background = new Color().setHSL(0.6, 0, 1);
    scene.fog = new Fog(scene.background, 1, 5000);

    // HEMISPHERE LIGHT

    var hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    // DIRECTIONAL LIGHT

    var dirLight = new DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(0, 2, 1);
    dirLight.position.multiplyScalar(30);
    scene.add(dirLight);

    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    var d = 50;
    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = - 0.0001;

    // SKY
    // NO SKY FOR BETER PERFORMANCE

    // GROUND

    scene.add(ground);

    // RENDERER

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log([window.innerWidth, window.innerHeight]);
    container.appendChild(renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.shadowMap.enabled = true;

    // STATS

    //stats = new Stats();
    //container.appendChild( stats.dom );


    // CAMERA ORBIT CONTROL

    orbitCtrls = new OrbitControls(camera, renderer.domElement);
    orbitCtrls.target = scene.position;
    orbitCtrls.enabled = false;
    guiControls.add("unlockCameraControls", false).onChange(val => {
        orbitCtrls.enabled = val;
        touchGuestureInstance.setEnabled(!val);
    })

    window.addEventListener('resize', onWindowResize, false);
}

// LOAD AND INIT GAME MODELS

function loadCubes() {
    var cubes = []
    var loader = new GLTFLoader();
    var geometry, material;
    var pallete = [0xd4ac0d, 0xd68910, 0xca6f1e, 0xba4a00, 0xcb4335, 0xa93226, 0x884ea0, 0x7d3c98, 0x2e86c1, 0x2471a3, 0x2471a3, 0x2471a3, 0x2471a3, 0x2471a3, 0x2471a3, 0x2471a3]
    var i = 0;
    return new Promise(resolve => {
        loader.load(cubesModelUrl, glb => {
            for (var child of glb.scene.children) {
                geometry = child.geometry.clone();
                material = new MeshPhongMaterial({ color: pallete[i] });
                i++;
                cubes.push(new Mesh(geometry, material));
            }
            resolve(cubes);
        })
    })
}

function initMesh() {
    loadGeometryFromGLTF(containerModelUrl)
        .then(geo => {
            var containerMaterial = new MeshLambertMaterial({ color: 0xff820b });
            scene.add(new Mesh(geo.clone(), containerMaterial));
        })
    loadCubes().then(res => {
        cubes = res;
        actions = new GameActions(grid, scene, cubes);
        actions.randomPop();
        actions.randomPop();

        guiControls.add('Restart', () => {
            actions.restart();
        });


    })
}

// connect key and touch controls

function connectControls() {
    wasdControl();
    touchControl();
}
function touchControl() {
    touchGuestureInstance = new TouchGuesture();
    document.addEventListener("touchGuestureUp", slideUp);
    document.addEventListener("touchGuestureDown", slideDown);
    document.addEventListener("touchGuestureLeft", slideLeft);
    document.addEventListener("touchGuestureRight", slideRight);
}
function wasdControl() {
    document.addEventListener('keypress', function (ev) {
        if (ev.key === 's') {
            slideDown();
        } else if (ev.key === 'd') {
            slideRight();
        } else if (ev.key == 'w') {
            slideUp();
        } else if (ev.key == 'a') {
            slideLeft();
        }
    })
}

// main game logic:
// slide all the cubes in one direction, and a new cube appears in a random position

function slideDown() {
    actions.slideDown();
    if (!babyMode)
        actions.randomPop();
}
function slideUp() {
    actions.slideUp();
    if (!babyMode)
        actions.randomPop();
}
function slideLeft() {
    actions.slideLeft();
    if (!babyMode)
        actions.randomPop();
}
function slideRight() {
    actions.slideRight();
    if (!babyMode)
        actions.randomPop();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

// main animation loop

function animate() {
    requestAnimationFrame(animate);
    render();
    //stats.update();
}

function render() {
    renderer.render(scene, camera);
}


