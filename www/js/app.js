// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'tabSlideBox'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top
    $ionicConfigProvider.tabs.style('standard');

}])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    onEnter: function($state, Auth, Member){
        // if(!Auth.isLogged()){
        //     $state.go('login');
        // }
        Member.getLoggedInfo().then(function(res){
            if(res.error!=0){
                $state.go('login');
            }
        });
    }
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/dashboard.html',
        controller: 'dashCtrl'
      }
    }
  })

  .state('tab.device', {
      url: '/device',
      views: {
        'tab-device': {
          templateUrl: 'templates/device.html',
          controller: 'deviceCtrl'
        }
      }
    })
    .state('tab.device-detail', {
      url: '/device/:deviceId',
      views: {
        'tab-device': {
          templateUrl: 'templates/device-detail.html',
          controller: 'deviceDetailCtrl'
        }
      }
    })
  .state('tab.content', {
      url: '/content',
      views: {
        'tab-content': {
          templateUrl: 'templates/content.html',
          controller: 'contentCtrl'
        }
      }
    })
  .state('tab.content-detail', {
      url: '/content/:contentId',
      views: {
        'tab-content': {
          templateUrl: 'templates/content-detail.html',
          controller: 'contentDetailCtrl'
        }
      }
  })
  .state('tab.message', {
      url: '/message',
      views: {
        'tab-message': {
          templateUrl: 'templates/message.html',
          controller: 'contentDetailCtrl'
        }
      }
  })
  .state('settings', {
      url: '/settings',
      templateUrl: 'templates/settings.html',
      controller: 'settingsCtrl'
  })
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
  })
  .state('agreement', {
      url: '/agreement',
      templateUrl: 'templates/login_agreement.html',
      controller: 'loginCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/tab/dash');
  $urlRouterProvider.otherwise('/login');

})

.filter('trustUrl', function($sce, CurrentChannel){
    return function(path) {
        if(!path) return ;
        var url = CurrentChannel.get().data_server;
        return $sce.trustAsResourceUrl(url + path.substr(1));
    };
})

.filter('trustMainUrl', function($sce){
    return function(path) {
        if(!path) return ;
        return $sce.trustAsResourceUrl('http://did.xiso.co.kr' + path.substr(1));
    };
});
