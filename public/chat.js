// elements
console.info('initiating application...');
var continueToChat = document.getElementById('submit-name');
var containerFooter = document.getElementsByClassName('container-footer');
var containerBody = document.getElementsByClassName('container-body');
var input = document.getElementById('msg-content');
var socket = io.connect('http://68.183.136.181:4000');
continueToChat.addEventListener('click', async function() {
    var signBox = document.getElementById('sign-up');
    var userameInput = document.getElementById('username');
    var msgBox = document.getElementById('message-box');
    signBox.style.display = "none";
    msgBox.style.display = 'block';
    await beginChat(userameInput.value);
})

// config vars
var focused = 1;
var notif = 0;
var mute = 0;
// sounds
var msgNotif = new Howl({
  src: ['intuition.mp3']
});

async function beginChat(username) {
    var sendBtn = document.getElementById('send-message');
    sendBtn.addEventListener('click', () => {
        deliverMessage();
    });
    //"some is typing..."
    input.addEventListener('keyup', istyping);
    input.addEventListener('keyup', function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            deliverMessage();
        }
    });
    containerFooter[0].style.height = "10vh";
    containerBody[0].style.height = "85vh";
    // change layout
}
var messageContainer = document.getElementsByClassName('messages');
socket.on('message', function(data) {
    messageContainer[0].innerHTML += `<p><strong>${data.user}</strong>: ${data.content}</p>`;
    document.getElementById('istyping').style.display = 'none';
    if (mute == 0) msgNotif.play();
    notif = 1;
});
// the below function prevents "old" messages from rendering to current users.
var initial = 0;
socket.on('reply', async function(data) {
    if (initial !== 1) {
        for (var i = data.length - 1; i >= 0; i--) {
            messageContainer[0].innerHTML += `<p><strong>${data[i].msg_from}</strong>: ${data[i].msg_content}</p>`;
        }
        initial = 1;
        console.log(initial)
    }
    await chatScroll();
});
// is typing sendoff
function istyping() {
    socket.emit('istyping', {
        user: username,
        content: 'Someone is typing...'
    });
}
socket.on('istyping', () => {
    document.getElementById('istyping').style.display = 'block';
    setTimeout(() => (document.getElementById('istyping').style.display = 'none'), 3000);
});
// scroll top
function chatScroll() {
    let chatBody = document.getElementById('chatBox');
    chatBody.scrollTop = 99999;
}



// send message
function deliverMessage() {
	var msg = input.value;
	console.log(msg);
    input.value = null;
    socket.emit('message', {
        content: msg,
        user: username.value
    });
    chatScroll();
};


// check focus & notify
function isFocus(){
    if (document.hasFocus()) {
        document.title = 'Chat';
    } else {
        if (notif == 1) {
            document.title = 'New Message! | Chat';
            notif = 0;
        }
    }
}

setInterval(isFocus, 200);
console.info('running...');