import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Transcendence");
	}

	async getHtml() {
		return `
			<h1>
				<a data-i18n-key="game" id="game-button" class="link-dark link-opacity-75-hover link-underline-opacity-0" href="/select" data-link>GAME</a>
			</h1>
		`;
	}
}