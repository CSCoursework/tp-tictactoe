// Constants
const noughts = "O";
const crosses = "X";
const winningCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [2,5,8], [1,4,7], [0,4,8], [6,4,2]];

// DOM
const gameCells = document.getElementById("game--container").children;
const gameStatusLine = document.getElementById("game--status");
const resetGameButton = document.getElementById("game--restart");

// State
const cellState = Array.from({length: gameCells.length}, () => undefined);
let currentPlayer = noughts;
let winningPlayer;

// Functions

function onCellClick(event) {

    if (winningPlayer !== undefined) {
        // if a player has won, we don't want to let any more moves be made
        return;
    }

    const cellIndex = event.target.dataset.cellIndex;
    const currentCellState = getCellState(cellIndex);

    switch (currentCellState) {
        case currentPlayer:
            showWarning("You've already selected this cell!");
            break;
        case undefined: // cell available
            setCellState(cellIndex, currentPlayer);
            prepareNextMove();
            break;
        default: // not the current player
            showWarning("Another player has already claimed this cell!");
            break;
    }
}

function getCellState(cellIndex) {
    if (cellIndex > cellState.length) {
        throw new Error("cellIndex too high a value");
    }
    return cellState[cellIndex];
}

function setCellState(cellIndex, state) {
    cellState[cellIndex] = state;
    let newText;
    if (state === undefined) {
        newText = "";
    } else {
        newText = state;
    }
    gameCells[cellIndex].innerHTML = newText;
}

function prepareNextMove() {
    // prepareNextMove sets the next player and shows the appropriate status

    const winner = checkWins();
    if (winner !== undefined) {
        winningPlayer = winner;
        showSuccess((winningPlayer === noughts ? "Noughts" : "Crosses") + " has won!");
        return;
    }

    currentPlayer = currentPlayer === noughts ? crosses : noughts;
    showCurrentPlayer();
}

function showWarning(text) {
    showStatusLine(text, "red");
}

function showSuccess(text) {
    showStatusLine(text, "green");
}

function showCurrentPlayer() {
    // showCurrentPlayer sets the game status line to the current player

    let statusLine = "It's ";
    
    switch (currentPlayer) {
        case crosses:
            statusLine += "crosses'";
            break;
        case noughts:
            statusLine += "noughts'"
            break;
        default:
            throw new Error("unknown current player");
    }

    statusLine += " turn!";

    showStatusLine(statusLine, "black");
}

function showStatusLine(text, colour) {
    gameStatusLine.innerText = text;
    gameStatusLine.style.color = colour;
}

function checkWins() {
    // checkWins returns a winner or undefined

    for (let x = 0; x < winningCombinations.length; x++) {
        const val = winningCombinations[x];

        const ct = Array.from({length: val.length}, () => undefined);
        for (let i = 0; i < val.length; i++) {
            ct[i] = getCellState(val[i]);
        }

        let allValuesMatching = true;
        for (let i = 1; i < ct.length; i++) {
            if (ct[i] === undefined || ct[i] !== ct[i-1]) {
                allValuesMatching = false;
                break;
            }
        }

        if (allValuesMatching) {
            return ct[0];
        }
    }

    return undefined;
}

function setup() {
    // setup puts the board in a state ready to have the first move played

    // register event listeners on cells
    for (let i = 0; i < gameCells.length; i++) {
        const cell = gameCells[i];
        cell.addEventListener("mouseup", onCellClick);
    }

    // register event listener for resetting the game
    resetGameButton.addEventListener("mouseup", () => {
        for (let i = 0; i < cellState.length; i++) {
            setCellState(i, undefined);
        }
        currentPlayer = noughts;
        winningPlayer = undefined;
        setup();
    })

    showCurrentPlayer();
}

setup()