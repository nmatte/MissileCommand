var Util = require('./util'),
    Projectile = require('./projectile');

var Missile = function (origin, dest, onFinish) {
  this.destroyedTarget = false;
  this.isDestroyed = false;
  Projectile.call(this, origin, dest, onFinish);
};

Util.prototype.inherits(Missile, Projectile);


Missile.prototype.SPEED = 1;

Missile.prototype.step = function () {
  if (this.atDest()) {
    this.destroyedTarget = true;
    this.explode();
  }
  //
  if (this.isExploding) {
    if (this.explodeProgress > 1.0) {
      this.finish();
    } else {
      this.explodeProgress += 0.015;
    }
  } else {
    var stuff = this.angToCartesian(this.angle, this.SPEED);
    this.pos.x -= stuff.x;
    this.pos.y -= stuff.y;
  }
};


Missile.prototype.draw = function (ctx) {
  if (this.isExploding) {
    this.drawMushroomCloud(ctx);
  } else {
  ctx.strokeStyle = 'rgb(232, 45, 10)';
  ctx.fillStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(this.origin.x, this.origin.y);

  ctx.lineTo(this.pos.x, this.pos.y);
  ctx.stroke();

    ctx.fillRect(this.pos.x - 1, this.pos.y - 1, 2, 2);
    ctx.fillStyle = 'black';
  }
};

Missile.prototype.drawMushroomCloud = function (ctx) {
  if (this.explodeProgress <= 0.2) {
    ctx.fillStyle = 'rgb(230,230,230)';
  } else if (this.explodeProgress <= 0.4) {
    ctx.fillStyle = 'rgb(232, 114, 10)';
    var top = this.drawMushroomTop(ctx);
    this.drawMushroomStalk(ctx, top);
  } else if (this.explodeProgress <= 0.6) {
    ctx.fillStyle = 'rgb(230,230,230)';
    var top = this.drawMushroomTop(ctx);
    this.drawMushroomStalk(ctx, top);
  } else if (this.explodeProgress <= 0.8) {
    ctx.fillStyle = 'rgb(232, 49, 10)';
    var top = this.drawMushroomTop(ctx);
    this.drawMushroomStalk(ctx, top);
  } else {
    // ctx.fillStyle = 'rgb(255, 18, 10)';
    ctx.fillStyle = 'rgb(230,230,230)';
    var top = this.drawMushroomTop(ctx);
    this.drawMushroomStalk(ctx, top);
  }


  ctx.beginPath();
  ctx.moveTo(this.pos.x, this.pos.y);
  ctx.arc(this.pos.x, this.pos.y, 25, Math.PI, 0);
  ctx.fill();
};

Missile.prototype.drawMushroomStalk = function (ctx, top) {
  var startY = top + 4;
  var bottomLeft = {x: this.pos.x - 5, y: this.pos.y};
  var topLeft = {x: bottomLeft.x, y: startY};
  var bottomRight = {x: this.pos.x + 5, y: this.pos.y};
  var topRight = {x: bottomRight.x, y: startY};
  // ctx.fillRect(this.pos.x - 5, startY, 10, Math.abs(top - this.pos.y));
  ctx.beginPath();
  ctx.moveTo(bottomLeft.x, bottomLeft.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.bezierCurveTo(topLeft.x, top, topRight.x, top, topRight.x, topRight.y);
  ctx.lineTo(bottomRight.x, bottomRight.y);
  ctx.fill();
};

Missile.prototype.drawMushroomTop = function (ctx) {
  var progressDiff = Math.min(this.explodeProgress * 30 + 5, 15);
  var pointLeft = {x: this.pos.x - progressDiff, y: this.pos.y - progressDiff * 2};
  var pointRight = {x: this.pos.x + progressDiff, y: this.pos.y - progressDiff * 2};
  ctx.beginPath();
  ctx.moveTo(pointLeft.x, pointLeft.y);
  var ctrlLeft = {x: pointLeft.x - 10, y: pointLeft.y - (10 + progressDiff)};
  var ctrlRight = {x: pointRight.x + 10, y: pointRight.y - (10 + progressDiff)};
  ctx.bezierCurveTo(ctrlLeft.x - 10, ctrlLeft.y, ctrlRight.x + 10, ctrlRight.y, pointRight.x, pointRight.y);

  var ctrlLeft2 = {x: pointLeft.x - 3, y: pointLeft.y - 7};
  var ctrlRight2 = {x: pointRight.x + 3 , y: pointRight.y - 7};
  ctx.bezierCurveTo(ctrlLeft2.x, ctrlLeft2.y, ctrlRight2.x, ctrlRight2.y, pointLeft.x, pointLeft.y);
  // ctx.arc(this.pos.x, this.pos.y - this.explodeProgress * 7, this.explodeProgress * 25, Math.PI * 1, 0);
  // ctx.arc(this.pos.x, this.pos.y - this.explodeProgress * 10, this.explodeProgress * 30, Math.PI * 1, 0);
  ctx.fill();
  return pointLeft.y;
};


Missile.prototype.atDest = function () {
  return (this.dest.y < this.pos.y);
};

Missile.prototype.finish = function () {
  this.onFinish(this);
};

Missile.prototype.destroy = function () {
  this.isDestroyed = true;
  this.finish();
};

module.exports = Missile;
