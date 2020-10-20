let numRow = MIN_SQUARE; // number of rows
let numCol = MIN_SQUARE; // number of columns
let numCorrect = MIN_SQUARE; // number of correct squares
let numTrial = 1; // number of trials
let score = 0; // score earned
let squareArray = []; // holds all squares
let correctSquareIndex = []; // holds the indices of correct squares
let wrongSquareIndex = []; // holds the indices of wrong squares clicked
let counter = 0; // counts the number of correct squares clicked

/**
 * Represents the Square object
 * @param {String} className square div class name
 * @param {String} color color of the square
 * @param {Number} index index of the square
 * @param {String} isCorrect tells if the square is the correct square
 * @param {String} isClicked tells if the square has been clicked or not
 */
function Square(className, color, index, isCorrect, isClicked) {
    this.className = className;
    this.color = color;
    this.index = index;
    this.isCorrect = isCorrect;
    this.isClicked = isClicked;
    this.createSquareDiv = function () {
        let squareDiv = document.createElement("div");
        squareDiv.classList.add(this.className);
        squareDiv.style.backgroundColor = this.color;
        squareDiv.setAttribute("data-index", this.index);
        squareDiv.setAttribute("data-is-correct", this.isCorrect);
        squareDiv.setAttribute("data-is-clicked", this.isClicked);

        return squareDiv;
    };
}

/**
 * Starts the game
 */
function startGame() {
    displayUserInfo();
    generateBoard();
}

/**
 * Generates the board according to the number of rows and columns and assigns correct squares
 */
function generateBoard() {
    document.getElementById("board").innerHTML = "";

    for (let i = 0; i < numRow; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        document.getElementById("board").appendChild(row);

        for (let j = 0; j < numCol; j++) {
            let square = new Square(
                "square",
                DEFAULT_SQUARE_COLOR,
                i * numCol + j,
                "false",
                "true" // initially set to "true" to make sure the user does not click before the board gets rotated
            );
            let squareDiv = square.createSquareDiv();
            row.appendChild(squareDiv);
            squareArray.push(squareDiv);
            squareDiv.addEventListener("click", flipSquare);
        }
    }

    // Correct squares are assigned randomly and indices are pushed to an array
    while (correctSquareIndex.length < numCorrect) {
        let randomNumber = Math.floor(Math.random() * squareArray.length);
        if (!correctSquareIndex.includes(randomNumber)) {
            correctSquareIndex.push(randomNumber);
        }
    }

    // Gets the correct squares from the array and resets their attributes
    for (let i = 0; i < numCorrect; i++) {
        let correctSquare = squareArray[correctSquareIndex[i]];
        correctSquare.dataset.isCorrect = "true";
    }

    revealAnswer();
}

/**
 * Reveals the answer for 1.5 seconds and hides the answers again.
 * Board is rotates afterwards.
 */
function revealAnswer() {
    for (let i = 0; i < squareArray.length; i++) {
        if (squareArray[i].dataset.isCorrect === "true") {
            squareArray[i].style.backgroundColor = CORRECT_SQUARE_COLOR;
        }
    }

    setTimeout(function () {
        rotateBoard();
        for (let i = 0; i < squareArray.length; i++) {
            squareArray[i].style.backgroundColor = DEFAULT_SQUARE_COLOR;
            squareArray[i].setAttribute("data-is-clicked", "false"); // resets the attribute to make the squares clickable
        }
    }, 1500);
}

/**
 * Flips the square and checks if the square is correct or not.
 * Clicked squares will show their colors and play sounds according to their attributes
 * If score is less than or equal to 0, the game gets terminated.
 * Otherwise, the user will proceed to next/previous level.
 */
function flipSquare() {
    let squareIsCorrect = this.getAttribute("data-is-correct");
    let squareIsClicked = this.getAttribute("data-is-clicked");
    let sqIndex = this.getAttribute("data-index");

    if (squareIsClicked === "false") {
        if (squareIsCorrect === "true") {
            this.setAttribute("data-is-clicked", "true");
            this.style.backgroundColor = CORRECT_SQUARE_COLOR;
            score++;
            updateUserInfo();
            playAudio(CORRECT_CLICK);
        } else if (squareIsCorrect === "false") {
            this.setAttribute("data-is-clicked", "true");
            this.style.backgroundColor = WRONG_SQUARE_COLOR;
            score--;
            updateUserInfo();
            playAudio(WRONG_CLICK);
        }

        if (correctSquareIndex.includes(Number(sqIndex))) {
            counter++;
        } else {
            wrongSquareIndex.push(sqIndex);
        }

        if (score <= 0) {
            gameLost();
        } else {
            if (counter === numCorrect && wrongSquareIndex.length === 0) {
                counter = 0;
                setTimeout(goToNextLevel, 500);
            } else if (counter === numCorrect && wrongSquareIndex.length > 0) {
                counter = 0;
                setTimeout(goToPreviousLevel, 500);
            }
        }
    }
}

/**
 * Proceeds to the next level.
 * Number of correct squares to guess, or number of rows/columns will increase.
 */
function goToNextLevel() {
    if (numRow < MAX_SQUARE || numCol < MAX_SQUARE) {
        if (numCorrect <= squareArray.length / 3) {
            numCorrect++;
        } else {
            if (numRow < numCol) {
                numRow++;
            } else {
                numCol++;
            }
        }
    }

    numTrial++;
    squareArray = [];
    correctSquareIndex = [];
    updateUserInfo();
    generateBoard();
    playAudio(NEXT_LEVEL);
}

