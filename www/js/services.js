angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('Devices', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var devices = [{
    id: 0,
    name: '정문 앞 단말기',
    lastText: '띤또레또 할인상품 모음전',
    face: 'img/gpad.jpg'
  }, {
    id: 1,
    name: '엘리베이터 내부 단말기',
    lastText: '뮤직비디오 모음 타임라인',
    face: 'img/note101.jpg'
  }];

  return {
    all: function() {
      return devices;
    },
    remove: function(device) {
        devices.splice(devices.indexOf(device), 1);
    },
    get: function(deviceId) {
      for (var i = 0; i < devices.length; i++) {
        if (devices[i].id === parseInt(deviceId)) {
          return devices[i];
        }
      }
      return null;
    }
  };
})

.factory('Auth', function(Member) {
    var self = this;

    self.isLogged = function(){
        Member.getLoggedInfo().then(function(res){
            if(res.error==0){
                self.logged_info = res.result;
                return true;
            }else{
                return false;
            }
        });
    };

    return self;
})

.factory('Member', function(XisoApi){
    var service = {};

    service.getLoggedInfo = function() {
        return XisoApi.send('member.getLoggedInfo');
    };
    service.refreshSession = function() {
        return XisoApi.send('member.refreshSession');
    };
    service.getList = function(params) {
        return XisoApi.send('member.getList', params);
    };
    service.save = function(params) {
        return XisoApi.send('member.procSave', params);
    };
    service.delete = function(params) {
        return XisoApi.send('member.procDelete', params);
    };
    service.login = function(params) {
        return XisoApi.send('member.procLogin', params);
    };
    service.logout = function() {
        return XisoApi.send('member.procLogout');
    };

    return service;
})

.factory('CurrentChannel', function(Channel){
    var self = this;

    self.get = function(){
        return JSON.parse(window.localStorage['channel']);
    };
    self.set = function(channel){
        console.log(channel);
        window.localStorage['channel'] = JSON.stringify(channel);
    };
    self.change = function(channel){
        Channel.getChannelContent(channel).then(function (res) {
            console.log(res);
            if (res.error == 0) {
                var result = res.result;
                Channel.getUsedSpace(result).then(function (res2) {
                    console.log(res2);
                    if (res2.used_space) {
                        result.used_space = res2.used_space / 1024 / 1024;
                    } else {
                        result.used_space = 0;
                    }

                    self.set(result);
                    document.location.reload();
                });
            } else {
                self.set({});
            }
        });
    };
    self.changeAdmin = function(){
        Channel.getChannelAdmin().then(function (res) {
            console.log(res);
            if (res.error == 0) {
                var result = res.result;
                Channel.getUsedSpace(result).then(function (res2) {
                    console.log(res2);
                    if (res2.used_space) {
                        result.used_space = res2.used_space / 1024 / 1024;
                    } else {
                        result.used_space = 0;
                    }

                    self.set(result);
                    document.location.reload();
                });
            } else {
                self.set({});
            }
        });
    };
    self.init = function(){
        if(!window.localStorage['channel']) {
            console.log('채널이 없자나');
            Channel.getChannelByMemberSrl().then(function (res) {
                console.log(res);
                if (res.error == 0) {
                    var result = res.result;
                    Channel.getUsedSpace(result).then(function (res2) {
                        if (res2.used_space) {
                            result.used_space = res2.used_space / 1024 / 1024;
                        } else {
                            result.used_space = 0;
                        }

                        self.set(result);
                    });
                } else {
                    self.set({});
                }
            });
        }
    };

    return self;
})

.factory('Channel', function(XisoApi){
    var service = {};

    service.getChannelByMemberSrl = function(){
        return XisoApi.send('channel.getChannelByMemberSrl');
    };
    service.getChannelContent = function(params){
        return XisoApi.send('channel.getChannelContent', params);
    };
    service.getChannelAdmin = function(){
        return XisoApi.send('channel.getChannelAdmin');
    };
    service.getUsedSpace = function(params){
        return XisoApi.send('channel.getUsedSpace', params);
    };
    service.updateChannelTitle = function(params){
        return XisoApi.send('channel.procUpdateChannelTitle', params);
    };
    service.getList = function(params){
        return XisoApi.send('channel.getList', params);
    };

    return service;
})

.factory('Player', function(XisoApi){
    var service = {};

    service.addPlayer = function(params){
        return XisoApi.send('player.procUpdateByApp', params);
    };
    service.getList = function(params){
        return XisoApi.send('player.getList', params);
    };
    service.get = function(params){
        return XisoApi.send('player.get', params);
    };
    service.update = function(params){
        return XisoApi.send('player.procUpdate', params);
    };

    return service;
})

.factory('Content', function(XisoApi){
    var service = {};

    service.getList = function(params){
        return XisoApi.send('content.getList', params);
    };
    service.get = function(params){
        return XisoApi.send('content.getContentForAdmin', params);
    };
    service.save = function(params){
        return XisoApi.send('content.procSaveByApp', params);
    };
    service.update = function(params){
        return XisoApi.send('content.procUpdateByApp', params);
    };

    return service;
})

.factory('Clip', function(XisoApi){
    var service = {};

    service.getList = function(params){
        return XisoApi.send('file.dispFileList', params);
    };
    service.saveUrl = function(params){
        return XisoApi.send('file.procSaveUrl', params);
    };

    return service;
})

