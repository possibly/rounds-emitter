//node modules
var events = require('events');
var util = require('util');

function RoundsEmitter(maxRounds){
  this._rounds = 0;
  this._turns = 0;
  this._roundsRemaining = maxRounds || 1;
  this._next = this.setup;
  this._actors = [];
  this._actorsIndex = -1;
  this._setup = true;
  this._forced = false;

  events.EventEmitter.call(this);
}

util.inherits(RoundsEmitter, events.EventEmitter);

RoundsEmitter.prototype.next = function next(){
  var args = Array.prototype.slice.call(arguments);
  if (this._roundsRemaining == 0){
    this.gameOver(args);
  }else{
    if (this._setup === true){
      this.setup();
    }
    else if (this._forced === true){
      this._next(args);
      forced = false;
    }
    else if (this._actorsIndex === -1){
      this.roundStart(args);
    }
    else if (this._actorsIndex === this._actors.length){
      this.roundEnd(args);
    }
    else if (this._actorsIndex < this._actors.length){
      this._next(args);
    }
    else{
      throw new Error('Unknown error.');
    }
  }
}

RoundsEmitter.prototype.setup = function setup(){
  this._setup = false;
  this.emit('setup');
}

RoundsEmitter.prototype.roundStart = function roundStart(args){
  this._actorsIndex++;
  this._rounds++;
  this._next = this.turnStart;
  this.emit('roundStart', this._rounds, this._actors, args);
}

RoundsEmitter.prototype.roundEnd = function roundEnd(args){
  this._actorsIndex = -1;
  this._roundsRemaining--;
  this.emit('roundEnd', this._rounds, this._actors, args);
}

RoundsEmitter.prototype.turnStart = function turnStart(args){
  var actor = this._actors[this._actorsIndex];
  var actorOrder = this._actorsIndex;
  this._turns++;
  this._next = this.turnEnd;
  this.emit('turnStart', this._rounds, this._turns, actor, actorOrder, args);
}

RoundsEmitter.prototype.turnEnd = function turnEnd(args){
  var actor = this._actors[this._actorsIndex];
  var actorOrder = this._actorsIndex;
  this._actorsIndex++;
  this._next = this.turnStart;
  this.emit('turnEnd', this._rounds, this._turns, actor, actorOrder, args);
}

RoundsEmitter.prototype.gameOver = function gameOver(args){
  this._next = gameOver;
  this.emit('gameOver', args);
}

RoundsEmitter.prototype.getTurns = function getTurns(){
  return this._turns;
}

RoundsEmitter.prototype.getRoundsRemaining = function getRoundsRemaining(){
  return this._roundsRemaining;
}

RoundsEmitter.prototype.getRoundsPlayed = function getRoundsPlayed(){
  return this._rounds;
}

RoundsEmitter.prototype.setMaxRounds = function setMaxRounds(maxRounds){
  this._roundsRemaining = maxRounds;
}

RoundsEmitter.prototype.setNext = function setNext(fn){
  if (fn === 'roundStart'){ this._next = this.roundStart; }
  else if (fn === 'roundEnd'){ this._next = this.roundEnd; }
  else if (fn === 'turnStart'){ this._next = this.turnStart; }
  else if (fn === 'turnEnd'){ this._next = this.turnEnd; }
  else if (fn === 'gameOver'){ this._next = this.gameOver; }
  else{
    throw new Error('Unable to setNext on an unknown function.');
  }
  this._forced = true;
}

RoundsEmitter.prototype.setActors = function setActors(array){
  this._actors = array;
}

module.exports = RoundsEmitter;