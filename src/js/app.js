// # Application flApp
// _** Potato test app consuming flickr api service. **_
var flApp = angular.module('flApp', ['ui.router', 'angular-loading-bar']);

// Start the app when DOM ready...
angular.element(document).ready(function () {
    angular.bootstrap(document, ['flApp']);
});

// ## Configuration
flApp.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        // Not found route redirection.
        $urlRouterProvider.otherwise('/');

        // ### Home route
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'templates/feed.html',
            resolve: {
                Flickr: ['$http', '$cacheFactory',
                    function ($http, $cacheFactory) {
                        // Init the app cache.
                        var cache = $cacheFactory.get('flApp') || $cacheFactory('flApp');

                        // Resolve either with data from the cache
                        // or with data from the API.
                        return cache.get('last_rsp') || $http.jsonp('//api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&jsoncallback=JSON_CALLBACK').then(
                            function (data) {
                                cache.put('last_rsp', data);
                                cache.put('tags', 'potato');
                                cache.put('mode', 'ALL');
                                return data;
                            }
                        );
                }]
            },
            // #### The controller
            controller: ['$scope', '$state', '$http', '$cacheFactory', 'cfpLoadingBar', 'Flickr',
                function ($scope, $state, $http, $cacheFactory, cfpLoadingBar, Flickr) {
                    // We will make use of the cache created earlier.
                    var cache = $cacheFactory.get('flApp');

                    // Put GUI related vars on `$scope` and monitor
                    // for changes when needed.
                    $scope.filterTags = cache.get('tags');
                    $scope.$watch('filterTags', function (nV, oV) {
                        cache.put('tags', nV);
                    });
                    $scope.filterModes = ['ALL', 'ANY'];
                    $scope.filterMode = cache.get('mode');
                    $scope.$watch('filterMode', function (nV, oV) {
                        cache.put('mode', nV);
                    });
                    $scope.Flickr = Flickr.data;

                    // Invoked when the user clicks the `Filter` button.
                    // Updates the `$scope.Flickr` variable when new data was received
                    // from the Flick API.
                    $scope.filterFeed = function () {
                        // Init and show the loader bar.
                        cfpLoadingBar.start();
                        // Make the request.
                        $http
                            .jsonp('//api.flickr.com/services/feeds/photos_public.gne?tags=' + encodeURIComponent($scope.filterTags) + '&tagmode=' + $scope.filterMode + '&format=json&jsoncallback=JSON_CALLBACK')
                            .then(
                                function (data) {
                                    // Put on `$scope`.
                                    $scope.Flickr = data.data;
                                    // Put in cache.
                                    cache.put('last_rsp', data);
                                    // Hide the loader bar.
                                    cfpLoadingBar.complete();
                                }
                        )
                    };

                    // Tags input enter keypress handler.
                    // Just a shortcut to the `filterFeed` function.
                    $scope.updateOnEnter = function (e) {
                        if (e.which == 13)
                            $scope.filterFeed();
                    };

                    // Click on tag handler
                    // to query the API for it and update the results.
                    $scope.queryTag = function (tag) {
                        $scope.filterTags = tag;
                        $scope.filterFeed();
                    };

                    // Helper to check if some tag is present
                    // in the `filterTags` input.
                    $scope.isMatchedTag = function (tag) {
                        return $scope.filterTags.split(',').map(function (v) {
                            return v.trim();
                        }).indexOf(tag) != -1;
                    };
            }]
        });

        // ### Detail route
        $stateProvider.state('detail', {
            url: '/detail/:item',
            templateUrl: 'templates/detail.html',
            // #### The controler
            controller: ['$scope', '$stateParams',
                function ($scope, $stateParams) {

                    $scope.item = $stateParams.item;

                    // The `description` field in the Flickr API response is a mix of text and HTML
                    // so we need to extract only the text and use it for the detail view.
                    $scope.parseDesc = function (desc) {
                        return angular.element('<div>' + desc + '</div>').text();
                    };
            }]
        });
    }]);
