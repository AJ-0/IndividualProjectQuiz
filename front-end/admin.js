// On page start-up
readData();

// Global variables
let jsonObj;

function writeData(data, func, qNum) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            readData();
        }
    };
    xhttp.open("POST", "https://adrian-esau.com/quizApp", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.send(`${data}${func}${qNum}`);
}

function readData() {
    //add loading symbol
    document.getElementById('quizContent').innerHTML = `<img src="img/loading.jpg" alt="loadingSymbol" class="loading-symbol">`;
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
    document.getElementById('quizContent').innerHTML = '';
    let answerList;
    for (const q in jsonObj.questions) {
        answerList = [];
        for (const a in jsonObj.answers) {
            if (jsonObj.answers[a].qId == jsonObj.questions[q].qId) {
                answerList.push({aStr:jsonObj.answers[a].aStr, aBool:jsonObj.answers[a].aBool});
            }
        }
        createQuestionHtml(jsonObj.questions[q].qStr, q, answerList);
    }
}

//Creates question and adds it to the HTML DOM
function createQuestionHtml(qStr, qNum, answerList) {
    let qNode = document.createElement('div');
    qNode.setAttribute('id', `q${qNum}`);
    qNode.classList.add('row');

    let headerNode = document.createElement('h6');
    headerNode.innerHTML = `Question #${qNum}`;
    qNode.appendChild(headerNode);

    let column1Node = document.createElement('div');
    column1Node.classList.add('col-lg-9', 'col-12');
    qNode.appendChild(column1Node);
    
    let textAreaNode = document.createElement('textarea');
    textAreaNode.setAttribute('id', `q${qNum}Text`);
    textAreaNode.setAttribute('name', `q${qNum}Text`);
    textAreaNode.setAttribute('rows', '5');
    textAreaNode.setAttribute('cols', '98');
    textAreaNode.setAttribute('maxlength', '1000');
    textAreaNode.innerHTML = qStr;
    textAreaNode.oninput = changeQuestion;
    column1Node.appendChild(textAreaNode);

    let halfBreakNode = document.createElement('div');
    halfBreakNode.classList.add('half-break');
    column1Node.appendChild(halfBreakNode);

    let tableNode = document.createElement('table');
    tableNode.setAttribute('id', `q${qNum}AnswerTable`);
    column1Node.appendChild(tableNode);

    halfBreakNode = document.createElement('div');
    halfBreakNode.classList.add('half-break');
    column1Node.appendChild(halfBreakNode);

    let plusMinusDivNode = document.createElement('div');
    plusMinusDivNode.setAttribute('style', `margin-left: 90px;`);
    plusMinusDivNode.innerHTML = '&nbsp;';
    column1Node.appendChild(plusMinusDivNode);

    let minusAnswerNode = document.createElement('button');
    minusAnswerNode.setAttribute('onclick', `deleteAnswer(${qNum});`);
    minusAnswerNode.classList.add('button2');
    minusAnswerNode.innerHTML = '-';
    plusMinusDivNode.prepend(minusAnswerNode);

    let addAnswerNode = document.createElement('button');
    addAnswerNode.setAttribute('onclick', `addAnswer(${qNum});`);
    addAnswerNode.classList.add('button2');
    addAnswerNode.innerHTML = '+';
    plusMinusDivNode.appendChild(addAnswerNode);

    let column2Node = document.createElement('div');
    column2Node.classList.add('col-lg-3', 'col-12');
    qNode.appendChild(column2Node);

    let buttonNode = document.createElement('button');
    buttonNode.setAttribute('class', 'button2');
    buttonNode.setAttribute('onclick', `deleteQuestion(${qNum});`);
    buttonNode.innerHTML = 'Delete';
    column2Node.appendChild(buttonNode);

    halfBreakNode = document.createElement('div');
    halfBreakNode.classList.add('half-break');
    column2Node.appendChild(halfBreakNode);

    let button2Node = document.createElement('button');
    button2Node.setAttribute('class', 'button2');
    button2Node.setAttribute('onclick', `updateQuestion(${qNum});`);
    button2Node.setAttribute('disabled', 'true');
    button2Node.innerHTML = 'Update in DB';
    column2Node.appendChild(button2Node);

    document.getElementById('quizContent').appendChild(qNode);

    //Add the answer table to the question
    let tableRowNode = document.createElement('tr');
    tableNode.appendChild(tableRowNode);

    let tableHeaderNode = document.createElement('th');
    tableRowNode.appendChild(tableHeaderNode);

    tableHeaderNode = document.createElement('th');
    tableHeaderNode.innerHTML = 'Answers'
    tableRowNode.appendChild(tableHeaderNode);
    
    tableHeaderNode = document.createElement('th');
    tableHeaderNode.innerHTML = 'Correct'
    tableRowNode.appendChild(tableHeaderNode);

    //Iterate over each answer for this question and add it to the HTML DOM
    let tableDataNode;
    let char, a;
    for (let i = 0; i < answerList.length; i++) {
        a = answerList[i].aStr;
        //Generate letter list
        char = (i + 10).toString(36);

        tableRowNode = document.createElement('tr');

        tableDataNode = document.createElement('td');
        tableDataNode.innerHTML = `${char})`;
        tableRowNode.appendChild(tableDataNode);

        tableDataNode = document.createElement('td');
        tableDataNode.innerHTML = `<input type="text" id="q${qNum}${char}" value="${a}" maxlength="255">`;
        tableDataNode.oninput = changeAnswer;
        tableRowNode.appendChild(tableDataNode);
        
        tableDataNode = document.createElement('td');
        if (answerList[i].aBool) {
            tableDataNode.innerHTML = `&nbsp;<input type="radio" name="q${qNum}Radio" id="q${qNum}${char}Radio" checked="checked"></input>`
        } 
        else {
            tableDataNode.innerHTML = `&nbsp;<input type="radio" name="q${qNum}Radio" id="q${qNum}${char}Radio"></input>`
        }
        tableDataNode.oninput = changeAnswer;
        tableRowNode.appendChild(tableDataNode);

        tableNode.appendChild(tableRowNode);
    }
}

