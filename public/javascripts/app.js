var app = angular.module('app', []);


app.controller('MainCtrl', ['$scope','$http', function($scope, $http){

	
	$http.get('/random/event').then(
		function successCallback(resp){
			console.log(resp.data);
			$scope.events = resp.data;
			$scope.output = 'welcome';
		}, 
		function errorCallback(resp){
			console.log('error');

		});
	
	// $scope.events = ['test', 'test1'];

	$scope.randomEvent = function(){
		$http.get('/random/event/random').then(
				function success(resp){
					console.log(resp.data);
					if ( resp.data.event ) {
						$scope.output = resp.data.event;
					} else {
						$scope.output = "None";
					}

				},
				function error(resp){
					console.log("error");
				}
			);
	};



	$scope.addEvent = function(){
		// send a request to 
		console.log($scope.input);
		
		$http.post('/random/event/add', {event : $scope.input}).then(
			function successCallback(resp){
				console.log(resp.data);
				$scope.events = resp.data;
			}, 
			function errorCallback(resp){
				console.log('error');
			}
		);

		$scope.input = '';


	};


	$scope.deleteEvent = function(id){
		$http.delete('/random/event/' + id).then(
			function successCallback(resp){
				console.log(resp.data);
				$scope.events = resp.data;
			}, 
			function errorCallback(resp){
				console.log('error');
			}
		);
	};



}]);