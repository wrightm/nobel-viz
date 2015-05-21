define(function (require) {

	var crossfilter = require('crossfilter');
	var nominatorFormatter = require('nominatorFormatter');

	function NominatorCrossfilters(nominators,latsAndLons,projection){
		this.nominators = crossfilter(nominators);
		this.all = this.nominators.groupAll();
		this.dimensionsAndGroups = constructDimensionsAndGroups(this.nominators);
		this.dimensions = this.dimensionsAndGroups.dimensions;
		this.groups = this.dimensionsAndGroups.groups;
		this.bubbleOverlayData = constructBubbleOverlayData(nominators,latsAndLons,this.dimensions,this.groups,projection);
	};

	NominatorCrossfilters.prototype = {
		getDimensions : function(){
			return this.dimensions;
		},
		getGroups : function(){
			return this.groups;
		},
		getAll : function(){
			return this.all;
		},
		getNominators : function(){
			return this.nominators;
		},
		getBubbleOverlayData : function(){
			return this.bubbleOverlayData;
		}
	};

	function constructDimensionsAndGroups(nominators){

		var dimensions = {};
		var groups = {};

		// dimension by month
		var yearOfBirthDimension = nominators.dimension(function (d) {
			return new Date(Number(d.dateOfBirth),0,1);
		});
		var yearOfBirthGroup = yearOfBirthDimension.group();

		dimensions["yearOfBirth"] = yearOfBirthDimension;
		groups["yearOfBirth"] = yearOfBirthGroup;

		var nominatorYearDimension = nominators.dimension(function (d) {
			return new Date(Number(d.nominatorYear),0,1);
		});
		var nominatorYearGroup = nominatorYearDimension.group();

		dimensions["nominatorYear"] = nominatorYearDimension;
		groups["nominatorYear"] = nominatorYearGroup;

		// male or female
		var gender = nominators.dimension(function (d) {
			if(d.gender === "M"){
				return "Male";
			}
			else if(d.gender === "F"){
				return "Female";
			}
			else {
				return "Unknown";
			}
		});
		var genderGroup = gender.group();

		dimensions["gender"] = gender;
		groups["gender"] = genderGroup;

		var prize = nominators.dimension(function(d){
			var formattedPrize = nominatorFormatter.formatPrizeString(d.prize);
			return formattedPrize;
		});
		var prizeGroup = prize.group();

		dimensions["prize"] = prize;
		groups["prize"] = prizeGroup;

		var city =  nominators.dimension(function (d) {
			var formattedCity = nominatorFormatter.formatCityString(d.city);
			return formattedCity;
		});
		var cityGroup = city.group();

		dimensions["city"] = city;
		groups["city"] = cityGroup;

		var country = nominators.dimension(function(d){
			var formattedCountry = nominatorFormatter.formatCountryString(d.country);
			return formattedCountry;
		});
		var countryGroup = country.group();

		dimensions["country"] = country;
		groups["country"] = countryGroup;

		var dimensionsAndGroups = {
			"dimensions" : dimensions,
			"groups" : groups
		};

		return dimensionsAndGroups
	};

	function constructBubbleOverlayData(nominators,latsAndLons,dimensions,groups,projection){
		var bornCountryPoints = [];
      	var bornCityPoints = [];

      	nominators.forEach(function(nominator){
      		var country = nominator.country;
      		var city = nominator.city;
      		if(country in latsAndLons){
      			var latsAndLonsCountry = latsAndLons[country];
      			var countryLat = latsAndLonsCountry["country lat"];
      			var countryLon = latsAndLonsCountry["country lon"];
      			if(city in latsAndLonsCountry){
      				var latsAndLonsCity = latsAndLonsCountry[city];
      				var cityLat = latsAndLonsCity["lat"];
      				var cityLon = latsAndLonsCity["lon"];
      				var bornCityCoordinates = projection([cityLon,cityLat]);
			    	if(bornCityCoordinates !== null && city !== null){
			      		bornCityPoints.push({name:city, x:bornCityCoordinates[0], y:bornCityCoordinates[1]});
			    	}
		        	var bornCountryCoordinates = projection([countryLon,countryLat]);
		        	if(bornCountryCoordinates !== null && country !== null){
		          		bornCountryPoints.push({name:country, x:bornCountryCoordinates[0], y:bornCountryCoordinates[1]});
		        	}
      			}
      		}

      	});
      	
      	var bubbleOverlayData = {};
      	bubbleOverlayData.cityDimension = dimensions.city;
      	bubbleOverlayData.cityGroup = groups.city;
      	bubbleOverlayData.cityPoints = bornCityPoints;
      	bubbleOverlayData.countryDimension = dimensions.country;
      	bubbleOverlayData.countryGroup = groups.country;
      	bubbleOverlayData.countryPoints = bornCountryPoints;
      	return bubbleOverlayData;
	};

	return NominatorCrossfilters;
});