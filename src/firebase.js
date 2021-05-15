import firebase from "firebase"


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAtigO-K677IYDxZHXCAunQfQ5bIwaxJPk",
    authDomain: "socio-ba3f5.firebaseapp.com",
    projectId: "socio-ba3f5",
    storageBucket: "socio-ba3f5.appspot.com",
    messagingSenderId: "401003887719",
    appId: "1:401003887719:web:993aae6a3ad31cddcd68c2",
    measurementId: "G-MB7TJ0F50D"
})

const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db,auth,storage}