var Scud = require('./scud'),
    Missile = require('./missile'),
    City = require('./city');

var GROUND_LEVEL = 30;
var Game = function () {
  this.scuds = [];
  this.missiles = [];
  this.cities = [];
  this.xBound = 640;
  this.yBound = 480;
  this.score = 0;
  this.difficulty = 1;
  this.missilesRemaining = 15;
  this.origin = {x: this.xBound / 2, y: this.yBound - GROUND_LEVEL};
  this.spawnCities();
  this.spawnMissileWave(true);
};


Game.prototype.clickAt = function (x, y) {
  console.log("x, y", x, y);
  var origin = this.origin;
  var dest = {x: x, y: y};

  var provideMissiles = function () {
    return this.missiles;
  }.bind(this);

  this.scuds.push(new Scud(origin, dest, this.onScudFinish.bind(this), provideMissiles));
};

Game.prototype.onScudFinish = function (scud) {
  this.scuds.splice(this.scuds.indexOf(scud), 1);
  this.score += scud.points;
};

Game.prototype.onMissileFinish = function (missile) {
  if (missile.destroyedTarget) {
    var city = this.cities.find(
      function (someCity) {
        return someCity.location.x === missile.dest.x;
      }
    );

    if (city) {
      city.destroy();
    }
  }
  this.missiles.splice(this.missiles.indexOf(missile), 1);
  this.spawnMissileWave();
};

Game.prototype.spawnCities = function () {
  var y = this.yBound - GROUND_LEVEL;
  var interval = this.xBound / 8;
  for (var i = 0; i < 6; i++) {
    var x;
    if (i < 3) {
      x = interval * i;
    } else {
      x = this.xBound - interval * (6 - i);
    }
    x += interval / 2;
    var coords = {x: x, y: y};
    this.cities.push(new City(coords));
  }
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, this.xBound, this.yBound);
  this.drawSky(ctx);
  this.drawCities(ctx);
  this.drawMissiles(ctx);
  this.drawScuds(ctx);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, this.yBound - 30, this.xBound, 30);
  ctx.fillStyle = "white";
  ctx.font = "24px monospace";
  ctx.fillText("Score: " + this.score, 20, 40);
  var levelText = "Level " + this.difficulty;
  var width = ctx.measureText(levelText).width;

  ctx.fillText(levelText, this.xBound - (width + 20), 40);
};

Game.prototype.step = function () {
  this.stepScuds();
  this.stepMissiles();
  if (this.missilesRemaining <= 0) {
    this.stepDifficulty();
  }
};

var maxMissiles = 3;
var maxTotal = 5;

Game.prototype.stepDifficulty = function () {
  this.difficulty += 1;
  maxMissiles += 1;
  maxTotal += 2;
  this.missilesRemaining = 15 + this.difficulty * 3;
};

Game.prototype.spawnMissileWave = function (force) {
  var numTimes = Math.ceil(Math.random() * maxMissiles);
  if (force) {
    numTimes = Math.max(Math.ceil(Math.random() * maxMissiles));
  }

  if (this.missiles.length < maxTotal) {
    var targets = [this.origin];
    for (var i = 0; i < this.cities.length; i++) {
      if (!this.cities[i].isDestroyed) {
        targets.push(this.cities[i].location);
      }
    }
    var randIndex = Math.floor(Math.random() * targets.length);
    var target = targets[randIndex];
    if(!target) {
      target = this.origin;
    }
    for (var i = 0; i < numTimes; i++) {
      var missOrigin = {x: this.xBound * Math.random(), y: 0};
      this.missiles.push(new Missile(missOrigin, target, this.onMissileFinish.bind(this)));
      this.missilesRemaining -=1;
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
