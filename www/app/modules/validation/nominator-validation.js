define(function (require) {

  var nominatorFormatter = require('nominatorFormatter');

	function isValid(nominator,property){
		if(nominator[property] == undefined || nominator[property] == null || nominator[property] == ""){
			return false;
		}
		return true;
	};

  function isCityAndCountryVaild(nominator,latsAndLons){
    var country = nominator.country;
    var city = nominator.city;
    if(country in latsAndLons){
      var latsAndLonsCountry = latsAndLons[country];
      if(city in latsAndLonsCountry){
        var latsAndLonsCity = latsAndLonsCountry[city];
        return true;
      }
    }
    return false;
  };

	function nominatorDataValidation(nominators,latsAndLons){
    var failures = {
      "city":0,
      "prize":0,
      "dateOfBirth":0,
      "gender":0,
      "nominatorYear":0,
      "country":0,
      "cityAndCountry": 0
    };
    var passed = 0;
    var numberOfNominators = nominators.length;
		function isNominatorValid(nominator){

      var pass = true;
  		if(!isValid(nominator,"city")){
        failures.city += 1;
  			pass = false;
  		}
  		if(!isValid(nominator,"prize")){
        failures.prize += 1;
  			pass = false;
  		}
  		if(!isValid(nominator,"dateOfBirth")){
        failures.dateOfBirth += 1;
  			pass = false;
  		}
  		if(!isValid(nominator,"gender")){
        failures.gender += 1;
  			pass = false;
  		}
  		if(!isValid(nominator,"nominatorYear")){
        failures.nominatorYear += 1;
  			pass = false;
  		}
  		if(!isValid(nominator,"country")){
        failures.country += 1;
  			pass = false;
  		}
      if(!isCityAndCountryVaild(nominator,latsAndLons)){
        failures.cityAndCountry += 1;
        pass = false;
      }
  		return pass;
  	};
		
		var validatedData = [];
		nominators.forEach(function (nominator) {
			if(isNominatorValid(nominator)){
        nominatorFormatter.format(nominator);
        validatedData.push(nominator);
        passed += 1;
	    }
    });
    console.log("summary: numberOfNominators = ",numberOfNominators, 
      " passed = ", passed, 
      " failures = ",failures, 
      " % of passes = ", passed / numberOfNominators);
		return validatedData;	
	};

	return {
		nominatorDataValidation : function(data,latsAndLons){
			return nominatorDataValidation(data,latsAndLons);
		}
	}
});