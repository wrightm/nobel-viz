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

	function formatPrize(laureate){
	  if(laureate.prize.split("Nobel Prize in ").length === 2){
	    laureate.prize = laureate.prize.split("Nobel Prize in ")[1];
	  } else if(laureate.prize.split(" ").length === 3){
	    laureate.prize = laureate.prize.split(" ")[1];
	  }
	};

	function formatCountry(laureate){
		laureate.country = laureate.country.split("(")[0];
		laureate.country = laureate.country.split("[")[0];
	};

	function formatCity(laureate){
		laureate.city = laureate.city.split("(")[0];
		laureate.city = laureate.city.split("[")[0];
	};

	function LaureateFormatter(){
	};

	LaureateFormatter.prototype = {
		format : function(laureate){
        	formatPrize(laureate);
        	formatCountry(laureate);
        	formatCity(laureate);
		},
		formatPrizeString : formatPrizeString,
		formatCountryString : formatCountryString,
        formatCityString : formatCountryString
	};

	return new LaureateFormatter();
});