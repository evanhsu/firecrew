@extends('./layouts.app')

@section('page-title','FireCrew - A Common Operating Picture with intel direct from firefighting resources in the field.')
@section('page-description')
	FireCrew puts coordination intel from all the crews you\'re tracking into a single dashboard.
	Supervisors can status their resources once and simultaneously keep dispatch centers, FMOs, and other field resources informed.
@endsection

@section('content')
<main id="sales-page">
	<div class="container-fluid full-page-header">
		<div class="header-text-container row">
			<svg class="overlay" viewbox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" version="1.1">
				<rect x="0" y="0" width="100" height="100" fill="white" fill-opacity="0.1" />
			</svg>
			<header class="header-text">
				<h1>
					<span>A Common Operating Picture</span>
					<span><small>for the modern fire organization</small></span>
				</h1>
			</header>
		</div>
	</div>
	<div class="container-fluid">
		<section class="how-it-works-section">
			<div class="row">
				<div class="col-xs-12">
					<img style="width: 75%" src="images/previews/iPad Pro - Screenshot Form.png" title="Post a single update and everone's in the loop." />
				</div>
				<div class="col-xs-12">
					<header class="section-header"><h2>Simple to update. Accessible from anywhere.</h2></header>
					<p class="section-content">Posting updates is fast and easy, so you can always keep your status current</p>
				</div>
			</div>

			<div class="row">
				<div class="col-sm-12 col-sm-push-6">
					<img src="images/previews/iPad Pro - Screenshot Map.png" title="View resources on the map" />
				</div>
				<div class="col-sm-12 col-sm-pull-6">
					<header class="section-header"><h2>Geographic Visualization</h2></header>
					<p class="section-content">View active resources on the map. Check proximity. Coordinate.</p>
				</div>
			</div>

			<div class="row">
				<div class="col-sm-12 col-md-6">
					<img src="images/previews/kiosk-view.png" title="Kiosk mode presents all the data on a single screen." />
				</div>	
				<div class="col-sm-12 col-md-6">
					<header class="section-header"><h2>Kiosk Mode. Always Fresh</h2></header>
					<p class="section-content">With live updates, you never need to refresh your browser. The latest data is pushed to you and the color-coded kiosk view lets you know who's been updated recently.</p>
				</div>
			</div>
		</section>

		<section class="sign-up-section row">
			<div class="col-sm-12">
				<header class="section-header"><h2>Add your organization to get started</h2></header>
				<p class="section-content">
					<a href="#" class="btn btn-primary btn-lg" role="button">Get Started</a>
				</p>
			</div>
		</section>
	</div>
</main>
@endsection
