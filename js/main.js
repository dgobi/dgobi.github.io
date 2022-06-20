const player1Img = document.querySelector('#player1');
const player2Img = document.querySelector('#player2');
const outcome = document.querySelector('#outcome');
const player1Score = document.querySelector('#player1Score');
const player2Score = document.querySelector('#player2Score');
const cardsLeft = document.querySelector('#cardsLeft');
const cardBacks = document.querySelectorAll('.cardBack');
const warButton = document.querySelector('#war');
const draw2Button = document.querySelector('#draw2');

const p1Outcome = 'Player wins and takes both cards!';
const p2Outcome = 'The computer wins and takes both cards!';
const warOutcome = 'This means WAR! Click to draw more cards!';
const p1WarOutcome = 'Player wins the war and takes all four cards!';
const p2WarOutcome = 'The computer wins the war and takes all four cards!';
const warOutcomeContinue = 'The WAR goes on! Click to draw again!'
const p1Win = 'No cards left! The player wins! Click the button to start a new game!';
const p2Win = 'No cards left! The computer wins! Click the button to start a new game!';
const drawWin = 'No cards left! The game ends in a draw! Click the button to start a new game!';

document.querySelector('#newGame').addEventListener('click', newGame);
draw2Button.addEventListener('click', drawTwo);
warButton.addEventListener('click', drawFour);

let deckId = '';

if (localStorage.getItem('deckId')){
  deckId = localStorage.getItem('deckId');
  player1Score.innerText = localStorage.getItem('player1');
  player2Score.innerText = localStorage.getItem('player2');
  cardsLeft.innerText = `Cards remaining: ${localStorage.getItem('cardsLeft')}`;
  outcome.innerText = localStorage.getItem('currentOutcome');

  if (localStorage.getItem('player1Img') && localStorage.getItem('player2Img')){
    player1Img.src = localStorage.getItem('player1Img');
    player2Img.src = localStorage.getItem('player2Img');
    console.log("displaying player cards!");
  } else {
    player1Img.style.visibility = 'hidden';
    player2Img.style.visibility = 'hidden';
    console.log("hiding empty cards!");
  }

  if (localStorage.getItem('war')){
    warButton.style.visibility = 'visible';
    cardBacks.forEach(card => card.style.visibility = 'visible');
    console.log("showing card backs!");
  } else {
    warButton.style.visibility = 'hidden';
    cardBacks.forEach(card => card.style.visibility = 'hidden');
    console.log("hiding card backs!");
  }

  if (localStorage.getItem('gameOver')){
    draw2Button.style.visibility = 'hidden';
    warButton.style.visibility = 'hidden';
    console.log("game over!");
  } else {
    draw2Button.style.visibility = 'visible';
    console.log("game continues!");
  }
}

console.log(`Local var deckId = ${deckId}`);

function newGame(){
  const url = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        clearScreen(data);
        localStorage.setItem('deckId', data.deck_id);
        localStorage.setItem('cardsLeft', data.remaining);
        deckId = localStorage.getItem('deckId');
        console.log(deckId);
      })
      .catch(err => {
          console.log(`error ${err}`);
      });
}

function drawTwo(){
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;

  checkCardsLeft(2);

  fetch(url)
    .then(res => res.json())
    .then(data => {
      player1Img.style.visibility = 'visible';
      player2Img.style.visibility = 'visible';
      cardBacks.forEach(a => a.style.visibility = 'hidden');

      player1Img.src = data.cards[0].image;
      player2Img.src = data.cards[1].image;

      let player1Val = getCardValue(data.cards[0].value);
      localStorage.setItem('player1Img', player1Img.src);
      let player2Val = getCardValue(data.cards[1].value);
      localStorage.setItem('player2Img', player2Img.src);
      console.log(deckId);

      if (player1Val > player2Val){
        addScore('player1', 2);
        outcome.innerText = p1Outcome;
        localStorage.setItem('currentOutcome', p1Outcome);
        warButton.style.visibility = 'hidden';
        draw2Button.style.visibility = 'visible';
      } else if (player1Val < player2Val){
        addScore('player2', 2);
        outcome.innerText = p2Outcome;
        localStorage.setItem('currentOutcome', p2Outcome);
        warButton.style.visibility = 'hidden';
        draw2Button.style.visibility = 'visible';
      } else {
        outcome.innerText = warOutcome;
        localStorage.setItem('currentOutcome', warOutcome);
        warButton.style.visibility = 'visible';
        draw2Button.style.visibility = 'hidden';
        localStorage.setItem('war', true);
      }

      player1Score.innerText = localStorage.getItem('player1')
      player2Score.innerText = localStorage.getItem('player2')

      localStorage.setItem('cardsLeft', data.remaining);
      cardsLeft.innerText = `Cards remaining: ${data.remaining}`;
      console.log(`Player 1: ${player1Val} | Player 2: ${player2Val} | Cards remaining: ${data.remaining}`);
    })
    .catch(err => {
      console.log(`error ${err}`);
    });
}

