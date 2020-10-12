let numRow = MIN_SQUARE;
let numCol = MIN_SQUARE;
let numCorrect = MIN_SQUARE;
let numTrial = 1;
let score = 0;
let squareArray = [];
let correctSquareIndex = [];
let wrongSquares = [];
let counter = 0;

function Square(className, color, index, isCorrect, isClicked) {
    this.className = className;
    this.color = color;
    this.index = index;
    this.isCorrect = isCorrect;
    this.isClicked = isClicked;
    this.createSquare = function () {
        let sq = document.createElement("div");
        sq.classList.add(this.className);
        sq.style.backgroundColor = this.color;
        sq.setAttribute("data-index", this.index);
        sq.setAttribute("data-is-correct", this.isCorrect);
        sq.setAttribute("data-is-clicked", this.isClicked);

        return sq;
    };
}

function startGame() {
    displayUserInfo();
    generateBoard();
}

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
                "false"
            );
            let squareDiv = square.createSquare();
            row.appendChild(squareDiv);
            squareArray.push(squareDiv);
            squareDiv.addEventListener("click", flipSquare);
        }
    }

    while (correctSquareIndex.length < numCorrect) {
        let randomNumber = Math.floor(Math.random() * squareArray.length);
        if (!correctSquareIndex.includes(randomNumber)) {
            correctSquareIndex.push(randomNumber);
        }
    }

    for (let i = 0; i < numCorrect; i++) {
        let correctSquare = squareArray[correctSquareIndex[i]];
        correctSquare.dataset.isCorrect = "true";
    }

    revealAnswer();
}

function revealAnswer() {
    for (let i = 0; i < squareArray.length; i++) {
        if (squareArray[i].dataset.isCorrect === "true") {
            squareArray[i].style.backgroundColor = CORRECT_SQUARE_COLOR;
        }
    }

    setTimeout(function () {
        for (let i = 0; i < squareArray.length; i++) {
            squareArray[i].style.backgroundColor = DEFAULT_SQUARE_COLOR;
        }

        rotateBoard();
    }, 1500);
}

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
        } else if (squareIsCorrect === "false") {
            this.setAttribute("data-is-clicked", "true");
            this.style.backgroundColor = WRONG_SQUARE_COLOR;
            score--;
            updateUserInfo();

            if (score <= 0) {
                gameLost();
            }
        }

        if (correctSquareIndex.includes(Number(sqIndex))) {
            counter++;
        } else {
            wrongSquares.push(sqIndex);
        }
    }

    if (counter === numCorrect && wrongSquares.length === 0) {
        counter = 0;
        setTimeout(goToNextLevel, 500);
    } else if (counter === numCorrect && wrongSquares.length > 0) {
        counter = 0;
        setTimeout(goToPreviousLevel, 500);
    }
}

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
}

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
    wrongSquares = [];
    updateUserInfo();
    generateBoard();
}

function rotateBoard() {
    let board = document.getElementById("board");
    board.style.transition = "transform 1.5s";
    board.style.transform += "rotate(90deg)";
}

function displayUserInfo() {
    let userInfoDiv = document.getElementById("dashboard");
    let currentTiles = document.createElement("div");
    let currentTrial = document.createElement("div");
    let currentScore = document.createElement("div");

    currentTiles.classList.add("userInfo");
    currentTrial.classList.add("userInfo");
    currentScore.classList.add("userInfo");

    currentTiles.innerHTML = DASHBOARD_TILES + numCorrect;
    currentTrial.innerHTML = DASHBOARD_TRIAL + numTrial;
    currentScore.innerHTML = DASHBOARD_SCORE + score;

    userInfoDiv.appendChild(currentTiles);
    userInfoDiv.appendChild(currentTrial);
    userInfoDiv.appendChild(currentScore);
}

function updateUserInfo() {
    let currentUserInfo = document.getElementsByClassName("userInfo");
    currentUserInfo[0].innerHTML = DASHBOARD_TILES + numCorrect;
    currentUserInfo[1].innerHTML = DASHBOARD_TRIAL + numTrial;
    currentUserInfo[2].innerHTML = DASHBOARD_SCORE + score;
}

function gameLost() {
    if (confirm(GAME_LOST_MSG)) {
        numRow = MIN_SQUARE;
        numCol = MIN_SQUARE;
        numCorrect = MIN_SQUARE;
        numTrial = 1;
        score = 0;
        squareArray = [];
        correctSquareIndex = [];
        wrongSquares = [];
        counter = 0;
        generateBoard();
    } else {
    }
}

function terminateGame() {
    if (confirm(TERMINATE_GAME_MSG)) {
        localStorage.setItem("score", score);
        window.location.href = PATH_TO_SUMMARY;
    } else {
    }
}

function displaySummary() {
    let summary = document.getElementById("dashboard-summary");
    let userScore = document.createElement("div");
    let currentScore = localStorage.getItem("score");

    userScore.classList.add("userInfo");
    userScore.innerHTML = DASHBOARD_SCORE + currentScore;

    summary.appendChild(userScore);
}

function restartGame() {
    window.location.href = PATH_TO_INDEX;
}

function submitSummary() {}
