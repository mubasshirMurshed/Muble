"use strict";

function getUncheckedStudents()
{
    let arr = [];
    for (let i = 0; i < unit.students.length; i++)
    {
        let student = unit.students[i];
        let attemptObject = unit.students[i].attempts;
        let attemptArray = attemptObject[assignment.name]
        if (attemptArray == undefined)
        {
            continue;
        }
        for (let j = 0; j < attemptArray.length; j++)
        {
            if (attemptArray[j].checked == false)
            {
                let studentAttempt = [i, j, student.id];
                arr.push(studentAttempt)
            }
        }
    }
    return sortStudents(arr)
}

function sortStudents(a)
{
    // Merge sort

    if (a.length <= 1)
    {
        return a;
    }
    else
    {
        let arr1 = sortStudents(a.slice(0, Math.floor(a.length/2)));
        let arr2 = sortStudents(a.slice(Math.floor(a.length/2), a.length));

        // combine cases
        let newArr = [];
        let i = 0;
        let j = 0;
        while (i < arr1.length && j < arr2.length)
        {
            if (arr1[i][2] < arr2[j][2])
            {
                newArr.push(arr1[i]);
                i += 1;
            }
            else if (arr2[j][2] < arr1[i][2])
            {
                newArr.push(arr2[j]);
                j += 1;
            }
            else
            {
                newArr.push(arr1[i]);
                newArr.push(arr2[j]);
                i += 1;
                j += 1;
            }
        }
        // add remaining
        newArr = newArr.concat(arr1.slice(i, arr1.length), arr2.slice(j, arr2.length));

        return newArr;
    }
}

function displayWholeAttempt()
{
    // Get attempt
    let attempt = unit.students[x].attempts[assignment.name][y]

    // Do question html
    let output = "";
    let count = -1;

    output += `<h2 style="padding: 8px; margin: 8px;">${assignment.name}</h2>`;
    output += `<h4 style="padding: 8px; margin: 8px;">Student ID: ${id}</h4>`;
    let questionArr = assignment.questions;

    output += `<div style="height: 66vh; overflow-y: auto;">`
    for (let i = 1; i < questionArr.length + 1; i++)
    {
        let q = questionArr[i - 1];
        if (q.type == "Multiple Choice")
        {
            continue;
        }
        count += 1;
        output +=   `<div class="mdl-grid" id="section-q${i}">
                        <div class="mdl-cell mdl-cell--12-col">
                            <h4><b>Question ${i}</b></h4>
                        </div>`;
        
        output +=       `<div class="mdl-cell mdl-cell--7-col">
                            <p>${q.text}</p>
                        </div>`;

        output +=       `<div class="mdl-cell mdl-cell--5-col">
                            <p style="margin-bottom: 0px;">Marks (0-${q.marks}):</p>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <input class="mdl-textfield__input" type="number" min="0" max="${q.marks}" id="marks${i}" value="${attempt.textResponseFeedback[count][0]}">
                                <span class="mdl-textfield__error">Mark must be between 0 and ${q.marks}</span>
                            </div>
                        </div>`;

        output +=       `<div class="mdl-cell mdl-cell--7-col">
                            <textarea id="q${i}" name="q${i}" rows="8" cols="100" disabled>${attempt.responses[i - 1]}</textarea>
                        </div>`;

        output +=       `<div class="mdl-cell mdl-cell--5-col">
                            <p style="margin-bottom: 4px;">Feedback...</p>
                            <textarea id="feedback${i}" name="feedback${i}" rows="6" cols="50">${attempt.textResponseFeedback[count][1]}</textarea>
                        </div>`;
                    
        output += `</div>`;
    }
    output += `</div>`
    document.getElementById("questionContent").innerHTML = output;

    // Display side bar
    output = "";

    // Add change mode button
    output +=   `<div>
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="changeModeToQuestion()" style="float: left;">
                    Q by Q View
                </button>`

    // Add back button
    output +=   `<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="back()" style="float: right;">
                    Back
                </button>
                </div>
                <br><br><br><br><br>`;


    // Add button html with links
    output += `<div class="mdl-grid" style="overflow: auto;">`;
    for (let i = 0; i < allData.length; i++)
    {
        // identify current selection
        let found = false;
        let colour = "white";

        if (!found && allData[i][2] == id)
        {
            colour = "grey";
            found = true;
            let att = unit.students[allData[i][0]].attempts[assignment.name][allData[i][1]];
            for (let j = 0; j < att.responses.length; j++)
            {
                if (att.responses[j] != attempt.responses[j])
                {
                    found = false;
                    colour = "white";
                    break
                }
            }
        }
        
        // Add buttons
        output +=   `<div class="mdl-cell mdl-cell--6-col" style="display: flex; justify-content: center;">
                        <button class="mdl-button mdl-js-button mdl-button--raised" id="button-q${i}" onclick="showNewAttempt(${i})" style="background-color: ${colour};">
                            ${allData[i][2]}
                        </button>
                    </div>`;
    }
    output += `</div>`;

    document.getElementById("questionNumber").innerHTML = output;

    // Add event listeners
    count = -1;
    let array = [];
    for (let i = 1; i < questionArr.length + 1; i++)
    {
        let q = questionArr[i - 1];
        if (q.type == "Multiple Choice")
        {
            array.push("");
            continue;
        }
        count += 1;
        array.push(count)
        let marksRef = document.getElementById(`marks${i}`)
        marksRef.addEventListener("input", function() {
            updateMark(i, array[i - 1])
        });

        let feedbackRef = document.getElementById(`feedback${i}`)
        feedbackRef.addEventListener("input", function() {
            updateFeedback(i, array[i - 1])
        });
    }
}

