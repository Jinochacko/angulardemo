'use strict';

angular.module('checkout', [])

.controller('checkoutController', function($scope,cartTotal,variables,login) {
	$scope.cart = JSON.parse(localStorage.getItem('cart_list'));
	// console.log(login.loggedIn);
	if(!login.loggedIn){
		location.href = variables.rootUrl+'login/';
		return;
	} 
	if($scope.cart == null || $scope.cart == undefined || $scope.cart == ''){
		alert("You have no items in your cart. Please add items to cart.");
		location.href = variables.rootUrl+'#/category/';
	}
	$scope.cartTotal = cartTotal.getCartTotal($scope.cart);
	$scope.placeOrder = function(){
		alert('Your purchase of amount Rs '+$scope.cartTotal+' has been completed successfully!');
		location.href = variables.rootUrl+'#/category/';
		cartTotal.emptyCart();
	};
});
