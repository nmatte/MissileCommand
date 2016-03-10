var Scud = require('./scud'),
    Missile = require('./missile'),
    City = require('./city');

var Game = function () {
  this.scuds = [];
  this.missiles = [];
  this.cities = [];
  this.xBound = 640;
  this.yBound = 480;
  this.spawnCities();
  this.spawnMissileWave(true);
};

Game.prototype.GROUND_LEVEL = 30;

Game.prototype.clickAt = function (x, y) {
  console.log("x, y", x, y);
  var origin = {x: this.xBound / 2, y: this.yBound - this.GROUND_LEVEL};
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
  this.spawnMissileWave();

};

Game.prototype.spawnCities = function () {
  var y = this.yBound - this.GROUND_LEVEL;
  var interval = this.xBound / 8;
  for (var i = 0; i < 6; i++) {
    var x;
    if (i < 3) {
      x = interval * i;
    } else {
      x = this.xBound - interval * (6 - i);
    }
    this.cities.push(new City({x: x, y: y}));
  }
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, this.xBound, this.yBound);
  this.drawSky(ctx);
  this.drawMissiles(ctx);
  this.drawScuds(ctx);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, this.yBound - 30, this.xBound, 30);
  this.drawCities(ctx);
};

Game.prototype.step = function () {
  this.stepScuds();
  this.stepMissiles();
};

var maxMissiles = 3;
var maxTotal = 8;
Game.prototype.spawnMissileWave = function (force) {
  var numTimes = Math.ceil(Math.random() * maxMissiles);
  if (force) {
    numTimes = Math.max(Math.ceil(Math.random() * maxMissiles));
  }

  if (this.missiles.length < maxTotal) {
    var target = {x: this.xBound / 2, y: this.yBound - 30};
    var missOrigin = {x: this.xBound * Math.random(), y: 0};
    for (var i = 0; i < numTimes; i++) {
      this.missiles.push(new Missile(missOrigin, target, this.onMissileFinish.bind(this)));
    }

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

Game.prototype.drawCities = function (ctx) {
  for (var i = 0; i < this.cities.length; i++) {
    this.cities[i].draw(ctx);
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
