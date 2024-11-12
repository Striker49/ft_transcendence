import Abstract from "./Abstract.js";
import { navigateTo } from "../router/router.js";

let p2NameField;
let p2Name;
let username;
let username2;

const headers = new Headers({
	"Content-Type": "application/json",
	"Authorization": "Token " + localStorage.getItem("authToken")
})

const options = {
	method: "GET",
	headers: headers
};

async function getUserProfile() {
	if (!localStorage.getItem("authToken"))
		return;
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
	let nbPlayer = false;
    const params = new URLSearchParams(window.location.search);
    if (params.get(queryName) == "1")
	{
		console.log("One player detected");
		nbPlayer = true;
		p2NameField = "";
		localStorage.setItem("nbPlayer", "1");
	}
	else if (params.get(queryName) == "2")
	{
		console.log("Two players detected");
		nbPlayer = false;
		p2NameField = "<label class=\"d-flex justify-content-center my-2 fw-bold p-1\" id=\"p2Form\" for=\"player2\" class=\"form-label\"><span data-i18n-key=\"player\">Player</span> 2</label><input type=\"text\" class=\"form-control\" name=\"player2\" id=\"player2\">";
		localStorage.setItem("nbPlayer", "2");
	}
	else 
	{
		console.log("No player detected");
		p2NameField = "<label class=\"d-flex justify-content-center my-2 fw-bold p-1\" id=\"p2Form\" for=\"player2\" class=\"form-label\"><span data-i18n-key=\"player\">Player</span> 2</label><input type=\"text\" class=\"form-control\" name=\"player2\" id=\"player2\">";
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
		// console.log("user name: ", userData.username);
		// console.debug("local storage: ", localStorage);
		// console.debug("token: ", localStorage.authToken);
		return `
			<div id="game-screen" class="container bg-secondary text-light rounded-5 mt-5 p-5" style="width: 960px; height: 540px;">
				<div class="row align-items-center bg-dark rounded-5 p-5 h-100 mx-auto">
				<label class="d-flex justify-content-center fw-bold " id="p2Form" for="player1" class="form-label">
				<span data-i18n-key="playerOne">Player 1</label>
				<span id="player1" class="d-flex justify-content-center my-2 bg-transparent border-0 text-success fw-bold fs-5" role="text" data-skip-i18n="false" data-i18n-key="playerOne">${username}</span>
				${p2NameField}
				<div class="slidecontainer">
					<label for="winRange" class="form-label d-flex justify-content-center text-success fw-bold fs-5 my-2" ><span data-i18n-key="numberOfWins">Number of wins</span>:<span id="demo" style="margin-left: 10px;">${localStorage.getItem('numberOfWins') || '3'}</span></label>
					<input type="range" class="form-range" min="1" max="11" value="${localStorage.getItem('numberOfWins') || '3'}" id="winRange">
					</div>
					<div>
						<class="flex-column" data-bs-theme="dark">
						<span data-i18n-key="theme" class="d-flex justify-content-center my-2 bg-transparent border-0 text-success fw-bold fs-5" role="text">Theme</span>
						<div class="d-flex justify-content-center">
							<select id="theme" class="form-select auto-width-select" aria-label="Winter">
								<option data-i18n-key="none" value="None" ${localStorage.getItem('theme') === 'None' ? 'selected' : ''}>None</option>
								<option data-i18n-key="custom" value="Custom" ${localStorage.getItem('theme') === 'Custom' ? 'selected' : ''}>Custom</option>
								<option data-i18n-key="christmas" value="Christmas" ${localStorage.getItem('theme') === 'Christmas' ? 'selected' : ''}>Christmas</option>
								<option data-i18n-key="halloween" value="Halloween" ${localStorage.getItem('theme') === 'Halloween' ? 'selected' : ''}>Halloween</option>
								<option data-i18n-key="winter" value="Winter" ${localStorage.getItem('theme') === 'Winter' ? 'selected' : ''}>Winter</option>
							</select>
						</div>
					<div class="d-flex justify-content-center my-2 p-1">
						<label>Power-Ups</label>
						<div class="d-flex justify-content-center my-2 p-1">
							<input type="checkbox" id="powerUps" value="false">
						</div>
					<div class="mt-5 d-flex justify-content-center">
						<button type="submit" data-i18n-key="start" id="startBtn" class="btn btn-primary" >START</button>
					</div>
					</div>
					</div>
					<script>
					</script>
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
		console.log("checkbox", checkBox);
		if (checkBox.value == "true") {
			checkBox.value = false;
			localStorage.setItem("powerUps", false);
		}
		else {
			checkBox.value = true;
			localStorage.setItem("powerUps", true)
		}
	}
    if (event.target.matches("#startBtn")) {
        // Prevent default link behavior if it's an <a> tag
        // event.preventDefault();
		// document.addEventListener("submit", e => {

		// 	// Retrieve username and username2 values from the input fields
		// 	username2 = e.target.value || '';
			
			// console.log("Form is being submitted with names:", username, username2);
			// Build the URL with query parameters
			const url = `/game?username=${encodeURIComponent(username)}&username2=${encodeURIComponent(username2)}`;
			
			// Navigate to the URL
			navigateTo(url);
		// });
    }
});
