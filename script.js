/* eslint-disable require-jsdoc */
'use strict'

$(function() {

  ///////////////////////////////////////////////////

  var log_timer = function(){

    //入力したvalue値を変数に格納
    var val = $('#input_text').val();
    var inputText = document.getElementById("input_text");

    if(val == "test" && global_flag == 1){

      MyFunction32(global_num)
      inputText.value="pp"

    }else{

    }
      
    };
  
    setInterval(log_timer, 20);

  /////////////////////////////////////////////////////

  //　自動起動

  setTimeout(function(){

    // Initiate a call!
    const roomName = 'user';
    if (!roomName) {
      return;
    }
    room = peer.joinRoom('mesh_multi_' + roomName, {stream: localStream});

    $('#room-id').text(roomName);
    step3(room);
    global_flag = 1;

  },5000);

  /////////////////////////////////////////////////////

  // Peer object
  const peer = new Peer({
    //key:   "e91a15d8-c4ec-40de-a9c1-547f2a3b32d3",
    key:   "2793c15b-9584-4c26-b473-59b4e0e657ab",
    debug: 3,
  });

  let localStream;
  let room;
  peer.on('open', () => {
    $('#my-id').text(peer.id);
    // Get things started
    step1();
  });

  peer.on('error', err => {
    alert(err.message);
    // Return to step 2 if error occurs
    step2();
  });

  /////////////////////////////////////////////////////////////////////////////

  $('#make-call').on('submit', e => {
    e.preventDefault();
    // Initiate a call!
    const roomName = $('#join-room').val();
    if (!roomName) {
      return;
    }
    room = peer.joinRoom('mesh_multi_' + roomName, {stream: localStream});

    $('#room-id').text(roomName);
    step3(room);
    global_flag = 1;
  });

  ////////////////////////////////////////////////////////////////////////////

  $('#end-call').on('click', () => {
    $('#chatbox-'+room.name).hide() // 切断時にチャットボックスを隠す
    room.close();
    step2();
    global_flag = 0;
    cmd_0();
  });

  // Retry if getUserMedia fails
  $('#step1-retry').on('click', () => {
    $('#step1-error').hide();
    step1();
  });

  /*///////////////////////////////////////////////////////////////////
  //$('#input_text').on('change', () => {
  //$(document).on('change', '#input_text', function(){
    $('body').on('change', '#input_text', function(){
  
    //入力したvalue値を変数に格納
    var val = $('#input_text').val();
    console.log(val);
    var inputText = document.getElementById("input_text");
    inputText.value="pp"
    
  });
  /*///////////////////////////////////////////////////////////////////////

  // set up audio and video input selectors
  const audioSelect = $('#audioSource');
  const videoSelect = $('#videoSource');
  const selectors = [audioSelect, videoSelect];

  navigator.mediaDevices.enumerateDevices()
    .then(deviceInfos => {
      const values = selectors.map(select => select.val() || '');
      selectors.forEach(select => {
        const children = select.children(':first');
        while (children.length) {
          select.remove(children);
        }
      });

      for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = $('<option>').val(deviceInfo.deviceId);

        if (deviceInfo.kind === 'audioinput') {
          option.text(deviceInfo.label ||
            'Microphone ' + (audioSelect.children().length + 1));
          audioSelect.append(option);
        } else if (deviceInfo.kind === 'videoinput') {
          option.text(deviceInfo.label ||
            'Camera ' + (videoSelect.children().length + 1));
          videoSelect.append(option);
        }
      }

      selectors.forEach((select, selectorIndex) => {
        if (Array.prototype.slice.call(select.children()).some(n => {
            return n.value === values[selectorIndex];
          })) {
          select.val(values[selectorIndex]);
        }
      });

      videoSelect.on('change', step1);
      audioSelect.on('change', step1);
    });

  function step1() {
    // Get audio/video stream
    const audioSource = $('#audioSource').val();
    const videoSource = $('#videoSource').val();
    const constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      video: {deviceId: videoSource ? {exact: videoSource} : undefined},
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      $('#my-video').get(0).srcObject = stream;
      localStream = stream;

      if (room) {
        room.replaceStream(stream);
        return;
      }

      step2();
    }).catch(err => {
      $('#step1-error').show();
      console.error(err);
    });
  }

  function step2() {
    $('#their-videos').empty();
    $('#step1, #step3').hide();
    $('#step2').show();
    $('#join-room').focus();
  }

  ///////////////////////////////////////////////////////////////////////////////

  function MyFunction32(arg) { //webGL側から呼び出される　遠隔PCにメッセージを送る

      var str_mode = arg[2];
      var str_x = arg[0];
      var str_y = arg[1];
      
      if (str_y != 0 && t <= str_y ){

        t = t + 0.002;
        str_y = t;
        
      }else if (t >= str_y ){

        str_y = str_y;
      
      }else if (str_y != 0 ){

        t = 0;
        str_y = t;

      }

      if (str_mode==0){

      str_x = arg[0]/2;
      str_y = arg[1]/2;

      }

    var pos = { 

        linear : {
         x : str_y,
         y : 0,
         z : 0
         },

       angular : {
          x : 0,
          y : 0,
          z : -str_x 
          }

      }

    room.send(JSON.stringify(pos))

  }

  ////////////////////////////////////////////////////////////////////////////////

  function isJSON(arg){
	arg = (typeof arg === "function") ? arg() : arg;
	if (typeof arg  !== "string") {
		return false;
	}
	try {
		arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
		return true;
	} catch (e) {
		return false;
	}
};

