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


// getting todos
const todoContainer = document.getElementById('todo-container');
function renderData(todos) {
    console.log(todos)
    todoContainer.innerHTML=null
    todos.forEach(todo => {
        let parentDiv = document.createElement("div");
        parentDiv.className = "container todo-box";
        parentDiv.setAttribute('data-id', todo.id);

        // todo div
        let todoDiv = document.createElement("div");
        todoDiv.textContent = todo.todos;

        // delete button 
        let trash = document.createElement("button");
        let i = document.createElement("i");
        i.className = "fas fa-trash";
        // check button 
        let check = document.createElement("button");
        check.className = "checkBtn";
        let iCheck = document.createElement("i");
        iCheck.className = "fa-solid fa-check";

        if (todo.status == "completed") {
            todoDiv.classList.add("checked");
        }
        // appending elements
        parentDiv.appendChild(check);
        check.appendChild(iCheck);
        trash.appendChild(i);
        parentDiv.appendChild(todoDiv);
        parentDiv.appendChild(trash);
        todoContainer.appendChild(parentDiv);
        
        // trash clicking event
        trash.addEventListener('click', e => {
            let id = e.target.parentElement.parentElement.getAttribute('data-id');
            auth.onAuthStateChanged( user => {
                if (user) {
                      fs.collection(user.uid).doc(id).delete();
                }
            })
        })
        check.addEventListener("click", function () {
            markCompleted(todo.id);
        });
    })
}


function markCompleted(id) {
    auth.onAuthStateChanged(user=>{
        // console.log(user.uid)
        let item = fs.collection(user.uid).doc(id);
        item.get().then(function (doc) {
            if (doc.exists) {
                if (doc.data().status == "active") {
                    // todoDiv.classList.add("checked");
                    item.update({
                        status: "completed",
                    })
                    // .then(()=>{
                    //     document.location.reload();
                    // })
                }
                else if (doc.data().status == "completed") {
                    item.update({
                        status: "active",
                    })
                    // .then(()=>{
                    //     document.location.reload();
                    // })
                }
                
            }
        });
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

function getRandomInt() {
    return Math.floor(Math.random() * 5000000);
}
// adding todos to database
const form = document.getElementById('form');
form.addEventListener('submit', e => {
    e.preventDefault();
    const todos = form['todos'].value;
    let id = getRandomInt();
    form.reset();
    auth.onAuthStateChanged(user => {
        if (user) {
            fs.collection(user.uid).doc("_" + id).set({
                id:"_"+ id,
                status: "active",
                todos:todos
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
    fs.collection(user.uid).onSnapshot((querySnapshot) => {
        let todos = [];

        querySnapshot.forEach((doc) => {
            todos.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        renderData(todos)
    });
})