import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Profile");
	}

	async getHtml() {
		return `
			<div id="game-screen" class="container bg-secondary rounded-5 mt-5 p-5" style="width: 960px; height: 540px;">
				<div class="row justify-content-center align-items-center bg-dark rounded-5 p-5 h-100 mx-auto">
					<h2 class="text-success text-center fw-bold fs-1">About</h2>
					<form>
						<div class="mb-4">
							<label for="username" class="form-label">Username:</label>
							<input type="text" class="form-control" id="username" placeholder="e.g. Mario">
						</div>
						<div class="mb-4">
							<label for="email" class="form-label">Email address:</label>
							<input type="email" class="form-control" id="email" placeholder="e.g. mario@example.com">
						</div>
						<div class="mb-4">
							<label for="profileImage" class="form-label">Upload Image</label>
							<input class="form-control" type="file" id="profileImage">
						</div>
						<div class="mb-4">
							<button type="submit" class="btn btn-secondary">Submit</button>
						</div>
					</form>
				</div>
			</div>
		`;
	}
}