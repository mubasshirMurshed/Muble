"use strict";

function create(item)
{
    localStorage.setItem(CREATION_KEY, item)
    window.location = "creation.html";
}

function viewAssignment(i, j)
{
    localStorage.setItem(ASSIGNMENT_KEY, JSON.stringify([i,j]));
    create("Assignment");
}

function startAssignment(i, j)
{
    let ass = unit.getAssignment(i, j)
    localStorage.setItem(ATTEMPT_KEY, JSON.stringify(ass));
    window.location = "assignment.html";
}

function findBestAttempt(array)
{
    let bestMarkIdx = false;
    for (let i = 0; i < array.length; i++)
    {
        if (array[i].checked)
        {
            if (bestMarkIdx == false)
            {
                bestMarkIdx = i;
            }
            else if (array[i].mark > array[bestMarkIdx].mark)
            {
                bestMarkIdx = i;
            }
        }
    }
    return bestMarkIdx
}

function reviewAttempt(i, j, idx)
{
    // store assignment detail
    localStorage.setItem(ASSIGNMENT_KEY, JSON.stringify(unit.weeks[i].assignments[j]))

    // store attempt index
    localStorage.setItem(REVIEW_ATTEMPT_KEY, idx)

    // go to review.html
    window.location = "review.html";
}

function markAssignment(i, j)
{
    // store assignment detail
    localStorage.setItem(ASSIGNMENT_KEY, JSON.stringify(unit.weeks[i].assignments[j]))

    // go to marking.html
    window.location = "marking.html";
}

function hasTextResponse(a)
{
    for (let i = 0; i < a.questions.length; i++)
    {
        let q = a.questions[i];
        if (q.type == "Text Response")
        {
            return true;
        }
    }
    return false;
}

