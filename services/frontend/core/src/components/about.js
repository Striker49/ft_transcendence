export default `
	<!-- About section -->
	<section id="about" class="translate-left d-none">
		<div class="container bg-secondary p-5 rounded-5">
			<h2 class="text-success text-center fw-bold fs-1">About</h2>
			<p class="text-light">
				Ce projet est quelque chose que vous n’avez jamais fait auparavant.
				Rappelez-vous du début de votre voyage en programmation.
				Regardez-vous maintenant. C’est le temps de briller !
			</p>
		</div>
	</section>
`;

export const translateLeft = () => {

	const divs = {
		left: document.querySelector("#about"),
		center: document.querySelector("main"),
		right: document.querySelector("#profile"),
	};

	if (divs.left.classList.contains("d-none")) {
		
		divs.left.classList.remove("d-none");
		animate(divs, "100");

		// left.classList.remove("translate-left");
		// left.classList.add("start-50");
		// left.classList.add("translate-middle-x");
		// center.classList.remove("start-50");
		// center.classList.remove("translate-middle-x");
		// center.classList.add("end-0");
		// center.classList.add("translate-right");
		// center.classList.add("d-none");
	}
};

const animate = (divs, percent) => {

	for (const [key, value] of Object.entries(divs)) {
		value.style.transform = `translate(-${percent}%)`;
	};

	if (percent > 0) {
		console.log("Helo");
		requestAnimationFrame(() => animate(divs, percent - 5));
	}
};
