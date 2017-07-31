var Projectile = require('./projectile');

const SPEED = 10;

class Scud extends Projectile {
  constructor(origin, dest, onFinish, getMissiles) {
    super(origin, dest, onFinish);
    this.SPEED = SPEED;
    this.getMissiles = getMissiles;
    this.points = 0;
  }

  step() {
    if (this.atDest()) {
      this.explode();
    }
    if (this.isExploding) {
      if (this.explodeProgress > 1.0) {
        this.finish();
      } else {
        this.destroyMissiles();
        this.explodeProgress += 0.025;
      }
    } else {
      var stuff = this.angToCartesian(this.angle, this.SPEED);
      this.pos.x -= stuff.x;
      this.pos.y -= stuff.y;
    }
  }

  destroyMissiles() {
    var numMissiles = 0;
    if (this.isExploding) {
      this.getMissiles().forEach(
        function(missile) {
          var radius = this.getRadiusFromProgress(this.explodeProgress);
          var xDiff = missile.pos.x - this.pos.x;
          var yDiff = missile.pos.y - this.pos.y;

          if (Math.hypot(xDiff, yDiff) < radius) {
            if (!missile.isDestroyed) {
              numMissiles += 1;
            }
            missile.destroy();
          }
        }.bind(this)
      );
    }
    this.points += numMissiles * 100;
  }

  draw(ctx) {
    if (this.isExploding) {
      ctx.beginPath();
      if (this.explodeProgress <= 0.2) {
        ctx.fillStyle = 'rgb(255, 159, 10)';
      } else if (this.explodeProgress <= 0.4) {
        ctx.fillStyle = 'rgb(232, 114, 10)';
      } else if (this.explodeProgress <= 0.6) {
        ctx.fillStyle = 'rgb(255, 211, 66)';
      } else if (this.explodeProgress <= 0.8) {
        ctx.fillStyle = 'rgb(232, 49, 10)';
      } else {
        // ctx.fillStyle = 'rgb(255, 18, 10)';
        ctx.fillStyle = 'rgb(255, 211, 66)';
      }
      ctx.arc(
        this.pos.x,
        this.pos.y,
        this.getRadiusFromProgress(this.explodeProgress),
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.fillStyle = 'black';
    } else {
      ctx.fillStyle = 'rgb(255, 254, 255)';
      var sideLength = 5;
      ctx.fillRect(
        this.pos.x - sideLength / 2,
        this.pos.y - sideLength / 2,
        sideLength,
        sideLength
      );
      ctx.fillStyle = 'black';
    }
  }

  getRadiusFromProgress(progress) {
    var max = 35;
    var smallerMax = 20;
    if (progress <= 0.5) {
      return max * Math.sin(4.2 * progress);
    } else {
      return Math.abs(smallerMax * Math.sin(6 * (progress - 0.5522)));
    }
  }

  atDest() {
    var isLeft = false;
    if (this.angle / Math.PI <= 0.5) {
      isLeft = true;
      return this.pos.x < this.dest.x && this.pos.y < this.dest.y;
    }

    return this.pos.x > this.dest.x && this.pos.y < this.dest.y;
  }
}

module.exports = Scud;
