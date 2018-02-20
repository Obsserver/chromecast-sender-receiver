const applicationID = 'C12B3ED0';
const namespace = 'urn:x-cast:com.google.cast.sample.helloworld';
let session = null;

if (!chrome.cast || !chrome.cast.isAvailable) {
  setTimeout(initializeCastApi, 1000);
}

function initializeCastApi() {
  const sessionRequest = new chrome.cast.SessionRequest(applicationID);
  const apiConfig = new chrome.cast.ApiConfig(sessionRequest,
    sessionListener,
    receiverListener);
  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

function onInitSuccess() {
  appendMessage('onInitSuccess');
}

function onError(message) {
  appendMessage('onError: ' + JSON.stringify(message));
}

function onSuccess(message) {
  appendMessage('onSuccess: ' + message);
}

function onStopAppSuccess() {
  appendMessage('onStopAppSuccess');
}

function sessionListener(e) {
  appendMessage('New session ID:' + e.sessionId);
  session = e;
  session.addUpdateListener(sessionUpdateListener);
  session.addMessageListener(namespace, receiverMessage);
}

function sessionUpdateListener(isAlive) {
  let message = isAlive ? 'Session Updated' : 'Session Removed';
  message += ': ' + session.sessionId;
  appendMessage(message);
  if (!isAlive) {
    session = null;
  }
}

function receiverMessage(namespace, message) {
  appendMessage('receiverMessage: ' + namespace + ', ' + message);
}

function receiverListener(e) {
  if (e === 'available') {
    appendMessage('receiver found');
  } else {
    appendMessage('receiver list empty');
  }
}

function stopApp() {
  session.stop(onStopAppSuccess, onError);
}

function sendMessage(message) {
  if (session != null) {
    session.sendMessage(namespace, message, onSuccess.bind(this, 'Message sent: ' + message), onError);
  } else {
    startCast(message);
  }
}

function startCast (message) {
  message = message || '';
  chrome.cast.requestSession(function(e) {
    session = e;
    session.sendMessage(namespace, message, onSuccess.bind(this, 'Message sent: ' + message), onError);
  }, onError);
}


function appendMessage(message) {
  console.log(message);
}

function update() {
  sendMessage(document.getElementById('input').value);
}

function transcribe(words) {
  sendMessage(words);
}
