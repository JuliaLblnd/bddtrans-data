jQuery(function($) {
	var alert_box = $('#alert_box');
	$.getJSON("bddtrans.json")
		.done(function(data, textStatus, jqXHR) {
			var updateDate = new Date(jqXHR.getResponseHeader("last-modified"));
			$('#update_date').text(updateDate.toLocaleString());

			var unique = [];
			var specialities = [];
			for (var i = 0; i < data.length; i++) {
				var link = data[i].lien;
				var comments = parseInt(data[i].commentaires, 10);
				data[i].actions = '<a class="btn btn-default btn-sm" href="'+link+'" target="_blank"><span class="glyphicon glyphicon-new-window" aria-hidden="true"></span> Ouvrir sur BDDTrans</a>';
				if (comments > 0) {
					var categorie = data[i].categorie;
					var slug = data[i].slug;
					data[i].actions += '<button type="button" class="btn btn-default btn-sm" data-toggle="modal" data-target="#commentsModal" data-categorie="'+categorie+'" data-slug="'+slug+'">Voir les commentaires ('+comments+')</button>';
				}
				else {
					data[i].actions += '<button type="button" class="btn btn-default btn-sm" disabled="disabled">Aucun commentaires</button>';
				}

				delete data[i].lien;
				delete data[i].categorie;
				delete data[i].slug;
				delete data[i].commentaires;

				var spe = data[i].specialite;
				spe = spe.split(', ');
				for (var j = 0; j < spe.length; j++) {
					if (!unique[spe[j]]){
						specialities.push(spe[j]);
						unique[spe[j]] = 1;
					}
				}
			}
			specialities.sort();

			FooTable.SpecialityFiltering = FooTable.Filtering.extend({
				construct: function(instance){
					this._super(instance);
					this.specialities = specialities;
					this.default = 'Toutes les specialités';
					this.$speciality = null;
				},
				$create: function(){
					this._super();
					var self = this,
						$form_grp = $('<div/>', {'class': 'form-group'})
							.append($('<label/>', {'class': 'sr-only', text: 'Specialité'}))
							.prependTo(self.$form);

					self.$speciality = $('<select/>', { 'class': 'form-control' })
						.on('change', {self: self}, self._onStatusDropdownChanged)
						.append($('<option/>', {text: self.default}))
						.appendTo($form_grp);

					$.each(self.specialities, function(i, speciality){
						self.$speciality.append(new Option(speciality, speciality));
					});
				},
				_onStatusDropdownChanged: function(e){
					var self = e.data.self,
						selected = $(this).val();
					if (selected !== self.default){
						self.addFilter('specialite', selected, ['specialite'], false, false);
						// self.addFilter('specialite', '"' + selected + '"', ['specialite']);
					} else {
						self.removeFilter('specialite');
					}
					self.filter();
				},
				draw: function(){
					this._super();
					var speciality = this.find('specialite');
					if (speciality instanceof FooTable.Filter){
						this.$speciality.val(speciality.query.val());
					} else {
						this.$speciality.val(this.default);
					}
				}
			});

			$('#table').footable({
				"columns": [
					{"name": "specialite",  "title": "Specialité",  "filterable": false, "sortable": false, "breakpoints": ""},
					{"name": "nom",         "title": "Nom",         "filterable": true,  "sortable": true,  "breakpoints": ""},
					{"name": "prenom",      "title": "Prénom",      "filterable": true,  "sortable": true,  "breakpoints": "xs sm"},
					{"name": "adresse",     "title": "Adresse",     "filterable": true,  "sortable": true,  "breakpoints": "xs sm"},
					{"name": "code postal", "title": "Code postal", "filterable": true,  "sortable": true,  "breakpoints": ""},
					{"name": "ville",       "title": "Ville",       "filterable": true,  "sortable": true,  "breakpoints": ""},
					{"name": "pays",        "title": "Pays",        "filterable": true,  "sortable": true,  "breakpoints": "xs sm"},
					{"name": "description", "title": "Description", "filterable": true,  "sortable": true,  "breakpoints": "xs sm md lg"},
					{"name": "actions",     "title": "Actions",     "filterable": false, "sortable": false, "breakpoints": "xs sm", "style": {"white-space": "nowrap"}}
				],
				"rows": data,
				"paging" : {
					"enabled": true,
					"container": "#paging-ui-container",
					"limit": 5,
					"size": 50
				},
				"filtering" : {
					"enabled": true,
					"container": "#filter-form-container",
					"connectors": false,
					"min": 3
				},
				"sorting" : {"enabled": true,},
				"components": {
					filtering: FooTable.SpecialityFiltering
				}
			});

			alert_box.hide();
		})
		.fail(function( jqXHR, textStatus, errorThrown  ) {
			alert_box.removeClass("alert-info");
			alert_box.addClass("alert-danger");
			alert_box.text("Erreur de chargement des données.");
			console.log( "Request Failed: " + textStatus + ", " + errorThrown );
			console.log( jqXHR );
	});
});
