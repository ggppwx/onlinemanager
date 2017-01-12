var app = angular.module('app', ['ui.directives', 'ui.filters']);

// adding a filter 
app.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {

      	  if (keyname === ''){
      	  	var key = item;
      	  } else {
          	var key = item[keyname];
      	  }	
          if(keys.indexOf(key) === -1) {
            keys.push(key);
            output.push(item);
          }
      });

      return output;
   };
});


function getTagsFromEvents(events){
	var tags = [];
	for (var i = 0; i < events.length; ++i) {
		tags = tags.concat(events[i].tags);
	}
	return tags;
}


app.controller('MainCtrl', ['$scope','$http', function($scope, $http){
	
	$http.get('/random/event').then(
		function successCallback(resp){
			console.log(resp.data);
			$scope.events = resp.data;
			$scope.output = 'welcome';
			$scope.currTag = 'All';
			$scope.tags = getTagsFromEvents(resp.data);
		}, 
		function errorCallback(resp){
			console.log('error');

		});
	
	// $scope.events = ['test', 'test1'];

	$scope.randomEvent = function(){
		$http.post('/random/event/random', { tag : $scope.currTag }).then(
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
				$scope.tags = getTagsFromEvents(resp.data);
				$scope.currTag = 'All';
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
				$scope.tags = getTagsFromEvents(resp.data);
				$scope.currTag = 'All';
			}, 
			function errorCallback(resp){
				console.log('error');
			}
		);
	};


	$scope.filterEvent = function(){
		console.log('select changed');
		console.log($scope.currTag);

		for (var i = 0; i < $scope.events.length; ++i){
			if ($scope.currTag == "All") {
				$scope.events[i].hide = false;
			} else if ($scope.events[i].tags.indexOf($scope.currTag) == -1){
				$scope.events[i].hide = true;
			}else {
				$scope.events[i].hide = false;
			}
		}
	}; 



}]);