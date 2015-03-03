
define(function () {
  return {
    setDataForGroup : function(projection,data,laureate,groups,groupKey,latLonKey){
      var group = laureate[groupKey]
      groups.push(group);
      if(!(group in data)){
        var coordinates = projection([laureate[latLonKey][1],laureate[latLonKey][0]]);
        data[group] = {
          "lon": coordinates[0], 
          "lat" : coordinates[1],
          groupKey : group,
          "nLaureates" : 1
        }
      } else {
        data[group].nLaureates += 1;
      }
    }
  };

});