'use strict'
require.config({
  shim: {
    'jquery': {
      exports: '$'
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'underscore': {
	exports: '_'
    },
    'knockout': {
	exports: 'ko'
    },
    'md5': {
        exports: 'md5'
    },
    'minicolors': {
        deps: ['jquery'],
        exports: 'mc'
    },
    'indexeddb': {
	deps: ['jquery'],
	exports: 'indexeddb'
    },
    'indexdbWrapper': {
	deps: ['jquery','indexeddb'],
	exports: 'indexdbWrapper'
    }
  },  
      
  paths: {
    'mansikiPainter':        'js/module/mansikiPainterCore',
    'jquery':        'js/libs/jquery-2.0.2.min',
    'bootstrap':     'js/libs/bootstrap.min',
    'underscore':    'js/libs/underscore-min',
    'knockout':      'js/libs/knockout-2.3.0',
    'md5':      'js/libs/md5.min',
    'minicolors':      'js/libs/jquery.minicolors.min',
    'indexeddb':      'js/libs/jquery.indexeddb.min',
    'indexdbWrapper':      'js/libs/indexdbWrapper'
  },
  urlArgs: 'u=' +  (new Date()).getTime()
});
        
require([
  'mansikiPainter',     
  'jquery',
  'bootstrap',
  'underscore',
  'knockout',
  'md5',
  'minicolors',
  'indexeddb',
  'indexdbWrapper'
], function (App) {
  App.initialize();
});