import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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

export { scene, camera, renderer, controls };

