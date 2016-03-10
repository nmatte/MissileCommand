function GameView(game, canvas) {
    this.game = game;

    canvas.addEventListener('click', function (event) {
      this.game.clickAt(event.layerX, event.layerY);
    }.bind(this));
    this.ctx = canvas.getContext("2d");
}

GameView.prototype.start = function () {
  var step = function () {
    this.game.draw(this.ctx);
    this.game.step();
    requestAnimationFrame(step);
  }.bind(this);

  requestAnimationFrame(step);
};



module.exports = GameView;
