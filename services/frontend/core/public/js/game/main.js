import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Box } from './box.js';
import { Ball } from './ball.js';
import { keys } from './keys.js';
import { createText } from './text.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 9, 0);
scene.position.z = 1;

const light = new THREE.DirectionalLight(0xffffff, 0.3);  // For shadows (color, intensity)
const light2 = new THREE.AmbientLight(0xffffff, 1);  // (color, intensity)
light.position.z = 1;
light.position.y = 2;
light.castShadow = true;
scene.add(light);
scene.add(light, light2);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: document.querySelector('#bg')
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// To move the scene around with the mouse
const controls = new OrbitControls(camera, renderer.domElement);

let speed = 0.15;
let text, currentText;
let scoreP1 = 0;
let scoreP2 = 0;
let groundWidth = 13;
let paddleWidth = 0.5;
let ballAcceleration = 0.01;

//Create left paddle
const paddleL = new Box({
    width: paddleWidth,
    height: 0.5,
    depth: 2.5,
    velocity: {
        x: 0,
        y: -0.01,
        z: 0
    },
    position: {
        x: -((groundWidth / 2) - (paddleWidth / 2)),
        y: -1.25,
        z:0
    }
});
paddleL.castShadow = true;
scene.add(paddleL);


//Create right paddle
const paddleR = new Box({
    width: paddleWidth,
    height: 0.5,
    depth: 2.5,
    velocity: {
        x: 0,
        y: -0.01,
        z: 0
    },
    position: {
        x: ((groundWidth / 2) - (paddleWidth / 2)),
        y: -1.25,
        z: 0
    },
    color: 'red'
});
paddleR.castShadow = true;
scene.add(paddleR);

//Create ball
const ball = new Ball({
    radius: 0.18,
    width: 15,
    height: 15,
    velocity: {
        x: randomVelocity(),
        y: -0.01,
        z: randomVelocity()
    },
    position: {
        x: 0,
        y: -1.5,
        z: 0
    },
    color: 'yellow'
});
ball.castShadow = true;
scene.add(ball);

//Create ground
const ground = new Box({
    width: groundWidth, 
    height: 0.5,
    depth: 9,
    color: '#0369a1',
    position: {
        x: 0,
        y: -2,
        z: 0
    }
});
ground.receiveShadow = true;
scene.add(ground);

//Updates score text (alternates between old and new one)
function updateScore(text) {
    createText(function (text) {
        // Remove the old text if it exists
        if (currentText) {
            scene.remove(currentText);      // Remove the old text from the scene
            currentText.geometry.dispose(); // Dispose of the geometry
            currentText.material.dispose(); // Dispose of the material
        }
    
        text.castShadow = true;
        text.receiveShadow = true;
        text.position.x = -2.75;
        scene.add(text);
    
        // Store the reference to the new text
        currentText = text;
    }, scoreP1, scoreP2);
    

}

updateScore();

//Event listener for KEYDOWN
window.addEventListener('keydown', (event) => {
    // event.preventDefault();
    switch(event.code) {
        case 'KeyW':
            keys.w.pressed = true;
            break;        
        case 'KeyA':
            keys.a.pressed = true;
            break;
        case 'KeyS':
            keys.s.pressed = true;
            break;
        case 'KeyD':
            keys.d.pressed = true;
            break;
        case 'ArrowUp':
            keys.up.pressed = true;
            break;        
        case 'ArrowLeft':
            keys.left.pressed = true;
            break;
        case 'ArrowDown':
            keys.down.pressed = true;
            break;
        case 'ArrowRight':
            keys.right.pressed = true;
            break;
        case 'Space':
            controls.reset();
            break;
    }
})

//Event listener for KEYUP
window.addEventListener('keyup', (event) => {
    event.preventDefault();
    switch(event.code) {
        case 'KeyW':
            keys.w.pressed = false;
            break;        
        case 'KeyA':
            keys.a.pressed = false;
            break;
        case 'KeyS':
            keys.s.pressed = false;
            break;
        case 'KeyD':
            keys.d.pressed = false;
            break;
        case 'ArrowUp':
            keys.up.pressed = false;
            break;        
        case 'ArrowLeft':
            keys.left.pressed = false;
            break;
        case 'ArrowDown':
            keys.down.pressed = false;
            break;
        case 'ArrowRight':
            keys.right.pressed = false;
            break;
    }
})

//Resizes the image if the window changes size
// window.addEventListener( 'resize', onWindowResize, false );

// function onWindowResize(){

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();

//     renderer.setSize( window.innerWidth, window.innerHeight );

// }


let frames = 0;
function animate() {
    const animationID = requestAnimationFrame(animate);
    renderer.render(scene, camera);

    paddleL.velocity.z = 0;
    //Move left paddle if up/down key is pressed and will still be inbounds
    if (keys.w.pressed && (paddleL.back - speed >= ground.back))
        paddleL.velocity.z = -speed;
    else if (keys.s.pressed && (paddleL.front + speed <= ground.front)) {
        paddleL.velocity.z = speed;
    }

    paddleR.velocity.z = 0;
    //Move right paddle if up/down key is pressed and will still be inbounds
    if (keys.up.pressed && (paddleR.back - speed >= ground.back))
        paddleR.velocity.z = -speed;
    else if (keys.down.pressed && (paddleR.front + speed <= ground.front)) {
        paddleR.velocity.z = speed;
    }
    
    //updates paddles
    paddleR.update(ground);
    paddleL.update(ground);
    //updates ball depending if it's going towards left or right 
    // to check the corresponding paddle hitbox
    if (ball.velocity.x < 0)
        ball.update(paddleL, ground);
    else
        ball.update(paddleR, ground);
    frames++;
}

//Resets ball to 0 position with randomized velocities to change direction
export function resetBallPosition(ball, winner) {
    if (winner === 1)
        scoreP2++;
    else
        scoreP1++;
	ball.position.x = 0;
	ball.position.y = -1.5;
	ball.position.z = 0;
    ball.velocity.x = randomVelocity();
    ball.velocity.z = randomVelocity();

    updateScore();
}

//Generates a number between 0.06 and 0.1 and -0.1 and -0.06
function randomVelocity() {
    let number = Math.random() * (0.1 - 0.06) + 0.06;
    if (Math.random() > 0.5)
        number *= -1;
    return(number);
}
animate();