
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
  var dayOfWeekChart = laureatesCharts.dayOfWeekChart();
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
      var laureatesDimensions = laureatesCrossfilters.getDimensions();
      var laureatesGroups = laureatesCrossfilters.getGroups();
      var laureatesAll = laureatesCrossfilters.getAll();
      
      var overlay = new bubbleOverlay(worldChart,laureatesCrossfilters.getBubbleOverlayData());
      overlay.render(1);

      // count all the facts
      dc.dataCount(".dc-data-count")
          .dimension(laureates)
          .group(laureatesAll);

      maleOrFemaleChart
          .width(180) // (optional) define chart width, :default = 200
          .height(180) // (optional) define chart height, :default = 200
          .radius(80) // define pie radius
          .dimension(laureatesDimensions.gender) // set dimension
          .group(laureatesGroups.gender) // set group
          /* (optional) by default pie chart will use group.key as its label
           * but you can overwrite it with a closure */
          .label(function (d) {
              if (maleOrFemaleChart.hasFilter() && !maleOrFemaleChart.hasFilter(d.key)) {
                  return d.key + '(0%)';
              }
              var label = d.key;
              if (laureatesAll.value()) {
                  label += '(' + Math.floor(d.value / laureatesAll.value() * 100) + '%)';
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
          .group(laureatesGroups.dayOfWeek)
          .dimension(laureatesDimensions.dayOfWeek)
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
          .group(laureatesGroups.prize)
          .dimension(laureatesDimensions.prize)
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
          .group(laureatesGroups.months)
          .dimension(laureatesDimensions.months)
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

  jquery( "#day-of-week-chart-reset" ).click(function() {
    dayOfWeekChart.filterAll();
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
