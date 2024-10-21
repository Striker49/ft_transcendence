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
						<!-- ... -->
						<select data-i18n-switcher id="changeLang" class="locale-switcher">
						<option value="en">English</option>
						<option value="fr">Français</option>
						<option value="nl">Nederlands</option>
						</select>
				</div>
			</div>
		</div>
	</nav>
`;