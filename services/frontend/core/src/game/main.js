import * as THREE from 'three'
import { scene, camera, renderer, controls } from "../threejs/base.js";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Box } from './box.js';
import { Ball } from './ball.js';
import { keys } from './keys.js';
import { createText } from './text.js';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(0, 9, 0);
// scene.position.z = 1;

const light = new THREE.DirectionalLight(0xffffff, 0.3);  // For shadows (color, intensity)
// const light2 = new THREE.AmbientLight(0xffffff, 1);  // (color, intensity)
light.position.z = -1;
light.position.y = 3;
light.castShadow = true;
light.shadow.camera.left = -50;
light.shadow.camera.right = 50;
light.shadow.camera.top = 50;
light.shadow.camera.bottom = -50;
light.shadow.mapSize.set(9192, 9192);
// scene.add(light, light2);

// const renderer = new THREE.WebGLRenderer({
//     alpha: true,
//     antialias: true,
//     canvas: document.querySelector('#bg')
// });
renderer.shadowMap.enabled = true;
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// To move the scene around with the mouse
// const controls = new OrbitControls(camera, renderer.domElement);

//Seting variable value
//<----need to fetch player name-------->
let isStarted = false;
let speed = 0.15;
let text, currentText;
let scoreP1, scoreP2;
let groundWidth = 13;
let paddleWidth = 0.5;
let ballAcceleration = 0.01;
let numberOfWins;
let powerUps = false;
let theme = 'Christmas';
let state = 0;

let paddleL;
let paddleR;
let ground;
let ball;

function startGame() {
    scene.add(light);
    scene.add(paddleL);
    scene.add(paddleR);
    scene.add(ball);
    scene.add(ground);
    
    updateScore(); // Make sure this function updates the score correctly
    state = 1;
}

