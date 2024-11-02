export default class {
	constructor() {
		this.customBehaviour = false;
	}

	executeCustomBehaviour() {
		
	}

	setCustomBehaviour(status) {
		this.customBehaviour = status;
	}

	setTitle(title) {
		document.title = title;
	}

	async getCustomBehaviour() {
		return this.customBehaviour;
	}

	async getHtml() {
		return "";
	}
}