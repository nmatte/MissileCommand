var City = function (location) {
  this.location = location;
};

City.prototype.WIDTH = 40;

City.prototype.HEIGHT = 15;

City.prototype.draw = function (ctx) {
  ctx.fillStyle = "purple";
  ctx.fillRect(this.location.x + this.WIDTH / 2, this.location.y - this.HEIGHT, this.WIDTH, this.HEIGHT);
};

module.exports = City;
