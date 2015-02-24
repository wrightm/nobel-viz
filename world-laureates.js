var maleOrFemaleChart = dc.pieChart('#male-female-chart');
var dayOfWeekChart = dc.rowChart('#day-of-week-chart');
var monthChart = dc.barChart('#month-chart');
var prizeChart = dc.rowChart('#prize-chart');

var width = 1300,
    height = 500,
    active = d3.select(null);

var projection = d3.geo.equirectangular()
    .scale(200)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var radius = d3.scale.sqrt()
    .domain([0, 100])
    .range([5, 30]);

var svg = d3.select("#map-container").append("div")
    .attr("id", "world-map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var g = svg.append("g");

var worldChart = dc.bubbleOverlay("#world-map")
                  .svg(d3.select("#world-map svg g"));

var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

svg
    .call(zoom) // delete this line to disable free zooming
    .call(zoom.event);

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

  d3.json("/data/laureates-cities-world.json", function(error, data) {
    
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
    var laureates = crossfilter(data);
    var all = laureates.groupAll();

    // dimension by year
    var yearlyDimension = laureates.dimension(function (d) {
      return d3.time.year(d.born).getFullYear();
    });

    // dimension by month
    var monthsDimension = laureates.dimension(function (d) {
      return d.month_born;
    });
    var monthsGroup = monthsDimension.group();

    // dimension by days
    var daysDimension = laureates.dimension(function (d) {
      return d.day_born;
    });

    // male or female
    var maleOrFemale = laureates.dimension(function (d) {
      return d.gender === "male" ? 'Male' : 'Female';
    });
    var maleOrFemaleGroup = maleOrFemale.group();

    var dayOfWeek = laureates.dimension(function (d) {
      var day = d.born.getDay();
      var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return day + '.' + name[day];
    });
    var dayOfWeekGroup = dayOfWeek.group();
    
    var bornCity =  laureates.dimension(function (d) {
      return d.bornCity;
    });

    var bornCityGroup = bornCity.group();
    var numberOfLaureatesPerCity = bornCityGroup.size();
    var maxNumberOfLaureatesPerCity = bornCityGroup.top(1)[0].value;
    var minNumberOfLaureatesPerCity = bornCityGroup.top(Infinity)[numberOfLaureatesPerCity-1].value;
    console.log(minNumberOfLaureatesPerCity,maxNumberOfLaureatesPerCity);
    
    var prize = laureates.dimension(function(d){
      return d.prize;
    });

    var prizeGroup = prize.group();

    // count all the facts
    dc.dataCount(".dc-data-count")
        .dimension(laureates)
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
        .colorAccessor(function(d, i){return d.value;});
    
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

    worldChart
        .width(width)
        .height(height)
        .dimension(bornCity)
        .group(bornCityGroup)
        .radiusValueAccessor(function(p) {
            return p.value;
        })
        .minRadiusWithLabel(1)
        .r(d3.scale.linear().domain([0,100000000]))
        .colors(["#ff7373","#ff4040","#ff0000","#bf3030","#a60000"])
        .colorDomain([13, 30])
        .colorAccessor(function(p) {
            return p.value;
        })
        .title(function(p) {
            return "City: " + p.key + "\n" +
                   "laureates: " + p.value;
        })
        .label(function(p){
          return p.value;
        });
                

    data.forEach(function(laureate){
      var coordinates = projection([laureate.bornCityLatLon[1],laureate.bornCityLatLon[0]]);
      if(coordinates !== null){
        worldChart.point(laureate.bornCity, coordinates[0], coordinates[1]);
      }
    });
    dc.renderAll();
    
  });
});

function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = 0.5 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg.transition()
      .duration(750)
      .call(zoom.translate(translate).scale(scale).event);
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  svg.transition()
      .duration(750)
      .call(zoom.translate([0, 0]).scale(1).event);
}

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.scale + "px");
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}