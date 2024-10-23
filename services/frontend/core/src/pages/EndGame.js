import Abstract from "./Abstract.js";

const headers = new Headers({
	"Content-Type": "application/json",
	"Authorization": localStorage.getItem("transcendenceToken")
})

// async function sendGameStats() {
// 	const url = "https://localhost/api/profiles/";
// 	try {
// 		const response = await fetch(url, {
// 			method: "POST",
// 			headers: headers,
// 			body: {
// 				winner: ,
// 				score: 
// 			}
// 		});
// 		if(!response.ok) { 
// 			throw new Error(`Response status: ${response.status}`);
// 		}
// 		const stats = await response.json();
// 		console.log("RANKING", stats);
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// }

async function getRanking() {
	const url = "https://localhost/api/ranking/";
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: headers
		});
		if(!response.ok) { 
			throw new Error(`Response status: ${response.status}`);
		}
		const ranking = await response.json();
		console.log("RANKING", ranking);
	} catch (error) {
		console.error(error.message);
	}
}

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("End Game");
	}

	async getHtml() {
		// sendGameStats();
		// getRanking();
		return `
			<div id="game-screen" class="container bg-secondary text-light rounded-5 mt-5 p-5" style="width: 960px; height: 540px;">
				<div class="row align-items-center bg-dark rounded-5 p-5 h-100 mx-auto">
					<span data-i18n-key="ranking" class="d-flex justify-content-center my-2 bg-transparent border-0 text-success fw-bold fs-5" role="text">RANKING</span>
					<div class="d-flex justify-content-center">
					<ul>
					</ul>
					</div>
					<div class="mt-5 d-flex justify-content-center">
						<a href="/gameConfig" data-i18n-key="playAgain" id="playAgain" class="btn btn-primary" data-link>PLAY AGAIN</a>
					</div>
					</div>
					</div>
					<script>
					</script>
					`;
	}
}
