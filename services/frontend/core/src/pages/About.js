import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("About");
	}

	// async getHtml() {
	// 	return `
	// 		<div id="game-screen" class="container bg-secondary rounded-5 mt-5 p-5" style="width: 960px; height: 540px;">
	// 			<div class="row justify-content-center align-items-center bg-dark rounded-5 p-5 h-100 mx-auto">
	// 				<h2 class="text-success text-center fw-bold fs-1">About</h2>
	// 				<p class="text-light">
	// 					Ce projet est quelque chose que vous n’avez jamais fait auparavant.
	// 					Rappelez-vous du début de votre voyage en programmation.
	// 					Regardez-vous maintenant. C’est le temps de briller !
	// 				</p>
	// 			</div>
	// 		</div>
	// 	`;
	// }
}