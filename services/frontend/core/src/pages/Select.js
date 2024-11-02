import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Select");
	}

	async getHtml() {
		return `
			<div id="game-screen" class="container bg-secondary rounded-5 mt-5 p-5" style="width: 960px; height: 540px;">
				<div class="row justify-content-center align-items-center bg-dark rounded-5 p-5 h-100 mx-auto">
					<ul class="nav flex-column text-center" data-bs-theme="dark">
						<li class="nav-item dropdown-center">
							<a href="#" data-i18n-key="singleGame" class="nav-link my-2 bg-transparent border-0 text-success fw-bold fs-5" data-bs-toggle="dropdown" role="button" aria-expanded="false">Single Game</a>
							<ul class="dropdown-menu">
								<li><a data-i18n-key="onePlayer" class="dropdown-item text-success fw-bold" href="/gameConfig" data-link>1 Player</a></li>
								<li><a data-i18n-key="twoPlayers" class="dropdown-item text-success fw-bold" href="/gameConfig" data-link>2 Players</a></li>
							</ul>
						</li>
						<li class="nav-item dropdown-center">
							<a href="#" data-i18n-key="tournament" class="nav-link my-2 bg-transparent border-0 text-success fw-bold fs-5" data-bs-toggle="dropdown" role="button" aria-expanded="false">Tournament</a>
							<ul class="dropdown-menu">
								<li><a data-i18n-key="onePlayer" class="dropdown-item text-success fw-bold" href="/tournament" data-link>1 Player</a></li>
								<li><a data-i18n-key="twoPlayers" class="dropdown-item text-success fw-bold" href="/tournament" data-link>2 Players</a></li>
							</ul>
						</li>
						<li class="nav-item">
							<a data-i18n-key="instructions" class="nav-link my-2 bg-transparent border-0 text-success fw-bold fs-5" href="/instructions" data-link>Instructions</a>
						</li>
					</ul>
				</div>
			</div>
		`;
	}
}