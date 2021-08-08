"use strict";

function signUserIn()
{
    let emailRef = document.getElementById("email");
    let passwordRef = document.getElementById("password");
    let email = emailRef.value;
    let password = passwordRef.value;

    // Try students
    let database = unit.students;
    let gate = true;
    for (let i = 0; i < database.length; i++) {
        let person = database[i];
        if (person.email == email && person.password == password) {
            gate = false
            localStorage.setItem(PERSON_KEY, JSON.stringify(['student', i]));
            window.location = "index.html";
        }
    }

    // Try teachers
    database = unit.teachers;
    for (let i = 0; i < database.length; i++) {
        let person = database[i];
        if (person.email == email && person.password == password) {
            gate = false
            localStorage.setItem(PERSON_KEY, JSON.stringify(['teacher', i]));
            window.location = "index.html";
        }
    }

    // Try lecturer
    let person = unit.lecturer;
    if (person.email == email && person.password == password) {
        gate = false
        localStorage.setItem(PERSON_KEY, JSON.stringify(['lecturer']));
        window.location = "index.html";
    }

    if (gate) {
        displayWrongInfo()
    }
    
}

function displayWrongInfo()
{
    let errorRef = document.getElementById("error");
    errorRef.innerHTML =`<p style="color: red; font-size: 12px; font-weight: bold">The email and password do not match. Try again.</p>`
}