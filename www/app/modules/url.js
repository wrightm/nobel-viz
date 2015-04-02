define( function() {
    return {
	getFilteredParams: function () {
	    return filterURLParams(window.location.search.substring(1));
	},
	
	filterURLParams: function (query) {
	    var match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
		
		urlParams = {};
	    while (match = search.exec(query)) {
		urlParams[decode(match[1])] = decode(match[2]);
	    }
	    return urlParams;
	},

	generateURLQuery: function(currentFilters) {
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
    };
});
