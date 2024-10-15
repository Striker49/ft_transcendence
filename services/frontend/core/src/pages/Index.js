import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Transcendence");
	}

	async getHtml() {
		// return `
		// 	<button id="left-btn" class="btn">Left</button>
		// 	<button id="right-btn" class="btn">Right</button>
		// 	<section id="left" class="d-none bg-secondary position-absolute start-0 translate-left mt-5" style="width: 100px; height: 100px; left: -50%;"></section>
		// 	<section id="center" class="position-absolute start-50 translate-middle-x">
		// 		<h1>
		// 			<a id="game-button" class="link-dark link-opacity-75-hover link-underline-opacity-0" href="/select" data-link>GAME</a>
		// 		</h1>
		// 	</section>
		// 	<section id="right" class="bg-secondary float-end position-absolute d-none" style="width: 100px; height: 100px; right: -100px; "></section>
		// `;
		return `
			<h1>
				<a id="game-button" class="link-dark link-opacity-75-hover link-underline-opacity-0" href="/select" data-link>GAME</a>
			</h1>
		`;
	}
}

// const goLeft = () => {

// 	const left = document.querySelector("#left");
// 	const center = document.querySelector("#center");
// 	const right = document.querySelector("#right");

// 	if (left.classList.contains("d-none")) {
// 		left.classList.remove("d-none");
// 		left.classList.remove("translate-left");
// 		left.classList.remove("start-0");
// 		left.classList.add("start-50");
// 		left.classList.add("translate-middle-x");
// 		center.classList.remove("start-50");
// 		center.classList.remove("translate-middle-x");
// 		center.classList.add("end-0");
// 		center.classList.add("translate-right");
// 		center.classList.add("d-none");
// 	}
// };

// const goRight = () => {
	
// 	const left = document.querySelector("#left");
// 	const center = document.querySelector("#center");
// 	const right = document.querySelector("#right");

// 	if (right.classList.contains("d-none")) {
// 		right.classList.remove("d-none");
// 		right.classList.remove("translate-left");
// 		right.classList.remove("start-0");
// 		right.classList.add("start-50");
// 		right.classList.add("translate-middle-x");
// 		center.classList.remove("start-50");
// 		center.classList.remove("translate-middle-x");
// 		center.classList.add("end-0");
// 		center.classList.add("translate-right");
// 		center.classList.add("d-none");
// 	}
// };

// document.addEventListener("click", e => {
// 	if (e.target.matches("#left-btn")) {
// 		console.log("left");
// 		goLeft();
// 	} else if (e.target.matches("#right-btn")) {
// 		console.log("right");
// 		goRight();
// 	}
// });