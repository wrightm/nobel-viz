
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

  jquery('#facebook-share').click(function (e) {
    var url = document.location.href;
    var title = 'Data Visualisation';
    window.open('http://www.facebook.com/share.php?u='+url+'&title='+title, '_blank');
  });

  jquery('#google-share').click(function (e) {
    var url = document.location.href;
    var title = 'Data Visualisation';
    window.open('https://plus.google.com/share?url='+url, '_blank');
  });

  jquery('#linkedin-share').click(function (e) {
    var url = document.location.href;
    var title = 'Data Visualisation';
    window.open('http://www.linkedin.com/shareArticle?mini=true&url='+url+'&title='+title, '_blank');
  });

  jquery('#pinterest-share').click(function (e) {
    var url = document.location.href;
    var title = 'Data Visualisation';
    window.open('http://pinterest.com/pin/create/bookmarklet/?url='+url+'&is_video=false&description='+title, '_blank');
  });

  jquery('#reddit-share').click(function (e) {
    var url = document.location.href;
    var title = 'Data Visualisation';
    window.open('http://www.reddit.com/submit?url='+url+'&title='+title, '_blank');
  });

  jquery('#twitter-share').click(function (e) {
    var url = document.location.href;
    var title = 'Data Visualisation';
    window.open('http://twitter.com/intent/tweet?status='+title+'+'+url, '_blank');
  });


  jquery(function() {
     setTimeout(function(){
      dc.filterAll();
      dc.redrawAll();
     },3000 );
    
  });

});
