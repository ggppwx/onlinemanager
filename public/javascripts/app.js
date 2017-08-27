var app = angular.module('app', ['ui.directives', 'ui.filters', 'googlechart']);

app.value('googleChartApiConfig', {
            version: '1',
            optionalSettings: {
                packages: ['corechart', 'calendar',
                'timeline'],
                language: 'en'
            }
});

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

    var stop;
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



app.controller('ButtonCtrl', ['$scope','$http','$interval', function($scope, $http, $interval){

    // retrieve all button
    $http.get('/button/refresh').then(
        function successCallback(resp){
            console.log(resp.data);
            $scope.events = resp.data;
        },
        function errorCallback(resp){
            console.log('error');

    });

    $scope.addButton = function() {
        console.log($scope.input);
        $http.post('/button/add', {event : $scope.input}).then(
            function successCallback(resp){
                console.log(resp.data);
                $scope.events = resp.data;

            },
            function errorCallback(resp){
                console.log('error');
            }
        );

    };



    $scope.pushButton = function(event_id) {
        $scope.afterPush = "disabled";
        $interval.cancel(stop);
        stop = $interval(function() {
          $scope.afterPush = "";
        }, 10000);

        $http.get('/button/push/' + event_id).then(
            function successCallback(resp){
                console.log(resp.data);
            },
            function errorCallback(resp){
                console.log('error');
            }
        );





    };


    $scope.removeButton = function(event_id) {
        $http.delete('/button/remove/' + event_id).then(
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

/*
app.controller('StatisticsCtrl', ['$scope','$http', function($scope, $http){
    // Initialize random data for the demo
    var now = moment().endOf('day').toDate();
    var year_ago = moment().startOf('day').subtract(1, 'year').toDate();


    var data = [{
      "date": new Date("2016-08-08"),
      "total": 5,
      "details": [{
        "name": "Project 1",
        "date": new Date("2016-08-08"),
        "value": 3
      }, {
        "name": "Project 2",
        "date": new Date("2016-08-08"),
        "value": 1
      },
      {
        "name": "Project N",
        "date": new Date("2016-08-08"),
        "value": 1
      }]
    },
    {
      "date": new Date(),
      "total": 5,
      "details": [{
        "name": "Project 1",
        "date": new Date(),
        "value": 3
      }, {
        "name": "Project 2",
        "date": new Date(),
        "value": 1
      },
      {
        "name": "Project N",
        "date": new Date(),
        "value": 1
      }]
    }

    ];
    $scope.example_data = data;



    // Set custom color for the calendar heatmap
    $scope.color = '#cd2327';

    // Set overview type (choices are year, month and day)
    $scope.overview = 'year';

    // Handler function
    $scope.print = function (val) {
      console.log(val);
    };


}]);
*/


app.controller('GenericChartCtrl', ['$scope','$http', function($scope, $http){


    console.log('GenericChartCtrl');
    var base = this;
    base.cache = [];

    //Methods
    $scope.getDailyView = getDailyView;
    function getDailyView(data, index) {

        console.log(data);
        console.log(index);

        var dailyChartObject = {
            type : "Timeline",
            data : {
                cols: [
                    { type: 'string', id: 'Event' }
                    , { type: 'date', id: 'Start' }
                    , { type: 'date', id: 'End' }
                ]
                , rows: [
                    {
                        "c": [
                            { "v": '24 hour'},
                            { "v": new Date(0,0,0,0,0,0)},
                            { "v": new Date(0,0,0,23,59,59)}
                        ]
                    }

                ]
            },
            options : {
                tooltip: {isHtml: true},
            }

        };


        if (data && index >= 0 && base.cache[index]) {
            console.log(base.cache[index]);


            var event_name = base.cache[index].event;
            var record_map = base.cache[index].record_map;
            var date_key = toLocalDate(data.date).toDateString();
            console.log(event_name);
            console.log(date_key);


            if (!(date_key in record_map)) {
                console.log(date_key + " not in record_map");
                return;
            }


            console.log(record_map[date_key].details);

            for (var i = 0; i < record_map[date_key].details.length; i++) {
                var detail = record_map[date_key].details[i];
                console.log(detail);
                var timestamp = new Date(Date.parse(detail.timestamp));
                var new_timestamp = moment(timestamp).add(10, 'm').toDate();


                console.log(timestamp);
                 console.log(new_timestamp);
                dailyChartObject.data.rows.push({
                    "c": [
                        { "v": event_name},
                        { "v": new Date(0,0,0,timestamp.getHours(),timestamp.getMinutes(),0)},
                        { "v": new Date(0,0,0,new_timestamp.getHours(),new_timestamp.getMinutes(),0)}
                    ]
                });
            }

            console.log(dailyChartObject);
            $scope.dailyChartObject = dailyChartObject;


        }


    }




    // construtor
    $http.get('/statistics/all').then(
        function successCallback(resp){
            console.log(resp.data);

            base.cache  = resp.data;

            // build charts
            var charts = [];
            for (var i = 0; i < resp.data.length; i++) {
                var data = resp.data[i];

                var reportCalendarChart = {
                    type: 'Calendar',
                    data: {
                        cols: [
                            { type: 'date', id: 'date' },
                            { type: 'number', id: 'amount' }
                        ],
                        rows: []
                    },
                    options: {
                        title: data.event,
                        width: 900,
                        colorAxis : {
                            minValue : 0
                        }
                    }
                };

                for(var d in data.record_map){
                    var count = data.record_map[d].count
                    reportCalendarChart.data.rows.push({
                        c: [
                            { v: new Date(d) },
                            { v: count}
                        ]
                    });
                }

                charts.push(reportCalendarChart);
            }
            $scope.charts = charts;
        },
        function errorCallback(resp){
            console.log('error');

    });








}]);


app.controller('SmartTableCtrl', ['$scope','$http', function($scope, $http){
    console.log('SmartTableCtrl');
    $scope.model = {
        tables : [
            {
                id : 'table1',
                name : "gym",
                content : {
                    headers : [
                        "name",
                        "set 1",
                        "set 2",
                        "set 3",
                        "set 4"
                    ],
                    rows : [
                        {
                            id : 1,
                            cols : [
                                "哑铃卧推",
                                "12-25lbs",
                                "12-35lbs",
                                "12-35lbs",
                                "12-30lbs"
                            ]
                        },
                        {
                            id : 2,
                            cols : [
                                "俯卧撑",
                                12,
                                12,
                                10,
                                10
                            ]
                        },
                        {
                            id : 3,
                            cols : [
                                "坐姿推胸",
                                12,
                                12,
                                12,
                                10
                            ]
                        }
                    ]
                }

            }

        ] 
    };

    $scope.getTemplate = function(row) {

    };


    $scope.edit = function(row) {

    };

    $scope.save = function(row) {

        
    };

}]);


function toLocalDate(dateStr) {
    if (dateStr == '') return null;
    var tmp_date = new Date(dateStr);
    return new Date(tmp_date.getUTCFullYear(),
                    tmp_date.getUTCMonth(),
                    tmp_date.getUTCDate());
}
