define(function (require) {

	var crossfilter = require('crossfilter');

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
			return d.dateOfBirth;
		});
		var yearOfBirthGroup = yearOfBirthDimension.group();

		dimensions["yearOfBirth"] = yearOfBirthDimension;
		groups["yearOfBirth"] = yearOfBirthGroup;

		// male or female
		var gender = nominators.dimension(function (d) {
			return d.gender === "M" ? 'Male' : 'Female';
		});
		var genderGroup = gender.group();

		dimensions["gender"] = gender;
		groups["gender"] = genderGroup;

		var prize = nominators.dimension(function(d){
			return d.prize;
		});
		var prizeGroup = prize.group();

		dimensions["prize"] = prize;
		groups["prize"] = prizeGroup;

		var city =  nominators.dimension(function (d) {
			return d.city;
		});
		var cityGroup = city.group();

		dimensions["city"] = city;
		groups["city"] = cityGroup;

		var country = nominators.dimension(function(d){
			return d.country;
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
			    	if(bornCityCoordinates !== null){
			      		bornCityPoints.push({name:city, x:bornCityCoordinates[0], y:bornCityCoordinates[1]});
			    	}
		        	var bornCountryCoordinates = projection([countryLon,countryLat]);
		        	if(bornCountryCoordinates !== null){
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