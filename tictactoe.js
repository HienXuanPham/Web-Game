const GAME = document.getElementById("board");
var board;
const ROWS = 3, COLUMNS = 3;
var player = 'O';
var comp = 'X';
var playerWon = false;
var hasWon = false;
var casesToWin = [
  ['00', '01', '02'],
  ['10', '11', '12'],
  ['20', '21', '22'],
  ['00', '10', '20'],
  ['01', '11', '21'],
  ['02', '12', '22'],
  ['00', '11', '22'],
  ['02', '11', '20']
];

window.onload = function() {
  game();
}

function game() {
  board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ]
  //create a board game and add properties
  for(let row = 0; row < ROWS; row++) {
    for(let column = 0; column < COLUMNS; column++) {
      //create div
      var block = document.createElement("div");
      //add id for each div 
      //id = 00, 01, 02, 10, 11, 12, 20, 21, 22
      block.id = row.toString() + column.toString();
      block.classList.add("block");
      if(row == 0 || row == 1) {
        block.classList.add("horizontal-line");
      }
      if(column == 0 || column == 1) {
        block.classList.add("vertical-line");
      }
      GAME.append(block);
      block.addEventListener("click", takeTurn, false);
    }
  }
}

//player and computer take turn to play
function takeTurn(block) {
  //split string id and convert into an integer array
  let ij = splitIDintoIndex(block.target.id);
  //check if a spot in the board is empty to avoid accidentally clicking that spot twice
  //then the player takes a turn first and then the computer
  if(board[ij[0]][ij[1]] == ' ') {
    Click(block.target.id, player);
    //check if not a draw and player hasn't won, if so, computer's turn
    if(!check_draw()  && !playerWon) { 
      Click(bestMove(), comp);
    }
  } 
}

//mark a block that is chose
function Click(where, p) {
  //the type of id is string, so split it and convert each string into type integer
  let xy = splitIDintoIndex(where);
  let r = xy[0];
  let c = xy[1];
  //set player/computer in the spot and display in webpage
  board[r][c] = p;
  document.getElementById(where).innerText = p;
  //make player is white
  if(p == player) {
    document.getElementById(where).classList.add("player-turn");
  }
  let win = check_win(board, p);
  //if win != null, means someone has won, if so, game over 
  if(win) {
    game_over(win);
    displayPointAndWinner(win);
  }
}

//split string id and convert into an integer array
function splitIDintoIndex(ind) {
  let strArr = ind.split('');
  let intArr = [parseInt(strArr[0]), parseInt(strArr[1])];
  return intArr;
}
function check_draw() {
  //check if the board is full and someone has won
  if(emptySpot().length == 0 && !hasWon) {
    document.querySelector(".score .display").innerText = "DRAW!"
    return true;
  }
  return false;
}

//find empty spot in the board
function emptySpot() {
  let empty_spot = [];
  for(let i = 0; i < ROWS; i++){
    for(let j = 0; j < COLUMNS; j++) {
      // if an empty spot, push it to an array and return the array
      if(board[i][j] == ' ') {
        empty_spot.push('' + i + j);
      }
    }
  }
  return empty_spot;
}
//pick random position in empty spots
function bestMove() {
  let array_empty_spot = emptySpot();
  let range = array_empty_spot.length;
  let random_move = Math.floor(Math.random() * range);
  return array_empty_spot[random_move];
}

//check if player won by going through player's plays in the board
//push player's plays in an array
function check_win(b, p) {
  let plays = [];
  for(let r = 0; r < ROWS; r++) {
    for(let c = 0; c < COLUMNS; c++) {
      if(b[r][c] == p) {
        let concatenate = r.toString() + c.toString();
        plays.push(concatenate);
      }
    }
  }
  //loop through each element in subarray of casesToWin
  //check if player has played spots to win (example [00, 01, 02]).
  //if player filled those spots, obvious the index are larger than -1, increase count.
  //if count == 3, it means player has played a win case, set won has the index which is in casesToWin (for example[00, 01, 02] is index 0) and who is winner.
  //break loop and return won object
  //no one wins, return won = null
  let won = null;
  let count = 0;
  for(let i = 0; i < casesToWin.length; i++) {
    for(let j = 0; j < casesToWin[i].length; j++) {
      let e = casesToWin[i][j];
      if(plays.indexOf(e) > -1) {
        count++
      }
    }
    if(count == 3) {
      won = {index: i, winner: p};
      hasWon = true;
      break;
    }
    count = 0;
  }
  return won;
}

function game_over(won) {
  //set background color board for winner
  let winCase = won.index;
  for(let i = 0; i < casesToWin[winCase].length; i++) {
    let id = casesToWin[winCase][i];
    if(won.winner == player) {
      document.getElementById(id).classList.add("player-win");
      playerWon = true;
    } else {
      document.getElementById(id).classList.add("comp-win");
    } 
  }
  //game over so player cannot click anymore
  stopClick();
}

function stopClick() {
  //removeEventListener for every block
  for(let i = 0; i < ROWS; i++){
    for(let j = 0; j < COLUMNS; j++) {
      document.getElementById('' + i + j).removeEventListener("click", takeTurn);
    }
  }
}

function displayPointAndWinner(won) {
  let playerScore = 0, compScore = 0;
  if(won.winner == player) {
    playerScore += 1;
    document.querySelector(".score .player .score1").innerHTML = playerScore;
    document.querySelector(".score .display").innerText = "You won!";
  } else {
    compScore += 1;
    document.querySelector(".score .comp .score2").innerHTML = compScore;
    document.querySelector(".score .display").innerText = "Computer won!"
  }
}


