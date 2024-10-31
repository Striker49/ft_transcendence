export default `
	<div class="offcanvas offcanvas-start" tabindex="-1" id="friendlist" aria-labelledby="friendlistLabel">
		<div class="offcanvas-header p-0 d-block text-center">
			<h3 class="offcanvas-title d-inline-block px-5 py-2 fs-5 fw-bold rounded-4 rounded-top-0 box-shadow" id="friendlistLabel" style="background-color: orange;">Friends</h3>
			<button type="button" class="btn-close float-end m-2" data-bs-dismiss="offcanvas" aria-label="Close"></button>
		</div>
		<div class="offcanvas-body container">
			<div class="row user-snippet">
				<div class="col-4">
					<img src="/src/assets/avatar/avatar1.jpg" alt="User avatar" width="64px" height="64px" class="border-orange">
				</div>
				<div class="col-8">
					<h4>Ziggy al'Thor</h4>
					<p>Rank: 1st</p>
				</div>
			</div>
			<input type="text" class="w-100" placeholder="Search">
			<div class="box-shadow-inset">
				<div class="row user-snippet">
					<div class="col-4">
						<img src="/src/assets/avatar/avatar2.jpg" alt="User avatar" width="64px" height="64px" class="border-orange">
					</div>
					<div class="col-8">
						<h4>Ziggy al'Thor</h4>
						<p>Rank: 1st</p>
					</div>
				</div>
				<div class="row user-snippet">
					<div class="col-4">
						<img src="/src/assets/avatar/avatar3.jpg" alt="User avatar" width="64px" height="64px" class="border-orange">
					</div>
					<div class="col-8">
						<h4>Ziggy al'Thor</h4>
						<p>Rank: 1st</p>
					</div>
				</div>
			</div>
		</div>
	</div>
`;