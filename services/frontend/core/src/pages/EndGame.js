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
					<span class="d-flex justify-content-center my-2 bg-transparent border-0 text-success fw-bold fs-5" role="text">RANKING</span>
					<div class="d-flex justify-content-center">
					<ul>
					</ul>
					</div>
					<div class="mt-5 d-flex justify-content-center">
						<button type="submit" class="btn btn-primary">PLAY AGAIN</button>
					</div>
					</div>
					</div>
					<script>
					</script>
					`;
	}
}

document.addEventListener("input", (event) => {
	if (event.target.matches("#submit")) {
		var slider = document.getElementById("customRange1");
		var output = document.getElementById("demo");
		output.innerHTML = slider.value;
	}
})