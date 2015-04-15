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
        'nominatorSettings' : '/app/modules/settings/nominator-settings',
        'nominatorValidation' : '/app/modules/validation/nominator-validation',
        'nominatorCrossfilters' : '/app/modules/crossfilters/nominator-crossfilters',
        'nominatorCharts' : '/app/modules/charts/nominator-charts',
        'nominatorFormatter' : '/app/modules/formatters/nominator-formatter'
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
        'nominatorSettings': {
        deps: [],
        exports: 'nominatorSettings'
    },
        'nominatorValidation': {
        deps: [],
        exports: 'nominatorValidation'
    },
        'nominatorCrossfilters': {
        deps: [],
        exports: 'nominatorCrossfilters'
    },
        'nominatorCharts': {
        deps: [],
        exports: 'nominatorCharts'
    },
        'nominatorFormatter': {
        deps: [],
        exports: 'nominatorFormatter'
    }
  }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/main-nominators']);