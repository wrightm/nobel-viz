define(function (require) {

  var nomineesFormatter = require('nomineesFormatter');

	function isValid(nominee,property){
		if(nominee[property] == undefined || nominee[property] == null || nominee[property] == ""){
			return false;
		}
		return true;
	};

  function isCityAndCountryVaild(nominee,latsAndLons){
    var country = nominee.country;
    var city = nominee.city;
    if(country in latsAndLons){
      var latsAndLonsCountry = latsAndLons[country];
      if(city in latsAndLonsCountry){
        var latsAndLonsCity = latsAndLonsCountry[city];
        return true;
      }
    }
    return false;
  };

	function nomineesDataValidation(nominees,latsAndLons){
    var failures = {
      "city":0,
      "prize":0,
      "dateOfBirth":0,
      "gender":0,
      "nomineeYear":0,
      "country":0,
      "cityAndCountry": 0
    };
    var passed = 0;
    var passedBeforeCountryCityMatch = 0;
    var numberOfNominees = nominees.length;
		function isNomineeValid(nominee){
      var pass = true;
  		if(!isValid(nominee,"city")){
        failures.city += 1;
  			pass = false;
  		}
  		if(!isValid(nominee,"prize")){
        failures.prize += 1;
  			pass = false;
  		}
  		if(!isValid(nominee,"dateOfBirth")){
        failures.dateOfBirth += 1;
  			pass = false;
  		}
  		if(!isValid(nominee,"gender")){
        failures.gender += 1;
  			pass = false;
  		}
  		if(!isValid(nominee,"nominatorYear")){
        failures.nomineeYear += 1;
  			pass = false;
  		}
  		if(!isValid(nominee,"country")){
        failures.country += 1;
  			pass = false;
  		}
      if(!isCityAndCountryVaild(nominee,latsAndLons)){
        failures.cityAndCountry += 1;
        pass = false;
      }
  		return pass;
  	};
		
		var validatedData = [];
		nominees.forEach(function (nominee) {
			if(isNomineeValid(nominee)){
        nomineesFormatter.format(nominee);
        validatedData.push(nominee);
        passed += 1;
	    }
    });
    /*
    console.log("summary: numberOfNominators = ",numberOfNominees, 
      " passed = ", passed, 
      " failures = ",failures, 
      " % of passes = ", passed / numberOfNominees, 
      " passed before = ",passedBeforeCountryCityMatch);
    */
		return validatedData;	
	};

	return {
		nomineesDataValidation : function(data,latsAndLons){
			return nomineesDataValidation(data,latsAndLons);
		}
	}
});