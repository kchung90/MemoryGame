const http = require("http");
const mysql = require("mysql");
const url = require("url");

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "comp4537",
// });
const db = mysql.createPool({
    host: "us-cdbr-east-02.cleardb.com",
    user: "ba6b03a3eba02a",
    password: "fc06b754",
    database: "heroku_37412a89fd8ee50",
});

http.createServer(function (req, res) {
    let q = url.parse(req.url, true);
    
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
    });
    
    if (q.query.name && q.query.score) {
        let sqlInsert = `INSERT INTO leaderboard(name, score) VALUES('${q.query.name}', ${q.query.score})`;
        db.query(sqlInsert, function(err, results) {
            if (err) {
                throw err;
            }
            console.log("Data Inserted");
            res.end();
        });
    } else if (q.query.rank && q.query.name) {
        db.query(`SELECT RowNumber, name, score FROM (SELECT name, score, ROW_NUMBER() OVER (ORDER BY score DESC) AS 'RowNumber' FROM leaderboard) AS t WHERE t.name='${q.query.name}'`, function(err, results) {
            if (err) {
                throw err;
            }
            let rank = results[0].RowNumber;
            let name = results[0].name;
            let score = results[0].score;
            let returnStr = `<div>Your Rank: ${rank}</div><div>Name: ${name}</div><div>Score: ${score}</div>`;
            res.write(returnStr);
            res.end();
        });
    } else {
        db.query(`SELECT * FROM leaderboard ORDER BY score DESC LIMIT 5`, function (err, results) {
            if (err) {
                throw err;
            }
            let scoreTable = "<table><tr><th>Rank</th><th>Name</th><th>Score</th></tr>";
            for (let i = 0; i < results.length; i++) {
                scoreTable += "<tr><td>" + (i + 1) +"</td><td>" + results[i].name + "</td><td>" + results[i].score + "</td></tr>";
            }
            scoreTable += "</table>";
            res.write(scoreTable);
            res.end();
        });
    }

}).listen(process.env.PORT);
// }).listen(8888);
