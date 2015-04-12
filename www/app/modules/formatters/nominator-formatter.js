define(function (require) {

	function formatPrize(nominator){
	  if(nominator.prize.split("Nobel Prize in ").length === 2){
	    nominator.prize = nominator.prize.split("Nobel Prize in ")[1];
	  } else if(nominator.prize.split(" ").length === 3){
	    nominator.prize = nominator.prize.split(" ")[1];
	  }
	};

	function formatGender(nominator){
	  nominator.gender = nominator.gender === "M" ? 'Male' : 'Female';
	};

	function NominatorFormatter(){
	};

	NominatorFormatter.prototype = {
		format : function(nominator){
			formatGender(nominator);
        	formatPrize(nominator);
		}
	};

	return new NominatorFormatter();
});