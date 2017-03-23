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

.factory('Auth', function(Member, Toast) {
    var self = this;

    self.isLogged = function(){
        Member.getLoggedInfo().then(function(res){
            console.log(res);
            if(res.error==0){
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
    service.getUsedSpace = function(params){
        return XisoApi.send('channel.getUsedSpace', params);
    };
    service.updateChannelTitle = function(params){
        return XisoApi.send('channel.procUpdateChannelTitle', params);
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

.factory('XisoApi', function($http, Object){
    var service = {};
    // var baseUrl = 'http://did.xiso.co.kr';
    var baseUrl = '/api';

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
});
