import firebaseui from 'firebaseui';
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyADOcMXveNYgHVM0fnDmC3356ImbmG37Ec",
  authDomain: "blabber-2fef9.firebaseapp.com",
  databaseURL: "https://blabber-2fef9.firebaseio.com",
  projectId: "blabber-2fef9",
  storageBucket: "blabber-2fef9.appspot.com",
  messagingSenderId: "1043356690661",
  appId: "1:1043356690661:web:5afc6b4602cda087"
};

class startFirebaseUI {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
  }

const uiConfig = {
              callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                  // User successfully signed in.
                  // Return type determines whether we continue the redirect automatically
                  // or whether we leave that to developer to handle.
                  return true;
                },
                uiShown: function() {
                  // The widget is rendered.
                  // Hide the loader.
                  document.getElementById('loader').style.display = 'none';
                }
              },
              // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
              signInFlow: 'popup',
              signInSuccessUrl: [ROUTES.HOME],
              signInOptions: [
                {
  provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  recaptchaParameters: {
    size: 'invisible', // 'invisible' or 'compact'
  },
  defaultCountry: 'ZA',
}
              ],
              // Terms of service url.
              tosUrl: '<your-tos-url>',
              // Privacy policy url.
              privacyPolicyUrl: '<your-privacy-policy-url>'
            };
const ui = new firebaseui.auth.AuthUI(firebase.auth());

const startFirebaseUI = function (elementId) {
  ui.start(elementId, uiConfig)
}
}

export default startFirebaseUI;
