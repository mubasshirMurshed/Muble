"use strict"


const UNIT_DATA_KEY = "unitDataKey";
const PERSON_KEY = "title";
const CREATION_KEY = "creation";
const ASSIGNMENT_KEY = "assignment";
const ATTEMPT_KEY = "attemptAssignment";
const REVIEW_ATTEMPT_KEY = "reviewAttempt";
const DISPLAY_KEY = "markingQuestions";
const MARKING_KEY = "studentMarking";

class Person
{
    constructor(firstName, lastName, id = "")
    {
        this._firstName = firstName;
        this._lastName = lastName;
        this._id = id;
        this._title = null;
        this._email = null;
        this._password = null;
        this._attempts = {};
    }

    get firstName()
    {
        return this._firstName;
    }

    get lastName()
    {
        return this._lastName;
    }

    get name()
    {
        return (this._firstName + " " + this._lastName).toUpperCase();
    }

    get id()
    {
        return this._id;
    }

    get title()
    {
        return this._title;
    }

    get email()
    {
        return this._email;
    }

    get password()
    {
        return this._password;
    }

    get attempts()
    {
        return this._attempts;
    }

    set password(pass)
    {
        this._password = pass;
    }

    fromData(data)
    {
        this._firstName = data._firstName;
        this._lastName = data._lastName;
        this._id = data._id;
        this._email = data._email;
        this._title = data._title;
        this._password = data._password;
        
        // Restore attempts
        this._attempts = {}
        for (let key in data._attempts) {
            let arr = data._attempts[key];
            let newArr = [];
            for (let i = 0; i < arr.length; i++) {
                let a = new Attempt();
                a.fromData(arr[i]);
                newArr.push(a);
            }
            this._attempts[key] = newArr;
        }
    }
}

class Student extends Person
{
    constructor(firstName, lastName, id, email)
    {
        super(firstName, lastName, id)
        this._title = "Student";
        this._email = email;
        this._attempts = {};
    }
}

class Teacher extends Person
{
    constructor(firstName, lastName, id, email)
    {
        super(firstName, lastName, id)
        this._title = "Teacher";
        this._email = email;
    }
}

class Lecturer extends Person
{
    constructor(firstName, lastName, id, email)
    {
        super(firstName, lastName, id)
        this._title = "Lecturer";
        this._email = email;
    }
}

// class WeekAssAttempts
// {
//     constructor(number)
//     {
//         this._number = number;
//         this._assAttempts = [];
//     }

//     get number()
//     {
//         return this._number;
//     }

//     get assAttempts()
//     {
//         return this._assAttempts;
//     }

//     fromData(data)
//     {
//         this._number = data._number;

//         // restore assAttempts
//         this._assAttempts = [];
//         for (let i = 0; i < this._assAttempts.length; i++){
//             let a = AttemptList();
//             a.fromData(data._assAttempts[i]);
//             this._assAttempts.push(a);
//         }
//     }
// }

// class AttemptList
// {
//     constructor()
//     {
//         this._attempts = [];
//     }

//     get attempts()
//     {
//         return this._attempts;
//     }

//     fromData(data)
//     {
//         // Restore attempts
//         this._attempts = [];
//         for (let i = 0; i < data._attempts.length; i++) {
//             let att = new Attempt("", "", "", "");
//             att.fromData(data._attempts[i]);
//             this._attempts.push(att);
//         }
//     }
// }

class Attempt
{
    constructor()
    {
        //TODO: unique identifier
        this._time = 0;
        this._responses = [];
        this._mark = 0;
        this._checked = false;
        this._textResponseFeedback = [];
    }

    get time()
    {
        return this._time;
    }

    get responses()
    {
        return this._responses;
    }

    get mark()
    {
        return this._mark;
    }

    get checked()
    {
        return this._checked;
    }

    get textResponseFeedback()
    {
        return this._textResponseFeedback
    }

    set time(time)
    {
        this._time = time;
    }

    set mark(mark)
    {
        this._mark = mark;
    }

    set checked(bool)
    {
        this._checked = bool;
    }

    set textResponseFeedback(feed)
    {
        this._textResponseFeedback = feed;
    }

    fromData(data)
    {
        this._time = data._time;
        this._responses = data._responses;
        this._mark = data._mark;
        this._checked = data._checked;
        this._textResponseFeedback = data._textResponseFeedback;
    }
}


class Unit
{
    constructor(name, code)
    {
        this._name = name;
        this._code = code;
        this._students = [];
        this._teachers = [];
        this._lecturer = null;
        this._weeks = [];
    }

    get name()
    {
        return this._name;
    }

    get code()
    {
        return this._code;
    }

    get students()
    {
        return this._students;
    }

    get teachers()
    {
        return this._teachers;
    }

    get lecturer()
    {
        return this._lecturer;
    }

    get weeks()
    {
        return this._weeks;
    }

    get people()
    {
        let allPeople = this._students.concat(this._teachers);
        allPeople.push(this._lecturer);
        return allPeople;
    }

    set lecturer(lect)
    {
        this._lecturer = lect;
    }

    set weeks(arr)
    {
        this._weeks = arr;
    }

    getAssignment(i, j)
    {
        return this._weeks[i].assignments[j];
    }

