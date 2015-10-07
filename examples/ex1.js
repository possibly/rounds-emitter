var RoundsEmitter = require('../lib/RoundsEmitter.js');
var Round = new RoundsEmitter(2); //set 2 as max number of rounds before game over.

Round.on('setup', function setupHandler(){
  var actors = [];
  actors.push({player: 'player1', score: 0});
  actors.push({player: 'player2', score: 0});
  Round.setActors(actors);
  Round.next();
});

Round.on('roundStart', function roundStartHandler(currentRound, actorList, args){
  //currentRound starts at 1.
  console.log('roundStart, '+currentRound);
  Round.next();
});

Round.on('turnStart', function turnStartHandler(currentRound, currentTurn, actor, actorOrder, args){
  //currentTurn starts at 1.
  console.log('turnStart, '+currentTurn);
  
  // 'level up' only the first actor.
  if (actorOrder === 0){
    actor.score += 1;
  }
  Round.next();
});

Round.on('turnEnd', function turnEndHandler(currentRound, currentTurn, actor, actorOrder, args){
  console.log('turnEnd');
  Round.next();
});

Round.on('roundEnd', function roundEndHandler(currentRound, actors, args){
  console.log('roundEnd');

  if (Round.getRoundsRemaining() === 1){
    //One can skip to any of Round's events whenever we want to.
    Round.setNext('gameOver');
  }
  //One may also optionally pass any number of arguments to the next phase that Round decides is appropriate.
  Round.next(actors);
});

Round.on('gameOver', function gameOverHandler(args){
  console.log('gameOver');
  console.log('The final score was: ');
  console.log(args[0][0]);
  console.log(args[0][1]);
});

//Begin the game!
Round.next();