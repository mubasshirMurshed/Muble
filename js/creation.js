"use strict";

function displayWrongInfo()
{
    let errorRef = document.getElementById("error");
    errorRef.innerHTML =`<p style="color: red; font-size: 12px; font-weight: bold">There is an error in the details. Try again.</p>`
}

function enrolStudent()
{
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (firstName == "" || lastName == "" || email == "" || password == "")
    {
        displayWrongInfo()
    }
    else
    {
        let id = "";
        let gate = true;
        while (gate)
        {
            gate = false
            let randNum = Math.random().toFixed(8);
            id = Math.floor(randNum * Math.pow(10, 8));
            for (let i = 0; i < unit.people.length; i++)
            {
                if (id == unit.people[i].id)
                {
                    gate = true;
                }
            }
        }
        
        let student = new Student(firstName, lastName, id, email);
        student.password = password;

        unit.students.push(student);
        updateLocalStorage(unit);
        localStorage.removeItem(CREATION_KEY);
        window.location = "index.html";
    }
}

function enrolTeacher()
{
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (firstName == "" || lastName == "" || email == "" || password == "")
    {
        displayWrongInfo()
    }
    else
    {
        // TODO: Change this
        let id = "";
        let gate = true;
        while (gate)
        {
            gate = false
            let randNum = Math.random().toFixed(8);
            id = Math.floor(randNum * Math.pow(10, 8))
            for (let i = 0; i < unit.people.length; i++)
            {
                if (id == unit.people[i].id)
                {
                    gate = true;
                }
            }
        }
        
        let teacher = new Teacher(firstName, lastName, id, email);
        teacher.password = password;

        unit.teachers.push(teacher);
        updateLocalStorage(unit);
        localStorage.removeItem(CREATION_KEY);
        window.location = "index.html";
    }
}

function displayPersonCreation()
{
    output +=   `<div class="mdl-cell mdl-cell--12-col"> 
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="back()" style="float: right;">
                        Back
                    </button>
                </div>
            
                <!-- Div to hold card: -->
                
                <div class="mdl-card mdl-shadow--16dp" style="margin: auto;">
                    <!-- Card Title-->
                    <div class="mdl-card__title mdl-color--primary">
                        <h5 class="mdl-card__title-text" style="color: white;">${item} Enrolment:</h5>
                    </div>

                    <!-- Contents: -->
                    <div class="mdl-card__supporting-text">

                        <div class="mdl-textfield" style="line-height: 0%;">
                            Enter the ${item.toLowerCase()} details below:
                        </div>

                        <!-- First name Input: -->
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input class="mdl-textfield__input" type="text" id="firstName"/>
                            <label class="mdl-textfield__label" for="firstName">First Name</label>
                        </div>

                        <!-- Last name Input: -->
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input class="mdl-textfield__input" type="text" id="lastName"/>
                            <label class="mdl-textfield__label" for="lastName">Last Name</label>
                        </div>

                        <!-- Email Input: -->
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input class="mdl-textfield__input" type="text" id="email"/>
                            <label class="mdl-textfield__label" for="email">Email</label>
                        </div>

                        <!-- Password input: -->
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input class="mdl-textfield__input" type="password" id="password"/>
                            <label class="mdl-textfield__label" for="password">Set Password</label>
                        </div>

                        <div id="error"></div>

                        <!-- Enrol Button: -->
                        <div class="mdl-typography--text-center" style="margin: auto; background-color: white;">
                            <button type="submit" onclick="enrol${item}()" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-button--colored mdl-color--accent" id="enrol">
                                Enrol
                            </button>
                        </div>
                        
                    </div>
                </div>`;

    document.getElementById("content").innerHTML = output;
}

