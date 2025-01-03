import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Tournament");
	}

	async getHtml() {
		return `
			<div class="container bg-dark bg-opacity-75 rounded-5 p-5">
        		<div class="bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black">
					<div class="row mb-4 justify-content-center">
						<h4 class="bg-info w-auto px-4 py-2 rounded-bottom-4 fw-bold" data-i18n-key="about">Tournament</h4>
					</div>
					<div class="row m-0 mt-4 p-4 bg-info">
						<div class="col tournament-column">
							<div class="tournament-block">Player 1</div>
							<div class="tournament-block"><input type="text"></div>
							<div class="tournament-block"><input type="text"></div>
							<div class="tournament-block"><input type="text"></div>
						</div>
						<div class="col tournament-column">
							<div class="tournament-block"></div>
							<div class="tournament-block"></div>
						</div>
						<div class="col tournament-column">
							<div class="tournament-block"></div>
						</div>
					</div>
					<div class="row mx-0 my-4 justify-content-center position-relative">
						<div class="position-absolute">
							<input type="checkbox" name="allCPU" id="allCPU">
						</div>
						<a href="#" data-i18n-key="start" id="startBtn" class="btn btn-dark rounded-pill px-4 bg-orange text-dark fw-bold box-shadow border-0 w-auto z-1">Start</a>
					</div>
				</div>
			</div>
		`;
	}
}