function updateMark(i, c)
{
    let marksRef = document.getElementById(`marks${i}`)
    let attempt = null;

    if (mode == "whole")
    {
        attempt = unit.students[x].attempts[assignment.name][y];
    }
    else if (mode == "single")
    {
        attempt = unit.students[allData[i][0]].attempts[assignment.name][allData[i][1]];
    }

    attempt.textResponseFeedback[c][0] = marksRef.value;
    updateLocalStorage(unit);
}

function updateFeedback(i, c)
{
    let feedbackRef = document.getElementById(`feedback${i}`)
    let attempt = null;

    if (mode == "whole")
    {
        attempt = unit.students[x].attempts[assignment.name][y];
    }
    else if (mode == "single")
    {
        attempt = unit.students[allData[i][0]].attempts[assignment.name][allData[i][1]];
    }

    attempt.textResponseFeedback[c][1] = feedbackRef.value;
    updateLocalStorage(unit);
}


function displaySingleQuestion()
{
    // Get question number (index)
    let num = localStorage.getItem(MARKING_KEY);

    // Get count (position of TR question)
    let count = -1;
    for (let i = 0; i <= num; i++)
    {
        if (assignment.questions[i].type == "Text Response")
        {
            count += 1;
        }
    }

    // Do question html
    let output = "";

    output += `<h2 style="padding: 8px; margin: 8px;">${assignment.name}</h2>`;
    
    let questionArr = assignment.questions;
    let question = questionArr[num];

    output += `<div style="height: 72vh; overflow-y: auto;">`
    for (let i = 0; i < allData.length; i++)
    {
        let attempt = unit.students[allData[i][0]].attempts[assignment.name][allData[i][1]];

        output += `<h4 style="padding-left: 8px; margin-left: 8px; margin-bottom: 0px;">Student ID: ${allData[i][2]}</h4>`;

        output +=   `<div class="mdl-grid" id="section-q${i}">
                        <div class="mdl-cell mdl-cell--12-col">
                            <h4 style="margin-top: 0px;"><b>Question ${Number(num) + 1}</b></h4>
                        </div>`;
        
        output +=       `<div class="mdl-cell mdl-cell--7-col">
                            <p>${question.text}</p>
                        </div>`;

        output +=       `<div class="mdl-cell mdl-cell--5-col">
                            <p style="margin-bottom: 0px;">Marks (0-${question.marks}):</p>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <input class="mdl-textfield__input" type="number" min="0" max="${question.marks}" id="marks${i}" value="${attempt.textResponseFeedback[count][0]}">
                                <span class="mdl-textfield__error">Mark must be between 0 and ${question.marks}</span>
                            </div>
                        </div>`;

        output +=       `<div class="mdl-cell mdl-cell--7-col">
                            <textarea id="q${i}" name="q${i}" rows="8" cols="100" disabled>${attempt.responses[num]}</textarea>
                        </div>`;

        output +=       `<div class="mdl-cell mdl-cell--5-col">
                            <p style="margin-bottom: 4px;">Feedback...</p>
                            <textarea id="feedback${i}" name="feedback${i}" rows="6" cols="50">${attempt.textResponseFeedback[count][1]}</textarea>
                        </div>`;
                    
        output += `</div>`;
    }
    output += `</div>`
    document.getElementById("questionContent").innerHTML = output;

    // Display side bar
    output = "";

    // Add change mode button
    output +=   `<div>
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="changeModeToStudent()" style="float: left;">
                    Stu by Stu View
                </button>`

    // Add back button
    output +=   `<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="back()" style="float: right;">
                    Back
                </button>
                </div>
                <br><br><br><br><br>`;


    // Add button html with links
    output += `<div class="mdl-grid" style="overflow: auto;">`;
    for (let i = 0; i < assignment.questions.length; i++)
    {
        let colour = "white";
        if (assignment.questions[i].type == "Multiple Choice")
        {
            continue;
        }
        if (i == num)
        {
            colour = "grey";
        }
        output +=   `<div class="mdl-cell mdl-cell--6-col" style="display: flex; justify-content: center;">
                        <button class="mdl-button mdl-js-button mdl-button--raised" id="button-q${i}" onclick="showNewQuestion(${i})" style="background-color: ${colour};">
                            ${i + 1}
                        </button>
                    </div>`;
    }
    output += `</div>`;

    document.getElementById("questionNumber").innerHTML = output;

    // Add event listeners
    for (let i = 0; i < allData.length; i++)
    {
        let marksRef = document.getElementById(`marks${i}`)
        marksRef.addEventListener("input", function() {
            updateMark(i, count)
        });

        let feedbackRef = document.getElementById(`feedback${i}`)
        feedbackRef.addEventListener("input", function() {
            updateFeedback(i, count)
        });
    }
}

