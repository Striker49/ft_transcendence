import Abstract from "./Abstract.js";

// const headers = new Headers({
// 	"Content-Type": "application/json",
// 	"Authorization": `Token ${localStorage.getItem("authToken")}`
// })

async function getRanking() {
	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${localStorage.getItem("authToken")}`
	});
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
		// return `
		// 	<div class="container bg-dark bg-opacity-75 rounded-5 p-5">
		// 		<div class="bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black fw-bold text-center">
		// 			<div class="row mb-4 justify-content-center">
		// 				<h4 class="bg-info w-auto px-4 py-2 rounded-bottom-4 fw-bold" data-i18n-key="ranking">Ranking</h4>
		// 			</div>
		// 			<div class="row bg-info my-3 mx-0 p-2 align-items-center">
		// 				<div class="col-4"><span data-i18n-key="rank">Rank</span> 1</div>
		// 				<div class="col-8 bg-alt-blue rounded-2 p-2">${ranking && ranking.length > 0 ? ranking[0].username : "N/A"}</div>
		// 			</div>
		// 			<div class="row bg-info my-3 mx-0 p-2 align-items-center">
		// 				<div class="col-4 p-2"><span data-i18n-key="rank">Rank</span> 2</div>
		// 				<div class="col-8 bg-alt-blue rounded-2 p-2">${ranking && ranking.length > 1 ? ranking[1].username : "N/A"}</div>
		// 			</div>
		// 			<div class="row bg-info my-3 mx-0 p-2 align-items-center">
		// 				<div class="col-4 p-2"><span data-i18n-key="rank">Rank</span> 3</div>
		// 				<div class="col-8 bg-alt-blue rounded-2 p-2">${ranking && ranking.length > 2 ? ranking[2].username : "N/A"}</div>
		// 			</div>
		// 			<div class="row mx-0 my-4 justify-content-center">
		// 				<a href="/gameConfig" data-i18n-key="playAgain" id="playAgain" class="btn btn-dark rounded-pill px-4 bg-orange text-dark fw-bold box-shadow border-0 w-auto" data-link>Play again</a>
		// 			</div>
		// 		</div>
		// 	</div>
		// `;
		return `
			<div class="container bg-dark bg-opacity-75 rounded-5 p-5">
				<div class="bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black fw-bold text-center">
					<div class="row mb-4 justify-content-center">
						<h4 class="bg-info w-auto px-4 py-2 rounded-bottom-4 fw-bold" data-i18n-key="ranking">Ranking</h4>
					</div>
					<div class="row bg-info my-3 mx-0 pb-4 justify-content-center" id="ranking-section">
						<div class="col-12 col-sm-2 position-relative">
							<div class="rank-block ">
								<h5 class="my-4 fw-bold">${ranking && ranking.length > 0 ? ranking[0].username : "N/A"}</h5>
								<div class="bg-alt-blue p-2 rounded-3" style="height: 100px;"><span data-i18n-key="rank">Rank</span> 1</div>
							</div>
						</div>
						<div class="col-12 col-sm-2 order-sm-first position-relative">
							<div class="rank-block">
								<h5 class="my-4 fw-bold">${ranking && ranking.length > 1 ? ranking[1].username : "N/A"}</h5>
								<div class="bg-alt-blue p-2 rounded-3" style="height: 80px;"><span data-i18n-key="rank">Rank</span> 2</div>
							</div>
						</div>
						<div class="col-12 col-sm-2 order-sm-last position-relative">
							<div class="rank-block">
								<h5 class="my-4 fw-bold">${ranking && ranking.length > 2 ? ranking[2].username : "N/A"}</h5>
								<div class="bg-alt-blue p-2 rounded-3" style="height: 60px;"><span data-i18n-key="rank">Rank</span> 3</div>
							</div>
						</div>
					</div>
					<div class="row mx-0 my-4 justify-content-center">
						<a href="/gameConfig" data-i18n-key="playAgain" id="playAgain" class="btn btn-dark rounded-pill px-4 bg-orange text-dark fw-bold box-shadow border-0 w-auto" data-link>Play again</a>
					</div>
				</div>
			</div>
		`;
	}
}
