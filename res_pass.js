// database initialization
var firebaseConfig = {
    apiKey: "AIzaSyCHzaumUYrcgP-C1m0GqJx_UnmuTl4e2mM",
    authDomain: "todo-with-auth-f702c.firebaseapp.com",
    databaseURL: "https://todo-with-auth-f702c-default-rtdb.firebaseio.com",
    projectId: "todo-with-auth-f702c",
    storageBucket: "todo-with-auth-f702c.appspot.com",
    messagingSenderId: "133919904515",
    appId: "1:133919904515:web:88c02eb4b4509de852cf36"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const resForm = document.getElementById("res-form");
var resPass = document.getElementById("res_btn");
resPass.onclick = function() {
const email = resForm['res_email'].value;
firebase.auth().sendPasswordResetEmail(email)
  .then(() => {
    location = "index.html";
  })
  .catch(()=>{})
}