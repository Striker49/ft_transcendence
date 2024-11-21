import Abstract from "./Abstract.js";
import { navigateTo } from "../router/router.js";
import { updateLogin } from "../components/login.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("CallBack");
		authenticate42();
	}

	async getHtml() {
		return `
			<div class="container bg-dark bg-opacity-75 rounded-5 mt-5 p-5" id="game-section">
				<div class="py-5 bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black">
					<p class="text-center fs-5 fst-italic m-0">42 authentication in progress ...</p> 
				</div>
			</div>
		`;
	}
}

const authenticate42 = async () => {

	const queryString = window.location.search;
	const query = new URLSearchParams(queryString);	

	const token = localStorage.getItem("authToken");

	const headers = new Headers({
		"Content-Type": "application/json"
	});
	if (token) {
		headers.append("Authorization", `Token ${token}`);
	}

	const url = `https://localhost/api/users/42/callback?code=${query.get("code")}`;

	const options = {
		method: "GET",
		headers: headers
	};

	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const data = await response.json();

		if (data.token) {
			localStorage.setItem("authToken", data.token);
		}
		localStorage.setItem("UID", data.UID);
		localStorage.setItem("username", data.username);
		localStorage.setItem("lang", data.lang_pref);
		updateLogin();
	} catch (error) {
		console.error(error.message);
	}
	navigateTo("/profile");
};