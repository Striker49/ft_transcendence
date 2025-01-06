import Abstract from "./Abstract.js";
import { shuffle } from "../utils/random.js";

let blockID = 0;
const match = Number(localStorage.getItem("tournamentMatch")) * 2;

const matchmaking = async () => {

	const names = JSON.parse(localStorage.getItem("tournament"));	
	const array = shuffle(names);

	localStorage.setItem("tournament", JSON.stringify(array));
	localStorage.setItem("tournamentMatch", 0);
};

const createColumnBlocks = (idx, nbPlayer, names, isEnd) => {

	const nbBlocks = isEnd ? 1 : nbPlayer / idx;
	const fragment = document.createDocumentFragment();

	for (let i = 0; i < nbBlocks; ++i, ++blockID) {

		const block = document.createElement("div");
		block.className = "tournament-block";
		if (blockID === match || blockID - 1 === match) {
			block.classList.add("bg-primary");
		}
		if (names[blockID]) {
			block.textContent = names[blockID];
		}
		fragment.appendChild(block);
	}
	return fragment;
};

const createTournament = async () => {

	const queryString = window.location.search;
	const query = new URLSearchParams(queryString);
	const nbPlayer = query.get("nbPlayer");
	const nbColumns = nbPlayer === "8" ? 4 : 3;

	const diagram = document.createElement("div");
	diagram.classList.add("row", "m-0", "mt-4", "p-4", "bg-info");

	const names = JSON.parse(localStorage.getItem("tournament"));

	for (let idx = 1; idx <= nbColumns; ++idx) {

		const column = document.createElement("div");
		column.classList.add("col", "tournament-column");
		column.appendChild(createColumnBlocks(idx, Number(nbPlayer), names, idx === nbColumns));
		diagram.appendChild(column);
	}
	return diagram.outerHTML;
};

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Tournament");
	}

	async getHtml() {

		if (!localStorage.getItem("tournamentMatch")) {
			await matchmaking();
		}
		const tournament = await createTournament();

		return `
			<div class="container bg-dark bg-opacity-75 rounded-5 p-5">
        		<div class="bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black">
					<div class="row mb-4 justify-content-center">
						<h4 class="bg-info w-auto px-4 py-2 rounded-bottom-4 fw-bold">Tournament</h4>
					</div>
					${tournament}
					<div class="row mx-0 my-4 justify-content-center position-relative">
						<a href="#" data-i18n-key="start" id="startBtn" class="btn btn-dark rounded-pill px-4 bg-orange text-dark fw-bold box-shadow border-0 w-auto z-1">Start</a>
					</div>
				</div>
			</div>
		`;
	}
}

// ==================== HTML tournament

/* <div class="row m-0 mt-4 p-4 bg-info">
<div class="col tournament-column">
	<div class="tournament-block">Player 1</div>
	<div class="tournament-block">${names[i++]}</div>
	<div class="tournament-block">${names[i++]}</div>
	<div class="tournament-block">${names[i++]}</div>
</div>
<div class="col tournament-column">
	<div class="tournament-block"></div>
	<div class="tournament-block"></div>
</div>
<div class="col tournament-column">
	<div class="tournament-block"></div>
</div>
</div> */