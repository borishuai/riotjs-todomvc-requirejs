requirejs.config({
  baseUrl: 'js',
  paths: {
    jquery: 'lib/jquery/dist/jquery',
    riotjs: 'lib/riotjs/riot'
  },
  shim: {
    "todomvc-common": {
    },
    riotjs: {
      exports: 'riot'
    }
  }
});

requirejs(['riotjs', 'presenter/presenter'], function (riot) {
  //when init page, the riot will trigger event after DOMContentLoaded, 
  //however, the riotjs is loaded after DOMContentLoaded if imported by requirejs
  //so we use tricky way to trigger pop event
  riot.route(location.hash);
});