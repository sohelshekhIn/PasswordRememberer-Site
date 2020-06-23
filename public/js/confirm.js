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

let email, displayName, emailVerfiedStatus;
let emailText = $(".userEmail");
let nameText = $(".userName");
let submitBtn = $(".btnSubmit");
let heading = $(".heading");
let displayImage = $("#emailConfirm");
let timer = $(".timer");
let resend = $(".resend");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    email = user.email;
    displayName = user.displayName;
    emailVerfiedStatus = user.emailVerified;

    $(emailText).text(email);
    $(nameText).text(displayName);

    if (emailVerfiedStatus) {
      $(resend).css("display", "none");
      heading.text("Email Confirmed");
      displayImage.src = "img/mailVerified.svg";
      submitBtn.text("PLease Wait");
      displayEmailImage(true);
      cssSet(".beforeConfirmation", ".afterConfirmation", "none", "flex");

      function cssSet(element, elementS, state, stateS) {
        $(element).css({
          display: state,
        });
        $(elementS).css({
          display: stateS,
        });
      }
      let timerValue = 5;
      setInterval(() => {
        if (timerValue == 0) {
          window.location.replace("../");
        } else {
          timer.text(timerValue);
          timerValue--;
        }
      }, 1000);
    } else {
      displayEmailImage(false);
    }

    $(resend).click(function (e) {
      e.preventDefault();
      if (emailVerfiedStatus) {
        $(resend).text("Email already verified!");
      } else {
        let user = firebase.auth().currentUser;
        sendVerificationEmail(user)
          .then((response) => {
            $(resend).text("Email Sent");
            setTimeout(() => {
              $(resend).text("CONFIRM");
            }, 5000);
          })
          .catch((error) => {
            authError(".resend", error.code);
          });
      }
    });

    var sendVerificationEmail = (user) => {
      return new Promise((res, rej) => {
        user
          .sendEmailVerification()
          .then((response) => {
            console.log(response);

            res(response);
          })
          .catch((error) => {
            console.log(error);

            rej(error);
          });
      });
    };

    function authError(button, errorCode) {
      $(button).text(errorCode);

      setTimeout(function () {
        if (button == "#SignInBtn") {
          $(button).text("Sign In");
        } else {
          if (button == "#SignUpbtn") {
            $(button).text("Sign Up");
          } else {
            $(button).text("Send Email");
          }
        }
      }, 6000);
    }
  } else {
    // No user is signed in.
    window.location.replace("createAccount.html?location=signin");
  }

  $(submitBtn).click(function (e) {
    e.preventDefault();
    window.location.reload();
  });
});

function displayEmailImage(type) {
  if (type == false) {
    $(displayImage).attr("src", "img/mailbox.svg");
  } else {
    $(displayImage).attr("src", "img/mailVerified.svg");
  }
}