/**
 * Proceeds to the previous level.
 * Number of correct squares to guess, or number of rows/columns will decrease.
 */
function goToPreviousLevel() {
    if (numRow > MIN_SQUARE || numCol > MIN_SQUARE) {
        if (numCorrect >= squareArray.length / 4) {
            numCorrect--;
        } else {
            if (numRow > numCol) {
                numRow--;
            } else {
                numCol--;
            }
        }
    }

    squareArray = [];
    correctSquareIndex = [];
    wrongSquareIndex = [];
    updateUserInfo();
    generateBoard();
    playAudio(NEXT_LEVEL);
}

/**
 * Rotates the board that holds all the squares.
 */
function rotateBoard() {
    let board = document.getElementById("board");
    board.style.transition = "transform 1.5s";
    board.style.transform += "rotate(90deg)";
}

/**
 * Displays the user info in the dashboard.
 */
function displayUserInfo() {
    let userInfoDiv = document.getElementById("dashboard");
    let currentTiles = document.createElement("div");
    let currentTrial = document.createElement("div");
    let currentScore = document.createElement("div");

    currentTiles.classList.add("user-info");
    currentTrial.classList.add("user-info");
    currentScore.classList.add("user-info");

    currentTiles.innerHTML = DASHBOARD_TILES + numCorrect;
    currentTrial.innerHTML = DASHBOARD_TRIAL + numTrial;
    currentScore.innerHTML = DASHBOARD_SCORE + score;

    userInfoDiv.appendChild(currentTiles);
    userInfoDiv.appendChild(currentTrial);
    userInfoDiv.appendChild(currentScore);
}

/**
 * Updates the user info in the dashboard.
 */
function updateUserInfo() {
    let currentUserInfo = document.getElementsByClassName("user-info");
    currentUserInfo[0].innerHTML = DASHBOARD_TILES + numCorrect;
    currentUserInfo[1].innerHTML = DASHBOARD_TRIAL + numTrial;
    currentUserInfo[2].innerHTML = DASHBOARD_SCORE + score;
}

/**
 * When user scores less than or equal to 0, user has a choice to restart the game, or end the game.
 */
function gameLost() {
    if (confirm(GAME_LOST_MSG)) {
        // restart the game
        restartGame();
    } else {
        // game gets terminated and user cannot click on any other squares.
        for (let i = 0; i < squareArray.length; i++) {
            squareArray[i].setAttribute("data-is-clicked", "true");
        }
    }
}

/**
 * User can either go to the Summary page to submit his score, or continue play the game
 */
function terminateGame() {
    if (confirm(TERMINATE_GAME_MSG)) {
        // go to the Summary page to submit the score
        localStorage.setItem("score", score);
        window.location.href = PATH_TO_SUMMARY;
    } else {
        // continue play the game
    }
}

/**
 * Plays the audio
 * @param {String} path path to the audio file
 */
function playAudio(path) {
    let audio = new Audio(path);
    audio.play();
}

/**
 * Displays the user's score in the dashboard in the Summary page
 */
function displaySummary() {
    let summary = document.getElementById("dashboard-summary");
    let userScore = document.createElement("div");
    let currentScore = localStorage.getItem("score");

    userScore.classList.add("user-info");
    userScore.innerHTML = DASHBOARD_SCORE + currentScore;

    summary.appendChild(userScore);
}

/**
 * Restart the game.
 */
function restartGame() {
    numRow = MIN_SQUARE;
    numCol = MIN_SQUARE;
    numCorrect = MIN_SQUARE;
    numTrial = 1;
    score = 0;
    squareArray = [];
    correctSquareIndex = [];
    wrongSquareIndex = [];
    counter = 0;
    updateUserInfo();
    generateBoard();
}

/**
 * Return to the Index page to play the game again.
 */
function returnToGame() {
    window.location.href = PATH_TO_INDEX;
}

function submitData() {
    let xhttp = new XMLHttpRequest();
    let score = localStorage.getItem("score");
    let name = document.getElementById("name-input").value;
    localStorage.setItem("name", name);
    if (name !== null && name !== "") {
        xhttp.open("GET", "https://memorygame-db.herokuapp.com/?name=" + name + "&score=" + score, true);
        // xhttp.open("GET", "http://localhost:8888/?name=" + name + "&score=" + score, true);
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                localStorage.setItem("scoreID", this.responseText);
                window.location.href = PATH_TO_LEADERBOARD;
            }
        };
    } else {
        alert("Name must be filled in!");
    }
}

function loadLeaderboard() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://memorygame-db.herokuapp.com/", true);
    // xhttp.open("GET", "http://localhost:8888/", true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById(
                "container"
            ).innerHTML = this.responseText;
            displayUserRank();
        }
    };
}

function displayUserRank() {
    let xhttp = new XMLHttpRequest();
    // let name = localStorage.getItem("name");
    let scoreID = localStorage.getItem("scoreID");
    xhttp.open("GET", "https://memorygame-db.herokuapp.com/?scoreID=" + scoreID, true);
    // xhttp.open("GET", "http://localhost:8888/?rank=1&name=" + name, true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("dashboard-rank").innerHTML = this.responseText;
        }
    }
}