function initGame() {

    scoreP1 = 0;
    scoreP2 = 0;
    numberOfWins = localStorage.getItem("numberOfWins") || 3;
    console.log('initGame', numberOfWins);
    theme = localStorage.getItem("theme") || 'none';
    //Create left paddle
    paddleL = new Box({
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
    // scene.add(paddleL);


    //Create right paddle
    paddleR = new Box({
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
    // scene.add(paddleR);

    //Create ball
    ball = new Ball({
        radius: 0.18,
        width: 15,
        height: 15,
        velocity: {
            x: 0,
            y: -0.01,
            z: 0
        },
        position: {
            x: 0,
            y: -1.25,
            z: 0
        },
        color: 'yellow'
    });
    ball.castShadow = true;
    // scene.add(ball);

    //Create ground
    ground = new Box({
        width: groundWidth, 
        height: 0.5,
        depth: 9,
        color: '#0369a1',
        position: {
            x: 0,
            y: -3,
            z: 0
        }
    });
    ground.receiveShadow = true;
    // scene.add(ground);
    frames = 0;
    startGame();
}

// function initGui() {

//     initGame();
//     gui = new GUI({ autoPlace: false, width: 300 });  // Adjust the width if needed

//     // Create a custom div to hold the GUI
//     guiContainer = document.createElement('div');
//     guiContainer.id = 'guiContainer';  // Assign an ID for styling
//     document.body.appendChild(guiContainer);

//     // Move the GUI to the container
//     gui.domElement.classList.add('custom-gui'); // Add a class for styling
//     guiContainer.appendChild(gui.domElement);

//     // Add any other controls to your GUI
//     // gui.add(...);  // Example controls

//     // gui.domElement.style.backgroundColor = 'rgba(50, 50, 50, 0.9)'; // Background color
//     // gui.domElement.style.color = 'white'; // Text color
//     // gui.domElement.style.border = '2px solid #444'; // Optional border

//     // // Optionally append it to your HTML element
//     // document.body.appendChild(gui.domElement);


//     const leftMaterialParams = {
//         leftPaddleColor: paddleL.material.color.getHex(),
//     };

//     const rightMaterialParams = {
//         rightPaddleColor: paddleR.material.color.getHex(),
//     };

//     const themeParams = {
//         theme: 'Christmas'
//     };

//     const params = {
//         start: function() {
//             startGame();
//         }
//     }

//     function updateTheme(theme) {
//         switch(theme) {
//             case 'Christmas':
//                 paddleL.material.color.set(0x00ff00); // Green
//                 paddleR.material.color.set(0xff0000); // Red
//                 ground.material.color.set(0x0369a1);  // Blue
//                 break;
//             case 'Halloween':
//                 paddleL.material.color.set(0xff6600); // Orange
//                 paddleR.material.color.set(0x8c00ff); // Purple
//                 ground.material.color.set(0x564c43);  // Brown
//                 break;
//             case 'Winter':
//                 paddleL.material.color.set(0x9fffff); // Light Blue
//                 paddleR.material.color.set(0x96b8ee); // Light Purple
//                 ground.material.color.set(0xffffff);  // White
//                 ball.material.color.set(0x00ffff);    // Cyan for the ball
//                 break;
//             default:
//                 paddleL.material.color.set(0xffffff); // Default white
//         }
//     }

//     // Adding GUI elements
//     gui.add({ wins: numberOfWins }, 'wins', 0, 11, 1).onChange((value) => {
//         numberOfWins = value; // Update numberOfWins
//     });

//     // gui.add(paddleL.material, 'wireframe'); // Add wireframe toggle
//     gui.addColor(leftMaterialParams, 'leftPaddleColor')
//         .onChange((value) => paddleL.material.color.set(value)); // Change left paddle color
//     gui.addColor(rightMaterialParams, 'rightPaddleColor')
//         .onChange((value) => paddleR.material.color.set(value)); // Change right paddle color
//     gui.add(themeParams, 'theme', ['Christmas', 'Halloween', 'Winter'])
//         .onChange((value) => updateTheme(value)); // Theme selection
//     gui.add(params, 'start').name('Start'); // Start game button

//     // Optional: Set the initial theme on load
//     updateTheme(themeParams.theme);

// }

//Updates score text (alternates between old and new one)
function updateScore(text) {
    createText(function (text) {
        // Remove the old text if it exists
        if (currentText) {
            scene.remove(currentText);      // Remove the old text from the scene
            currentText.geometry.dispose(); // Dispose of the geometry
            currentText.material.dispose(); // Dispose of the material
        }
        if (state == 0)
            return;
        text.castShadow = true;
        text.receiveShadow = true;
        scene.add(text);
    
        // Store the reference to the new text
        currentText = text;
    }, scoreP1, scoreP2);
    

}

// updateScore();

//Event listener for KEYDOWN
window.addEventListener('keydown', (event) => {
    // prevents keys from default
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
        // case 'Space':
        //     controls.reset();
        //     break;
    }
})

//Event listener for KEYUP
window.addEventListener('keyup', (event) => {
    // event.preventDefault();
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

let frames = 0;
function updateGame() {
    if (state === 0)
        return;

    if (frames === 120)
    {
        ball.velocity.x = randomVelocity();
        ball.velocity.z = randomVelocity();
        ball.velocity.y = 0;
    }
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

    let winner = 0;

    //updates ball depending if it's going towards left or right 
    // to check the corresponding paddle hitbox
    if (ball.velocity.x < 0)
        winner = ball.update(paddleL, ground);
    else
        winner = ball.update(paddleR, ground);
    if (winner != 0)
        resetBallPosition(ball, winner);
    frames++;
}

//Resets ball to 0 position with randomized velocities to change direction
export function resetBallPosition(ball, winner) {
    if (winner === 1)
        scoreP2++;
    else
        scoreP1++;
	ball.position.x = 0;
	ball.position.y = -2.4;
	ball.position.z = 0;
    ball.velocity.y = 0;
    ball.velocity.z = 0;
    ball.velocity.x = 0;
    frames = 0;
    updateScore();
    if (scoreP1 == numberOfWins || scoreP2 == numberOfWins)
        endGame();
}

//Generates a number between 0.06 and 0.1 and -0.1 and -0.06
function randomVelocity() {
    let number = Math.random() * (0.1 - 0.06) + 0.06;
    if (Math.random() > 0.5)
        number *= -1;
    return(number);
}

export const updateGameScene = () => {
    if (window.location.pathname == '/game') {
        if (!isStarted) {
            initGame();
            isStarted = true;
        }
        updateGame();
    } else {
        if (isStarted) {
            console.log('Game Ended');
            isStarted = false;
            removeGameObjects();
        }
    }
}

function endGame() {
    removeGameObjects();
    // scene.remove.apply(scene, scene.children);
    // cancelAnimationFrame(animationID);
    state = 0;
    //GoToEndScreen
    window.location.href = "/endGame";
}

function removeGameObjects() {
    ball.kill();
    scene.remove(ball);
    paddleL.kill();
    scene.remove(paddleL);
    paddleR.kill();
    scene.remove(paddleR);
    ground.kill();
    scene.remove(ground);
    currentText.material.dispose();
    currentText.geometry.dispose();
    scene.remove(currentText);
}
