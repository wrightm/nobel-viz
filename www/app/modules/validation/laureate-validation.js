define(function (require) {

      var laureateFormatter = require('laureateFormatter');

	function isValid(laureate,property){
		if(laureate[property] == undefined || laureate[property] == null || laureate[property] == ""){
			return false;
		}
		return true;
	};

      function isCityAndCountryVaild(laureate,latsAndLons){
            var country = laureate.country;
            var city = laureate.city;
            if(country in latsAndLons){
                  var latsAndLonsCountry = latsAndLons[country];
                  if(city in latsAndLonsCountry){
                    var latsAndLonsCity = latsAndLonsCountry[city];
                    return true;
                  }
            }
            return false;
      };
      
      function laureateDataValidation(laureates,latsAndLons){
            var failures = {
                  "city":0,
                  "prize":0,
                  "dateOfBirth":0,
                  "gender":0,
                  "awardedYear":0,
                  "country":0,
                  "cityAndCountry": 0
            };
            var passed = 0;
            var numberOfLaureates = laureates.length;
		function isLaureateValid(laureate){
      		var pass = true;
                  if(!isValid(laureate,"city")){
                        failures.city += 1;
                        pass = false;
                  }
                  if(!isValid(laureate,"prize")){
                        failures.prize += 1;
                        pass = false;
                  }
                  if(!isValid(laureate,"dateOfBirth")){
                        failures.dateOfBirth += 1;
                        pass = false;
                  }
                  if(!isValid(laureate,"gender")){
                        failures.gender += 1;
                        pass = false;
                  }
                  if(!isValid(laureate,"awardedYear")){
                        failures.awardedYear += 1;
                        pass = false;
                  }
                  if(!isValid(laureate,"country")){
                        failures.country += 1;
                        pass = false;
                  }
                  if(!isCityAndCountryVaild(laureate,latsAndLons)){
                    failures.cityAndCountry += 1;
                    pass = false;
                  }
                  return pass;
      	};
		
		var validatedData = [];
            laureates.forEach(function (laureate) {
                  if(isLaureateValid(laureate)){
                        laureateFormatter.format(laureate);
                        validatedData.push(laureate);
                        passed += 1;
                  }
            });
            console.log("summary: numberOfLaureates = ",numberOfLaureates, 
            " passed = ", passed, 
            " failures = ",failures, 
            " % of passes = ", passed / numberOfLaureates);
            return validatedData;	
      };

	return {
		laureateDataValidation : function(laureates,latsAndLons){
			return laureateDataValidation(laureates,latsAndLons);
		}
	}
});