function displayAssignment()
{
    // Top bar

    output +=   `<div class="mdl-cell mdl-cell--12-col">
                    <div id="weekInput" style="float: left;">
                        <label for="weekNo">Week Number?</label>
                        <input id="weekNo" type="number" min="1" max="12" value="${indices[0] + 1}">
                    </div>
                    
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="back()" style="float: right;">
                        Back
                    </button>
                </div>`;

    // Assignment name, time allowed

    output +=  `<div class="mdl-cell mdl-cell--5-col">
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" id="title" value="${assignment.name}">
                        <label class="mdl-textfield__label" for="title">Assignment Title</label>
                    </div>
                </div>
                <div class="mdl-cell mdl-cell--5-col">
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="number" id="time" value="${assignment.time}">
                        <label class="mdl-textfield__label" for="time">Time (minutes, 0 for unlimited)</label>
                    </div>
                </div>`;

    // Availability

    let phrase = "";
    if (assignment.available)
    {
        phrase = "checked";
    }

    output +=   `<div class="mdl-cell mdl-cell--2-col" style="display: flex; justify-content: center;">
                    <div style="margin:auto;">
                        <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="available">
                            <input type="checkbox" id="available" class="mdl-switch__input" ${phrase}>
                            <span class="mdl-switch__label">Availability</span>
                        </label>
                    </div>
                </div>`;
    
    // Questions Div

    output +=  `<div class="mdl-cell mdl-cell--12-col" id="questions"></div>`;

    // Create Question Type Buttons

    output +=   `<div class="mdl-cell mdl-cell--12-col" style="display: flex; justify-content: center;">
                    <button class="mdl-button mdl-js-button mdl-button--primary" onclick="createMultipleChoice()">
                        + Multiple Choice
                    </button>
                    <button class="mdl-button mdl-js-button mdl-button--primary" onclick="createTextResponse()">
                        + Text Response
                    </button>
                </div>
                <div class="mdl-cell mdl-cell--12-col" style="height: 20px;"></div>`;

    // Save Assignment
    if (checkIfAssignmentExistsLocalStorage() == true)
    {
        output +=  `<div class="mdl-cell mdl-cell--12-col" style="display: flex; justify-content: center;">
                        <button class="mdl-button mdl-js-button mdl-button--raised" onclick="addAssignment()">
                            Save Assignment
                        </button>
                        <button class="mdl-button mdl-js-button mdl-button--raised" onclick="deleteAssignment()">
                            Delete Assignment
                        </button>
                    </div>`;
    }
    else
    {
        output +=  `<div class="mdl-cell mdl-cell--12-col" style="display: flex; justify-content: center;">
                        <button class="mdl-button mdl-js-button mdl-button--raised" onclick="addAssignment()">
                            Create Assignment
                        </button>
                    </div>`;
    }

    document.getElementById("content").innerHTML = output;

    updateQuestionHTML()
}

function createMultipleChoice()
{
    let q = new MultipleChoice();
    assignment.questions.push(q);

    updateQuestionHTML()
}

function createTextResponse()
{
    let q = new TextResponse();
    assignment.questions.push(q);

    updateQuestionHTML()
}

function deleteQuestion(i)
{
    assignment.questions.splice(i, 1);
    updateQuestionHTML();
}

function updateQuestionHTML()
{
    let outputRef = document.getElementById("questions");
    let output = "";

    for (let i = 1; i < assignment.length + 1; i++)
    {
        output += addQuestionHTML(i);
    }

    outputRef.innerHTML = output;

    for (let i = 1; i < assignment.length + 1; i++)
    {
        // Name
        let nameRef = document.getElementById(`q${i}`)
        nameRef.addEventListener("input", function() {
            updateName(i)
        });

        // Marks
        let markRef = document.getElementById(`marks${i}`)
        markRef.addEventListener("input", function() {
            updateMarks(i)
        });

        if (assignment.questions[i-1].type == "Multiple Choice")
        {
            // MCQ 0,1,2,3
            for (let j = 0; j < 4; j++)
            {
                let mcqRef = document.getElementById(`mcqOption${j}-${i}`)
                mcqRef.addEventListener("input", function() {
                    updateOptions(i, j)
                });
            }

            // pos feedback
            let posRef = document.getElementById(`posFeedback${i}`)
            posRef.addEventListener("input", function() {
                updatePosFeedback(i)
            });

            // neg feedback
            let negRef = document.getElementById(`negFeedback${i}`)
            negRef.addEventListener("input", function() {
                updateNegFeedback(i)
            });
        }
    }
    componentHandler.upgradeDom();
}

