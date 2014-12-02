'use strict'
require.config({
  shim: {
    'jquery': {
      exports: '$'
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'md5': {
        exports: 'md5'
    },
    'favico': {
        exports: 'favico'
    },
    'underscore': {
      exports: '_'
    },
    'knockout': {
      exports: 'ko'
    },
    'minicolors': {
        deps: ['jquery'],
        exports: 'mc'
      }
  },  
      
  paths: {
    'mansiki':        'js/mansikiCore',
    'jquery':        'js/libs/jquery',
    'bootstrap':     'js/libs/bootstrap.min',
    'underscore':    'js/libs/underscore-min',
    'knockout':      'js/libs/knockout-2.3.0',
    'md5':      'js/libs/md5.min',
    'minicolors':      'js/libs/jquery.minicolors.min'
  },
  urlArgs: 'cmchat=' +  (new Date()).getTime()
});
        
require([
  'cmchat',     
  'jquery',
  'bootstrap',
  'underscore',
  'knockout',
  'md5',
  'minicolors'
], function (App) {
  App.initialize();
});