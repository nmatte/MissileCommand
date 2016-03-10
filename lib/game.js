var Scud = require('./scud');

var Game = function () {
  this.scuds = [];
  this.xBound = 640;
  this.yBound = 480;
};

Game.prototype.clickAt = function (x, y) {
  console.log("x, y", x, y);
  var origin = {x: this.xBound / 2, y: this.yBound - 30};
  var dest = {x: x, y: y};
  this.scuds.push(new Scud(origin, dest, this.onScudFinish.bind(this)));
};

Game.prototype.onScudFinish = function (scud) {
  console.log(scud);
  this.scuds.splice(this.scuds.indexOf(scud), 1);
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, this.xBound, this.yBound);
  this.drawSky(ctx);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, this.yBound - 30, this.xBound, 30);
  for (var i = 0; i < this.scuds.length; i++) {
    this.scuds[i].draw(ctx);
    this.scuds[i].step();
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
