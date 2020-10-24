// Papa.parse("./bddtrans.csv", {
// 	download: true,
// 	delimiter: ";",
// 	header: true,
// 	skipEmptyLines: true,
// 	complete: function(results, file) {
// 		console.log(results, file);
// 		var data = results.data;
// 		var columns = new Array();

// 		for (var field in data[0]) {
// 			column = { "name": field, "title": field }
// 			switch (field) {
// 				case "Tag":
// 					column["filterable"] = false;
// 					column["sortable"] = false;
// 					break;
// 				case "Prénom":
// 				case "Adresse":
// 				case "Pays":
// 					column["breakpoints"] = "xs sm";
// 					break;
// 				case "Description":
// 					column["breakpoints"] = "xs sm md";
// 					break;
// 				case "Lien":
// 					column["breakpoints"] = "xs md";
// 					column["filterable"] = false;
// 					column["sortable"] = false;
// 					column["formatter"] = function(value, options, rowData) {
// 						return "<a href=\"" + value + "\" target=\"_blank\">Voir sur BDDTrans</a>";
// 					};
// 					break;
// 			}
// 			columns.push(column);
// 		}
// 		console.log(columns);
// 		console.log(data);

// 		jQuery(function($){
// 			$('#table').footable({
// 				"columns": columns,
// 				"rows": data,
// 				"paging" : {
// 					"enabled": true,
// 					"limit": 4,
// 					"size": 50,
// 					"container": "#paging-ui-container"
// 				},
// 				"filtering" : {
// 					"enabled": true,
// 					"container": "#filter-form-container"
// 				},
// 				"sorting" : {"enabled": true,},
// 				"components": {
// 					filtering: FooTable.TagFiltering
// 				}
// 			});
// 		});
// 	}
// });

FooTable.TagFiltering = FooTable.Filtering.extend({
	construct: function(instance){
		this._super(instance);
		// this.tags = ['"Autre"','"Avocat-e"','"Centre Dermatologique"','"Chirurgien-ne"','"Dermatologue"','"Endocrinologue"','"Gynécologue"','"Généraliste"','"Orthophoniste"','"Phoniatre"','"Psychanalyste"','"Psychiatre"','"Psychologue"','"Psychothérapeute"','"Sexologue"'];
		this.tags = ['Autre','Avocat-e','Centre Dermatologique','Chirurgien-ne','Dermatologue','Endocrinologue','Gynécologue','Généraliste','Orthophoniste','Phoniatre','Psychanalyste','Psychiatre','Psychologue','Psychothérapeute','Sexologue'];
		this.def = 'Any Tag';
		this.$tag = null;
	},
	$create: function(){
		this._super();
		var self = this,
			$form_grp = $('<div/>', {'class': 'form-group'})
				.append($('<label/>', {'class': 'sr-only', text: 'Status'}))
				.prependTo(self.$form);

		self.$tag = $('<select/>', { 'class': 'form-control' })
			.on('change', {self: self}, self._onStatusDropdownChanged)
			.append($('<option/>', {text: self.def}))
			.appendTo($form_grp);

		$.each(self.tags, function(i, tag){
			self.$tag.append($(new Option(tag, '"'+tag+'"')));
			//self.$tag.append($('<option value="\"${tag}\"">${tag}<option/>'));
			//self.$tag.append($('<option value="\"${tag}\"">${tag}<option/>').text(tag));
			//self.$tag.append($('<option/>').text(tag));
		});
	},
	_onStatusDropdownChanged: function(e){
		var self = e.data.self,
			selected = $(this).val();
		if (selected !== self.def){
			self.addFilter('Tag', selected, ['Tag']);
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
