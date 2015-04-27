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
    var bootstrap = require('bootstrap');
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
    var yearOfBirthChart = laureatesCharts.yearOfBirthChart();
    var awardedYearChart = laureatesCharts.awardedYearChart();
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
	
        d3.json("/data/laureates.json", function(error, data) {
            d3.json("/data/lats-lons.json", function(error, latsAndLons) {
	    
        	    data = laureateSettings.validate(data,latsAndLons);
        	    
        	    var laureatesCrossfilters = new LaureatesCrossfilters(data,latsAndLons,projection);
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
        	    
        	    url.addURLFilteringToChart("/laureates.html", currentFilters, awardedYearChart, 'awardYear');
        	    url.addURLFilteringToChart("/laureates.html", currentFilters, prizeChart, 'prize');
        	    url.addURLFilteringToChart("/laureates.html", currentFilters, maleOrFemaleChart, 'gender');
                url.addURLFilteringToChart("/laureates.html", currentFilters, yearOfBirthChart, 'yearOfBirth');
        	    laureatesCharts.render();
        	    
        	    var params = url.getFilteredParams();
        	    
        	    if (params['awardYear'] != null) {
                    var dateTimeFilter = [new Date(params['awardYear'][0]),new Date(params['awardYear'][1])];
                    awardedYearChart.filter(dc.filters.RangedTwoDimensionalFilter(dateTimeFilter));
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
                if (params['yearOfBirth'] != null) {
                    var dateTimeFilter = [new Date(params['yearOfBirth'][0]),new Date(params['yearOfBirth'][1])];
                    yearOfBirthChart.filter(dc.filters.RangedTwoDimensionalFilter(dateTimeFilter));
                }
        	    
        	    dc.redrawAll();
        });
	   });
    });
    
    jquery( "#year-of-birth-chart-reset" ).click(function() {
        delete currentFilters['yearOfBirth'];
    	yearOfBirthChart.filterAll();
    	dc.redrawAll();
    });
    
    jquery( "#year-of-award-chart-reset" ).click(function() {
    	delete currentFilters['awardYear'];
    	awardedYearChart.filterAll();
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

    jquery('#timeline a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });
    
    socialShareUrl.shareUrl();
    
    jquery(function() {
	   setTimeout(function(){
	    dc.redrawAll();
	   }, 3000);
    });
    
    
});
