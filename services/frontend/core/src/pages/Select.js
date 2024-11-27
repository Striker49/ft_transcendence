import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Select");
	}

	async getHtml() {
		return `
			<div class="container bg-dark bg-opacity-75 rounded-5 mt-5 p-5" id="game-section">
				<div class="py-5 bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black">
					<ul class="nav flex-column text-center">
						<li class="nav-item pt-1 pb-2 selected">
							<a href="#" data-i18n-key="singleGame" class="nav-link text-black fw-bold fs-5">Single Game</a>
							<div class="d-none">
								<a data-i18n-key="onePlayer" class="text-decoration-none text-black fw-bold fst-italic d-inline p-2" href="/gameConfig?nbPlayer=1" data-link>1P</a>
								<a data-i18n-key="twoPlayers" class="text-decoration-none text-black fw-bold fst-italic d-inline p-2" href="/gameConfig?nbPlayer=2" data-link>2P</a>
							</div>
						</li>
						<li class="nav-item pt-1 pb-2">
							<a href="#" data-i18n-key="tournament" class="nav-link text-black fw-bold fs-5">Tournament</a>
							<div class="d-none">
								<a data-i18n-key="onePlayer" class="text-decoration-none text-black fw-bold fst-italic d-inline p-2" href="/tournament" data-link>1P</a>
								<a data-i18n-key="twoPlayers" class="text-decoration-none text-black fw-bold fst-italic d-inline p-2" href="/tournament" data-link>2P</a>
							</div>
						</li>
						<li class="nav-item pt-1 pb-2">
							<a data-i18n-key="instructions" class="nav-link text-black fw-bold fs-5" href="/instructions" data-link>Instructions</a>
						</li>
					</ul>
				</div>
			</div>
		`;
	}
}

// ============ Events ==============

document.addEventListener("click", e => {

	const element = e.target;

	switch (true) {

		case element.matches("#game-section .nav-link"):
			e.preventDefault();
			const navItems = document.querySelectorAll("#game-section .nav-item.selected");
			for (const navItem of navItems) {
				navItem.classList.remove("selected");
			}
			element.parentElement.classList.add("selected");
			break;
	}
});
