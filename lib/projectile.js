var Projectile = function (origin, dest, onFinish) {
  this.origin = origin;
  this.pos = {};
  this.pos["x"] = origin.x;
  this.pos["y"] = origin.y;
  this.dest = dest;
  this.angle = this.getAngle(origin, dest);
  this.isExploding = false;
  this.explodeProgress = 0.0;
  this.onFinish = onFinish;
};

Projectile.prototype.SPEED = 10;

Projectile.prototype.step = function () {
  console.log("this should be overridden");
};

Projectile.prototype.getAngle = function (origin, dest) {
  return Math.atan2(origin.y - dest.y, origin.x - dest.x);
};

Projectile.prototype.draw = function (ctx) {
  console.log("should be overridden");
};

Projectile.prototype.atDest = function () {
  console.log("override atDest");
};

Projectile.prototype.explode = function () {
  this.isExploding = true;
};


Projectile.prototype.angToCartesian = function (angle, magnitude) {
  return {x: magnitude * Math.cos(angle), y: magnitude * Math.sin(angle)};
};

Projectile.prototype.finish = function () {
  this.onFinish(this);
};
module.exports = Projectile;
