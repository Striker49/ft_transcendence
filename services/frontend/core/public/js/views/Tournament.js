import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Tournament");
	}

	async getHtml() {
		return `
			<div id="game-screen" class="container bg-secondary rounded-5 mt-5 p-5" style="width: 960px; height: 540px;">
				<div class="row justify-content-center align-items-center bg-dark rounded-5 p-5 h-100 mx-auto">
					<div class="col-8">
						<img src="/images/tournament.png" alt="Tournament diagram" class="w-100">
					</div>
					<div class="col-4">
						<a href="/game" role="button" class="btn btn-success d-block" data-link>Start Game</a>
					</div>	
				</div>
			</div>
		`;
	}
}