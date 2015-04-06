define(function (require) {

	var dc = require('dc');
	var d3 = require('d3');

	var maleOrFemaleChart = dc.pieChart('#male-female-chart');
	var seasonOfTheYearChart = dc.rowChart('#season-of-the-year-chart');
	var monthChart = dc.barChart('#month-chart');
	var prizeChart = dc.rowChart('#prize-chart');

	function LaureatesCharts(){
	}

	LaureatesCharts.prototype = {
		maleOrFemaleChart : function(){
			return maleOrFemaleChart;
		},
		seasonOfTheYearChart : function(){
			return seasonOfTheYearChart;
		},
		monthChart : function(){
			return monthChart;
		},
		prizeChart : function(){
			return prizeChart;
		},
		setCrossfilters : function(laureatesCrossfilters){
			
			var laureatesDimensions = laureatesCrossfilters.getDimensions();
      var laureatesGroups = laureatesCrossfilters.getGroups();
      var laureatesAll = laureatesCrossfilters.getAll();
      
      setupMaleOrFemaleChart(laureatesDimensions,laureatesGroups,laureatesAll);
      setupSeasonOfTheYearChart(laureatesDimensions,laureatesGroups);
      setupPrizeChart(laureatesDimensions,laureatesGroups);
      setupMonthChart(laureatesDimensions,laureatesGroups);

		},
		render : function(){
			maleOrFemaleChart.render();
			seasonOfTheYearChart.render();
			prizeChart.render();
			monthChart.render();
		}
	};

	function setupMaleOrFemaleChart(laureatesDimensions,laureatesGroups,laureatesAll){
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
    .colorAccessor(function(d, i){
    	return d.value;
    });

	};

	function setupSeasonOfTheYearChart(laureatesDimensions,laureatesGroups){
		seasonOfTheYearChart
    .width(180)
    .height(180)
    .margins({top: 20, left: 10, right: 10, bottom: 20})
    .group(laureatesGroups.seasonOfTheYear)
    .dimension(laureatesDimensions.seasonOfTheYear)
    // assign colors to each value in the x scale domain
    .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef'])
    .label(function (d) {
        return d.key;
    })
    // title sets the row text
    .title(function (d) {
        return d.value;
    })
    .elasticX(true)
    .xAxis().ticks(4);
	};

	function setupPrizeChart(laureatesDimensions,laureatesGroups){
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
	};

	function setupMonthChart(laureatesDimensions,laureatesGroups){
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
	};

	return LaureatesCharts;

});