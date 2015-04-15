define(function (require) {

	function formatPrize(nominee){
	  if(nominee.prize.split("Nobel Prize in ").length === 2){
	    nominee.prize = nominee.prize.split("Nobel Prize in ")[1];
	  } else if(nominee.prize.split(" ").length === 3){
	    nominee.prize = nominee.prize.split(" ")[1];
	  }
	};

	function formatCountry(nominee){
		nominee.country = nominee.country.split("(")[0];
		nominee.country = nominee.country.split("[")[0];
	};

	function formatCity(nominee){
		nominee.city = nominee.city.split("(")[0];
		nominee.city = nominee.city.split("[")[0];
	};


	function NomineesFormatter(){
	};

	NomineesFormatter.prototype = {
		format : function(nominee){
        	formatPrize(nominee);
        	formatCountry(nominee);
        	formatCity(nominee);
		}
	};

	return new NomineesFormatter();
});