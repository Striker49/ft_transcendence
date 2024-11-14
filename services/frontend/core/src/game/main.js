import * as THREE from 'three'
import { scene, camera, renderer, controls } from "../threejs/base.js";
import { Box } from './box.js';
import { Ball } from './ball.js';
import { keys } from './keys.js';
import { createText, createWinnerText } from './text.js';
import { navigateTo } from '../router/router.js';
import { getTranslatedWord, translatePage } from '../localization.js';
import { boxCollision } from './collision.js';
import { sendGameStats, insertButton, removeGameObjects, randomVelocity } from './gameUtils.js';
import { calculateBallEndPoint, approximate, targetLocation } from './ai.js';
import { removePowerUp, spawnPowerUp, updatePowerUps } from './powerUps.js'


const light = new THREE.DirectionalLight(0xffffff, 0.3);  // For shadows (color, intensity)
light.position.z = -1;
light.position.y = 3;
light.castShadow = true;
light.shadow.camera.left = -50;
light.shadow.camera.right = 50;
light.shadow.camera.top = 50;
light.shadow.camera.bottom = -50;
light.shadow.mapSize.set(9192, 9192);
renderer.shadowMap.enabled = true;


//Seting variable value
//<----need to fetch player name-------->
let isStarted = false;
let frames = 0;
let speed = 0.15;
let text, currentText, winnerText;
let scoreP1, scoreP2;
let nameP1, nameP2;
let groundWidth = 13;
let paddleWidth = 0.5;
let paddleDepth= 2.5;
let ballAcceleration = 0.01;
let numberOfWins;
let theme;
let powerUpMode;
let powerUps = [];
let powerUpLocation;
let ai = false;
let newZPosition = 0;
let state = 0;
let winnerName;

let paddleL;
let paddleR;
let ground;
let ball;

const textureLoader = new THREE.TextureLoader();

let customTextureGround
let customTexturePaddleL;
let customTexturePaddleR;
let customTextureBall;
let customTextureNumber;


const box = new THREE.Mesh

function updateTheme(theme) {
    switch(theme) {
        case 'Custom':
            customTextureGround = textureLoader.load('src/assets/1000_F_872786651_TAj61rs1j1vSBJFtSni4hxuG6vvaNZti.jpg');
            customTexturePaddleL = textureLoader.load('src/assets/Stylized_Stone_Floor_010_basecolor.png');
            customTexturePaddleR = textureLoader.load('src/assets/Stylized_Stone_Floor_009_basecolor.png');
            customTextureBall = textureLoader.load('/src/assets/Tiles_053_basecolor.png');
            customTextureNumber = textureLoader.load('/src/assets/Wood_Planks_014_basecolor.png');
            customTexturePaddleL.repeat.set(0.75,0.75);
            customTexturePaddleR.repeat.set(0.75,0.75);

            paddleL.material.map = customTexturePaddleL; // Green
            paddleR.material.map = customTexturePaddleR; // Red
            ground.material.map = customTextureGround; // 
            ball.material.map = customTextureBall; // Reset color to avoid tinting
            // currentText.material.map = customTextureNumber;

            break;
        case 'Christmas':
            paddleL.material.color.set(0x00ff00); // Green
            paddleR.material.color.set(0xff0000); // Red
            ground.material.color.set(0x0369a1);  // Blue
            ball.material.color.set('yellow'); // Yellow
            break;
        case 'Halloween':
            paddleL.material.color.set(0xff6600); // Orange
            paddleR.material.color.set(0x8c00ff); // Purple
            ground.material.color.set(0x564c43);  // Brown
            ball.material.color.set('yellow'); // Yellow
            break;
        case 'Winter':
            paddleL.material.color.set(0x9fffff); // Light Blue
            paddleR.material.color.set(0x96b8ee); // Light Purple
            ground.material.color.set(0xffffff);  // White
            ball.material.color.set(0x00ffff);    // Cyan for the ball
            break;
        default:
            paddleL.material.color.set(0x3ec300); // Green
            paddleR.material.color.set(0xb63b85); // Red
            ground.material.color.set(0x1a879c);  // Blue
            ball.material.color.set('yellow'); // Yellow

    }
    ground.material.needsUpdate = true;
}

function startGame() {
    scene.add(light);
    scene.add(paddleL);
    scene.add(paddleR);
    scene.add(ball);
    scene.add(ground);
    
    updateScore(); // Make sure this function updates the score correctly
    updateTheme(localStorage.getItem("theme"));

    state = 1;
}

function getUsername(queryName) {
    let username = "No name";
    const params = new URLSearchParams(window.location.search);
    if (params.get(queryName) && params.get(queryName).length < 13)
        username = params.get(queryName);
    return (username);
}

