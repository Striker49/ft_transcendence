import Abstract from "./Abstract.js";
import { fetchTranslationsFor } from "../localization.js";
import { navigateTo } from "../router/router.js";
import { sanitizeString } from "../utils/sanitize.js";
import { addSpan, clearSpan, isWhiteSpace, printError } from "../utils/validation.js";

let username;
let nbPlayer;

async function getUserProfile() {
	if (!localStorage.getItem("authToken"))
		return;
	// Creating headers and options locally everytime
	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": "Token " + localStorage.getItem("authToken")
	});
	const options = {
		method: "GET",
		headers: headers
	};
	const uid = localStorage.getItem("UID");
	const url = `https://localhost/api/profiles/${uid}`;
	try {
		const response = await fetch(url, options);
		if(!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const userData = await response.json();
		console.log("USER DATA", userData);
		return userData;
	} catch (error) {
		console.error(error.message);
	}
}

async function getNbPlayer(queryName) {

    const params = new URLSearchParams(window.location.search);
	const nbPlayer = params.get(queryName);

    if (!(nbPlayer === "4" || nbPlayer === "8")) {
		return 4;
	}
    return nbPlayer;
}

async function getLabels(nbPlayer) {

	if (nbPlayer === "8") {
		return `
			<p><label for="player1" class="form-label"><span data-i18n-key="player">Player</span> 1</label></p>
			<p><label for="player2" class="form-label"><span data-i18n-key="player">Player</span> 2</label></p>
			<p><label for="player3" class="form-label"><span data-i18n-key="player">Player</span> 3</label></p>
			<p><label for="player4" class="form-label"><span data-i18n-key="player">Player</span> 4</label></p>
			<p><label for="player5" class="form-label"><span data-i18n-key="player">Player</span> 5</label></p>
			<p><label for="player6" class="form-label"><span data-i18n-key="player">Player</span> 6</label></p>
			<p><label for="player7" class="form-label"><span data-i18n-key="player">Player</span> 7</label></p>
			<p><label for="player8" class="form-label"><span data-i18n-key="player">Player</span> 8</label></p>
		`;
	} else {
		return `
			<p><label for="player1" class="form-label"><span data-i18n-key="player">Player</span> 1</label></p>
			<p><label for="player2" class="form-label"><span data-i18n-key="player">Player</span> 2</label></p>
			<p><label for="player3" class="form-label"><span data-i18n-key="player">Player</span> 3</label></p>
			<p><label for="player4" class="form-label"><span data-i18n-key="player">Player</span> 4</label></p>
		`;
	}
}

async function getInputsHtml(count) {

	const div = document.createElement("div");
	const fragment = document.createDocumentFragment();

	for (let i = 2; i <= count; ++i) {

		const input = document.createElement("input");
		const p = document.createElement("p");
		const span = addSpan();

		input.type = "text";
		input.className = "form-control";
		input.id = "player" + i;
		input.name = "player" + i;
		input.placeholder = "Player " + i;
		input.setAttribute("data-i18n-phkey", "player");
		input.setAttribute("maxlength", "12");

		p.appendChild(input);
		p.appendChild(span);
		fragment.appendChild(p);
	}
	div.appendChild(fragment);
	return div.innerHTML;
}

