// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var meanstack=angular.module('meanstack', ['ionic'])

meanstack.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


//var serverURL = "http://localhost:8080";
var serverURL = "http://10.149.247.113:8080";
//var serverURL = "http://192.168.0.2:8080";
meanstack.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    $stateProvider
    .state('viewbooks',{
        url:'/viewbooks',
        templateUrl:'viewbooks'
        //controller:'viewcntrl'
    }).state('addnewitem',{
        url:'/addnewitem',
        templateUrl:'additem',
        controller:'viewcntrl'
    }).state('editrow',{
        url:'/editrow',
        templateUrl:'editrow',
        controller:'editcntrl'
    }).state('nav',{
        url:'/nav',
        templateUrl:'template/navigation.html'
        
    });
    $urlRouterProvider.otherwise('/');
}])

var maincntrl=meanstack.controller('maincntrl',['$scope','$rootScope','$http','$location','meanserv',function($scope,$rootScope,$http,$location,meanserv){
    $scope.selected={};
    $rootScope.tracker={};
    $scope.formsubmit=function(){
        console.log('alert');
                $http({
                    method:'GET',
                    url:serverURL+'/viewbooks'    
                }).then (function(response){
                    $rootScope.tracker=response.data;
                    console.log('records from http::'+$rootScope.tracker.length);
                })
            console.log('returned from http::'+$scope.retjson);
            $location.path('/viewbooks');
    }
    $scope.editrow=function(item){
        console.log('checkbox selected::'+item.SrNo);
        $scope.selected=angular.copy(item);
        console.log('setting location editrow::');
        $scope.editfields=true;
        //$location.path('/editrow');
    }
    $scope.save=function(item){
        console.log('in edit function write http put here::'+item.SrNo);
        $http({
            method:'PUT',
            url:serverURL+'/updatetracker/:'+item.SrNo,
            data:item
        }).then (function(response){
            console.log('Updated succcessfully::'+response.data);
            $scope.item={}; 
        })
        $scope.editfields=false;
        meanserv.getbooks();
    }
    $scope.cancel=function(){
        console.log('in cancel edit function');
        $scope.editfields=false;
    }
    $scope.gettemplate=function(i){
        if(i.SrNo==$scope.selected.SrNo){
            return 'editrow';
        }else{
            return 'display';
        }
    }
    $scope.addbooks=function(){
        $location.path('/addnewitem');
        console.log('total records::'+$rootScope.tracker.length);
    }
    $scope.nvg=function(){
        $location.path('/nav');
        console.log('In Nav');
    }
    $scope.home=function(){
        $location.path('/viewbooks');
    }
    
}]);
meanstack.controller('editcntrl',['$http','$location',function($scope,$http,$location){
    console.log('in edit cntrl controller');
    $scope.save=function(item){
        console.log('in edit function write http put here::'+item.SrNo);
    }
    $scope.cancel=function(){
        console.log('in cancel edit function');
    }
}]);

meanstack.controller('viewcntrl',['$scope','$http','$location','$rootScope',function($scope,$http,$location,$rootScope){
    console.log('in addition part length::'+$rootScope.tracker.length);
    $scope.saveitem=function(newitem){
        $scope.newitem=newitem;
        console.log('new item::'+newitem);
        //var jsonitem=JSON.parse($scope.newitem);
        console.log('Sending JSON to post:'+JSON.stringify(newitem));      
        $scope.newitem.SrNo=$rootScope.tracker.length+1;
        console.log('Sending sr no to backend:'+$scope.newitem.SrNo);
        $http({
            method:'POST',
            url:serverURL+'/addbooks',
            data:newitem
        }).then (function(response){
            console.log('books added successfully');
        })
        $scope.newitem='';
    }
    $scope.update=function(index){
        console.log('indev value::'+$scope.chkbox);
        console.log('index value::'+index);
    }
}]);
meanstack.filter('status',function(){
    return function(input,tracker,useroption){
        var rettracker=[];
        if(typeof(useroption)=='undefined'){
            useroption='All';
        }
        console.log('useroption char o::'+useroption);
        //var ch=char('o');
        var chkarr=useroption.toString();
        console.log('chkarr.value::'+chkarr);
        console.log('chkarr.indexOf::'+chkarr.indexOf(","));
        console.log('useroption.indexOf::'+useroption.indexOf(","));  
        if(chkarr.indexOf(",")==-1){
            if(useroption=='closed'){
                angular.forEach(tracker,function(value){
                    if(value.Status=='Closed'){
                        rettracker.push(value);
                    }
                })
            }if(useroption=='open'){
                    angular.forEach(tracker,function(value){
                    if(value.Status=='Open'){
                        rettracker.push(value);
                    }
                })  
            }if(useroption=='fixed'){
                    angular.forEach(tracker,function(value){
                    if(value.Status=='Fixed'){
                        rettracker.push(value);
                    }
                })  
            }
            if(useroption=='All'){
                rettracker=tracker;
            }
            return rettracker;
        }else{
            //console.log('multiselect option used::value is::'+useroption);
            console.log('multiselect option splitted::'+useroption.toString().split(","));
            var newarr=useroption.toString().split(",");
            console.log("length of new array::"+newarr.length);
            newarr.forEach(function(value,index){
                if(value=="open"){
                   console.log("selected open");
                    angular.forEach(tracker,function(value){
                    if(value.Status=='Open'){
                        rettracker.push(value);
                    }
                })
                }
                if(value=="fixed"){
                   console.log("selected Fixed");
                    angular.forEach(tracker,function(value){
                    if(value.Status=='Fixed'){
                        rettracker.push(value);
                    }
                })
                }
                  if(value=="closed"){
                   console.log("selected closed");
                    angular.forEach(tracker,function(value){
                    if(value.Status=='Closed'){
                        rettracker.push(value);
                    }
                })
                }
            })
            console.log('returning from else::'+rettracker.length);
            return rettracker;
        }
    }
    })



meanstack.service('meanserv',['$rootScope','$http',function($rootScope,$http){
    console.log('in meanserv');
    this.getbooks=function(){
        console.log('alert from service getting books');
                $http({
                    method:'GET',
                    url:serverURL+'/viewbooks'    
                }).then (function(response){
                    $rootScope.tracker=response.data;
                    console.log('records from http::'+$rootScope.tracker.length);
                })
    }
}])