import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const renderer = new Three.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

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
camera.position.set(-10, 30, 30);
orbit.update();

// Add a box
const boxGeometry = new Three.BoxGeometry(3, 3, 3); // usually will take more parameters
const boxMaterial = new Three.MeshBasicMaterial( {color: 0x000000 } );
const box = new Three.Mesh( boxGeometry, boxMaterial );
scene.add(box);

// Add a plane
const planeGeo = new Three.PlaneGeometry(30, 30);
const planeMat = new Three.MeshBasicMaterial({
	color: 0x00FFFF,
	side: Three.DoubleSide	
});
const plane = new Three.Mesh( planeGeo, planeMat );
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;

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
const sphereMat = new Three.MeshStandardMaterial({
	color: 0x0000ff,
	wireframe: false
});
const sphere = new Three.Mesh(sphereGeo, sphereMat);
scene.add(sphere)

// Geometric Transformations
// box.rotation.x = 5;
// box.rotation.y = 0.01;

function animate(time) {
	box.rotation.x = time / 1000; // this basically controls the speed
	box.rotation.y = time / 1000;
	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

