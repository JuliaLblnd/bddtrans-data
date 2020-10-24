<?php 
$json_rows = file_get_contents('./bddtrans.json');
$rows = json_decode($json_rows);

$specialities = array();
foreach ($rows as $row) {
	$spe = explode(', ', $row->tags);
	foreach ($spe as $val) {
		if (! in_array($val, $specialities)) {
			array_push($specialities, $val);
		}
	}
}
sort($specialities);
$json_specialities = json_encode($specialities);
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>BDDTrans</title>
	<link rel="stylesheet" href="./css/bootstrap.min.css">
	<link rel="stylesheet" href="./css/footable.bootstrap.min.css">
	<link rel="stylesheet" href="./css/app.css">
</head>
<body>
	<div class="container">
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="#">BDDTrans Data</a>
				</div>
				<div class="collapse navbar-collapse" id="navbar">
					<ul class="nav navbar-nav">
						<li><a href="https://docs.google.com/spreadsheets/d/1YQ8dqvAOq183qseB3lpDCP3oh4ogeIiD1P9SMVwdtTI">Ouvrir dans Google Docs</a></li>
						<li><a href="https://bddtransmap.lilou7.fr">BDDTrans Map</a></li>
					</ul>
					<ul class="nav navbar-nav navbar-right">
						<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Downloads <span class="caret"></span></a>
							<ul class="dropdown-menu">
								<li><a href="bddtrans.csv">Download CSV</a></li>
								<li role="separator" class="divider"></li>
								<li><a href="bddtrans.json">Download JSON</a></li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>

		<div id="filter-form-container"></div>
	</div>

	<div class="container-fluid table-responsive">
		<table id="table" class="table table-striped table-hover footable footable-1 footable-filtering footable-filtering-left footable-paging footable-paging-center breakpoint-lg"></table>
	</div>
	<div id="paging-ui-container"></div>
	<div class="container">
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<div class="navbar-header">
					<a class="navbar-brand" href="#">BDDTrans Data</a>
				</div>
				<div class="collapse navbar-collapse" id="navbar">
					<p class="navbar-text">Créer avec ♥ par Julia</p>
					<ul class="nav navbar-nav">
						<li><a href="https://github.com/JuliaLblnd/bddtrans-data">GitHub</a></li>
					</ul>
					<p class="navbar-text navbar-right">Dernière mise à jour : 16/10/2020 23:42</p>
				</div>
			</div>
		</nav>
	</div>

	<script src="./js/papaparse.min.js"></script>
	<script src="./js/jquery-3.4.1.min.js"></script>
	<script src="./js/bootstrap.min.js"></script>
	<script src="./js/footable.min.js"></script>
	<!-- <script src="app.js"></script> -->
	<script type="text/javascript">
FooTable.TagFiltering = FooTable.Filtering.extend({
	construct: function(instance){
		this._super(instance);
		// this.tags = ['"Autre"','"Avocat-e"','"Centre Dermatologique"','"Chirurgien-ne"','"Dermatologue"','"Endocrinologue"','"Gynécologue"','"Généraliste"','"Orthophoniste"','"Phoniatre"','"Psychanalyste"','"Psychiatre"','"Psychologue"','"Psychothérapeute"','"Sexologue"'];
		// this.tags = ['Autre','Avocat-e','Centre Dermatologique','Chirurgien-ne','Dermatologue','Endocrinologue','Gynécologue','Généraliste','Orthophoniste','Phoniatre','Psychanalyste','Psychiatre','Psychologue','Psychothérapeute','Sexologue'];
		this.specialities = <?= $json_specialities ?>;
		this.default = 'Toutes les specialités';
		this.$speciality = null;
	},
	$create: function(){
		this._super();
		var self = this,
			$form_grp = $('<div/>', {'class': 'form-group'})
				.append($('<label/>', {'class': 'sr-only', text: 'Status'}))
				.prependTo(self.$form);

		self.$speciality = $('<select/>', { 'class': 'form-control' })
			.on('change', {self: self}, self._onStatusDropdownChanged)
			.append($('<option/>', {text: self.default}))
			.appendTo($form_grp);

		$.each(self.specialities, function(i, speciality){
			self.$speciality.append($(new Option(speciality, '"'+speciality+'"')));
			//self.$speciality.append($('<option value="\"${speciality}\"">${speciality}<option/>'));
			//self.$speciality.append($('<option value="\"${speciality}\"">${speciality}<option/>').text(speciality));
			//self.$speciality.append($('<option/>').text(speciality));
		});
	},
	_onStatusDropdownChanged: function(e){
		var self = e.data.self,
			selected = $(this).val();
		if (selected !== self.def){
			self.addFilter('Tag', selected, ['tags']);
			//self.addFilter('Tag', '"' + selected + '"', ['Tag']);
		} else {
			self.removeFilter('Tag');
		}
		self.filter();
	},
	draw: function(){
		this._super();
		var tag = this.find('Tag');
		if (tag instanceof FooTable.Filter){
			this.$tag.val(tag.query.val());
		} else {
			this.$tag.val(this.def);
		}
	}
});

jQuery(function($) {
	$('#table').footable( {
		"columns": [
			{"name": "categorie",   "title": "Categorie",   "filterable": false, "sortable": false, "visible": false},
			{"name": "specialite",  "title": "Specialité",  "filterable": false, "sortable": false, "breakpoints": ""},
			{"name": "nom",         "title": "Nom",         "filterable": true,  "sortable": true,  "breakpoints": ""},
			{"name": "prenom",      "title": "Prénom",      "filterable": true,  "sortable": true,  "breakpoints": "xs sm"},
			{"name": "adresse",     "title": "Adresse",     "filterable": true,  "sortable": true,  "breakpoints": "xs sm"},
			{"name": "code postal", "title": "Code postal", "filterable": true,  "sortable": true,  "breakpoints": ""},
			{"name": "ville",       "title": "Ville",       "filterable": true,  "sortable": true,  "breakpoints": ""},
			{"name": "pays",        "title": "Pays",        "filterable": true,  "sortable": true,  "breakpoints": "xs sm"},
			{"name": "description", "title": "Description", "filterable": true,  "sortable": true,  "breakpoints": "xs sm md"},
			{"name": "lien",        "title": "Lien",        "filterable": false, "sortable": false, "breakpoints": "xs sm", 
			    "formatter": function(value, options, rowData) {
			        return "<a href=\"" + value + "\" target=\"_blank\">Voir sur BDDTrans</a>";
			    },
			}
		],
		"rows": <?= $json_rows ?>,
		"paging" : {
			"enabled": true,
			"limit": 4,
			"size": 50,
			"container": "#paging-ui-container"
		},
		"filtering" : {
			"enabled": true,
			"container": "#filter-form-container"
		},
		"sorting" : {"enabled": true,},
		"components": {
			filtering: FooTable.TagFiltering
		}
	});
});
	</script>
</body>
</html>
