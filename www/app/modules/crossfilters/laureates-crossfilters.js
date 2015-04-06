define(function (require) {

	var crossfilter = require('crossfilter');

	function LaureatesCrossfilters(laureates,projection){
		this.laureates = crossfilter(laureates);
		this.all = this.laureates.groupAll();
		this.dimensionsAndGroups = constructDimensionsAndGroups(this.laureates);
		this.dimensions = this.dimensionsAndGroups.dimensions;
		this.groups = this.dimensionsAndGroups.groups;
		this.bubbleOverlayData = constructBubbleOverlayData(laureates,this.dimensions,this.groups,projection);
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
		var monthsDimension = laureates.dimension(function (d) {
			return d.month_born;
		});
		var monthsGroup = monthsDimension.group();

		dimensions["months"] = monthsDimension;
		groups["months"] = monthsGroup;

		// male or female
		var gender = laureates.dimension(function (d) {
			return d.gender === "male" ? 'Male' : 'Female';
		});
		var genderGroup = gender.group();

		dimensions["gender"] = gender;
		groups["gender"] = genderGroup;

		var seasonOfTheYear = laureates.dimension(function (d) {
			
			function season(month){
				if(month == 11 || month == 0 || month == 1){
					return "Winter";
				}
				else if(month == 2 || month == 3 || month == 4){
					return "Spring";
				}
				else if(month == 5 || month == 6 || month == 7){
					return "Summer";
				}
				else if(month == 8 || month == 9 || month == 10){
					return "Autumn";
				}
			}

			var month = d.born.getMonth();
			return season(month);
		});
		var seasonOfTheYearGroup = seasonOfTheYear.group();

		dimensions["seasonOfTheYear"] = seasonOfTheYear;
		groups["seasonOfTheYear"] = seasonOfTheYearGroup;

		var prize = laureates.dimension(function(d){
			return d.prize;
		});
		var prizeGroup = prize.group();

		dimensions["prize"] = prize;
		groups["prize"] = prizeGroup;

		var bornCity =  laureates.dimension(function (d) {
			return d.bornCity;
		});
		var bornCityGroup = bornCity.group();

		dimensions["bornCity"] = bornCity;
		groups["bornCity"] = bornCityGroup;

		var bornCountry = laureates.dimension(function(d){
			return d.bornCountryCode;
		});
		var bornCountryGroup = bornCountry.group();

		dimensions["bornCountry"] = bornCountry;
		groups["bornCountry"] = bornCountryGroup;

		var dimensionsAndGroups = {
			"dimensions" : dimensions,
			"groups" : groups
		};

		return dimensionsAndGroups
	};

	function constructBubbleOverlayData(data,dimensions,groups,projection){
		var bornCountryPoints = [];
      	var bornCityPoints = [];
      	data.forEach(function(laureate){
        	var bornCityCoordinates = projection([laureate.bornCityLatLon[1],laureate.bornCityLatLon[0]]);
        	if(bornCityCoordinates !== null){
          		bornCityPoints.push({name:laureate.bornCity, x:bornCityCoordinates[0], y:bornCityCoordinates[1]});
        	}
        	var bornCountryCoordinates = projection([laureate.bornCountryLatLon[1],laureate.bornCountryLatLon[0]]);
        	if(bornCountryCoordinates !== null){
          		bornCountryPoints.push({name:laureate.bornCountryCode, x:bornCountryCoordinates[0], y:bornCountryCoordinates[1]});
        	}
      	});
      	
      	var bubbleOverlayData = {};
      	bubbleOverlayData.cityDimension = dimensions.bornCity;
      	bubbleOverlayData.cityGroup = groups.bornCity;
      	bubbleOverlayData.cityPoints = bornCityPoints;
      	bubbleOverlayData.countryDimension = dimensions.bornCountry;
      	bubbleOverlayData.countryGroup = groups.bornCountry;
      	bubbleOverlayData.countryPoints = bornCountryPoints;
      	return bubbleOverlayData;
	};

	return LaureatesCrossfilters;
});