function addQuestionHTML(i)
{
    let output = "";
    let q = assignment.questions[i - 1]
    let type = q.type;

    output +=   `<div class="mdl-grid">
                    <div class="mdl-cell mdl-cell--12-col">
                        <div style="display: flex; justify-content: center;">
                            <h3>Question ${i}&nbsp&nbsp&nbsp<button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" onclick="deleteQuestion(${i-1})"><i class="material-icons">delete</i></button></h3> 
                        </div>
                    </div>`

    if (type == "Multiple Choice")
    {
        output +=   `   <div class="mdl-cell mdl-cell--12-col" style="display: flex; justify-content: center;">
                            <div class="mdl-textfield mdl-js-textfield">
                                <textarea class="mdl-textfield__input" type="text" rows="2" id="q${i}">${q.text}</textarea>
                                <label class="mdl-textfield__label" for="q${i}">Write question here...</label>
                            </div>
                        </div>

                        <div class="mdl-cell mdl-cell--6-col" style="text-align: right; color: green;">
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <input class="mdl-textfield__input" type="text" id="mcqOption0-${i}" value="${q.options[0]}">
                                <label class="mdl-textfield__label" for="mcqOption1-${i}">Correct Answer...</label>
                            </div>
                        </div>

                        <div class="mdl-cell mdl-cell--6-col" style="color: red;">
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <input class="mdl-textfield__input" type="text" id="mcqOption1-${i}" value="${q.options[1]}">
                                <label class="mdl-textfield__label" for="mcqOption2-${i}">Incorrect Answer 1...</label>
                            </div>
                        </div>

                        <div class="mdl-cell mdl-cell--6-col" style="text-align: right; color: red;">
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <input class="mdl-textfield__input" type="text" id="mcqOption2-${i}" value="${q.options[2]}">
                                <label class="mdl-textfield__label" for="mcqOption3-${i}">Incorrect Answer 2...</label>
                            </div>
                        </div>

                        <div class="mdl-cell mdl-cell--6-col" style="color: red;">
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <input class="mdl-textfield__input" type="text" id="mcqOption3-${i}" value="${q.options[3]}">
                                <label class="mdl-textfield__label" for="mcqOption4-${i}">Incorrect Answer 3...</label>
                            </div>
                        </div>

                        <div class="mdl-cell mdl-cell--4-col" style="text-align: right;">
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <textarea class="mdl-textfield__input" type="text" rows="1" id="posFeedback${i}">${q.posFeedback}</textarea>
                                <label class="mdl-textfield__label" for="posFeedback${i}">Automatic Positive Feedback...</label>
                            </div>
                        </div>

                        <div class="mdl-cell mdl-cell--4-col" style="display: flex; justify-content: center;">
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <textarea class="mdl-textfield__input" type="text" rows="1" id="negFeedback${i}">${q.negFeedback}</textarea>
                                <label class="mdl-textfield__label" for="negFeedback${i}">Automatic Negative Feedback...</label>
                            </div>
                        </div>

                        <div class="mdl-cell mdl-cell--4-col">
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <input class="mdl-textfield__input" type="number" id="marks${i}" value="${q.marks}">
                                <label class="mdl-textfield__label" for="marks${i}">Marks...</label>
                                <span class="mdl-textfield__error">Input is not a number!</span>
                            </div>
                        </div>

                    </div>`
    }
    else if (type == "Text Response")
    {
        output +=   `   <div class="mdl-cell mdl-cell--12-col" style="display: flex; justify-content: center;">
                            <div class="mdl-textfield mdl-js-textfield">
                                <textarea class="mdl-textfield__input" type="text" rows="8" id="q${i}">${q.text}</textarea>
                                <label class="mdl-textfield__label" for="q${i}">Write question here...</label>
                            </div>
                        </div>

                        <div class="mdl-cell mdl-cell--12-col" style="display: flex; justify-content: center;">
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <input class="mdl-textfield__input" type="number" id="marks${i}" value="${q.marks}">
                                <label class="mdl-textfield__label" for="marks${i}">Marks...</label>
                                <span class="mdl-textfield__error">Input is not a number!</span>
                            </div>
                        </div>
                    </div>`
    }
    return output;
}

