
define(function (require) {

  var state = "NOMINATOR";
  var jquery = require('jquery');
  var dc = require('dc');
  var d3 = require('d3');
  var crossfilter = require('crossfilter');
  var topojson = require('topojson');
  var bubbleOverlay  = require('bubbleOverlay');
  var globalSettings = require('globalSettings');
  var nominatorSettings = require('nominatorSettings');
  var NominatorCrossfilters = require('nominatorCrossfilters');
  var NominatorCharts = require('nominatorCharts');
  var bootstrap = require('bootstrap');
  
  var width = globalSettings.width(),
      height = globalSettings.height();

  var projection = globalSettings.projection();

  var path = globalSettings.geoPathProjection();

  var svg = globalSettings.svg();

  var g = globalSettings.g();

  var clicked = globalSettings.clicked();

  var bubbleOverlayData = globalSettings.bubbleOverlayData();

  var nominatorCharts = new NominatorCharts();
  var maleOrFemaleChart = nominatorCharts.maleOrFemaleChart();
  var yearOfBirthChart = nominatorCharts.yearOfBirthChart();
  var nominatorYearChart = nominatorCharts.nominatorYearChart();
  var prizeChart = nominatorCharts.prizeChart();
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

    d3.json("/data/nominators.json", function(error, data) {

      d3.json("/data/lats-lons.json", function(error, latsAndLons) {
        
        data = nominatorSettings.validate(data,latsAndLons);

        var nominatorCrossfilters = new NominatorCrossfilters(data,latsAndLons,projection);
        var nominators = nominatorCrossfilters.getNominators();
        var nominatorsAll = nominatorCrossfilters.getAll();
        var bubbleOverlayData = nominatorCrossfilters.getBubbleOverlayData();
        globalSettings.setBubbleOverlayData(bubbleOverlayData);
        globalSettings.setState(state);

        var overlay = new bubbleOverlay(worldChart,bubbleOverlayData);
        overlay.render(1,state);

        // count all the facts
        dc.dataCount(".dc-data-count")
            .dimension(nominators)
            .group(nominatorsAll)
            .render();

        nominatorCharts.setCrossfilters(nominatorCrossfilters);
        nominatorCharts.render();
      });
    });
  });

  jquery( "#year-of-birth-chart-reset" ).click(function() {
    yearOfBirthChart.filterAll();
    dc.redrawAll();
  });

  jquery( "#nominator-year-chart-reset" ).click(function() {
    nominatorYearChart.filterAll();
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

  jquery('#timeline a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  });


  jquery(function() {
     setTimeout(function(){
      dc.filterAll();
      dc.redrawAll();
     },3000 );
    
  });

});