async function getInputs(nbPlayer) {
	
	if (nbPlayer === "8") {
		return await getInputsHtml(8);
		// return `
		// 	<p><input type="text" class="form-control" data-i18n-phkey="player" name="player2" id="player2" placeholder="Player 2" maxlength="12"></p>
		// 	<p><input type="text" class="form-control" data-i18n-phkey="player" name="player3" id="player3" placeholder="Player 3" maxlength="12"></p>
		// 	<p><input type="text" class="form-control" data-i18n-phkey="player" name="player4" id="player4" placeholder="player" maxlength="12"></p>
		// 	<p><input type="text" class="form-control" data-i18n-phkey="player" name="player5" id="player5" placeholder="Player 5" maxlength="12"></p>
		// 	<p><input type="text" class="form-control" data-i18n-phkey="player" name="player6" id="player6" placeholder="Player 6" maxlength="12"></p>
		// 	<p><input type="text" class="form-control" data-i18n-phkey="player" name="player7" id="player7" placeholder="Player 7" maxlength="12"></p>
		// 	<p><input type="text" class="form-control" data-i18n-phkey="player" name="player8" id="player8" placeholder="Player 8" maxlength="12"></p>
		// `;
	} else {
		return await getInputsHtml(4);
		// return `
		// 	<p><input type="text" class="form-control" data-i18n-phkey="player" name="player2" id="player2" placeholder="Player 2" maxlength="12"></p>
		// 	<p><input type="text" class="form-control" data-i18n-phkey="player" name="player3" id="player3" placeholder="Player 3" maxlength="12"></p>
		// 	<p><input type="text" class="form-control" data-i18n-phkey="player" name="player4" id="player4" placeholder="Player 4" maxlength="12"></p>
		// `;
	}
}

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Game Config - Tournament");
	}

	async getHtml() {
		let localTranslations = JSON.parse(localStorage.getItem("translations"));
		if (localTranslations == null)
			localTranslations = await fetchTranslationsFor(localStorage.getItem("lang") || document.querySelector("[lang]").getAttribute("lang"));
		const userData = await getUserProfile();
		nbPlayer = await getNbPlayer("nbPlayer");
		username = (userData ? userData.username : localTranslations["playerOne"]);
		localStorage.setItem("powerUps", false);
		const playerLabels = await getLabels(nbPlayer);
		const playerInputs = await getInputs(nbPlayer);
		return `
			<div class="container bg-dark bg-opacity-75 rounded-5 p-5">
				<div class="bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black fw-bold">
					<div class="row m-0">
						<a href="/select" class="bg-info rounded-4 px-3 py-2 corner-back text-decoration-none text-black" style="width: 50px;" data-link>\<\<</a>
					</div>
					<div id="game-config" class="row m-0 mt-4 p-2 bg-info">
						<div class="col-5 col-md-4 text-end p-4 fst-italic">
							${playerLabels}
							<p><label for="winRange" class="form-label"><span data-i18n-key="numberOfWins">Number of wins</span></label></p>
							<p><span data-i18n-key="theme" role="text">Theme</span></p>
							<p><label for="powerUps">Power-Ups</label></p>
						</div>
						<div class="col-7 col-md-8 bg-alt-blue rounded-4 p-4">
							<p><span id="player1" role="text" data-skip-i18n="false" data-i18n-key="playerOne">${username}</span></p>
							${playerInputs}
							<p>
								<input type="range" class="form-range w-75" min="1" max="11" value="${localStorage.getItem('numberOfWins') || '3'}" id="winRange">
								<span id="demo" class="float-end">${localStorage.getItem('numberOfWins') || '3'}</span>
							</p>
							<p>
								<select id="theme" class="form-select auto-width-select" aria-label="Winter">
									<option data-i18n-key="none" value="None" ${localStorage.getItem('theme') === 'None' ? 'selected' : ''}>None</option>
									<option data-i18n-key="custom" value="Custom" ${localStorage.getItem('theme') === 'Custom' ? 'selected' : ''}>Custom</option>
									<option data-i18n-key="christmas" value="Christmas" ${localStorage.getItem('theme') === 'Christmas' ? 'selected' : ''}>Christmas</option>
									<option data-i18n-key="halloween" value="Halloween" ${localStorage.getItem('theme') === 'Halloween' ? 'selected' : ''}>Halloween</option>
									<option data-i18n-key="winter" value="Winter" ${localStorage.getItem('theme') === 'Winter' ? 'selected' : ''}>Winter</option>
								</select>
							</p>
							<p><input type="checkbox" id="powerUps"></p>
						</div>
					</div>
					<div class="row mx-0 my-4 justify-content-center">
						<a href="#" id="startTournament" class="btn btn-dark rounded-pill px-4 bg-orange text-dark fw-bold box-shadow border-0 w-auto">Go to tournament</a>
					</div>
				</div>
			</div>
		`;
	}
}

// ============ Events ==============

document.addEventListener("input", (event) => {
	if (event.target.matches("#winRange")) {
		var slider = document.getElementById("winRange");
		var output = document.getElementById("demo");
		output.innerHTML = slider.value;
		localStorage.setItem("numberOfWins", slider.value);
	}
});

document.addEventListener("change", (event) => {
	event.preventDefault();
	if (event.target.matches("#theme")) {
		const theme = document.getElementById("theme").value;
		// newTheme = document.getElementById("theme")
		// newTheme.innerHTML = theme.value;
		console.log('theme', theme);
		localStorage.setItem("theme", theme);
	}
});

document.addEventListener("click", (event) => {
    if (event.target.matches("#startTournament")) {
        // Prevent default link behavior if it's an <a> tag
        event.preventDefault();
		// Get aliases for tournament
		const inputs = document.querySelectorAll("#game-config input[type=text]");
		const p1 = document.getElementById("player1").textContent;
		const round = [sanitizeString(p1)];

		let isValid = true;

		for (const input of inputs.values()) {

			const span = input.nextElementSibling;

			if (round.includes(input.value)) {
				printError(span, "uniqueName", "Name must be unique.");
				isValid = false;
				continue;
			}
			else if (input.value === "" || input.value == null || isWhiteSpace(input.value)) {
				round.push(sanitizeString(input.placeholder));
			} else {
				round.push(sanitizeString(input.value));
			}
			clearSpan(span);
		}
		if (!isValid) {
			return;
		}
		localStorage.setItem("tournament", JSON.stringify(round));
		localStorage.setItem("nbPlayer", nbPlayer);
		// Build the URL with query parameters
		const url = "/tournament";
		// Navigate to the URL
		navigateTo(url);
    }
});
