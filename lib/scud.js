var Projectile = require('./projectile');
var Util = require('./util');
var Scud = function (origin, dest, onFinish, getMissiles) {
  Projectile.call(this, origin, dest, onFinish);
  this.getMissiles = getMissiles;
};

Util.prototype.inherits(Scud, Projectile);

Scud.prototype.SPEED = 10;

Scud.prototype.step = function () {
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
};

Scud.prototype.destroyMissiles = function () {
  if (this.isExploding) {
    this.getMissiles().forEach(
      function (missile) {

        var radius = this.getRadiusFromProgress(this.explodeProgress);
        var xDiff = missile.pos.x - this.pos.x;
        var yDiff = missile.pos.y - this.pos.y;

        if (Math.hypot(xDiff, yDiff) < radius) {
          missile.destroy();
        }
      }.bind(this)
    );
  }
};

Scud.prototype.draw = function (ctx) {
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
    ctx.arc(this.pos.x, this.pos.y, this.getRadiusFromProgress(this.explodeProgress), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
  } else {
    ctx.fillStyle = 'rgb(255, 254, 130)';
    ctx.fillRect(this.pos.x, this.pos.y, 5, 5);
    ctx.fillStyle = 'black';
  }
};

Scud.prototype.getRadiusFromProgress = function (progress) {
  var max = 35;
  var smallerMax = 20;
  if (progress <= 0.5) {
    return max * Math.sin(4.2 * progress);
  } else {
    return Math.abs( smallerMax * Math.sin(6 * (progress - 0.5522)));
  }
};

Scud.prototype.atDest = function () {
  var isLeft = false;
  if (this.angle / Math.PI <= 0.5) {
    isLeft = true;
    return this.pos.x < this.dest.x && this.pos.y < this.dest.y;
  }

  return this.pos.x > this.dest.x && this.pos.y < this.dest.y;
};
module.exports = Scud;
