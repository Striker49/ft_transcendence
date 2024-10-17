import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Game Settings");
	}

	async getHtml() {
		return `
			<div id="game-screen" class="container bg-secondary text-light rounded-5 mt-5 p-5" style="width: 960px; height: 540px;">
				<div class="row align-items-center bg-dark rounded-5 p-5 h-100 mx-auto">
				<div class="slidecontainer">
					<label for="winRange" class="form-label d-flex justify-content-center text-success fw-bold fs-5" >Number of wins:<span id="demo" style="margin-left: 10px;">3</span></label>
					<input type="range" class="form-range" min="1" max="11" value="3" id="winRange">
					</div>
					<div>
						<class="flex-column" data-bs-theme="dark">
						<span class="d-flex justify-content-center my-2 bg-transparent border-0 text-success fw-bold fs-5" role="text">Theme</span>
						<div class="d-flex justify-content-center">
							<select class="d-flex justify-content-centerform-select auto-width-select" aria-label="Default select example">
							<option selected>None</option>
							<option value="1">Christmas</option>
							<option value="2">Halloween</option>
							<option value="3">Winter</option>
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

document.addEventListener("input", (event) => {
	if (event.target.matches("#theme")) {
		theme = document.getElementById("theme");
		newTheme = document.getElementById("theme")
		newTheme.innerHTML = theme.value;
		console.log('theme', theme);
		localStorage.setItem("theme", theme.value);

	}
})

document.addEventListener('click', function (event){
	event.preventDefault();
	if (event.target.matches("#startBtn")) {
		// console.log('allo', document.getElementById("winRange").value);
		// console.log(event.target);
		// const numberOfWins = document.getElementById("winRange").value;
		// const theme = document.getElementById("theme").value;
		
		// localStorage.setItem("numberOfWins", numberOfWins);
		// localStorage.setItem("theme", theme);
		console.log(localStorage);
		// window.location.href = "/game";
	}
})