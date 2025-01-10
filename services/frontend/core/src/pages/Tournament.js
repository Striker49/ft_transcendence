import Abstract from "./Abstract.js";
import { navigateTo } from "../router/router.js";
import { shuffle } from "../utils/random.js";

const goToConfig = () => {
	localStorage.removeItem("tournament");
	localStorage.removeItem("tournamentMatch");
	navigateTo("/tournamentConfig");
};

const createCol = (isBracket, isSecondCol) => {

	const col = document.createElement("div");
	col.className = "col";

	if (isBracket) {

		const row = document.createElement("div");
		row.classList.add("row", "w-100", "bracket-h");
		col.classList.add("d-flex", "align-items-center");
		if (isSecondCol) {
			col.classList.add("justify-content-end");
		}
		col.appendChild(row);
	}
	return col;
};

const createRow = (idx, multiplier) => {

	const row = document.createElement("div");
	row.classList.add("row", "w-100", "justify-content-center", "align-items-center", "position-relative");

	if (idx > 1) {
		row.classList.add("bracket-v");
		row.style.height = (70 * (multiplier / 2) + 4) + "px";
	}
	return row;
};

const createColumnBlocks = (idx, names, match, nbPlayer, nbBlocks, blockID, end) => {

	const fragment = document.createDocumentFragment();
	// const match = Number(localStorage.getItem("tournamentMatch")) * 2;

	for (let i = 0; i < nbBlocks; ++i, ++blockID) {

		const row = createRow(idx, nbPlayer / nbBlocks);
		const block = document.createElement("div");
		block.classList.add("tournament-block", "rounded-pill", "box-shadow");
		if (blockID === match || blockID - 1 === match) {
			if (end) {
				block.classList.add("bg-orange");
			} else {
				block.classList.add("bg-white");
			}
			block.id = blockID === match ? "p1" : "p2";
		}
		if (names && names[blockID]) {
			block.textContent = names[blockID];
		}
		if (end && nbBlocks === 1) {
			const winnerText = document.createElement("p");
			winnerText.classList.add("fw-bold", "fs-2", "position-absolute", "top-0", "text-center");
			if (nbPlayer === 8) {
				winnerText.classList.add("mt-5");
			}
			winnerText.setAttribute("data-i18n-key", "winner");
			winnerText.textContent = "Winner";
			row.appendChild(winnerText);
		}
		row.appendChild(createCol(idx > 1, false));
		row.appendChild(block);
		row.appendChild(createCol(nbBlocks > 1, true));

		fragment.appendChild(row);
	}
	return fragment;
};

const createTournament = (nbPlayer, names, end) => {

	const match = (names.length % nbPlayer) * 2;
	const nbColumns = nbPlayer === 8 ? 4 : 3;
	const diagram = document.createElement("div");
	diagram.classList.add("row", "m-0", "mt-4", "p-4", "bg-info");

	for (let idx = 1, blockID = 0; idx <= nbColumns; ++idx) {

		const nbBlocks = idx === nbColumns ? 1 : Math.floor(nbPlayer / idx);
		const column = document.createElement("div");
		column.classList.add("col", "tournament-column");
		column.appendChild(createColumnBlocks(idx, names, match, nbPlayer, nbBlocks, blockID, end));
		diagram.appendChild(column);
		blockID += nbBlocks;
	}
	return diagram.outerHTML;
};

const displayTournamentBtn = end => {

	const btn = document.createElement('a');
	const btnClasses = [
		"btn",
		"btn-dark",
		"rounded-pill",
		"px-4",
		"bg-orange",
		"border-0",
		"text-dark",
		"fw-bold",
		"box-shadow",
		"w-auto",
		"z-1"
	];

	btn.classList.add(...btnClasses);
	btn.setAttribute('href', '#');

	if (end) {
		btn.id = "playAgainBtn";
		btn.setAttribute('data-i18n-key', 'playAgain');
		btn.textContent = "Play Again";
	} else {
		btn.id = "startMatchBtn";
		btn.setAttribute('data-i18n-key', 'start');
		btn.textContent = "Start";
	}

	return btn.outerHTML;
};

const getEndState = (nbPlayer, names) => {

	if ((nbPlayer === 4 && names.length === 7)
	||	(nbPlayer === 8 && names.length === 15)) {
		console.log("Tournament Over");
		return true;
	}
	return false;
};

const getNumberOfPlayers = () => {

	// const queryString = window.location.search;
	// const query = new URLSearchParams(queryString);
	// const nbPlayer = query.get("nbPlayer");

	const nbPlayer = localStorage.getItem("nbPlayer");

	if (!nbPlayer || !(nbPlayer === "4" || nbPlayer === "8")) {
		goToConfig();
	}
	return Number(localStorage.getItem("nbPlayer"));
};

const matchmaking = () => {

	const names = JSON.parse(localStorage.getItem("tournament"));
	const array = shuffle(names);

	localStorage.setItem("tournament", JSON.stringify(array));
	// localStorage.setItem("tournamentMatch", 0);
};

// const setTournamentMatch = nbPlayer => {

// 	const tournament = JSON.parse(localStorage.getItem("tournament"));

// 	localStorage.setItem("tournamentMatch", tournament.length % nbPlayer);
// };

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Tournament");
	}

	async getHtml() {

		const nbPlayer = getNumberOfPlayers();

		if (!localStorage.getItem("tournament")) {
			goToConfig();
		} else if (JSON.parse(localStorage.getItem("tournament")).length === nbPlayer) {
			matchmaking();
		}

		// setTournamentMatch(nbPlayer);

		const names = JSON.parse(localStorage.getItem("tournament"));
		const end = getEndState(nbPlayer, names);
		const tournament = createTournament(nbPlayer, names, end);
		const tournamentBtn = displayTournamentBtn(end);

		return `
			<div class="container bg-dark bg-opacity-75 rounded-5 p-5">
				<div class="bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black">
					<div class="row mb-4 justify-content-center">
						<h4 class="bg-info w-auto px-4 py-2 rounded-bottom-4 fw-bold">Tournament</h4>
					</div>
					${tournament}
					<div class="row mx-0 my-4 justify-content-center position-relative">
						${tournamentBtn}
					</div>
				</div>
			</div>
		`;
	}
}

// ============ Events ==============

document.addEventListener("click", e => {

	const element = e.target;

	switch (true) {

		case element.matches("#startMatchBtn"):
			e.preventDefault();
			// Retrieve player 1 and player 2 names
			const p1 = document.getElementById("p1").textContent;
			const p2 = document.getElementById("p2").textContent;
			// Build the URL with query parameters
			const url = `/game?username=${encodeURIComponent(p1)}&username2=${encodeURIComponent(p2)}`;
			// Navigate to the URL
			navigateTo(url);
			break;
		
		case element.matches("#playAgainBtn"):
			e.preventDefault();
			goToConfig();
			break;
	}
});