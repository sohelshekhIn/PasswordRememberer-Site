var firebaseConfig = {
  apiKey: "AIzaSyDBG1FVO7IdaA_PSAJXXufVJpPsUiaS5Is",
  authDomain: "passwordrememberer.firebaseapp.com",
  databaseURL: "https://passwordrememberer.firebaseio.com",
  projectId: "passwordrememberer",
  storageBucket: "passwordrememberer.appspot.com",
  messagingSenderId: "404998858448",
  appId: "1:404998858448:web:793b1238040bdd812920d5",
  measurementId: "G-NZ6SDNLLJ2",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

// Initializig global varibles
let navAuthBtn = $(".signupBtn");
let msgSenderName = $(".msgSenderName");
let msgSenderEmail = $(".msgSenderEmail");
let msgSenderMessage = $(".msgSenderMessage");
let msgSenderButton = $(".msgSenderbtn");
let sendersName, sendersEmail, sendersMessage;

firebase.auth().onAuthStateChanged((user) => {
  if (user && user.emailVerified) {
    runOnAuthTrue(user);

    $(msgSenderButton).click(function (e) {
      e.preventDefault();
      sendMessage(user);
    });
  } else {
    $(msgSenderButton).click(function (e) {
      e.preventDefault();
      sendMessage(false);
    });
  }
});

function sendMessage(authStatus) {
  sendersMessage = $(msgSenderMessage).val();
  if (authStatus) {
    sendersName = authStatus.displayName || $(msgSenderName).val();
    sendersEmail = authStatus.email;
  } else {
    sendersName = $(msgSenderName).val();
    sendersEmail = $(msgSenderEmail).val();
  }

  if (sendersName != "" && sendersEmail != "" && sendersMessage != "") {
    msgSenderButton.text("Sending...");

    db.collection("userMessage")
      .doc(sendersName)
      .set({
        name: sendersName,
        email: sendersEmail,
        message: sendersMessage,
      })
      .then(() => {
        msgSenderButton.text("Message Sent");
        setTimeout(() => {
          msgSenderButton.text("Send Message");
        }, 5000);
      })
      .catch((error) => {
        msgSenderButton.text(error);
      });
  } else {
    msgSenderButton.text("Enter all fields!");
    setTimeout(() => {
      msgSenderButton.text("Send Message");
    }, 5000);
  }
}

function runOnAuthTrue(user) {
  $(msgSenderName).val(user.displayName);
  $(msgSenderEmail).val(user.email);
  if ($(msgSenderName).val() != "") {
    $(msgSenderName).attr("readonly", true);
  }
  if ($(msgSenderEmail).val() != "") {
    $(msgSenderEmail).attr("readonly", true);
  }
}
