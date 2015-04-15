define(function (require) {

	var d3 = require('d3');
	var dateFormat = d3.time.format('%Y-%m-%d');
      var numberFormat = d3.format('.2f');

	function isValid(laureate,property){
		if(laureate[property] == undefined || laureate[property] == null || laureate[property] == ""){
			return false;
		}
		return true;
	};

	function laureateDataValidation(laureates){

		function isLaureateValid(laureate){
      		if(!isValid(laureate,"bornCity")){
      			return false;
      		}
      		if(!isValid(laureate,"prize")){
      			return false;
      		}
      		if(!isValid(laureate,"month_born")){
      			return false;
      		}
      		if(!isValid(laureate,"gender")){
      			return false;
      		}
      		if(!isValid(laureate,"born")){
      			return false;
      		}
      		if(!isValid(laureate,"lat")){
      			return false;
      		}
      		if(!isValid(laureate,"lon")){
      			return false;
      		}
      		if(!isValid(laureate,"month_born")){
      			return false;
      		}
      		if(!isValid(laureate,"day_born")){
      			return false;
      		}
      		return true;
      	};
		
		var validatedData = [];
		laureates.forEach(function (laureate) {
                  laureate.gender === "male" ? 'Male' : 'Female';
                  laureate.born = dateFormat.parse(laureate.born);
                  laureate.lat = laureate.bornCityLatLon[0];
                  laureate.lon = laureate.bornCityLatLon[1]; 
                  laureate.month_born = d3.time.month(laureate.born);
                  laureate.day_born = d3.time.day(laureate.born);
            	if(isLaureateValid(laureate)){				
                    validatedData.push(laureate);
            	}
      	});
		return validatedData;	
	};

	return {
		laureateDataValidation : function(data){
			return laureateDataValidation(data);
		}
	}
});