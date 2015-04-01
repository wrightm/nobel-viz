define(function (require) {

	var dc = require('dc');

	var maleOrFemaleChart = dc.pieChart('#male-female-chart');
	var dayOfWeekChart = dc.rowChart('#day-of-week-chart');
	var monthChart = dc.barChart('#month-chart');
	var prizeChart = dc.rowChart('#prize-chart');

	function LaureatesCharts(){
	}

	LaureatesCharts.prototype = {
		maleOrFemaleChart : function(){
			return maleOrFemaleChart;
		},
		dayOfWeekChart : function(){
			return dayOfWeekChart;
		},
		monthChart : function(){
			return monthChart;
		},
		prizeChart : function(){
			return prizeChart;
		}
	};

	return LaureatesCharts;

});