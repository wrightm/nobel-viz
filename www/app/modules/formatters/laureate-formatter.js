define(function (require) {

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
		}
	};

	return new LaureateFormatter();
});