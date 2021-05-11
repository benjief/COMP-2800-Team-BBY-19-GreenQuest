// JS for Firebase API

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCXt4kNOSkgLqiHrHqDetIFyfwDAEWBzkU",
    authDomain: "greenquest-5f80c.firebaseapp.com",
    projectId: "greenquest-5f80c",
    storageBucket: "greenquest-5f80c.appspot.com",
    messagingSenderId: "1007772602024",
    appId: "1:1007772602024:web:f99b0ad54fe70141a0fc9d"
};

// Initialize Firebase and Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();