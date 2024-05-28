import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const renderer = new Three.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

// Shadow map is not enabled by default
renderer.shadowMap.enabled = true;

document.body.appendChild( renderer.domElement );

// create scene
const scene = new Three.Scene();

// create camera
const camera = new Three.PerspectiveCamera(
	45, // field of view: 40 to 80
	window.innerWidth / window.innerHeight, // aspect ratio
	0.1, // near view
	1000 // far view
);

// Orbit Controls: Lets mouse interact
const orbit = new OrbitControls( camera, renderer.domElement );

const axesHelper = new Three.AxesHelper(2); // length of access
scene.add(axesHelper);

// camera.position.z = 5;
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.set(10, 30, 40);
orbit.update();

// Add a box
const boxGeometry = new Three.BoxGeometry(3, 3, 3); // usually will take more parameters
const boxMaterial = new Three.MeshBasicMaterial( {color: 0x000000 } );
const box = new Three.Mesh( boxGeometry, boxMaterial );
scene.add(box);

// Add a plane
const planeGeo = new Three.PlaneGeometry(30, 30);
const planeMat = new Three.MeshStandardMaterial({
	color: 0x00FFFF,
	side: Three.DoubleSide	
});
const plane = new Three.Mesh( planeGeo, planeMat );
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

// Grid
const gridHelper = new Three.GridHelper(30);
scene.add(gridHelper);

// Add Sphere
const sphereGeo = new Three.SphereGeometry(4, 50, 50);
// size, no of segments, curvature
//const sphereMat = new Three.MeshBasicMaterial({
//	color: 0x0000ff,
//	wireframe: true
//});

// MeshStandard will show nothing without light source
// Check documentation to see full list of Materials
// and/or vim autocomplete ftw;
const sphereMat = new Three.MeshStandardMaterial({
	color: 0x00FF00,
	wireframe: false
});

const sphere = new Three.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

sphere.position.set(-10, 10, 0);
sphere.castShadow = true;
// Lights
const ambientLight = new Three.AmbientLight(0xeeeeee);
scene.add(ambientLight);

//const dirLight = new Three.DirectionalLight(0xFFFFFF, 0.8);
//scene.add(dirLight);
//dirLight.position.set(-30, 50, 0);
//dirLight.castShadow = true;
//dirLight.shadow.camera.bottom = -12;
//// shadows by default look weird,
//// cuz shadows in three.js also use cameras
//
//// Directional Light Helper Class
//const dirHelper = new Three.DirectionalLightHelper(dirLight);
//scene.add(dirHelper);
//
//const dirShadowHelper = new Three.CameraHelper(dirLight.shadow.camera);
//scene.add(dirShadowHelper);

const spotLight = new Three.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;


const sLightHelper = new Three.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// Dat.gui
const gui = new dat.GUI();

// adds color palette to the website
// and different options
const options = {
	sphereColor: "#ffea00",
	wireframe: false,
	speed: 0.01
};

gui.addColor(options, 'sphereColor').onChange(function(e) {
	sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange( function(e){
	sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0.1, 0.5);

// Geometric Transformations
// box.rotation.x = 5;
// box.rotation.y = 0.01;

//////////// Making Sphere Bounce, and adding slider
//////////// to control bouncing speed
let step = 0;

function animate(time) {
	box.rotation.x = time / 1000; // this basically controls the speed
	box.rotation.y = time / 1000;

	step += options.speed;
	sphere.position.y = 4 + 10 * Math.abs( Math.sin(step) ); // sinusoidal func => wave

	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