function changeModeToQuestion()
// Changes mode of marking layout
{
    localStorage.removeItem(MARKING_KEY);
    localStorage.setItem(DISPLAY_KEY, "single");
    window.location = "marking.html";
}

function changeModeToStudent()
// Changes mode of marking layout
{
    localStorage.removeItem(MARKING_KEY);
    localStorage.setItem(DISPLAY_KEY, "whole");
    window.location = "marking.html";
}

function showPanel()
{
    let output = "";

    if (mode == "whole")
    {
        let idx = findAttemptPosition(x, y, id);
        
        if (allData.length - 1 == 0)
        {
            output +=   `<div class="mdl-grid">
                            <div class="mdl-cell mdl-cell--3-col"></div>
                            <div class="mdl-cell mdl-cell--6-col" style="display: flex; justify-content: center;">
                                <button class="mdl-button mdl-js-button mdl-button--raised" id="upload" style="width: 50%;" onclick="upload()">
                                    Upload Mark
                                </button>
                            </div>
                        </div>`;
        }
        else if (idx == allData.length - 1)
        {
            // If at the end
            output +=   `<div class="mdl-grid">
                            <div class="mdl-cell mdl-cell--3-col">
                                <button class="mdl-button mdl-js-button mdl-button--raised" id="previous" style="float: right;" onclick="previous()">
                                    Previous
                                </button>
                            </div>
                            <div class="mdl-cell mdl-cell--6-col" style="display: flex; justify-content: center;">
                                <button class="mdl-button mdl-js-button mdl-button--raised" id="upload" style="width: 50%;" onclick="upload()">
                                    Upload Mark
                                </button>
                            </div>
                        </div>`;
        }
        else if (idx == 0)
        {
            // If at the start
            output +=   `<div class="mdl-grid">
                            <div class="mdl-cell mdl-cell--3-col"></div>
                            <div class="mdl-cell mdl-cell--6-col" style="display: flex; justify-content: center;">
                                <button class="mdl-button mdl-js-button mdl-button--raised" id="upload" style="width: 50%;" onclick="upload()">
                                    Upload Mark
                                </button>
                            </div>
                            <div class="mdl-cell mdl-cell--3-col" style="float: left;">
                                <button class="mdl-button mdl-js-button mdl-button--raised" id="next" onclick="next()">
                                    Next
                                </button>
                            </div>
                        </div>`;
        }
        else
        {
            output +=   `<div class="mdl-grid">
                            <div class="mdl-cell mdl-cell--3-col">
                                <button class="mdl-button mdl-js-button mdl-button--raised" id="previous" style="float: right;" onclick="previous()">
                                    Previous
                                </button>
                            </div>
                            <div class="mdl-cell mdl-cell--6-col" style="display: flex; justify-content: center;">
                                <button class="mdl-button mdl-js-button mdl-button--raised" id="upload" style="width: 50%;" onclick="upload()">
                                    Upload Mark
                                </button>
                            </div>
                            <div class="mdl-cell mdl-cell--3-col" style="float: left;">
                                <button class="mdl-button mdl-js-button mdl-button--raised" id="next" onclick="next()">
                                    Next
                                </button>
                            </div>
                        </div>`;
        }
    }
    
    else if (mode == "single")
    {
        let idx = localStorage.getItem(MARKING_KEY);

        // Establish highest count index possible
        

        if (max == min)
        {
            output +=   `<div class="mdl-grid"></div>`;
        }
        else if (idx == max)
        {
            // If at the end
            output +=   `<div class="mdl-grid">
                            <div class="mdl-cell mdl-cell--3-col">
                                <button class="mdl-button mdl-js-button mdl-button--raised" id="previous" style="float: right;" onclick="previous()">
                                    Previous
                                </button>
                            </div>
                        </div>`;
        }
        else if (idx == min)
        {
            // If at the start
            output +=   `<div class="mdl-grid">
                            <div class="mdl-cell mdl-cell--3-col"></div>
                            <div class="mdl-cell mdl-cell--6-col"></div>
                            <div class="mdl-cell mdl-cell--3-col" style="float: left;">
                                <button class="mdl-button mdl-js-button mdl-button--raised" id="next" onclick="next()">
                                    Next
                                </button>
                            </div>
                        </div>`;
        }
        else
        {
            output +=   `<div class="mdl-grid">
                            <div class="mdl-cell mdl-cell--3-col">
                                <button class="mdl-button mdl-js-button mdl-button--raised" id="previous" style="float: right;" onclick="previous()">
                                    Previous
                                </button>
                            </div>
                            <div class="mdl-cell mdl-cell--6-col"></div>
                            <div class="mdl-cell mdl-cell--3-col" style="float: left;">
                                <button class="mdl-button mdl-js-button mdl-button--raised" id="next" onclick="next()">
                                    Next
                                </button>
                            </div>
                        </div>`;
        }
    }
    document.getElementById("bottomPanel").innerHTML = output;
}

