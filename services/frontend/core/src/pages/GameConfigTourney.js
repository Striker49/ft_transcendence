import Abstract from "./Abstract.js";


const validateTourneyUsername = (username, isValid) => {

	const span = username.nextElementSibling;

	if (username.value === "") {
		printError(span, "usernameRequired", "Username is required");
		return false;
	}
	clearSpan(span);
	return isValid;
};

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
		// userData = {first_name: "Guest"};
	}
}

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Game Settings");
	}

	async getHtml() {
		const userData = await getUserProfile();
		const username = (userData ? userData.username : "Player 1")
		const username2 = "Player 2";
		// console.log("user name: ", userData.username);
		// console.debug("local storage: ", localStorage);
		// console.debug("token: ", localStorage.transcendenceToken);
		return `
			<div id="game-screen" class="container bg-secondary text-light rounded-5 mt-5 p-5" style="width: 960px; height: 1010px;">
				<div class="row align-items-center bg-dark rounded-5 p-5 h-150 mx-auto">
				<form action="" method="post" enctype="multipart/form-data" class="fw-bold" id="tourney-config-form">
				<div class="column p-5 py-2 pt-4">
					<label for="player1" class="form-label"><span data-i18n-key="player">Player</span> 1</label>
					<input type="text" class="form-control" name="player1" id="player1">
					<label for="player3" class="form-label pt-4"><span data-i18n-key="player">Player</span> 3</label>
					<input type="text" class="form-control" name="player3" id="player3">
					<label for="player5" class="form-label pt-4"><span data-i18n-key="player">Player</span> 5</label>
					<input type="text" class="form-control" name="player5" id="player5">
					<label for="player7" class="form-label pt-4"><span data-i18n-key="player">Player</span> 7</label>
					<input type="text" class="form-control" name="player7" id="player7">
				</div>
				<div class="column p-5 py-2 pt-4">
					<label for="player2" class="form-label"><span data-i18n-key="player">Player</span> 2</label>
					<input type="text" class="form-control" name="player2" id="player2">
					<label for="player4" class="form-label pt-4"><span data-i18n-key="player">Player</span> 4</label>
					<input type="text" class="form-control" name="player4" id="player4">
					<label for="player6" class="form-label pt-4"><span data-i18n-key="player">Player</span> 6</label>
					<input type="text" class="form-control" name="player6" id="player6">
					<label for="player8" class="form-label pt-4"><span data-i18n-key="player">Player</span> 8</label>
					<input type="text" class="form-control" name="player8" id="player8">
				</div>
			</form>
				<div class="p-5">
					<label for="winRange" class="form-label d-flex justify-content-center text-success fw-bold fs-5" ><span data-i18n-key="numberOfWins">Number of wins</span>:<span id="demo" style="margin-left: 10px;">${localStorage.getItem('numberOfWins') || '3'}</span></label>
					<input type="range" class="form-range" min="1" max="11" value="${localStorage.getItem('numberOfWins') || '3'}" id="winRange">
					<class="flex-column" data-bs-theme="dark">
					<span data-i18n-key="theme" class="d-flex justify-content-center my-2 bg-transparent border-0 text-success fw-bold fs-5 p-3" role="text">Theme</span>
					<div class="d-flex justify-content-center">
						<select id="theme" class="form-select auto-width-select" aria-label="Winter">
							<option data-i18n-key="none" value="None" ${localStorage.getItem('theme') === 'None' ? 'selected' : ''}>None</option>
							<option data-i18n-key="christmas" value="Christmas" ${localStorage.getItem('theme') === 'Christmas' ? 'selected' : ''}>Christmas</option>
							<option data-i18n-key="halloween" value="Halloween" ${localStorage.getItem('theme') === 'Halloween' ? 'selected' : ''}>Halloween</option>
							<option data-i18n-key="winter" value="Winter" ${localStorage.getItem('theme') === 'Winter' ? 'selected' : ''}>Winter</option>
						</select>
					</div>
				</div>
				<div class="mt-5 d-flex justify-content-center">
						<a href="/game?username=${encodeURIComponent(username)}&username2=${encodeURIComponent(username2)}" data-i18n-key="start" id="startBtn" class="btn btn-primary" data-link>START</a>
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


document.addEventListener("click", (event) => {
	if (event.target.matches("#startBtn"))
	{
		event.preventDefault();
		if (validateTourneyUsername())
			console.log("names are OK");
		else
			console.log("names are NOT OK");
	}
})