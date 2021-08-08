"use strict";

function displayQuestions()
{
    // Do question html (use randomOrderGenerator for MCQ options)
    let output = "";

    output += `<h2>${assignment.name}</h2>`;
    let questionArr = assignment.questions;

    for (let i = 1; i < questionArr.length + 1; i++)
    {
        let q = questionArr[i - 1];
        output +=   `<section id="section-q${i}">
                        <h4><b>Question ${i}</b></h4>`;
        
        if (q.type == "Multiple Choice")
        {
            output +=   `<p>${q.text}  (${q.marks} marks)</p>`;

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
                output +=   `<input type="radio" id="option-${i}-${idx}" name="q${i}" value="${option}">
                            <label for="option-${i}-${idx}">${option}</label><br>`
            }
        }
        else if (q.type == "Text Response")
        {
            output +=   `<p>${q.text}  (${q.marks} marks)</p>
                            <textarea id="q${i}" name="q${i}" rows="6" cols="100"></textarea>
                            <br>`;
            
            attempt.textResponseFeedback.push(["",""]);
        }

        // Add buttons for unsure/flag
        output +=   `<br>
                        <button id="unsure${i}" class="mdl-button mdl-js-button" onclick="addBadge(${i})" style="color: orange; padding-left: 0px">
                            Mark as <b>Unsure</b>
                        </button>
                    </section>`;
    }

    document.getElementById("questionContent").innerHTML = output;

    // Add event listener
    for (let i = 1; i < questionArr.length + 1; i++)
    {
        let optionRefArr = document.getElementsByName(`q${i}`)
        for (let j = 0; j < optionRefArr.length; j++)
        {
            let answerRef = optionRefArr[j]
            answerRef.addEventListener("input", function() {
                updateAttempt(i, j)
            });
        }
    }
}

function addBadge(i)
{
    let badgeRef = document.getElementById(`badge${i}`);
    badgeRef.className = "material-icons mdl-badge mdl-badge--overlap";

    let unsureRef = document.getElementById(`unsure${i}`);
    unsureRef.innerHTML = "<b>Unmark</b>"
    unsureRef.onclick = function () {removeBadge(i)};
}


function removeBadge(i)
{
    let badgeRef = document.getElementById(`badge${i}`);
    badgeRef.className = "";

    let unsureRef = document.getElementById(`unsure${i}`);
    unsureRef.innerHTML = "Mark as <b>Unsure</b>"
    unsureRef.onclick = function () {addBadge(i)};
}


function updateAttempt(i, j)
{
    let optionRefArr = document.getElementsByName(`q${i}`)
    let answerRef = optionRefArr[j]

    attempt.responses[i - 1] = answerRef.value;

    let buttonRef = document.getElementById(`button-q${i}`);
    if (answerRef.value != "")
    {
        buttonRef.style = "background-color: grey; color: white;";
    }
    else
    {
        buttonRef.style = "background-color: white;";
    }
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

function displayButtons()
{
    let output = "";

    // Set up time div
    output +=   `<div id="time" style="float: left;">
                </div>`

    // Add back button
    output +=   `<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="back()" style="float: right;">
                        Back
                    </button>
                <br><br><br><br><br>`;


    // Add button html with links
    output += `<div class="mdl-grid" style="overflow: auto;">`;
    for (let i = 1; i < assignment.questions.length + 1; i++)
    {
        output +=   `<div class="mdl-cell mdl-cell--3-col">
                            <div id="badge${i}" data-badge="">
                                <button class="mdl-button mdl-js-button mdl-button--raised" id="button-q${i}" onclick="location.href='#section-q${i}';" style="background-color: white;">
                                    ${i}
                                </button>
                            </div>
                    </div>`;
    }
    output += `</div>`;
    output += `<br><br><br>`;
    output +=   `<div style="display: flex; justify-content: center;">
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onclick="submitAttempt()">
                        Submit Assignment
                    </button>
                </div>`;

    document.getElementById("questionNumber").innerHTML = output;

    // Start the timer
    startTimer()
}

function startTimer()
{
    // Distinguish between limit and unlimited
    if (timeAllowed != 0)
    {
        displayTime(timeAllowed);

        // Add code for renewal of time
        setInterval(function(){
            timeAllowed -= 1/60;
            displayTime(timeAllowed);
        }, 1000)
    }
}

function displayTime(time)
{
    let hours = Math.floor(time/60)
    let actMinutes = time - hours*60;
    let minutes = Math.floor(actMinutes);
    let seconds = Math.floor((actMinutes - Math.floor(actMinutes))*60);

    if (hours == 0)
    {
        if (Math.floor(minutes) == 0)
        {
            document.getElementById("time").innerHTML = `<b>Time:</b><br>${seconds} secs remaining`;
            if (seconds == 0)
            {
                submitAttempt()
            }
        }
        else
        {
            document.getElementById("time").innerHTML = `<b>Time:</b><br>${minutes} min and ${seconds} secs remaining`;
        }   
    }
    else
    {
        document.getElementById("time").innerHTML = `<b>Time:</b><br>${hours} hours and ${minutes} min remaining`;
    }
}

function submitAttempt()
{
    // Get time taken
    let timeTaken = assignment.time - timeAllowed;
    attempt.time = timeTaken;

    // Mark MCQ and add to total
    let checkedPot = true;
    let total = 0;
    for (let i = 0; i < assignment.questions.length; i++)
    {
        let q = assignment.questions[i];
        
        if (q.type == "Multiple Choice")
        {
            if (attempt.responses[i] == q.options[0])
            {
                total += q.marks;
            }
        }
        else if (q.type == "Text Response")
        {
            checkedPot = false;
        }
    }
    if (checkedPot)
    {
        attempt.checked = checkedPot;
    }
    attempt.mark += total;

    // Add to Student Records
    let allAttempts = user.attempts[assignment.name]
    if (allAttempts == undefined)
    {
        user.attempts[assignment.name] = [attempt];
    }
    else
    {
        user.attempts[assignment.name].push(attempt);
    }

    // Update local storage
    updateLocalStorage(unit);

    // Delete Attempt key
    localStorage.removeItem(ATTEMPT_KEY);

    // Back to home page
    window.location = "index.html";
}

function back()
{
    localStorage.removeItem(ATTEMPT_KEY);
    window.location = "index.html";
}


// -------------- ON LOAD -------------------- //


// Get user
let data = JSON.parse(localStorage.getItem(PERSON_KEY));
let user = unit.students[data[1]]

document.getElementById("name").innerHTML = `Welcome, ${user.name}, ${user.id}`;

// Get assignment
let assignment = new Assignment();
let assData = JSON.parse(localStorage.getItem(ATTEMPT_KEY));
assignment.fromData(assData);
let timeAllowed = assignment.time

// Create attempt
let attempt = new Attempt();

// Add empty responses
for (let i = 0; i < assignment.questions.length; i++)
{
    attempt.responses.push("");
}

// Display questions
displayQuestions()

// Display linking buttons
displayButtons()