function drawFour(){
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`;

  checkCardsLeft(4);

  fetch(url)
    .then(res => res.json())
    .then(data => {
      player1Img.style.visibility = 'visible';
      player2Img.style.visibility = 'visible';
      cardBacks.forEach(card => card.style.visibility = 'visible');

      player1Img.src = data.cards[0].image;
      player2Img.src = data.cards[2].image;

      let player1Val = getCardValue(data.cards[0].value);
      localStorage.setItem('player1Img', player1Img.src);
      let player2Val = getCardValue(data.cards[2].value);
      localStorage.setItem('player2Img', player2Img.src);
      console.log(deckId);

      if (player1Val > player2Val){
        addScore('player1', 4);
        outcome.innerText = p1WarOutcome;
        localStorage.setItem('currentOutcome', p1WarOutcome);
        localStorage.removeItem('war');
        warButton.style.visibility = 'hidden';
      } else if (player1Val < player2Val){
        addScore('player2', 4);
        outcome.innerText = p2WarOutcome;
        localStorage.setItem('currentOutcome', p2WarOutcome);
        localStorage.removeItem('war');
        warButton.style.visibility = 'hidden';
      } else {
        outcome.innerText = warOutcomeContinue;
        localStorage.setItem('currentOutcome', warOutcomeContinue);
        warButton.style.visibility = 'visible';
        localStorage.setItem('war', true);
      }

      player1Score.innerText = localStorage.getItem('player1')
      player2Score.innerText = localStorage.getItem('player2')

      localStorage.setItem('cardsLeft', data.remaining);
      cardsLeft.innerText = `Cards remaining: ${data.remaining}`;
      console.log(`WAR!! Player 1: ${player1Val} | Player 2: ${player2Val} | Cards remaining: ${data.remaining}`);
    })
    .catch(err => {
      console.log(`error ${err}`);
    });
}

function getCardValue(val){
  if (val === 'JACK'){
    return 11;
  } else if (val === 'QUEEN'){
    return 12;
  } else if (val === 'KING'){
    return 13;
  } else if (val === 'ACE'){
    return 14;
  } else {
    return val;
  }
}

function addScore(player, num){
  let playerScoreVal = Number(localStorage.getItem(player));
  playerScoreVal += num;
  localStorage.setItem(player, playerScoreVal);
}

function clearScreen(data){
  localStorage.clear();
  localStorage.setItem('player1', 0);
  localStorage.setItem('player2', 0);
  localStorage.removeItem('gameOver');
  localStorage.removeItem('war');
  document.querySelector('#cardsLeft').innerText = `Cards remaining: ${data.remaining}`;
  document.querySelector('#player1Score').innerText = localStorage.getItem('player1')
  document.querySelector('#player2Score').innerText = localStorage.getItem('player2')
  document.querySelector('#player1').style.visibility = 'hidden';
  document.querySelector('#player2').style.visibility = 'hidden';
  document.querySelector('#outcome').innerText = "";
}

function checkCardsLeft(draw){
  if (Number(localStorage.getItem('cardsLeft')) >= draw){
    return;
  } else if(Number(localStorage.getItem('player1')) > Number(localStorage.getItem('player2'))) {
    outcome.innerText = p1Win;
    localStorage.setItem('currentOutcome', p1Win);
    draw2Button.style.visibility = 'hidden';
    warButton.style.visibility = 'hidden';
    localStorage.setItem('gameOver', true);
  } else if(Number(localStorage.getItem('player2')) > Number(localStorage.getItem('player1'))) {
    outcome.innerText = p2Win;
    localStorage.setItem('currentOutcome', p2Win);
    draw2Button.style.visibility = 'hidden';
    warButton.style.visibility = 'hidden';
    localStorage.setItem('gameOver', true);
  } else {
    outcome.innerText = drawWin;
    localStorage.setItem('currentOutcome', drawWin);
    draw2Button.style.visibility = 'hidden';
    warButton.style.visibility = 'hidden';
    localStorage.setItem('gameOver', true);
  }
}