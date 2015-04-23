define( function() {
    /**
     * Updates the URL filters based on the given urlString and the filters passed.
     *
     */
    function updateURL(urlString, filters) {
		for (var filter in filters) {
		    if (filters.hasOwnProperty(filter)) {
				if (filters[filter].length == 0) {
				    delete filters[filter];
				}
		    }
		}
		history.replaceState({}, "", urlString + "?" + generateURLQuery(filters));		    
    }

    /**
     * Registers listener with chart so that the URL is updated whenever the data is filtered.
     */
    function addURLFilteringToChart(urlBase, currentFilters, chart, queryParam) {
		chart.on("filtered", function(chart, filter) {
		    currentFilters[queryParam] = chart.filters();
		    updateURL(urlBase, currentFilters);
		});
    }

    function addURLDateRangeFiltering(urlBase,currentFilters, chart, queryParam){
    	chart.on("filtered", function(chart, filter) {
    	    var filters = [chart.filters()[0][0].toISOString(),chart.filters()[0][1].toISOString()];
		    currentFilters[queryParam] = filters;
		    updateURL(urlBase, currentFilters);
		});
    }
    

    /**
     * Generates the url query string from the filters passed. as currentFilters
     */
    function generateURLQuery(currentFilters) {
	    var queryString = ''
	    var first = true;
	    Object.keys(currentFilters).forEach(function(key) {
		if (first) {
		    first = false;
		} else {
		    queryString += '&';
		}
		queryString += key + '=' + currentFilters[key];
	    });
	    
	    return queryString;
	}

    /**
     * Fetches the parameter string from the URL.
     */
    function getParams() {
		return filterParams(window.location.search.substring(1));
    }

    /**
     * Filters the parameter string and returns a kay-value store of filter params.
     */
    function filterParams (query) {
		var match,
		    pl     = /\+/g,  // Regex for replacing addition symbol with a space
		    search = /([^&=]+)=?([^&]*)/g,
		    decode = function (s) { 
		    	return decodeURIComponent(s.replace(pl, " ")); 
		    },
		    
		    urlParams = {};
		
		while (match = search.exec(query)) {
		    urlParams[decode(match[1])] = decode(match[2]).split(",");
		}
		
		return urlParams;
	}
	    
	return {	
		getFilteredParams: getParams,
		
		filterURLParams: filterParams,

		updateURL: updateURL,
		
		generateURLQuery: generateURLQuery,
		
		addURLFilteringToChart: addURLFilteringToChart,

		addURLDateRangeFiltering : addURLDateRangeFiltering
    };
});
