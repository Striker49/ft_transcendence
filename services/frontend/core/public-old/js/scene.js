import * as THREE from "three";

import { scene, camera, renderer, controls } from "./three/base.js";

import { updateGameScene } from "./game/main_backup.js";

//// Variables ////

// Lights
const ambientLight = new THREE.AmbientLight(0xFFFFFF);

// Helpers
const gridHelper = new THREE.GridHelper(200, 50);

// Torus Object
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 } );
const torus = new THREE.Mesh( geometry, material );

//// Functions ////

const init = () => {
	camera.position.set(0, 9, 0);
	scene.position.z = 1;

	renderer.setClearColor( 0xffffff, 0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;

	scene.add(torus);
	scene.add(ambientLight);
	scene.add(gridHelper);

	Array(200).fill().forEach(addStar);

	window.addEventListener("resize", onWindowResize);

	animate();
}

// Populate scene with stars
const addStar = () => {
	const geometry = new THREE.SphereGeometry(0.25, 4, 4);
	const material = new THREE.MeshStandardMaterial( {color: 0xFFFFFF} );
	const star = new THREE.Mesh( geometry, material );

	const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));

	star.position.set(x, y, z);
	scene.add(star);
};

// Adapt scene when resizing
const onWindowResize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
};

const updateMainScene = () => {
	torus.rotation.x += 0.01;
	torus.rotation.y += 0.005;
	torus.rotation.z += 0.01;
};

// Animation Loop
const animate = () => {

	requestAnimationFrame( animate );

	updateMainScene();

	updateGameScene();

	// Only necessary for certain effects like damping
	controls.update();

	renderer.render( scene, camera );
}

init();