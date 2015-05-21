define(function (require) {

	function formatPrizeString(prize){
	  if(prize.split("Nobel Prize in ").length === 2){
	    prize = prize.split("Nobel Prize in ")[1];
	  } else if(prize.split(" ").length === 3){
	    prize = prize.split(" ")[1];
	  }
	  return prize
	};

	function formatCountryString(country){
		country = country.split("(")[0];
		country = country.split("[")[0];
		return country;
	};

	function formatCityString(city){
		city = city.split("(")[0];
		city = city.split("[")[0];
		return city;
	};
	
	function formatPrize(nominator){
	  if(nominator.prize.split("Nobel Prize in ").length === 2){
	    nominator.prize = nominator.prize.split("Nobel Prize in ")[1];
	  } else if(nominator.prize.split(" ").length === 3){
	    nominator.prize = nominator.prize.split(" ")[1];
	  }
	};

	function formatCountry(nominator){
		nominator.country = nominator.country.split("(")[0];
		nominator.country = nominator.country.split("[")[0];
	};

	function formatCity(nominator){
		nominator.city = nominator.city.split("(")[0];
		nominator.city = nominator.city.split("[")[0];
	};

	function NominatorFormatter(){
	};

	NominatorFormatter.prototype = {
		format : function(nominator){
        	formatPrize(nominator);
        	formatCountry(nominator);
        	formatCity(nominator);
		},
		formatPrizeString : formatPrizeString,
		formatCountryString : formatCountryString,
        formatCityString : formatCountryString
	};

	return new NominatorFormatter();
});