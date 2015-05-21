define(function (require) {

	var dc = require('dc');
	var d3 = require('d3');

	var maleOrFemaleChart = dc.pieChart('#male-female-chart');
	var yearOfBirthChart = dc.barChart('#year-of-birth-chart');
    var nominatorYearChart = dc.barChart('#nominator-year-chart');
	var prizeChart = dc.rowChart('#prize-chart');

	function NominatorCharts(){
	}

	NominatorCharts.prototype = {
		maleOrFemaleChart : function(){
			return maleOrFemaleChart;
		},
		seasonOfTheYearChart : function(){
			return seasonOfTheYearChart;
		},
		yearOfBirthChart : function(){
			return yearOfBirthChart;
		},
        nominatorYearChart : function(){
            return nominatorYearChart;
        },
		prizeChart : function(){
			return prizeChart;
		},
		setCrossfilters : function(nominatorsCrossfilters){
			
			var nominatorsDimensions = nominatorsCrossfilters.getDimensions();
            var nominatorsGroups = nominatorsCrossfilters.getGroups();
            var nominatorsAll = nominatorsCrossfilters.getAll();

            setupMaleOrFemaleChart(nominatorsDimensions,nominatorsGroups,nominatorsAll);
            setupPrizeChart(nominatorsDimensions,nominatorsGroups);
            setupYearOfBirthChart(nominatorsDimensions,nominatorsGroups);
            setupNominatorYearChartChart(nominatorsDimensions,nominatorsGroups);
		},
		render : function(){
			maleOrFemaleChart.render();
			prizeChart.render();
			yearOfBirthChart.render();
            nominatorYearChart.render();
		}
	};

	function setupMaleOrFemaleChart(nominatorsDimensions,nominatorsGroups,nominatorsAll){
		maleOrFemaleChart
        .width(180) // (optional) define chart width, :default = 200
        .height(180) // (optional) define chart height, :default = 200
        .radius(80) // define pie radius
        .dimension(nominatorsDimensions.gender) // set dimension
        .group(nominatorsGroups.gender) // set group
        /* (optional) by default pie chart will use group.key as its label
         * but you can overwrite it with a closure */
        .label(function (d) {
            if (maleOrFemaleChart.hasFilter() && !maleOrFemaleChart.hasFilter(d.key)) {
                return d.key + '(0%)';
            }
            var label = d.key;
            if (nominatorsAll.value()) {
                label += '(' + Math.floor(d.value / nominatorsAll.value() * 100) + '%)';
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

	function setupPrizeChart(nominatorsDimensions,nominatorsGroups){
		prizeChart
        .width(180)
        .height(180)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .group(nominatorsGroups.prize)
        .dimension(nominatorsDimensions.prize)
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

	function setupYearOfBirthChart(nominatorsDimensions,nominatorsGroups){
		var minYearOfBirth = new Date(1830,0,1);
        var maxYearOfBirth = new Date(1920,0,1);

        yearOfBirthChart
        .width(990)
        .height(40)
        .margins({top: 0, right: 50, bottom: 20, left: 40})
        .group(nominatorsGroups.yearOfBirth)
        .dimension(nominatorsDimensions.yearOfBirth)
        .centerBar(true)
        .gap(1)
        .x(d3.time.scale().domain([minYearOfBirth, maxYearOfBirth]))
        .y(d3.scale.linear().domain([1,nominatorsGroups.yearOfBirth.top(1)[0].value*.01]))
        .round(d3.time.year.round)
        .alwaysUseRounding(true)
        .xUnits(d3.time.years);

        yearOfBirthChart.yAxis().ticks(0);
	};

    function setupNominatorYearChartChart(nominatorsDimensions,nominatorsGroups){
        var minNominatorYear = new Date(Number(nominatorsDimensions.nominatorYear.bottom(1)[0].nominatorYear),0,1);
        var maxNominatorYear = new Date(Number(nominatorsDimensions.nominatorYear.top(1)[0].nominatorYear),0,1);

        nominatorYearChart
        .width(990)
        .height(40)
        .margins({top: 0, right: 50, bottom: 20, left: 40})
        .group(nominatorsGroups.nominatorYear)
        .dimension(nominatorsDimensions.nominatorYear)
        .centerBar(true)
        .gap(1)
        .x(d3.time.scale().domain([minNominatorYear, maxNominatorYear]))
        .round(d3.time.year.round)
        .alwaysUseRounding(true)
        .xUnits(d3.time.years);

        nominatorYearChart.yAxis().ticks(0);
    };

	return NominatorCharts;

});