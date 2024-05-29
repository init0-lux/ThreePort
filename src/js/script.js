import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import stars from '../img/stars.jpeg';
import nebula from '../img/stars.jpeg';
// this will import the image.img file as a constant image
// needs to be 1:1 ratio for cubeTextLoader.

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
//const ambientLight = new Three.AmbientLight(0xeeeeee);
//scene.add(ambientLight);

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
spotLight.decay = 0; // This was very important
spotLight.castShadow = true;
spotLight.angle = 0.12;

scene.add(spotLight);

// SpotLight Helper Object
const sLightHelper = new Three.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// Adding FOG
//scene.fog = new Three.Fog(0xFFFFFF, 0, 200); // method #1
// scene.fog = new Three.FogExp1(0xFFFFFF, 0.01); // fog grows exponentially with dist.

// set color
//renderer.setClearColor(0xFFEEAA);
// set background color
const textureLoader = new Three.TextureLoader();
//scene.background = textureLoader.load(stars); // sets just background to stars

// Cube texture loader
const cubeText = new Three.CubeTextureLoader();
scene.background = cubeText.load([
	stars,
	nebula,
	stars,
	nebula,
	stars,
	nebula
]);

// Dat.gui
const gui = new dat.GUI();

// adds color palette to the website
// and different options
const options = {
	sphereColor: "#ffea00",
	wireframe: false,
	speed: 0.01,

	angle: 0.2,
	penumbra: 0,
	intensity: 1
};

gui.addColor(options, 'sphereColor').onChange(function(e) {
	sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange( function(e){
	sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0.1, 0.5);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);

// Geometric Transformations
// box.rotation.x = 5;
// box.rotation.y = 0.01;

// new box with custom faces
const box2Geo = new Three.BoxGeometry(4, 4, 4);
const box2Mat = new Three.MeshStandardMaterial({
	color: 0xFF0000, // remove for not having any color
	map: textureLoader.load(stars)
	// the wallpaper will be red because of color = FF0000
});

// Multi material box
const box2MultiMat = [
	new Three.MeshBasicMaterial({map: textureLoader.load(stars)}),
	new Three.MeshBasicMaterial({color: 0xFF0000}),
	new Three.MeshBasicMaterial({map: textureLoader.load(stars)}),
	new Three.MeshBasicMaterial({color: 0xFF0000}),
	new Three.MeshBasicMaterial({map: textureLoader.load(stars)}),
	new Three.MeshBasicMaterial({color: 0xFF0000})
];

//const box2 = new Three.Mesh(box2Geo, box2Mat);
const box2 = new Three.Mesh(box2Geo, box2MultiMat);
scene.add(box2);
box2.position.set(0, 15, 20);

//////////// Making Sphere Bounce, and adding slider
//////////// to control bouncing speed
let step = 0;

// Mouse Interactions
const mousePos = new Three.Vector2();

window.addEventListener('mousemove', function(e){
	mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
	mousePos.y = (e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new Three.Raycaster();
const sphereId = sphere.id;
//const sphereId = 20;
function animate(time) {
	box.rotation.x = time / 1000; // this basically controls the speed
	box.rotation.y = time / 1000;

	step += options.speed;
	sphere.position.y = 4 + 10 * Math.abs( Math.sin(step) );
	// sinusoidal func => wave

	spotLight.angle = options.angle;
	spotLight.penumbra= options.penumbra;
	spotLight.intensity= options.intensity;
	sLightHelper.update();
	
	// set two ends of ray:- camera to mouse
	rayCaster.setFromCamera(mousePos, camera);
	const intersects = rayCaster.intersectObjects(scene.children);
	//console.log(intersects);

	for(let i = 0; i < intersects.length; i++){
		console.log(intersects[i].object.id, sphereId);
		if ( intersects[i].object.id === sphereId )
			intersects[i].object.material.color.set(0x0000FF);
	}

	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
