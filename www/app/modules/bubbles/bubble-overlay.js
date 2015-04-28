
define(function (require) {
    
    var bubbleOverlayHelpers = require("bubbleOverlayHelpers");
    var lastState = "";
    
    function BubbleOverlay(worldChart,datasets) {
		this.worldChart = worldChart;
		this.datasets = datasets;
		this.cityDimension = datasets.cityDimension;
		this.cityGroup = datasets.cityGroup;
		this.cityPoints = datasets.cityPoints;
		this.countryDimension = datasets.countryDimension;
		this.countryGroup = datasets.countryGroup;
		this.countryPoints = datasets.countryPoints;
    };
    
    
    /**
     * Modify function which takes in state and (if different from previous state) 
     *
     */
    function modifyBubbleOverlay(currentState,worldChart,dimension,group,points,settings){
	if(lastState != currentState){
            worldChart.removeCircles();
            worldChart
		.minRadiusWithLabel(0)
		.minBubbleR(settings.minBubbleR)
		.maxBubbleR(settings.maxBubbleR)
		.fontSize(settings.fontSize)
		.deletePoints()
		.addPoints(points)
		.width(settings.width)
		.height(settings.height)
		.dimension(dimension)
		.group(group)
		.radiusValueAccessor(function(p) {
		    return p.value;
		})
		.colors(["#ff7373","#ff4040","#ff0000","#bf3030","#a60000"])
		.colorDomain([13, 30])
		.colorAccessor(function(p) {
		    return p.value;
		})
		.title(function(p) {
		    return settings.message +": "+ p.key + "\n" +
			settings.name+": " + p.value;
		})
		.label(function(p){
		    return p.value;
		});
            worldChart.render().redraw();
	}
	lastState = currentState;
    }
    
    BubbleOverlay.prototype = {
	
	render : function(scale,name){
            var state = bubbleOverlayHelpers.state(scale);
            var settings = bubbleOverlayHelpers.stateSettings(scale,name);
            if(state == "CountryXLarge"){
		modifyBubbleOverlay("CountryXLarge",this.worldChart,
				    this.countryDimension,
				    this.countryGroup,
				    this.countryPoints,
				    settings);
            } 
            else if(state == "CountryLarge") {
		modifyBubbleOverlay("CountryLarge",this.worldChart,
				    this.countryDimension,
				    this.countryGroup,
				    this.countryPoints,
				    settings);
            } 
            else if(state == "CountryMedium") {
		modifyBubbleOverlay("CountryMedium",this.worldChart,
				    this.countryDimension,
				    this.countryGroup,
				    this.countryPoints,
				    settings);
            } 
            else if(state == "CountrySmall") {
		modifyBubbleOverlay("CountrySmall",this.worldChart,
				    this.countryDimension,
				    this.countryGroup,
				    this.countryPoints,
				    settings);
            }
            else if(state == "CityLarge"){
		modifyBubbleOverlay("CityLarge",this.worldChart,
				    this.cityDimension,
				    this.cityGroup,
				    this.cityPoints,
				    settings);
            } else if(state == "CityMedium"){
		modifyBubbleOverlay("CityMedium",this.worldChart,
				    this.cityDimension,
				    this.cityGroup,
				    this.cityPoints,
				    settings);
            }
            
	}
    };
    
    return BubbleOverlay;
});
