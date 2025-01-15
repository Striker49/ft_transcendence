import * as THREE from 'three'
import { Box } from './box.js';
import { Ball } from './ball.js';
import { getTranslatedWord, translatePage } from '../localization.js';
import { getEndState } from '../pages/Tournament.js';

export async function sendGameStats(scoreP1, scoreP2, ai, nameP1, nameP2) {
    if (!localStorage.getItem("authToken"))
		return;
	const url = "https://localhost/api/game/played/";
    console.debug(localStorage.getItem("authToken"));
    let userLogged = localStorage.getItem("username");
    let otherPlayer = nameP2 == userLogged ? nameP1 : nameP2;
    let tournamentWon = 0;
    if (getEndState && ((userLogged == nameP1 && scoreP1 > scoreP2) || userLogged == nameP2 && scoreP2 > scoreP1))
        tournamentWon = 1;
    if (userLogged != nameP1 && userLogged != nameP2)
        return;
    console.log("userlogged", userLogged);
    console.log("p1 uid", userLogged == nameP1 ? localStorage.getItem("UID") : null);
    console.log("p2 uid", userLogged == nameP2 ? localStorage.getItem("UID") : null);
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + localStorage.getItem("authToken")
            },
			body: JSON.stringify({
				player1_UID: userLogged == nameP1 ? localStorage.getItem("UID") : null,
				player2_UID: userLogged == nameP2 ? localStorage.getItem("UID") : null,
                username_player1: nameP1,
                username_player2: ai ? null : nameP2,
				score_player1: scoreP1,
				score_player2: scoreP2,
                tournamentWon: tournamentWon
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

export function insertButton(winnerName) {

    const div = document.createElement('div');
    div.setAttribute('class', "mt-5 d-flex justify-content-center");

    if (localStorage.getItem("tournament")) {

        const array = JSON.parse(localStorage.getItem("tournament"));
        array.push(winnerName);
        localStorage.setItem("tournament", JSON.stringify(array));

        if (getEndState()) {
            const showResultButton = document.createElement('a');
            showResultButton.setAttribute('href', '/tournament');
            showResultButton.setAttribute('data-i18n-key', 'showResult');
            showResultButton.setAttribute('class', 'btn btn-primary');
            showResultButton.setAttribute('id', 'showResult');
            showResultButton.setAttribute('data-link', 'true');
            showResultButton.style.margin = '0 10px';
            showResultButton.innerHTML = "Show Result";
            div.appendChild(showResultButton);
        } else {
            const nextMatchButton = document.createElement('a');
            nextMatchButton.setAttribute('href', '/tournament');
            nextMatchButton.setAttribute('data-i18n-key', 'nextMatch');
            nextMatchButton.setAttribute('class', 'btn btn-primary');
            nextMatchButton.setAttribute('id', 'nextMatch');
            nextMatchButton.setAttribute('data-link', 'true');
            nextMatchButton.style.margin = '0 10px';
            nextMatchButton.innerHTML = "Next Match";
            const stopButton = document.createElement('a');
            stopButton.setAttribute('href', '/');
            stopButton.setAttribute('data-i18n-key', 'stopTournament');
            stopButton.setAttribute('class', 'btn btn-primary');
            stopButton.setAttribute('id', 'stopTournament');
            stopButton.setAttribute('data-link', 'true');
            stopButton.innerHTML = "Stop Tournament";
            stopButton.style.margin = '0 10px';
            div.appendChild(nextMatchButton);
            div.appendChild(stopButton);
        }
    } else {
        const rankingButton = document.createElement('a');
        rankingButton.setAttribute('href', '/endGame');
        rankingButton.setAttribute('data-i18n-key', 'ranking');
        rankingButton.setAttribute('class', 'btn btn-primary');
        rankingButton.setAttribute('id', 'ranking');
        rankingButton.setAttribute('data-link', 'true');
        rankingButton.style.margin = '0 10px';
        rankingButton.innerHTML = "Ranking";
        const playAgainButton = document.createElement('a');
        playAgainButton.setAttribute('href', '/select');
        playAgainButton.setAttribute('data-i18n-key', 'playAgain');
        playAgainButton.setAttribute('class', 'btn btn-primary');
        playAgainButton.setAttribute('id', 'playAgain');
        playAgainButton.setAttribute('data-link', 'true');
        playAgainButton.innerHTML = "Play Again";
        playAgainButton.style.margin = '0 10px';
        div.appendChild(rankingButton);
        div.appendChild(playAgainButton);
    }

    const body = document.querySelector("main");
    body.appendChild(div);
    translatePage();
    console.debug("body", body);
}

function removeNumberTexture(currentText, customTextureNumber) {
    currentText.material.map = null;
    currentText.material.needsUpdate = true;
    customTextureNumber = null;
    currentText.material.dispose();
    currentText.geometry.dispose();

}

function removePowerUps(scene, powerUps) {
    powerUps.forEach((obj, index) => {
        if (powerUps[index])
        {
            powerUps[index].kill();
            scene.remove(powerUps[index]);
        }
    })
}

function removeWinner(scene, winnerText, winnerNameText) {
    if (winnerText)
    {
        winnerText.material.dispose();
        winnerText.geometry.dispose();
        scene.remove(winnerText);
    }    
    if (winnerNameText)
    {
        winnerNameText.material.dispose();
        winnerNameText.geometry.dispose();
        scene.remove(winnerNameText);
    }
}

export function removeGameObjects(scene, ball, paddleL, paddleR, ground, customTextureNumber, currentText, powerUps, winnerText, winnerNameText, textnameP1, textnameP2) {
	ball.kill();
    scene.remove(ball);
    paddleL.kill();
    scene.remove(paddleL);
    paddleR.kill();
    scene.remove(paddleR);
    ground.kill();
    scene.remove(ground);
    removePowerUps(scene, powerUps);
    if (customTextureNumber)
        removeNumberTexture(currentText, customTextureNumber);
    scene.remove(scene, currentText);
    textnameP1.material.dispose();
    textnameP1.geometry.dispose();
    textnameP2.material.dispose();
    textnameP2.geometry.dispose();
    scene.remove(textnameP1, textnameP2);
    removeWinner(scene, winnerText, winnerNameText);
	return (null);
}

//Generates a number between 0.06 and 0.1 and -0.1 and -0.06
export function randomVelocity() {
    let number = Math.random() * (0.1 - 0.06) + 0.06;
    if (Math.random() > 0.5)
        number *= -1;
    return(number);
}
