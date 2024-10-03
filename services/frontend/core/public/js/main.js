import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

//// Variables ////

// Scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({
	alpha: true,
	antialias: true,
	canvas: document.querySelector("#bg")
});

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

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

// Render every frame
const animate = () => {

	requestAnimationFrame( animate );

	torus.rotation.x += 0.01;
	torus.rotation.y += 0.005;
	torus.rotation.z += 0.01;

	if (window.location.href == "https://localhost/game") {
		
	}

	controls.update();

	renderer.render( scene, camera );
}

init();
