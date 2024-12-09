// export default `
// 	<!-- About section -->
// 	<section id="about">
// 		<div class="container bg-dark bg-opacity-75 rounded-5 p-5">
// 			<div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black">
// 				<h2 data-i18n-key="about" class="text-center fs-1 fw-bold pb-2">About</h2>
// 				<p data-i18n-key="aboutContent">
// 					This project is something you've never done before.
// 					Remember the beginning of your programming journey.
// 					Look at yourself now. It's your time to shine!
// 				</p>
// 			</div>
// 		</div>
// 	</section>
// `;

export default `
	<!-- About section -->
	<section id="about">
		<div class="container bg-dark bg-opacity-75 rounded-5 p-5">
			<div class="bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black">
				<div class="row mb-4 justify-content-center">
					<h4 class="bg-info w-auto px-4 py-2 rounded-bottom-4 fw-bold" data-i18n-key="about">About</h4>
				</div>
				<div class="row m-0 bg-info">
					<p class="p-4 m-0">
						<img src="/src/assets/pong.png" alt="Pong - Original game" width="256" height="173" class="float-start me-4 mb-2">
						<span data-i18n-key="aboutContent">
							This project is something you've never done before.
							Remember the beginning of your programming journey.
							Look at yourself now. It's your time to shine!
						</span>
					</p>
				</div>
				<div class="row justify-content-center my-5">
					<button class="btn btn-dark border-0 rounded-pill bg-orange text-dark fw-bold px-4 m-2 w-auto">The team</button>
				</div>
				<div class="row bg-info my-5 mx-0 p-2" style="height: 128px;">
					<div class="col-4"><img src="/src/assets/avatar/avatar1.jpg" alt="Profile picture" width="150" height="150" style="margin-top: -20px" class="box-shadow"></div>
					<div class="col-8 p-2">
						<h5>Ziggy</h5>
						<p>Link to Github</p>
					</div>
				</div>
				<div class="row bg-info my-5 mx-0 p-2" style="height: 128px;">
					<div class="col-4"><img src="/src/assets/avatar/avatar1.jpg" alt="Profile picture" width="150" height="150" style="margin-top: -20px" class="box-shadow"></div>
					<div class="col-8 p-2">
						<h5>Ziggy</h5>
						<p>Link to Github</p>
					</div>
				</div>
				<div class="row bg-info my-5 mx-0 p-2" style="height: 128px;">
					<div class="col-4"><img src="/src/assets/avatar/avatar1.jpg" alt="Profile picture" width="150" height="150" style="margin-top: -20px" class="box-shadow"></div>
					<div class="col-8 p-2">
						<h5>Ziggy</h5>
						<p>Link to Github</p>
					</div>
				</div>
				<div class="row bg-info my-5 mx-0 p-2" style="height: 128px;">
					<div class="col-4"><img src="/src/assets/avatar/avatar1.jpg" alt="Profile picture" width="150" height="150" style="margin-top: -20px" class="box-shadow"></div>
					<div class="col-8 p-2">
						<h5>Ziggy</h5>
						<p>Link to Github</p>
					</div>
				</div>
			</div>
		</div>
	</section>
`;