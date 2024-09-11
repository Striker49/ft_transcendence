import * as THREE from 'three';
import { createPaddles } from './paddles.js'; 
import { createBall } from './ball.js';
import { createField } from './field.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 7500);
renderer.setAnimationLoop(animate);
camera.position.set(0, 0, 100);
// camera.lookAt(50, 50, 50);

const scene = new THREE.Scene();

//Can orbit around the field with mouse click and zoom with scroll
const controls = new TrackballControls( camera, renderer.domElement );
camera.position.set( 0, 0, 100 );
// controls.noPan = true;
// controls.target = new THREE.Vector3(0,0,0);
controls.update();

// Create and add the field to the scene
const line = createField();
scene.add(line);

// Create and add the paddles to the scene
const { paddle1, paddle2 } = createPaddles();
scene.add(paddle1);
scene.add(paddle2);

// Create and add the ball to the scene
const { ball } = createBall();
scene.add(ball);


let paddleYDirection = 1;   // Direction for paddle 1
let paddle2YDirection = -1;  // Direction for paddle 2

const paddleSpeed = 0.001;   // Speed of the movement

function animate() {
    requestAnimationFrame(animate);

    // Move the second paddle up and down (with different speed)
    paddle2.position.y += paddleSpeed * paddle2YDirection;

    // Reverse direction if the second paddle reaches a certain height
    if (paddle2.position.y > 10 || paddle2.position.y < -10) {
        paddle2YDirection *= -1;
    }
	// scene.rotation.y += 0.0001;
	// scene.rotation.x += 0.0001;
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

// movement - please calibrate these values
var xSpeed = 2;
var ySpeed = 2;

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87 && paddle1.position.y + ySpeed < 13) {
        paddle1.position.y += ySpeed;
	} else if (keyCode == 83 && paddle1.position.y + ySpeed > -10) {
        paddle1.position.y -= ySpeed;
    } else if (keyCode == 65 && paddle1.position.x + ySpeed > -25) {
        paddle1.position.x -= xSpeed;
    } else if (keyCode == 68 && paddle1.position.x + ySpeed < 0) {
        paddle1.position.x += xSpeed;
    } else if (keyCode == 32) {
        controls.reset();
    }
};


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

// Start the animation
animate();