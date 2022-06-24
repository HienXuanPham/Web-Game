const WORDLE = document.getElementById("wordle");
const ROWS = 6, COLUMNS = 5;
var WORD = "PERKY";
var guessRow = 0;
var guessColumn = 0;
var GameOver = false;

window.onload = function() {
  WORDLE_GAME();
}

function WORDLE_GAME() {
  //create squares
  for(let r = 0; r < ROWS; r++) {
    for(let c = 0; c < COLUMNS; c++) {
      let square = document.createElement("div");
      //mark id for each square
      square.id = r.toString() + c.toString();
      //apply css for square
      square.classList.add("square");
      square.innerText = "";
      //add square to wordle
      WORDLE.appendChild(square);
    }
  }
  //there are 6 attemps to guess
  // id of square = guessRow + guessColumn
  //add letters to squares, increase guessColumn
  //if the player presses backspace, decrease guessColumn, set that square to empty string
  //go to the next guessRow when player press Enter, increase guessRow, reset guessColumn = 0
    //check word guessed
    //if there are correct letters
      //if the letter is in correct position, add .correct, count correct letters
      //if the letter is not in correct position, add .nearly
    //if there are not correct letters, add .incorrect
    //if count correct letters = 5, stop game, set GameOver = true
    //if GameOver = false and guessRow == ROWS, set GameOver = true

    document.addEventListener("keyup", (event) => {
      if(GameOver) { return; }

      if(event.code >= "KeyA" && event.code <= "KeyZ") {
        if(guessColumn < COLUMNS) {
          let currentSquare = document.getElementById('' + guessRow + guessColumn);
          if(currentSquare.innerText == "") {
            currentSquare.innerText = event.code[3];
            guessColumn++; //guessColumn = 5 when squares are filled with 5 letters
          }
        }
      }
      if(event.code == "Backspace") {
        //to delete letters, guessColumn has to be between 0 and 4, but in the previous step
        //if when 5 squares are filled, guessColumn will increase to 5,
        //so the condition is guessColumn > 0 && guessColumn <= COLUMNS to avoid guessColumn out of bound
        //decrease guessColumn first because the id of square is combination of guessRow (0-5) and guessColumn(0-4)
        if(guessColumn > 0 && guessColumn <= COLUMNS) {
          guessColumn--;
        }
        let currentSquare = document.getElementById('' + guessRow + guessColumn);
        currentSquare.innerText = "";
      }
      if(event.code == "Enter" && guessColumn == COLUMNS) {
        CheckWord();
        guessRow++; //go to next row
        guessColumn = 0; //start new guess letters
      }
      if(!GameOver && guessRow == ROWS) {
        GameOver = true;
      }
    })
}

function CheckWord() {
  let word = WORD;
  
  let correctLetters = 0;
  let position = [];

  for(let i = 0; i < COLUMNS; i++) {
    let currSquare = document.getElementById('' + guessRow + i);
    let letter = currSquare.innerText;
    position.push({guess: letter, color: "incorrect"});
  }

  for(let i = 0; i < COLUMNS; i++) {
    
    if(word[i] == position[i].guess) {
      
      position[i].color = "correct";
      word = word.replace(position[i].guess, '-');
      
      correctLetters++;
    }
  }

  for(let i = 0; i < COLUMNS; i++) {
    
    if(word.includes(position[i].guess)) {
      
      position[i].color = "nearly";
      word = word.replace(position[i].guess, '-');
    }
  }

  for(let i = 0; i < COLUMNS; i++) {
    let currSquare = document.getElementById('' + guessRow + i);
  
    setTimeout(() => {
      currSquare.classList.add("flip");
      
      if(position[i].color == "correct") {
        currSquare.classList.add("correct");
      }
      else if(position[i].color == "nearly") {
        currSquare.classList.add("nearly");
      }
      else if(position[i].color == "incorrect") {
        currSquare.classList.add("incorrect");
      }
      if(correctLetters == COLUMNS) {
        GameOver = true;
      }
    }, 500 * i)  
  } 
}