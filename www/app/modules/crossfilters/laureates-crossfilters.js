define(function (require) {

	var crossfilter = require('crossfilter');
	var laureateFormatter = require('laureateFormatter');

	function LaureatesCrossfilters(laureates,latsAndLons,projection){
		this.laureates = crossfilter(laureates);
		this.all = this.laureates.groupAll();
		this.dimensionsAndGroups = constructDimensionsAndGroups(this.laureates);
		this.dimensions = this.dimensionsAndGroups.dimensions;
		this.groups = this.dimensionsAndGroups.groups;
		this.bubbleOverlayData = constructBubbleOverlayData(laureates,latsAndLons,this.dimensions,this.groups,projection);
	};

	LaureatesCrossfilters.prototype = {
		getDimensions : function(){
			return this.dimensions;
		},
		getGroups : function(){
			return this.groups;
		},
		getAll : function(){
			return this.all;
		},
		getLaureates : function(){
			return this.laureates;
		},
		getBubbleOverlayData : function(){
			return this.bubbleOverlayData;
		}
	};

	function constructDimensionsAndGroups(laureates){

		var dimensions = {};
		var groups = {};

		// dimension by month
		var yearOfBirthDimension = laureates.dimension(function (d) {
			return new Date(Number(d.dateOfBirth),0,1);
		});
		var yearOfBirthGroup = yearOfBirthDimension.group();

		dimensions["yearOfBirth"] = yearOfBirthDimension;
		groups["yearOfBirth"] = yearOfBirthGroup;

		var awardedYearDimension = laureates.dimension(function (d) {
			return new Date(Number(d.awardedYear),0,1);
		});
		var awardedYearGroup = awardedYearDimension.group();

		dimensions["awardedYear"] = awardedYearDimension;
		groups["awardedYear"] = awardedYearGroup;

		// male or female
		var gender = laureates.dimension(function (d) {
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

		var prize = laureates.dimension(function(d){
			var formattedPrize = laureateFormatter.formatPrizeString(d.prize);
			return formattedPrize;
		});
		var prizeGroup = prize.group();

		dimensions["prize"] = prize;
		groups["prize"] = prizeGroup;

		var city =  laureates.dimension(function (d) {
			var formattedCity = laureateFormatter.formatCityString(d.city);
			return formattedCity;
		});
		var cityGroup = city.group();

		dimensions["city"] = city;
		groups["city"] = cityGroup;

		var country = laureates.dimension(function(d){
			var formattedCountry = laureateFormatter.formatCountryString(d.country);
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

	function constructBubbleOverlayData(laureates,latsAndLons,dimensions,groups,projection){
		var bornCountryPoints = [];
      	var bornCityPoints = [];
      	laureates.forEach(function(laureate){
      		var country = laureate.country;
      		var city = laureate.city;
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

	return LaureatesCrossfilters;
});