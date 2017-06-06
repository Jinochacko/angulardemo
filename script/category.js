'use strict';

angular.module('category', [])

.controller('categoryController', function($scope,$http,$routeParams,$rootScope) {
	$rootScope.tab = 'category';
	$http.get("json/categories.json")
	  .then(function(response) {
	      $scope.category = response.data;
	  });;
});
