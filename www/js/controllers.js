angular.module('starter.controllers', [])

.controller('dashCtrl', function($scope,$state,$ionicModal,Channel,CurrentChannel,Toast, Browser, Member) {
    $scope.browser = Browser;

    $scope.channelPage = 1;
    $scope.channelMore = true;

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

    // modal 접속채널 변경
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

        Member.getLoggedInfo().then(function(res2){
            $scope.logged_info = res2.variables.member_info;

            Channel.getList({page : $scope.channelPage, ch_srl : CurrentChannel.get().ch_srl}).then(function(res){
                if(res.error==0) {
                    $scope.channels = res.list;
                    $scope.mdChannel.show();
                    $scope.channelPage++;
                }else{
                    Toast(res.message);
                }
            });
        });

        $scope.mdChannel.show();
    };
    $scope.hideMdChannel = function() {
        $scope.mdChannel.hide();
        document.location.reload();
    };

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
        console.log('modal hidden');
        // document.location.reload();
    });

    $scope.selectChannel = function(channel) {
        CurrentChannel.change(channel);

        $scope.mdChannel.hide();
    };

    $scope.selectAdminChannel = function(){
        CurrentChannel.changeAdmin();

        $scope.mdChannel.hide();
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

    $scope.init();
})

.controller('deviceCtrl', function($scope,Devices,$state,$ionicModal, Player, Toast, CurrentChannel) {
    $scope.devicePage = 1;
    $scope.deviceMore = true;
    $scope.showTab = 'all';
    $scope.did_mode = 'A';

    $scope.init = function(){
        $scope.params = {};
        $scope.devicePage = 1;
        $scope.devices = [];

        $scope.getList();
    };

    $scope.goTab = function(tab_name){
        $scope.showTab = tab_name;

        if($scope.showTab=='all') {
            $scope.did_mode = 'A';
        }else if($scope.showTab=='tv_cast'){
            $scope.did_mode = 'Y';
        }else{
            $scope.did_mode = 'N';
        }

        $scope.init();
    };

    $scope.getList = function(){
        Player.getList({page : $scope.devicePage, ch_id : CurrentChannel.get().ch_id, did_mode : $scope.did_mode}).then(function(res){
            if(res.list) {
                $scope.devices = res.list;
                $scope.devicePage++;
            }
        });
    };

    $scope.loadMoreDevice = function(){
        if($scope.devicePage == 1){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            return;
        }

        Player.getList({page : $scope.devicePage, ch_id : CurrentChannel.get().ch_id, did_mode : $scope.did_mode}).then(function(res){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            if(res.list) {
                for(var key in res.list){
                    $scope.devices.push(res.list[key]);
                }
                $scope.devicePage++;
            }else{
                $scope.deviceMore = false;
            }
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

    // modal 새 디바이스
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
            // console.log(res);
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

.controller('contentCtrl', function($scope, $state, Chats , Content, CurrentChannel, Toast, Tpl, $ionicModal) {

    $scope.tpls1D = convert_array_2D_to_1D(Tpl);    // 템플릿 1차원 배열

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
    
    $scope.addContent = function(){
        $scope.params.ch_srl = CurrentChannel.get().ch_srl;
        
        Content.save($scope.params).then(function(res){
            Toast(res.message);
            if(res.error==0){
                $state.go('tab.content-detail',{contentId : res.result.content_srl});
                $scope.hideMdContentAdd();
            }
        });
    };

    // modal 새 디바이스
    $ionicModal.fromTemplateUrl('mdContentAdd', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mdContentAdd = modal;
    });
    $scope.showMdContentAdd = function(){
        $scope.mdContentAdd.show();
    };
    $scope.hideMdContentAdd = function() {
        $scope.mdContentAdd.hide();
    };

    $scope.goState = function(state_name){
        $state.go(state_name);
    };

    $scope.init();
})

.controller('contentDetailCtrl', function($scope, $stateParams, $ionicActionSheet, $state, $timeout, Content, Toast, CurrentChannel, Tpl, $ionicModal, $ionicPopup, $ionicPlatform, $cordovaCamera, MainServer, Clip, Trans, UrlPrefix) {
    $scope.clip_type = {'I':'이미지', 'V':'비디오', 'U':'URL'};

    $scope.tpls = Tpl;
    $scope.tpls1D = convert_array_2D_to_1D(Tpl);    // 템플릿 1차원 배열

    $scope.trans = Trans;
    $scope.url_prefix = UrlPrefix;

    $scope.server_url = CurrentChannel.get().data_server;
    $scope.showNotice = false;
    
    $scope.clipPage = 1;
    $scope.clipMore = true;

    $scope.init = function(){
        $scope.params = {};

        $scope.showTab = 'info';

        Content.get({content_srl: $stateParams.contentId}).then(function(res){
            console.log(res);
            if(res.error == 0) {
                $scope.params = res.result;
                if($scope.params.is_public=='Y'){
                    $scope.params.checked_public = true;
                }else{
                    $scope.params.checked_public = false;
                }

                if($scope.params.template) {
                    if ($scope.tpls1D[$scope.params.template].is_notice == 'Y') {
                        $scope.showNotice = true;
                    }
                }

                if(!$scope.params.notices) $scope.params.notices = [];
            }else{
                Toast(res.message);
            }
        });
    };

    // 템플릿 변경을 눌렀을때
    $scope.showTemplate = function(){
        if($scope.params.template) {
            $ionicPopup.confirm({
                title: '경고',
                template: '템플릿과 타임라인이 초기화됩니다.<br/>계속할까요?',
                okText: '예', cancelText: '아니오'
            }).then(function (res) {
                if (res) {
                    $scope.params.template = null;
                    $scope.showTpltab = 'live';
                    $scope.showNotice = false;
                    $scope.showMdTemplate();
                }
            });
        }else{
            $scope.params.template = null;
            $scope.showTpltab = 'live';
            $scope.showNotice = false;
            $scope.showMdTemplate();
        }
    };

    // 템플릿 종류를 선택한다
    $scope.changeTpl = function(key, val){
        $scope.params.template = key;
        if(val.is_notice=='Y'){
            $scope.showNotice = true;
        }else{
            $scope.showNotice = false;
            $scope.params.notices = [];
        }
        $scope.params.timelines = [];
        for(var i=0; i < val.sequence_count; i++){
            $scope.params.timelines[i] = [];
        }

        $scope.hideMdTemplate();
    };

    // 대표 이미지 선택
    $scope.getContentImage = function (type) {
        $scope.uploadList = false;

        $ionicPlatform.ready(function() {
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                mediaType: Camera.MediaType.PICTURE,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1920,
                targetHeight: 1920,
                popoverOptions: CameraPopoverOptions,
                allowEdit: false,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                console.log('imageURI = '+ imageURI);
                $scope.cameraimage = imageURI;
                
                $scope.UploadDoc(type);    // rep : 대표이미지, bg : 배경이미지
            }, function (err) {
                console.log(err);
            });

        });
    };

    $scope.UploadDoc = function (type) {
        $scope.popup = $ionicPopup.show({
            template: '<h4 style="text-align:center;">업로드중입니다.. {{loadingStatus}}%</h4><progress max="100" value="{{loadingStatus}}"></progress>',
            scope: $scope
        });

        var fileURL = $scope.cameraimage;
        var fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        if(fileName.lastIndexOf('?') != -1) fileName = fileName.substr(0, fileName.lastIndexOf('?'));
        var ext = fileName.substr(fileName.lastIndexOf('.') + 1);

        var options = new FileUploadOptions();
        if(type == 'rep') {
            options.fileKey = "rep_img";
        }else if(type == 'bg'){
            options.fileKey = "bg_img";
        }else{
            options.fileKey = "file";
        }
        options.fileName = fileName;
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;    //Nginx 서버에 업로드 하는 문제를 방지 하려면.

        var params = {};
        params.content_srl = $scope.params.content_srl;
        options.params = params;

        $scope.loadingStatus = 0;

        var ft = new FileTransfer();
        ft.onprogress = function(progressEvent) {
            if (progressEvent.lengthComputable) {
                $scope.loadingStatus = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            } else {
                $scope.loadingStatus = 0;
            }
            $scope.$apply();
            // console.log($scope.loadingStatus + '% uploading...');
        };
        ft.upload(fileURL, encodeURI(MainServer.getUrl() + "/api.php?act=content.procSaveImage"), function (success) {
            $scope.popup.close();

            var obj = eval("("+success.response+")");
            // console.log(obj);
            if(obj.error != "0") {
                Toast(obj.message);
            }else {
                $scope.init();
            }
        }, function (error) {
            $scope.popup.close();

            console.log(error);
            Toast("파일 업로드를 실패하였습니다.");
        }, options);
    };

    // 사진이나 동영상을 업로드한다.
    $scope.getPhotoLib = function (media_type) {
        $ionicPlatform.ready(function() {

            var options = {};

            if(media_type=='picture'){
                options = {
                    quality: 100,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    mediaType: Camera.MediaType.PICTURE,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 1920,
                    targetHeight: 1920,
                    popoverOptions: CameraPopoverOptions,
                    allowEdit: false,
                    saveToPhotoAlbum: false,
                    correctOrientation: true
                };
            }else if(media_type=='video'){
                options = {
                    quality: 100,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    mediaType:Camera.MediaType.VIDEO,
                    correctOrientation: true
                };
            }

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                $scope.cameraimage = imageURI;
                $scope.transCoding();
            }, function (err) {
                console.log(err);
            });

        });
    };

    // 인코딩
    $scope.transCoding = function() {
        var fileURL = $scope.cameraimage;
        var fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        if(fileName.lastIndexOf('?') != -1) fileName = fileName.substr(0, fileName.lastIndexOf('?'));

        $scope.upClip.title = fileName;

        var fileFisrtName = fileName.substr(0, fileName.lastIndexOf('.'));
        var ext = fileName.substr(fileName.lastIndexOf('.') + 1);

        if(ext.toLowerCase() == 'mov') {
            $scope.loadingStatus2 = 0;
            $scope.popup2 = $ionicPopup.show({
                template: '<h4 style="text-align:center;">인코딩중입니다.. {{loadingStatus2}}%</h4><progress max="100" value="{{loadingStatus2}}"></progress>',
                scope: $scope
            });

            VideoEditor.transcodeVideo(function (success) {
                console.log(success);
                $scope.popup2.close();
                $scope.cameraimage = success;

                $scope.showMdUpload();
            }, function (error) {
                console.log(error);
                $scope.popup2.close();
            }, {
                fileUri: fileURL,
                outputFileName: fileFisrtName,
                outputFIleType: VideoEditorOptions.OutputFileType.MPEG4,
                saveToLibrary : false,
                progress: function (info) {
                    $scope.loadingStatus2 = Math.floor(info);
                    $scope.$apply();
                }
            });
        }else if(ext.toLowerCase() == '3gp') {
            $scope.cameraimage = null;
            Toast('지원하지 않는 파일 형식입니다.');
        }else{
            $scope.showMdUpload();
        }
    };

    $scope.uploadClip = function () {
        $scope.popup = $ionicPopup.show({
            template: '<h4 style="text-align:center;">업로드중입니다.. {{loadingStatus}}%</h4><progress max="100" value="{{loadingStatus}}"></progress>',
            scope: $scope
        });

        var fileURL = $scope.cameraimage;
        var fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        if(fileName.lastIndexOf('?') != -1) fileName = fileName.substr(0, fileName.lastIndexOf('?'));
        // var ext = fileName.substr(fileName.lastIndexOf('.') + 1);

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileName;
        if($scope.upClip.clip_type == 'I') {
            options.mimeType = "image/jpeg";
        }else{
            options.mimeType = "video/mp4";
        }
        options.chunkedMode = false;    //Nginx 서버에 업로드 하는 문제를 방지 하려면.
        $scope.upClip.remote_server = CurrentChannel.get().data_server;
        options.params = $scope.upClip;

        var url = '/api.php?act=file.procFileUpload';   // 메인 서버에 저장

        if(CurrentChannel.get().ch_srl > 0){
            url = '/api.php?act=file.procUpload';   // 데이터 서버에 저장
        }

        $scope.loadingStatus = 0;

        var ft = new FileTransfer();
        ft.onprogress = function(progressEvent) {
            if (progressEvent.lengthComputable) {
                $scope.loadingStatus = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            } else {
                $scope.loadingStatus = 0;
            }
            $scope.$apply();
            // console.log($scope.loadingStatus + '% uploading...');
        };
        ft.upload(fileURL, encodeURI(MainServer.getUrl() + url), function (success) {
            $scope.popup.close();

            var obj = eval("("+success.response+")");
            console.log(obj);
            if(obj.error != "0") {
                Toast(obj.message);
            }else {
                if(obj.result) {
                    obj.result.transition = $scope.upClip.transition;
                    if(obj.result.clip_type != 'V') obj.result.duration = $scope.upClip.duration;
                    
                    $scope.tempTimeline.push(obj.result);
                }
                $scope.hideMdUpload();
            }
        }, function (error) {
            $scope.popup.close();

            console.log(error);
            Toast("파일 업로드를 실패하였습니다.");
        }, options);
    };

    $scope.addClip = function(timeline){
        $scope.tempTimeline = timeline;

        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<i class="icon ion-image assertive"></i> 새로운 이미지 클립 업로드' },
                { text: '<i class="icon ion-videocamera assertive"></i> 새로운 동영상 클립 업로드' },
                { text: '<i class="icon ion-link assertive"></i> 새로운 URL 클립 등록' },
                { text: '<i class="icon ion-clipboard assertive"></i> 서버에 업로드된 클립 재사용' }
            ],
            titleText: '클립을 업로드하거나 재사용합니다.',
            cancelText: '취소',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                $scope.upClip = {};
                $scope.upClip.ch_srl = CurrentChannel.get().ch_srl;
                $scope.upClip.duration = 3;
                $scope.upClip.transition = 'scale';
                switch(index){
                    case 0:
                        $scope.upClip.clip_type = 'I';
                        $scope.getPhotoLib('picture');
                        break;
                    case 1:
                        $scope.upClip.clip_type = 'V';
                        $scope.getPhotoLib('video');
                        break;
                    case 2:
                        $scope.upClip.clip_type = 'U';
                        $scope.upClip.url_prefix = 'http://';
                        $scope.showMdUpload();
                        break;
                    case 3:
                        $scope.clipList();
                        break;
                }
                return true;
            }
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function() {
            hideSheet();
        }, 7000);
    };

    // 새로운 클립을 업로드한다.
    $scope.saveClip = function(){
        if($scope.upClip.clip_type == 'U'){ // URL 등록
            Clip.saveUrl($scope.upClip).then(function(res){
                console.log(res);
                if(res.error == 0) {
                    if(res.result) {
                        $scope.tempTimeline.push(res.result);
                        $scope.hideMdUpload();
                    }
                }else{
                    Toast(res.message);
                }
            });
        }else{ // 파일 업로드
            $scope.uploadClip();
        }
    };

    $scope.clipList = function(){
        $scope.clipPage = 1;
        $scope.clipMore = true;
        $scope.clips = [];

        $scope.showMdClip();
        Clip.getList({ch_srl: CurrentChannel.get().ch_srl, page: $scope.clipPage}).then(function(res){
            console.log(res);
            if(res.error==0) {
                $scope.clips = res.list;
                $scope.clipPage++;
            }else{
                Toast(res.message);
            }
        });
    };

    $scope.loadMoreClip = function(){
        if($scope.clipPage == 1){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            return;
        }

        Clip.getList({ch_srl: CurrentChannel.get().ch_srl, page: $scope.clipPage}).then(function(res){
            $scope.$broadcast('scroll.infiniteScrollComplete');
            console.log(res);
            if(res.error==0) {
                if(res.list) {
                    for (var key in res.list){
                        $scope.clips.push(res.list[key]);
                    }
                    $scope.clipPage++;
                }else{
                    $scope.clipMore = false;
                }
            }else{
                $scope.clipMore = false;
                Toast(res.message);
            }
        });
    };

    $scope.selectClip = function(clip){
        clip.transition = 'scale';  // 기본 전환효과 설정
        $scope.tempTimeline.push(clip);
        $scope.hideMdClip();
    };

    // 컨텐츠 정보를 모두 저장한다.
    $scope.saveContent = function(){
        if($scope.params.checked_public) $scope.params.is_public = 'Y';

        Content.update($scope.params).then(function(res){
            Toast(res.message);
            if(res.error==0){
                $scope.init();
            }
        });
    };

    $scope.onSlideMove = function(data){
        console.log("You have selected " + data.index + " tab");
    };

    $scope.moveItem = function(timeline, item, fromIndex, toIndex) {
        timeline.splice(fromIndex, 1);
        timeline.splice(toIndex, 0, item);
    };

    $scope.onItemDelete = function(item) {
        $scope.items.splice($scope.items.indexOf(item), 1);
    };

    $scope.goTab = function(tabName){
        $scope.showTab = tabName;
    };

    $scope.goTimeline = function(index){
        console.log(index);
    };

    // modal 템플릿 선택
    $ionicModal.fromTemplateUrl('mdTemplate', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mdTemplate = modal;
    });
    $scope.showMdTemplate = function(){
        $scope.mdTemplate.show();
    };
    $scope.hideMdTemplate = function() {
        $scope.mdTemplate.hide();
    };

    // modal 클립 업로드
    $ionicModal.fromTemplateUrl('mdUpload', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mdUpload = modal;
    });
    $scope.showMdUpload = function(){
        $scope.mdUpload.show();
    };
    $scope.hideMdUpload = function() {
        $scope.mdUpload.hide();
    };

    // modal 클립 편집
    $ionicModal.fromTemplateUrl('mdEdit', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mdEdit = modal;
    });
    $scope.showMdEdit = function(clip){
        $scope.modiClip = clip;
        if(clip.url_prefix == 'null' || clip.url == 'null') {
            clip.url_prefix = null;
            clip.url = null;
        }
        
        $scope.mdEdit.show();
    };
    $scope.hideMdEdit = function() {
        if(!$scope.modiClip.transition) {
            Toast('전환효과를 선택해주세요.');
            return false;
        }
        if(!$scope.modiClip.url_prefix || $scope.modiClip.url_prefix=='null') {
            $scope.modiClip.url = null;
        }else{
            if(!$scope.modiClip.url || $scope.modiClip.url=='null') {
                Toast('전환효과를 선택해주세요.');
                return false;
            }
        }
        
        $scope.mdEdit.hide();
    };

    // modal 클립 선택
    $ionicModal.fromTemplateUrl('mdClip', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mdClip = modal;
    });
    $scope.showMdClip = function(){
        $scope.mdClip.show();
    };
    $scope.hideMdClip = function() {
        $scope.mdClip.hide();
    };

    // modal 공지사항 추가
    $ionicModal.fromTemplateUrl('mdNotice', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mdNotice = modal;
    });
    $scope.showMdNotice = function(){
        $scope.notice = {};
        $scope.mdNotice.show();
    };
    $scope.hideMdNotice = function() {
        $scope.mdNotice.hide();
    };

    // modal 에서 공지사항 추가 완료
    $scope.addNotice = function(){
        if(!$scope.notice.content) return Toast('공지사항 내용을 입력하세요.');
        if(!$scope.notice.url_prefix) return Toast('링크 종류을 선택하세요.');
        if(!$scope.notice.url) return Toast('링크 내용을 입력하세요.');

        $scope.params.notices.push($scope.notice);
        $scope.hideMdNotice();
    };

    $scope.goState = function(state_name){
        $state.go(state_name);
    };

    $scope.init();
})

