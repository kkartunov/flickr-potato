var flApp=angular.module("flApp",["ui.router","angular-loading-bar"]);angular.element(document).ready(function(){angular.bootstrap(document,["flApp"])}),flApp.config(["$stateProvider","$urlRouterProvider",function(t,e){e.otherwise("/"),t.state("home",{url:"/",templateUrl:"templates/feed.html",resolve:{Flickr:["$http","$cacheFactory",function(t,e){var a=e.get("flApp")||e("flApp");return a.get("last_rsp")||t.jsonp("//api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&jsoncallback=JSON_CALLBACK").then(function(t){return a.put("last_rsp",t),a.put("tags","potato"),a.put("mode","ALL"),t})}]},controller:["$scope","$state","$http","$cacheFactory","cfpLoadingBar","Flickr",function(t,e,a,r,o,l){var n=r.get("flApp");t.filterTags=n.get("tags"),t.$watch("filterTags",function(t){n.put("tags",t)}),t.filterModes=["ALL","ANY"],t.filterMode=n.get("mode"),t.$watch("filterMode",function(t){n.put("mode",t)}),t.Flickr=l.data,t.filterFeed=function(){o.start(),a.jsonp("//api.flickr.com/services/feeds/photos_public.gne?tags="+encodeURIComponent(t.filterTags)+"&tagmode="+t.filterMode+"&format=json&jsoncallback=JSON_CALLBACK").then(function(e){t.Flickr=e.data,n.put("last_rsp",e),o.complete()})},t.updateOnEnter=function(e){13==e.which&&t.filterFeed()},t.queryTag=function(e){t.filterTags=e,t.filterFeed()},t.isMatchedTag=function(e){return-1!=t.filterTags.split(",").map(function(t){return t.trim()}).indexOf(e)}}]}),t.state("detail",{url:"/detail/:item",templateUrl:"templates/detail.html",controller:["$scope","$stateParams",function(t,e){t.item=e.item,t.parseDesc=function(t){return angular.element("<div>"+t+"</div>").text()}}]})}]);