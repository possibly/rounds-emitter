# rounds-emitter
An event emitter that keeps track of what round and turn it is.

## How it works
```
var RoundsEmitter = require('rounds-emitter');
var Round = new RoundsEmitter(2); //2 is the maximum number of rounds.

Round.on('roundStart', function roundStartHandler(currentRound){
  //currentRound starts at 1.
  console.log('roundStart');
  Round.next();
});

Round.on('turnStart', function turnStartHandler(currentRound, currentTurn){
  console.log('turnStart');
  Round.next();
});

Round.on('turnEnd', function turnEndHandler(currentRound, currentTurn){
  //currentTurn starts at 1.
  console.log('turnEnd');
  Round.next();
});

Round.on('roundEnd', function roundEndHandler(currentRound){
  if (Round.getRoundsRemaining() == 1){
    Round.setNext('gameOver');
  }
  console.log('roundEnd');
  Round.next();
});

Round.on('gameOver', function gameOverHandler(){
  console.log('gameOver');
});

Round.next();
```
Outputs:
```
roundStart
turnStart
turnEnd
roundEnd
gameOver
```