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

// If user aleready signed In then redirect
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    emailVerfiedStatus = user.emailVerified;
    if (emailVerfiedStatus) {
      window.location.replace("../");
    } else {
      window.location.replace("confirmEmail.html");
    }
  }
});

// DOM variables
let emailInput = $(".SignInEmail");
let passwordInput = $(".SignInPass");

// Sign Up
let nameInput = $(".SignUpName");
let signUpEmail = $(".SignUpemail");
let signUpPass = $(".passwor");

// Forgot
let forgotEmail = $(".forgotemail");

// Other variables
let createAccount = $(".create");
let loginAccount = $(".already");
let forgotPassword = $(".forgot");
let signUpHtml = $(".signup");
let signInHtml = $(".signin");
let forgotHtml = $(".forgotDiv");

//Placeholders
// SignIn
let EmailPlaceHolder = $("#EmailPlaceholder");
let PasswordPlaceHolder = $("#PasswordPlaceholder");

// SignUp
let NamePlaceHolderSignUp = $("#NamePlaceholderSignUp");
let EmailPlaceHolderSignUp = $("#EmailPlaceholderSignUp");
let PasswordPlaceHolderSignUp = $("#PasswordPlaceholderSignUp");

// Forgot Password
let EmailPlaceHolderForgot = $("#EmailPlaceholderForgot");

function googleLogIn() {
  base_provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(base_provider)
    .then(function (response) {
      // Index Page
    })
    .catch(function (error) {
      alert(error);
    });
}

// Getting queris from url
const query = new URLSearchParams(location.search);

if (query.get("location") != null) {
  if (query.get("location") == "signup") {
    $(signUpHtml).css({
      display: "flex",
    });
    $(signInHtml).css({
      display: "none",
    });
    $(forgotHtml).css({
      display: "none",
    });
  } else {
    if (query.get("location") == "signin") {
      $(signUpHtml).css({
        display: "none",
      });
      $(signInHtml).css({
        display: "flex",
      });
      $(forgotHtml).css({
        display: "none",
      });
    } else {
      if (query.get("location") == "forgot") {
        $(signUpHtml).css({
          display: "none",
        });
        $(signInHtml).css({
          display: "none",
        });
        $(forgotHtml).css({
          display: "flex",
        });
      } else {
        if (query.get("location") == "google") {
          googleLogIn();
        }
      }
    }
  }
}

// On Sign IN button click
$("#SignInBtn").click(function (e) {
  e.preventDefault();
  signIn();
  $(this).text("Please Wait...");
});

// On Sign Up button click
$("#SignUpbtn").click(function (e) {
  e.preventDefault();
  signUp();
  $(this).text("Please Wait...");
});

// On forgot passwordbutton click
$("#forgotBtn").click(function (e) {
  e.preventDefault();
  forgotPass();
  $(this).text("Please Wait...");
});

// Deckarung Auth functions
function createUser(name, email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function (response) {
      let user = firebase.auth().currentUser;
      sendVerificationEmail(user)
        .then((response) => {
          window.location.replace("confirmEmail.html");
        })
        .catch((error) => {
          authError("#SignInbtn", error.code);
        });
    })
    .then(function (error) {
      console.log(error);
      authError("#SignUpbtn", error.code);
    });
}

function useOldUser(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function (response) {
      if (response.user.emailVerified) {
        window.location.replace("../");
      } else {
        let user = firebase.auth().currentUser;
        window.location.replace("confirmEmail.html");
      }
    })
    .catch(function (error) {
      authError("#SignInBtn", error.code);
    });
}

function bhuliGayoPassword(email) {
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function (response) {
      window.location.replace("?location=signin");
    })
    .catch(function (error) {
      authError("#forgotBtn", error.code);
    });
}

// Sign In
function signIn() {
  let email = $(emailInput).val();
  let password = $(passwordInput).val();

  if (ValidateEmail(email)) {
    if (CheckPassword(password)) {
      useOldUser(email, password);
    } else {
      inputError(
        PasswordPlaceHolder,
        "Password must contain 6 to 20 , numeric and a capital!"
      );
    }
  } else {
    inputError(EmailPlaceHolder, "Enter valid email!");
  }
}

