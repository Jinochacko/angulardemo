'use strict';

angular.module('cart', [])

.controller('cartController', function($rootScope,$scope,$http,$routeParams,cartTotal) {
	$rootScope.tab = 'cart';
	$scope.cartList = [];
	$scope.cartTotal = cartTotal.getCartTotal(JSON.parse(localStorage.getItem('cart_list')));
	if(JSON.parse(localStorage.getItem('cart_list'))){
    	$scope.cartList = JSON.parse(localStorage.getItem('cart_list'));
    }
    $scope.showBtn = false;
    if($scope.cartList.length > 0){
    	$scope.showBtn = true;
    }
    $scope.updateItem = function(item){
    	item.total = parseInt(item.price.split('Rs ')[1]) * item.qty;
    	$scope.cartTotal = cartTotal.getCartTotal($scope.cartList);
    	localStorage.setItem("cart_list",JSON.stringify($scope.cartList));
    };
    $scope.emptyCart = function(){
    	cartTotal.emptyCart();
    	$scope.cartList = [];
    	// $rootScope.count = 0;
    	$scope.showBtn = false;
    }
});
