"use strict";

// display questions with feedback underneath
function displayQuestions()
{
    // Do question html (use randomOrderGenerator for MCQ options)
    let output = "";
    let textResponseCount = -1;

    output += `<h2>${assignment.name}</h2>`;
    let questionArr = assignment.questions;

    for (let i = 1; i < questionArr.length + 1; i++)
    {
        let q = questionArr[i - 1];
        let response = attempt.responses[i - 1]
        output +=   `<section id="section-q${i}">`;
        
        if (q.type == "Multiple Choice")
        {
            let mark = 0;
            if (response == q.options[0])
            {
                mark = q.marks;
            }
            output +=   `<h4><b>Question ${i}</b> (${mark}/${q.marks} marks)</h4>
                        <p>${q.text}</p>`;

            // Find valid number of options non-""
            let count = 0;
            for (let t = 0; t < q.options.length; t++)
            {
                if (q.options[t] != "")
                {
                    count += 1;
                }
            }

            let order = randomOrderGenerator(count);
            for (let j = 0; j < order.length; j++)
            {
                let idx = order[j]
                let option = q.options[idx]
                let checked = "";
                if (option == response)
                {
                    checked = "checked";
                }
                output +=   `<input type="radio" id="option-${i}-${idx}" name="q${i}" value="${option}" ${checked} disabled>
                            <label for="option-${i}-${idx}" disabled>${option}</label><br>`
            }
        }
        else if (q.type == "Text Response")
        {
            textResponseCount += 1;
            output +=   `<h4><b>Question ${i}</b> (${attempt.textResponseFeedback[textResponseCount][0]}/${q.marks} marks)</h4>
                        <p>${q.text}</p>
                            <textarea id="q${i}" name="q${i}" rows="6" cols="100" disabled>${response}</textarea>
                            <br>`;
        }
        
        output +=   `</section><br>`;

        // Feedback
        if (q.type == "Multiple Choice")
        {
            if (response == q.options[0])
            {
                output +=   `<div>
                                <p>Correct!</p>
                                <p>${q.posFeedback}</p>
                            </div>`;
            }
            else
            {
                output +=   `<div>
                                <p>Incorrect.</p>
                                <p>${q.negFeedback}</p>
                                <p>The answer was <b>${q.options[0]}</b>.</p>
                            </div>`;
            }
        }
        else if (q.type == "Text Response")
        {
            if (Number(attempt.textResponseFeedback[textResponseCount][0]) > 0)
            {
                output +=   `<div>
                                <p>Correct.</p>
                                <p>${attempt.textResponseFeedback[textResponseCount][1]}</p>
                            </div>`;
            }
            else
            {
                output +=   `<div>
                                <p>Incorrect.</p>
                                <p>${attempt.textResponseFeedback[textResponseCount][1]}</p>
                            </div>`;
            }
        }
    }
    document.getElementById("questionContent").innerHTML = output;
}

function randomOrderGenerator(start)
{
    // Returns random order for 0,1,2,3,..,num in an array.
    // E.g [2, 1, 0, 3]

    // Create normal array
    let arr = []
    for (let i = 0; i < start; i++)
    {
        arr.push(i)
    }

    let finalArr = [];
    for (let i = start; i > 1; i--)
    {
        let num = Math.floor(Math.random()*i) // returns random integer from 0 to i - 1
        let int = arr[num]
        arr.splice(num, 1)
        finalArr.push(int)
    }
    finalArr.push(arr[0])
    return finalArr
}

// Display buttons with link + back button removing keys
function displayButtons()
{
    let output = "";

    // Add back button
    output +=   `<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="back()" style="float: right;">
                    Back
                </button>
                <br><br><br><br>
                <div id="details"></div>
                <br>`;

    // Add button html with links
    output += `<div class="mdl-grid" style="overflow: auto;">`;
    for (let i = 1; i < assignment.questions.length + 1; i++)
    {
        output +=   `<div class="mdl-cell mdl-cell--3-col">
                        <button class="mdl-button mdl-js-button mdl-button--raised" id="button-q${i}" onclick="location.href='#section-q${i}';" style="background-color: white;">
                            ${i}
                        </button>
                    </div>`;
    }
    output += `</div>`;

    document.getElementById("questionNumber").innerHTML = output;
}

function back()
{
    localStorage.removeItem(ASSIGNMENT_KEY);
    localStorage.removeItem(REVIEW_ATTEMPT_KEY);
    window.location = "index.html";
}

// Display details (mark, date, time)                           ADD IN DATE TO THE SYSTEM
function details()
{
    let markObtained = attempt.mark;
    let timeTaken = attempt.time;

    // Find appropriate phrase for time
    let hours = Math.floor(timeTaken/60);
    let minuteTime = timeTaken - hours*60;
    let minutes = Math.floor(minuteTime);
    let seconds = Math.floor((minuteTime - minutes)*60)
    let phrase = "";
    if (hours != 0)
    {
        phrase = `${hours} hours ${minutes} minutes`;
    }
    else if (minutes != 0)
    {
        phrase = `${minutes} minutes ${seconds} seconds`;
    }
    else if (seconds != 0)
    {
        phrase = `${seconds} seconds`;
    }
    else
    {
        phrase = `${assignment.time} minutes`;
    }

    let detailRef = document.getElementById("details");
    let output = "";
    
    output +=   `<p><b>Time Taken</b>: ${phrase}</p>
                <p><b>Score: <span style="color: red;">${markObtained}/${assignment.total} marks</span></b></p>`;

    detailRef.innerHTML = output;
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
let assignmentData = JSON.parse(localStorage.getItem(ASSIGNMENT_KEY))
assignment.fromData(assignmentData);

// Get attempt details
let attemptNum = localStorage.getItem(REVIEW_ATTEMPT_KEY);
let attempt = user.attempts[assignment.name][attemptNum];

// Display questions with feedback
displayQuestions();

// Dsiplay buttons
displayButtons();

// Display details
details()