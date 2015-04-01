define(function (require) {

	var laureateValidation = require('laureateValidation');

	function LaureateSettings(){
	};

	LaureateSettings.prototype = {
		validate : function(data){
			return laureateValidation.laureateDataValidation(data);
		}
	};

	return new LaureateSettings();
});