.controller('loginCtrl', function($scope, $state, Member, Toast, CurrentChannel, Browser, Agreement) {
    $scope.browser = Browser;
    $scope.params = {};
    $scope.agreement = {};

    $scope.agrees = {};

    Agreement.getAgreement().then(function(res){
        // console.log(res);
        $scope.agrees.agreement = res.config;
    });
    Agreement.getPrivacy().then(function(res){
        // console.log(res);
        $scope.agrees.privacy = res.config;
    });

    $scope.login = function(){
        Member.login($scope.params).then(function(res){
            Toast(res.message);

            if(res.error == 0){
                console.log('channel init 실행');
                CurrentChannel.init(); // 접속한 계정의 기본 채널정보를 세팅
                $state.go('tab.dash');
            }
        });
    };

    $scope.agree = function(){
        if(!$scope.agreement.service) return Toast('서비스 이용약관에 동의해주세요.');
        if(!$scope.agreement.privacy) return Toast('개인정보 보호 및 취급방침에 동의해주세요.');

        $scope.params = {};

        $state.go('signup');
    };

    $scope.signup = function(){
        Member.signUp($scope.params).then(function(res){
            // console.log(res);
            Toast(res.message);

            if(res.error == 0){
                $state.go('login');
            }

        });
    };

    $scope.goState = function(state_name){
        $state.go(state_name);
    };
})

.controller('settingsCtrl', function($scope, $state, $ionicHistory, Member, Toast, $ionicModal, Channel, CurrentChannel, Browser) {
    $scope.browser = Browser;
    $scope.logged_info = {};

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

    $scope.goState = function(state_name){
        if(state_name == "back"){
            console.log($ionicHistory);
            $ionicHistory.goBack(-1);
        }else{
            $state.go(state_name);
        }
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