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

//sign up
const signupForm = document.getElementById("signup-form");
signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = signupForm['name'].value;
    const email = signupForm['email'].value;
    const password = signupForm['password'].value;
    signupForm.reset();
    auth.createUserWithEmailAndPassword(email, password).then((cred) => {
        return db.collection('users').doc(cred.user.uid).set({
            Name: name,
            Email: email
        }).then(() => {
            location = "/index.html";
        }).catch(err => {
            const signupError = document.getElementById('signupError');
            signupError.innerText = err.message;
        })
    }).catch(err => {
        const signupError2 = document.getElementById('signupError');
        signupError2.innerText = err.message;
    })
})
