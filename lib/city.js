var City = function (location) {
  this.location = location;
  this.isDestroyed = false;
  this.rubblePoints = [];
};

City.prototype.WIDTH = 40;

City.prototype.HEIGHT = 15;

City.prototype.draw = function (ctx) {
  ctx.fillStyle = "purple";
  if (this.isDestroyed) {
    this.drawRubble(ctx);
  } else {
    ctx.fillRect(this.location.x - this.WIDTH / 2, this.location.y - this.HEIGHT, this.WIDTH, this.HEIGHT);
  }
};

City.prototype.destroy = function () {
  this.isDestroyed = true;
  this.makeRubblePoints();
};

City.prototype.makeRubblePoints = function () {
  if (this.rubblePoints.length === 0){
    for (var i = 0; i < 6; i++) {
      var rX = Math.random() * this.WIDTH + this.location.x;
      var rY = this.location.y - Math.random() * this.HEIGHT;
      this.rubblePoints.push({x: rX, y: rY});
    }
  }
  return this.rubblePoints;
};

City.prototype.drawRubble = function (ctx) {
  ctx.beginPath();
  ctx.moveTo(this.location.x, this.location.y);
  for (var j = 0; j < this.rubblePoints.length; j++) {
    var x = this.rubblePoints[j].x;
    var y = this.rubblePoints[j].y;
    ctx.lineTo(x, y);
    ctx.lineTo(x, this.location.y);
  }
  ctx.fill();
};

module.exports = City;
