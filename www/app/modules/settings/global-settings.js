define(function (require) {

	var jquery = require('jquery');
	var d3 = require('d3');

	var active = d3.select(null);
	var width = 1000;
	var height = 500;
	var projectionScale = 200;
	
	var svg = buildSVG(width,height);
	var zoom = buildZoom();
	var g = svg.append("g");
	var projection = d3.geo.equirectangular().scale(projectionScale).translate([width / 2, height / 2]);;
	var path = d3.geo.path().projection(projection);

	svg.call(zoom) // delete this line to disable free zooming
      	.call(zoom.event);

    var dc = require('dc');
	var worldChart = dc.bubbleOverlay("#world-map").svg(d3.select("#world-map svg g"));

	var bubbleOverlay  = require('bubbleOverlay');
	var bubbleOverlayData = {};
	var currentState = "";

	function stopped() {
    	if (d3.event.defaultPrevented) d3.event.stopPropagation();
  	};

  	function reset() {
	    active.classed("active", false);
	    active = d3.select(null);

	    svg.transition()
	        .duration(750)
	        .call(zoom.translate([0, 0]).scale(1).event);
  	};

  	function buildSVG(width,height){
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

		return svg;
  	};
  	

  	function buildZoom(){
		var zoom = d3.behavior.zoom()
	      .translate([0, 0])
	      .scale(1)
	      .scaleExtent([1, 6])
	      .on("zoom", zoomed);

    	return zoom;
  	};

  	function zoomed() {
	    g.style("stroke-width", 1.5 / d3.event.scale + "px");
	    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

	    if(bubbleOverlayData){
	      var overlay = new bubbleOverlay(worldChart,bubbleOverlayData);
	      overlay.render(d3.event.scale,currentState);
	    }
  	};	

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
  	};

	function GlobalSettings(){
	};

	GlobalSettings.prototype = {
		width : function(){
			return width;
		},
		height : function(){
			return height;
		},
		projectionScale : function(){
			return projectionScale;
		},
		projection : function(){
			return projection;
		},
		geoPathProjection : function(){
			return path;
		},
		svg : function(){
		    return svg;
		},
		bubbleOverlayData : function(){
			return bubbleOverlayData;
		},
		setBubbleOverlayData : function(bubbles){
			bubbleOverlayData = bubbles;
		},
		worldChart : function(){
			return worldChart;
		},
		g : function(){
			return g;
		},
		clicked : function(){
			return clicked;
		},
		setState : function(state){
			currentState = state;
		}
	};

	return new GlobalSettings();
});