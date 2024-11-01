import Abstract from "./Abstract.js";

const headers = new Headers({
	"Content-Type": "application/json",
	"Authorization": localStorage.getItem("authToken")
})


async function getRanking() {
	const url = "https://localhost/api/game/ranking/";
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
		return (ranking);
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
		const ranking = await getRanking();
		// console.log(ranking);
		return `
			<div id="game-screen" class="container bg-secondary text-light rounded-5 mt-5 p-5" style="width: 960px; height: 540px;">
				<div class="row align-items-center bg-dark rounded-5 p-5 h-100 mx-auto">
					<span style="font-size: 30px;"data-i18n-key="ranking" class="d-flex justify-content-center my-2 bg-transparent border-0 text-success fw-bold fs-" role="text">RANKING</span>
					<div class="d-flex justify-content-center">
					<ul>
						<li style="font-size: 25px;"><span data-i18n-key="rank">Rank 1 </span>---><span class="fw-bold">${ranking && ranking.length > 0 ? ranking[0].username : "N/A"}</span></li>
						<li style="font-size: 25px;"><span data-i18n-key="rank">Rank 2 </span>---><span class="fw-bold">${ranking && ranking.length > 1 ? ranking[1].username : "N/A"}</span></li>
						<li style="font-size: 25px;"><span data-i18n-key="rank">Rank 3 </span>---><span class="fw-bold">${ranking && ranking.length > 2 ? ranking[2].username : "N/A"}</span></li>
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
