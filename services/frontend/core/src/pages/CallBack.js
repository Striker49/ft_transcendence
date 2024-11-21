import Abstract from "./Abstract.js";
import { navigateTo } from "../router/router.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("CallBack");
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
	console.log("code: ", query.get("code"));

	const token = localStorage.getItem("authToken");

	const body = {
		"code": query.get("code")
	};
	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`
	});

	const url = 'https://localhost/api/42/login/';

	const options = {
		method: "POST",
		body: JSON.stringify(body),
		headers: headers
	};

	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const data = await response.json();
		console.log(data);
		alert("42 authentication successful");
	} catch (error) {
		console.error(error.message);
		alert("42 authentication failed");
	}
	navigateTo("/profile");
};

authenticate42();