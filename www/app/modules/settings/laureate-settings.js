define(function (require) {

	var laureateValidation = require('laureateValidation');

	function LaureateSettings(){
	};

	LaureateSettings.prototype = {
		validate : function(data,latsAndLons){
			return laureateValidation.laureateDataValidation(data,latsAndLons);
		}
	};

	return new LaureateSettings();
});