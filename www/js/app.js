// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'tabSlideBox'])

.run(function($ionicPlatform, $rootScope, $ionicPopup, Device, Admin) {
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

      Device.set(ionic.Platform.device());

      setTimeout(function(){
          var device = Device.get();
          var params = {
              uuid : device.uuid,
              model : device.model,
              serial : device.serial,
              version : device.version
          };

          Admin.insertAdmin(params).then(function(res){
              console.log(res);
          });
      }, 500);
  });

    //back button action
    $ionicPlatform.registerBackButtonAction(function(e) {

        e.preventDefault();

        $rootScope.exitApp = function() {
            $ionicPopup.confirm({
                title: "<strong>앱을 종료할까요?</strong>",
                template: '확인하시면 앱을 종료할 수 있습니다.',
                buttons: [
                    { text: '취소' },
                    {
                        text: '<b>종료</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            ionic.Platform.exitApp();
                        }
                    }
                ]
            });
        };
        $rootScope.exitApp();

        return false;
    }, 101);
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
          controller: 'messageCtrl'
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
  })
  .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'loginCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/tab/dash');
  $urlRouterProvider.otherwise('/login');

})

.filter('trustUrl', function($sce, CurrentChannel){
    return function(path, is_refresh) {
        if(!path) return ;
        var url = CurrentChannel.get().data_server;

        var res_url = url + path.substr(1);
        if(is_refresh) {
            var time = new Date().getTime();

            res_url = res_url + '?' + time;
        }

        return $sce.trustAsResourceUrl(res_url);
    };
})

.filter('trustMainUrl', function($sce, MainServer){
    return function(path, is_refresh) {
        if(!path) return ;

        var res_url = MainServer.getUrl() + path.substr(1);
        if(is_refresh) {
            var time = new Date().getTime();

            res_url = res_url + '?' + time;
        }

        return $sce.trustAsResourceUrl(res_url);
    };
})
.filter('filesize', function(){
    return function(filesize) {

        if(!filesize)
        {
            return '0Byte';
        }

        if(filesize === 1)
        {
            return '1Byte';
        }

        if(filesize < 1024)
        {
            return filesize + 'Bytes';
        }

        if(filesize >= 1024 && filesize < 1024 * 1024)
        {
            var num = filesize / 1024;
            return num.toFixed(1) + 'KB';
        }

        var num = filesize / (1024 * 1024);
        return num.toFixed(2) + "MB";
    };
})
.filter('nl2br', function() {
    var span = document.createElement('span');
    return function(input) {
        if (!input) return input;
        var lines = input.split('\n');

        for (var i = 0; i < lines.length; i++) {
            span.innerText = lines[i];
            span.textContent = lines[i];  //for Firefox
            lines[i] = span.innerHTML;
        }
        return lines.join('<br />');
    }
});
