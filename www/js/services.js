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
});
