import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Instructions");
	}

	async getHtml() {
		return `
			<div id="game-screen" class="container bg-secondary rounded-5 mt-5 p-5" style="width: 960px; height: 540px;">
				<div class="row justify-content-center align-items-center bg-dark rounded-5 p-5 h-100 mx-auto">
					<a href="/select" data-i18n-key="back" class="text-success text-decoration-none" data-link><i class="bi bi-caret-left-fill"></i>Back</a>
					<h2 data-i18n-key="instructions" class="text-success text-center fw-bold fs-1">Instructions</h2>
					<img src="/src/assets/keyboard.png" alt="Keyboard" class="mx-auto mt-5 d-block" style="width: 100%;">
				</div>
			</div>
		`;
	}
}