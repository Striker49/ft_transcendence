//  export default `
//  <!-- About section -->
//  <section id="about">
//      <div class="container bg-dark bg-opacity-75 rounded-5 p-5">
//          <div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black">
//              <h2 data-i18n-key="about" class="text-center fs-1 fw-bold pb-2">About</h2>
//              <p data-i18n-key="aboutContent">
//                  This project is something you've never done before.
//                  Remember the beginning of your programming journey.
//                  Look at yourself now. It's your time to shine!
//              </p>
//          </div>
//      </div>
//  </section>
// `;

// export default `
//  <!-- About section -->
//  <section id="about">
//      <div class="container bg-dark bg-opacity-75 rounded-5 p-5">
//          <div class="bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black">
//              <div class="row mb-4 justify-content-center">
//                  <h4 class="bg-info w-auto px-4 py-2 rounded-bottom-4 fw-bold" data-i18n-key="about">About</h4>
//              </div>
//              <div class="row m-0 px-5">
//                  <div class="p-4 bg-info rounded-5">
//                      <img src="/src/assets/pong.png" alt="Pong - Original game" width="256" height="173" class="float-start mx-3 my-3">
//                      <p class="my-3 mx-3 text-justify" data-i18n-key="aboutContent">
//                          This project is something you've never done before.
//                          Remember the beginning of your programming journey.
//                          Look at yourself now. It's your time to shine!
//                      </p>
//                  </div>
//              </div>
//              <div class="row justify-content-center my-5">
//                  <button class="btn btn-dark border-0 rounded-pill bg-orange text-dark fw-bold px-4 m-2 w-auto fst-italic fs-5">The Team</button>
//              </div>
//              <div class="row bg-info my-5 mx-0" style="height: 128px;">
//                  <div class="col-4 px-3 text-end"><img src="/src/assets/avatar/avatar1.jpg" alt="Profile picture" width="150" height="150" style="margin-top: -10px" class="box-shadow"></div>
//                  <div class="col-8 p-3">
//                      <h5>Ziggy</h5>
//                      <p>Link to Github</p>
//                  </div>
//              </div>
//              <div class="row bg-info my-5 mx-0" style="height: 128px;">
//                  <div class="col-4 px-3 text-end"><img src="/src/assets/avatar/avatar1.jpg" alt="Profile picture" width="150" height="150" style="margin-top: -10px" class="box-shadow"></div>
//                  <div class="col-8 p-3">
//                      <h5>Seb</h5>
//                      <p>Link to Github</p>
//                  </div>
//              </div>
//              <div class="row bg-info my-5 mx-0" style="height: 128px;">
//                  <div class="col-4 px-3 text-end"><img src="/src/assets/avatar/avatar1.jpg" alt="Profile picture" width="150" height="150" style="margin-top: -10px" class="box-shadow"></div>
//                  <div class="col-8 p-3">
//                      <h5>Ziggy</h5>
//                      <p>Link to Github</p>
//                  </div>
//              </div>
//              <div class="row bg-info my-5 mx-0" style="height: 128px;">
//                  <div class="col-4 px-3 text-end"><img src="/src/assets/avatar/avatar1.jpg" alt="Profile picture" width="150" height="150" style="margin-top: -10px" class="box-shadow"></div>
//                  <div class="col-8 p-3">
//                      <h5>Ziggy</h5>
//                      <p>Link to Github</p>
//                  </div>
//              </div>
//          </div>
//      </div>
//  </section>
// `;

