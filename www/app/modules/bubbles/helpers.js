
define(function () {
  return {
      state : function(scale){
        if(scale < 7 || scale == null || scale == undefined){
          if(scale >= 1 && scale < 1.5){
            return "CountryXLarge";
          } else if(scale >= 1.5 && scale < 3) {
            return "CountryLarge";
          } else if(scale >= 3 && scale < 4) {
            return "CountryMedium";
          } else if(scale >= 4 && scale < 7) {
            return "CountrySmall";
          }
        } else {
          if(scale >= 7 && scale < 11){
            return "CityLarge";
          } else {
            return "CityMedium";
          }
        }

      },

      stateSettings : function(scale){
        if(scale < 7 || scale == null || scale == undefined){
          if(scale >= 1 && scale < 1.5){
            var settings = {
              minBubbleR : 10,
              maxBubbleR : 20,
              fontSize : "10px",
              width : 1300,
              height : 500,
              message : "Country"
            };
            return settings;
          } else if(scale >= 1.5 && scale < 3) {
            var settings = {
              minBubbleR : 5,
              maxBubbleR : 10,
              fontSize : "8px",
              width : 1300,
              height : 500,
              message : "Country"
            };
            return settings;
          } else if(scale >= 3 && scale < 4) {
            var settings = {
              minBubbleR : 4,
              maxBubbleR : 8,
              fontSize : "5px",
              width : 1300,
              height : 500,
              message : "Country"
            };
            return settings;
          } else if(scale >= 4 && scale < 7) {
            var settings = {
              minBubbleR : 4,
              maxBubbleR : 8,
              fontSize : "5px",
              width : 1300,
              height : 500,
              message : "Country"
            };
            return settings;
          }
        } else {
          if(scale >= 7 && scale < 11){
            var settings = {
              minBubbleR : 1,
              maxBubbleR : 2,
              fontSize : "1px",
              width : 1300,
              height : 500,
              message : "City"
            };
            return settings;
          } else {
            var settings = {
              minBubbleR : 0.5,
              maxBubbleR : 1.5,
              fontSize : "1px",
              width : 1300,
              height : 500,
              message : "City"
            };
            return settings;
          }
        }
      }

    };

});