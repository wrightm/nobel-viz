
define(function (require) {

  var state = "NOMINEE";
  var jquery = require('jquery');
  var dc = require('dc');
  var d3 = require('d3');
  var crossfilter = require('crossfilter');
  var topojson = require('topojson');
  var bubbleOverlay  = require('bubbleOverlay');
  var globalSettings = require('globalSettings');
  var nomineesSettings = require('nomineesSettings');
  var NomineesCrossfilters = require('nomineesCrossfilters');
  var NomineesCharts = require('nomineesCharts');
  
  var width = globalSettings.width(),
      height = globalSettings.height();

  var projection = globalSettings.projection();

  var path = globalSettings.geoPathProjection();

  var svg = globalSettings.svg();

  var g = globalSettings.g();

  var clicked = globalSettings.clicked();

  var bubbleOverlayData = globalSettings.bubbleOverlayData();

  var nomineesCharts = new NomineesCharts();
  var maleOrFemaleChart = nomineesCharts.maleOrFemaleChart();
  var yearOfBirthChart = nomineesCharts.yearOfBirthChart();
  var prizeChart = nomineesCharts.prizeChart();
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

    d3.json("/data/nominees.json", function(error, data) {

      d3.json("/data/lats-lons.json", function(error, latsAndLons) {
        
        data = nomineesSettings.validate(data,latsAndLons);

        var nomineesCrossfilters = new NomineesCrossfilters(data,latsAndLons,projection);
        var nominees = nomineesCrossfilters.getNominators();
        var nomineesAll = nomineesCrossfilters.getAll();
        var bubbleOverlayData = nomineesCrossfilters.getBubbleOverlayData();
        globalSettings.setBubbleOverlayData(bubbleOverlayData);
        globalSettings.setState(state);

        var overlay = new bubbleOverlay(worldChart,bubbleOverlayData);
        overlay.render(1,state);

        // count all the facts
        dc.dataCount(".dc-data-count")
            .dimension(nominees)
            .group(nomineesAll)
            .render();

        nomineesCharts.setCrossfilters(nomineesCrossfilters);
        nomineesCharts.render();
      });
    });
  });

  jquery( "#year-of-birth-chart-reset" ).click(function() {
    yearOfBirthChart.filterAll();
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
