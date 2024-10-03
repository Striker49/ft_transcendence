import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Game");
	}

	async getHtml() {
		return `
			<div id="game" class="mt-5"></div>
		`;
	}

	async getJS() {
		return { url: "/js/game/main.js", isModule: true };
	}
}