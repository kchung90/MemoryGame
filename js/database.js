const http = require("http");
const mysql = require("mysql");
const url = require("url");

// http.createServer(function (req, res) {
//     res.writeHead(200, {"Content-Type": "text/plain"});
//     res.end("Hello World");
// }).listen(process.env.PORT);

const db = mysql.createConnection({
    host: "us-cdbr-east-02.cleardb.com",
    user: "ba6b03a3eba02a",
    password: "fc06b754",
    database: "heroku_37412a89fd8ee50",
});

http.createServer(function (req, res) {
    let q = url.parse(req.url, true);
    let scoreTable = "<table><tr><th>Rank</th><th>Name</th><th>Score</th></tr>";
    
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
        });
    }

    db.query(`SELECT * FROM leaderboard ORDER BY score DESC LIMIT 5`, function (err, results) {
        if (err) {
            throw err;
        }
        for (let i = 0; i < results.length; i++) {
            scoreTable += "<tr><td>" + (i + 1) +"</td><td>" + results[i].name + "</td><td>" + results[i].score + "</td></tr>";
        }
        scoreTable += "</table>";
        res.write(scoreTable);
        res.end();
    });
}).listen(process.env.PORT);
