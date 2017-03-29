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

.controller('deviceDetailCtrl', function($scope, $stateParams, $ionicModal, Devices, $state, Player, Channel, Toast, CurrentChannel, Content) {
    $scope.channelPage = 1;
    $scope.channelMore = true;
    $scope.contentPage = 1;
    $scope.contentMore = true;

    $scope.init = function(){
        $scope.params = {};

        Player.get({uuid: $stateParams.deviceId}).then(function(res){
            // console.log(res);
            $scope.device = res.result;
            $scope.params = angular.copy($scope.device);
        });
        // $scope.device = Devices.get($stateParams.deviceId);
        // $scope.showTab = 'banner';
    };

    // modal 기기 변경
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
        document.location.reload();
        $scope.mdDevice.hide();
    };

    $scope.saveDevice = function(){
        if(!$scope.params.ch_id) return Toast('채널ID를 선택하세요.');

        Player.update($scope.params).then(function(res){
            Toast(res.message);
            if(res.error == 0){
                $scope.hideMdDevice();
            }
        });
    };

    // modal 채널 변경
    $ionicModal.fromTemplateUrl('mdChannel', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mdChannel = modal;
    });

    $scope.showMdChannel = function(){
        $scope.channelPage = 1;
        $scope.channelMore = true;
        $scope.channels = [];

        Channel.getList({page : $scope.channelPage, ch_srl : CurrentChannel.get().ch_srl}).then(function(res){
            if(res.error==0) {
                $scope.channels = res.list;
                $scope.mdChannel.show();
                $scope.channelPage++;
            }else{
                Toast(res.message);
            }
        });

    };

    $scope.hideMdChannel = function() {
        $scope.channelMore = false;
        $scope.mdChannel.hide();
    };

    $scope.selectChannel = function(channel) {
        $scope.params.ch_id = channel.ch_id;
        $scope.hideMdChannel();
    };

    $scope.loadMoreChannel = function(){
        if($scope.channelPage == 1) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            return;
        }

        Channel.getList({page : $scope.channelPage, ch_srl : CurrentChannel.get().ch_srl}).then(function(res){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            if(res.error==0) {
                if(res.list) {
                    for (var key in res.list) {
                        $scope.channels.push(res.list[key]);
                    }
                    $scope.mdChannel.show();
                    $scope.channelPage++;
                }else{
                    $scope.channelMore = false;
                }
            }else{
                $scope.channelMore = false;
                Toast(res.message);
            }
        });
    };

    // modal 대표컨텐츠 변경
    $ionicModal.fromTemplateUrl('mdContent', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mdContent = modal;
    });
    $scope.showMdContent = function(){
        $scope.contentPage = 1;
        $scope.contentMore = true;
        $scope.contents = [];

        Content.getList({page:$scope.contentPage, ch_id: $scope.params.ch_id}).then(function(res){
            console.log(res);
            if(res.error==0) {
                $scope.contents = res.list;
                $scope.mdContent.show();
                $scope.contentPage++;
            }else{
                Toast(res.message);
            }
        });
    };
    $scope.hideMdContent = function() {
        $scope.contentMore = false;
        $scope.mdContent.hide();
    };

    $scope.selectContent = function(content){
        $scope.params.content_srl = content.content_srl;
        $scope.params.content_title = content.title;
        $scope.hideMdContent();
    };

    $scope.loadMoreContent = function(){
        if($scope.contentPage == 1) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            return;
        }

        Content.getList({page:$scope.contentPage, ch_id: $scope.params.ch_id}).then(function(res){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            if(res.error==0) {
                if(res.list) {
                    for (var key in res.list) {
                        $scope.contents.push(res.list[key]);
                    }
                    $scope.mdContent.show();
                    $scope.contentPage++;
                }else{
                    $scope.contentMore = false;
                }
            }else{
                $scope.contentMore = false;
                Toast(res.message);
            }
        });
    };
    
    $scope.goState = function(state_name){
        $state.go(state_name);
    };
    
    $scope.init();
})

.controller('contentCtrl', function($scope, Chats , Content, CurrentChannel, Toast) {
    $scope.contentPage = 1;
    $scope.contentMore = true;

    $scope.init = function(){
        $scope.params = {};
        $scope.contents = [];
        $scope.getList();
    };

    $scope.getList = function(){
        Content.getList({page: $scope.contentPage, ch_srl : CurrentChannel.get().ch_srl}).then(function(res){
            // console.log(res);
            if(res.error==0) {
                $scope.contents = res.list;
                $scope.contentPage++;
            }else{
                Toast(res.message);
            }
        });
    };

    $scope.loadMoreContent = function(){
        if($scope.contentPage == 1) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            return;
        }

        Content.getList({page: $scope.contentPage, ch_srl : CurrentChannel.get().ch_srl}).then(function(res){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            console.log(res);
            if(res.error==0) {
                if(res.list) {
                    for (var key in res.list) {
                        $scope.contents.push(res.list[key]);
                    }
                    $scope.contentPage++;
                }else{
                    $scope.contentMore = false;
                }
            }else{
                $scope.contentMore = false;
                Toast(res.message);
            }
        });
    };

    $scope.goState = function(state_name){
        $state.go(state_name);
    };
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };

    $scope.init();
})

.controller('contentDetailCtrl', function($scope, $stateParams, Chats, $state, Content, Toast, CurrentChannel) {

    $scope.server_url = CurrentChannel.get().data_server;

    $scope.tabs = [
        {"text" : "Home"},
        {"text" : "Games"},
        {"text" : "Mail"},
        {"text" : "Car"},
        {"text" : "Profile"},
        {"text" : "Favourites"},
        {"text" : "Chats"},
        {"text" : "Settings"},
        {"text" : "Photos"},
        {"text" : "Pets"}
    ];
    $scope.onSlideMove = function(data){
        console.log("You have selected " + data.index + " tab");
    };


    $scope.init = function(){
        $scope.params = {};

        $scope.showTab = 'info';

        Content.get({content_srl: $stateParams.contentId}).then(function(res){
            console.log(res);
            if(res.error == 0) {
                $scope.content = res.result;
            }else{
                Toast(res.message);
            }
        });
    };

    $scope.goTab = function(tabName){
        $scope.showTab = tabName;
    };

    $scope.goTimeline = function(index){
        console.log(index);
    };

    $scope.goState = function(state_name){
        $state.go(state_name);
    };

    $scope.init();
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

// 2차원 배열 -> 1차원 배열로
function convert_array_2D_to_1D(arrToConvert){
    var newArr = [];

    for (k1 in arrToConvert) {
        for (k2 in arrToConvert[k1]){
            newArr[k2] =  arrToConvert[k1][k2];
        }
    }

    return newArr;
}