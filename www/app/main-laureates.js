define(function (require) {
    
    var state = "LAUREATES";
    var jquery = require('jquery');
    var dc = require('dc');
    var d3 = require('d3');
    var crossfilter = require('crossfilter');
    var topojson = require('topojson');
    var bubbleOverlay  = require('bubbleOverlay');
    var globalSettings = require('globalSettings');
    var laureateSettings = require('laureateSettings');
    var LaureatesCrossfilters = require('laureatesCrossfilters');
    var LaureatesCharts = require('laureatesCharts');
    var socialShareUrl = require('socialShareUrl');
    
    var url = require('url');
    var currentFilters = {};
    
    
    var width = globalSettings.width(),
	   height = globalSettings.height();
    
    var projection = globalSettings.projection();
    
    var path = globalSettings.geoPathProjection();
    
    var svg = globalSettings.svg();
    
    var g = globalSettings.g();
    
    var clicked = globalSettings.clicked();
    
    var laureatesCharts = new LaureatesCharts();
    var maleOrFemaleChart = laureatesCharts.maleOrFemaleChart();
    var seasonOfTheYearChart = laureatesCharts.seasonOfTheYearChart();
    var monthChart = laureatesCharts.monthChart();
    var prizeChart = laureatesCharts.prizeChart();
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
	    
	    data = laureateSettings.validate(data);
	    
	    var laureatesCrossfilters = new LaureatesCrossfilters(data,projection);
	    var laureates = laureatesCrossfilters.getLaureates();
	    var laureatesAll = laureatesCrossfilters.getAll();
	    var bubbleOverlayData = laureatesCrossfilters.getBubbleOverlayData();
	    globalSettings.setBubbleOverlayData(bubbleOverlayData);
	    globalSettings.setState(state);
	    
	    var overlay = new bubbleOverlay(worldChart,bubbleOverlayData);
	    overlay.render(1,state);
	    
	    // count all the facts
	    dc.dataCount(".dc-data-count")
  		.dimension(laureates)
  		.group(laureatesAll)
  		.render();
	    
	    laureatesCharts.setCrossfilters(laureatesCrossfilters);
	    
	    url.addURLFilteringToChart("/laureates.html", currentFilters, seasonOfTheYearChart, 'season');
	    url.addURLFilteringToChart("/laureates.html", currentFilters, prizeChart, 'prize');
	    url.addURLFilteringToChart("/laureates.html", currentFilters, maleOrFemaleChart, 'gender');
        url.addURLDateRangeFiltering("/laureates.html", currentFilters, monthChart, 'laureateBirth');
	    laureatesCharts.render();
	    
	    var params = url.getFilteredParams();
	    
	    if (params['season'] != null) {
    		params['season'].forEach(function (day) {
    		    seasonOfTheYearChart.filter(day);
    		});
	    }
	    if (params['gender'] != null) {
    		params['gender'].forEach(function (gender) {
    		    maleOrFemaleChart.filter(gender);
    		});
	    }
	    if (params['prize'] != null) {
    		params['prize'].forEach(function(prize) {
    		    prizeChart.filter(prize);
    		});
	    }

        if (params['laureateBirth'] != null) {
            var dateTimeFilter = [new Date(params['laureateBirth'][0]),new Date(params['laureateBirth'][1])];
            monthChart.filter(dc.filters.RangedTwoDimensionalFilter(dateTimeFilter));
        }
	    
	    dc.redrawAll();
	   });
    });
    
    jquery( "#month-chart-reset" ).click(function() {
    	monthChart.filterAll();
    	dc.redrawAll();
    });
    
    jquery( "#season-of-the-year-chart-reset" ).click(function() {
    	delete currentFilters['season'];
    	seasonOfTheYearChart.filterAll();
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
    
    socialShareUrl.shareUrl();
    
    jquery(function() {
	   setTimeout(function(){
	    dc.redrawAll();
	   }, 3000);
    });
    
    
});
