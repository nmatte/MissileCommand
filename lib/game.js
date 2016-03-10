var Scud = require('./scud'),
    Missile = require('./missile');

var Game = function () {
  this.scuds = [];
  this.missiles = [];
  this.xBound = 640;
  this.yBound = 480;
};

Game.prototype.clickAt = function (x, y) {
  console.log("x, y", x, y);
  var origin = {x: this.xBound / 2, y: this.yBound - 30};
  var dest = {x: x, y: y};

  var provideMissiles = function () {
    return this.missiles;
  }.bind(this);

  this.scuds.push(new Scud(origin, dest, this.onScudFinish.bind(this), provideMissiles));
};

Game.prototype.onScudFinish = function (scud) {
  this.scuds.splice(this.scuds.indexOf(scud), 1);
};

Game.prototype.onMissileFinish = function (missile) {
  this.missiles.splice(this.missiles.indexOf(missile), 1);
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, this.xBound, this.yBound);
  ctx.fillStyle = 'black';
  this.drawSky(ctx);
  this.drawMissiles(ctx);
  this.drawScuds(ctx);

  ctx.fillRect(0, this.yBound - 30, this.xBound, 30);
};

Game.prototype.step = function () {
  this.spawnMissileWave();
  this.stepScuds();
  this.stepMissiles();
};

var likelihood = 400;
Game.prototype.spawnMissileWave = function () {
  var numTimes = Math.max(Math.floor(Math.random() * likelihood + 8) - likelihood, 0);
  var target = {x: this.xBound / 2, y: this.yBound - 30};
  var missOrigin = {x: this.xBound * Math.random(), y: 0};
  for (var i = 0; i < numTimes; i++) {
    this.missiles.push(new Missile(missOrigin, target, this.onMissileFinish.bind(this)));
  }
};

Game.prototype.stepScuds = function () {
  for (var i = 0; i < this.scuds.length; i++) {
    this.scuds[i].step();
  }
};

Game.prototype.stepMissiles = function () {
  for (var i = 0; i < this.missiles.length; i++) {
    this.missiles[i].step();
  }
};

Game.prototype.drawScuds = function (ctx) {
  for (var i = 0; i < this.scuds.length; i++) {
    this.scuds[i].draw(ctx);
  }
};

Game.prototype.drawMissiles = function (ctx) {
  for (var i = 0; i < this.missiles.length; i++) {
    this.missiles[i].draw(ctx);
  }
};

Game.prototype.drawSky = function (ctx) {
  var oldStyle = ctx.fillStyle;
  var gradient = ctx.createLinearGradient(0,0,0,this.yBound);
  gradient.addColorStop(0,"rgb(2, 7, 49)");
  gradient.addColorStop(1,"rgb(119, 181, 254)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,this.xBound,this.yBound);

  ctx.fillStyle = oldStyle;
};
module.exports = Game;
