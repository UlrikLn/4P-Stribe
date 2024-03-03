"use strict";


// ******** VIEW ********  
function makeBoardClickable(){
    document.querySelector("#board").addEventListener("click",boardClicked);{}
}

function boardClicked(event){
    console.log("Board clicked");
    const cell = event.target;
    if (cell.classList.contains("cell")){
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        selectCell(row, col);

    }
}

function displayBoard(){
    for(let row = 0; row < 7; row++){
        for(let col = 0; col < 7; col++){
           const value = readFromCell(row,col);
           const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

           switch(value){
            case 0: cell.textContent = "";  break;
            case 1: cell.textContent = "🟡"; break;
            case 2: cell.textContent = "🟢"; break;
           }
        }
    }
}

function makeConnectFourBoard(){
    const board = document.querySelector("#board");
    for(let row = 0; row < 7; row++){
        for(let col = 0; col < 7; col++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            board.appendChild(cell);
        }
    }
}



// ******** MODEL ********

const model = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
];

function writeToCell(row, col, value){
   model[row][col] = value;
}

function readFromCell(row, col){
    return model[row][col];
}


// ******** CONTROLLER ********

window.addEventListener("load", start);

let currentPlayer = 1;

function start() {
    console.log("Javascript is running!");
    makeConnectFourBoard();
    displayBoard();
    makeBoardClickable();
}

function nextTurn() {
    if (currentPlayer === 1) {
        currentPlayer = 2;
        // Check if it's the computer's turn
        if (currentPlayer === 2) {
            computerTurn();
        }
    } else if (currentPlayer === 2) {
        currentPlayer = 1;
    }
}

function playerTurn(){

}

function computerTurn() {
    const availableCells = [];

    // Find available cells
    for (let col = 0; col < 7; col++) {
        for (let row = 5; row >= 0; row--) { // Start from the bottom row and iterate upwards
            if (readFromCell(row, col) === 0) {
                availableCells.push([row, col]);
                break; // Break the loop once an available cell in this column is found
            }
        }
    }

    // Check if there are available cells
    if (availableCells.length === 0) {
        console.log("No available cells left.");
        return;
    }

     // Delay computer's turn by one second
     setTimeout(() => {
        // Randomly select an available cell
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const [row, col] = availableCells[randomIndex];
        selectCell(row, col);
    }, 1000); 
    
}


function selectCell(row, col) {
    // Start from the lowest row and iterate upwards
    for (let i = 7 - 1; i >= 0; i--) {
        if (readFromCell(i, col) === 0) { // Check if the cell is empty
            // If empty, write to the cell, display board, check for winner, and proceed to next turn
            writeToCell(i, col, currentPlayer);
            displayBoard();
            
            const winner = checkWinner(); // Check for a winner after each move
            const resultElement = document.getElementById('result');
            if (winner == 1) {
                console.log(`Player ${winner} wins!`);
                resultElement.textContent = "Congratulations! You win!";
                return;
            } else if (winner == 2) {
                console.log(`Computer wins!`);
                resultElement.textContent = "Computer wins! Better luck next time.";
                return;
            }

            // Proceed to the next turn
            nextTurn();

            return true;
        }
    }
    console.log("Column is full"); // If the column is full, log this message
    return false;
}





function checkWinner(){
    // Check rows
    for (let row = 0; row < 7; row++) {
        for (let col = 0; col <= 3; col++) { // Iterate through columns, starting from 0 to 3
            if (readFromCell(row, col) !== 0 &&
                readFromCell(row, col) === readFromCell(row, col + 1) &&
                readFromCell(row, col) === readFromCell(row, col + 2) &&
                readFromCell(row, col) === readFromCell(row, col + 3)) {
                return readFromCell(row, col);
            }
        }
    }

    // Check columns
    for (let col = 0; col < 7; col++) {
        for (let row = 0; row <= 3; row++) { // Iterate through rows, starting from 0 to 3
            if (readFromCell(row, col) !== 0 &&
                readFromCell(row, col) === readFromCell(row + 1, col) &&
                readFromCell(row, col) === readFromCell(row + 2, col) &&
                readFromCell(row, col) === readFromCell(row + 3, col)) {
                return readFromCell(row, col);
            }
        }
    }

    // Check diagonals
    for (let row = 0; row <= 3; row++) {
        for (let col = 0; col <= 3; col++) {
            if (readFromCell(row, col) !== 0 &&
                readFromCell(row, col) === readFromCell(row + 1, col + 1) &&
                readFromCell(row, col) === readFromCell(row + 2, col + 2) &&
                readFromCell(row, col) === readFromCell(row + 3, col + 3)) {
                return readFromCell(row, col);
            }
        }
    }

    for (let row = 3; row < 7; row++) {
        for (let col = 0; col <= 3; col++) {
            if (readFromCell(row, col) !== 0 &&
                readFromCell(row, col) === readFromCell(row - 1, col + 1) &&
                readFromCell(row, col) === readFromCell(row - 2, col + 2) &&
                readFromCell(row, col) === readFromCell(row - 3, col + 3)) {
                return readFromCell(row, col);
            }
        }
    }

    // No winner
    return 0;
}