// Sign Up
function signUp() {
  let name = $(nameInput).val();
  let email = $(signUpEmail).val();
  let password = $(signUpPass).val();

  if (name.length < 2) {
    inputError(NamePlaceHolder, "Enter valid name!");
  } else {
    if (ValidateEmail(email)) {
      if (CheckPassword(password)) {
        // Creating User
        createUser(name, email, password);
      } else {
        inputError(
          PasswordPlaceHolderSignUp,
          "Password must contain 6 to 20 , numeric and a capital!"
        );
      }
    } else {
      inputError(EmailPlaceHolderSignUp, "Enter valid email!");
    }
  }
}

// Forgot
function forgotPass() {
  let email = $(forgotEmail).val();
  if (ValidateEmail(email)) {
    bhuliGayoPassword(email);
  } else {
    inputError(EmailPlaceHolderForgot, "Enter valid email!");
  }
}

// Global functions
function ValidateEmail(inputText) {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (inputText.match(mailformat)) {
    return true;
  } else {
    return false;
  }
}

function CheckPassword(inputtxt) {
  var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  if (inputtxt.match(passw)) {
    return true;
  } else {
    return false;
  }
}

function inputError(inputElement, message) {
  // Making error input empty
  if (inputElement == EmailPlaceHolder) {
    $(emailInput).val("");
  } else {
    if (inputElement == PasswordPlaceHolder) {
      $(passwordInput).val("");
    } else {
      if (inputElement == NamePlaceHolderSignUp) {
        $(nameInput).val("");
      } else {
        if (inputElement == EmailPlaceHolderSignUp) {
          $(signUpEmail).val("");
        } else {
          if (inputElement == PasswordPlaceHolderSignUp) {
            $(signUpPass).val("");
          } else {
            if (inputElement == EmailPlaceHolderForgot) {
              $(forgotEmail).val("");
            }
          }
        }
      }
    }
  }

  //   // To reset button text
  if (inputElement == EmailPlaceHolder || inputElement == PasswordPlaceHolder) {
    $("#SignInBtn").text("Sign In");
  } else {
    if (
      inputElement == NamePlaceHolderSignUp ||
      inputElement == EmailPlaceHolderSignUp ||
      inputElement == PasswordPlaceHolderSignUp
    ) {
      $("#SignUpbtn").text("Sign Up");
    } else {
      if (inputElement == EmailPlaceHolderForgot) {
        $("#forgotBtn").text("Send Email");
      }
    }
  }

  //   Set error message
  $(inputElement).text(message);

  //Set error color
  $(inputElement).css({
    color: "#ff0000",
  });

  setTimeout(function () {
    $(inputElement).css({
      color: "#fff",
    });

    if (inputElement == EmailPlaceHolder) {
      $(inputElement).text("Email");
    } else {
      if (inputElement == PasswordPlaceHolder) {
        $(inputElement).text("Password");
      } else {
        $(inputElement).text("Name");
      }
    }
  }, 4000);
}

// Firebase error handling using code
function firebaseError(code) {
  if (code == "auth/email-already-in-use") {
    return "Account already exists, please SIGN IN";
  } else {
    if (code == "auth/user-not-found") {
      return "No user found, re-check the email!";
    } else {
      if (code == "auth/wrong-password") {
        return "Wrong password, please re-check it!";
      } else {
        if (code == "auth/network-request-failed") {
          return "Check your Internet connection!";
        } else {
          if (code == "auth/too-many-requests") {
            return "Too many attempts, please try later!";
          } else {
            return "Failed to reach server, please try later!";
          }
        }
      }
    }
  }
}

function authError(button, errorCode) {
  $(button).text(firebaseError(errorCode));
  var fontSize = $(button).css("fontSize");
  $(button).css({
    fontSize: "0.5em",
  });

  setTimeout(function () {
    $(button).css({
      fontSize: fontSize,
    });

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

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
      console.log("Done");
    })
    .catch(function (error) {
      // An error happened.
      console.log(error);
    });
}

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
