import * as THREE from 'three'
import { scene, camera, renderer, controls } from "../threejs/base.js";
import { Box } from './box.js';
import { Ball } from './ball.js';
import { keys } from './keys.js';
import { createText, createWinnerText } from './text.js';
import { navigateTo } from '../router/router.js';
import { getTranslatedWord } from '../localization.js';


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
let speed = 0.15;
let text, currentText, winnerText;
let scoreP1, scoreP2;
let nameP1, nameP2;
let groundWidth = 13;
let paddleWidth = 0.5;
let ballAcceleration = 0.01;
let numberOfWins;
let theme;
let powerUps = false;
let ai = false;
let newZPosition = 0;
let state = 0;

let paddleL;
let paddleR;
let ground;
let ball;

const textureLoader = new THREE.TextureLoader();
const customTexture = textureLoader.load('src/assets/1000_F_872786651_TAj61rs1j1vSBJFtSni4hxuG6vvaNZti.jpg');

const box = new THREE.Mesh

function updateTheme(theme) {
    switch(theme) {
        case 'Custom':
            paddleL.material.color.set(0x00ff00); // Green
            paddleR.material.color.set(0xff0000); // Red
            ground.material.map = customTexture; // 
            ground.material.color.set(0xffffff); // Reset color to avoid tinting
            break;
        case 'Christmas':
            paddleL.material.color.set(0x00ff00); // Green
            paddleR.material.color.set(0xff0000); // Red
            ground.material.color.set(0x0369a1);  // Blue
            break;
        case 'Halloween':
            paddleL.material.color.set(0xff6600); // Orange
            paddleR.material.color.set(0x8c00ff); // Purple
            ground.material.color.set(0x564c43);  // Brown
            break;
        case 'Winter':
            paddleL.material.color.set(0x9fffff); // Light Blue
            paddleR.material.color.set(0x96b8ee); // Light Purple
            ground.material.color.set(0xffffff);  // White
            ball.material.color.set(0x00ffff);    // Cyan for the ball
            break;
        default:
            paddleL.material.color.set(0x00ff00); // Green
            paddleR.material.color.set(0xff0000); // Red
            ground.material.color.set(0x0369a1);  // Blue
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
    if (params.get(queryName))
        username = params.get(queryName);
    return (username);
}

function initGame() {
    nameP1 = getUsername("username");
    nameP2 = getUsername("username2");
    scoreP1 = 0;
    scoreP2 = 0;
    ai = localStorage.getItem("nbPlayer") == "1" ? true : false;

    numberOfWins = Math.max(1, Math.min(11, parseInt(localStorage.getItem("numberOfWins") || 3, 10)));
    if (localStorage.getItem("numberOfWins") != numberOfWins)
        localStorage.setItem("numberOfWins", numberOfWins);
    console.log('initGame now', numberOfWins);
    console.log('initGame theme', localStorage.getItem("theme"));
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

function calculateBallEndPoint() {
    console.log("calculating ball endpoint");
    let endPointx = ball.position.x;
    let endPointz = ball.position.z;
    let velocityx = ball.velocity.x;
    let velocityz = ball.velocity.z;
    let ballRadius = ball.radius;
    let paddleLength = (paddleL.width / 2);
    while (endPointx < (paddleR.position.x - paddleLength))
    {
        console.log("endPointz:", endPointz);
        if ((endPointx - (velocityx)) <= (paddleL.position.x + paddleLength) && velocityx < 0)
            velocityx *= -1.075;
        if (endPointz + (velocityz) >= ground.front || endPointz - velocityz<= ground.back)
            velocityz *= -1.075;
        if (velocityx > 0.25)
            velocityx = 0.25;
        endPointx += velocityx;
        endPointz += velocityz;
    }
    return (endPointz);
}

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
    if (ai == true)
    {
        //calculates ball position 20 frames after start then every 60 frames
        if ((frames > 140 && (frames - 140) % 60 == 0 ) || frames == 140)
            newZPosition = calculateBallEndPoint();

        
        if (frames >= 140 ) {
            //Goes up if next ball calculated position is higher or goes down if it's lower
            if (newZPosition < paddleR.position.z && (paddleR.back - speed >= ground.back) && Math.round(newZPosition) != Math.round(paddleR.position.z))
            {
                paddleR.velocity.z = -speed;
            }
            else if (newZPosition > paddleR.position.z && (paddleR.front - speed <= ground.front) && Math.round(newZPosition) != Math.round(paddleR.position.z))
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
        endGame(winner);
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


function showWinner(winnerName) {
    let winnerWord = getTranslatedWord("winner");
    createWinnerText(function (text2) {
        winnerText = text2;
        scene.add(winnerText);
    }, winnerWord, winnerName);
}

function insertButton() {
    const div = document.createElement('div');
    div.setAttribute('class', "mt-5 d-flex justify-content-center");
    const rankingButton = document.createElement('a');
    rankingButton.setAttribute('href', '/endGame');
    rankingButton.setAttribute('data-i18n-key', 'ranking');
    rankingButton.setAttribute('class', 'btn btn-primary');
    rankingButton.setAttribute('id', 'ranking');
    rankingButton.setAttribute('data-link', 'true');
    rankingButton.style.margin = '0 10px';
    rankingButton.innerHTML = "Ranking";
    const playAgainButton = document.createElement('a');
    playAgainButton.setAttribute('href', '/gameConfig');
    playAgainButton.setAttribute('data-i18n-key', 'playAgain');
    playAgainButton.setAttribute('class', 'btn btn-primary');
    playAgainButton.setAttribute('id', 'playAgain');
    playAgainButton.setAttribute('data-link', 'true');
    playAgainButton.innerHTML = "Play Again";
    playAgainButton.style.margin = '0 10px';
    const body = document.querySelector("main");
    body.appendChild(div);
    div.appendChild(rankingButton);
    div.appendChild(playAgainButton);
    console.debug("body", body);
}

function endGame(winner) {
    const winnerName = (winner == 2 ? nameP1 : nameP2);
    console.debug("winner", winner);
    console.debug("nameP1", nameP1);
    console.debug("nameP2", nameP2);
    console.debug("winnerName", winnerName);
    removeGameObjects();
    // scene.remove.apply(scene, scene.children);
    // cancelAnimationFrame(animationID);
    state = 0;
    updateScore();
    showWinner(winnerName);
    sendGameStats();
    insertButton();
    //GoToEndScreen
    // navigateTo("/endGame");
	// router();
    // window.location.href = "/endGame";
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
    if (winnerText)
    {
        winnerText.material.dispose();
        winnerText.geometry.dispose();
        scene.remove(winnerText);
    }
}


const headers = new Headers({
	"Content-Type": "application/json",
	"Authorization": "Token " + localStorage.getItem("authToken")
})

async function sendGameStats() {
    if (!localStorage.getItem("authToken"))
		return;
	const url = "https://localhost/api/game/played/";
    console.debug(localStorage.getItem("authToken"));
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify({
				player1_UID: localStorage.getItem("UID"), 
				player2_UID: null,
                username_player2: null,
				score_player1: scoreP1,
				score_player2: scoreP2
			})
		});
		if(!response.ok) { 
			throw new Error(`Response status: ${response.status}`);
		}
		const stats = await response.json();
		console.log("RANKING", stats);
	} catch (error) {
		console.error(error.message);
	}
}

document.addEventListener('click', (event) => {
    if (event.target.matches("#ranking"))
    {
        winnerText.material.dispose();
        winnerText.geometry.dispose();
        scene.remove(winnerText);
    }
})
