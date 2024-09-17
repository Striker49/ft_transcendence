import * as THREE from 'three';
import { createPaddles } from './paddles.js'; 
import { createBall } from './ball.js';
import { createField } from './field.js';
import { createSides } from './sides.js';
import { createText } from './text.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 7500);
renderer.setAnimationLoop(animate);
camera.position.set(0, 0, 120 );
// camera.lookAt(50, 50, 50);

const scene = new THREE.Scene();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCSoftShadowMap;

const light = new THREE.AmbientLight(0xffffff);  // Ambient light
// const light = new THREE.SpotLight(0xffffff);  // Ambient light
light.position.set(0, 0, 20);
// light.castShadow = true;
scene.add(light);

// const lightHelper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(lightHelper);

//Can orbit around the field with mouse click and zoom with scroll
const controls = new TrackballControls( camera, renderer.domElement );
// controls.noPan = true;
// controls.target = new THREE.Vector3(0,0,0);
controls.update();

// const loader = new GLTFLoader();

// loader.load('resources/pong_table.glb', function (gltf) {
//     const model = gltf.scene;

//     // Modify the position of the loaded model
//     model.position.set(0, 0, -1);  // Set the model's position to (x: 10, y: 0, z: 0)
//     model.rotation.set(1.60, 0, 0);  // Set the model's position to (x: 10, y: 0, z: 0)
    
//     // Optional: scale or rotate the model
//     model.scale.set(3, 3, 3);  // Scale the model if necessary
//     scene.add(gltf.scene);
// }, undefined, function (error) {
//     console.error();
// });



createText(function (text) {
    scene.add(text); // Add the text mesh to the scene once it's ready
});

let paddles = [];
let balls = [];
let field = [];
let BB = [];
let helpers = [];

initObjects();
init_BB();
init_helper();

function initObjects() {
    const plane = createField();
    field[0] = plane;
    // plane.receiveShadow = true;
    // scene.add(plane);

    //Create sides
    const {side1, side2} = createSides();
    // field.push(side1, side2);
    field[1] = side1;
    field[2] = side2;

    // Create and add the paddles to the scene
    const {paddle1, paddle2} = createPaddles();
    paddles[0] = paddle1;
    paddles[1] = paddle2;

    // Create and add the ball to the scene
    const ball = createBall();
    balls[0] = ball;
    // balls[0].castShadow = true;
}

//Create bouncing box
function init_BB() {
    const paddle1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
    paddle1BB.setFromObject(paddles[0]);
    
    const paddle2BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
    paddle2BB.setFromObject(paddles[1]);
    
    const ballBB = new THREE.Box3(balls[0].computeBoundingSphere);
    ballBB.setFromObject(balls[0]);
    
    const side1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
    side1BB.setFromObject(field[1]);
    
    const side2BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
    side2BB.setFromObject(field[2]);
    
    BB.push(paddle1BB, paddle2BB, ballBB, side1BB, side2BB);
    
}

//Creating Hitboxes
function init_helper() {
    
    const helperPaddle1 = new THREE.Box3Helper( BB[0], 0xffff00);
    const helperPaddle2 = new THREE.Box3Helper( BB[1], 0xffff00);
    const helperBall = new THREE.Box3Helper( BB[2], 0xffff00);
    const helperSide1 = new THREE.Box3Helper( BB[3], 0xffff00);
    const helperSide2 = new THREE.Box3Helper( BB[4], 0xffff00);
    helpers.push(helperPaddle1, helperPaddle2, helperBall, helperSide1, helperSide2);
}

field.forEach(obj => {scene.add(obj)});
paddles.forEach(obj => {scene.add(obj)});
balls.forEach(obj => {scene.add(obj)});
helpers.forEach(obj => {scene.add(obj)});
// fieldBB.min.multiplyScalar(0.75);
// fieldBB.translate(new THREE.Vector3(-4, -3, 0));




// fieldBB.expandByScalar(-0.5);

let paddleYDirection = 1;   // Direction for paddle 1
let paddle2YDirection = -1;  // Direction for paddle 2

let ballYDirection = 2;
let ballXDirection = 1;

const paddleSpeed = 0.000;   // Speed of the movement
const ballSpeed = 0.001;   // Speed of the movement

// Function to check collision
function checkCollision() {
    // Update bounding boxes
    BB[0].setFromObject(paddles[0]);
    BB[1].setFromObject(paddles[1]);
    BB[2].setFromObject(balls[0]);

    //paddle1BB
    if (BB[0].intersectsBox(BB[2])) {
        // ball.material.transparent = true;
        // ball.material.opacity = 0.5;
        balls[0].material.color.set(new THREE.Color(Math.random() * 0xffffff));
        ballYDirection *= 1;
        ballXDirection *= -1;
        while (BB[3].intersectsBox(BB[2]))
        {
            balls[0].position.x += ballSpeed * ballXDirection;
            balls[0].position.y += ballSpeed * ballYDirection;
        }
    }
    //paddle2BB
    if (BB[1].intersectsBox(BB[2])) {
        // ball.material.transparent = true;
        // ball.material.opacity = 0.5;
        balls[0].material.color.set(new THREE.Color(Math.random() * 0xffffff));
        ballYDirection *= 1;
        ballXDirection *= -1;
        while (BB[4].intersectsBox(BB[2]))
        {
            balls[0].position.x += ballSpeed * ballXDirection;
            balls[0].position.y += ballSpeed * ballYDirection;
        }
    }
    if (BB[3].intersectsBox(BB[2])) {
        balls[0].material.color.set(new THREE.Color(Math.random() * 0xffffff));
        ballYDirection *= -1;
    }
    if (BB[4].intersectsBox(BB[2])) {
        balls[0].material.color.set(new THREE.Color(Math.random() * 0xffffff));
        ballYDirection *= -1;
    }
}

function animate() {
    checkCollision();
    requestAnimationFrame(animate);
    
    // Move the second paddle up and down (with different speed)
    paddles[1].position.y += paddleSpeed * paddle2YDirection;

    balls[0].position.x += ballSpeed * ballXDirection;
    balls[0].position.y += ballSpeed * ballYDirection;

    // Reverse direction if the second paddle reaches a certain height
    // if (paddle2.position.y > 14 || paddle2.position.y < -14) {
    //     paddle2YDirection *= -1;
    // }
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

// movement - please calibrate these values
let paddleXSpeed = 0.2;
let paddleYSpeed = 0.2;

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    let keyCode = event.which;
    if (keyCode == 87 && paddles[0].position.y + paddleYSpeed < 15) {
        paddles[0].position.y += paddleYSpeed;
	} else if (keyCode == 83 && paddles[0].position.y + paddleYSpeed > -12) {
        paddles[0].position.y -= paddleYSpeed;
    // } else if (keyCode == 65 && paddles[0].position.x + paddleYSpeed > -25) {
    //     paddles[0].position.x -= paddleXSpeed;
    // } else if (keyCode == 68 && paddles[0].position.x + paddleYSpeed < 0) {
    //     paddles[0].position.x += paddleXSpeed;
    } else if (keyCode == 67) {
        if (helpers[0].visible == true)
        {
            helpers.forEach(obj => {obj.visible = false});
        }
        else
            helpers.forEach(obj => {obj.visible = true});
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