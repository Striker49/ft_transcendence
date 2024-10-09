import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Profile");
	}

	async getHtml() {
		return `
			<div id="game-screen" class="container bg-secondary rounded-5 mt-5 p-5" style="width: 960px;">
				<div class="row justify-content-center align-items-center text-light bg-dark rounded-5 p-5 h-100 mx-auto">
					<h2 class="text-success text-center fw-bold fs-1">Profile</h2>
					<form id="registration-form" action="" method="post">
						<div class="mb-4">
							<label for="email" class="form-label">Email:</label>
							<input type="email" class="form-control" id="email" required>
						</div>
						<div class="mb-4">
							<label for="username" class="form-label">Username:</label>
							<input type="text" class="form-control" id="username" required>
						</div>
						<div class="mb-4">
							<label for="password" class="form-label">Password:</label>
							<input type="password" class="form-control" id="password" required>
						</div>
						<div class="mb-4">
							<label for="firstname" class="form-label">First name:</label>
							<input type="text" class="form-control" id="firstname">
						</div>
						<div class="mb-4">
							<label for="lastname" class="form-label">Last name:</label>
							<input type="text" class="form-control" id="lastname">
						</div>
						<div class="mb-4">
							<label for="avatar" class="form-label">Upload avatar image:</label>
							<input type="file" class="form-control" id="avatar">
						</div>
						<div class="mb-4">
							<label for="bio" class="form-label">Bio:</label>
							<textarea class="form-control" id="bio"></textarea>
						</div>
						<div class="mb-4">
							<label for="lang" class="form-label">Language:</label>
							<select class="form-select" id="lang">
								<option value="en">English</option>
								<option value="fr">French</option>
								<option value="nl">Dutch</option>
							</select>
						</div>
						<div class="mb-4">
							<button type="submit" class="btn btn-secondary ">Submit</button>
						</div>
					</form>
				</div>
			</div>
		`;
	}
}