.factory('Agreement', function(XisoApi){
    var service = {};

    service.getAgreement = function(){
        return XisoApi.send('config.getConfig', {name : 'homebang_agreement'});
    };
    service.getPrivacy = function(){
        return XisoApi.send('config.getConfig', {name : 'homebang_privacy'});
    };

    return service;
})

.factory('Browser', function(){
    var service = this;

    service.openInExternalBrowser = function(url){ // Open in external browser
        window.open(url,'_system','location=yes');
    };

    service.openInAppBrowser = function(url){ // Open in app browser
        window.open(url,'_blank', 'closebuttoncaption=닫기, location=no, zoom=no');
    };

    service.openCordovaWebView = function(url){ // Open cordova webview if the url is in the whitelist otherwise opens in app browser
        window.open(url,'_self');
    };

    return service;
})

.factory('Toast', function($cordovaToast){
    return function(text) {
        $cordovaToast.showShortBottom(text);
    }
})

.factory("Object", function(){
    return function(error, message, data){
        var obj = {};
        obj.error = error;
        obj.message = message;

        if(typeof data === "undefined") {
            data = false;
        }
        obj.data = data;
        return obj;
    }
})

.factory('MainServer', function(){
    var service = {};
    service.getUrl = function(){
        return 'http://did.xiso.co.kr';
    };
    service.getApi = function(){
        return '/api';
    };
    return service;
})

.factory('XisoApi', function($http, Object, MainServer){
    var service = {};
    // var baseUrl = MainServer.getApi();
    var baseUrl = MainServer.getUrl();
    var finalUrl = '';

    service.send = function(action, params){
        finalUrl = baseUrl + '/api.php?act=' + action;
        // console.log(finalUrl);

        var result = $http({
            method: 'POST',
            url: finalUrl,
            data: params
        }).then(function(res){
            return res.data;
        }, function(err){
            console.log(err);
            return Object(-1, "서버와의 통신에 실패하였습니다.");
        });

        return result;
    };

    return service;
})

.factory("Trans", function(){
    return ['scale','rotate','fadeInLeft','fadeInRight','fadeInUp','fadeInDown']
})

.factory("UrlPrefix", function(){
    return ['http://','https://','tel:','sms:','mailto:']
})

.factory("Tpl", function(){
    return {
        "live" : {
            "live_5_v2_v3" : {
                title : '방송용 1',
                sequence_count : 3,
                is_notice : 'N',
                is_did : 'N'
            },
            "live_6_v2_h1_v3" : {
                title : '방송용 2',
                sequence_count : 3,
                is_notice : 'Y',
                is_did : 'N'
            },
            "live_5_h2_v3" : {
                title : '방송용 3',
                sequence_count : 2,
                is_notice : 'N',
                is_did : 'N'
            },
            "live_6_v_h2_v3" : {
                title : '방송용 4',
                sequence_count : 4,
                is_notice : 'N',
                is_did : 'N'
            },
            "live_5_v2_v2_v3_2_1" : {
                title : '방송용 5',
                sequence_count : 3,
                is_notice : 'N',
                is_did : 'N'
            }
        },
        "row_did" : {
            "did_r" : {
                title : '가로형 DID 1',
                sequence_count : 2,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_2" : {
                title : '가로형 DID 2',
                sequence_count : 2,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_3" : {
                title : '가로형 DID 3',
                sequence_count : 3,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_2_1" : {
                title : '가로형 DID 4',
                sequence_count : 3,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_2_2" : {
                title : '가로형 DID 5',
                sequence_count : 2,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_2_3" : {
                title : '가로형 DID 6',
                sequence_count : 2,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_2_over_right" : {
                title : '가로형 DID 7',
                sequence_count : 3,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_2_over_left" : {
                title : '가로형 DID 8',
                sequence_count : 3,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_5_v_hvhv" : {
                title : '가로형 DID 9',
                sequence_count : 5,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_6" : {
                title : '가로형 DID 10',
                sequence_count : 6,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_4" : {
                title : '가로형 DID 11',
                sequence_count : 4,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_7" : {
                title : '가로형 DID 12',
                sequence_count : 7,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_12" : {
                title : '가로형 DID 13',
                sequence_count : 12,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_5" : {
                title : '가로형 DID 14',
                sequence_count : 5,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_r_9" : {
                title : '가로형 DID 15',
                sequence_count : 9,
                is_notice : 'N',
                is_did : 'Y'
            }
        },
        "col_did" : {
            "did_c_1" : {
                title : '세로형 DID 1',
                sequence_count : 1,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_c_2" : {
                title : '세로형 DID 2',
                sequence_count : 2,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_c_7" : {
                title : '세로형 DID 3',
                sequence_count : 7,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_c_9" : {
                title : '세로형 DID 4',
                sequence_count : 9,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_c_7_2" : {
                title : '세로형 DID 5',
                sequence_count : 7,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_c_7_3" : {
                title : '세로형 DID 6',
                sequence_count : 7,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_c_2_2" : {
                title : '세로형 DID 7',
                sequence_count : 2,
                is_notice : 'N',
                is_did : 'Y'
            },
            "did_c_3" : {
                title : '세로형 DID 8',
                sequence_count : 2,
                is_notice : 'Y',
                is_did : 'Y'
            }
        }
    }
});