///////////////////////////////////////////////////////////////////////////////////

  function step3(room) {
    // chatboxを追加する

    const chatbox = $('<div></div>').addClass('chatbox').attr('id', 'chatbox-'+room.name);
    const header = $('<h4></h4>').html('Room: <strong>' + room.name + '</strong>');
    const messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
    chatbox.append(header);
    chatbox.append(messages);
    $('#chatframe').append(chatbox);

    /*///--------------------------------------------------------------------------------------------------------------
    /*/// メッセージ送信部分
    $('#sendtextform').on('submit', e => {
      e.preventDefault(); // form送信を抑制
      const msg = $('#mymessage').val();
      // ルームに送って自分のところにも反映
      room.send(msg);
      messages.prepend('<div><span class="you">You: </span>' + msg + '</div>');
      $('#mymessage').val('');
    });

    // room.send(msg);　データの送信 信号を記載

    // チャットとかファイルが飛んできたらdataでonになる
    // ここではファイルは使わないのでもとのサンプルのif文はけしておく

    room.on('data', message => {

      // データの受信　送られてきたメッセージがJSON形式ならばロボットを動かす

      //------------------------------------------------------------------------------------------

      if(isJSON(message.data)){

      var regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

      if(window.navigator.userAgent.search(regexp) !== -1){

      console.log('モバイル端末です');

      }else{

      console.log('PC端末です');

      var pos_out = JSON.parse(message.data);

      console.log(pos_out);

      //////////////////////////////////////////////////////////

      const cmdVel = new ROSLIB.Topic({
        ros : ros,
        name : '/cmd_vel',
        messageType : 'geometry_msgs/Twist'
      });
      
      const post_twist = new ROSLIB.Message(pos_out);
  
      cmdVel.publish(post_twist);

      ///////////////////////////////////////////////////////////

      }
      

      } else {

        messages.prepend('<div><span class="peer">' + message.src.substr(0,8) + '</span>: ' + message.data + '</div>');
        //console.log(message.data);

      }

      //--------------------------------------------------------------------------------------------------------------
    });

    room.on('peerJoin', peerId => {
      messages.prepend('<div><span class="peer">' + peerId.substr(0,8) + '</span>: has joined the room </div>');
      console.log('has joined the room');
    });

    room.on('peerLeave', peerId => {
      messages.prepend('<div><span class="peer">' + peerId.substr(0,8) + '</span>: has left the room </div>');
      console.log('has left the room');
    });

    // streamが飛んできたら相手の画面を追加する
    room.on('stream', stream => {
      const peerId = stream.peerId;
      const id = 'video_' + peerId + '_' + stream.id.replace('{', '').replace('}', '');

      $('#their-videos').append($(
        '<div class="video_' + peerId +'" id="' + id + '">' +
          '<label>' + stream.peerId + ':' + stream.id + '</label>' +
          '<video class="remoteVideos" autoplay playsinline>' +
        '</div>'));
      const el = $('#' + id).find('video').get(0);
      el.srcObject = stream;
      el.play();
    });

    room.on('removeStream', function(stream) {
      const peerId = stream.peerId;
      $('#video_' + peerId + '_' + stream.id.replace('{', '').replace('}', '')).remove();
    });

    // UI stuff
    room.on('close', step2);
    room.on('peerLeave', peerId => {
      $('.video_' + peerId).remove();
    });
    $('#step1, #step2').hide();
    $('#step3').show();
  }
});
