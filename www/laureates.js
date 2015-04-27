// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app',
        'crossfilter': '/bower_components/crossfilter/crossfilter',
        'd3': '/bower_components/d3/d3',
        'colorbrewer': '/bower_components/colorbrewer/colorbrewer',
        'dc': '/lib/dc',
        'topojson': '/lib/topojson',
        'bubbleOverlay': '/app/modules/bubbles/bubble-overlay',
        'bubbleOverlayHelpers': '/app/modules/bubbles/helpers',
        'print': '/lib/print',
	    'url': '/app/modules/urlfilter/url',
        'jquery' : '/lib/jquery',
        'globalSettings' : '/app/modules/settings/global-settings',
        'laureateSettings' : '/app/modules/settings/laureate-settings',
        'laureateValidation' : '/app/modules/validation/laureate-validation',
        'laureatesCrossfilters' : '/app/modules/crossfilters/laureates-crossfilters',
        'laureatesCharts' : '/app/modules/charts/laureates-charts',
        'laureateFormatter' : '/app/modules/formatters/laureate-formatter',
        'bootstrap' :  '/bower_components/bootstrap/dist/js/bootstrap',
        'socialShareUrl' : '/app/modules/social/social-share-url'
    },
    shim: {
    	'crossfilter': {
      	    deps: [],
      	    exports: 'crossfilter'
    	},
    	'url': {
    	    deps: [],
    	    exports: 'url'
    	},
          	'd3': {
        	    deps: [],
        	    exports: 'd3'
    	},
        	'colorbrewer': {
        	    deps: [],
        	    exports: 'colorbrewer'
    	},
        	'dc': {
        	    deps: [],
        	    exports: 'dc'
    	},
        	'topojson': {
        	    deps: [],
        	    exports: 'topojson'
    	},
        	'bubbleOverlay': {
        	    deps: [],
        	    exports: 'bubbleOverlay'
    	},
        	'print': {
        	    deps: [],
        	    exports: 'print'
    	},
            'jquery': {
    	    deps: [],
    	    exports: 'jquery'
    	},
            'globalSettings': {
    	    deps: [],
    	    exports: 'globalSettings'
    	},
            'laureateSettings': {
                deps: [],
                exports: 'laureateSettings'
    	},
            'laureateValidation': {
                deps: [],
                exports: 'laureateValidation'
    	},
            'laureatesCrossfilters': {
                deps: [],
                exports: 'laureatesCrossfilters'
    	},
            'laureatesCharts': {
                deps: [],
                exports: 'laureatesCharts'
    	},
            'laureateFormatter': {
                deps: [],
                exports: 'laureateFormatter'
        },
            'utilHelpers': {
    	    deps: [],
    	    exports: 'utilHelpers'
    	},
            'bootstrap': {
                deps: ['jquery'],
                exports: 'bootstrap'
        },
            'socialShareUrl' : {
            deps: [],
            exports: 'socialShareUrl'
        }
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/main-laureates']);
