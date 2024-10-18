import Abstract from "./Abstract.js";

let userData;

const headers = new Headers({
	"Content-Type": "application/json",
	"Authorization": localStorage.getItem("transcendenceToken")
})

const options = {
	method: "GET",
	headers: headers
};

async function getUserProfile() {
	const url = "https://localhost/api/profiles/";
	try {
		const response = await fetch(url, options);
		if(!response.ok) { 
			throw new Error(`Response status: ${response.status}`);
		}
		const userData = await response.json();
		console.log("USER DATA", userData);
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
		getUserProfile();
		// console.log("user name: ", json[0].first_name);
		console.log("local storage: ", localStorage);
		console.log("token: ", localStorage.transcendenceToken);
		return `
			<div id="game-screen" class="container bg-secondary text-light rounded-5 mt-5 p-5" style="width: 960px; height: 540px;">
				<div class="row align-items-center bg-dark rounded-5 p-5 h-100 mx-auto">
				<span class="d-flex justify-content-center my-2 bg-transparent border-0 text-success fw-bold fs-5" role="text">${userData != null ? userData.username : "Player 1"}</span>
				<div class="slidecontainer">
					<label for="winRange" class="form-label d-flex justify-content-center text-success fw-bold fs-5" >Number of wins:<span id="demo" style="margin-left: 10px;">${localStorage.getItem('numberOfWins') || '3'}</span></label>
					<input type="range" class="form-range" min="1" max="11" value="${localStorage.getItem('numberOfWins') || '3'}" id="winRange">
					</div>
					<div>
						<class="flex-column" data-bs-theme="dark">
						<span class="d-flex justify-content-center my-2 bg-transparent border-0 text-success fw-bold fs-5" role="text">Theme</span>
						<div class="d-flex justify-content-center">
							<select id="theme" class="form-select auto-width-select" aria-label="Winter">
								<option value="None" ${localStorage.getItem('theme') === 'None' ? 'selected' : ''}>None</option>
								<option value="Christmas" ${localStorage.getItem('theme') === 'Christmas' ? 'selected' : ''}>Christmas</option>
								<option value="Halloween" ${localStorage.getItem('theme') === 'Halloween' ? 'selected' : ''}>Halloween</option>
								<option value="Winter" ${localStorage.getItem('theme') === 'Winter' ? 'selected' : ''}>Winter</option>
							</select>
						</div>
					<div class="mt-5 d-flex justify-content-center">
						<a href="/game" id="startBtn" class="btn btn-primary" data-link>START</a>
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
