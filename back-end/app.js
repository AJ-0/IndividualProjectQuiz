const http = require('http');

const mysql = require('mysql');
// Create connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'adrianes_nodemysql',
    password: 'Wr7J1A89V5Gd4yXB',
    database: 'adrianes_individualProjectQuiz'
});

let server = http.createServer( function (req, res) {
    res.writeHead(200, {
        'Content-type':'text/html',
        'Access-Control-Allow-Origin':'*'
    });
    pool.getConnection( function (err, db) {
        if (err) throw err;

        switch(req.method) {
            case 'GET':
                let str = `{"questions":{`;
                db.query("SELECT * FROM `Questions`", function (err, result) {
                    if (err) throw err;
                    let escapedString;
                    for (let i = 0; i < result.length; i++) {
                        escapedString = result[i].QuestionText.escapeSpecialChars();
                        str += `"${i+1}":{"qId":${result[i].QuestionID},"qStr":"${escapedString}"}`;
                        if ((i+1) != result.length) str += ',';
                    }
                    str += `},"answers": {`;
                });
                db.query("SELECT * FROM `Answers`", function (err, result) {
                    if (err) throw err;
                    for (let i = 0; i < result.length; i++) {
                        str += `"${i+1}":{"qId":${result[i].QuestionID},"aStr":"${result[i].AnswerText.escapeSpecialChars()}","aBool":${result[i].Correct}}`;
                        if ((i+1) != result.length) str += ',';
                    }
                    str += '}}';
                    res.end(str);
                    db.close();
                })
                break;

            case 'POST':
                let body = '';
                let jsonObj;
                let func, qNum;
                req.on('data', function(data) {
                    body += data;
                    // The data recieved is a json string with two
                    // characters at the end. The two characters represent the
                    // function and the question number.
                    func = body.substring(body.length - 2, body.length - 1);
                    qNum = body.substring(body.length - 1, body.length);
                    jsonObj = JSON.parse(body.slice(0, -2));

                    switch (func) {
                        case 'c': //Create
                            let createQuery = `INSERT INTO \`Questions\`(\`QuestionText\`) VALUES ("")`;
                            let createAnswerQuery;
                            db.query(createQuery, function (err, results) {
                                if (err) throw err;
                                insertId = results['insertId'];
                                createAnswerQuery = `INSERT INTO \`Answers\`(\`QuestionID\`, \`AnswerText\`, \`Correct\`) VALUES ("${insertId}","",1)`;
                                db.query(createAnswerQuery, function (err) {
                                    if (err) throw err;
                                });
                                createAnswerQuery = `INSERT INTO \`Answers\`(\`QuestionID\`, \`AnswerText\`, \`Correct\`) VALUES ("${insertId}","",0)`;
                                db.query(createAnswerQuery, function (err) {
                                    if (err) throw err;
                                });
                            });
                            
                            break;

                        case 'u': //Update
                            let updateQuery = `UPDATE \`Questions\` SET \`QuestionText\` = "${jsonObj.questions[qNum].qStr.escapeSpecialChars()}" WHERE \`QuestionID\` = ${jsonObj.questions[qNum].qId}`;
                            db.query(updateQuery, function (err) {
                                if (err) throw err;
                            });
                            let deleteAnswersQuery = `DELETE FROM \`Answers\` WHERE \`Answers\`.\`QuestionID\` = ${jsonObj.questions[qNum].qId}`;
                            db.query(deleteAnswersQuery, function (err) {
                                if (err) throw err;
                            });
                            let insertAnswerQuery;
                            for (const a in jsonObj.answers) {
                                if (jsonObj.answers[a].qId == jsonObj.questions[qNum].qId) {
                                    insertAnswerQuery = `INSERT INTO \`Answers\`(\`QuestionID\`, \`AnswerText\`, \`Correct\`) VALUES ("${jsonObj.questions[qNum].qId}","${jsonObj.answers[a].aStr.escapeSpecialChars()}",${jsonObj.answers[a].aBool})`;
                                    db.query(insertAnswerQuery, function (err) {
                                        if (err) throw err;
                                    }); 
                                }
                            }
                            break;
                    
                        case 'd': //Delete
                            let deleteQuery = `DELETE FROM \`Questions\` WHERE \`Questions\`.\`QuestionID\` = ${jsonObj.questions[qNum].qId}`;
                            db.query(deleteQuery, function (err) {
                                if (err) throw err;
                            });
                            break;
                    }
                });
                req.on('end', function() {
                    res.end('Successfully stored the new data.');
                });
                break;
        }
    });
});
server.listen();

String.prototype.escapeSpecialChars = function() {
    return this.replace(/[\r\n]+/gm, "\\n")
               .replace(/[\n]+/gm, "\\n")
               .replace(/[\"]+/gm, '\\"');
};