    fromData(data)
    {
        // Restor regulars
        this._name = data._name;
        this._code = data._code;

        // Restore students
        this._students = [];
        for (let i = 0; i < data._students.length; i++) {
            let student = new Student("", "", "", "");
            student.fromData(data._students[i]);
            this._students.push(student);
        }

        // Restore teachers
        this._teachers = [];
        for (let i = 0; i < data._teachers.length; i++) {
            let teacher = new Teacher("", "", "", "");
            teacher.fromData(data._teachers[i]);
            this._teachers.push(teacher);
        }

        // Restore lecturer
        this._lecturer = new Lecturer("", "", "", "");
        this._lecturer.fromData(data._lecturer);

        // Restore weeks
        this._weeks = [];
        for (let i = 0; i < data._weeks.length; i++) {
            let week = new Week(0);
            week.fromData(data._weeks[i]);
            this._weeks.push(week);
        }
    }
}

class Week
{
    constructor(number)
    {
        this._number = number;
        this._assignments = [];
    }

    get assignments()
    {
        return this._assignments;
    }

    fromData(data)
    {
        this._number = data._number;
        this._available = data._available;

        // Restore assignments
        this._assignments = []
        for (let i = 0; i < data._assignments.length; i++) {
            let ass = new Assignment();
            ass.fromData(data._assignments[i]);
            this._assignments.push(ass);
        }
    }
}

class Assignment
{
    constructor()
    {
        this._name = "";
        this._total = 0;
        this._time = "";
        this._questions = [];
        this._available = false;
    }

    get available()
    {
        return this._available;
    }

    get questions()
    {
        return this._questions;
    }

    get name()
    {
        return this._name;
    }

    get time()
    {
        return this._time;
    }

    get length()
    {
        return this._questions.length;
    }

    get total()
    {
        return this._total;
    }

    set name(name)
    {
        this._name = name;
    }

    set time(time)
    {
        this._time = time;
    }

    set total(num)
    {
        this._total = num;
    }

    set available(gate)
    {
        this._available = gate;
    }

    fromData(data)
    {
        this._name = data._name;
        this._total = data._total;
        this._time = data._time;
        this._available = data._available;

        // Restore questions
        this._questions = [];
        for (let i = 0; i < data._questions.length; i++) {
            let q = new Question();
            q.fromData(data._questions[i]);
            this._questions.push(q);
        }
    }
}

class Question
{
    constructor(marks, text)
    {
        this._marks = marks;
        this._type = null;
        this._text = text;
        this._options = null;
    }

    get type()
    {
        return this._type;
    }

    get text()
    {
        return this._text;
    }

    get marks()
    {
        return this._marks;
    }

    get posFeedback()
    {
        return this._posFeedback;
    }

    get negFeedback()
    {
        return this._negFeedback;
    }

    get options()
    {
        return this._options;
    }

    set text(text)
    {
        this._text = text;
    }

    set marks(mark)
    {
        this._marks = mark;
    }

    set posFeedback(feed)
    {
        this._posFeedback = feed;
    }

    set negFeedback(feed)
    {
        this._negFeedback = feed;
    }

    fromData(data) 
    {
        this._marks = data._marks;
        this._type = data._type;
        this._text = data._text;
        this._posFeedback = data._posFeedback;
        this._negFeedback = data._negFeedback;
        this._options = data._options;
    }
}

class MultipleChoice extends Question
{
    constructor(marks = "", text = "", options = ["","","",""], negFeedback = "", posFeedback = "")
    {
        super(marks, text);
        this._options = options;
        this._negFeedback = negFeedback;
        this._posFeedback = posFeedback;
        this._type = "Multiple Choice"
    }

    get options()
    {
        return this._options;
    }
}

// class Checkbox extends Question
// {
//     constructor(marks = "", text = "", options = "", answer = "", negFeedback = "", posFeedback = "")
//     {
//         super(marks, text);
//         this._options = options;
//         this._answer = answer;
//         this._negFeedback = negFeedback;
//         this._posFeedback = posFeedback;
//         this._type = "Checkbox"
//     }
// }

class TextResponse extends Question
{
    constructor(marks = "", text = "")
    {
        super(marks, text);
        this._type = "Text Response"
    }
}


function updateLocalStorage(data)
{
    let jsonStr = JSON.stringify(data);
    localStorage.setItem(UNIT_DATA_KEY, jsonStr);
}

function getDataLocalStorage()
{
    // Fetching and Parsing the stored data:
    let jsonData = localStorage.getItem(UNIT_DATA_KEY);
    let data = JSON.parse(jsonData);
    
    // Returning the data:
    return data;
}

function checkIfDataExistsLocalStorage()
{
    let data = JSON.parse(localStorage.getItem(UNIT_DATA_KEY));

    if (data === null ||data === "undefined" || data === "")
    {
        return false;
    }
    else
    {
        return true;
    }
}

function logOutUser()
{
    localStorage.removeItem(PERSON_KEY);
    window.location = "login.html";
}


// ----------------------------- On load ------------------------------------ //


let unit = new Unit("Engineering Mathematics", "ENG1005");

// Checking if data exists in local storage and retrieving it:
if (checkIfDataExistsLocalStorage() == true)
{
    unit.fromData(getDataLocalStorage());
}
else
{
    unit.weeks = [new Week(1), new Week(2), new Week(3), new Week(4), new Week(5), new Week(6), new Week(7), new Week(8), new Week(9), new Week(10), new Week(11), new Week(12)]
    let admin = new Lecturer("Jonathan", "Li", 31505848, "jonathan.li@monash.edu");
    admin.password = "Ohm";    

    unit.lecturer = admin;

    let a = new Assignment();
    a.name = "Pre-Workshop 1";
    a.time = 60;
    a.available = true;
    a.total = 25;

    let q = new TextResponse(25, "What is the meaning of life?")
    a.questions.push(q)

    unit.weeks[0].assignments.push(a)
    
    updateLocalStorage(unit);
}