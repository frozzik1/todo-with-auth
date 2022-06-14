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

// auth check
auth.onAuthStateChanged(user => {
    if (user) {
        location = "/app/app.html";
    }
})

// login
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const loginEmail = loginForm['login-email'].value;
    const loginPassword = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(loginEmail, loginPassword).then(() => {
        location = "/app/app.html";
    }).catch(err => {
        const loginError = document.getElementById("loginError");
        loginError.innerText = err.message;
    })
})