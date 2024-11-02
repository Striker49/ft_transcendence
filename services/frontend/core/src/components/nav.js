export default `
	<!-- Navbar -->
	<nav class="navbar navbar-expand-sm p-0">
		<div class="container-fluid">
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse justify-content-center fw-bolder fs-5" id="navbarNav">
				<ul class="navbar-nav">
					<li class="nav-item px-5 py-3">
						<a class="nav-link" href="/about" data-link data-i18n-key="about">About</a>
					</li>
					<li class="nav-item px-5 py-3 back-circle">
						<a class="nav-link active" aria-current="page" href="/" data-link>Transcendence</a>
					</li>
					<li class="nav-item px-5 py-3">
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