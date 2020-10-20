const http = require("http");
const mysql = require("mysql");
const url = require("url");

// Using JawsDB MySQL on Heroku
const db = mysql.createPool(process.env.JAWSDB_URL);

http.createServer(function (req, res) {
    let q = url.parse(req.url, true);
    
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
    });
    
    if (q.query.name && q.query.score) {
        // For inserting user's information into the database
        let sqlCommand = `INSERT INTO leaderboard(name, score) VALUES('${q.query.name}', ${q.query.score})`;
        db.query(sqlCommand, function(err, results) {
            if (err) {
                throw err;
            }
            console.log("Data Inserted");
            let inserted_id = results.insertId;
            res.write(inserted_id.toString());
            res.end();
        });
    } else if (q.query.scoreID) {
        // For retreiving rank information of a user
        let sqlCommand = `SELECT * FROM (SELECT RANK() OVER (ORDER BY score DESC) as num, scoreID, name, score FROM leaderboard) as t WHERE t.scoreID = '${q.query.scoreID}'`;
        db.query(sqlCommand, function(err, results) {
            if (err) {
                throw err;
            }
            let rank = results[0].num;
            let name = results[0].name;
            let score = results[0].score;
            let returnStr = `<div>Your Rank: ${rank}</div><div>Name: ${name}</div><div>Score: ${score}</div>`;
            res.write(returnStr);
            res.end();
        });
    } else {
        // For displaying top 5 users
        db.query(`SELECT * FROM (SELECT RANK() OVER (ORDER BY score DESC) as num, scoreID, name, score FROM leaderboard) as t ORDER BY score DESC LIMIT 5`, function (err, results) {
            if (err) {
                throw err;
            }
            let scoreTable = "<table><tr><th>Rank</th><th>Name</th><th>Score</th></tr>";
            for (let i = 0; i < results.length; i++) {
                scoreTable += "<tr><td>" + results[i].num +"</td><td>" + results[i].name + "</td><td>" + results[i].score + "</td></tr>";
            }
            scoreTable += "</table>";
            res.write(scoreTable);
            res.end();
        });
    }

}).listen(process.env.PORT);
