var Scud = function (origin, dest, onFinish) {
  this.origin = origin;
  this.pos = origin;
  this.dest = dest;
  this.angle = this.getAngle(origin, dest);
  this.isExploding = false;
  this.explodeProgress = 0.0;
  this.onFinish = onFinish;
};

Scud.prototype.SPEED = 10;

Scud.prototype.step = function () {
  if (this.atDest()) {
    this.explode();
  }

  if (this.isExploding) {
    if (this.explodeProgress > 1.0) {
      this.finish();
    } else {
      this.explodeProgress += 0.04;
    }
  } else {
    var stuff = this.angToCartesian(this.angle, this.SPEED);
    this.pos.x -= stuff.x;
    this.pos.y -= stuff.y;
  }
};

Scud.prototype.getAngle = function (origin, dest) {
  return Math.atan2(origin.y - dest.y, origin.x - dest.x);
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
  var max = 50;
  if (progress <= 0.5) {
    return max * progress;
  } else {
    return max * Math.abs(1.0 - progress);
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

Scud.prototype.explode = function () {
  this.isExploding = true;
};


Scud.prototype.angToCartesian = function (angle, magnitude) {
  return {x: magnitude * Math.cos(angle), y: magnitude * Math.sin(angle)};
};

Scud.prototype.finish = function () {
  this.onFinish(this);
};
//
//
// Scud.prototype.extractAngle = function (vector) {
//   var xVel = vector[0];
//   var yVel = vector[1];
//   var angle = Math.atan2(yVel, xVel);
//   if (xVel === 0) {
//     if (yVel > 0) {
//       angle = 1.5 * Math.PI;
//     } else {
//       angle = 0.5 * Math.PI;
//     }
//   }
//   return angle;
// };
//
// Scud.prototype.extractMagnitude = function (vector) {
//     var xVel = vector[0];
//     var yVel = vector[1];
//
//     return Math.hypot(xVel, yVel);
// };
module.exports = Scud;