function upload()
// Submits an attempt of an individual. Changes .checked to true
{
    let attempt = unit.students[x].attempts[assignment.name][y];
    attempt.checked = true;

    // Update marks to the total
    let increment = 0;
    for (let i = 0; i < attempt.textResponseFeedback.length; i++)
    {
        increment += Number(attempt.textResponseFeedback[i][0]);
    }
    attempt.mark += increment;

    updateLocalStorage(unit);
    localStorage.removeItem(MARKING_KEY);
    window.location = "marking.html";
}

function showNewAttempt(i)
{
    localStorage.setItem(MARKING_KEY, JSON.stringify(allData[i]));
    window.location = "marking.html";
}

function showNewQuestion(i)
{
    localStorage.setItem(MARKING_KEY, i);
    window.location = "marking.html";
}

function findAttemptPosition(i, j, id)
{
    for (let z = 0; z < allData.length; z++)
    {
        if (i == allData[z][0] && j == allData[z][1] && id == allData[z][2])
        {
            return z;
        }
    }
}

function next()
{
    let idx = null;
    if (mode == "whole")
    {
        idx = findAttemptPosition(x, y, id);
        showNewAttempt(idx + 1);
    }
    else if (mode == "single")
    {
        idx = Number(localStorage.getItem(MARKING_KEY));
        for (let i = idx + 1; i <= max; i++)
        {
            if (assignment.questions[i].type == "Text Response")
            {
                idx = i;
                break;
            }
        }
        showNewQuestion(idx);
    }    
}

