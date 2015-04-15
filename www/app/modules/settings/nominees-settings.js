define(function (require) {

	var nomineesValidation = require('nomineesValidation');

	function NomineesSettings(){
	};

	NomineesSettings.prototype = {
		validate : function(data,latsAndLons){
			return nomineesValidation.nomineesDataValidation(data,latsAndLons);
		}
	};

	return new NomineesSettings();
});