import Abstract from "./Abstract.js";
import { navigateTo } from "../router/router.js";
import { fetchTranslationsFor } from "../localization.js";

let p2NameLabel;
let p2NameField;
let p2Name;
let username;
let username2;

// const headers = new Headers({
// 	"Content-Type": "application/json",
// 	"Authorization": "Token " + localStorage.getItem("authToken")
// })

// const options = {
// 	method: "GET",
// 	headers: headers
// };

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
	const url = `https://localhost/api/profiles/${uid}/`;
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
	let nbPlayer = false;
    const params = new URLSearchParams(window.location.search);
    if (params.get(queryName) == "1" || (!params.get(queryName) && localStorage.getItem("nbPlayer") == "1"))
	{
		console.debug("One player detected");
		nbPlayer = true;
		p2NameLabel = "";
		p2NameField = "";
		localStorage.setItem("nbPlayer", "1");
	}
	else if (params.get(queryName) == "2")
	{
		console.debug("Two players detected");
		nbPlayer = false;
		p2NameField = "<label class=\"d-flex justify-content-center my-2 fw-bold p-1\" id=\"p2Form\" for=\"player2\" class=\"form-label\"><span data-i18n-key=\"player\">Player</span> 2</label><input type=\"text\" class=\"form-control w-auto mx-auto\" name=\"player2\" id=\"player2\">";
		localStorage.setItem("nbPlayer", "2");
	}
	else 
	{
		console.log("No player detected");
		p2NameField = "<label class=\"d-flex justify-content-center my-2 fw-bold p-1\" id=\"p2Form\" for=\"player2\" class=\"form-label\"><span data-i18n-key=\"player\">Player</span> 2</label><input type=\"text\" class=\"form-control w-auto mx-auto\" name=\"player2\" id=\"player2\">";
		// (!params.get(queryName) && localStorage.getItem("nbPlayer"))
		return (localStorage.getItem("nbPlayer") == "1" ? true : false)
	}
    return (nbPlayer);
}

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Game Settings");
	}

	async getHtml() {
		let localTranslations = JSON.parse(localStorage.getItem("translations"));
		if (localTranslations == null)
			localTranslations = await fetchTranslationsFor(localStorage.getItem("lang") || document.querySelector("[lang]").getAttribute("lang"));
		const userData = await getUserProfile();
		const ai = await getNbPlayer("nbPlayer");
		username = (userData ? userData.username : localTranslations["playerOne"])
		username2 = localTranslations["playerTwo"] || "Player 2";
		return `
			<div class="container bg-dark bg-opacity-75 rounded-5 p-5">
				<div class="bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black fw-bold">
					<div class="row m-0">
						<a href="/select" class="bg-info rounded-4 px-3 py-2 corner-back text-decoration-none text-black" style="width: 50px;" data-link>\<\<</a>
					</div>
					<div id="game-config" class="row m-0 mt-4 p-2 bg-info">
						<div class="col-5 col-md-4 text-end p-4 fst-italic">
							<p data-i18n-key="playerOne">Player 1</p>
							${p2NameLabel}
							<p><label for="winRange" class="form-label"><span data-i18n-key="numberOfWins">Number of wins</span></label></p>
							<p><span data-i18n-key="theme" role="text">Theme</span></p>
							<p><label for="powerUps">Power-Ups</label></p>
						</div>
						<div class="col-7 col-md-8 bg-alt-blue rounded-4 p-4">
							<p><span id="player1" role="text" data-skip-i18n="false" data-i18n-key="playerOne">${username}</span></p>
							${p2NameField}
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
							<p><input type="checkbox" id="powerUps" value="false"></p>
						</div>
					<div class="d-flex justify-content-center mt-4" >
						<label class="me-2">Power-Ups</label>
						<input type="checkbox" id="powerUps" value="false">
					</div>
					<div class="row mx-0 my-4 justify-content-center">
						<a href="#" data-i18n-key="start" id="startBtn" class="btn btn-dark rounded-pill px-4 bg-orange text-dark fw-bold box-shadow border-0 w-auto">Start</a>
					</div>
				</div>
			</div>
		`;
	}
}



document.addEventListener("input", (event) => {
	if (event.target.matches("#winRange")) {
		var slider = document.getElementById("winRange");
		var output = document.getElementById("demo");
		output.innerHTML = slider.value;
		localStorage.setItem("numberOfWins", slider.value);
	}
})

document.addEventListener("change", (event) => {
	event.preventDefault();
	if (event.target.matches("#theme")) {
		const theme = document.getElementById("theme").value;
		// newTheme = document.getElementById("theme")
		// newTheme.innerHTML = theme.value;
		console.log('theme', theme);
		localStorage.setItem("theme", theme);

	}
})

const readName = async () => {
	username = (document.querySelector("#username")?.value || '');
	username2 = (document.querySelector("#p2Name")?.value || '');

	// return (username2);

	console.log("Form is being submitted with names:", username, username2);
}

document.addEventListener("click", (event) => {
    if (event.target.matches("#powerUps")) {
		console.log("powerups!!!");
		const checkBox = document.getElementById("powerUps");
		// console.log("checkbox", checkBox);
		if (checkBox.value == "true") {
			checkBox.value = false;
			checkBox.checked = false;
			localStorage.setItem("powerUps", false);
		}
		else {
			checkBox.value = true;
			checkBox.checked = true;
			localStorage.setItem("powerUps", true)
		}
	}
    if (event.target.matches("#startBtn")) {
        // Prevent default link behavior if it's an <a> tag
        // event.preventDefault();
		// document.addEventListener("submit", e => {

			// Retrieve username and username2 values from the input fields
			const player2Input = document.getElementById("player2");
			if (player2Input) {
				username2 = player2Input.value || username2;
			}
			
			// console.log("Form is being submitted with names:", username, username2);
			// Build the URL with query parameters
			const url = `/game?username=${encodeURIComponent(username)}&username2=${encodeURIComponent(username2)}`;
			
			// Navigate to the URL
			navigateTo(url);
		// });
    }
});
