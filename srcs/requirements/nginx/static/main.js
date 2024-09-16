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

// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCSoftShadowMap;

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



// loader.load('resources/fonts/helvetiker_regular.typeface.json', function (font) {
//     const geometry = new TextGeometry('0 - 0', {
//         font: font,
//         size: 15,
//         depth: 0.5,
//         height: 2,
//         curveSegments: 12,
//         bevelEnabled: true,
//         bevelThickness: 1,
//         bevelSize: 1,
//         bevelOffset: 0,
//         bevelSegments: 5
//     });
//     const material2 = new THREE.MeshStandardMaterial({ color: 0xffd700 });
//     const text = new THREE.Mesh(geometry, material2);
//     text.position.y = 30;
//     text.position.x = -22;
//     text.position.z = 0;
//     scene.add(text);
// });


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

const plane = createField();
// plane.receiveShadow = true;
scene.add(plane);

//Create sides
const { side1, side2 } = createSides();
scene.add(side1);
scene.add(side2);

// Create and add the field to the scene
// const field = createField();
// scene.add(field);

// Create and add the paddles to the scene
const { paddle1, paddle2 } = createPaddles();
scene.add(paddle1);
scene.add(paddle2);

// Create and add the ball to the scene
const { ball } = createBall();
// ball.castShadow = true;
scene.add(ball);



//Create bouncing box
const paddle1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
paddle1BB.setFromObject(paddle1);

const paddle2BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
paddle2BB.setFromObject(paddle2);

const ballBB = new THREE.Box3(ball.computeBoundingSphere);
ballBB.setFromObject(ball);

const side1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
side1BB.setFromObject(side1);

const side2BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
side2BB.setFromObject(side2);

//Creating Hitboxes
const helperSide1 = new THREE.Box3Helper( side1BB, 0xffff00);
const helperSide2 = new THREE.Box3Helper( side2BB, 0xffff00);
const helperPaddle1 = new THREE.Box3Helper( paddle1BB, 0xffff00);
const helperPaddle2 = new THREE.Box3Helper( paddle2BB, 0xffff00);
const helperBall = new THREE.Box3Helper( ballBB, 0xffff00);

// fieldBB.min.multiplyScalar(0.75);
// fieldBB.translate(new THREE.Vector3(-4, -3, 0));

const group = new THREE.Group();
group.add(helperSide1, helperSide2, helperPaddle1, helperPaddle2, helperBall);
scene.add(group);



//fieldBB.expandByScalar(-0.5);


let paddleYDirection = 1;   // Direction for paddle 1
let paddle2YDirection = -1;  // Direction for paddle 2

let ballYDirection = 2;
let ballXDirection = 1;

const paddleSpeed = 0.005;   // Speed of the movement
const ballSpeed = 0.001;   // Speed of the movement


// Function to check collision
function checkCollision() {
    // Update bounding boxes
    paddle1BB.setFromObject(paddle1);
    paddle2BB.setFromObject(paddle2);
    ballBB.setFromObject(ball);

    if (paddle1BB.intersectsBox(ballBB)) {
        // ball.material.transparent = true;
        // ball.material.opacity = 0.5;
        ball.material.color.set(new THREE.Color(Math.random() * 0xffffff));
        ballYDirection *= 1;
        ballXDirection *= -1;
        while (side1BB.intersectsBox(ballBB))
        {
            ball.position.x += ballSpeed * ballXDirection;
            ball.position.y += ballSpeed * ballYDirection;
        }
    }
    if (paddle2BB.intersectsBox(ballBB)) {
        // ball.material.transparent = true;
        // ball.material.opacity = 0.5;
        ball.material.color.set(new THREE.Color(Math.random() * 0xffffff));
        ballYDirection *= 1;
        ballXDirection *= -1;
        while (side2BB.intersectsBox(ballBB))
        {
            ball.position.x += ballSpeed * ballXDirection;
            ball.position.y += ballSpeed * ballYDirection;
        }
    }
    if (side1BB.intersectsBox(ballBB)) {
        ball.material.color.set(new THREE.Color(Math.random() * 0xffffff));
        ballYDirection *= -1;
    }
    if (side2BB.intersectsBox(ballBB)) {
        ball.material.color.set(new THREE.Color(Math.random() * 0xffffff));
        ballYDirection *= -1;
    }
}

function animate() {
    checkCollision();
    requestAnimationFrame(animate);
    
    // Move the second paddle up and down (with different speed)
    paddle2.position.y += paddleSpeed * paddle2YDirection;

    ball.position.x += ballSpeed * ballXDirection;
    ball.position.y += ballSpeed * ballYDirection;

    // Reverse direction if the second paddle reaches a certain height
    if (paddle2.position.y > 14 || paddle2.position.y < -14) {
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
    if (keyCode == 87 && paddle1.position.y + ySpeed < 15) {
        paddle1.position.y += ySpeed;
	} else if (keyCode == 83 && paddle1.position.y + ySpeed > -12) {
        paddle1.position.y -= ySpeed;
    // } else if (keyCode == 65 && paddle1.position.x + ySpeed > -25) {
    //     paddle1.position.x -= xSpeed;
    // } else if (keyCode == 68 && paddle1.position.x + ySpeed < 0) {
    //     paddle1.position.x += xSpeed;
    } else if (keyCode == 67) {
        if (group.visible == true)
            group.visible = false;
        else
            group.visible = true;
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