function initGame() {
    nameP1 = getUsername("username");
    nameP2 = getUsername("username2");
    scoreP1 = 0;
    scoreP2 = 0;
    ai = localStorage.getItem("nbPlayer") == "1" ? true : false;
    powerUpMode = localStorage.getItem("powerUps") == "true"? true : false;

    numberOfWins = Math.max(1, Math.min(11, parseInt(localStorage.getItem("numberOfWins") || 3, 10)));
    if (localStorage.getItem("numberOfWins") != numberOfWins)
        localStorage.setItem("numberOfWins", numberOfWins);
    console.debug('initGame now', numberOfWins);
    console.debug('initGame theme', localStorage.getItem("theme"));
    //Create left paddle
    paddleL = new Box({
        width: paddleWidth,
        height: 0.5,
        depth: paddleDepth,
        color: null,
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
    
    //Create right paddle
    paddleR = new Box({
        width: paddleWidth,
        height: 0.5,
        depth: paddleDepth,
        color: null,
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
    });
    paddleR.castShadow = true;
    
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
        color: null
    });
    ball.castShadow = true;

    //Create ground
    ground = new Box({
        width: groundWidth, 
        height: 0.5,
        depth: 9,
        color: null,
        position: {
            x: 0,
            y: -3,
            z: 0
        }
    });
    ground.receiveShadow = true;
    frames = 0;
    startGame();
}

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
        if (customTextureNumber)
            text.material.map = customTextureNumber;
        
        scene.add(text);
    
        // Store the reference to the new text
        currentText = text;
    }, scoreP1, scoreP2);
    

}

// updateScore();

//Event listener for KEYDOWN
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
    paddleR.velocity.z = 0;
    //Move left paddle if up/down key is pressed and will still be inbounds
    if (keys.w.pressed && (paddleL.back - speed > ground.back))
        paddleL.velocity.z = -speed;
    else if (keys.s.pressed && (paddleL.front + speed < ground.front)) {
        paddleL.velocity.z = speed;
    }

    if (powerUpMode == true)
        spawnPowerUp(scene, paddleL, paddleR, powerUps, ground, frames);
    //Move right paddle if up/down key is pressed and will still be inbounds
    if (ai == true)
    {
        //calculates ball position 20 frames after start then every 60 frames
        if ((frames > 140 && (frames - 140) % 70 == 0 ) || frames === 140)
            ({newZPosition, powerUpLocation} = calculateBallEndPoint(ball, powerUps, powerUpLocation, paddleL, paddleR, ground));

        
        if (frames >= 140 ) {
            //Goes up if next ball calculated position is higher or goes down if it's lower
            if (targetLocation(powerUpLocation, newZPosition) < paddleR.position.z && (paddleR.back - speed >= ground.back) && !approximate(newZPosition, paddleR.position.z, powerUpLocation, paddleDepth))
            {
                paddleR.velocity.z = -speed;
            }
            else if (targetLocation(powerUpLocation, newZPosition) > paddleR.position.z && (paddleR.front + speed <= ground.front) && !approximate(newZPosition, paddleR.position.z, powerUpLocation, paddleDepth))
            {
                paddleR.velocity.z = speed;
            }
            else
                paddleR.velocity.z = 0;

        }
    }
    else
    {
        //Move right paddle if up/down key is pressed and will still be inbounds
        if (keys.up.pressed && (paddleR.back - speed >= ground.back))
            paddleR.velocity.z = -speed;
        else if (keys.down.pressed && (paddleR.front + speed <= ground.front))
            paddleR.velocity.z = speed;
    }
    //updates paddles
    paddleR.update(ground);
    paddleL.update(ground);
    powerUpLocation = updatePowerUps(scene, paddleR, paddleL, powerUps, ground, powerUpLocation);

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
    paddleR.velocity.z = 0;
    newZPosition = 0;
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
    updateScore();
    removePowerUp(paddleL, paddleR, paddleDepth);
    frames = 0;
    if (scoreP1 == numberOfWins || scoreP2 == numberOfWins)
        endGame(winner);
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
            customTextureNumber = removeGameObjects(scene, ball, paddleL, paddleR, ground, customTextureNumber, currentText, powerUps, winnerText);
        }
    }
}

function showWinner(winnerName) {
    let winnerWord = getTranslatedWord("winner");
    let translations = JSON.parse(localStorage.getItem("translations"));
    if (translations && (winnerName == "Player 1" || winnerName == "Joueur 1" || winnerName == "Speler 1"))
        winnerName = translations["playerOne"];
    else if (translations && (winnerName == "Player 2" || winnerName == "Joueur 2" || winnerName == "Speler 2"))
        winnerName= translations["playerTwo"];
    createWinnerText(function (text2) {
        winnerText = text2;
        scene.add(winnerText);
    }, winnerWord, winnerName);
}

function endGame(winner) {
    winnerName = (winner == 2 ? nameP1 : nameP2);
    console.debug("winner", winner);
    console.debug("nameP1", nameP1);
    console.debug("nameP2", nameP2);
    console.debug("winnerName", winnerName);
    customTextureNumber = removeGameObjects(scene, ball, paddleL, paddleR, ground, customTextureNumber, currentText, powerUps, winnerText);
    state = 0;
    updateScore();
    showWinner(winnerName);
    sendGameStats(scoreP1, scoreP2, ai, nameP2);
    insertButton();
    translatePage();
}

document.addEventListener('click', (event) => {
    if (event.target.matches("#ranking"))
    {
        winnerText.material.dispose();
        winnerText.geometry.dispose();
        scene.remove(winnerText);
    }
})

document.querySelectorAll(".flag").forEach(flag => {
    flag.addEventListener("click", (event) => {
        setTimeout( () => {
        if (winnerText && window.location.href.includes("/game?") && state == 0) {
            winnerText.material.dispose();
            winnerText.geometry.dispose();
            scene.remove(winnerText);
            showWinner(getTranslatedWord(winnerName));
        }
    }, 100);
    });
});
