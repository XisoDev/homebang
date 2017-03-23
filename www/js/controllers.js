angular.module('starter.controllers', [])

.controller('dashCtrl', function($scope,$state,$ionicModal,Channel,CurrentChannel,Toast) {
    $scope.init = function(){
        $scope.params = {};
        $scope.getChannel();
    };

    // 화면에 필요한 채널 정보를 받아옴
    $scope.getChannel = function(){
        $scope.params = CurrentChannel.get();
    };

    // 채널명 변경 process
    $scope.updateChannelTitle = function(){
        if(!$scope.params.title) return Toast('채널명을 입력하세요.');
        
        Channel.updateChannelTitle($scope.params).then(function(res){
            Toast(res.message);
        });

        $scope.hideMdTitle();
    };

    // modal 채널명 변경
    $ionicModal.fromTemplateUrl('mdTitle', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mdTitle = modal;
    });
    $scope.showMdTitle = function(){
        $scope.mdTitle.show();
    };
    $scope.hideMdTitle = function() {
        $scope.mdTitle.hide();
    };

    $scope.goState = function(state_name){
        $state.go(state_name);
    };

    $scope.init();
})

.controller('deviceCtrl', function($scope,Devices,$state,$ionicModal, Player, Toast, CurrentChannel) {
    $scope.init = function(){
        $scope.params = {};
        $scope.page = 1;

        $scope.getList();
    };

    $scope.getList = function(){
        Player.getList({page : $scope.page, ch_id : CurrentChannel.get().ch_id}).then(function(res){
            $scope.devices = res.list;
        });
    };

    $scope.addPlayer = function(){
        Player.addPlayer($scope.params).then(function(res){
            Toast(res.message);
            if(res.error==0){
                $scope.hideMdDeviceAdd();
                $scope.init();
            }
        });
    };

    // modal 채널명 변경
    $ionicModal.fromTemplateUrl('mdDeviceAdd', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mdDeviceAdd = modal;
    });
    $scope.showMdDeviceAdd = function(){
        $scope.mdDeviceAdd.show();
    };
    $scope.hideMdDeviceAdd = function() {
        $scope.mdDeviceAdd.hide();
    };

    $scope.goState = function(state_name){
        $state.go(state_name);
    };
    // $scope.devices = Devices.all();
    // $scope.remove = function(device) {
    //     Devices.remove(device);
    // };

    $scope.init();
})

.controller('deviceDetailCtrl', function($scope, $stateParams, $ionicModal, Devices, $state, Player) {
    $scope.init = function(){
        $scope.params = {};

        Player.get({uuid: $stateParams.deviceId}).then(function(res){
            console.log(res);
            $scope.device = res.result;
            $scope.params = angular.copy($scope.device);
        });
        // $scope.device = Devices.get($stateParams.deviceId);
        // $scope.showTab = 'banner';
    };

    // modal 채널명 변경
    $ionicModal.fromTemplateUrl('mdDevice', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mdDevice = modal;
    });
    $scope.showMdDevice = function(){
        $scope.mdDevice.show();
    };
    $scope.hideMdDevice = function() {
        $scope.mdDevice.hide();
    };
    
    $scope.goState = function(state_name){
        $state.go(state_name);
    };
    
    $scope.init();
})

.controller('contentCtrl', function($scope,Chats) {
    $scope.goState = function(state_name){
        $state.go(state_name);
    };
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('contentDetailCtrl', function($scope, $stateParams, Chats, $state) {
    $scope.goState = function(state_name){
        $state.go(state_name);
    };
    $scope.chat = Chats.get($stateParams.contentId);
    console.log($scope.chat);
})

.controller('loginCtrl', function($scope, $state, Member, Toast, CurrentChannel) {
    $scope.params = {};
    $scope.agreement = {};

    $scope.login = function(){
        Member.login($scope.params).then(function(res){
            Toast(res.message);

            if(res.error == 0){
                console.log('channel init 실행');
                CurrentChannel.init(); // 접속한 계정의 기본 채널정보를 세팅
                $state.go('agreement');
            }
        });
    };

    $scope.agree = function(){
        if(!$scope.agreement.service) return Toast('서비스 이용약관에 동의해주세요.');
        if(!$scope.agreement.privacy) return Toast('개인정보 보호 및 취급방침에 동의해주세요.');

        $state.go('tab.dash');
    };
})

.controller('settingsCtrl', function($scope, $state, $ionicHistory, Member, Toast) {
    $scope.goState = function(state_name){
        if(state_name == "back"){
            console.log($ionicHistory);
            $ionicHistory.goBack(-1);
        }else{
            $state.go(state_name);
        }
    };

    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;

    $scope.logout = function(){
        Member.logout().then(function(res){
            Toast(res.message);

            if(res.error == 0){
                $scope.goState('login');
            }
        });
    };
});