function hasUncheckedAttempts(a)
{
    for (let i = 0; i < unit.students.length; i++)
    {
        let student = unit.students[i];
        let attemptObject = unit.students[i].attempts;
        let attemptArray = attemptObject[a.name]
        if (attemptArray == undefined)
        {
            continue;
        }
        for (let j = 0; j < attemptArray.length; j++)
        {
            if (attemptArray[j].checked == false)
            {
                return true;
            }
        }
    }
    return false;
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

// Set up default marking mode
localStorage.setItem(DISPLAY_KEY, "whole");

// Show each option
let output = "";
if (user.title == "Lecturer")
{
    output += `<div class="mdl-cell mdl-cell--4-col"> 
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="create('Student')">
                        Enrol Student
                    </button>
                </div>

                <div class="mdl-cell mdl-cell--4-col"> 
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="create('Teacher')">
                        Enrol Teaching Associate
                    </button>
                </div>

                <div class="mdl-cell mdl-cell--4-col"> 
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="create('Assignment')">
                        Create Assignment
                    </button>
                </div>`;

    if (unit.weeks.length == 0)
    {
        output +=   `<div class="mdl-cell mdl-cell--12-col"> 
                        There doesn't seem to be any assignments created.
                    </div>`
    }
    else
    {
        output +=   `<div class="mdl-cell mdl-cell--4-col"></div>
                    <div class="mdl-cell mdl-cell--4-col mdl-typography--text-center">Details</div>
                    <div class="mdl-cell mdl-cell--4-col mdl-typography--text-center">Availability</div>`
        for (let i = 0; i < unit.weeks.length; i++)
        {
            if (unit.weeks[i].assignments.length > 0)
            {
                output +=   `<div class="mdl-cell mdl-cell--12-col"> 
                                <h4><b>Week ${i + 1}</b></h4>
                            </div>`
            }
            
            for (let j = 0; j < unit.weeks[i].assignments.length; j++)
            {
                let ass = unit.weeks[i].assignments[j]
                output +=   `<div class="mdl-cell mdl-cell--4-col"> 
                                <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="viewAssignment(${i}, ${j})">
                                    ${ass.name}
                                </button>
                            </div>
                            <div class="mdl-cell mdl-cell--4-col">
                                Time: ${ass.time} minutes
                                <br>
                                Marks: ${ass.total}
                            </div>`
                let switchGate = "";
                if (ass.available)
                {
                    switchGate = "checked";
                }

                // Set up code to detect changes
                output +=   `<div class="mdl-cell mdl-cell--4-col"> 
                                <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-${i}${j}">
                                    <input type="checkbox" id="switch-${i}${j}" class="mdl-switch__input" ${switchGate}>
                                    <span class="mdl-switch__label"></span>
                                </label>
                            </div>`
            }
        }
    }
}
else if (user.title == "Teacher")
{
    output +=   `<div class="mdl-cell mdl-cell--12-col"> 
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="create('Assignment')">
                        Create Assignment
                    </button>
                </div>`;


    // Fix up
    if (unit.weeks.length == 0)
    {
        output +=   `<div class="mdl-cell mdl-cell--12-col"> 
                        There doesn't seem to be any assignments created. TA
                    </div>`
    }
    else
    {
        for (let i = 0; i < unit.weeks.length; i++)
        {
            if (unit.weeks[i].assignments.length > 0)
            {
                output +=   `<div class="mdl-cell mdl-cell--12-col"> 
                                <h4><b>Week ${i + 1}</b></h4>
                            </div>`
            }

            for (let j = 0; j < unit.weeks[i].assignments.length; j++)
            {
                let ass = unit.weeks[i].assignments[j];

                if (!hasTextResponse(ass) || !hasUncheckedAttempts(ass))
                {
                    continue
                }

                output +=   `<div class="mdl-cell mdl-cell--6-col">
                                <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" onclick="markAssignment(${i}, ${j})">
                                    ${ass.name}
                                </button>
                            </div>
                            <div class="mdl-cell mdl-cell--6-col">
                                Details
                            </div>`;
            }
        }
    }
}
else if (user.title == "Student")
{
    if (unit.weeks.length == 0)
    {
        output +=   `<div class="mdl-cell mdl-cell--12-col"> 
                        There are no assignments to complete. Student
                    </div>`
    }
    else
    {
        for (let i = 0; i < unit.weeks.length; i++)
        {
            if (unit.weeks[i].assignments.length > 0)
            {
                // Check if available or not!
                output +=   `<div class="mdl-cell mdl-cell--12-col"> 
                                <h4><b>Week ${i + 1}</b></h4>
                            </div>`
            }

            for (let j = 0; j < unit.weeks[i].assignments.length; j++)
            {
                let ass = unit.weeks[i].assignments[j]
                if (ass.available)
                {
                    output +=   `<div class="mdl-cell mdl-cell--4-col"> 
                                    <h5>${ass.name}</h5>
                                </div>
                                <div class="mdl-cell mdl-cell--4-col"> 
                                    Time: ${ass.time} minutes
                                    <br>
                                    Marks: ${ass.total}
                                </div>`;
                    
                    
                    let arr = user.attempts[`${ass.name}`]
                    if (arr == undefined)
                    {
                        output +=   `<div class="mdl-cell mdl-cell--4-col"> 
                                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" onclick="startAssignment(${i}, ${j})">
                                            Attempt
                                        </button>
                                    </div>`;
                    }
                    else
                    {
                        //loop through array and get highest checked attempt, if none return false, else returns index
                        let index = findBestAttempt(arr);
                        if (index !== false)
                        {
                            let att = arr[index];

                            output +=   `<div class="mdl-cell mdl-cell--4-col"> 
                                            Highest Mark: ${att.mark}/${ass.total}
                                            <br>
                                            <a onclick="reviewAttempt(${i}, ${j}, ${index})" style="color: blue; text-decoration: underline;">Review</a>
                                        </div>`
                        }
                        else
                        {
                            output +=   `<div class="mdl-cell mdl-cell--4-col"> 
                                            <a style="color: grey;">Yet to be marked</a>
                                            <br>
                                            <a onclick="startAssignment(${i}, ${j})" style="color: blue; text-decoration: underline;">Attempt again?</a>
                                        </div>`
                        }
                    }    
                }
            }
        }
    }
}
document.getElementById("content").innerHTML = output;