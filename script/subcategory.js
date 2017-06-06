'use strict';

angular.module('subcategory', [])

.controller('subcategoryController', function($scope,$http,$routeParams,$rootScope) {
	$rootScope.tab = 'category';
    $http.get("json/"+$routeParams.category+".json")
	  .then(function(response) {
	  	$scope.bannerImage = response.data.banner;
      	$scope.list = response.data;
	  });
});
