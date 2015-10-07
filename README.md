# rounds-emitter
An event emitter that keeps track of what round and turn it is, as well as who the `actors` are in your game.

## How it works
You first instantiate the rounds-emitter:
```javascript
var RoundsEmitter = require('rounds-emitter');
var Round = new RoundsEmitter();
```

Then set the actors you want rounds to keep track of for you. A convenient place
would be in the `setup` event that `rounds-emitter` provides:
```javascript
Round.on('setup', setupHandler);
function setupHandler(){
  var array = [1,2,3];
  Round.setActors(array);
  Round.next(); //this command signifies that rounds-emitter may proceed to the next event
}
```

Then define what happens for each of the five events of `rounds-emitter`'s turn cycle.
```javascript
...
Round.on('turnStart', turnStartHandler);
function turnStartHandler(currentRound, currenTurn, actor, actorOrder, args){
  manipulate(actor);
  asyncEvent(actor, function(property){
    Round.next();
  });
}
...
```

##Event order

Each time a cycle is played through, a counter (`maxRounds`) gets one count closer to 0. If `maxRounds` === 0,
then the game is over.


```
setup -->
  roundStart -->
    turnStart //one turn per actor.
    turnEnd
  roundEnd --> roundStart
gameOver //once maxRounds === 0, or when called by setNext('gameOver')
```


## The 6 events.
```javascript
setup //only happens once
roundStart
turnStart //will flip between turnStart and turnEnd until all actors have been called
turnEnd
roundEnd
gameOver //calling next() once the game is at the gameOver stage will simply recall gameOver

##todo:
* describe cycle of rounds and turns.
* describe modifying this cycle with Rounds(#) and setNext(); 
* make setNext not have internal contradictions (its possible to screw the whole system up.)
```