function previous()
{
    let idx = null;
    if (mode == "whole")
    {
        idx = findAttemptPosition(x, y, id);
        showNewAttempt(idx - 1);
    }
    else if (mode == "single")
    {
        idx = Number(localStorage.getItem(MARKING_KEY));
        for (let i = idx - 1; i >= min; i--)
        {
            if (assignment.questions[i].type == "Text Response")
            {
                idx = i;
                break;
            }
        }
        showNewQuestion(idx);
    }    
}

function back()
{
    localStorage.removeItem(ASSIGNMENT_KEY);
    localStorage.removeItem(DISPLAY_KEY);
    localStorage.removeItem(MARKING_KEY);
    window.location = "index.html";
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

// Get assignment details
let assignment = new Assignment();
let assData = JSON.parse(localStorage.getItem(ASSIGNMENT_KEY));
assignment.fromData(assData);

// Obtain display mode
let mode = localStorage.getItem(DISPLAY_KEY);

// Get all unchecked attempt
let allData = getUncheckedStudents();
console.log(allData)
if (allData.length == 0)
{
    localStorage.removeItem(DISPLAY_KEY);
    window.location = "index.html";
}

// Get current attempt
let attemptData = "";
let x = null;
let y = null;
let id = null;
let max = null;
let min = null;

// Display content
if (mode == "whole")
{
    attemptData = localStorage.getItem(MARKING_KEY);

    if (attemptData == "undefined" || attemptData == null || attemptData == "")
    {
        localStorage.setItem(MARKING_KEY, JSON.stringify(allData[0]))
        x = allData[0][0];
        y = allData[0][1];
        id = allData[0][2];
        displayWholeAttempt();
    }
    else
    {
        attemptData = JSON.parse(localStorage.getItem(MARKING_KEY));
        x = attemptData[0];
        y = attemptData[1];
        id = attemptData[2];
        displayWholeAttempt();
    }
}
else if (mode == "single")
{
    attemptData = localStorage.getItem(MARKING_KEY);

    // Keep track of min
    for (let i = 0; i < assignment.questions.length; i++)
    {
        if (assignment.questions[i].type == "Text Response")
        {
            min = i;
            break;
        }
    }

    // Keep track of max
    for (let i = 0; i < assignment.questions.length; i++)
    {
        if (assignment.questions[i].type == "Text Response")
        {
            max = i;
        }
    }

    if (attemptData == "undefined" || attemptData == null || attemptData == "")
    {
        localStorage.setItem(MARKING_KEY, min)
        displaySingleQuestion();
    }
    else
    {
        displaySingleQuestion();
    }
}

showPanel()

// Can only submit in whole assignment mode (a measure of checking all fields have been answered)



// Submit function (most data is already in the attempt class due to event listeners)



// for (let i = 0; i < unit.students.length; i++)
// {
//     let attObject = unit.students[i].attempts;
//     for (let t = 0; t < unit.weeks.length; t++)
//     {
//         for (let j = 0; j < unit.weeks[t].assignments.length; j++)
//         {
//             let name = unit.weeks[t].assignments[j].name;
//             let arr = attObject[name]
//             if (arr == undefined)
//             {
//                 continue
//             }
//             for (let k = 0; k < arr.length; k++)
//             {
//                 let attempt = arr[k];
//                 let newArr = []
//                 for (let q in unit.weeks[t].assignments[j].questions)
//                 {
//                     if (unit.weeks[t].assignments[j].questions[q].type == "Text Response")
//                     {
//                         newArr.push(["", ""])
//                     }
//                 }
//                 attempt.textResponseFeedback = newArr;
//             }
//         }
//     }
// }
// updateLocalStorage(unit)