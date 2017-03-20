angular.module('starter.controllers', [])
.controller('dashCtrl', function($scope,$state) {
    $scope.goState = function(state_name){
        $state.go(state_name);
    }
})
.controller('deviceCtrl', function($scope,Devices,$state) {
    $scope.goState = function(state_name){
        $state.go(state_name);
    }
    $scope.devices = Devices.all();
    $scope.remove = function(device) {
        Devices.remove(device);
    };
})
.controller('deviceDetailCtrl', function($scope, $stateParams, Devices, $state) {
    $scope.goState = function(state_name){
        $state.go(state_name);
    }
    $scope.device = Devices.get($stateParams.deviceId);

    $scope.showTab = 'banner';
})
.controller('contentCtrl', function($scope,Chats) {
    $scope.goState = function(state_name){
        $state.go(state_name);
    }
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})
.controller('contentDetailCtrl', function($scope, $stateParams, Chats, $state) {
    $scope.goState = function(state_name){
        $state.go(state_name);
    }
    $scope.chat = Chats.get($stateParams.contentId);
    console.log($scope.chat);
})
.controller('loginCtrl', function($scope, $state) {
  $scope.goState = function(state_name){
    $state.go(state_name);
  }
})
.controller('settingsCtrl', function($scope, $state, $ionicHistory) {
  $scope.goState = function(state_name){
      if(state_name == "back"){
          console.log($ionicHistory);
          $ionicHistory.goBack(-1);
      }else{
          $state.go(state_name);
      }
  }

    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true
})
;
