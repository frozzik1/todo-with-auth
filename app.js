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
const fs = firebase.firestore();
const db = firebase.database();

const todoContainer = document.getElementById('todo-container');

// getting todos
function renderData(individualDoc) {
    // parent div
    let parentDiv = document.createElement("div");
    parentDiv.className = "container todo-box";
    parentDiv.setAttribute('data-id', individualDoc.id);

    // todo div
    let todoDiv = document.createElement("div");
    todoDiv.textContent = individualDoc.data().todos;

    // delete button 
    let trash = document.createElement("button");
    let i = document.createElement("i");
    i.className = "fas fa-trash";

    // appending elements
    trash.appendChild(i);
    parentDiv.appendChild(todoDiv);
    parentDiv.appendChild(trash);
    todoContainer.appendChild(parentDiv);

    // trash clicking event
    trash.addEventListener('click', e => {
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        auth.onAuthStateChanged(user => {
            if (user) {
                fs.collection(user.uid).doc(id).delete();
            }
        })
    })
}

// getting username
auth.onAuthStateChanged(user => {
    const username = document.getElementById('username');
    if (user) {
        fs.collection('users').doc(user.uid).get().then((snapshot) => {
            username.innerText = snapshot.data().Name;
        })
    }
})

// adding todos to database
const form = document.getElementById('form');
let counter = 0;
form.addEventListener('submit', e => {
    e.preventDefault();
    const todos = form['todos'].value;
    let id = counter += 1;
    form.reset();
    auth.onAuthStateChanged(user => {
        if (user) {
            fs.collection(user.uid).doc('_' + id).set({
                id: '_' + id,
                todos
            })
        }
    })
})

//log out
document.getElementById("logOutBtn").addEventListener("click", logOut);
function logOut() {
    auth.signOut();
}

// auth check
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user is signed');
    }
    else {
        location = "index.html";
    }
})

// realtime listners
auth.onAuthStateChanged(user => {
    if (user) {
        fs.collection(user.uid).onSnapshot((snapshot) => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == "added") {
                    renderData(change.doc);
                }
                else if (change.type == 'removed') {
                    let li = todoContainer.querySelector('[data-id=' + change.doc.id + ']');
                    todoContainer.removeChild(li);
                }
            })
        })
    }
})