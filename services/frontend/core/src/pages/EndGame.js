import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("End Game");
	}

	async getHtml() {
		return `
			<div id="game-screen" class="container bg-secondary text-light rounded-5 mt-5 p-5" style="width: 960px; height: 540px;">
				<div class="row align-items-center bg-dark rounded-5 p-5 h-100 mx-auto">
				<div class="slidecontainer"">
					<label for="customRange1" class="form-label text-success fw-bold fs-5" >Number of wins: <span id="demo">3</span></label>
					<input type="range" class="form-range" min="1" max="11" value="3" id="customRange1">
					</div>
					<div class="mt-5>
						<class="nav flex-column" data-bs-theme="dark">
						<span class="nav-link my-2 bg-transparent border-0 text-success fw-bold fs-5" role="text">Theme</span>
						<select class="form-select auto-width-select" aria-label="Default select example">
						<option selected>None</option>
						<option value="1">Christmas</option>
						<option value="2">Halloween</option>
						<option value="3">Winter</option>
						</select>
					<div class="mt-5 d-flex justify-content-center">
						<button type="submit" class="btn btn-primary">START</button>
					</div>
					</div>
					</div>
					<script>
					</script>
					`;
	}
}

document.addEventListener("input", (event) => {
	if (event.target.matches("#customRange1")) {
		var slider = document.getElementById("customRange1");
		var output = document.getElementById("demo");
		output.innerHTML = slider.value;
	}
})