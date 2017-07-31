var Scud = require('./scud'),
  Missile = require('./missile'),
  City = require('./city');

var GROUND_LEVEL = 30;

class Game {
  constructor() {
    this.reset();
  }
  reset() {
    this.gameOver = false;
    this.started = false;
    this.scuds = [];
    this.missiles = [];
    this.cities = [];
    this.xBound = 640;
    this.yBound = 480;
    this.score = 0;
    this.difficulty = 1;
    this.missilesRemaining = 15;
    this.maxMissiles = 3;
    this.maxTotal = 5;
    this.origin = { x: this.xBound / 2, y: this.yBound - GROUND_LEVEL };
    this.spawnCities();
    this.spawnMissileWave(true);
  }

  clickAt(x, y) {
    if (this.gameOver) {
      this.reset();
    } else if (this.started) {
      this.fireScud(x, y);
    } else {
      this.started = true;
    }
  }
  fireScud(x, y) {
    var origin = this.origin;
    var dest = { x: x, y: y };

    var provideMissiles = function() {
      return this.missiles;
    }.bind(this);

    this.scuds.push(
      new Scud(origin, dest, this.onScudFinish.bind(this), provideMissiles)
    );
  }

  onScudFinish(scud) {
    this.scuds.splice(this.scuds.indexOf(scud), 1);
    this.score += scud.points;
  }

  onMissileFinish(missile) {
    if (missile.destroyedTarget) {
      var widthVariation = City.prototype.WIDTH / 2;
      var city = this.cities.find(function(someCity) {
        return (
          missile.dest.x <= someCity.location.x + widthVariation &&
          missile.dest.x >= someCity.location.x - widthVariation
        );
      });

      if (city) {
        city.destroy();
      }
    }
    this.missiles.splice(this.missiles.indexOf(missile), 1);
    this.spawnMissileWave();
  }

  spawnCities() {
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
      var coords = { x: x, y: y };
      this.cities.push(new City(coords));
    }
  }

  isGameOver() {
    var gameOver = true;
    for (var i = 0; i < this.cities.length; i++) {
      if (!this.cities[i].isDestroyed) {
        gameOver = false;
      }
    }

    return gameOver;
  }

  spawnMissileWave(force) {
    var numTimes = Math.ceil(Math.random() * this.maxMissiles);
    if (force) {
      numTimes = Math.max(Math.ceil(Math.random() * this.maxMissiles));
    }

    if (this.missiles.length < this.maxTotal) {
      var targets = this.getTargets();
      var randIndex = Math.floor(Math.random() * targets.length);
      var target = targets[randIndex];
      if (!target) {
        target = this.origin;
      }
      var missTarget = { x: this.randomizeX(target.x), y: target.y };
      // target.x = this.randomizeX(target.x);
      for (var i = 0; i < numTimes; i++) {
        var missOrigin = { x: this.xBound * Math.random(), y: 0 };
        this.missiles.push(
          new Missile(missOrigin, missTarget, this.onMissileFinish.bind(this))
        );
        this.missilesRemaining -= 1;
      }
    }
  }

  getTargets() {
    var targets = [this.origin];
    for (var i = 0; i < this.cities.length; i++) {
      if (!this.cities[i].isDestroyed) {
        targets.push(this.cities[i].location);
      }
    }
    return targets;
  }

  randomizeX(x) {
    var pct = Math.random() - 0.5;
    var variation = pct * City.prototype.WIDTH;
    return x + variation;
  }

  step() {
    if (this.started && !this.isGameOver()) {
      this.stepScuds();
      this.stepMissiles();
      if (this.missilesRemaining <= 0) {
        this.stepDifficulty();
      }
    }

    if (this.isGameOver()) {
      this.gameOver = true;
    }
  }

  stepDifficulty() {
    this.difficulty += 1;
    this.maxMissiles += 1;
    this.maxTotal += 2;
    this.missilesRemaining = 15 + this.difficulty * 3;
  }

  stepScuds() {
    for (var i = 0; i < this.scuds.length; i++) {
      this.scuds[i].step();
    }
  }

  stepMissiles() {
    for (var i = 0; i < this.missiles.length; i++) {
      this.missiles[i].step();
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.xBound, this.yBound);
    this.drawSky(ctx);
    this.drawCities(ctx);
    this.drawMissiles(ctx);
    this.drawScuds(ctx);
    this.drawBase(ctx);
    this.drawGround(ctx);
    this.drawScoreAndLevel(ctx);

    if (!this.started) {
      this.drawStart(ctx);
    }

    if (this.gameOver) {
      this.drawGameOver(ctx);
    }
  }

  drawGameOver(ctx) {
    var gameOverText = 'GAME OVER';
    var gameOverTextWidth = ctx.measureText(gameOverText).width;
    ctx.fillText(
      gameOverText,
      this.xBound / 2 - gameOverTextWidth / 2,
      this.yBound / 2 - 40
    );
    var resetText = 'Click anywhere to reset';
    var resetTextWidth = ctx.measureText(resetText).width;
    ctx.fillText(
      resetText,
      this.xBound / 2 - resetTextWidth / 2,
      this.yBound / 2
    );
  }

  drawStart(ctx) {
    var startText = 'Click anywhere to start';
    var startTextWidth = ctx.measureText(startText).width;
    ctx.fillText(
      startText,
      this.xBound / 2 - startTextWidth / 2,
      this.yBound / 2
    );
  }

  drawScuds(ctx) {
    for (var i = 0; i < this.scuds.length; i++) {
      this.scuds[i].draw(ctx);
    }
  }

  drawMissiles(ctx) {
    for (var i = 0; i < this.missiles.length; i++) {
      this.missiles[i].draw(ctx);
    }
  }

  drawCities(ctx) {
    for (var i = 0; i < this.cities.length; i++) {
      this.cities[i].draw(ctx);
    }
  }

  drawBase(ctx) {
    ctx.fillStyle = 'violet';
    var triStart = { x: this.origin.x - 5, y: this.origin.y };
    var triTop = { x: this.origin.x, y: this.origin.y - 10 };
    var triEnd = { x: this.origin.x + 5, y: this.origin.y };
    ctx.beginPath();
    ctx.moveTo(triStart.x, triStart.y);
    ctx.lineTo(triTop.x, triTop.y);
    ctx.lineTo(triEnd.x, triEnd.y);
    ctx.stroke();
  }

  drawSky(ctx) {
    var oldStyle = ctx.fillStyle;
    var gradient = ctx.createLinearGradient(0, 0, 0, this.yBound);
    gradient.addColorStop(0, 'rgb(2, 7, 49)');
    gradient.addColorStop(1, 'rgb(119, 181, 254)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.xBound, this.yBound);

    ctx.fillStyle = oldStyle;
  }

  drawGround(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, this.yBound - 30, this.xBound, 30);
  }

  drawScoreAndLevel(ctx) {
    ctx.fillStyle = 'white';
    ctx.font = '24px monospace';
    ctx.fillText('Score: ' + this.score, 20, 40);
    var levelText = 'Level ' + this.difficulty;
    var width = ctx.measureText(levelText).width;

    ctx.fillText(levelText, this.xBound - (width + 20), 40);
  }
}
module.exports = Game;