// Add a multiple choice answer to specific question
// num - Question number
function addAnswer(num) {
    let table = document.getElementById(`q${num}AnswerTable`);
    let tableRow;
    let tableData;
    let char = (table.rows.length + 9).toString(36);
    // Makes sure that there are no more than 4 answers
    if (table.rows.length < 5) {
        tableRow = document.createElement('tr');

        tableData = document.createElement('td');
        tableData.innerHTML = `${char})`;
        tableRow.appendChild(tableData);

        tableData = document.createElement('td');
        tableData.innerHTML = `<input type="text" id="q${num}${char}" value="" maxlength="255">`;
        tableRow.appendChild(tableData);
        
        tableData = document.createElement('td');
        tableData.innerHTML = `&nbsp;<input type="radio" name="q${num}Radio" id="q${num}${char}Radio"></input>`
        
        
        tableRow.appendChild(tableData);

        table.appendChild(tableRow);
    }
    // Enables update button
    table.parentNode.nextSibling.lastChild.removeAttribute('disabled');
}

// Delete a multiple choice answer from question in DOM
// num - Question number
function deleteAnswer(num) {
    let table = document.getElementById(`q${num}AnswerTable`);
    // Makes sure that there are at least 2 answers
    if (table.rows.length-1 > 2) {
        // On deletion of a checked radio, check the answer above it
        let deletedCheckedAnswer;
        if (table.lastChild.lastChild.lastChild.checked) {
            deletedCheckedAnswer = true;
        }
        table.lastChild.remove();
        if (deletedCheckedAnswer) {
            table.lastChild.lastChild.lastChild.checked = true;
        }
    }
    // Enables update button
    table.parentNode.nextSibling.lastChild.removeAttribute('disabled');
}

// Delete a question from the database and reload quiz
// num - Question number
function deleteQuestion(num) {
    let jsonString = JSON.stringify(jsonObj);
    writeData(jsonString, 'd', num);
}

// Send new data to the database and reload quiz
// num - Question number
function updateQuestion(num) {
    // Update question string value
    jsonObj.questions[num].qStr = document.getElementById(`q${num}Text`).value;
    let answersLength = document.getElementById(`q${num}AnswerTable`).rows.length - 1;
    // Remove all answers from the json object
    for (const a in jsonObj.answers) {
        if (jsonObj.answers[a].qId == jsonObj.questions[num].qId) {
            delete jsonObj.answers[a];
        }
    }
    // Loop through the DOM and add 
    let char, aStrTemp, aBoolTemp;
    for (let i = 1; i <= answersLength; i++) {
        char = (i + 9).toString(36);
        aStrTemp = document.getElementById(`q${num}${char}`).value;
        if (document.getElementById(`q${num}${char}Radio`).checked) {
            aBoolTemp = 1;
        }
        else {
            aBoolTemp = 0;
        }
        jsonObj.answers[`${i+answersLength}`] = {qId:jsonObj.questions[num].qId, aStr:aStrTemp, aBool:aBoolTemp};
    }
    let jsonString = JSON.stringify(jsonObj);
    writeData(jsonString, 'u', num);
}

// Adds a question in the DOM
function createQuestion() {
    let jsonString = JSON.stringify(jsonObj);
    // Calculate the new question number
    let quiz = document.getElementById('quizContent');
    let qNum = String(quiz.children.length + 1);
    writeData(jsonString, 'c', qNum);
}

// Enables update button
function changeQuestion() {
    this.parentNode.nextSibling.lastChild.removeAttribute('disabled');
}
function changeAnswer() {
    this.parentNode.parentNode.parentNode.nextSibling.lastChild.removeAttribute('disabled');
}

