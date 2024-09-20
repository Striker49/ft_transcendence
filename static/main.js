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
const light2 = new THREE.SpotLight(0xffffff, 0.25);  // Ambient light
light.position.set(0, 0, 20);
light2.position.set(0, 0, 20);
light2.castShadow = true;
scene.add(light, light2);

// const lightHelper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(lightHelper);

//Can orbit around the field with mouse click and zoom with scroll
const controls = new TrackballControls( camera, renderer.domElement );
// controls.noPan = true;
// controls.target = new THREE.Vector3(0,0,0);

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


let scoreP1 = 0;
let scoreP2 = 0;
let text, currentText;


let paddles = [];
let balls = [];
let field = [];
let BB = [];
let helpers = [];

updateScore(text);
initObjects();
init_BB();
init_helper();

function initObjects() {
    const plane = createField();
    field[0] = plane;
    plane.receiveShadow = true;
    // scene.add(plane);

    //Create sides
    const {side1, side2} = createSides();
    // field.push(side1, side2);
    field[1] = side1;
    field[2] = side2;
    field[1].castShadow = true;
    field[2].castShadow = true;

    // Create and add the paddles to the scene
    const {paddle1, paddle2} = createPaddles();
    paddles[0] = paddle1;
    paddles[1] = paddle2;
    paddles[0].castShadow = true;
    paddles[1].castShadow = true;


    // Create and add the ball to the scene
    const ball = createBall();
    balls[0] = ball;
    balls[0].castShadow = true;
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
    
    const planeBB = new THREE.Box3(new THREE.Vector3(0), new THREE.Vector3(0), new THREE.Vector3(0));
    planeBB.setFromObject(field[0]);
    planeBB.min.multiplyScalar(1.25);
    planeBB.max.multiplyScalar(1.25);
    planeBB.translate(new THREE.Vector3(0, 0, 2));
    BB.push(paddle1BB, paddle2BB, ballBB, side1BB, side2BB, planeBB);
    
}

//Creating Hitboxes
function init_helper() {
    
    const helperPaddle1 = new THREE.Box3Helper( BB[0], 0xffff00);
    const helperPaddle2 = new THREE.Box3Helper( BB[1], 0xffff00);
    const helperBall = new THREE.Box3Helper( BB[2], 0xffff00);
    const helperSide1 = new THREE.Box3Helper( BB[3], 0xffff00);
    const helperSide2 = new THREE.Box3Helper( BB[4], 0xffff00);
    const helperField = new THREE.Box3Helper( BB[5], 0xffff00);
    helpers.push(helperPaddle1, helperPaddle2, helperBall, helperSide1, helperSide2, helperField);
}

// field.forEach(obj => {scene.add(obj)});
// paddles.forEach(obj => {scene.add(obj)});
// balls.forEach(obj => {scene.add(obj)});
helpers.forEach(obj => {scene.add(obj)});
// fieldBB.min.multiplyScalar(0.75);
// fieldBB.translate(new THREE.Vector3(-4, -3, 0));




// fieldBB.expandByScalar(-0.5);

let paddleYDirection = 1;   // Direction for paddle 1
let paddle2YDirection = -1;  // Direction for paddle 2

let ballYDirection = 2;
let ballXDirection = 2;

const paddleSpeed = 0.005;   // Speed of the movement
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
    if (!BB[5].intersectsBox(BB[2]))
    {
        if (ballXDirection > 0)
            scoreP2++;
        else
            scoreP1++;
        updateScore(text);
        balls[0].position.x = 0;
        balls[0].position.y = 0;
        balls[0].position.z = 0;
    }
}

function updateScore(text) {
    createText(function (text) {
        // Remove the old text if it exists
        if (currentText) {
            scene.remove(currentText);      // Remove the old text from the scene
            currentText.geometry.dispose(); // Dispose of the geometry
            currentText.material.dispose(); // Dispose of the material
        }
    
        // Add the new text
        text.castShadow = true;
        text.receiveShadow = true;
        scene.add(text);   // Add the new text to the scene
    
        // Store the reference to the new text
        currentText = text;
    }, scoreP1, scoreP2);
    

}

// movement - please calibrate these values
let paddleXSpeed = 2;
let paddleYSpeed = 0.005;
let paddle1MovingUp = false;
let paddle1MovingDown= false;
let paddle2MovingUp = false;
let paddle2MovingDown= false;

function animate() {
    checkCollision();
    requestAnimationFrame(animate);
    
    // Move the first paddle up and down
    if (paddle1MovingUp)
        paddles[0].position.y += paddleYSpeed;
    if (paddle1MovingDown)
        paddles[0].position.y -= paddleYSpeed;
    
    if (paddle2MovingUp)
        paddles[1].position.y += paddleYSpeed;
    if (paddle2MovingDown)
        paddles[1].position.y -= paddleYSpeed;

    // Move the second paddle up and down (with different speed)
    // paddles[1].position.y += paddleSpeed * paddle2YDirection;

    balls[0].position.x += ballSpeed * ballXDirection;
    balls[0].position.y += ballSpeed * ballYDirection;

    // Reverse direction if the second paddle reaches a certain height
    // if (paddles[1].position.y > 14 || paddles[1].position.y < -14) {
    //     paddle2YDirection *= -1;
    // }

    paddles[0].position.y = Math.max(-14, Math.min(14, paddles[0].position.y));
    paddles[1].position.y = Math.max(-14, Math.min(14, paddles[1].position.y));

    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}


window.addEventListener("keydown", (event) => {
    event.preventDefault();
    if (event.code === "KeyW") {
        paddle1MovingUp = true;
	} 
    if (event.code === "KeyS") {
        paddle1MovingDown = true;
    }
    if (event.code === "ArrowUp") {
        paddle2MovingUp = true;
	} 
    if (event.code === "ArrowDown") {
        paddle2MovingDown = true;
    }
    // } else if (keyCode == 65 && paddles[0].position.x + paddleYSpeed > -25) {
    //     paddles[0].position.x -= paddleXSpeed;
    // } else if (keyCode == 68 && paddles[0].position.x + paddleYSpeed < 0) {
    //     paddles[0].position.x += paddleXSpeed;
    if (event.code === "KeyC") {
        if (helpers[0].visible == true)
            helpers.forEach(obj => {obj.visible = false});
        else
            helpers.forEach(obj => {obj.visible = true});
    }
    if (event.code === "Space") {
        controls.reset();
    }
});

window.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.code === "KeyW") {
        paddle1MovingUp = false;
	}
    if (event.code === "KeyS") {
        paddle1MovingDown = false;
    }
    if (event.code === "ArrowUp") {
        paddle2MovingUp = false;
	}
    if (event.code === "ArrowDown") {
        paddle2MovingDown = false;
    }
});


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


// Start the animation
animate();