import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Instructions");
		// initPageEvents();
	}

	async getHtml() {
		return `
			<div class="container bg-dark bg-opacity-75 rounded-5 p-5" id="instructions">
				<div class="bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black fw-bold">
					<div class="row m-0">
						<a href="/select" class="bg-info rounded-4 px-3 py-2 corner-back text-decoration-none text-black" style="width: 50px;" data-link>\<\<</a>
					</div>
					<div class="row justify-content-center mx-0 my-4">
						<div class="col col-sm-6 p-2 text-center border-4 border-end border-info">
							<h3 class="mb-4 fw-bold" data-i18n-key="playerOne">Player 1</h3>
							<div class="keyboard-icon box-shadow" id="keyW">W</div>
							<div class="keyboard-icon box-shadow" id="keyS">S</div>
						</div>
						<div class="col col-sm-6 p-2 text-center">
							<h3 class="mb-4 fw-bold" data-i18n-key="playerTwo">Player 2</h3>
							<div class="keyboard-icon box-shadow" id="keyUp"><i class="bi bi-caret-up-fill"></i></div>
							<div class="keyboard-icon box-shadow" id="keyDown"><i class="bi bi-caret-down-fill"></i></div>
						</div>
					</div>
					<div class="row justify-content-center mx-0 my-4">
						<div class="col-10 p-2 pt-4 text-center border-4 border-top border-info">
							<h3 class="mb-4 fw-bold" data-i18n-key="playerTwo">Reset camera</h3>
							<div class="space-icon box-shadow" id="keySpace"></div>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}

// ============ Events ==============

// const initPageEvents = () => {
// 	addEventListener("keydown", e => {
// 		switch (e.key) {
// 			case "w":
// 				document.querySelector("#keyW").classList.add("selected");
// 				break;
// 			case "s":
// 				document.querySelector("#keyS").classList.add("selected");
// 				break;
// 			case "ArrowUp":
// 				document.querySelector("#keyUp").classList.add("selected");
// 				break;
// 			case "ArrowDown":
// 				document.querySelector("#keyDown").classList.add("selected");
// 				break;
// 		}
// 	});
// 	addEventListener("keyup", e => {
// 		const selectedKeys = document.querySelectorAll("#instructions .selected");
// 		for (const key of selectedKeys) {
// 			key.classList.remove("selected");
// 		}
// 	});
// };