
define(function (require) {

    var jquery = require('jquery');
    var dc = require('dc');
    var d3 = require('d3');
    var crossfilter = require('crossfilter');
    var topojson = require('topojson');
    var bubbleOverlay  = require('bubbleOverlay');
    var globalSettings = require('globalSettings');

    var url = require('url');
    var currentFilters = {};

    var width = globalSettings.width(),
	height = globalSettings.height();
    
    var projection = globalSettings.projection();
    
    var path = globalSettings.geoPathProjection();
    
    var svg = globalSettings.svg();
    
    var g = globalSettings.g();
    
    var clicked = globalSettings.clicked();
    
    var bubbleOverlayData = globalSettings.bubbleOverlayData();
    
    var maleOrFemaleChart = dc.pieChart('#male-female-chart');
    var dayOfWeekChart = dc.rowChart('#day-of-week-chart');
    var monthChart = dc.barChart('#month-chart');
    var prizeChart = dc.rowChart('#prize-chart');
    var worldChart = globalSettings.worldChart();
    
    d3.json("/data/world-50m.json", function(error, world) {
	
	g.selectAll("path")
            .data(topojson.feature(world, world.objects.countries).features)
            .enter().append("path")
            .attr("d", path)
            .attr("class", "feature")
            .on("click", clicked);
	g.append("path")
            .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
            .attr("class", "border border--state")
            .attr("d", path);
	
	d3.json("/data/laureates-world.json", function(error, data) {
	    
	    var dateFormat = d3.time.format('%Y-%m-%d');
	    var numberFormat = d3.format('.2f');
	    
	    data.forEach(function (d) {
		d.born = dateFormat.parse(d.born);
		d.lat = d.bornCityLatLon[0];
		d.lon = d.bornCityLatLon[1]; 
		d.month_born = d3.time.month(d.born);
		d.day_born = d3.time.day(d.born); 
	    });
	    
	    //### Create Crossfilter Dimensions and Groups
	    //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
	    var nominees = crossfilter(data);
	    var all = nominees.groupAll();
	    
	    // dimension by month
	    var monthsDimension = nominees.dimension(function (d) {
		
		return d.month_born;
	    });
	    var monthsGroup = monthsDimension.group();
	    
	    // male or female
	    var maleOrFemale = nominees.dimension(function (d) {
		return d.gender === "male" ? 'Male' : 'Female';
	    });
	    var maleOrFemaleGroup = maleOrFemale.group();
	    
	    var dayOfWeek = nominees.dimension(function (d) {
		var day = d.born.getDay();
		var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		return day + '.' + name[day];
	    });
	    var dayOfWeekGroup = dayOfWeek.group();
	    
	    var prize = nominees.dimension(function(d){
		return d.prize;
	    });
	    
	    var prizeGroup = prize.group();
	    
	    var bornCity =  nominees.dimension(function (d) {
		return d.bornCity;
	    });
	    var bornCityGroup = bornCity.group();
	    
	    var bornCountry = nominees.dimension(function(d){
		return d.bornCountryCode;
	    });
	    var bornCountryGroup = bornCountry.group();
	    
	    var bornCountryPoints = [];
	    var bornCityPoints = [];
	    var bornContinentPoints = []
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
	    
	    bubbleOverlayData.cityDimension = bornCity;
	    bubbleOverlayData.cityGroup = bornCityGroup;
	    bubbleOverlayData.cityPoints = bornCityPoints;
	    bubbleOverlayData.countryDimension = bornCountry;
	    bubbleOverlayData.countryGroup = bornCountryGroup;
	    bubbleOverlayData.countryPoints = bornCountryPoints;
	    
	    var overlay = new bubbleOverlay(worldChart,bubbleOverlayData);
	    overlay.render(1);
	    
	    // count all the facts
	    dc.dataCount(".dc-data-count")
		.dimension(nominees)
		.group(all);
	    
	    maleOrFemaleChart
		.width(180) // (optional) define chart width, :default = 200
		.height(180) // (optional) define chart height, :default = 200
		.radius(80) // define pie radius
		.dimension(maleOrFemale) // set dimension
		.group(maleOrFemaleGroup) // set group
            /* (optional) by default pie chart will use group.key as its label
             * but you can overwrite it with a closure */
		.label(function (d) {
		    if (maleOrFemaleChart.hasFilter() && !maleOrFemaleChart.hasFilter(d.key)) {
			return d.key + '(0%)';
		    }
		    var label = d.key;
		    if (all.value()) {
			label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
		    }
		    return label;
		})
            // (optional) whether chart should render labels, :default = true
		.renderLabel(true)
            // (optional) if inner radius is used then a donut chart will be generated instead of pie chart
            //.innerRadius(40)
            // (optional) define chart transition duration, :default = 350
		.transitionDuration(500)
            // (optional) define color array for slices
            //.colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
            // (optional) define color domain to match your data domain if you want to bind data or color
		.colorDomain([-1750, 1644])
            // (optional) define color value accessor
		.colorAccessor(function(d, i){return d.value;})
		.render();
	    
	    dayOfWeekChart
		.width(180)
		.height(180)
		.margins({top: 20, left: 10, right: 10, bottom: 20})
		.group(dayOfWeekGroup)
		.dimension(dayOfWeek)
            // assign colors to each value in the x scale domain
		.ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
		.label(function (d) {
		    return d.key.split('.')[1];
		})
            // title sets the row text
		.title(function (d) {
		    return d.value;
		})
		.elasticX(true)
		.xAxis().ticks(4);
	    dayOfWeekChart.render();
	    
	    
	    prizeChart
		.width(180)
		.height(180)
		.margins({top: 20, left: 10, right: 10, bottom: 20})
		.group(prizeGroup)
		.dimension(prize)
            // assign colors to each value in the x scale domain
		.ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
		.label(function (d) {
		    return d.key;
		})
            // title sets the row text
		.title(function (d) {
		    return d.key + " = " + d.value;
		})
		.elasticX(true)
		.xAxis().ticks(4);
	    prizeChart.render();
	    
	    monthChart
		.width(990)
		.height(40)
		.margins({top: 0, right: 50, bottom: 20, left: 40})
		.dimension(monthsDimension)
		.group(monthsGroup)
		.centerBar(true)
		.gap(1)
		.x(d3.time.scale().domain([new Date(1840, 0, 1), new Date(1980, 11, 31)]))
		.round(d3.time.month.round)
		.alwaysUseRounding(true)
		.xUnits(d3.time.months);
	    monthChart.render();
	    
	});
    });
    
    jquery( "#month-chart-reset" ).click(function() {
	monthChart.filterAll();
	dc.redrawAll();
    });

    monthChart.renderlet(function(chart) {
	dc.events.trigger(function() {
	    currentFilters['month'] = monthChart.filters();
	});
    });
    
    maleOrFemaleChart.renderlet(function(chart) {
	dc.events.trigger(function() {
	    currentFilters['gender'] = maleOrFemaleChart.filters();
	});
    });

    
    prizeChart.renderlet(function(chart) {
	dc.events.trigger(function() {
	    currentFilters['prize'] = prizeChart.filters();
	});
    });

    dayOfWeekChart.renderlet(function(chart) {
	dc.events.trigger(function() {
	    currentFilters['day'] = dayOfWeekChart.filters();
	});
    });

    jquery( "#day-of-week-chart-reset" ).click(function() {
	delete currentFilters['day'];
	dayOfWeekChart.filterAll();
	dc.redrawAll();
    });
    
    jquery( "#male-female-chart-reset" ).click(function() {
	delete currentFilters['gender'];
	maleOrFemaleChart.filterAll();
	dc.redrawAll();
    });
    
    jquery( "#prize-chart-reset" ).click(function() {
	delete currentFilters['prize'];
	prizeChart.filterAll();
	dc.redrawAll();
    });
    
    jquery( "#reset-all-filters" ).click(function() {
	currentFilters = {};
	dc.filterAll();
	dc.redrawAll();
    });
    
    jquery(function() {
	setTimeout(function(){
	    dc.filterAll();
	    dc.redrawAll();
	},3000 );
	
    });
    
});
