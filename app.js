(function() {
    'use strict';

    angular.module('ShoppingListApp', [])

    .service('$shoppingService', ['$http', '$q', function($http, $q) {
        var itemTypes = ['Bakery', 'Beverage', 'Dairy', 'Meat', 'Produce', 'Other'];
        var items = [];

        // mock REST endpoint for listing items
        var url = 'http://demo3374525.mockable.io/shopping-list';
        var listItems = function() {
					return $http({method: 'GET', url: url})
						.success(function(data) {
							items = data;
							return items;
						}).
						error(function(data) {
							items = data || [];
						});

        };

        var addItem = function(item) {
					items.push(item);
        };

        var removeItem = function(item) {
					var idx = items.indexOf(item);
					items.splice(idx, 1);
        };

        return {
            listItems: listItems,
            addItem: addItem,
            removeItem: removeItem,
            itemTypes: itemTypes
        };
    }])

    .controller('ShoppingListCtrl', ['$scope', '$shoppingService', function($scope, $shoppingService) {
				$scope.currentPage = 0;
				$scope.pageSize = 10;

				// call the shopping service return a promise.
				$shoppingService.listItems()
					.then(function(data){
						$scope.items = data.data;
						// wait for the items to be populated before # of pages is calculated.
						$scope.numberOfPages=function(){
							return Math.ceil($scope.items.length/$scope.pageSize);
						};
				});

				$scope.types = $shoppingService.itemTypes;

				$scope.add = function(){
					var item = {name:$scope.newItem, type:$scope.newType};
					$shoppingService.addItem(item);
					$scope.newItem = '';
					$scope.newType = '';
				};

				$scope.remove = function(item){
					$shoppingService.removeItem(item.item);
				};
    }])

		.filter('startFrom', function() {
			return function(input, start) {
				start = +start; //parse to int
				// only show from the start
				return input ? input.slice(start) : [];
			}
		});
})();
