import firebase from "firebase";
const config = {
  apiKey: "AIzaSyCpS2yEodpDdferxWIG0b7DtHSC_czmZtA",
  authDomain: "bluemark-demo.firebaseapp.com",
  databaseURL: "https://bluemark-demo.firebaseio.com",
  projectId: "bluemark-demo",
  storageBucket: "bluemark-demo.appspot.com",
  messagingSenderId: "41206663082",
  appId: "1:41206663082:web:17fe104722d12f6ce94dd3",
  measurementId: "G-2WP686YR8H"
};

firebase.initializeApp(config);
export default firebase;
export const fireauth = firebase.auth();
export const firestore = firebase.firestore();