function updateName(i)
{
    let nameRef = document.getElementById(`q${i}`)
    assignment.questions[i - 1].text = nameRef.value;
}

function updateMarks(i)
{
    let markRef = document.getElementById(`marks${i}`)
    assignment.questions[i - 1].marks = Number(markRef.value);
}

function updateOptions(i, j)
{
    let mcqRef = document.getElementById(`mcqOption${j}-${i}`)
    assignment.questions[i - 1].options[j] = mcqRef.value;
}

function updatePosFeedback(i)
{
    let posRef = document.getElementById(`posFeedback${i}`)
    assignment.questions[i - 1].posFeedback = posRef.value;
}

function updateNegFeedback(i)
{
    let negRef = document.getElementById(`negFeedback${i}`)
    assignment.questions[i - 1].negFeedback = negRef.value;
}

function addAssignment()
{
    // CONDITIONS


    // Get assignment name
    let titleRef = document.getElementById("title");
    let title = titleRef.value;
    assignment.name = title;

    // Get time
    let timeRef = document.getElementById("time");
    let time = Number(timeRef.value);
    assignment.time = time;

    // Get availability
    let gateRef = document.getElementById("available")
    let gate = gateRef.checked;
    assignment.available = gate;

    // Get assignment total marks
    let total = 0;
    for (let i = 0; i < assignment.length; i++)
    {
        total += assignment.questions[i].marks;
    }
    assignment.total = total;

    // Get week number
    let weekRef = document.getElementById("weekNo");
    let weekNum = weekRef.value;

    // Add assignment to appropriate week in unit or replace assignment is week unchanged
    if (checkIfAssignmentExistsLocalStorage() == true && indices[0] == Number(weekNum) - 1)
    {
        unit.weeks[indices[0]].assignments[indices[1]] = assignment;
    }
    else if (checkIfAssignmentExistsLocalStorage())
    {
        unit.weeks[indices[0]].assignments.splice(indices[1], 1)
        unit.weeks[weekNum - 1].assignments.push(assignment);
    }
    else
    {
        unit.weeks[weekNum - 1].assignments.push(assignment);
    }

    // Local storage
    updateLocalStorage(unit);
    localStorage.removeItem(CREATION_KEY);
    localStorage.removeItem(ASSIGNMENT_KEY);

    window.location = "index.html";
}

function deleteAssignment()
{
    // WARNING!


    // Remove assignment from unit
    unit.weeks[indices[0]].assignments.splice(indices[1], 1)

    // Local storage
    updateLocalStorage(unit);
    localStorage.removeItem(CREATION_KEY);
    localStorage.removeItem(ASSIGNMENT_KEY);

    window.location = "index.html";
}

function back()
{
    localStorage.removeItem(CREATION_KEY);
    localStorage.removeItem(ASSIGNMENT_KEY);
    window.location = "index.html";
}

function checkIfAssignmentExistsLocalStorage()
{
    let data = JSON.parse(localStorage.getItem(ASSIGNMENT_KEY));

    if (data === null ||data === undefined || data === "")
    {
        return false;
    }
    else
    {
        return true;
    }
}


// -------------- ON LOAD -------------------- //


// Get user
let data = JSON.parse(localStorage.getItem(PERSON_KEY));
let user = null;
if (data.length == 1)
{
    user = unit.lecturer;
}
else if (data[0] == 'student')
{
    user = unit.students[data[1]]
}
else if (data[0] == 'teacher')
{
    user = unit.teachers[data[1]]
}

document.getElementById("name").innerHTML = `Welcome, ${user.name}, ${user.id}`;


// Set up creation variables
let item = localStorage.getItem(CREATION_KEY);
let output = "";
let assignment = new Assignment();
let indices = [0];

// Check if editing or creating
if (checkIfAssignmentExistsLocalStorage() == true)
{
    indices = JSON.parse(localStorage.getItem(ASSIGNMENT_KEY));
    assignment = unit.weeks[indices[0]].assignments[indices[1]];
}


// Display info
if (item == "Student" || item == "Teacher")
{
    displayPersonCreation();
    
}
else if (item == "Assignment")
{
    displayAssignment();
}