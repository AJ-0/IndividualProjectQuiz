readData();

// Global variables
let jsonObj;

function readData() {
    //add loading symbol
    document.getElementById('quizId').innerHTML = `<img src="img/loading.jpg" alt="loadingSymbol" class="loading-symbol">`;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let jsonString = this.responseText;
            jsonObj = JSON.parse(jsonString);
            
            createQuiz(jsonObj);
        }
    };
    xhttp.open('GET', 'https://adrian-esau.com/quizApp', true);
    xhttp.send();
}

//Iterate over each question in the recieved data
function createQuiz(jsonObj) {
    //empty the quiz element
    document.getElementById('quizId').innerHTML = '';

    let answerList;
    let size = 0;
    for (const key in jsonObj.questions) {
        if (jsonObj.questions.hasOwnProperty(key)) size++;
    }
    let quiz = document.getElementById('quizId');
    // If there are no questions, display this text
    if (!size) {
        quiz.innerHTML = 'No questions here...';
    }
    else { // Otherwise, continue generating DOM
        for (const q in jsonObj.questions) {
            answerList = [];
            for (const a in jsonObj.answers) {
                if (jsonObj.answers[a].qId == jsonObj.questions[q].qId) {
                    answerList.push(jsonObj.answers[a].aStr);
                }
            }
            createQuestionHtml(jsonObj.questions[q].qStr, q, answerList);
        }  
        let submitButtonNode = document.createElement('button');
        submitButtonNode.setAttribute('id', 'submitButton');
        submitButtonNode.setAttribute('onclick', 'submitQuiz();');
        submitButtonNode.classList.add('button2');
        submitButtonNode.innerHTML = 'Submit';
        quiz.nextElementSibling.appendChild(submitButtonNode);
    }
    
}

//Creates question and adds it to the HTML DOM
function createQuestionHtml(qStr, qNum, answerList) {
    let qNode = document.createElement('div');
    qNode.classList.add('margin-bottom');
    qNode.classList.add('row');

    let headerNode = document.createElement('h6');
    headerNode.innerHTML = `Question #${qNum}`;
    qNode.appendChild(headerNode);

    let qDivNode = document.createElement('div');
    qDivNode.classList.add('q-div');
    qDivNode.setAttribute('id',`q${qNum}Question`);
    qDivNode.innerHTML = qStr;
    qNode.appendChild(qDivNode);
    
    let tableDivNode = document.createElement('div');
    qNode.appendChild(tableDivNode);

    let tableNode = document.createElement('table');
    tableNode.setAttribute('id',`q${qNum}AnswerTable`);
    tableDivNode.appendChild(tableNode);
    
    let halfBreakNode = document.createElement('div');
    halfBreakNode.classList.add('half-break');
    qNode.appendChild(halfBreakNode);

    document.getElementById('quizId').appendChild(qNode);

    //Add the answer table to the question
    let tableRowNode = document.createElement('tr');
    tableNode.appendChild(tableRowNode);

    let tableHeaderNode = document.createElement('th');
    tableRowNode.appendChild(tableHeaderNode);

    tableHeaderNode = document.createElement('th');
    tableHeaderNode.innerHTML = 'Answers'
    tableRowNode.appendChild(tableHeaderNode);

    //Iterate over each answer for this question and add it to the HTML DOM
    let tableDataNode;
    let i = 0, char;
    for (const a of answerList) {
        //Generate letter list
        char = (i + 10).toString(36);
        i++;

        tableRowNode = document.createElement('tr');

        tableDataNode = document.createElement('td');
        tableDataNode.innerHTML = `${char})`;
        tableRowNode.appendChild(tableDataNode);

        tableDataNode = document.createElement('td');
        tableDataNode.innerHTML = a;
        tableRowNode.appendChild(tableDataNode);
        
        tableDataNode = document.createElement('td');
        tableDataNode.innerHTML = `&nbsp;&nbsp;<input type="radio" name="q${qNum}Radio" id="q${qNum}${char}Radio"></input>`
        tableRowNode.appendChild(tableDataNode);

        tableNode.appendChild(tableRowNode);
    }
}

// Test the results of the quiz
function submitQuiz() {
    let score = 0;
    let quizLength = document.getElementById('quizId').children.length;
    let counter, char, tr;
    for (let i = 1; i <= quizLength; i++) {
        counter = 0;
        for (const a in jsonObj.answers) {
            if (jsonObj.answers[a].qId == jsonObj.questions[String(i)].qId) {
                char = (counter + 10).toString(36);
                counter++;
                tr = document.getElementById(`q${i}${char}Radio`).parentNode.parentNode;
                tr.removeAttribute('class');
                if (document.getElementById(`q${i}${char}Radio`).checked) {
                    if (jsonObj.answers[a].aBool) {
                        tr.classList.add('correct');
                        score++;
                    }
                    else {
                        tr.classList.add('incorrect');
                    }
                }
            }
        }
    }
    modal.style.display = "block";
    // Remove plural 's' when there is only one score or one question
    let a = 's', b = 's';
    if (score == 1) {
        a = '';
    }
    if (quizLength == 1) {
        b = '';
    }
    let percentage = (score / quizLength) * 100;
    document.getElementById('modalText').innerHTML = `You got <b>${score}</b> correct answer${a} out of <b>${quizLength}</b> question${b}.\nPercentage: ${percentage.toFixed(1)}%`;
    // If score is 100%, then add gif
    if (percentage == 100) {
        let img = document.createElement('img');
        img.setAttribute('src', 'img/celebration.gif');
        document.getElementById('modalText').appendChild(img);
    }
}

// Modal functions
let modal = document.getElementById("myModal");
let btn = document.getElementById("submitButton");
let span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}