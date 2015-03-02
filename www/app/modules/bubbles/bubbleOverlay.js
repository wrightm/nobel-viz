
define(function () {
    function BubbleOverlay(settings,svg) {
      this.settings = settings;
      this.svg = svg;
    };

    BubbleOverlay.prototype = {

      createCircles : function(data,radius,textFn){
        var circle = g.selectAll("circle")
              .data(data);

        circle.exit().remove();

        circle.enter().append("circle")
          .attr("r", radius)
          .attr("class", "bubble")
          .text(function(d) { return d.nLaureates;});
        
        circle
          .attr("cx", function(d) { return d.lon; })
          .attr("cy", function(d) { return d.lat; });
          
        circle
          .append("title")
          .text(textFn);

        return circle;
      },

      render : function(datasets,scale){
        this.svg.selectAll("circle").remove();
        if(datasets != null){
          if(scale < 7 || scale == null || scale == undefined){
            if(scale >= 1 && scale < 2){
              this.createCircles(datasets.countries,5,this.countryText);
            } else if(scale >= 2 && scale < 3) {
              this.createCircles(datasets.countries,3,this.countryText);
            } else if(scale >= 3 && scale < 4) {
              this.createCircles(datasets.countries,2,this.countryText);
            } else if(scale >= 4 && scale < 7) {
              this.createCircles(datasets.countries,1,this.countryText);
            }
          } else {
            if(scale >= 7 && scale < 11){
              this.createCircles(datasets.cities,0.5,this.cityText);
            } else {
              this.createCircles(datasets.cities,0.3,this.cityText);
            }
          }
        }
      },

      cityText : function(laureateGroup){
        return "Born City: "+ laureateGroup.groupKey+ "\n"
                + "Number of Laureates: "+ laureateGroup.nLaureates; 
      },

      countryText : function(laureateGroup){
        return "Born Country: "+ laureateGroup.groupKey+ "\n"
                + "Number of Laureates: "+ laureateGroup.nLaureates; 
      }

    };

    return BubbleOverlay;
});



