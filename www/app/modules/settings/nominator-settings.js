define(function (require) {

	var nominatorValidation = require('nominatorValidation');

	function NominatorSettings(){
	};

	NominatorSettings.prototype = {
		validate : function(data,latsAndLons){
			return nominatorValidation.nominatorDataValidation(data,latsAndLons);
		}
	};

	return new NominatorSettings();
});