//node modules
var events = require('events');
var util = require('util');

function RoundsEmitter(maxRounds){
  this._rounds = 0;
  this._turns = 0;
  this._roundsRemaining = maxRounds || 1;
  this._next = this.setup;

  events.EventEmitter.call(this);
}

util.inherits(RoundsEmitter, events.EventEmitter);

RoundsEmitter.prototype.next = function next(){
  if (this._roundsRemaining == 0){
    this.emit('gameOver');
  }else{
    this._next(arguments);
  }
}

RoundsEmitter.prototype.setup = function setup(){
  this._next = this.roundStart;
  this.emit('setup');
}

RoundsEmitter.prototype.roundStart = function roundStart(){
  this._rounds++;
  this._next = this.turnStart;
  this.emit('roundStart', this._rounds, arguments);
}

RoundsEmitter.prototype.roundEnd = function roundEnd(){
  this._roundsRemaining--;
  this._next = this.roundStart;
  this.emit('roundEnd', this._rounds, arguments);
}

RoundsEmitter.prototype.turnStart = function turnStart(){
  this._turns++;
  this._next = this.turnEnd;
  this.emit('turnStart', this._rounds, this._turns, arguments);
}

RoundsEmitter.prototype.turnEnd = function turnEnd(){
  this._next = this.roundEnd;
  this.emit('turnEnd', this._rounds, this._turns, arguments);
}

RoundsEmitter.prototype.gameOver = function gameOver(){
  this._next = gameOver;
  this.emit('gameOver');
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
    this._next = fn;
  }
}

module.exports = RoundsEmitter;