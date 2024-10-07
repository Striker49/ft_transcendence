import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Box } from './box.js';
import { Ball } from './ball.js';
import { keys } from './keys.js';
import { createText } from './text.js';
import { setGui } from './gui.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 9, 0);
scene.position.z = 1;

const light = new THREE.DirectionalLight(0xffffff, 0.3);  // For shadows (color, intensity)
const light2 = new THREE.AmbientLight(0xffffff, 1);  // (color, intensity)
light.position.z = -1;
light.position.y = 3;
light.castShadow = true;
light.shadow.camera.left = -50;
light.shadow.camera.right = 50;
light.shadow.camera.top = 50;
light.shadow.camera.bottom = -50;
light.shadow.mapSize.set(9192, 9192);
scene.add(light, light2);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// To move the scene around with the mouse
const controls = new OrbitControls(camera, renderer.domElement);

//Seting variable value
//<----need to fetch player name-------->
let speed = 0.15;
let text, currentText;
let scoreP1 = 0;
let scoreP2 = 0;
let groundWidth = 13;
let paddleWidth = 0.5;
let ballAcceleration = 0.01;
let numberOfWins = 11;
let powerUps = false;
let theme = 'Christmas';
let state = 1;

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
scene.add(ball);

//Create ground
const ground = new Box({
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
scene.add(ground);

const gui = new GUI();

const leftMaterialParams = {
    leftPaddleColor: paddleL.material.color.getHex(),
};

const rightMaterialParams = {
    rightPaddleColor: paddleR.material.color.getHex(),
};

const themeParams = {
    theme: 'Christmas'
};

function updateTheme(theme) {
    switch(theme) {
        case 'Christmas':
            paddleL.material.color.set(0x00ff00);
            paddleR.material.color.set(0xff0000);
            ground.material.color.set(0x0369a1);
            break;
        case 'Halloween':
            paddleL.material.color.set(0xff6600);
            paddleR.material.color.set(0x8c00ff);
            ground.material.color.set(0x564c43);
            break;
        case 'Winter':
            paddleL.material.color.set(0x9fffff);
            paddleR.material.color.set(0x96b8ee);
            ground.material.color.set(0xffffff);
            ball.material.color.set(0x00ffff);
            break;
        default:
            paddleL.material.color.set(0xffffff);
    }
}

gui.add({ wins: numberOfWins }, 'wins', 0, 11, 1).onChange((value) => {
    numberOfWins = value; // Update numberOfWins
  });

gui.add(paddleL.material, 'wireframe');
gui.addColor(leftMaterialParams, 'leftPaddleColor')
    .onChange((value) => paddleL.material.color.set(value));
gui.addColor(rightMaterialParams, 'rightPaddleColor')
    .onChange((value) => paddleR.material.color.set(value));
gui.add(themeParams, 'theme', ['Christmas', 'Halloween', 'Winter'])
  .onChange((value) => updateTheme(value));
// updateTheme(themeParams);


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
        // text.position.x = -2.75;
        scene.add(text);
    
        // Store the reference to the new text
        currentText = text;
    }, scoreP1, scoreP2);
    

}

updateScore();

//Event listener for KEYDOWN
window.addEventListener('keydown', (event) => {
    //prevents keys from default
    event.preventDefault();
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
    //prevents keys from default
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

//Resizes the image if the window changes size
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


let frames = 0;
function animate() {
    const animationID = requestAnimationFrame(animate);
    renderer.render(scene, camera);
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
	ball.position.y = -2.4;
	ball.position.z = 0;
    ball.velocity.y = 0;
    ball.velocity.z = 0;
    ball.velocity.x = 0;
    frames = 0;
    updateScore();
    if (scoreP1 == numberOfWins || scoreP2 == numberOfWins)
        endGame();
    // ball.velocity.x = randomVelocity();
    // ball.velocity.z = randomVelocity();

}

//Generates a number between 0.06 and 0.1 and -0.1 and -0.06
function randomVelocity() {
    let number = Math.random() * (0.1 - 0.06) + 0.06;
    if (Math.random() > 0.5)
        number *= -1;
    return(number);
}

function endGame() {
    ball.kill();
    scene.remove(ball);
    paddleL.kill();
    scene.remove(paddleL);
    paddleR.kill();
    scene.remove(paddleR);
    ground.kill();
    scene.remove(ground);
    // scene.remove.apply(scene, scene.children);
    // cancelAnimationFrame(animationID);
    state = 0;
    // cancel();
    // exit();
}

animate();