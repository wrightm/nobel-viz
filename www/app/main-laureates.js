
define(function (require) {

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
  
  var width = globalSettings.width(),
      height = globalSettings.height();

  var projection = globalSettings.projection();

  var path = globalSettings.geoPathProjection();

  var svg = globalSettings.svg();

  var g = globalSettings.g();

  var clicked = globalSettings.clicked();

  var bubbleOverlayData = globalSettings.bubbleOverlayData();

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
      
      var overlay = new bubbleOverlay(worldChart,laureatesCrossfilters.getBubbleOverlayData());
      overlay.render(1);

      // count all the facts
      dc.dataCount(".dc-data-count")
          .dimension(laureates)
          .group(laureatesAll)
          .render();

      laureatesCharts.setCrossfilters(laureatesCrossfilters);
      laureatesCharts.render();

    });
  });

  jquery( "#month-chart-reset" ).click(function() {
    monthChart.filterAll();
    dc.redrawAll();
  });

  jquery( "#season-of-the-year-chart-reset" ).click(function() {
    seasonOfTheYearChart.filterAll();
    dc.redrawAll();
  });

  jquery( "#male-female-chart-reset" ).click(function() {
    maleOrFemaleChart.filterAll();
    dc.redrawAll();
  });

  jquery( "#prize-chart-reset" ).click(function() {
    prizeChart.filterAll();
    dc.redrawAll();
  });

  jquery( "#reset-all-filters" ).click(function() {
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
