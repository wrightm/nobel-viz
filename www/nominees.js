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
        'jquery' : '/lib/jquery',
        'globalSettings' : '/app/modules/settings/global-settings',
        'laureateSettings' : '/app/modules/settings/laureate-settings',
        'laureateValidation' : '/app/modules/validation/laureate-validation'
    },
  	shim: {
    	'crossfilter': {
      	deps: [],
      	exports: 'crossfilter'
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
    }
  }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/main-nominees']);