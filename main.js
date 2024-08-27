import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/17/Stats.js';


let width, height;
const canvas = document.getElementById('canvas');

const setSizes = () => {
    width = window.innerWidth;
    height = window.innerHeight;
}

setSizes();

window.addEventListener('resize', () => {
    setSizes();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

});

//ROOT BASIC VARIABLES
const colorBlue = 0x4763ad;
const colorLight = 0xf0f0f7;
const colorRed = 0xff2233;

//LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 3); // soft white light
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.position.set(0, 2, 5);
dirLight.lookAt(0, 0, 0);
const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight2.castShadow = true;
dirLight2.shadow.mapSize.width = 512;
dirLight2.shadow.mapSize.height = 512;
dirLight2.position.set(0, -2, -5);
dirLight2.lookAt(0, 0, 0);

// CAMERA
const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 500);
camera.name = "Camera_A";
camera.position.set(0, 3, 7);

// SCENE
const scene = new THREE.Scene({});
scene.background = new THREE.Color(colorLight);

// GEOMETRIES 
const geometry = new THREE.BoxGeometry(1, 1, 1);


// MATERIAL
const materialA = new THREE.MeshPhysicalMaterial({
    flatShading: true,
    color: colorBlue,
    fog: true,
    roughness: 0.5,
    metalness: 0.5,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: colorLight,
});

const materialB = new THREE.MeshPhysicalMaterial({
    flatShading: true,
    color: colorRed,
    fog: true,
    roughness: 0.5,
    metalness: 0.5,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: colorLight,
});

const materialLine = new THREE.LineBasicMaterial({ color: 0x223344 });


// MESH
let cubeA = new THREE.Mesh(geometry, materialA);
let cubeB = new THREE.Mesh(geometry, materialB);
cubeA.name = "cube";
cubeB.name = "cube";
cubeA.position.set(-1.5, 0, 0);
cubeB.position.set(1.5, 0, 0)

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false;
controls.target.set(0, 0, 0);
controls.update();


// STATS
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);


// ADD TO SCENE
scene.add(camera);
scene.add(ambientLight, dirLight, dirLight2);
scene.add(cubeA);
scene.add(cubeB);

// ANIMATION LOOP
const clock = new THREE.Clock();

const animation = () => {

    stats.begin();

    controls.update();
    renderer.render(scene, camera);
    TWEEN.update();
    stats.end();

    renderer.setAnimationLoop(animation);
}

animation();


// CLICKING EVENTS
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function drawLine(pointA) {
    const points = [];
    points.push(pointA);
    points.push(new THREE.Vector3(0, 0, 0));
    const geometryLine = new THREE.BufferGeometry().setFromPoints(points);
    let line = new THREE.Line(geometryLine, materialLine);
    scene.add(line);

    new TWEEN.Tween(line.scale).to({
        x: 5,
        y: 5,
        z: 5,
    }, 1500)
        .start();
}

function clicking(e) {

    pointer.x = (e.clientX / width) * 2 - 1;
    pointer.y = -(e.clientY / height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);


    let intersection = raycaster.intersectObjects(scene.children);
    console.log(intersection)

    if (intersection[0]) {
        let interCube = intersection.filter(item => { return item.object.name === "cube" });
        drawLine(interCube[0].point);
    }
}

window.addEventListener('click', clicking);