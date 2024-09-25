import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Box } from './box.js';
import { Ball } from './ball.js';
import { createText } from './text.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 11, 0);
scene.position.z = 1;

const light = new THREE.DirectionalLight(0xffffff, 0.3);  // Adjust the intensity if needed
const light2 = new THREE.AmbientLight(0xffffff, 1);  // Adjust the intensity if needed
light.position.z = 1;
light.position.y = 2;
light.castShadow = true;
scene.add(light, light2);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

let speed = 0.1;

function inBounds({box1, box2}) {
    box1.updateSides();
    const collision = box1.front + speed <= box2.front && box1.back - speed >= box2.back;
    return (collision);
}

const cube = new Box({
    width: 1,
    height: 1,
    depth: 3,
    velocity: {
        x: 0,
        y: -0.01,
        z: 0
    },
    position: {
        x: -4.5,
        y: -1.25,
        z:0
    }
});
cube.castShadow = true;
scene.add(cube);

let text, currentText;
let scoreP1 = 0;
let scoreP2 = 0;

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
        text.position.x = -2.75;
        scene.add(text);   // Add the new text to the scene
    
        // Store the reference to the new text
        currentText = text;
    }, scoreP1, scoreP2);
    

}

updateScore();


const cube2 = new Box({
    width: 1,
    height: 1,
    depth: 3,
    velocity: {
        x: 0,
        y: -0.01,
        z: 0
    },
    position: {
        x: 4.5,
        y: -1.25,
        z: 0
    },
    color: 'red'
});
cube2.castShadow = true;
scene.add(cube2);

const ball = new Ball({
    radius: 0.25,
    width: 15,
    height: 15,
    velocity: {
        x: 0.05,
        y: -0.01,
        z: 0.05
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

const ground = new Box({
    width: 10, 
    height: 0.5,
    depth: 10,
    color: '#0369a1',
    position: {
        x: 0,
        y: -2,
        z: 0
    }
    });
ground.receiveShadow = true;
scene.add(ground);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    left: {
        pressed: false
    },
    right: {
        pressed: false
    },
    up: {
        pressed: false
    },
    down: {
        pressed: false
    }
}

window.addEventListener('keydown', (event) => {
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

window.addEventListener('keyup', (event) => {
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

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


const enemies = [];

let frames = 0;
let spawnRate = 200;
function animate() {
    const animationID = requestAnimationFrame(animate);
    renderer.render(scene, camera);

    //movement code
    cube.velocity.z = 0;
    if (keys.w.pressed && (cube.back - speed >= ground.back))
        cube.velocity.z = -speed;
    else if (keys.s.pressed && (cube.front + speed <= ground.front)) {
        cube.velocity.z = speed;
    }

    cube2.velocity.z = 0;
    if (keys.up.pressed && (cube2.back - speed >= ground.back))
        cube2.velocity.z = -speed;
    else if (keys.down.pressed && (cube2.front + speed <= ground.front)) {
        cube2.velocity.z = speed;
    }
    //updates Score every 30 frames
    // if (frames % 30 === 0)
    //     updateScore(text);

    //updates cubes and ball
    cube.update(ground);
    cube2.update(ground);
    if (ball.velocity.x < 0)
        ball.update(cube, ground);
    else
        ball.update(cube2, ground);
    frames++;
}

export function resetBallPosition(ball, winner) {
    if (winner === 1)
        scoreP2++;
    else
        scoreP1++;
	ball.position.x = 0;
	ball.position.y = -1.5;
	ball.position.z = 0;
    updateScore();
}
animate();
