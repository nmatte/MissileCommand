var Util = require('./util'),
    Projectile = require('./projectile');

var Missile = function (origin, dest, onFinish) {
  Projectile.call(this, origin, dest, onFinish);
};

Util.prototype.inherits(Missile, Projectile);


Missile.prototype.SPEED = 1;

Missile.prototype.step = function () {
  if (this.atDest()) {
    this.destroy();
  }
  //
  // if (this.isExploding) {
  //   if (this.explodeProgress > 1.0) {
  //     this.finish();
  //   } else {
  //     this.explodeProgress += 0.025;
  //   }
  // } else {
    var stuff = this.angToCartesian(this.angle, this.SPEED);
    this.pos.x -= stuff.x;
    this.pos.y -= stuff.y;
  // }
};


Missile.prototype.draw = function (ctx) {
  // if (this.isExploding) {
  //   ctx.beginPath();
  //   if (this.explodeProgress <= 0.2) {
  //     ctx.fillStyle = 'rgb(255, 159, 10)';
  //   } else if (this.explodeProgress <= 0.4) {
  //     ctx.fillStyle = 'rgb(232, 114, 10)';
  //   } else if (this.explodeProgress <= 0.6) {
  //     ctx.fillStyle = 'rgb(255, 211, 66)';
  //   } else if (this.explodeProgress <= 0.8) {
  //     ctx.fillStyle = 'rgb(232, 49, 10)';
  //   } else {
  //     // ctx.fillStyle = 'rgb(255, 18, 10)';
  //     ctx.fillStyle = 'rgb(255, 211, 66)';
  //
  //   }
  //   ctx.arc(this.pos.x, this.pos.y, this.getRadiusFromProgress(this.explodeProgress), 0, Math.PI * 2);
  //   ctx.fill();
  //   ctx.fillStyle = 'black';
  // } else {
  ctx.strokeStyle = 'rgb(232, 45, 10)';
  ctx.fillStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(this.origin.x, this.origin.y);

  ctx.lineTo(this.pos.x, this.pos.y);
  ctx.stroke();

    ctx.fillRect(this.pos.x - 1, this.pos.y - 1, 2, 2);
    ctx.fillStyle = 'black';
  // }
};


Missile.prototype.atDest = function () {
  return (this.dest.y < this.pos.y);
};

Missile.prototype.finish = function () {
  this.onFinish(this);
};

Missile.prototype.destroy = function () {
  this.finish();
};

module.exports = Missile;
