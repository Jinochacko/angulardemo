'use strict';


angular.module('shoppingCart', [
    'ngRoute',
    'cart',
    'checkout',
    'category',
    'subcategory'
]).
config(['$routeProvider', function($routeProvider) {
    
    $routeProvider
    	.when('/cart/', {
		    templateUrl: 'html/cart.html',
		    controller: 'cartController'
		})
		.when('/checkout', {
		    templateUrl: 'html/checkout.html',
		    controller: 'checkoutController'
	 	})
		.when('/category', {
		    templateUrl: 'html/category.html',
		    controller: 'categoryController'
	 	})
		.when('/category/:category', {
		    templateUrl: 'html/subcategory.html',
		    controller: 'subcategoryController'
	 	})
		.when('/category/:category/:id', {
		    templateUrl: 'html/product.html',
		    controller: 'productController'
	 	})
		.when('/login', {
		    templateUrl: 'html/login.html',
		    controller: 'loginController'
	 	})
    	.otherwise({
	    	templateUrl: 'html/main.html',
		    controller: 'mainController',
	        redirectTo: '/'
    	});
}])
.directive('header', function () {
    return {
        restrict: 'E', 
        replace: true,
        // scope: {user: '='}, 
        templateUrl: "html/header.html",
        controller: function ($rootScope,$scope,login) {
        	$scope.cart = [];
        	$scope.tab = $rootScope.tab;
        	$scope.isLoggedIn = login.loggedIn;
        	if(JSON.parse(localStorage.getItem('cart_list'))){
	        	$scope.cart = JSON.parse(localStorage.getItem('cart_list'));
	        }
        	$rootScope.count = $scope.cart.length;
        	$scope.count = $rootScope.count;
        	$scope.logout = function(){
        		login.logout();
        	};
        }
    }
})
.directive('footer', function () {
    return {
        restrict: 'E', 
        replace: true,
        scope: {user: '='}, 
        templateUrl: "html/footer.html",
        controller: function ($scope) {
            
        }
    }
})
.constant('variables',{
	rootUrl: 'https://jinochacko.github.io/angulardemo/#/'
})
.service('login',function($rootScope,variables){
	this.loggedIn = false;
	if(localStorage.getItem('is_logged_in')){
		this.loggedIn = true;
	}
	var login = function(user,pass){
		var u_email = 'testuser@gmail.com';
		var u_pass = 'test@123';
		if((user == u_email) && (pass == u_pass)){
			localStorage.setItem('is_logged_in',true);
			return true;
		} else {
			return false;
		}
	};
	this.submit = function(user,pass){
		return login(user,pass);
	};
	this.logout = function(){
		localStorage.removeItem('is_logged_in');
		location.href = variables.rootUrl;
	}
	return this;
})
.service('cartTotal',function($rootScope){
	this.getCartTotal = function(cart){
		// var cart = JSON.parse(localStorage.getItem('cart_list'));
		var total = 0;
		if(cart && cart.length != 0){
			var cart_length = cart.length;
			for (var i = 0; i < cart_length; i++) {
				total = total + parseInt(cart[i].total);
			}
		}
		return total;
	}
	this.emptyCart = function(){
		localStorage.removeItem('cart_list');
		$rootScope.count = 0;
	}
	return this;
})
.directive('emailValid', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, emailValidate) {
            function emailValidation(value) {
            	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    			if (re.test(value)) {
                    emailValidate.$setValidity('emailPattern', true);
                } else {
                    emailValidate.$setValidity('emailPattern', false);
                }
                return value;
            }
            emailValidate.$parsers.push(emailValidation);
        }
    };
})
.controller('mainController',function($scope,$http,$rootScope){
	$rootScope.tab = 'home';
	$http.get("json/categories.json")
	  .then(function(response) {
	      $scope.category = response.data;
	  });;
})
.controller('loginController',function($scope,$rootScope,login,variables){
	$rootScope.tab = 'login';
	$scope.username = '';
	$scope.pass = '';
	$scope.invalidLogin = false;
	if(login.loggedIn){
		location.href = variables.rootUrl;
		return;
	}
	$scope.one = function(user){
		alert($scope.username);
	}
	$scope.login = function(){
		$scope.loginSubmit = login.submit($scope.username,$scope.pass);
		if($scope.loginSubmit){
			$scope.invalidLogin = false;
			location.href = variables.rootUrl;
		} else {
			$scope.invalidLogin = true;
		}
	};
})
.controller('productController',function($rootScope,$scope,$http,$routeParams,$timeout){
	$rootScope.tab = 'category';
	var product_title = $routeParams.id;
	$scope.selection = {};
	$scope.qty = 1;
	$scope.addedToCart = false;
	$http.get("json/"+$routeParams.category+".json")
	  .then(function(response) {
	      $scope.list = response.data;
	      $scope.product = $.grep($scope.list.items, function(n,i){
	      	var title = n.title;
	      	title = title.toLowerCase();
	      	return title===product_title;
	      })[0];
	      console.log($scope.product);
	  });
	  $scope.update = function(size){
	  	$scope.psize = size;
	  };
	  $scope.addToCart = function(product){
	  	if($scope.psize){
	  		var cart = [],
	  			p_item = {};

	  		p_item.size = $scope.psize;
	  		p_item.title = product.title;
	  		p_item.qty = $scope.qty;
	  		p_item.total = parseInt(product.price.split('Rs ')[1]) * p_item.qty;
	  		p_item.url = product.url;
	  		p_item.img = product.img;
	  		p_item.price = product.price;
	  		if(JSON.parse(localStorage.getItem("cart_list"))){
	  			cart = JSON.parse(localStorage.getItem("cart_list"));
	  		}
	  		cart.push(p_item);
	  		localStorage.setItem("cart_list",JSON.stringify(cart));
	  		$rootScope.count = cart.length;
	  		$scope.addedToCart = true;
	  		$timeout(function(){
	  			$scope.addedToCart = false;
	  		},3000);
	  		console.log(cart);
	  	} else {
	  		alert('Please select size to proceed');
	  	}
	  };
});
