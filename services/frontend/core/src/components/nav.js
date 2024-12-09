export default `
	<!-- Navbar -->
	<nav class="navbar navbar-expand-md p-0 mb-5" data-bs-theme="dark">
		<div class="container-fluid">
			<button class="navbar-toggler my-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse justify-content-center text-center fw-bolder fs-5 pb-4" id="navbarNav">
				<ul class="navbar-nav">
					<li class="nav-item py-3" style="width: 200px;">
						<a class="nav-link" href="/about" data-link data-i18n-key="about">About</a>
					</li>
					<li class="nav-item px-5 py-3" id="menu-main-item">
						<a class="nav-link" aria-current="page" href="/" data-link>Transcendence</a>
					</li>
					<li class="nav-item py-3" style="width: 200px;">
						<a class="nav-link" href="/profile" data-link data-i18n-key="profile">Profile</a>
					</li>
				</ul>
				<div class="navbar-right">
					<div id="languageDropdown" class="language-switcher">
						<img id="globeIcon" src="src/assets/globe.png" alt="Language Selector" class="globe-icon" />
						<div id="flagOptions" class="flag-options">
							<img src="src/assets/flags/en.png" alt="English" class="flag" data-lang="en" />
							<img src="src/assets/flags/fr.png" alt="Français" class="flag" data-lang="fr" />
							<img src="src/assets/flags/nl.png" alt="Nederlands" class="flag" data-lang="nl" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
`;