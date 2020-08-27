import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDPqTcoM_AjrEujHW_DbTmrakgNTzy8Bso",
    authDomain: "instagram-clone-react-71e37.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-71e37.firebaseio.com",
    projectId: "instagram-clone-react-71e37",
    storageBucket: "instagram-clone-react-71e37.appspot.com",
    messagingSenderId: "189042618638",
    appId: "1:189042618638:web:0583f60496fd9bd902675f",
    measurementId: "G-DLJT52RBY1"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };