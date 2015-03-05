
define(function () {

    var lastState = "";

    function modifyBubbleOverlay(currentState,worldChart,dimension,group,points,width,height,message){
      if(lastState != currentState){
        worldChart.removeCircles();
        worldChart
          .deletePoints()
          .addPoints(points)
          .width(width)
          .height(height)
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
              return message +": "+ p.key + "\n" +
                     "laureates: " + p.value;
          })
          .label(function(p){
            return p.value;
          });
          worldChart.render().redraw();
      }
      lastState = currentState;
    }

    function BubbleOverlay(worldChart,datasets) {
      this.worldChart = worldChart;
      this.cityDimension = datasets.cityDimension;
      this.cityGroup = datasets.cityGroup;
      this.cityPoints = datasets.cityPoints;
      this.countryDimension = datasets.countryDimension;
      this.countryGroup = datasets.countryGroup;
      this.countryPoints = datasets.countryPoints;
      this.continentDimension = datasets.continentDimension;
      this.continentGroup = datasets.continentGroup;
      this.continentPoints = datasets.continentPoints;
    };

    BubbleOverlay.prototype = {

      render : function(scale){
          console.log(scale)
          if(scale < 7 || scale == null || scale == undefined){
            if(scale >= 1 && scale < 1.5){
              modifyBubbleOverlay("Continent",this.worldChart,
                this.continentDimension,
                this.continentGroup,
                this.continentPoints,
                50,
                50,
                "Continent");
            } else if(scale >= 1.5 && scale < 3) {
              modifyBubbleOverlay("CountryLarge",this.worldChart,
                this.countryDimension,
                this.countryGroup,
                this.countryPoints,
                10,
                20,
                "Country");
            } else if(scale >= 3 && scale < 4) {
              modifyBubbleOverlay("CountryMedium",this.worldChart,
                this.countryDimension,
                this.countryGroup,
                this.countryPoints,
                10,
                20,
                "Country");
            } else if(scale >= 4 && scale < 7) {
              modifyBubbleOverlay("CountrySmall",this.worldChart,
                this.countryDimension,
                this.countryGroup,
                this.countryPoints,
                10,
                20,
                "Country");
            }
          } else {
            if(scale >= 7 && scale < 11){
              modifyBubbleOverlay("CityLarge",this.worldChart,
                this.cityDimension,
                this.cityGroup,
                this.cityPoints,
                10,
                20,
                "City");
            } else {
              modifyBubbleOverlay("CityMedium",this.worldChart,
                this.cityDimension,
                this.cityGroup,
                this.cityPoints,
                10,
                20,
                "City");
            }
          }
      }

    };

    return BubbleOverlay;
});


