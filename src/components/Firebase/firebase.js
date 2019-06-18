import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyADOcMXveNYgHVM0fnDmC3356ImbmG37Ec",
  authDomain: "blabber-2fef9.firebaseapp.com",
  databaseURL: "https://blabber-2fef9.firebaseio.com",
  projectId: "blabber-2fef9",
  storageBucket: "blabber-2fef9.appspot.com",
  messagingSenderId: "1043356690661",
  appId: "1:1043356690661:web:5afc6b4602cda087"
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // *** User API ***

  user = uid => this.db.ref('users/' + uid);

  users = () => this.db.ref('users');

  stores = () => this.db.ref('stores/users/');
}

export default Firebase;