export default `
    <!-- About section -->
    <section id="about">
        <div class="container bg-dark bg-opacity-75 rounded-5 p-5">
            <div class="bg-info bg-opacity-50 border border-5 border-info rounded-5 text-black">
                <div class="row mb-4 justify-content-center">
                    <h4 class="bg-info w-auto px-4 py-2 rounded-bottom-4 fw-bold" data-i18n-key="about">About</h4>
                </div>
                <div class="row m-0 px-4">
					<div class="p-3">
						<div class="p-4 bg-info rounded-5 clearfix box-shadow">
							<img src="/src/assets/pong.png" alt="Pong - Original game" class="float-start p-3 w-100" style="max-width: 256px;">
							<p class="m-3" data-i18n-key="aboutContent">
								This project is something you've never done before.
								Remember the beginning of your programming journey.
								Look at yourself now. It's your time to shine!
							</p>
						</div>
					</div>
                </div>
                <div class="row justify-content-center my-5">
                    <button class="btn btn-dark border-0 rounded-pill bg-orange text-dark fw-bold px-4 m-2 w-auto fst-italic fw-bolder fs-5 box-shadow" data-i18n-key="theTeam">The Team</button>
                </div>
                <div class="row m-0 mb-4 px-4">
                    <div class="col-12 col-sm-6 col-lg-3 p-3">
						<div class="bg-info rounded-5 p-4 text-center box-shadow h-100">
							<img src="/src/assets/team/zvan-de-.jpg" alt="Profile picture" class="w-100 box-shadow">
							<h5 class="m-0 border-bottom border-2 border-dark d-flex align-items-center justify-content-center px-2" style="height: 84px;">Ziggy Van De Ven</h5>
							<div class="py-3 border-bottom border-2 border-dark d-flex flex-column align-items-center justify-content-center px-2" style="height: 84px;">
								<p class="m-0">Backend</p>
								<p class="m-0">Devops</p>
							</div>
							<p class="pt-2 m-0">
								<a href="https://github.com/ziggyvdven" target="_blank"><img src="/src/assets/icons/github.png" alt="Github icon" width="50" height="50" class="p-2"></a>
								<a href="#"><img src="/src/assets/icons/linkedin.png" alt="Linkedin icon" width="50" height="50" class="p-2"></a>
							</p>
						</div>
                    </div>
					<div class="col-12 col-sm-6 col-lg-3 p-3">
						<div class="bg-info rounded-5 p-4 text-center box-shadow h-100">
							<img src="/src/assets/team/seroy.jpg" alt="Profile picture" class="w-100 box-shadow">
							<h5 class="m-0 border-bottom border-2 border-dark d-flex align-items-center justify-content-center px-2" style="height: 84px;">Sébastien Roy</h5>
							<div class="py-3 border-bottom border-2 border-dark d-flex flex-column align-items-center justify-content-center px-2" style="height: 84px;">
								<p class="m-0">Game dev</p>
								<p class="m-0">Localization</p>
							</div>
							<p class="pt-2 m-0">
								<a href="https://github.com/Striker49" target="_blank"><img src="/src/assets/icons/github.png" alt="Github icon" width="50" height="50" class="p-2"></a>
								<a href="#"><img src="/src/assets/icons/linkedin.png" alt="Linkedin icon" width="50" height="50" class="p-2"></a>
							</p>
						</div>
                    </div>
					<div class="col-12 col-sm-6 col-lg-3 p-3">
						<div class="bg-info rounded-5 p-4 text-center box-shadow h-100">
							<img src="/src/assets/team/oroy.jpg" alt="Profile picture" class="w-100 box-shadow">
							<h5 class="m-0 border-bottom border-2 border-dark d-flex align-items-center justify-content-center px-2" style="height: 84px;">Olivier Roy</h5>
							<div class="py-3 border-bottom border-2 border-dark d-flex flex-column align-items-center justify-content-center px-2" style="height: 84px;">
								<p class="m-0">Frontend</p>
							</div>
							<p class="pt-2 m-0">
								<a href="https://github.com/oroy-dev" target="_blank"><img src="/src/assets/icons/github.png" alt="Github icon" width="50" height="50" class="p-2"></a>
								<a href="https://www.linkedin.com/in/olivier-roy-a1086463/" target="_blank"><img src="/src/assets/icons/linkedin.png" alt="Linkedin icon" width="50" height="50" class="p-2"></a>
							</p>
						</div>
                    </div>
					<div class="col-12 col-sm-6 col-lg-3 p-3">
						<div class="bg-info rounded-5 p-4 text-center box-shadow h-100">
							<img src="/src/assets/team/jupallar.jpg" alt="Profile picture" class="w-100 box-shadow">
							<h5 class="m-0 border-bottom border-2 border-dark d-flex align-items-center justify-content-center px-2" style="height: 84px;">Juan Pallares</h5>
							<div class="py-3 border-bottom border-2 border-dark d-flex flex-column align-items-center justify-content-center px-2" style="height: 84px;">
								<p class="m-0">Project structure</p>
							</div>
							<p class="pt-2 m-0">
								<a href="https://github.com/malloc-zero" target="_blank"><img src="/src/assets/icons/github.png" alt="Github icon" width="50" height="50" class="p-2"></a>
								<a href="#"><img src="/src/assets/icons/linkedin.png" alt="Linkedin icon" width="50" height="50" class="p-2"></a>
							</p>
						</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;