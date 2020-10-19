const http = require("http");
const mysql = require("mysql");
const url = require("url");

// Create connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp4537",
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



// conn.connect(function (err) {
//     if (err) {
//         throw err;
//     }
//     console.log("Connected to MySQL");
// });

// conn.query(`Select * from score`, function(err, results, fields) {
//     if (err) {
//         throw err;
//     }
//     console.log(results);
// });

// conn.end();

// let http = require("http");
// let url = require('url');
// let dt = require("./myModule");

// http.createServer(function (req, res) {
//     let q = url.parse(req.url, true);
//     res.writeHead(200, {
//         "Content-Type": "text/html",
//         "Access-Control-Allow-Origin": "*",
//     });
//     res.write("Hello " + q.query.name + ", the current server time is " + dt.getCurrentTime());
//     res.end();
// }).listen(process.env.PORT);
