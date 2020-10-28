import firebase from "firebase";
 

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDMUb2b4sND5nIJRYF23WI2CnS2EK2bhmA",
    authDomain: "clone-3a193.firebaseapp.com",
    databaseURL: "https://clone-3a193.firebaseio.com",
    projectId: "clone-3a193",
    storageBucket: "clone-3a193.appspot.com",
    messagingSenderId: "66068598447",
    appId: "1:66068598447:web:2ac0917ec8c60eb7bb4e5a",
    measurementId: "G-X27EMKQG2N"
}; 

const firebaseapp = firebase.initializeApp(firebaseConfig);

const db = firebaseapp.firestore();
const auth = firebase.auth();

export { db, auth };